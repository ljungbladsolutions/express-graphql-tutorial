const { AppBar } = require("@mui/material");
const graphql = require("graphql");

var _ = require("lodash");

const {
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = graphql;

var gameData = [
  { id: "1", name: "Minecraft" },
  { id: "2", name: "Battlefield" },
  { id: "3", name: "Pokemon" },
];

var userData = [
  { id: "1", name: "Christopher" },
  { id: "2", name: "Jakob" },
  { id: "3", name: "Jane" },
];

var scoreData = [
  { id: "1", score: 19, gameId: "1", userId: "1" },
  { id: "2", score: 20, gameId: "1", userId: "2" },
  { id: "3", score: 22, gameId: "1", userId: "3" },
  { id: "4", score: 23, gameId: "2", userId: "1" },
  { id: "5", score: 15, gameId: "2", userId: "2" },
  { id: "6", score: 21, gameId: "2", userId: "3" },
  { id: "7", score: 10, gameId: "3", userId: "1" },
  { id: "8", score: 10, gameId: "3", userId: "2" },
  { id: "9", score: 10, gameId: "3", userId: "1" },
];

const GameType = new GraphQLObjectType({
  name: "Game",
  description: "Game type",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const ScoreType = new GraphQLObjectType({
  name: "ScoreType",
  description: "User score for all games",
  fields: {
    id: { type: GraphQLID },
    score: { type: GraphQLInt },
    gameId: { type: GraphQLID },
    userId: { type: GraphQLID },
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    scores: {
      type: GraphQLList(ScoreType),
      resolve(parent, args) {
        return _.filter(scoreData, { userId: parent.id });
      },
    },
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
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return _.find(userData, { id: args.id });
      },
    },

    score: {
      type: ScoreType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return _.find(scoreData, { id: args.id });
      },
    },
    // userScores: {
    //   type: new GraphQLList(UserScoreType),
    //   resolve(parent, args) {
    //     return userScoreData;
    //   },
    // },
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
