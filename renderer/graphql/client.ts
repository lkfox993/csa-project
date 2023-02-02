import { ApolloClient, InMemoryCache, from } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3009/graphql',
  cache: new InMemoryCache(),
});

export default apolloClient;