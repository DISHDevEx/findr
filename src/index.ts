import https from 'https';
import express from 'express';
import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs } from "./schemas/spacex.js";
import { resolvers } from "./resolvers/spacex.js";
import { SpaceXAPI } from "./datasources/spacex-api.js";
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Resolve the absolute paths to the certificate files
const privateKeyPath = path.resolve(process.env.CERTIFICATE_DIR, process.env.LOCAL_KEY_FILE);
const certificatePath = path.resolve(process.env.CERTIFICATE_DIR, process.env.LOCAL_CERT_FILE);

// Read the certificate files with the correct encoding
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

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