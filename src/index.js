import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import _db from "./_db.js";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolver.js";
import { GraphQLError } from "graphql";
import { unwrapResolverError } from "@apollo/server/errors";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import responseCachePlugin from "@apollo/server-plugin-response-cache";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  rootValue: { testValue: "This is root value" },
  plugins: [
    {
      requestDidStart: async ({ contextValue }) => {
        // console.log("contextValue", contextValue);
      },
    },

    // ApolloServerPluginUsageReporting({
    //   sendErrors: {
    //     transform: (err) => {
    //       if (err.extensions.code === "UNAUTHENTICATED") return null;

    //       return err;
    //     },
    //   },
    // }),

    // ApolloServerPluginLandingPageProductionDefault({ embed: true,document:'asda', }),

    // custom landing page
    // {
    //   serverWillStart: async (ctx) => {
    //     return {
    //       renderLandingPage() {
    //         return { html: "asdsam" };
    //       },
    //     };
    //   },
    // },

    // ApolloServerPluginLandingPageDisabled()

    // responseCachePlugin({}),
  ],
  formatError: (jsonError, rawError) => {
    // console.log("jsonError", jsonError);
    // console.log("rawError", rawError);

    if (rawError instanceof GraphQLError) {
      const orgError = unwrapResolverError(rawError);
      console.log("orgError", orgError);
      return { message: "Internal server error" };
    }

    // return jsonError
  },
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req, res }) => {
    const token = req.headers.authorization?.split(" ")?.[1];
    console.log("token", token);
    if (token === "123456") return { isAuth: true };
    else return { isAuth: false };

    // if (token !== "123456")
    //   throw new GraphQLError("Invalid token", {
    //     extensions: {
    //       code: "UNAUTHENTICATED",
    //       http: {
    //         status: 401,
    //         headers: new Map([
    //           ["some-header", "it was bad"],
    //           ["another-header", "seriously"],
    //         ]),
    //       },
    //     },
    //   });
  },
  listen: { port: 4000 },
});

console.log("server listening at", url);
