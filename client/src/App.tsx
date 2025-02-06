import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Wallet {
  id: number;
  address: string;
  network: string;
  created_at: string;
  balance?: string;
}

function App() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await axios.get('/api/wallets');
      setWallets(response.data.wallets);
    } catch (err) {
      setError('Failed to fetch wallets');
    }
  };

  const addWallet = async () => {
    if (!newAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/api/wallets', { address: newAddress });
      setNewAddress('');
      fetchWallets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WalletWatcher</h1>
        <p>Monitor your crypto wallets</p>
      </header>
      <main>
        <div className="wallet-form">
          <h2>Add Wallet Address</h2>
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Enter wallet address (0x...)"
            className="wallet-input"
          />
          <button
            className="add-btn"
            onClick={addWallet}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Wallet'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="wallet-list">
          <h2>Monitored Wallets ({wallets.length})</h2>
          {wallets.length === 0 ? (
            <p>No wallets added yet.</p>
          ) : (
            <div className="wallets">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="wallet-item">
                  <div className="wallet-address">{wallet.address}</div>
                  <div className="wallet-network">{wallet.network}</div>
                  <div className="wallet-added">Added: {new Date(wallet.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;