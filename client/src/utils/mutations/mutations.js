import { gql } from '@apollo/client';

export const registerMutation = gql`
  mutation Register($userData: userInput!, $password: String!) {
    register(userData: $userData, password: $password) {
      token
      user {
        id
        first_name
        last_name
        username
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
        username
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

export const addExpense = gql`
  mutation addExpense($name: String!, $amount: Float!, $date: String!, $categoryId: ID!, $userId: ID!) {
    addExpense(name: $name, amount: $amount, date: $date, categoryId: $categoryId, userId: $userId) {
      id
      name
      amount
      date
      category {
        id
        name
      }
    }
  }
`;


export const editExpense = gql`
  mutation editExpense($id: ID!, $userData: ExpenseInput!) {
    editExpense(id: $id, userData: $userData) {
      id
      name
      amount
      date
      month
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
      month
    }
  }
`;