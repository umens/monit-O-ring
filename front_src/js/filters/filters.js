angular.module('monitApp')
.filter('timeago', function () {
    return function(input){
        return moment.preciseDiff(0, input);
    }
})
.filter('difference', function () {
    return function(input){
		var now        = moment();
		var lastTimeUp = moment(input);
        return moment.preciseDiff(lastTimeUp, now);
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