angular.module('monitApp')
.filter('timeago', function () {
    return function(input){
        return moment.preciseDiff(0, input);
    }
})
.filter('makeUrl', function () {
    return function(name){
    	var url = name;
    	if(name.indexOf("http://") == -1){
    		url = "http://"+url; 
    	}
        return url;
    }
});