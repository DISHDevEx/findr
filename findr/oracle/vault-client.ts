/**
 * VaultClient Class
 *
 * The `VaultClient` class is a TypeScript implementation for interacting with HashiCorp Vault.
 * It provides methods for authentication, reading secrets, and writing secrets.
 */
import axios, { type AxiosResponse } from 'axios'

/**
 * Class representing a client for interacting with HashiCorp Vault.
 */
class VaultClient {
  /**
   * The base URL of the HashiCorp Vault instance.
   * @private
   */
  private readonly vaultUrl: string

  /**
   * The authentication token for the Vault instance.
   * @private
   */
  private token: string | null = null

  /**
   * Creates an instance of `VaultClient`.
   * @param vaultUrl - The base URL of the HashiCorp Vault instance.
   */
  constructor (vaultUrl: string) {
    this.vaultUrl = vaultUrl
  }

  /**
   * Encodes special characters in a given input string.
   * @private
   * @param input - The input string to be encoded.
   * @returns The encoded string.
   */
  private encodeSpecialCharacters (input: string): string {
    return encodeURIComponent(input)
  }

  /**
   * Authenticates the client with the provided token.
   * @param token - The authentication token.
   * @throws {Error} - If the client is not authenticated.
   */
  async authenticate (token: string): Promise<void> {
    this.token = token
  }

  /**
   * Reads secrets from a specified path.
   * @param path - The path to the secret.
   * @returns A Promise resolving to the secret data.
   * @throws {Error} - If the client is not authenticated.
   */
  async readSecret (path: string): Promise<any> {
    if (this.token === null || this.token === undefined) {
      throw new Error('Client is not authenticated')
    }

    const encodedPath = this.encodeSpecialCharacters(path)

    const response: AxiosResponse = await axios.get(`${this.vaultUrl}/v1/cubbyhole/${encodedPath}`, {
      headers: { 'X-Vault-Token': this.token, accept: '*/*' }
    })

    return response.data.data
  }

  /**
   * Writes secrets to a specified path.
   * @param path - The path to write the secret.
   * @param secretData - The data to be written as the secret.
   * @throws {Error} - If the client is not authenticated.
   */
  async writeSecret (path: string, secretData: any): Promise<void> {
    if (this.token === null || this.token === undefined) {
      throw new Error('Client is not authenticated')
    }

    const encodedPath = this.encodeSpecialCharacters(path)

    await axios.post(`${this.vaultUrl}/v1/cubbyhole/${encodedPath}`, secretData, {
      headers: { 'X-Vault-Token': this.token, 'Content-Type': 'application/json', accept: '*/*' }
    })
  }
}

export default VaultClient