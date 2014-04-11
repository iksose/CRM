angular.module('uiRouterSample')
.controller('taskController', function($scope, $rootScope, $state, Tasks) {
  console.log("Task Controller", $state)

  $scope.singleTask = {};
  $scope.everyTask = [];
  $scope.workingProspect = {};
  $scope.singleTaskBool = false;
  $scope.everyTaskBool = false;
  $scope.taskTypeBulk = false;
  $scope.taskTypeSingle = false;

  if($state.params.taskID !== ""){
    console.log("Show specific task", $state.params.taskID)
    // We hit the DB with the taskID and return the Task
    // Also, from the front page, could we pass an object?
    // And check if it exists before retripping to the DB?
    var getSingleTask = Tasks.taskDetails($state.params);
    var displaySingleTask = getSingleTask.then(function(data){
      console.log("Got single task", data)
      $scope.singleTask = data.data
      $scope.singleTaskBool = true
      if(data.data.taskName.toLowerCase() == "bulk activity"){
        $scope.taskTypeBulk = true;
      }else{
        $scope.taskTypeSingle = true;
        // Now we need to get that one prospect they're working
        // this is done by server magic
        // presumably we pass a taskID
        Tasks.taskProspect().then(function(data){
          console.log("My working prospect is...", data.data)
          $scope.workingProspect = data.data;
        })
      }
    })
  }else{
    console.log("Not enough params, just show all tasks?")
    var everyTask = Tasks.allTasks().then(function(data){
      console.log("Got everything! ", data.data)
      $scope.everyTask = data.data
      $scope.everyTaskBool = true;
    })
  }


})
