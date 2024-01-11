import axios, { type AxiosResponse } from 'axios'

/**
 * OrchestratorApiClient is a class for interacting with the orchestrator API.
 * It provides methods to send requests and log responses or errors.
 */
class OrchestratorApiClient {
  /**
   * Sends a request to the orchestrator API with the provided parameters.
   * Logs the response or error details.
   * @param {string} orchestratorUrl - The URL of the orchestrator API.
   * @param {object} messageToSent - The message to send in the request.
   * @returns {Promise<any>} A promise representing the orchestrator API response.
   */
  public sendOrchestratorRequest = async (orchestratorUrl: string, messageToSent: object): Promise<any> => {
    try {
      console.log('orchestratorUrl',orchestratorUrl)
      console.log('messageToSent', messageToSent)
      const response: AxiosResponse = await axios.post(orchestratorUrl, messageToSent)
      console.log('Orchestrator Response Status: ', response.status)
      return response.status
    } catch (error: any) {
      console.error('Error sending data:', error.message)
      if (error.response !== null && error.response !== undefined) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      } else if (error.request != null && error.request !== undefined) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error details:', error.message)
      }
    }
  }
}

export default OrchestratorApiClient