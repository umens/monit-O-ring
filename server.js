// server.js

// modules =================================================
var express              = require('express');
var app                  = express();
var server               = require('http').Server(app);
var io                   = require('socket.io')(server);
var socket               = require('./socket').connect(io);

var logger               = require("./utils/logger");
var expressConfiguration = require("./utils/express-configuration");

// configuration ===========================================
logger.info("configuring express....");
expressConfiguration.init(app, express);
logger.info("Express configured");

// set our port
var port = process.env.PORT || 8080; 

// routes ==================================================
require('./app/routes')(app); // configure our routes

app.get("/Error", function(req, res) {
  	throw new Error();
});

// start app ===============================================
// startup our app at http://localhost:8080
server.listen(port, function() {
    logger.info("Listening on " + port);
});

// expose app           
exports = module.exports = app;   