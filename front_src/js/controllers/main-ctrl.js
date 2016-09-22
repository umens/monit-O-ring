// public/js/controllers/MainCtrl.js
angular
    .module('monitApp')
    .controller('MainCtrl', MainController);

function MainController($scope, socket, $http, CONFIG) { 

    $scope.hosts = [];
    $scope.displayableHosts = [];

    $scope.$watch('hosts', function(newValue, oldValue){
        var size = 3;
        var newArr = [];
        for (var i=0; i<newValue.length; i+=size) {
            newArr.push(newValue.slice(i, i+size));
        }
        $scope.displayableHosts = newArr;
    });
  
    socket.on('ressources', function (data) {
      	console.log(data);
    });

    // when landing on the page, get all todos and show them
    $http.get('/api/servers')
    .success(function(data) {
        $scope.hosts = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    socket.on('serves_refresh', function (data) {
      	$scope.hosts = data;
    });

    socket.on('ehlo', function (data) {
        if(!foundInArray(data.host.name)){
            $scope.hosts.push(data.host);
        }
    });

    socket.on('lost_connection', function (data) {
        if(foundInArray(data.host)){
            swal({
			  	title: 'Server Down!',
			  	text: data.host+' just crash ! Fix it ASAP.',
			  	timer: 10000,
			  	type: 'error',
			})
        }
    });

    function foundInArray(host_name){
        var find = false;
        $scope.hosts.forEach(function(entry) {
            /* iterate through array or object */
            if(entry.name == host_name){
                find = true;
            }
        });
        return find;

    }
};