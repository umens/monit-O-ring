// public/js/controllers/MainCtrl.js
angular
    .module('monitApp')
    .controller('MainCtrl', MainController);

function MainController($scope, socket, $http) { 

    $scope.tagline = 'To the moon and back!';
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

    // when landing on the page, get all todos and show them
    $http.get('/api/servers')
    .success(function(data) {
        $scope.hosts = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    setInterval(function() {

        $http.get('/api/servers')
        .success(function(data) {
            $scope.hosts = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    }, 15000);
  
    // socket.on('ressources', function (data) {
    //   	console.log(data);
    // });

    socket.on('ehlo', function (data) {
        if(!foundInArray(data.host.name)){
            $scope.hosts.push(data.host);
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