angular.module('uiRouterSample')
    .controller('loginController', function($scope, $state, Privilege, LoginService) {
        console.log("Controller loaded")
        $scope.creds = {};
        $scope.creds.userid = LoginService.cookie_user
        $scope.loginSubmit = function() {
            Privilege.Login($scope.creds).then((data) => {
                LoginService.setUser(data.data)
                $state.go("home");
            }).catch((err) => {
                // do something
            })
        }

    });
