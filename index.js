const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const express = require("express")
const cors = require('cors');

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.SECRET
        );
        return { user };
      } catch (error) {
        console.log(error);
      }
    }
  },
  cors: {origin: '*', credentials: true},
});

const app = express()

app.use(cors({
	origin: true,
	credentials: true,
}));

server.applyMiddleware({
	app,
	path: '/',
	cors: false,
});

app
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => console.log(`listening in ${url}`));
