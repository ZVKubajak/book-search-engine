import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [BookDocument]!
    bookCount: Int!
  }

  type Auth {
    token: ID!
    user: User
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User]!
    user(userId: ID!): User
    me: User
  }

  type Mutation {
    createUser(input: UserInput): Auth
    login(email: String!, password: String!): Auth

    saveBook:(userId: ID!, book: String!): User
    deleteBook(userId: ID!, book: String!): User
  }
`;

export default typeDefs;
