const axios = require('axios');

class BlockchainService {
  constructor() {
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    this.bscscanApiKey = process.env.BSCSCAN_API_KEY;
  }

  async getEthBalance(address) {
    try {
      const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${this.etherscanApiKey}`;
      const response = await axios.get(url);

      if (response.data.status === '1') {
        const balanceWei = response.data.result;
        const balanceEth = (parseInt(balanceWei) / Math.pow(10, 18)).toFixed(6);
        return { balance: balanceEth, currency: 'ETH' };
      }
      throw new Error('Failed to fetch balance');
    } catch (error) {
      console.error('Error fetching ETH balance:', error.message);
      return { balance: '0', currency: 'ETH', error: error.message };
    }
  }

  async getBscBalance(address) {
    try {
      const url = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${this.bscscanApiKey}`;
      const response = await axios.get(url);

      if (response.data.status === '1') {
        const balanceWei = response.data.result;
        const balanceBnb = (parseInt(balanceWei) / Math.pow(10, 18)).toFixed(6);
        return { balance: balanceBnb, currency: 'BNB' };
      }
      throw new Error('Failed to fetch balance');
    } catch (error) {
      console.error('Error fetching BNB balance:', error.message);
      return { balance: '0', currency: 'BNB', error: error.message };
    }
  }

  async getBalance(address, network = 'ethereum') {
    switch (network.toLowerCase()) {
      case 'ethereum':
        return await this.getEthBalance(address);
      case 'bsc':
        return await this.getBscBalance(address);
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }
}

module.exports = new BlockchainService();