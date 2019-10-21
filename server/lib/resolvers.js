/**
 *
 * -----------------------------
 * PART 5 - GraphQL Resolvers layer:
 * -----------------------------
 * The resolverMap object should have a map of resolvers
 * for each relevant GraphQL Object Type
 *
 */
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

const allResolvers = {
  Query: {
    groups: require("./routines/groups"),
    anytimers: require("./routines/anytimers")
  },
  Mutation: {
    createOrUpdateUser: require("./routines/createOrUpdateUser"),
    authenticatePhoneUser: require("./routines/authenticatePhoneUser"),
    createGroup: require("./routines/createGroup"),
    deleteGroup: require("./routines/deleteGroup"),
    setAnytimer: require("./routines/setAnytimer"),
    createSubscription: require("./routines/createSubscription"),
    deleteSubscription: require("./routines/deleteSubscription")
  },

  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      if (value) {
        return value.getTime(); // value sent to the client
      }
      return 0;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  })
};

export default allResolvers;
