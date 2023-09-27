import https from 'https';
import { RESTDataSource } from 'apollo-datasource-rest';

export class APIConnector extends RESTDataSource {
  constructor(baseURL: string) {
    super();
    this.baseURL = baseURL;
  }

  willSendRequest(request: any) {
    request.headers.set('User-Agent', 'Apollo GraphQL Server');
    request.agent = new https.Agent({ rejectUnauthorized: false });
  }
  
  async get(endpoint: string) {
    return super.get(endpoint);
  }
}