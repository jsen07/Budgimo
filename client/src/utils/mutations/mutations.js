import { gql } from "@apollo/client";

export const registerMutation = gql`
  mutation Register($userData: UserInput!, $password: String!) {
    register(userData: $userData, password: $password) {
      token
      user {
        id
        first_name
        last_name
        email
      }
    }
  }
`;

export const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        first_name
        last_name
      }
    }
  }
`;

export const addCategory = gql`
  mutation addCategory($name: String!, $isCustom: Boolean!, $userId: ID!) {
    addCategory(name: $name, isCustom: $isCustom, userId: $userId) {
      id
      name
      isCustom
    }
  }
`;

export const editCategory = gql`
  mutation editCategory($id: ID!, $name: String!) {
    editCategory(id: $id, name: $name) {
      id
      name
      isCustom
    }
  }
`;

export const deleteCategory = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
      message
      deletedCategoryId
    }
  }
`;

export const addMonth = gql`
  mutation addMonth($month: String!, $budget: Float!, $userId: ID!) {
    addMonth(month: $month, budget: $budget, userId: $userId) {
      id
      month
      budget
      balance
    }
  }
`;

export const addExpense = gql`
  mutation addExpense(
    $name: String!
    $amount: String!
    $date: String!
    $categoryId: ID!
    $userId: ID!
    $monthId: ID!
  ) {
    addExpense(
      name: $name
      amount: $amount
      date: $date
      categoryId: $categoryId
      userId: $userId
      monthId: $monthId
    ) {
      id
      name
      amount
      date
      category {
        id
        name
      }
      user {
        id
        first_name
        last_name
      }
      month {
        id
        month
        budget
        balance
      }
    }
  }
`;

export const editExpense = gql`
  mutation editExpense($id: ID!, $expenseData: ExpenseInput!) {
    editExpense(id: $id, expenseData: $expenseData) {
      id
      name
      amount
      date
      month {
        id
        month
      }
    }
  }
`;

export const deleteExpense = gql`
  mutation deleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      id
      name
      amount
      date
      month {
        id
        month
      }
    }
  }
`;
