angular.module('uiRouterSample')
    .controller('aboutController', function($scope, $rootScope, $http) {
        console.log("About controller")
        $scope.dataset = [5, 10, 15, 20, 25];

        $scope.inc = function() {
            $scope.dataset[4]++;
            console.log($scope.dataset)
        }
    })
