import { ApolloServer } from '@apollo/server';
import { ApolloGateway } from '@apollo/gateway';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { startStandaloneServer } from '@apollo/server/standalone';

// var querystring = require('querystring');
import { request } from 'http';
// const fs = require('fs')

const query = `
query TestProductMetadataValues($productId: ID!) {
      product(id: $productId) {
        id
        metadata {
          productMetadata {
              createdAt
          }
        }
      }
    }
`

function doRequest(url) {
  var parsedUrl = new URL(url);

  var data = JSON.stringify({
      'query': query,
      'variables': { "productId": 1 }
  });

  // An object of options to indicate where to post to
  var options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      // path: '/compile',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
      }
  };

  // Set up the request

  return new Promise(() => {
    var post_req = request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
          done()
      });

      post_req.write(data);

      return post_req
    })
  })
}
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const supergraphSdl = readFileSync(__dirname + '/supergraph.graphql').toString();

// Initialize an ApolloGateway instance and pass it
// the supergraph schema
const gateway = new ApolloGateway({
  supergraphSdl,
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,
});


startStandaloneServer(server).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  doRequest(url).then(() => {
    console.log('Request processed correctly')
    process.exit(0)

  })
})

