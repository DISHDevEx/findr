/**
 * This class defines the resolvers for the SpaceX API.
 * The `getRocketById` resolver fetches the rocket information for a given launch.
 * The `getCapsules` resolver provides a function to fetch capsules from the SpaceX API.
 * The `getRockets` resolver provides a function to fetch rockets from the SpaceX API.
 * The `getLaunches` resolver provides a function to fetch launches from the SpaceX API, along with their associated capsules and rockets.
 */
/**
 * This file contains the SpaceXResolvers object which defines the resolvers for the SpaceX API.
 * The Launch resolver fetches the rocket information for a given launch.
 * The Query resolver provides functions to fetch capsules, rockets, and launches from the SpaceX API.
 * @packageDocumentation
 */

export class SpaceXResolvers {
  async getRocketById(launch: any, _args: any, { dataSources }: any) {
    try {
      const rocketId = launch.rocket.id;
      //console.log("Fetching rocket with ID:", rocketId);
      const rocket = await dataSources.spaceXAPI.getRocketById(rocketId);
      //console.log("Fetched rocket:", rocket);
      return rocket;
    } catch (error) {
      // Handle the "404: Not Found" error by returning null or an appropriate response
      console.error("Error fetching rocket:", error.message);
      return null;
    }
  }

  async getCapsules(_source: any, _args: any, { dataSources }: any) {
    return dataSources.spaceXAPI.getCapsules();
  }

  async getRockets(_source: any, _args: any, { dataSources }: any) {
    try {
      const rockets = await dataSources.spaceXAPI.getRockets();
      return rockets;
    } catch (error) {
      // Handle the "404: Not Found" error by returning an empty array or an appropriate response
      console.error("Error fetching rockets:", error.message);
      return [];
    }
  }

  async getLaunches(_source: any, _args: any, { dataSources }: any) {
    try {
      const launches = await dataSources.spaceXAPI.getLaunches();

      const launchesWithCapsulesAndRockets = await Promise.all(
        launches.map(async (launch: any) => {
          const capsules = await Promise.all(
            launch.capsules.map(async (capsuleId: string) => {
              return dataSources.spaceXAPI.getCapsuleById(capsuleId);
            })
          );

          try {
            const rocketId = launch.rocket;
            const rocket = await dataSources.spaceXAPI.getRocketById(rocketId);

            return { ...launch, capsules, rocket };
          } catch (error) {
            console.error("Error fetching rocket for launch:", error.message);
            return { ...launch, capsules };
          }
        })
      );

      return launchesWithCapsulesAndRockets;
    } catch (error) {
      // Handle other errors that may occur during launch data retrieval
      console.error("Error fetching launches:", error.message);
      return [];
    }
  }
}
