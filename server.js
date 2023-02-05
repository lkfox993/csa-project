
const __DEV__ = process.env.NODE_ENV !== 'production';

require('./src/compose');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const next = require('next');
const { schemaComposer } = require('graphql-compose');
const { ApolloServer } = require('apollo-server-express');
const { connectDatabase } = require('./db');

const app = next({ dev: __DEV__ });
const handle = app.getRequestHandler();

app.prepare().then(async () => {

  await connectDatabase();
  
  const server = express();

  server.set('trust proxy', '127.0.0.1');

  server.use(cors());
  server.use('/graphql', bodyParser.json());

  const apolloServer = new ApolloServer({
    schema: schemaComposer.buildSchema()
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: server });

  server.use(handle);

  server.listen(process.env.PORT || 8000);
  
})