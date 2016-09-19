function configState($stateProvider, $urlRouterProvider, $compileProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise("/");
    $stateProvider
        // App views - listing
        .state('home', {
            url: "/",
            templateUrl: 'templates/dashboard.html',
            controller: 'MainCtrl',
            data: {
                pageTitle: 'Servers View'
            }
        })
        // details
        .state('server', {
            url: "/server",
            templateUrl: "templates/server.html",
            controller: 'ServerCtrl',
            data: {
                pageTitle: 'Details'
            }
        })
};

/**
 * Route configuration for the monitModule module.
 */
angular.module('monitApp').config(configState);