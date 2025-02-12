import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Wallet {
  id: number;
  address: string;
  network: string;
  created_at: string;
  balance?: string;
  last_checked?: string;
}

function App() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
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
      await axios.post('/api/wallets', { address: newAddress, network: selectedNetwork });
      setNewAddress('');
      fetchWallets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add wallet');
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async (walletId: number) => {
    try {
      await axios.get(`/api/wallets/${walletId}/balance`);
      fetchWallets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to check balance');
    }
  };

  const deleteWallet = async (walletId: number) => {
    if (!window.confirm('Are you sure you want to delete this wallet?')) {
      return;
    }

    try {
      await axios.delete(`/api/wallets/${walletId}`);
      fetchWallets();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete wallet');
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
          <div className="form-row">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter wallet address (0x...)"
              className="wallet-input"
            />
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="network-select"
            >
              <option value="ethereum">Ethereum</option>
              <option value="bsc">BSC</option>
            </select>
            <button
              className="add-btn"
              onClick={addWallet}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Wallet'}
            </button>
          </div>
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
                  <div className="wallet-info">
                    {wallet.balance && (
                      <div className="wallet-balance">
                        Balance: {wallet.balance} {wallet.network === 'ethereum' ? 'ETH' : 'BNB'}
                      </div>
                    )}
                    <div className="wallet-added">Added: {new Date(wallet.created_at).toLocaleDateString()}</div>
                    {wallet.last_checked && (
                      <div className="wallet-checked">Last checked: {new Date(wallet.last_checked).toLocaleString()}</div>
                    )}
                  </div>
                  <div className="wallet-actions">
                    <button
                      className="check-balance-btn"
                      onClick={() => checkBalance(wallet.id)}
                    >
                      Check Balance
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteWallet(wallet.id)}
                    >
                      Delete
                    </button>
                  </div>
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