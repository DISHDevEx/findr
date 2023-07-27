import https from 'https';
import express from 'express';
import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs } from "./schemas/spacex.js";
import { resolvers } from "./resolvers/spacex.js";
import { SpaceXAPI } from "./datasources/spacex-api.js";

// Import the self-signed certificate files
const privateKey = fs.readFileSync('openssl/key.pem', 'utf8');
const certificate = fs.readFileSync('openssl/cert.pem', 'utf8');

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
  
  // Create the HTTPS server with self-signed certificates
  const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

  server.applyMiddleware({ app });

  const PORT = 3000;
  httpsServer.listen(PORT, () => {
    console.log(`Apollo Server ready at https://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch((err) => console.error('Error starting Apollo server:', err));