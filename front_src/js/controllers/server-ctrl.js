angular
    .module('monitApp')
    .controller('ServerCtrl', ServerController);

function ServerController($scope, socket, alertService, $stateParams, $http, $timeout, $rootScope) { 

	$scope.host = {};
	$scope.host.name = $stateParams.serverName;
	$scope.seriesCPU = [];
	$scope.data_cpu = [];
	$scope.countCPUNb = 0;
	$scope.cpuChartTreated = false;
	$scope.memoryChartTreated = false;
	$scope.liveCPU = 0;
	$scope.liveMemory = 0;
	$scope.seriesMemory = [];
	$scope.data_memory = new Array();

    $scope.addAlert = function() {
    	alertService.add("warning", "This is a warning.");
    };

    // Options for the differents plugins
    // options for the gauges
	$scope.liveCpuOptions = {
		unit: "%",
		size: 250,
		startAngle: -120,
		endAngle: 120,
		step: 0.1,
		readOnly: true,
		fontSize: 40,
		subText: {
			enabled: true,
			text: 'CPU used',
			color: 'gray',
			font: 'auto'
		},
		animate: {
			ease: 'circle'
		},
		dynamicOptions: true,
		trackWidth: 40,
		barWidth: 25,
		trackColor: '#656D7F',
		barColor: '#2CC185'
	};
	$scope.liveMemoryOptions = {
		unit: "MB",
		size: 250,
		fontSize: 40,
		startAngle: -120,
		endAngle: 120,
		readOnly: true,
		subText: {
			enabled: true,
			text: 'RAM used',
			color: 'gray',
			font: 'auto'
		},
		animate: {
			ease: 'circle'
		},
		dynamicOptions: true,
		trackWidth: 40,
		barWidth: 25,
		trackColor: '#656D7F',
		barColor: '#2CC185'
	};
	// Options for the charts
	$scope.optionsCPUChart = {
	    elements: {
	        line: {
	            fill: false,
	            tension: 0,
	            spanGaps: false
	        },
        },
        legend: {
            display: true,
        },
		scales: {
			xAxes: [{
				type: "time",
				time: {
                    unit: 'second',
                    //min: moment().subtract(2, 'minutes')
                    unitStepSize: 30
                },
				display: true,
				scaleLabel: {
					display: false,
					labelString: 'Date'
				}/*,
				ticks: {
                    stepSize: 5
                }*/
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: false,
					labelString: 'value'
				},
				ticks: {
                    max: 100,
                    min: 0,
                    stepSize: 25
                }
			}]
		}/*,
		zoom: {
			enabled: true,
			// drag: true,
			mode: 'x',
			// limits: {
			// 	max: 10,
			// 	min: 0.5
			// }
		}*/
	};
	//chart memory
	$scope.seriesMemory.push('Memory usage (%)');
	$scope.optionsMemoryChart = {
	    elements: {
	        line: {
	            fill: false,
	            tension: 0,
	            spanGaps: false
	        },
        },
        legend: {
            display: true,
        },
		scales: {
			xAxes: [{
				type: "time",
				time: {
                    unit: 'second',
                    //min: moment().subtract(2, 'minutes')
                    unitStepSize: 30
                },
				display: true,
				scaleLabel: {
					display: false,
					labelString: 'Date'
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: false,
					labelString: 'value'
				},
				ticks: {
                    max: 100,
                    min: 0,
                    stepSize: 25
                }
			}]
		}/*,
		zoom: {
			enabled: true,
			drag: true,
			mode: 'x',
			limits: {
				max: 10,
				min: 0.5
			}
		}*/
	};

    // when landing on the page, get all 1 day of data and show them
    $http.get('/api/server/'+$stateParams.serverId)
    .success(function(data) {
        $scope.host.datas = data;
        changeLiveCPU(data[0].cpu[data[0].cpu.length - 1]);
        $scope.liveMemoryOptions.max = parseInt(data[0].totalMemory);
    	changeLiveMemory(data[0].usedMemory);
    	//spu chart datas
    	$scope.countCPUNb = $scope.host.datas[0].cpu.length;
		for (var i = 0; i < $scope.countCPUNb-1; i++) {
			$scope.seriesCPU.push('CPU '+i);
			$scope.data_cpu.push(new Array());
		}
		$scope.seriesCPU.push('CPU average');
		$scope.data_cpu.push(new Array());
		$scope.data_memory.push(new Array());
		//create the dataset of the CPU line chart
		$scope.host.datas.forEach(function(entry) {
			$scope.data_memory[0].push({'x': new Date(entry.added), 'y': roundToTwo((entry.usedMemory*100)/entry.totalMemory)});
		    for (var i = 0; i < $scope.countCPUNb; i++) {
		    	var data_tmp = {'x': new Date(entry.added), 'y': entry.cpu[i]};
				$scope.data_cpu[i].push(data_tmp);
			}
		});
		$scope.cpuChartTreated = true;
		$scope.memoryChartTreated = true;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    socket.emit('join', $scope.host.name);

    socket.on('ressources', function (data) {
    	changeLiveCPU(data.datas.cpu[data.datas.cpu.length - 1]);
    	changeLiveMemory(data.datas.usedMemory);
    	if($scope.cpuChartTreated){
	    	for (var i = 0; i < $scope.countCPUNb; i++) {
		    	var data_tmp = {'x': new Date(data.added), 'y': data.datas.cpu[i]};
		    	$scope.data_cpu[i].pop();
				$scope.data_cpu[i].unshift(data_tmp);
			}
		}
		if($scope.memoryChartTreated){
			$scope.data_memory[0].pop();
			$scope.data_memory[0].unshift({'x': new Date(data.added), 'y': roundToTwo((data.datas.usedMemory*100)/data.datas.totalMemory)});
		}
    });

    //leave the room of the server to not get the detailled update
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		socket.emit('leave', fromParams.serverName);
	});

	function changeLiveMemory(memory){
		//update memory gauge and options
        $scope.liveMemory = parseInt(memory);
        if($scope.liveMemory >= ($scope.liveMemoryOptions.max*0.9)){
        	$scope.liveMemoryOptions.barColor = '#d62c1a';
        }
        else if($scope.liveMemory >= ($scope.liveMemoryOptions.max*0.75)){
        	$scope.liveMemoryOptions.barColor = '#FFAE1A';
        }
        else{
        	$scope.liveMemoryOptions.barColor = '#2CC185';
        }
	}

	function changeLiveCPU(cpu){
		//update cpu gauge and options
		$scope.liveCPU = parseFloat(cpu);
        if($scope.liveCPU >= 90){
        	$scope.liveCpuOptions.barColor = '#d62c1a';
        }
        else if($scope.liveCPU >= 75){
        	$scope.liveCpuOptions.barColor = '#FFAE1A';
        }
        else{
        	$scope.liveCpuOptions.barColor = '#2CC185';
        }
	}

	function roundToTwo(num) {    
	    return +(Math.round(num + "e+2")  + "e-2");
	}

};