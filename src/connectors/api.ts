import fs from 'fs';
import https from 'https';
import { RESTDataSource } from 'apollo-datasource-rest';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class SpaceXAPI extends RESTDataSource {
  constructor(baseURL: string) {
    super();
    this.baseURL = baseURL;
  }

  willSendRequest(request: any) {
    request.headers.set('User-Agent', 'Apollo GraphQL Server'); 
    request.agent = new https.Agent({ rejectUnauthorized: false }); 
  }
}