angular
    .module('monitApp')
    .controller('ServerCtrl', ServerController);

function ServerController($scope, socket, alertService, $stateParams, $http) { 

	$scope.host = {};
	$scope.host.name = $stateParams.serverName;


    $scope.addAlert = function() {
        alertService.add("warning", "This is a warning.");
    };

    // when landing on the page, get all todos and show them
    $http.get('/api/server/'+$stateParams.serverId)
    .success(function(data) {
        $scope.host.datas = data;
        console.log(data);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

};