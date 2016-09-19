angular
    .module('monitApp')
    .controller('ServerCtrl', ServerController);

function ServerController($scope, socket, alertService) { 

    $scope.tagline = 'Nothing beats a pocket protector!';
    $scope.addAlert = function() {
        alertService.add("warning", "This is a warning.");
    };

};