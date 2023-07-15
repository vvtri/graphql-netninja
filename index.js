import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import _db from "./_db.js";
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    reviews: () => _db.reviews,
    review: (_, args) => _db.reviews.find((item) => item.id === args.id),
    games: () => {
      return _db.games;
    },
    game: (_, args) => {
      const result = _db.games.find((item) => item.id === args.id);
      return result;
    },
    authors: () => _db.authors,
    author: (_, args) => _db.authors.find((item) => item.id === args.id),
  },

  Review: {
    game: (parent) => {
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

      for (const item of _db.games) {
        if (Number(item.id) > Number(lastIdx)) lastIdx = item.id;
      }

      let game = {
        ...args.input,
        id: (Number(lastIdx) + 1).toString(),
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

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log("server listening at", url);
