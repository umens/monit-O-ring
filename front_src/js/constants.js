angular.module('monitApp')
 
.constant('AUTH_EVENTS', {
  	notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
  	url: window.location.protocol+'//'+window.location.host
});