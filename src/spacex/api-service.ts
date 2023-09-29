import { APIConnector } from '../adapters/api.js';

/**
 * A class representing the SpaceX API.
 */
export class SpaceXAPI extends APIConnector {
  /**
   * Creates a new instance of the SpaceXAPI class.
   */
  constructor() {
    super(process.env.SPACEX_URL);
  }

  /**
   * Gets all capsules from the SpaceX API.
   * @returns A Promise that resolves to the response data.
   */
  async getCapsules() {
    return this.get('capsules');
  }

  /**
   * Gets all launches from the SpaceX API.
   * @returns A Promise that resolves to the response data.
   */
  async getLaunches() {
    return this.get('launches');
  }

  /**
   * Gets all rockets from the SpaceX API.
   * @returns A Promise that resolves to the response data.
   */
  async getRockets() {
    return this.get('rockets');
  }

  /**
   * Gets a capsule by ID from the SpaceX API.
   * @param capsuleId The ID of the capsule to get.
   * @returns A Promise that resolves to the response data.
   */
  async getCapsuleById(capsuleId: string) {
    return this.get(`capsules/${capsuleId}`);
  }

  /**
   * Gets a rocket by ID from the SpaceX API.
   * @param rocketID The ID of the rocket to get.
   * @returns A Promise that resolves to the response data.
   */
  async getRocketById(rocketID: string) {
    return this.get(`rockets/${rocketID}`);
  }
}