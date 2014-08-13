angular.module('uiRouterSample')
.controller('navbarSearcher', function($scope, $rootScope, $state, $alert, prospectFactory) {
    console.log("Hello navbar")
    $scope.popover = {
      "title": "Title",
      "content": "Hello Popover<br />This is a multiline message!"
    };

    $scope.doodo = function(){
        console.log("Doo")
    }

    $scope.button = {
  "toggle": false,
  "checkbox": {
    "left": false,
    "middle": true,
    "right": false
  },
  "radio": 2
};


$scope.color = 'blue';
      $scope.specialValue = {
        "id": "12345",
        "value": "green"
      };

      $scope.popover = {
  "title": "Cocks",
  "content": "Hello Popover<br />This is a multiline message!"
};

})
