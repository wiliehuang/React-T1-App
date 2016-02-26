import { GraphQLSchema,
          GraphQLObjectType,
          GraphQLList,
          GraphQLInt,
          GraphQLString,
          GraphQLNonNull,
          GraphQLID
        } from 'graphql';

import {
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray
} from "graphql-relay";



// let test1 = {
//   name: 'Query',
//   fields() {
//     return {
//     counter: {
//       type: GraphQLInt,
//       resolve: () => 501
//     }
//    }
//   }
// };
let data = [
    {counter: 10},
    {counter: 20},
    {counter: 30}
  ];

//let counter = 42;
let Schema = (db) => {

  let store = {};

  let storeType = new GraphQLObjectType({
      name: 'Store',
      fields: () => ({
        linkConnection: {
          type: linkConnection.connectionType,
          args: connectionArgs,
          resolve: (_, args) => connectionFromPromisedArray(
          db.collection("links").find({}).toArray(),
          args
        )
        }
      })
    });

let linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    // _id: { type: GraphQLString },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => obj._id
    },
    title: { type: GraphQLString },
    url: { type: GraphQLString }
  })
});

let linkConnection = connectionDefinitions({
  name: 'Link',
  nodeType: linkType
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      // counter: {
      //   type: GraphQLInt,
      //   resolve: () => counter
      // },
      store: {
        type: storeType,
        resolve: () => store
      }

    })
  })//,
  // mutation: new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: () => ({
  //     incrementCounter: {
  //       type: GraphQLInt,
  //       resolve: () => ++counter
  //     }
  //   })
  // })
});
// test1)
// });
  return schema;
};

export default Schema;
