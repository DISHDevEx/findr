/**
 * This file sets up an Apollo Server for the SpaceX API. 
 * It imports the necessary dependencies (e.g., express, dotenv, cors, ApolloServer, buildSubgraphSchema, typeDefs, SpaceXAPI, and SpaceXResolvers) and sets up the Apollo Server.
 * It also sets up the data sources for the SpaceX API.
 * Finally, it starts the Apollo Server and listens for requests on port 4001.
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from "./schema.js";
import { SpaceXAPI } from './service.js';
import { SpaceXResolvers } from "./resolver.js";

dotenv.config();

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers:  SpaceXResolvers as any,
  }),
  dataSources: () => ({
    spaceXAPI:  new SpaceXAPI(),
  }),
});

async function startApolloServer() {
  await server.start();

  const app = express();
  // Enable CORS for requests from the Apollo Gateway
  app.use(cors());
  server.applyMiddleware({ app });

  const PORT = 4001;
  app.listen({ port: PORT }, () =>
    console.log(`Apollo Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startApolloServer().catch((err) => console.error('Error starting Apollo server:', err));