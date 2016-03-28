/**
 *  This server is used to mainly host the front-end of the web app.
 *
 *  For anything other than accessing the web app is forwarded the api server.
 **/
var express = require('express');
var request = require('request');
var compression = require('compression');
var favicon = require('serve-favicon');
var httpProxy = require('http-proxy');
var url = require('url');
var apiServer = 'http://localhost:8080';//'http://ec2-54-213-9-55.us-west-2.compute.amazonaws.com:8080';//'http://ec2-54-213-9-55.us-west-2.compute.amazonaws.com:8080';

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

app.listen(8000, function(){
  console.log('Server running on port 8000...');
});
