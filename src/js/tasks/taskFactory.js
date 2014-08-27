angular.module('uiRouterSample')
    .factory('taskFactory',
        function($http) {
            return {
                getUsers: function() {
                    return $http.get('http://10.1.1.118:8000/api/users')
                }
            };
        });
