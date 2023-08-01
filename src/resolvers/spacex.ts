export const resolvers = {
  Query: {
    spacexCapsules: async (_source: any, _args: any, { dataSources }: any) => {
      return dataSources.spaceXAPI.getCapsules();
    },

    spacexLaunches: async (_source: any, _args: any, { dataSources }: any) => {
      // Fetch all launches from the SpaceX API
      const launches = await dataSources.spaceXAPI.getLaunches();

      // Fetch capsules for each launch and add them to the 'capsules' field of the launch object
      const launchesWithCapsules = await Promise.all(
        launches.map(async (launch: any) => {
          const capsules = await Promise.all(
            launch.capsules.map(async (capsuleId: string) => {
              return dataSources.spaceXAPI.getCapsuleById(capsuleId);
            })
          );

          return { ...launch, capsules };
        })
      );

      return launchesWithCapsules;
    },
  },
};
