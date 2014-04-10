angular.module('uiRouterSample')
.factory('Privilege', function ($resource, $http, $q) {
  console.log("Factory loaded")
        return {
          Recipe:  $resource('/recipes/:id', {id: '@id'}),
          Users:   $resource('/users/:id', {id: '@id'}),
          Group:   $resource('/groups/:id', {id: '@id'}),
          Login:   $resource('api/login/:userID', {userId: '@id'},{
              'query':{
                method:'POST', isArray:false
              }
            }),
          Example: $resource('api/users/:userId/privileges', {userId: '@id'},{
              'query':{
                method:'GET', isArray:false
              }
            }),
          Cocks: function(alpha, beta){
          let local = "blargh gargh";
          console.log("POST DUDE", local)
            $http({
                method: 'POST',
                url: '/dmz/login',
                // data: params,
                params: local,
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
          }
        }
});
