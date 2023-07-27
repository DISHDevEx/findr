import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs } from "./schemas/spacex.js";
import { resolvers } from "./resolvers/spacex.js";
import { SpaceXAPI } from "./datasources/spacex-api.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    spaceXAPI: new SpaceXAPI(),
  }),
});

async function startApolloServer() {
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen({ port: PORT }, () =>
    console.log(`Apollo Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startApolloServer().catch((err) => console.error('Error starting Apollo server:', err));