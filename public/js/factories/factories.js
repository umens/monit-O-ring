angular
    .module('monitApp')
    .factory('socket', function (socketFactory) {
	  	var myIoSocket = io.connect('http://192.168.1.23:8080');

	  	socket = socketFactory({
		    ioSocket: myIoSocket
	  	});

	  	return socket;
	});