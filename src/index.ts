import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
//import { ApolloServerPluginInlineTrace } from "apollo-server-core";
import { typeDefs } from "./schemas/spacex.js";
import { resolvers } from "./resolvers/spacex.js";
import { SpacexAPI } from "./datasources/spacex-api.js";

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers,
    //plugins: [ApolloServerPluginInlineTrace()],
  })
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
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer()
