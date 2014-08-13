angular.module('uiRouterSample')
.factory('prospectFactory',
 function ($http) {
    return {
        getProspect_by_ID: function(prospect){
          return $http.get('http://10.1.1.118:8000/api/prospect/'+prospect.ProspectID)
        }
    };
  }
);
