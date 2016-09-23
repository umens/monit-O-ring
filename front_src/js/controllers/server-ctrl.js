angular
    .module('monitApp')
    .controller('ServerCtrl', ServerController);

function ServerController($scope, socket, alertService, $stateParams, $http, $timeout) { 

	$scope.host = {};
	$scope.host.name = $stateParams.serverName;


    $scope.addAlert = function() {
        alertService.add("warning", "This is a warning.");
    };

    //$scope.liveCPU = 1;
	$scope.liveCpuOptions = {
		unit: "%",
		max: 0,
		size: 250,
		startAngle: -120,
		endAngle: 120,
		step: 0.1,
		readOnly: true,
		subText: {
			enabled: true,
			text: 'CPU used',
			color: 'gray',
			font: 'auto'
		},
		dynamicOptions: true,
		animate: {
			enabled: true,
			duration: 500,
			ease: 'circle'
		},
		trackWidth: 40,
		barWidth: 25,
		trackColor: '#656D7F',
		barColor: '#2CC185'
	};
	$scope.liveMemory = 0;
	$scope.liveMemoryOptions = {
		unit: "%",
		max: 0,
		size: 250,
		startAngle: -120,
		endAngle: 120,
		step: 0.1,
		readOnly: true,
		subText: {
			enabled: true,
			text: 'CPU used',
			color: 'gray',
			font: 'auto'
		},
		dynamicOptions: true,
		animate: {
			enabled: true,
			duration: 1000,
			ease: 'circle'
		},
		trackWidth: 40,
		barWidth: 25,
		trackColor: '#656D7F',
		barColor: '#2CC185'
	};

    // when landing on the page, get all 1 day of data and show them
    $http.get('/api/server/'+$stateParams.serverId)
    .success(function(data) {
        $scope.host.datas = data;
        $scope.liveCPU = parseInt(data[0].cpu[data[0].cpu.length - 1]);
    	$scope.liveMemory = parseInt(data[0].usedMemory);  
        //console.log(data);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

};