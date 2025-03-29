const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    created_at: String
  }

  # Authorization type
  type Auth {
    token: ID!
    user: User
  }

  # User Input
  input UserInput {
    first_name: String!
    last_name: String!
    username: String!
    email: String!
  }

  # Queries
  type Query {
    user(id: ID!): User
    getUserProfile(userId: ID!): User
  }

  # Mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    register(userData: UserInput!, password: String!): Auth
    updateUser(id: ID!, userData: UserInput!): User
  }
`;

module.exports = typeDefs;
