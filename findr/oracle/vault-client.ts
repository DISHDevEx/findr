import axios from 'axios';

class VaultClient {
  private vaultUrl: string;
  private token: string | null = null;

  constructor(vaultUrl: string) {
    this.vaultUrl = vaultUrl;
  }

  async authenticate(token: string): Promise<void> {
    this.token = token;
  }

  async readSecret(path: string): Promise<any> {
    if (!this.token) {
      throw new Error('Client is not authenticated');
    }

    const response = await axios.get(`${this.vaultUrl}/v1/${path}`, {
      headers: { 'X-Vault-Token': this.token }
    });

    return response.data.data;
  }

  async writeSecret(path: string, secretData: any): Promise<void> {
    if (!this.token) {
      throw new Error('Client is not authenticated');
    }

    await axios.post(`${this.vaultUrl}/v1/${path}`, secretData, {
      headers: { 'X-Vault-Token': this.token }
    });
  }
}

export default VaultClient;