angular
    .module('monitApp')
    .directive('pageTitle', pageTitle)
    .directive('animatePanel', animatePanel)
    .directive('rdLoading', rdLoading)
    .directive('rdWidgetBody', rdWidgetBody)
    .directive('rdWidgetFooter', rdWidgetFooter)
    .directive('rdWidgetHeader', rdWidgetTitle)
    .directive('rdWidget', rdWidget);

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title
                var title = 'Monit-O-ring | AngularJS dashboard servers monitor';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Monit-O-ring | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

function animatePanel($timeout,$state) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            //Set defaul values for start animation and delay
            var startAnimation = 0;
            var delay = 0.06;   // secunds
            var start = Math.abs(delay) + startAnimation;

            // Store current state where directive was start
            var currentState = $state.current.name;

            // Set default values for attrs
            if(!attrs.effect) { attrs.effect = 'zoomIn'};
            if(attrs.delay) { delay = attrs.delay / 10 } else { delay = 0.06 };
            if(!attrs.child) { attrs.child = '.row > div'} else {attrs.child = "." + attrs.child};

            // Get all visible element and set opactiy to 0
            var panel = element.find(attrs.child);
            panel.addClass('opacity-0');

            // Count render time
            var renderTime = panel.length * delay * 1000 + 700;

            // Wrap to $timeout to execute after ng-repeat
            $timeout(function(){

                // Get all elements and add effect class
                panel = element.find(attrs.child);
                panel.addClass('stagger').addClass('animated-panel').addClass(attrs.effect);

                var panelsCount = panel.length + 10;
                var animateTime = (panelsCount * delay * 10000) / 10;

                // Add delay for each child elements
                panel.each(function (i, elm) {
                    start += delay;
                    var rounded = Math.round(start * 10) / 10;
                    $(elm).css('animation-delay', rounded + 's');
                    // Remove opacity 0 after finish
                    $(elm).removeClass('opacity-0');
                });

                // Clear animation after finish
                $timeout(function(){
                    $('.stagger').css('animation', '');
                    $('.stagger').removeClass(attrs.effect).removeClass('animated-panel').removeClass('stagger');
                }, animateTime)

            });
        }
    }
};

function rdLoading(){
	var d = {
		restrict: "AE",
		template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
	};
	return d
};

function rdWidgetBody(){
	var d = {
		requires: "^rdWidget",
		scope: {
			loading: "@?",
			classes: "@?"
		},
		transclude: !0,
		template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
		restrict:"E"
	};
	return d
};

function rdWidgetFooter(){
	var e = {
		requires: "^rdWidget",
		transclude: !0,
		template: '<div class="widget-footer" ng-transclude></div>',
		restrict: "E"
	};
	return e
};

function rdWidgetTitle(){
	var e = {
		requires: "^rdWidget",
		scope: {
			title: "@",
			icon: "@"
		},
		transclude: !0,
		template: '<div class="widget-header"><i class="fa" ng-class="icon"></i> {{title}} <div class="pull-right" ng-transclude></div></div>',
		restrict:"E"
	};
	return e
};

function rdWidget(){
	var d = {
		transclude: !0,
		template: '<div class="widget" ng-transclude></div>',
		restrict:"EA"
	};
	return d
};