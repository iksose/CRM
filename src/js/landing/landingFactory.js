angular.module('uiRouterSample')
.factory('Tasks',
 function ($http) {
    return {
        queryResults:function (url, callback) {
            return $http.get('/api/campaigns')
        },
        myTasks:function (data) {
            console.log("Factory TASKS getting myTasks..", data)
            return $http.post('/api/usertasks', data)
        },
        taskDetails:function (data) {
            console.log("Factory TASKS getting details..", data)
            return $http.post('/api/taskdetails', data)
        },
        allTasks: function(){
          console.log("Factory tasks returning every task...")
          return $http.get('/api/alltasks')
        },
        taskProspect: function(){
          // this would be a post with like, taskID == prospect.taskID
          return $http.get('/api/randomProspect')
        }
    };
  });
