const { AppBar } = require("@mui/material");
const graphql = require("graphql");

var _ = require("lodash");

const {
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
} = graphql;

var gameData = [
  { id: "1", name: "Minecraft" },
  { id: "2", name: "Battlefield" },
  { id: "3", name: "Pokemon" },
];

const GameType = new graphql.GraphQLObjectType({
  name: "Game",
  description: "Game type",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    game: {
      type: GameType,
      args: {
        id: { type: GraphQLID },
      },

      resolve(parent, args) {
        return _.find(gameData, { id: args.id });
      },
    },
    games: {
      type: new GraphQLList(GameType),
      resolve(parent, args) {
        return gameData;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createGame: {
      type: GameType,
      args: {
        // id: {type: GraphQLID},
        name: { type: GraphQLString },
      },

      resolve(parent, args) {
        let game = {
          name: args.name,
        };
        return game;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
