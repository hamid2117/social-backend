const { gql } = require('apollo-server-core')

module.exports = gql`
  # type to describe schema
  type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]
    likes: [Like]
    likeCount: Int!
    commentCount: Int!
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]
    getPost(idpost: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User
    login(username: String!, password: String!): User
    createPost(cBody: String!): Post!
    deletePost(delId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    # we seeing postId cuz to see is post  still not deleted.
    deleteComment(delId: ID!, commentId: ID!): Post!
    LikePost(postId: ID!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`
