'use strict';
/**
 *  This server is used to mainly host the front-end of the web app.
 *
 *  For anything other than accessing the web app is forwarded the api server.
 **/
const express = require('express');
const request = require('request');
const compression = require('compression');
const favicon = require('serve-favicon');
const httpProxy = require('http-proxy');
const url = require('url');
const config = require('./config.json')
const apiServer = config.apiServer;
// localhost
var proxy = httpProxy.createProxyServer();

var app = express();
app.use(favicon(__dirname + '/img/favicon-bar-chart.ico'));
app.use(compression());

app.get('/', function(req, res){
  var token = req.query.client_token;
  if(token !== undefined){
    request({
      'url' : 'https://apps.mypurecloud.com/api/v2/session',
      'method' : 'GET',
      'headers' : {
        'Authorization' : 'bearer ' + token
      }
    }, function(error, response, body){
      if(error || response.statusCode == 200){
        res.sendFile(__dirname + '/views/index.html')
      }
      else{
        res.sendFile(__dirname + '/views/login.html');
      }
    });
  }
  else{
    res.sendFile(__dirname + '/views/login.html');
  }
});

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/locales', express.static(__dirname + '/locales'));
/**
 *  Forward all other requests to api server
 */
app.use('/api/*', function(req, res){
  console.log(req);
  var path = url.parse(req.originalUrl).pathname;
  path = path.slice(4, path.length);
  console.log(path);
  proxy.web(req, res, { 'target' : apiServer + path});
});
var port = process.argv[2] || 8000;
app.listen(port, function(){
  console.log('Server running on port ' + port + '...');
});
