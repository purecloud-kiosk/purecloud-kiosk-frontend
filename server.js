/**
 *  This server is used to mainly host the front-end of the web app.
 *
 *  For anything other than accessing the web app is forwarded the api server.
 **/
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var compression = require("compression");
var favicon = require("serve-favicon");
var apiServer = "http://localhost:8080";

var app = express();
app.use(favicon(__dirname + "/img/favicon-bar-chart.ico"));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res){
  var token = req.query.client_token;
  if(token !== undefined){
    request({
      "url" : "https://apps.mypurecloud.com/api/v2/session",
      "method" : "GET",
      "headers" : {
        "Authorization" : "bearer " + token
      }
    }, function(error, response, body){
      if(error || response.statusCode == 200){
        res.sendFile(__dirname + "/views/index.html")
      }
      else{
        res.sendFile(__dirname + "/views/login.html");
      }
    });
  }
  else{
    res.sendFile(__dirname + "/views/login.html");
  }
});

app.use("/dist", express.static(__dirname + "/dist"));

/**
 *  Forward all other requests to api server
 */
app.use("/api/*", function(req, res){
  console.log(req.originalUrl.substring(4, req.originalUrl.length));
  var newUrl = apiServer + req.originalUrl.substring(4, req.originalUrl.length);
  request({
    "url" : newUrl,
    "method" : req.method,
    "json" : req.body,
    "qs" : req.query,
    "headers" : {
      "Authorization" : req.headers.authorization ? req.headers.authorization : "" // if undefined, just place empty string
    }
  }).pipe(res);
});

app.listen(8000, function(){
  console.log("Server running on port 8000...");
});
