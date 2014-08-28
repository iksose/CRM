angular.module('uiRouterSample')
    .controller('taskController', function($scope, TaskService, $state, hubFactory) {
        console.log("Task Controller loaded")

        $scope.tasks = TaskService.TaskList;
        $scope.users = TaskService.UserList;
        $scope.departments = TaskService.Departments;

        $scope.depCollapseOnline = false;

        $scope.depCollapse = true;

        $scope.groups = TaskService.Groups;

        var [methods, init] = hubFactory;
        init.then(function() {
            console.log("Double done")
            // register username with server
            methods.WhoAmI().then(function() {
                console.log("told server who we are")
                methods.GetTasks().then(function(tasks) {
                    console.log("Got tasks", tasks)
                    // $scope.tasks.add(res)
                    $scope.tasks.push(...tasks)
                })
            })
        }).catch(function() {
            console.log("Fudge")
        })

        $scope.showTasks = false;
        $scope.popTasks = function() {
            $scope.showTasks = !$scope.showTasks ? true : false;
        }

        $scope.showUsers = false;
        $scope.popUsers = function() {
            console.log("Show users")
            $scope.showUsers = !$scope.showUsers ? true : false;
        }

        $scope.showTaskOptions = false;
        $scope.prospectID;
        $scope.navigate = function(prospectID: number, Status: number) {
            if (Status > 0) {
                console.log("No go, it's being worked already")
                return;
            }
            $scope.showTaskOptions = true;
            $scope.prospectID = prospectID
            $state.go('home.prospect', {
                ProspectID: prospectID
            })
        }

        $scope.ChangeTaskStatus = function(activityID, status) {
            console.log("activity id", activityID, "status", status)
            if (status == 0) {
                status++;
            } else {
                status--;
            }
            methods.ChangeTaskStatus(activityID, status)
        }

        $scope.userMethod = function(user) {
            console.log("user", user)
        }
    })
