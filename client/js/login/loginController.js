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
    var test = Privilege.Cocks($scope.creds)
    var test2 = test.then(function(data){
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
    },
    function(data){
      // handle error
      var myAlert = $alert({title: "Title",
          content: "err",
          placement: 'top',
          type: 'danger',
          show: true
        });
  })
    var catchError = test.catch(function(err){
      var myAlert = $alert({title: err.message,
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
