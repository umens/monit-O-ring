function configState($stateProvider, $urlRouterProvider, $compileProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        // login
        .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl',
            data: {
                pageTitle: 'Login'
            }
        })
    	.state('dashboard', { 
    		url: '/dashboard',
    		controller: 'MasterCtrl',
    		templateUrl: 'templates/dashboard.html',
    	})
        // App views - listing
        .state('overview', {
            url: "/overview",
            parent: 'dashboard',
            templateUrl: 'templates/dashboard/overview.html',
            controller: 'MainCtrl',
            data: {
                pageTitle: 'Home'
            }
        })
        // details
        .state('server_details', {
            url: "/server/:serverId-:serverName",
            parent: 'dashboard',
            templateUrl: "templates/dashboard/server.html",
            controller: 'ServerCtrl',
            data: {
                pageTitle: 'Details'
            }
        });
};

/**
 * Route configuration for the monitModule module.
 */
angular.module('monitApp')
.config(configState)
.config(function ($httpProvider) {
  	$httpProvider.interceptors.push('AuthInterceptor');
})
.run(function($rootScope, $state, AuthService, AUTH_EVENTS, $cookieStore) {
    $rootScope.$state = $state;
    $rootScope.globals = $cookieStore.get('globals') || {};
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
        if (!AuthService.isAuthenticated()) {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        }
    });
});