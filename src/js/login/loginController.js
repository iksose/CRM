angular.module('uiRouterSample')
.controller('loginController', function($scope, $rootScope, Privilege, $cookies, $alert, $http) {
  console.log("Controller loaded")
  $rootScope.loggedIn = $rootScope.loggedIn || false;
  $scope.creds = {};
  $scope.creds.userid = $cookies.userid;
  // $rootScope.credentials = {}
  // decided to define this in app.run

  $scope.loginSubmit = function(){
    console.log("EXISTING XKEY IS", $http.defaults.headers.common['XKey'])
    delete $http.defaults.headers.common['XKey'];
    Privilege.Login($scope.creds).then((data)=>{
      // handle success
      console.log("Then....", data.data)
      $rootScope.loggedIn = true;
      $rootScope.$state.go("home");
      $rootScope.credentials.username = data.data.userid;
      $rootScope.credentials.key = data.data.key;
      $rootScope.credentials.admin = data.admin;
      $rootScope.credentials.group = data.group;
      $cookies.xkey = data.data.key;
      $cookies.userid = data.data.userid;
      $http.defaults.headers.common['XKey'] = data.data.key;
    }).catch((err)=>{
      // do something
    })
  }

  $scope.logOut = function(){
    $rootScope.loggedIn = false;
  }

});
