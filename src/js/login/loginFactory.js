angular.module('uiRouterSample')
    .factory('Privilege', function($resource, $http, $q, $cookies) {
        console.log("Factory loaded")
        return {
            Login: function(creds) {
                console.log("POST DUDE", creds)
                delete $http.defaults.headers.common['XKey'];
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
            },
            SetSession: function(xkey: string, user: string) {
                $cookies.xkey = xkey
                $cookies.userid = user
                $http.defaults.headers.common['XKey'] = xkey
            }
        }
    });
