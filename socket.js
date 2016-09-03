var Host = require('./app/models/host');
var Data   = require('./app/models/data');

module.exports.connect = function(io){

    io.on('connection', function (socket) {
        var db_host = null;

        socket.on('resources', function(data) {
            Host.update({ _id: db_host._id }, { uptime: data.uptime, lastTimeUp: Date.now(), status: true });
            var datas = new Data({ 
                host: db_host._id,
                cpu: data.cpu,
                totalMemory: data.totalMemory,
                freeMemory: data.freeMemory,
                usedMemory: data.usedMemory,
                uptime: data.uptime
            });
            datas.save(function(err) {
                if (err) throw err;
            });
        });

        socket.on('ehlo', function (data) {
            Host.count({ name: data.hostname }, function (err, count) {
                if (err) throw err;
                var datas = new Data({ 
                    cpu: data.cpu,
                    totalMemory: data.totalMemory,
                    freeMemory: data.freeMemory,
                    usedMemory: data.usedMemory,
                    uptime: data.uptime
                });
                if(count == 1){
                    Host.findOne({ name: data.hostname }, function (err, host) {
                        Host.update({ _id: host._id }, { uptime: data.uptime, lastTimeUp: Date.now(), status: true });
                        db_host = host
                        datas.host = host._id;
                        datas.save(function(err) {
                            if (err) throw err;
                        });
                    });
                    console.log('existing server');
                }
                else{
                    db_host = new Host({ 'name': data.hostname, 'uptime': data.uptime });
                    db_host.save(function(err) {
                        if (err) throw err;
                        datas.host = db_host._id;
                        datas.save(function(err) {
                            if (err) throw err;
                        });
                    });
                    console.log('new server add');
                    socket.emit('ehlo', {host: db_host, datas: data});
                }
            });
        });
    });
};