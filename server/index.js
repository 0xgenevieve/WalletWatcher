const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});