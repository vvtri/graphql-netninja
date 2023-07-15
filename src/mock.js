import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import _db from "./_db.js";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolver.js";
import { GraphQLError } from "graphql";
import { unwrapResolverError } from "@apollo/server/errors";
import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";

const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  rootValue: { testValue: "This is root value" },
  schema: addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    preserveResolvers: true,
  }),
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req, res }) => {
    const token = req.headers.authorization?.split(" ")?.[1];
  },
  listen: { port: 4001 },
});

console.log("server listening at", url);
