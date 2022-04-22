const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')

const { MONGODB } = require('./config')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const pubsub = new PubSub()

const PORT = process.env.PORT || 3000
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
})

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('mongodb connected')
    return server.listen({ port: PORT })
  })
  .then((res) => {
    console.log(`your port is runing on ${res.url}`)
  })
  .catch((err) => {
    console.error(err)
  })
