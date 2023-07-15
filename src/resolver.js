import { getDirectiveValues, GraphQLScalarType } from "graphql";
import _db from "./_db.js";
import GraphQLJSON from "graphql-type-json";
import { GraphQLError } from "graphql";

const dateFieldScalar = new GraphQLScalarType({
  name: "DateField",
  description: "Custom Scalar Date",
  serialize: (value) => {
    if (value instanceof Date) return value.toISOString();
    console.log("value", value);
    throw Error("GraphQL DateField Scalar serializer expected a `Date` object");
  },
  parseValue: (value) => {
    if (typeof value === "string") return new Date(value);
    throw Error("GraphQL DateField Scalar parseValue expected a `string`");
  },
  parseLiteral: (value) => {
    if (typeof value === "string") return new Date(value);
    throw Error("GraphQL DateField Scalar parseValue expected a `string`");
  },
});

export const resolvers = {
  DateField: dateFieldScalar,
  JSON: GraphQLJSON,

  GameStatus: {
    ACTIVE: 1,
    INACTIVE: 0,
  },

  SearchResult: {
    __resolveType(obj, ctx, info) {
      console.log("obj.verified", obj.verified);
      console.log("obj.platform", obj.platform);
      console.log("obj", obj);
      if (obj.verified != undefined) return "Author";
      if (obj.platform != undefined) return "Game";
      return null;
    },
  },

  MatchScore: {
    __resolveType(obj, ctx, info) {
      return "Author";
    },
  },

  Query: {
    reviews: () => _db.reviews,
    review: (_, args) => _db.reviews.find((item) => item.id === args.id),
    games: (_, _2, _3, _4) => {
      // console.log('_', _)
      // console.log('_2', _2)
      // console.log('_3', _3)
      // console.log('_4', _4)
      console.log("get");
      return _db.games;
    },
    game: (_, args) => {
      const result = _db.games.find((item) => item.id === args.id);
      console.log("result", result);
      return result;
    },
    authors: () => _db.authors,
    author: (_, args) => _db.authors.find((item) => item.id === args.id),
    search: (_, args) => {
      const { q } = args;
      const result = _db.games;
      result.push(..._db.authors);
      console.log("result", result);
      return result;
    },
    relevantSearch: () => {
      const result = _db.authors.map((item) => ({
        ...item,
        point: Math.random() * 10,
      }));
      return result;
    },
    errorQuery: (_, args) => {
      if (args.type === "Graph") {
        throw new GraphQLError("Invalid token", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      } else {
        throw new Error("Test error");
      }
    },
  },

  Review: {
    game: (parent, args, context) => {
      console.log("context", context);

      if (!context.isAuth) throw new GraphQLError("unauthorized");
      return _db.games.find((item) => item.id === parent.game_id);
    },
    author: (parent) => {
      return _db.authors.find((item) => item.id === parent.author_id);
    },
  },

  Game: {
    reviews: (parent) => {
      return _db.reviews.filter((item) => item.game_id === parent.id);
    },
  },

  Author: {
    reviews: (parent) => {
      return _db.reviews.filter((item) => item.author_id === parent.id);
    },
  },

  Mutation: {
    deleteReview: (_, args) => {
      _db.reviews = _db.reviews.filter((item) => item.id !== args.id);
      return _db.reviews;
    },
    addGame: (_, args) => {
      let lastIdx = "0";

      if (args.input.createdAt > new Date())
        throw new Error("Can not create future game");

      for (const item of _db.games) {
        if (Number(item.id) > Number(lastIdx)) lastIdx = item.id;
      }

      let game = {
        ...args.input,
        id: Number(lastIdx) + 1,
      };

      _db.games.push(game);
      return game;
    },
    updateGame: (_, args) => {
      let game = _db.games.find((item) => item.id === args.input.id);
      game = { ...args.input };

      _db.games.push(game);
    },
  },
};
