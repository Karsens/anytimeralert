import { ApolloServer } from "apollo-server";
import blocked from "blocked";

import { Debug } from "./import";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { abc } from "./typeDefs";
import { syncDatabase } from "./connectors";

blocked(ms => {
  if (Debug.blocking) {
    console.log("blocked for %sms", ms || 0);
  }
});

syncDatabase().then(() => {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
