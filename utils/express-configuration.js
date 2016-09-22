(function (expressConfig) {

    var logger = require("./logger");

    var path = require('path');
    //var expressValidator = require('express-validator');
    // config file
    var conf = require('../config/conf');

    expressConfig.init = function (app, express) {

    	logger.debug("Setting favicon.");
    	var favicon = require('serve-favicon');
    	app.use(favicon(__dirname + '/../public/favicon.ico'));

    	logger.debug("Creating logs folder/file.");
    	//creating log dir just in case
		var fs = require( 'fs' );
		var logDir = path.dirname(module.parent.filename) + "/logs"; // directory path you want to set
		if ( !fs.existsSync( logDir ) ) {
		    fs.mkdirSync( logDir );
		}

        api = express.Router();

        api.use(clientErrorHandler);

        function clientErrorHandler(err, req, res, next) {
            logger.log("error","Something wrong with an XHR request",err.stack);

            if (req.xhr) {
                res.send(500, { error: 'Something blew up!' });
            } else {
                next(err);
            }
        }

        logger.debug("Enabling GZip compression.");
        var compression = require('compression');
        app.use(compression({
            threshold: 512
        }));

        logger.debug("Setting 'Public' folder with maxAge: 1 Day.");
        var publicFolder = path.dirname(module.parent.filename)  + "/public";
        var oneYear = 31557600000;
        var oneDay = 86400000;
        app.use(express.static(publicFolder, { maxAge: 1 }));

        //app.use(expressValidator());

        logger.debug("Setting parse urlencoded request bodies into req.body.");
        var bodyParser = require('body-parser');
        // app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
        // app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

        logger.debug("Setting methodOverride.");
        var methodOverride = require('method-override');
        app.use(methodOverride('X-HTTP-Method-Override'));

        logger.debug("Setting passport.");
        var cookieParser = require('cookie-parser');
        app.use(cookieParser());
		app.use(require('express-session')({
		    secret: conf.session_secret,
		    resave: false,
		    saveUninitialized: false
		}));
		var passport = require('passport');
		app.use(passport.initialize());
		app.use(passport.session());
		logger.debug("Configure passport.");
		var User = require(path.dirname(module.parent.filename)  + "/app/models/user");
		var LocalStrategy = require('passport-local').Strategy;
		passport.use(new LocalStrategy(User.authenticate()));
		passport.serializeUser(User.serializeUser());
		passport.deserializeUser(User.deserializeUser());
		var JwtStrategy = require('passport-jwt').Strategy;
		var ExtractJwt  = require('passport-jwt').ExtractJwt;
		var opts = {}
	    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	    opts.secretOrKey = conf.session_secret;
	    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	        User.findOne({id: jwt_payload.sub}, function(err, user) {
	            if (err) {
	                return done(err, false);
	            }
	            if (user) {
	                done(null, user);
	            } else {
	                done(null, false);
	                // or you could create a new account
	            }
	        });
	    }));
 
        logger.debug("Connect to our mongoDB database.");
        var mongoose = require('mongoose');
        mongoose.connect(conf.db.url, function(err) {
            if (err) {
                logger.error("Could not connect to database");
                //throw err;
            }
        });

        logger.debug("Overriding 'Express' logger");
        app.use(require('morgan')('combined', { "stream": logger.stream})); 

    };

})(module.exports);