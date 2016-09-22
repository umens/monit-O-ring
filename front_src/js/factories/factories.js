angular.module('monitApp')
.factory('socket', function (socketFactory) {
  	var myIoSocket = io.connect('http://192.168.1.23:8080');

  	var socket = socketFactory({
	    ioSocket: myIoSocket
  	});

  	return socket;
})
/*.factory('socket', function (socketFactory, $rootScope, $q, $timeout) {

	var socket = $q.defer();
	// listen for the authenticated event emitted on the rootScope of 
	// the Angular app. Once the event is fired, create the socket and resolve
	// the promise.
	$rootScope.$on('authenticated', function() {
	    
	    // resolve in another digest cycle
        $timeout(function() {
            // create the socket
            var newSocket = (function() {
                return socketFactory({
                    ioSocket: io.connect('http://192.168.1.23:8080')
                });
            })();
            
            // resolve the promise
            socket.resolve(newSocket);
        });
	});
	// return the promise
	return socket.promise;
})*/
.factory('alertService', function($rootScope) {
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alertService.add = function(type, msg) {
      	$rootScope.alerts.push({'type': type, 'msg': msg});
    };

    alertService.closeAlert = function(index) {
      	$rootScope.alerts.splice(index, 1);
    };

    return alertService;
})
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
	return {
        responseError: function (response) {
            $rootScope.$broadcast({
            	401: AUTH_EVENTS.notAuthenticated,
		    }[response.status], response);
		    //toastr.error('Login failed!', response.data.err.message);
	        return $q.reject(response);
	    }
    };
});