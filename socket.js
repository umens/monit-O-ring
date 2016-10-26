var Host = require('./app/models/host');
var Data   = require('./app/models/data');

module.exports.connect = function(io){

    var servers = [];

    setInterval(function() {

        Host.find().exec( function(err, hosts) {
            if (err)
                res.send(err);
            io.emit('serves_refresh', hosts);
        });

    }, 15000);

    io.on('connection', function (socket) {
        var db_host = null;

        socket.on('identifier', function (data) {
            var clientSocketInfo = new Object();
            clientSocketInfo.customId     = data.serverName;
            clientSocketInfo.clientId     = socket.id;
            servers.push(clientSocketInfo);
        });

        socket.on('ressources', function(data) {
            Host.findOne({ name: data.hostname }, function (err, host) {
                host.uptime = data.uptime;
                host.lastTimeUp = Date.now();
                host.status = true;
                db_host = host;
                host.save(function(err) {
                    if (err) throw err;
                });
                //Host.update({ _id: db_host._id }, { uptime: data.uptime, lastTimeUp: Date.now(), status: true });
                var datas = new Data({ 
                    host: db_host._id,
                    cpu: data.cpu,
                    totalMemory: data.totalMemory,
                    freeMemory: data.freeMemory,
                    usedMemory: data.usedMemory
                });
                datas.save(function(err) {
                    if (err) throw err;
                    socket.in(data.hostname).emit('ressources', {host: db_host, datas: data, added: Date.now()});
                });
            });
        });

        socket.on('ehlo', function (data) {
            Host.count({ name: data.hostname }, function (err, count) {
                if (err) throw err;
                var datas = new Data({ 
                    cpu: data.cpu,
                    totalMemory: data.totalMemory,
                    freeMemory: data.freeMemory,
                    usedMemory: data.usedMemory
                });
                if(count == 1){
                    Host.findOne({ name: data.hostname }, function (err, host) {
                        host.uptime = data.uptime;
                        host.lastTimeUp = Date.now();
                        host.status = true;
                        db_host = host;
                        host.save(function(err) {
                            if (err) throw err;
                        });
                        //Host.update({ _id: db_host._id }, { uptime: data.uptime, lastTimeUp: Date.now(), status: true });
                        datas.host = host._id;
                        datas.save(function(err) {
                            if (err) throw err;
                        });
                        console.log('existing server');
                        socket.broadcast.emit('ehlo', {host: db_host});
                    });
                }
                else{
                    db_host = new Host({ 'name': data.hostname, 'uptime': data.uptime });
                    db_host.save(function(err) {
                        if (err) throw err;
                        datas.host = db_host._id;
                        datas.save(function(err) {
                            if (err) throw err;
                        });
                        console.log('new server add');
                        socket.broadcast.emit('ehlo', {host: db_host});
                    });
                }
            });
        });

        socket.once('disconnect', function (data) {
            for( var i=0, len=servers.length; i<len; ++i ){
                var c = servers[i];

                if(c.clientId == socket.id){
                    servers.splice(i,1);
                    Host.findOne({ name: c.customId }, function (err, host) {
                        host.lastTimeUp = Date.now();
                        host.status = false;
                        db_host = host;
                        host.save(function(err) {
                            if (err) throw err;
                        });
                    });
                    socket.broadcast.emit('lost_connection', {host: c.customId});
                    break;
                }
            }

        });

        // once a client has connected, we expect to get a ping from them saying what room they want to join
	    socket.on('join', function(room) {
	        socket.join(room);
	    });

	    socket.on('leave', function(room) {
	        socket.leave(room);
	    });
        
    });
};