export const resolvers = {
  Query: {
    spacexCapsules: (_,__, { dataSources }) => {
      return dataSources.spacexAPI.getCapsules();
    },
  },
  //Missions: {
  //    payload : ( { payload_id }, _, { dataSources }) => {
  //      return dataSources.spacexAPI.getPayload(payload_id);
  //    },
  //  },
};
