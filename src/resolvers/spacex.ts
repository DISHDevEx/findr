
export const spacexResolver = {
  Query: {
    Missions: (_,_, { dataSources }) => {
      return dataSources.spacexAPI.getMissions();
    },
  },
  Mission:{
    payload: ({ payload_id }, _, { dataSources }) => {
      return dataSources.spacexAPI.getpayload(payload_id);
    }
  }
};
