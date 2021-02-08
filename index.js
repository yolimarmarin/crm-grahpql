const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const connectDB =  require('./config/db');
const jwt = require('jsonwebtoken')
require("dotenv").config({ path: "variables.env" });

connectDB();

//Server

const server = new ApolloServer({ typeDefs, resolvers, context : ({req}) => {
    const token = req.headers['authorization'] || '';
    if(token){
        try{
            const user = jwt.verify(token.replace('Bearer ', ''),process.env.SECRET)
            return {user}
        }catch(error){
            console.log(error)
        }
    }
}, cors: {origin:'*'} });

server.listen({port: process.env.PORT || 4000}).then(({ url }) => console.log(`listening in ${url}`));
