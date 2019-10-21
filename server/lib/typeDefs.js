import { gql } from "apollo-server";

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

const typeDefs = gql`
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
    verified: Boolean
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
    createOrUpdateUser(name: String, phone: String): User
    authenticatePhoneUser(auth: String!): User
    createGroup(auth: String!, name: String): Group
    deleteGroup(auth: String!, gid: Int!): Boolean

    setAnytimer(auth: String!, uid1: Int, uid2: Int, n: Int): Boolean

    createSubscription(auth: String!, gid: Int): [Group]
    deleteSubscription(auth: String!, gid: Int): [Group]
  }
`;

export default typeDefs;
