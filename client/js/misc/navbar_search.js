angular.module('uiRouterSample')
.controller('navbarSearcher', function($scope, $rootScope, $state, $alert, prospectFactory) {
    console.log("Hello navbar")
    $scope.popover = {
      "title": "Title",
      "content": "Hello Popover<br />This is a multiline message!"
    };

})
