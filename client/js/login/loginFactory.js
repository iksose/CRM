angular.module('uiRouterSample')
.factory('Privilege', function ($resource, $http, $q) {
  console.log("Factory loaded")
        return {
          Recipe:  $resource('/recipes/:id', {id: '@id'}),
          Users:   $resource('/users/:id', {id: '@id'}),
          Group:   $resource('/groups/:id', {id: '@id'}),
          Login:   $resource('http://10.1.1.118:8000/api/Auth', {userId: '@id'},{
              'query':{
                method:'POST',
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                isArray:false
              }
            }),
          Example: $resource('api/users/:userId/privileges', {userId: '@id'},{
              'query':{
                method:'GET', isArray:false
              }
            }),
          Cocks: function(alpha, beta){
          let local = "blargh gargh";
          console.log("POST DUDE", alpha, beta)
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
          }
        }
});
