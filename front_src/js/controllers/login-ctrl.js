angular
    .module('monitApp')
    .controller('LoginCtrl', LoginController);

function LoginController($http, $scope, $state, AuthService, $rootScope, $location, CONFIG) {

	var user, login;

	$scope.location = $location.url();
	$scope.config = CONFIG;

	// Here we're creating a scope for our Signup page.
	// This will hold our data and methods for this page.
	$scope.login = login = {};

	// In our login.html, we'll be using the ng-model
	// attribute to populate this object.
	login.user = user = {};

	// This is our method that will post to our server.
	$scope.submit = function () {

		user = $scope.login.user;

		// make sure all fields are filled out...
		// aren't you glad you're not typing out
		// $scope.login.user.firstname everytime now??
		if (
			!user.username ||
			!user.password
		) {
			toastr.error('Please fill out all form fields.');
			return false;
		}

		// Make the request to the server ... which doesn't exist just yet
		AuthService.login(user).then(function(msg) {
			$rootScope.$broadcast('authenticated');
			$state.go('overview');
		}, function(errMsg) {
			toastr.error('Login failed!', errMsg.message);
		});

	};

};