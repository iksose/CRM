define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('navbarSearcher', function($scope, $rootScope, $state, $alert, prospectFactory) {
    console.log("Hello navbar");
    $scope.popover = {
      "title": "Title",
      "content": "Hello Popover<br />This is a multiline message!"
    };
    $scope.doodo = function() {
      console.log("Doo");
    };
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
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWlzYy9uYXZiYXJfc2VhcmNoLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvbWlzYy9uYXZiYXJfc2VhcmNoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignbmF2YmFyU2VhcmNoZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0LCBwcm9zcGVjdEZhY3RvcnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIkhlbGxvIG5hdmJhclwiKVxuICAgICRzY29wZS5wb3BvdmVyID0ge1xuICAgICAgXCJ0aXRsZVwiOiBcIlRpdGxlXCIsXG4gICAgICBcImNvbnRlbnRcIjogXCJIZWxsbyBQb3BvdmVyPGJyIC8+VGhpcyBpcyBhIG11bHRpbGluZSBtZXNzYWdlIVwiXG4gICAgfTtcblxuICAgICRzY29wZS5kb29kbyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRG9vXCIpXG4gICAgfVxuXG4gICAgJHNjb3BlLmJ1dHRvbiA9IHtcbiAgXCJ0b2dnbGVcIjogZmFsc2UsXG4gIFwiY2hlY2tib3hcIjoge1xuICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICBcIm1pZGRsZVwiOiB0cnVlLFxuICAgIFwicmlnaHRcIjogZmFsc2VcbiAgfSxcbiAgXCJyYWRpb1wiOiAyXG59O1xuXG5cbiRzY29wZS5jb2xvciA9ICdibHVlJztcbiAgICAgICRzY29wZS5zcGVjaWFsVmFsdWUgPSB7XG4gICAgICAgIFwiaWRcIjogXCIxMjM0NVwiLFxuICAgICAgICBcInZhbHVlXCI6IFwiZ3JlZW5cIlxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnBvcG92ZXIgPSB7XG4gIFwidGl0bGVcIjogXCJDb2Nrc1wiLFxuICBcImNvbnRlbnRcIjogXCJIZWxsbyBQb3BvdmVyPGJyIC8+VGhpcyBpcyBhIG11bHRpbGluZSBtZXNzYWdlIVwiXG59O1xuXG59KVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9