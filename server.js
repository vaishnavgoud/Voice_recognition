const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vaishnav:kanna1234@cluster0-gqbch.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
})

// Create a new Express app
const app = express();

var port = process.env.PORT || 3001;

// Set up Auth0 configuration
const authConfig = {
  domain: "dev-vaishnav.auth0.com",
  audience: "https://voice-notes.netlify.com"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from dev-vaishnav.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

// Define an endpoint that must be called with an access token
app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your Access Token was successfully validated!"
  });
});

// Start the app
app.listen(port, () => console.log('API listening on 3001'));