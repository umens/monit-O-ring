angular.module('monitApp')
.service('AuthService', function($q, $http, $rootScope, CONFIG, socket, $cookieStore) {
	var isAuthenticated = false;
	var authToken;

	function loadUserCredentials() {
		var token = window.localStorage.getItem(CONFIG.LOCAL_TOKEN_KEY);
		if (token) {
			useCredentials(token);
		}
	}

	function storeUserCredentials(token, user) {
		window.localStorage.setItem(CONFIG.LOCAL_TOKEN_KEY, token);
		useCredentials(token);
		$rootScope.globals = {
            currentUser: {
                _id: user._id,
                username: user.username,
                token: token
            }
        };
        $cookieStore.put('globals', $rootScope.globals);
	}

	function useCredentials(token) {
		isAuthenticated = true;
		authToken = token;

		// Set the token as header for your requests!
		$http.defaults.headers.common.Authorization = authToken;
	}

	function destroyUserCredentials() {
		authToken = undefined;
		isAuthenticated = false;
		$http.defaults.headers.common.Authorization = undefined;
		window.localStorage.removeItem(CONFIG.LOCAL_TOKEN_KEY);
		$cookieStore.remove('globals');
	}

	// var register = function(user) {
	// 	return $q(function(resolve, reject) {
	// 		$http.post(CONFIG.API + '/signup', user).then(function(result) {
	// 			if (result.data.success) {
	// 				resolve(result.data.msg);
	// 			} else {
	// 				reject(result.data.msg);
	// 			}
	// 		});
	// 	});
	// };

	var login = function(user) {
		return $q(function(resolve, reject) {
			$http.post(CONFIG.API + '/login', user).then(function(result) {
				if (result.data.success) {
					storeUserCredentials(result.data.token, result.data.user);
					socket.connect();
					resolve(result.data.status);
				} else {
					reject(result.data.err);
				}
			});
		});
	};

	var logout = function() {
		destroyUserCredentials();
	};

	loadUserCredentials();

	return {
		login: login,
		logout: logout,
		isAuthenticated: function() {return isAuthenticated;},
	};
})