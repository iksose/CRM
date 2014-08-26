define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('taskController', function($scope, $rootScope, $state, Tasks) {
    console.log("Task Controller", $state);
    $scope.singleTask = {};
    $scope.everyTask = [];
    $scope.workingProspect = {};
    $scope.singleTaskBool = false;
    $scope.everyTaskBool = false;
    $scope.taskTypeBulk = false;
    $scope.taskTypeSingle = false;
    if ($state.params.taskID !== "") {
      console.log("Show specific task", $state.params.taskID);
      var getSingleTask = Tasks.taskDetails($state.params);
      var displaySingleTask = getSingleTask.then(function(data) {
        console.log("Got single task", data);
        $scope.singleTask = data.data;
        $scope.singleTaskBool = true;
        if (data.data.taskName.toLowerCase() == "bulk activity") {
          $scope.taskTypeBulk = true;
        } else {
          $scope.taskTypeSingle = true;
          Tasks.taskProspect().then(function(data) {
            console.log("My working prospect is...", data.data);
            $scope.workingProspect = data.data;
          });
        }
      });
    } else {
      console.log("Not enough params, just show all tasks?");
      var everyTask = Tasks.allTasks().then(function(data) {
        console.log("Got everything! ", data.data);
        $scope.everyTask = data.data;
        $scope.everyTaskBool = true;
      });
    }
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvdGFza3MvdGFza0NvbnRyb2xsZXIuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy90YXNrcy90YXNrQ29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ3Rhc2tDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIFRhc2tzKSB7XG4gIGNvbnNvbGUubG9nKFwiVGFzayBDb250cm9sbGVyXCIsICRzdGF0ZSlcblxuICAkc2NvcGUuc2luZ2xlVGFzayA9IHt9O1xuICAkc2NvcGUuZXZlcnlUYXNrID0gW107XG4gICRzY29wZS53b3JraW5nUHJvc3BlY3QgPSB7fTtcbiAgJHNjb3BlLnNpbmdsZVRhc2tCb29sID0gZmFsc2U7XG4gICRzY29wZS5ldmVyeVRhc2tCb29sID0gZmFsc2U7XG4gICRzY29wZS50YXNrVHlwZUJ1bGsgPSBmYWxzZTtcbiAgJHNjb3BlLnRhc2tUeXBlU2luZ2xlID0gZmFsc2U7XG5cbiAgaWYoJHN0YXRlLnBhcmFtcy50YXNrSUQgIT09IFwiXCIpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvdyBzcGVjaWZpYyB0YXNrXCIsICRzdGF0ZS5wYXJhbXMudGFza0lEKVxuICAgIC8vIFdlIGhpdCB0aGUgREIgd2l0aCB0aGUgdGFza0lEIGFuZCByZXR1cm4gdGhlIFRhc2tcbiAgICAvLyBBbHNvLCBmcm9tIHRoZSBmcm9udCBwYWdlLCBjb3VsZCB3ZSBwYXNzIGFuIG9iamVjdD9cbiAgICAvLyBBbmQgY2hlY2sgaWYgaXQgZXhpc3RzIGJlZm9yZSByZXRyaXBwaW5nIHRvIHRoZSBEQj9cbiAgICB2YXIgZ2V0U2luZ2xlVGFzayA9IFRhc2tzLnRhc2tEZXRhaWxzKCRzdGF0ZS5wYXJhbXMpO1xuICAgIHZhciBkaXNwbGF5U2luZ2xlVGFzayA9IGdldFNpbmdsZVRhc2sudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiR290IHNpbmdsZSB0YXNrXCIsIGRhdGEpXG4gICAgICAkc2NvcGUuc2luZ2xlVGFzayA9IGRhdGEuZGF0YVxuICAgICAgJHNjb3BlLnNpbmdsZVRhc2tCb29sID0gdHJ1ZVxuICAgICAgaWYoZGF0YS5kYXRhLnRhc2tOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJidWxrIGFjdGl2aXR5XCIpe1xuICAgICAgICAkc2NvcGUudGFza1R5cGVCdWxrID0gdHJ1ZTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkc2NvcGUudGFza1R5cGVTaW5nbGUgPSB0cnVlO1xuICAgICAgICAvLyBOb3cgd2UgbmVlZCB0byBnZXQgdGhhdCBvbmUgcHJvc3BlY3QgdGhleSdyZSB3b3JraW5nXG4gICAgICAgIC8vIHRoaXMgaXMgZG9uZSBieSBzZXJ2ZXIgbWFnaWNcbiAgICAgICAgLy8gcHJlc3VtYWJseSB3ZSBwYXNzIGEgdGFza0lEXG4gICAgICAgIFRhc2tzLnRhc2tQcm9zcGVjdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJNeSB3b3JraW5nIHByb3NwZWN0IGlzLi4uXCIsIGRhdGEuZGF0YSlcbiAgICAgICAgICAkc2NvcGUud29ya2luZ1Byb3NwZWN0ID0gZGF0YS5kYXRhO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1lbHNle1xuICAgIGNvbnNvbGUubG9nKFwiTm90IGVub3VnaCBwYXJhbXMsIGp1c3Qgc2hvdyBhbGwgdGFza3M/XCIpXG4gICAgdmFyIGV2ZXJ5VGFzayA9IFRhc2tzLmFsbFRhc2tzKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiR290IGV2ZXJ5dGhpbmchIFwiLCBkYXRhLmRhdGEpXG4gICAgICAkc2NvcGUuZXZlcnlUYXNrID0gZGF0YS5kYXRhXG4gICAgICAkc2NvcGUuZXZlcnlUYXNrQm9vbCA9IHRydWU7XG4gICAgfSlcbiAgfVxuXG5cbn0pXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=