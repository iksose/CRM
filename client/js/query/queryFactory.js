angular.module('uiRouterSample')
.factory('queryFactory',
 function ($http) {
    return {
        queryResults:function (url, callback) {
            return $http.get('/api/prospects')
        }
    };
  }
);
