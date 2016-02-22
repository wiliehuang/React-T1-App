import express from 'express';
import Schema from '../../app/data/schema';
import GraphQLHTTP from 'express-graphql';
import {MongoClient} from 'mongodb';
import fs from 'fs';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';

let app = express();

app.use(express.static(__dirname + '/../../public'));

// let db;

(async ()=> {
  let db = await MongoClient.connect(process.env.MONGO_URL);
  let schema = Schema(db);

  app.use('/graphql', GraphQLHTTP({
    schema,
    graphiql: true
  }));
  app.listen(3000, () => console.log("listening on port 3000"));

  let json = await graphql(schema, introspectionQuery);
  fs.writeFile('./app/data/schema.json', JSON.stringify(json, null, 2), err => {
    if (err) throw err;

    console.log("created JSON schema");
  })

})();


// MongoClient.connect(process.env.MONGO_URL, (err, database) => {
//   if (err) {
//     throw err;
//   }
//   db = database;
//
//     app.use('/graphql', GraphQLHTTP({
//       schema: schema(db),
//       //schema,
//       graphiql: true
//     }));
//
//
//   app.listen(3000, () => console.log("listening on port 3000"));
// });

// app.get("/data/links", (req, res) => {
//   db.collection("links").find({}).toArray((err, links) => {
//     if (err) {
//       throw err;
//     }
//     res.json(links);
//   });
// })
