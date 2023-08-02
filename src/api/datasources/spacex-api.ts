import fs from 'fs';
import https from 'https';
import { RESTDataSource } from 'apollo-datasource-rest';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Read the certificate files with the correct encoding
const spacexCertFilePath = path.resolve(process.env.CERTIFICATE_DIR, process.env.SPACEX_CERT_FILE);
console.log('cert path' + spacexCertFilePath)

const spacexCert = fs.readFileSync(spacexCertFilePath, 'utf8');
//console.log('cert' + spacexCert)

export class SpaceXAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v4/';
  }

  willSendRequest(request: any) {
    request.headers.set('User-Agent', 'Apollo GraphQL Server'); // Add a custom User-Agent header if needed
    request.agent = new https.Agent({ ca: spacexCert }); // Set the custom agent
    //request.agent = new https.Agent({ rejectUnauthorized: false }); //SSL disabled
  }

  async getCapsules() {
    return this.get('capsules');
  }

  async getLaunches() {
    return this.get('launches');
  }

  async getCapsuleById(capsuleId: string) {
    return this.get(`capsules/${capsuleId}`);
  }
}