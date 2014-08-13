angular.module('uiRouterSample')
.controller('activityController', function($scope, $rootScope, $http, activityFactory, $upload) {
    console.log("Welcome to activity controller")

    $scope.userList = [];
    var getUsers = $http.get('http://10.1.1.118:8000/api/users').then(function(data){
        console.log("Got users", data.data.UserList)
        $scope.userList = data.data.UserList
    }).catch(function(err){
      // do something
    })

    $scope.model = activityFactory[0];

    $scope.setFile = function($files){
        console.log("Passed", $files)
        activityFactory[2].file = $files[0];
        console.log("Model", activityFactory[2] )
    }


})
