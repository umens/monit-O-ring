// public/js/app.js
angular.module('monitApp', ['ngRoute', 'appRoutes', 'btford.socket-io', 'MainCtrl', 'ServerCtrl', 'ServerService']).
factory('mySocket', function (socketFactory) {
  return socketFactory();
});;