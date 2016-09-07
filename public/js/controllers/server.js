angular
    .module('monitApp')
    .controller('ServerCtrl', ServerController);

function ServerController($scope, socket) { 

    $scope.tagline = 'Nothing beats a pocket protector!';

};