// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainController', function($scope, mySocket) {

    $scope.tagline = 'To the moon and back!';

    console.log('test');  

    mySocket.on('resources', function (data) {
    	console.log('test2');
      	console.log(data);
    });

});