import React from 'react';
import './App.css';

function App() {
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
            placeholder="Enter wallet address (0x...)"
            className="wallet-input"
          />
          <button className="add-btn">Add Wallet</button>
        </div>
        <div className="wallet-list">
          <h2>Monitored Wallets</h2>
          <p>No wallets added yet.</p>
        </div>
      </main>
    </div>
  );
}

export default App;