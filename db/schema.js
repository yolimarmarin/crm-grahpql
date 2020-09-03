const { gql } = require("apollo-server");

// Schema
const typeDefs = gql`
    type User {
        name: String
        lastName: String
        email: String
        created: String
        id: ID
    }

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    type Query {
        getCourse: String
    }

    type Mutation {
        newUser(input: UserInput) : User
    }
`;

module.exports = typeDefs;