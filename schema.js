export const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
  }

  type Review {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
    author_id: ID!
    game_id: ID!
  }
  
  type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
  }

  type Query {
    reviews: [Review]
    review(id: ID!): Review
    games: [Game]
    game(id: ID!): Game
    authors: [Author]
    author(id: ID!): Author
  }

  type Mutation {
    deleteReview(id: ID!): [Review]
    addGame(input: AddGameInput!): Game!
    updateGame(input: UpdateGameInput!) : Game
  }

  input AddGameInput {
    title: String!
    platform: [String!]!
  }

  input UpdateGameInput {
    id: ID!
    title: String
    platform: [String!]
  }
`;
