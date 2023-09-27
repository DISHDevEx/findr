// spacex-service.ts
import { SpaceXService } from "./api-service";
import { SpaceXAPI } from "../connectors/api";

export class SpaceXResolver {
  private dataSources: SpaceXAPI;

  constructor(dataSources: SpaceXAPI) {
    this.dataSources = dataSources;
  }

  async getRocketById(rocketId: string) {
    try {
      const rocket = await this.dataSources.getRocketById(rocketId);
      return rocket;
    } catch (error) {
      console.error("Error fetching rocket:", error.message);
      return null;
    }
  }

  async getRockets() {
    try {
      const rockets = await this.dataSources.getRockets();
      return rockets;
    } catch (error) {
      console.error("Error fetching rockets:", error.message);
      return [];
    }
  }

  async getLaunchesWithCapsulesAndRockets() {
    try {
      const launches = await this.dataSources.getLaunches();

      const launchesWithCapsulesAndRockets = await Promise.all(
        launches.map(async (launch: any) => {
          const capsules = await Promise.all(
            launch.capsules.map(async (capsuleId: string) => {
              return this.dataSources.getCapsuleById(capsuleId);
            })
          );

          try {
            const rocketId = launch.rocket;
            const rocket = await this.getRocketById(rocketId);

            return { ...launch, capsules, rocket };
          } catch (error) {
            console.error("Error fetching rocket for launch:", error.message);
            return { ...launch, capsules };
          }
        })
      );

      return launchesWithCapsulesAndRockets;
    } catch (error) {
      console.error("Error fetching launches:", error.message);
    }
  }
}