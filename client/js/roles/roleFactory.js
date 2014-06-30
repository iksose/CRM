angular.module('uiRouterSample')
.factory('rolesFactory',
// now Research Factory
 function ($http) {
    return {
        listRoles:function () {
          return $http.get('http://10.1.1.118:8000/api/Roles' )
        },
        getUsers:function(){
          return $http.get('http://10.1.1.118:8000/api/users')
        },
        addRole:function(user, roleID){
          return $http.post('http://10.1.1.118:8000/api/users/'+user+'/Roles/'+roleID)
        }
    };
  }
);
