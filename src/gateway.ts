import { ApolloGateway, RemoteGraphQLDataSource, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';

// class AuthenticatedDataSource extends RemoteGraphQLDataSource {
//   // If you have custom headers to add for authentication, you can override this method
//   willSendRequest({ request, context }) {
//     // Add headers or authentication tokens here based on the request or context
//   }
// }

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'spacex', url: 'http://localhost:4001/graphql' },
      // ...additional subgraphs...
    ],
  }),
});

const { schema, executor } = await gateway.load();

// Create ApolloServer with the loaded schema and executor
const server = new ApolloServer({
  schema,
  executor,
});

async function startApolloGateway() {
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen({ port: PORT }, () =>
    console.log(`Apollo Gateway ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startApolloGateway().catch((err) => console.error('Error starting Apollo Gateway:', err));