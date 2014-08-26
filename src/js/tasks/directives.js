angular.module('uiRouterSample')
    .directive('tasks', function() {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                title: '@'
            },
            // template: '<div>{{ myVal }}</div>',
            templateUrl: 'src/js/tasks/tasks.tmpl.html',
            // controller: controllerFunction, //Embed a custom controller in the directive
            link: function($scope, element, attrs) {} //DOM manipulation
        }
    });
