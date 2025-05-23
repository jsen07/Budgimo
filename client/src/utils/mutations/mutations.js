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
  mutation addMonth(
    $month: String!
    $currency: String!
    $budget: String!
    $userId: ID!
  ) {
    addMonth(
      month: $month
      currency: $currency
      budget: $budget
      userId: $userId
    ) {
      id
      month
      currency
      budget
      balance
    }
  }
`;

export const addExpense = gql`
  mutation addExpense(
    $name: String!
    $currency: String!
    $amount: String!
    $moneyOut: Boolean!
    $date: String!
    $categoryId: ID!
    $userId: ID!
    $monthId: ID!
  ) {
    addExpense(
      name: $name
      currency: $currency
      amount: $amount
      moneyOut: $moneyOut
      date: $date
      categoryId: $categoryId
      userId: $userId
      monthId: $monthId
    ) {
      id
      name
      currency
      rate
      amount
      moneyOut
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
        currency
        budget
        balance
      }
    }
  }
`;

export const addRecurringPayment = gql`
  mutation addRecurringPayment(
    $name: String!
    $amount: String!
    $date: String!
    $frequence: Frequency!
    $userId: ID!
  ) {
    addRecurringPayment(
      name: $name
      amount: $amount
      date: $date
      frequence: $frequence
      userId: $userId
    ) {
      id
      name
      amount
      date
      frequence
      user {
        id
        first_name
        last_name
      }
    }
  }
`;

export const editExpense = gql`
  mutation editExpense($id: ID!, $expenseData: ExpenseInput!) {
    editExpense(id: $id, expenseData: $expenseData) {
      id
      name
      currency
      amount
      moneyOut
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
      moneyOut
      date
      month {
        id
        month
      }
    }
  }
`;
