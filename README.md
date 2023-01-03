## Notes how to create graphql project using express, express-graphql and graphql

Open new project folder

> npm init  
> Press enter using default, this to create package.json

- Create a new folder `server`
- Move `package.json` to `server` folder
- Go to `server` folder and install dependencies
  > npm install express express-graphql graphql --save

### Create app.js

- Create a new file app.js inside `server` folder and enter this in app.js and save:

```
const express = require("express");

const app = express();

app.listen(4000, () => {
    console.log("hello world....");
});
```

To run this:

> node app

## Start using nodemon (update project on save)

> npm install nodemon -g
> nodemon start

## Create a schema

- Create a new folder `schema` inside the `server` foldre and a new `schema.js` file in the `schema` folder

### Create a first type in your schema.

```javascript
const graphql = require("graphql");

const { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

const GameType = new graphql.GraphQLObjectType({
  name: "Game",
  description: "Game type",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});
```

### Create a "root query" to your schema

```javascript
const RootQuery = new graphql.GraphQLInputObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    game: {
      type: GameType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },

      resolve(parents, args) {
        //just return a hardcoded game
        let game = {
          id: 1,
          name: "my game",
        };

        return game;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
```

### Add schema to Application

```javascript
const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

app.listen(4000, () => {
  console.log("hello world....");
});
```

## Query data

- Go to GrapiQL view and run query below:
  http://localhost:4000/graphql

```javascript
query {
  game(id: 1){
    id,
    name
  }
}
```

- This will show the game returned in the query.

- Let's add some more data inside `schema.js`

```javascript
let gameData = [
  { id: 1, name: "Minecraft" },
  { id: 2, name: "Battlefield" },
  { id: 2, name: "Pokemon" },
];
```

- We will use loadash to fetch data easier (lodash.com). So install this first:

  > npm install lodash --save

- Add data (hardcoded) inside `schema.js`

```javascript
var gameData = [
  { id: "1", name: "Minecraft" },
  { id: "2", name: "Battlefield" },
  { id: "3", name: "Pokemon" },
];
```

- Import `lodash`

```javascript
var _ = require("lodash");
```

- Replace return statment inside query with:

```javascript
return _.find(gameData, { id: args.id });
```

- Run query again using different ids to fetch different games:

```javascript
query {
  game(id: 1){
    id,
    name
  }
}
```

http://localhost:4000/graphql

## Add Mutation to add a Game

```javascript
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
```

Note that nothing is stored, we will just create a new Game in memory and return it.

- Go to query view and try:

```
mutation {
  createGame(name: "hello") {
    id,
    name
  }
}
```
