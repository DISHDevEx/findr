import https from 'https';
import { RESTDataSource } from 'apollo-datasource-rest';

/**
 * A class representing a connector to an API.
 */
export class APIConnector extends RESTDataSource {
  /**
   * Creates a new instance of the APIConnector class.
   * @param baseURL The base URL of the API.
   */
  constructor(baseURL: string) {
    super();
    this.baseURL = baseURL;
  }

  /**
   * Sets the User-Agent header and the https agent options for the request.
   * @param request The request object.
   */
  willSendRequest(request: any) {
    request.headers.set('User-Agent', 'Apollo GraphQL Server');
    request.agent = new https.Agent({ rejectUnauthorized: false });
  }
  
  /**
   * Sends a GET request to the specified endpoint.
   * @param endpoint The endpoint to send the request to.
   * @returns A Promise that resolves to the response data.
   */
  async get(endpoint: string) {
    return super.get(endpoint);
  }
}