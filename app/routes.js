// app/routes.js

// grab the nerd model we just created
var Data = require('./models/data');
var Host   = require('./models/host');
var path   = require('path');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/servers', function(req, res) {
        var hosts = [];
        Host.find().exec( function(err, hosts) {
            // servers.forEach(function(entry) {
            //     Data.find({'host': entry._id}).sort( { added: -1 } ).limit( 1 ).populate('host').exec( function ( err, data ){
            //         hosts.push(data);
            //     });
            // });
            if (err)
                res.send(err);
            res.json(hosts); // return all hosts in JSON format
        });
    });

    app.get('/api/server/:id', function(req, res) {
        //req.params.id
        // use mongoose to get all hosts in the database
        Host.find(function(err, servers) {

            // if there is an error retrieving, send the error. 
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(servers); // return all hosts in JSON format
        });
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));  // load our public/index.html file
    });

};