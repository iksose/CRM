define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('landingController', function($scope, $rootScope, $state, Tasks) {
    console.log("Landing Controller");
    if (!$rootScope.loggedIn) {
      console.log("Not logged in, redirect");
      $state.go("login");
    }
    $scope.dropdown = [{
      "text": "New Campaign",
      "click": '$state.go("home.campaign.new")'
    }, {
      "text": "Saved Campaigns",
      "click": '$state.go("home.campaign")'
    }];
    $scope.inMarketing = false;
    if ($rootScope.credentials.group == "Marketing") {
      $scope.inMarketing = true;
      var thisUsersGroup = $rootScope.credentials;
      $scope.allTasks = [];
      var fetch = Tasks.myTasks(thisUsersGroup);
      var showTasks = fetch.then(function(data) {
        console.log("Show tasks....", data);
        $scope.allTasks = data.data;
      });
    }
    window.setInterval(function() {
      var entries = window.performance.getEntries();
      entries = entries.sort(function(a, b) {
        return b.duration - a.duration;
      });
      $rootScope.metrics = entries;
    }, 500);
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbGFuZGluZy9sYW5kaW5nQ29udHJvbGxlci5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL2xhbmRpbmcvbGFuZGluZ0NvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdsYW5kaW5nQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBUYXNrcykge1xuICBjb25zb2xlLmxvZyhcIkxhbmRpbmcgQ29udHJvbGxlclwiKVxuICAvLyBQYXNzZWQgaW4gVGFza3MgZmFjdG9yeS4uLndlJ2xsIGhhbmRsZSBpdCBhbGwgaGVyZSBmb3Igbm93XG5cbiAgaWYoISRyb290U2NvcGUubG9nZ2VkSW4pe1xuICAgIGNvbnNvbGUubG9nKFwiTm90IGxvZ2dlZCBpbiwgcmVkaXJlY3RcIilcbiAgICAkc3RhdGUuZ28oXCJsb2dpblwiKTtcbiAgfVxuXG4gICRzY29wZS5kcm9wZG93biA9IFtcbiAge1xuICAgIFwidGV4dFwiOiBcIk5ldyBDYW1wYWlnblwiLFxuICAgIFwiY2xpY2tcIjogJyRzdGF0ZS5nbyhcImhvbWUuY2FtcGFpZ24ubmV3XCIpJ1xuICB9LFxuICB7XG4gICAgXCJ0ZXh0XCI6IFwiU2F2ZWQgQ2FtcGFpZ25zXCIsXG4gICAgXCJjbGlja1wiOiAnJHN0YXRlLmdvKFwiaG9tZS5jYW1wYWlnblwiKSdcbiAgfVxuICAvLyB7XG4gIC8vICAgXCJkaXZpZGVyXCI6IHRydWVcbiAgLy8gfSxcbiAgLy8ge1xuICAvLyAgIFwidGV4dFwiOiBcIk5ldyBRdWVyeVwiLFxuICAvLyAgIFwiY2xpY2tcIjogJyRzdGF0ZS5nbyhcImhvbWUucXVlcnlcIiknXG4gIC8vIH1cblxuXTtcblxuXG4kc2NvcGUuaW5NYXJrZXRpbmcgPSBmYWxzZVxuXG5cbmlmKCRyb290U2NvcGUuY3JlZGVudGlhbHMuZ3JvdXAgPT0gXCJNYXJrZXRpbmdcIil7XG4gICRzY29wZS5pbk1hcmtldGluZyA9IHRydWU7XG5cbiAgLy8gZGV0ZXJtaW5lZCB0aGVpciBncm91cCwgcmVuZGVyZWQgdmlldywgbm93IHRvIGZldGNoIHRhc2tzLlxuICAvLyBkbyB3ZSB3YW50IHRvIGRvIHRoaXMgaW4gdGhlIGxhbmRpbmcgY29udHJvbGxlcj9cbiAgLy8gb3IgYSBUYXNrcyBjb250cm9sbGVyPyBXaXRoIGEgdGFza3Mgdmlldz9cbiAgdmFyIHRoaXNVc2Vyc0dyb3VwID0gJHJvb3RTY29wZS5jcmVkZW50aWFsc1xuXG4gICRzY29wZS5hbGxUYXNrcyA9IFtdXG4gIHZhciBmZXRjaCA9IFRhc2tzLm15VGFza3ModGhpc1VzZXJzR3JvdXApO1xuICB2YXIgc2hvd1Rhc2tzID0gZmV0Y2gudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3cgdGFza3MuLi4uXCIsIGRhdGEpXG4gICAgJHNjb3BlLmFsbFRhc2tzID0gZGF0YS5kYXRhXG4gIH0pXG5cbn1cblxuXG4vLyAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbigpe1xuLy8gICB2YXIgZW50cmllcyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzKCk7XG4vL1xuLy8gICAgICAgZW50cmllcyA9IGVudHJpZXMuc29ydCggZnVuY3Rpb24oIGEsIGIgKSB7XG4vLyAgICAgICAgICAgcmV0dXJuIGIuZHVyYXRpb24gLSBhLmR1cmF0aW9uO1xuLy8gICAgICAgfSApO1xuLy9cbi8vICAgICAgICRyb290U2NvcGUubWV0cmljcyA9IGVudHJpZXM7XG4vLyAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVOVFJJRVNcIiwgZW50cmllc1swXSlcbi8vICAgICAgIC8vIGNvbnNvbGUudGFibGUoXG4vLyAgICAgICAvLyAgICAgZW50cmllcywgWyAnbmFtZScsICdkdXJhdGlvbicgXVxuLy8gICAgICAgLy8gKTtcbi8vXG4vLyAgICAgfSlcblxud2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbnRyaWVzID0gd2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXMoKTtcblxuICAgICAgICBlbnRyaWVzID0gZW50cmllcy5zb3J0KCBmdW5jdGlvbiggYSwgYiApIHtcbiAgICAgICAgICAgIHJldHVybiBiLmR1cmF0aW9uIC0gYS5kdXJhdGlvbjtcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRyb290U2NvcGUubWV0cmljcyA9IGVudHJpZXM7XG59LCA1MDApO1xuXG5cblxuXG59KVxuXG5cbi8vICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKCl7XG4vL1xuLy8gfSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==