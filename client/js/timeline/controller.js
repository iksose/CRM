angular.module('uiRouterSample')
.controller('timelineController', function($scope, $rootScope, $state, Tasks) {
  console.log("TIMELINE")

$scope.myData = [
    {name: 'AngularJS', count: 300},
    {name: 'D3.JS', count: 150},
    {name: 'jQuery', count: 400},
    {name: 'Backbone.js', count: 300},
    {name: 'Ember.js', count: 100}
];


})
