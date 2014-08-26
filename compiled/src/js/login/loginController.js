define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('loginController', function($scope, $rootScope, Privilege, $cookies, $alert, $http) {
    console.log("Controller loaded");
    $rootScope.loggedIn = $rootScope.loggedIn || false;
    $scope.creds = {};
    $scope.creds.userid = $cookies.userid;
    $scope.loginSubmit = function() {
      console.log("EXISTING XKEY IS", $http.defaults.headers.common[$traceurRuntime.toProperty('XKey')]);
      delete $http.defaults.headers.common[$traceurRuntime.toProperty('XKey')];
      var test = Privilege.Cocks($scope.creds);
      var test2 = test.then(function(data) {
        console.log("Then....", data.data);
        $rootScope.loggedIn = true;
        $rootScope.$state.go("home");
        $rootScope.credentials.username = data.data.userid;
        $rootScope.credentials.key = data.data.key;
        $rootScope.credentials.admin = data.admin;
        $rootScope.credentials.group = data.group;
        $cookies.xkey = data.data.key;
        $cookies.userid = data.data.userid;
        $traceurRuntime.setProperty($http.defaults.headers.common, 'XKey', data.data.key);
      }, function(data) {
        var myAlert = $alert({
          title: "Title",
          content: "err",
          placement: 'top',
          type: 'danger',
          show: true
        });
      });
      var catchError = test.catch(function(err) {
        var myAlert = $alert({
          title: err.message,
          content: err.data,
          placement: 'top',
          type: 'danger',
          show: true
        });
        console.log("Never fire this error", err);
      });
    };
    $scope.logOut = function() {
      $rootScope.loggedIn = false;
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbG9naW4vbG9naW5Db250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvbG9naW4vbG9naW5Db250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCBQcml2aWxlZ2UsICRjb29raWVzLCAkYWxlcnQsICRodHRwKSB7XG4gIGNvbnNvbGUubG9nKFwiQ29udHJvbGxlciBsb2FkZWRcIilcbiAgJHJvb3RTY29wZS5sb2dnZWRJbiA9ICRyb290U2NvcGUubG9nZ2VkSW4gfHwgZmFsc2U7XG4gICRzY29wZS5jcmVkcyA9IHt9O1xuICAkc2NvcGUuY3JlZHMudXNlcmlkID0gJGNvb2tpZXMudXNlcmlkO1xuICAvLyAkcm9vdFNjb3BlLmNyZWRlbnRpYWxzID0ge31cbiAgLy8gZGVjaWRlZCB0byBkZWZpbmUgdGhpcyBpbiBhcHAucnVuXG5cbiAgJHNjb3BlLmxvZ2luU3VibWl0ID0gZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZyhcIkVYSVNUSU5HIFhLRVkgSVNcIiwgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXSlcbiAgICBkZWxldGUgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXTtcbiAgICB2YXIgdGVzdCA9IFByaXZpbGVnZS5Db2Nrcygkc2NvcGUuY3JlZHMpXG4gICAgdmFyIHRlc3QyID0gdGVzdC50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgLy8gaGFuZGxlIHN1Y2Nlc3NcbiAgICAgIGNvbnNvbGUubG9nKFwiVGhlbi4uLi5cIiwgZGF0YS5kYXRhKVxuICAgICAgJHJvb3RTY29wZS5sb2dnZWRJbiA9IHRydWU7XG4gICAgICAkcm9vdFNjb3BlLiRzdGF0ZS5nbyhcImhvbWVcIik7XG4gICAgICAkcm9vdFNjb3BlLmNyZWRlbnRpYWxzLnVzZXJuYW1lID0gZGF0YS5kYXRhLnVzZXJpZDtcbiAgICAgICRyb290U2NvcGUuY3JlZGVudGlhbHMua2V5ID0gZGF0YS5kYXRhLmtleTtcbiAgICAgICRyb290U2NvcGUuY3JlZGVudGlhbHMuYWRtaW4gPSBkYXRhLmFkbWluO1xuICAgICAgJHJvb3RTY29wZS5jcmVkZW50aWFscy5ncm91cCA9IGRhdGEuZ3JvdXA7XG4gICAgICAkY29va2llcy54a2V5ID0gZGF0YS5kYXRhLmtleTtcbiAgICAgICRjb29raWVzLnVzZXJpZCA9IGRhdGEuZGF0YS51c2VyaWQ7XG4gICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWEtleSddID0gZGF0YS5kYXRhLmtleTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgLy8gaGFuZGxlIGVycm9yXG4gICAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IFwiVGl0bGVcIixcbiAgICAgICAgICBjb250ZW50OiBcImVyclwiLFxuICAgICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICB9KTtcbiAgfSlcbiAgICB2YXIgY2F0Y2hFcnJvciA9IHRlc3QuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgIHZhciBteUFsZXJ0ID0gJGFsZXJ0KHt0aXRsZTogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgY29udGVudDogZXJyLmRhdGEsXG4gICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coXCJOZXZlciBmaXJlIHRoaXMgZXJyb3JcIiwgZXJyKVxuICAgIH0pXG4gIH1cblxuICAkc2NvcGUubG9nT3V0ID0gZnVuY3Rpb24oKXtcbiAgICAkcm9vdFNjb3BlLmxvZ2dlZEluID0gZmFsc2U7XG4gIH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=