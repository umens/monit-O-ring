// public/js/services/ServerService.js
angular.module('ServerService', []).factory('Server', ['$http', function($http) {

    return {
        // call to get all servers
        get : function() {
            return $http.get('/api/server');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new server
        create : function(nerdData) {
            return $http.post('/api/server', serverData);
        },

        // call to DELETE a server
        delete : function(id) {
            return $http.delete('/api/server/' + id);
        }
    }       

}]);