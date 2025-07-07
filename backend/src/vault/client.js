const axios = require('axios');

class VaultClient {
  constructor() {
    this.vaultAddr = process.env.VAULT_ADDR || 'http://localhost:8200';
    this.vaultToken = process.env.VAULT_TOKEN || 'myroot';
  }

  async storeSecret(path, data) {
    try {
      const response = await axios.put(
        `${this.vaultAddr}/v1/secret/data/${path}`,
        { data },
        {
          headers: {
            'X-Vault-Token': this.vaultToken,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error storing secret:', error.message);
      throw error;
    }
  }

  async getSecret(path) {
    try {
      const response = await axios.get(
        `${this.vaultAddr}/v1/secret/data/${path}`,
        {
          headers: {
            'X-Vault-Token': this.vaultToken
          }
        }
      );
      return response.data.data.data;
    } catch (error) {
      console.error('Error retrieving secret:', error.message);
      throw error;
    }
  }
}

module.exports = VaultClient;
