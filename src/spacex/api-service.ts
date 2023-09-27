import { API } from "../connectors/api";
import dotenv from 'dotenv';
dotenv.config();

export class SpaceXAPI {

  private api: API;
  
  constructor(api: API) {
    this.api = api;
  }

  async getCapsules() {
    return this.api.get(`capsules`);
  }

  async getLaunches() {
    return this.api.get(`launches`);
  }

  async getRockets() {
    return this.api.get(`rockets`);
  }

  async getCapsuleById(capsuleId: string) {
    return this.api.get(`capsules/${capsuleId}`);
  }

  async getRocketById(rocketID: string) {
    return this.api.get(`rockets/${rocketID}`);
  }
}