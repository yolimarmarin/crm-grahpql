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

    type Token {
        token:  String
    }

    type Product {
        name: String
        exist: Int
        price: Float
        created: String
        id: ID
    }

    type Client {
        name:String
        lastName: String
        company: String
        email: String
        phone: String
        id: ID
        salesman: ID
    }

    type Order {
        id: ID
        order:  [OrderGroup]
        total: Float
        client: ID
        salesman: ID
        state: OrderState
        created: String
    }

    type OrderGroup {
        id: ID
        quantity: Int
    }

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        exist: Int!
        price: Float!
    }

    input ClientInput {
        name:String!
        lastName: String!
        company: String!
        email: String!
        phone: String
    }

    input ProductOrderInput {
        id: ID
        quantity: Int
    }

    input OrderInput {
        order:  [ProductOrderInput]
        total: Float!
        client: ID!
        state: OrderState
    }

    enum OrderState {
        pending
        completed
        canceled
    }

    type Query {
        # Users
        getUser(token: String!): User

        # Products
        getProducts: [Product]
        getProductById(id: ID!): Product

        # Clients
        getClients: [Client]
        getClientsBySalesman: [Client]
        getClientById(id: ID!): Client
    }

    type Mutation {
        #Users
        newUser(input: UserInput) : User
        authUser(input: AuthInput): Token

        #Products
        newProduct(input: ProductInput) : Product
        updateProductById(id: ID!, input: ProductInput): Product
        deleteProductById(id: ID!) : String

        #Clients
        newClient(input: ClientInput) : Client
        updateClientById(id: ID!, input: ClientInput): Client
        deleteClientById(id: ID!) : String

        #Orders
        newOrder(input: OrderInput): Order

    }
`;

module.exports = typeDefs;