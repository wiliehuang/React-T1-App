import { GraphQLSchema,
          GraphQLObjectType,
          GraphQLList,
          GraphQLInt,
          GraphQLString} from 'graphql';

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
        links: {
          type: new GraphQLList(linkType),
          resolve: () => db.collection("links").find({}).toArray()
        }
      })
    });

let linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    url: { type: GraphQLString }
  })
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
