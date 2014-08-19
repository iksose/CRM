angular.module('uiRouterSample')
    .factory('Privilege', function($resource, $http, $q) {
        console.log("Factory loaded")
        return {
            Login: function(creds) {
                console.log("POST DUDE", creds)
                return $http({
                    method: 'POST',
                    url: 'http://10.1.1.118:8000/api/Auth',
                    data: $.param(creds),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            },
            Logout: function() {
                console.log("Todo")
            }
        }
    });
