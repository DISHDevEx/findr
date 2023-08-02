import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  // If you have custom headers to add for authentication, you can override this method
  willSendRequest({ request, context }) {
    // Add headers or authentication tokens here based on the request or context
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    // Add the URLs for all your federated services here
    { name: 'spaceX', url: 'http://localhost:4001/graphql' },
    // Add more services as needed
  ],
  buildService: ({ url }) => new AuthenticatedDataSource({ url }),
});

const { schema, executor } = await gateway.load();

// Create ApolloServer with the loaded schema and executor
const { ApolloServer } = require('apollo-server-express'); // Use require for ApolloServer
const server = new ApolloServer({
  schema,
  executor,
});

// Start Apollo Gateway using the 'start' method
server.start().then(({ url }) => {
  console.log(`🚀 Apollo Gateway ready at ${url}`);
});
