import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { spacexSchema } from "./schemas/spacex.js";
import { spacexResolver } from "./resolvers/spacex.js";
import { SpacexAPI } from "./datasources/spacex-api.js";

async function startApolloServer() {
  const server = new ApolloServer({ spacexSchema, spacexResolver })
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      return {
        dataSources: {
          spacexAPI: new SpacexAPI({ cache })
        }
      }
    }
  });
  console.log(`
      🚀  Server is running
      📭  Query at ${url}
    `);
}
startApolloServer();
