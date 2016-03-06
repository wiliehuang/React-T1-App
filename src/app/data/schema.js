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
  fromGlobalId,
  nodeDefinitions,
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
// let data = [
//     {counter: 10},
//     {counter: 20},
//     {counter: 30}
//   ];

//let counter = 42;
let Schema = (db) => {
  class Store {}
  let store = new Store();

  let nodeDefs = nodeDefinitions(
    (globalId) => {
      let {type} = fromGlobalId(globalId);
      if (type === 'Store') {
        return store;
      }
      return null;
    },
    (obj) => {
      if (obj instanceof Store) {
        return storeType;
      }
      return null;
    }
  );

  let storeType = new GraphQLObjectType({
      name: 'Store',
      fields: () => ({
        id: globalIdField("Store"),
        linkConnection: {
          type: linkConnection.connectionType,
          args: {
            ...connectionArgs,
            query: { type: GraphQLString }
          },
          resolve: (_, args) => {
            let findParams = {};
            if (args.query) {
              findParams.title = new RegExp(args.query, 'i');
            }

          return connectionFromPromisedArray(
          db.collection("links")
            .find(findParams)
            .sort({createdAt: -1})
            .limit(args.first).toArray(),
          args
        );
        }
        }
      }),
      interfaces: [nodeDefs.nodeInterface]
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
      node: nodeDefs.nodeField,
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
