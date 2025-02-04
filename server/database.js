const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../wallets.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  const createWalletsTable = `
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT UNIQUE NOT NULL,
      network TEXT NOT NULL DEFAULT 'ethereum',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_checked DATETIME,
      balance TEXT
    )
  `;

  const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_id INTEGER,
      hash TEXT UNIQUE NOT NULL,
      from_address TEXT,
      to_address TEXT,
      value TEXT,
      timestamp DATETIME,
      FOREIGN KEY (wallet_id) REFERENCES wallets (id)
    )
  `;

  db.run(createWalletsTable);
  db.run(createTransactionsTable);
}

module.exports = db;