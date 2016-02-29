import { GraphQLSchema,
          GraphQLObjectType,
          GraphQLList,
          GraphQLInt,
          GraphQLString,
          GraphQLNonNull,
          GraphQLID
        } from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  mutationWithClientMutationId
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
        id: globalIdField("Store"),
        linkConnection: {
          type: linkConnection.connectionType,
          args: connectionArgs,
          resolve: (_, args) => connectionFromPromisedArray(
          db.collection("links").find({})
            .sort({createdAt: -1})
            .limit(args.first).toArray(),
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
    url: { type: GraphQLString },
    createdAt: {
      type: GraphQLString,
      resolve: (obj) => new Date(obj.createdAt).toISOString()
    }
  })
});

let linkConnection = connectionDefinitions({
  name: 'Link',
  nodeType: linkType
});

let createLinkMutation = mutationWithClientMutationId({
  name: 'CreateLink',

  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    url: { type: new GraphQLNonNull(GraphQLString) },
  },

  outputFields: {
    linkEdge: {
      type: linkConnection.edgeType,
      resolve: (obj) => ({ node: obj.ops[0], cursor: obj.insertedId })
    },
    store: {
      type: storeType,
      resolve: () => store
    }
  },

  mutateAndGetPayload: ({title, url}) => {
    return db.collection("links").insertOne({
      title,
      url,
      createdAt: Date.now()
    });
  }

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
  }),
  mutation: new GraphQLObjectType({
     name: 'Mutation',
     fields: () => ({
       createLink: createLinkMutation
     })
   })
});

  return schema;
};

export default Schema;
