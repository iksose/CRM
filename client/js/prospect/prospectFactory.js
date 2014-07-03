angular.module('uiRouterSample')
.factory('prospectFactory',
 function ($http) {
    return {
        getProspect_by_ID: function(){
          return $http.get('http://10.1.1.118:8000/api/prospect/1')
        }
    };
  }
);
