const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
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
});

const app = express();
app.use(cors({ origin: '*' }));

server.applyMiddleware({ app, path:'/' });

app.listen({ port: process.env.PORT || 4000 })


  
