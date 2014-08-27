angular.module('uiRouterSample')
    .service('LoginService', function($cookies, $http, Privilege) {
        class User {
            constructor(obj) {
                Object.assign(this, obj);
            }
            get user() {
                return this.userid;
            }
        }
        var LoginService = {}
        LoginService.setUser = function(user) {
            LoginService.user = new User(user);
            Privilege.SetSession(user.key, this.user.user, this.user)
        }
        LoginService.cookie_user = function() {
            return $cookies.userid;
        }
        // LoginService.user = new User({});
        return LoginService;
    });
