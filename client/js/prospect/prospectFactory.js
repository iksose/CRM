angular.module('uiRouterSample')
.factory('prospectFactory',
 function ($http) {
    return {
        getProspect_by_ID: function(){
          return $http.get('/api/prospect')
        }
    };
  }
);
