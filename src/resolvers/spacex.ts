export const resolvers = {
  Query: {
    spacexMissions: (_,__, { dataSources }) => {
      return dataSources.spacexAPI.getMissions();
    },
  },
  Missions: {
      payload : ( { payload_id }, _, { dataSources }) => {
        return dataSources.spacexAPI.getPayload(payload_id);
      },
    },
};
