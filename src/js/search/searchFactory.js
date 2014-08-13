// angular.module('uiRouterSample')
// .factory('searchFactory',
//  function ($http) {
//     return {
//         search: function(paramsObj){
//           return $http.get('http://10.1.1.118:8000/api/Prospect', {params: paramsObj } )
//         }
//     };
//   }
// );

angular.module('uiRouterSample')
.factory('searchFactory',
    function ($http, $location) {
    return {
        search: function(paramsObj){
            var borrowedTime = window.location.hash.split("search")[1]
            return $http.get('http://10.1.1.118:8000/api/Prospect' + borrowedTime )
        }
    };
  }
);
