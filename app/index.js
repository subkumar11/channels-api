'use strict';

// require custom modules
var channels = require("./channels");

// require standard modules
const express = require('express');
const bodyParser = require('body-parser');

// Constants
const PORT = process.env.PORT || 8080;

// App
const app = express();

// instantiate 'static' as the folder for static data
app.use(express.static('static'));

// initialize body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// endpoint to return the swagger API spec json document
app.get('/channels/apispec', function(req, res) {
  var apispec = require('./static/apidocs/api-docs');

  var host = req.headers.host;
  // allow http for swagger only on localhost
  if (host.indexOf('localhost') !== -1) {
    apispec.schemes = [ 'http' ];
  }
  // set the host dynamically based on where code is deployed
  apispec.host = host;

  // set API version dynamically based on environmental variable
  if(process.env.API_VERSION) {
    apispec.info.version = process.env.API_VERSION;
  } else {
    apispec.info.version = '1.0.LATEST';
  }

  res.json(apispec);
});

// endpoint for health check
app.get('/channels/v1/healthcheck', function(req, res) {
  res.json({
    status: "OK"
  });
});


// endpoint for returning all available channels
app.get('/channels/v1/channels', function(req, res) {

  // use channels module to get channel list
  new channels().getAllChannels().then(
    function(channelGroups) {
      res.json({
        channelGroups
      });
    },
    function(error) {
      console.log(error);
      res.status(500).json({
        code: "CS001",
        message: "Error obtaining channel list"
      });
    }
  );
});

// endpoint for returning all available channels
app.get('/channels/v1/channels/groupedByDate', function(req, res) {

  // use channels module to get channel list grouped by date and sorted
  new channels().getAllChannelsGroupedByDate().then(
    function(channelGroups) {
      // res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({
        channelGroups
      });
    },
    function(error) {
      console.log(error);
      res.status(500).json({
        code: "CS002",
        message: "Error obtaining channel list"
      });
    }
  );
});

// Ensure PORT is available for testing with Mocha
if(!module.parent){
  app.listen(PORT);
}

console.log('Running on http://localhost:' + PORT);
module.exports = app;
