const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    created_at: String
  }

type Expense {
    id: ID!
    name: String!
    amount: Float!
    date: String!
    category: Category!
    user: User!
    month: String!
}

type Category {
    id: ID!
    name: String!
    isCustom: Boolean!
    user: User!
    expenses: [Expense!]!
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
    email: String!
  }

   input ExpenseInput {
    name: String!
    amount: Float!
    date: String!
  }
  
    type DeleteCategoryResponse {
    success: Boolean!
    message: String!
    deletedCategoryId: ID!
  }

  # Queries
  type Query {
    user(id: ID!): User
    getUserProfile(userId: ID!): User
    getCategories(userId: ID!): [Category!]!
    getAllExpensesByUser(userId: ID!): [Expense!]!
    getExpensesByCategory(categoryId: ID!): [Expense!] 
  }

  # Mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    register(userData: UserInput!, password: String!): Auth
    updateUser(id: ID!, userData: UserInput!): User
    addCategory(name: String!, isCustom: Boolean!, userId: ID!): Category!
    editCategory(id: ID!, name: String!): Category
    deleteCategory(id: ID!): DeleteCategoryResponse!
    addExpense(name: String!, amount: Float!, date: String!, categoryId: ID!, userId: ID!): Expense!
    editExpense(id: ID!, userData: ExpenseInput!): Expense
    deleteExpense(id: ID!): Expense
  }
`;

module.exports = typeDefs;
