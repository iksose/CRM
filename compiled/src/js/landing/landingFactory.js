define([], function() {
  "use strict";
  angular.module('uiRouterSample').factory('Tasks', function($http) {
    return {
      queryResults: function(url, callback) {
        return $http.get('/api/campaigns');
      },
      myTasks: function(data) {
        console.log("Factory TASKS getting myTasks..", data);
        return $http.post('/api/usertasks', data);
      },
      taskDetails: function(data) {
        console.log("Factory TASKS getting details..", data);
        return $http.post('/api/taskdetails', data);
      },
      allTasks: function() {
        console.log("Factory tasks returning every task...");
        return $http.get('/api/alltasks');
      },
      taskProspect: function() {
        return $http.get('/api/randomProspect');
      }
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbGFuZGluZy9sYW5kaW5nRmFjdG9yeS5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL2xhbmRpbmcvbGFuZGluZ0ZhY3RvcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdUYXNrcycsXG4gZnVuY3Rpb24gKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcXVlcnlSZXN1bHRzOmZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NhbXBhaWducycpXG4gICAgICAgIH0sXG4gICAgICAgIG15VGFza3M6ZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFjdG9yeSBUQVNLUyBnZXR0aW5nIG15VGFza3MuLlwiLCBkYXRhKVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcnRhc2tzJywgZGF0YSlcbiAgICAgICAgfSxcbiAgICAgICAgdGFza0RldGFpbHM6ZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFjdG9yeSBUQVNLUyBnZXR0aW5nIGRldGFpbHMuLlwiLCBkYXRhKVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdGFza2RldGFpbHMnLCBkYXRhKVxuICAgICAgICB9LFxuICAgICAgICBhbGxUYXNrczogZnVuY3Rpb24oKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhY3RvcnkgdGFza3MgcmV0dXJuaW5nIGV2ZXJ5IHRhc2suLi5cIilcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FsbHRhc2tzJylcbiAgICAgICAgfSxcbiAgICAgICAgdGFza1Byb3NwZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHRoaXMgd291bGQgYmUgYSBwb3N0IHdpdGggbGlrZSwgdGFza0lEID09IHByb3NwZWN0LnRhc2tJRFxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcmFuZG9tUHJvc3BlY3QnKVxuICAgICAgICB9XG4gICAgfTtcbiAgfSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=