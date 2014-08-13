angular.module('uiRouterSample')
.factory('Privilege', function ($resource, $http, $q) {
  console.log("Factory loaded")
        return {
          Login: function(alpha, beta){
          let local = "blargh gargh";
          console.log("POST DUDE", alpha, beta, local)
            return $http({
                method: 'POST',
                url: 'http://10.1.1.118:8000/api/Auth',
                // data: 'applicationId=3',
                data: $.param(alpha),
                // data: 'test2=durp',
                // data: JSON.stringify(alpha),
                // params: local,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
          },
          Logout: function(){
            console.log("Todo")
          }
        }
});
