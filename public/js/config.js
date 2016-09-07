function configState($stateProvider, $urlRouterProvider, $compileProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise("/");
    $stateProvider

        // App views - listing
        .state('app_views', {
            url: "/",
            templateUrl: 'views/home.html',
            controller: 'MainCtrl',
            data: {
                pageTitle: 'Servers View'
            }
        })
        // details
        .state('app_views.server', {
            url: "/server",
            templateUrl: "views/server.html",
            controller: 'ServerCtrl',
            data: {
                pageTitle: 'Details',
            }
        })
}

angular
    .module('monitApp')
    .config(configState);

// Toastr options
toastr.options = {
    "debug": false,
    "preventDuplicates": true,
    "newestOnTop": false,
    "positionClass": "toast-top-center",
    "closeButton": true,
    "toastClass": "animated fadeInDown",
};