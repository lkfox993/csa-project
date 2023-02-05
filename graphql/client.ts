import { ApolloClient, InMemoryCache, from } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: `/graphql`,
  cache: new InMemoryCache(),
});

export default apolloClient;