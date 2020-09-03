const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const connectDB =  require('./config/db');

connectDB();

//Server

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`listening in ${url}`));
