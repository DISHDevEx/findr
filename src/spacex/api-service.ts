import { SpaceXAPI } from "../connectors/api";


export class SpaceXService {

  public api: SpaceXAPI;
  
  constructor(api: SpaceXAPI) {
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