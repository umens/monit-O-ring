var Host = require('./app/models/host');
var Data   = require('./app/models/data');

module.exports.connect = function(io){

    io.on('connection', function (socket) {
        var db_host = null;

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
                    socket.broadcast.emit('ressources', {host: db_host, datas: data});
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
    });
};