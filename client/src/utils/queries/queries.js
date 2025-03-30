import { gql } from '@apollo/client';

export const getExpensesByCategory = gql`
    query GetExpensesByCategory($categoryId: ID!) {
        getExpensesByCategory(categoryId: $categoryId) {
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
            username
        }
    }
}`

export const getAllExpensesByUser = gql`
    query getAllExpensesByUser($userId: ID!) {
        getAllExpensesByUser(userId: $userId) {
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
`