import '../styles/globals.css'
import 'antd/dist/antd.css'

import { ApolloProvider } from "@apollo/client";
import type { AppProps } from 'next/app'

import apolloClient from '../graphql/client';

function App({ Component, pageProps }: AppProps) {

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default App
