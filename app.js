const express = require('express');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema/schema');
const resolvers = require('./schema/resolvers');
const router = require('./routers/router')

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static('/'));
app.use('/', router);

app.listen(port, function () {
    console.log('App is listening on port 8080.')
    console.log('To get all the data currently stored in the database, go to http://localhost:8080/all.')
    console.log('To upload data into the database, go to http://localhost:8080/upload.')
})

const server = new ApolloServer({typeDefs, resolvers});
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready to accept GraphQL requests at ${url}.`);
});