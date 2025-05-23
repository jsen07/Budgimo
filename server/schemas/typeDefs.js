const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    created_at: String
  }

  type Month {
    id: ID!
    month: String!
    currency: String!
    budget: String!
    user: User!
    balance: Float!
    expenses: [Expense!]!
  }

  type Expense {
    id: ID!
    name: String!
    currency: String!
    rate: Float!
    amount: String!
    moneyOut: Boolean!
    date: String!
    category: Category!
    user: User!
    month: Month!
  }

  type Category {
    id: ID!
    name: String!
    isCustom: Boolean!
    user: User
    expenses: [Expense!]!
  }

  type RecurringPayment {
    id: ID!
    name: String!
    amount: String!
    date: String!
    frequence: Frequency!
    user: User!
  }
  enum Frequency {
    Weekly
    Monthly
    Annual
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
    getAllExpensesByUser(userId: ID!, limit: Int, orderBy: String): [Expense!]!
    getAllCategoriesByUser(userId: ID!): [Category!]!
    getExpensesByCategory(categoryId: ID!): [Expense!]
    getMonthsByUser(userId: ID!): [Month!]!
    getExpensesByMonth(monthId: ID!): Month
    getClosestMonth(userId: ID!): Month
    getAllRecurringPayment(userId: ID!): [RecurringPayment!]
  }

  # Mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    register(userData: UserInput!, password: String!): Auth
    updateUser(id: ID!, userData: UserInput!): User
    addMonth(
      month: String!
      currency: String!
      budget: String!
      userId: ID!
    ): Month!
    addCategory(name: String!, isCustom: Boolean!, userId: ID!): Category!
    addRecurringPayment(
      name: String!
      amount: String!
      date: String!
      frequence: Frequency!
      userId: ID!
    ): RecurringPayment
    editCategory(id: ID!, name: String!): Category
    deleteCategory(id: ID!): DeleteCategoryResponse!
    addExpense(
      name: String!
      currency: String!
      amount: String!
      moneyOut: Boolean!
      date: String!
      categoryId: ID!
      userId: ID!
      monthId: ID!
    ): Expense!
    editExpense(id: ID!, userData: ExpenseInput!): Expense
    deleteExpense(id: ID!): Expense
  }
`;

module.exports = typeDefs;
