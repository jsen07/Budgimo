import { gql } from "@apollo/client";

export const getExpensesByCategory = gql`
  query GetExpensesByCategory($categoryId: ID!) {
    getExpensesByCategory(categoryId: $categoryId) {
      id
      name
      amount
      date
      month
      category {
        id
        name
      }
      user {
        id
        first_name
        last_name
      }
      month
    }
  }
`;

export const getAllExpensesByUser = gql`
  query getAllExpensesByUser($userId: ID!, $limit: Int, $orderBy: String) {
    getAllExpensesByUser(userId: $userId, limit: $limit, orderBy: $orderBy) {
      id
      name
      amount
      date
      month
      category {
        id
        name
      }
    }
  }
`;
