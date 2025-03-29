import { gql } from '@apollo/client';

export const registerMutation = gql`
  mutation Register($userData: userInput!, $password: String!) {
    register(userData: $userData, password: $password) {
      token
      user {
        _id
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
        _id
        email
        first_name
        last_name
        username
      }
    }
  }
`;