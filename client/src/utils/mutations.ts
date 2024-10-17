import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      token
      user {
        _id
        username
      }
    }
  }
`

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        username
      }
    }
  }
`

export const SAVE_BOOK = gql`
  mutation saveBook($userId: ID!, $book: String!) {
    saveBook(userId: $userId, book: $book) {
      _id
      username
      book
    }
  }
`

export const DELETE_BOOK = gql`
  mutation deleteBook($userId: ID!, $book: String!) {
    deleteBook(userId: $userId, book: $book) {
      _id
      username
      book
    }
  }
`
