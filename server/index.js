const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const blockchainService = require('./blockchain');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/wallets', (req, res) => {
  db.all('SELECT * FROM wallets ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ wallets: rows });
  });
});

app.post('/api/wallets', (req, res) => {
  const { address, network = 'ethereum' } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  if (!address.startsWith('0x') || address.length !== 42) {
    return res.status(400).json({ error: 'Invalid Ethereum address format' });
  }

  const stmt = db.prepare('INSERT INTO wallets (address, network) VALUES (?, ?)');
  stmt.run([address.toLowerCase(), network], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Wallet already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      success: true,
      message: 'Wallet added successfully',
      address: address,
      id: this.lastID
    });
  });
  stmt.finalize();
});

app.get('/api/wallets/:id/balance', async (req, res) => {
  const walletId = req.params.id;

  db.get('SELECT * FROM wallets WHERE id = ?', [walletId], async (err, wallet) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    try {
      const balanceData = await blockchainService.getBalance(wallet.address, wallet.network);

      const stmt = db.prepare('UPDATE wallets SET balance = ?, last_checked = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run([balanceData.balance, walletId]);
      stmt.finalize();

      res.json({
        wallet_id: walletId,
        address: wallet.address,
        network: wallet.network,
        ...balanceData
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

app.delete('/api/wallets/:id', (req, res) => {
  const walletId = req.params.id;

  db.run('DELETE FROM wallets WHERE id = ?', [walletId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ success: true, message: 'Wallet deleted successfully' });
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});