export const resolvers = {
  Query: {
    spacexCapsules: async (_source: any, _args: any, { dataSources }: any) => {
      return dataSources.spaceXAPI.getCapsules();
    },
  },
};
