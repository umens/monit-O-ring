// app/routes.js
var Data     = require('./models/data');
var Host     = require('./models/host');
var path     = require('path');
var passport = require('passport');
var User     = require('./models/user');
var jwt      = require('jwt-simple');
var conf     = require('../config/conf');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/servers', passport.authenticate('jwt', { session: false}), function(req, res) {
        var hosts = [];
        Host.find().exec( function(err, hosts) {
            if (err)
                res.send(err);
            res.json(hosts); // return all hosts in JSON format
        });
    });

    app.get('/api/server/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
        Data.find({'host': req.params.id}).sort( { added: -1 } ).limit( 1000 ).populate('host').exec( function ( err, datas ){
        	if (err)
            	res.send(err);
            res.json(datas); // return the specifique host in JSON format
        });
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)
    
    // authentification routes =========================================================
    app.post('/api/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				return res.status(401).json({success: false, err: info});
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).json({success: false, err: 'Could not log in user : '+err});
				}
				var token = jwt.encode(user, conf.session_secret);
				res.status(200).json({success: true, token: 'JWT ' + token, user: user, status: 'Login successful!'});
			});
		})(req, res, next);
	});

	app.get('/api/logout', function(req, res) {
		req.logout();
		res.status(200).json({status: 'Bye!'});
	});

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
    //     User.register(new User({username: 'admin'}), 'admin', function(err) {
		  //   if (err) {
		  //     console.log('error while user register!', err);
		  //     return next(err);
		  //   }

		  //   console.log('user registered!');
		  // });
        res.sendFile(path.join(__dirname, "../public/index.html"));  // load our public/index.html file
    });

};