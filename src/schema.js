export const typeDefs = `#graphql
  enum GameStatus {
    ACTIVE, INACTIVE  
  }

  union SearchResult = Game | Author

  interface MatchScore  {
    point: Float
  } 

  scalar DateField
  scalar JSON

  enum CacheControlScope {
    PUBLIC, PRIVATE
  }

  directive @cacheControl ( maxAge: Int 
    scope: CacheControlScope
    inheritMaxAge: Boolean) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION 

  """
  This is game entity
  """
  type Game @cacheControl(maxAge: 60) {
    """
    This is game id
    """
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
    status: GameStatus
    createdAt: DateField  @deprecated(reason: "Test field")
    structureInfo: JSON @deprecated
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
  
  type Author implements MatchScore {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
    point: Float
  }

  type Query {
    reviews: [Review]
    review(id: ID!): Review
    games: [Game]
    game(id: ID!): Game
    authors: [Author]
    author(id: ID!): Author
    search(q: String): [SearchResult!]
    relevantSearch: [MatchScore!]
    errorQuery(type: String): Game
  }

  type Mutation {
    deleteReview(id: ID!): [Review]
    addGame(input: AddGameInput!): Game
    updateGame(input: UpdateGameInput!) : Game
  }

  input AddGameInput {
    title: String!
    platform: [String!]!
    status: GameStatus!
    createdAt: DateField!
    structureInfo: JSON!
  }

  input UpdateGameInput {
    id: ID!
    title: String
    platform: [String!]
    status: GameStatus!
    createdAt: DateField!
  }
`;
