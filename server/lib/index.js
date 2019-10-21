import express from "express";
import bodyParser from "body-parser";
// ////
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";

import { makeExecutableSchema } from "graphql-tools";
import blocked from "blocked";
import schedule from "node-schedule";
import { ApolloEngine } from "apollo-engine";

import { Debug } from "./import";
import resolvers from "./resolvers";
import { sync } from "./connectors";

const cors = require("cors");

blocked(ms => {
  if (Debug.blocking) {
    console.log("blocked for %sms", ms || 0);
  }
});

/*
 *
 * ---------
 * PART 3) Schema
 * ---------
 * Here I define the graphql SCHEMA.
 *
 * The big difference between the database and the schema is that
 * the schema will be something that anyone has direct access to using a client
 *
 * The schema has the purpose to connect the db to a client, in our case React Native
 *
 * The database can contain stuff that cannot be accessed.
 * The schema shows what values of which table of the db can be accessed by queries
 * And what sort of mutations are callable from the client
 *
 */

const typeDefs = `
scalar Date

type Group {
  id: Int!
  creatorId: String
  name: String
  password: String
  users: [User]
  createdAt: Date 
  updatedAt: Date 
}

type User {
  id: Int!
  auth: String
  groups: [Group]
  phone: String
  name: String
  verified: Bool
  createdAt: Date
  updatedAt: Date
}

type Anytimer {
  id: Int!
  uid1: Int
  uid2: Int
  n: Int
  createdAt: Date
  updatedAt: Date
}

type Subscription {
  id: Int!
  uid: Int
  gid: Int
  createdAt: Date
  updatedAt: Date
}

type Query {
  groups(auth: String!): [Group]
  anytimers(auth: String!): [Anytimer]
}

type Mutation {

  createUser(name: String, phone: String): User
  authenticatePhoneUser(auth: String!): User
  createGroup(auth: String!, name: String): Group
  deleteGroup(auth: String!, gid: Int!): Bool
  
  setAnytimer(auth: String!, uid1: Int, uid2: Int, n: Int): Bool
  
  createSubscription(auth: String!, gid: Int): [Group]
  deleteSubscription(auth: String!, gid: Int): [Group]

}
`;

/*
 *
 * -------------------------
 * 6 - Server Execution layer
 * -------------------------
 *
 */

sync().then(() => {
  // first sync the DB model with the DB file, then make the schema+resolvers executable.
  // otherwise it will maybe request things before initializing.
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  const { PORT } = process.env;

  // Engine maakt alles veel langzamer en heeft weinig nut als ik ook Artillery gebruik.

  // const engineApiKey = "service:apollo:cMih89Hb5DYR0TmU_EtjLw";

  // const engine = new ApolloEngine({
  //   apiKey: engineApiKey
  // });

  const app = express();

  // app.use(engine.expressMiddleware());
  // app.use(compression());

  app.use(cors());

  app.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress({
      schema,
      // context: Model
      tracing: true,
      cacheControl: true
    })
  );

  app.use(
    "/graphiql",
    graphiqlExpress({
      endpointURL: "/graphql"
    })
  );

  app.listen(PORT);
  //engine.listen({ port: PORT, expressApp: app });
  //change back to app.listen(PORT) when disabling Apollo Engine

  console.log(`Listening to ${PORT}, running in ${process.env.NODE_ENV} mode`);
});

/*
 *
 * -------------------------
 * 7 - Cron job layer
 * -------------------------
 *
 * This layer creates some scheduled jobs that will be executed
 *
 */
/**
  *    *    *    *    *    *
  ┬    ┬    ┬    ┬    ┬    ┬
  │    │    │    │    │    │
  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  │    │    │    │    └───── month (1 - 12)
  │    │    │    └────────── day of month (1 - 31)
  │    │    └─────────────── hour (0 - 23)
  │    └──────────────────── minute (0 - 59)
  └───────────────────────── second (0 - 59, OPTIONAL)
  */

schedule.scheduleJob("0 0 * * * *", async () => {
  // clusterUpdate();
}); // every whole hour.

schedule.scheduleJob("0 2 * * *", () => dbBackup()); // 2 am
