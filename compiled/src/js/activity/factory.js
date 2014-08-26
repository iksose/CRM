define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('activityFactory', function($http) {
    var activityFactory = {};
    var activityMethods = {saveActivity: function(campaignID, activity) {
        console.log("campaignID", campaignID);
        console.log("Activity", activity);
        return $http.post('http://10.1.1.118:8000/api/Campaign/' + campaignID + '/Activity', $.param(activity));
      }};
    return [activityFactory, activityMethods];
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYWN0aXZpdHkvZmFjdG9yeS5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL2FjdGl2aXR5L2ZhY3RvcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdhY3Rpdml0eUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHZhciBhY3Rpdml0eUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgYWN0aXZpdHlNZXRob2RzID0ge1xuICAgICAgICBzYXZlQWN0aXZpdHk6IGZ1bmN0aW9uKGNhbXBhaWduSUQsIGFjdGl2aXR5KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FtcGFpZ25JRFwiLCBjYW1wYWlnbklEKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3Rpdml0eVwiLCBhY3Rpdml0eSlcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9DYW1wYWlnbi8nK2NhbXBhaWduSUQrJy9BY3Rpdml0eScsICQucGFyYW0oYWN0aXZpdHkpICk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFthY3Rpdml0eUZhY3RvcnksIGFjdGl2aXR5TWV0aG9kc11cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9