/**
 * Master Controller
 */

angular
    .module('monitApp')
    .controller('MasterCtrl', MasterCtrl);

function MasterCtrl($scope, $cookieStore, alertService, $rootScope, $state, AuthService, AUTH_EVENTS, socket) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
    
    $rootScope.closeAlert = alertService.closeAlert;

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
		AuthService.logout();
		$state.go('login');
		toastr.warning('Session Lost', 'Sorry, You have to login again.');
	});

    $scope.logout = function() {
        socket.disconnect();
        AuthService.logout();
        $state.go('login');
    };
}