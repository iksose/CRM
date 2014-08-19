angular.module('uiRouterSample')
    .factory('taskFactory',
        // now Research Factory
        function($http) {
            return {
                queryResults: function(url, callback) {
                    console.log("Getting query with params ", url)
                    return $http.get('http://10.1.1.118:8000/api/Research?State=MO&ProductID=1')
                }
            };
        }
);
