import fs from 'fs';
import https from 'https';
import { RESTDataSource } from 'apollo-datasource-rest';

const certificateFilePath = 'openssl/spacex.pem'; // Replace with the actual path to your certificate file

export class SpaceXAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v4/';
  }

  willSendRequest(request: any) {
    request.headers.set('User-Agent', 'Apollo GraphQL Server'); // Add a custom User-Agent header if needed
    //request.agent = new https.Agent({ ca: fs.readFileSync(certificateFilePath) }); // Set the custom agent
    request.agent = new https.Agent({ rejectUnauthorized: false }); //
  }

  async getCapsules() {
    return this.get('capsules');
  }
}