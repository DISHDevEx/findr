import { APIConnector } from '../connectors/api.js';
import { DataSource } from 'apollo-datasource';


export class SpaceXAPI extends DataSource {

  private apiConnector: APIConnector;

  constructor() {
    super();
    this.apiConnector = new APIConnector(process.env.SPACEX_URL);
  }

  async getCapsules() {
    return this.apiConnector.get('capsules');
  }

  async getLaunches() {
    return this.apiConnector.get('launches');
  }

  async getRockets() {
    return this.apiConnector.get('rockets');
  }

  async getCapsuleById(capsuleId: string) {
    return this.apiConnector.get(`capsules/${capsuleId}`);
  }

  async getRocketById(rocketID: string) {
    return this.apiConnector.get(`rockets/${rocketID}`);
  }
}