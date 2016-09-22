angular.module('monitApp')
.constant('AUTH_EVENTS', {
  	notAuthenticated: 'auth-not-authenticated'
})
.constant('CONFIG', {
  	API: window.location.protocol+'//'+window.location.host+'/api',
  	APP_NAME: 'Monit-O-Ring',
  	APP_VERSION: 0.1,
  	LOCAL_TOKEN_KEY: 'monit-O-ring'
})
.value('userInfo', {
  	_id: '',
    username: '',
    token: ''
});