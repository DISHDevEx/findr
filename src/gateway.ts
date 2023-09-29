import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware/index.js';
import { printSchema } from 'graphql';

// Create an Apollo Gateway instance
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'spacex', url: 'http://localhost:4001/graphql' }
    ]
  })
});

// Create an Apollo Server instance
const server = new ApolloServer({
  gateway
});

/**
 * Starts the Apollo Gateway server
 */
async function startApolloGateway() {
  await server.start();

  const app = express();

  // Apply the Apollo Server middleware
  server.applyMiddleware({ app });

  // Add GraphQL Voyager route
  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

  const PORT = 4000;
  app.listen({ port: PORT }, () =>
    console.log(`Apollo Gateway ready at http://localhost:${PORT}`)
  );
}

startApolloGateway().catch((err) => console.error('Error starting Apollo Gateway:', err));
