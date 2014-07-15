angular.module('uiRouterSample')
.factory('searchFactory',
 function ($http) {
    return {
        search: function(paramsObj){
          return $http.get('http://10.1.1.118:8000/api/Prospect', {params: paramsObj } )
        }
    };
  }
);
