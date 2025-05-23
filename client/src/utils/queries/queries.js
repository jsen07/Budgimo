import { gql } from "@apollo/client";

export const getExpensesByCategory = gql`
  query GetExpensesByCategory($categoryId: ID!) {
    getExpensesByCategory(categoryId: $categoryId) {
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
    }
  }
`;

export const getAllExpensesByUser = gql`
  query getAllExpensesByUser($userId: ID!, $limit: Int, $orderBy: String) {
    getAllExpensesByUser(userId: $userId, limit: $limit, orderBy: $orderBy) {
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
      month {
        currency
      }
    }
  }
`;

export const getAllCategoriesByUser = gql`
  query getAllCategoriesByUser($userId: ID!) {
    getAllCategoriesByUser(userId: $userId) {
      id
      name
    }
  }
`;

export const getAllRecurringPayment = gql`
  query getAllRecurringPayment($userId: ID!) {
    getAllRecurringPayment(userId: $userId) {
      id
      name
      amount
      date
      frequence
    }
  }
`;

export const getMonthsByUser = gql`
  query getMonthsByUser($userId: ID!) {
    getMonthsByUser(userId: $userId) {
      id
      month
      currency
      budget
      balance
    }
  }
`;

export const getExpensesByMonth = gql`
  query getExpensesByMonth($monthId: ID!) {
    getExpensesByMonth(monthId: $monthId) {
      id
      month
      currency
      budget
      balance
      expenses {
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
      }
    }
  }
`;

export const getClosestMonth = gql`
  query getClosestMonth($userId: ID!) {
    getClosestMonth(userId: $userId) {
      id
      month
      currency
      budget
      balance
      expenses {
        id
        name
        currency
        rate
        amount
        moneyOut
        date
        category {
          name
        }
      }
    }
  }
`;
