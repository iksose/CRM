angular.module('uiRouterSample')
.controller('loginController', function($scope, $rootScope, Privilege, $cookies, $alert) {
  console.log("Controller loaded")
  $rootScope.loggedIn = $rootScope.loggedIn || false;
  $scope.creds = {};
  // $rootScope.credentials = {}
  // decided to define this in app.run

  $scope.loginSubmit = function(){
    $cookies.myFavorite = "WOW"
    console.log("Cookies", $cookies)
    //document.cookie
    console.log("CREDS, ", $scope.creds)

    // var test = Privilege.Login.query({id:1}).$promise;
    var test = Privilege.Login.query($scope.creds).$promise;
    var test2 = test.then(function(data){
      console.log("Then....", data)
      $rootScope.loggedIn = true;
      $rootScope.$state.go("home");
      $rootScope.credentials.username = data.username
      $rootScope.credentials.admin = data.admin;
      $rootScope.credentials.group = data.group;
    })
    var catchError = test.catch(function(err){
      var myAlert = $alert({title: err.statusText,
          content: err.data,
          placement: 'top',
          type: 'danger',
          show: true
        });
      console.log("Never fire this error", err)
    })
  }

  $scope.logOut = function(){
    $rootScope.loggedIn = false;
  }

});
