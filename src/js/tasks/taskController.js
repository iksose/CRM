angular.module('uiRouterSample')
    .controller('taskController', function($scope, TaskService, $state) {
        console.log("Task Controller loaded")

        // $scope.tasks = new TaskList([]);
        $scope.tasks = TaskService.TaskList
        // $scope.tasksMap = TaskService.TaskMap;

        // console.log($scope.tasks)

        // $scope.tasks.push(1)

        // console.log($scope.tasks)

        // // $scope.tasks.poop();

        // // $scope.tasks.push(2)

        // // console.log($scope.tasks.length)

        // // $scope.tasks.forEach(function(num) {
        // //     console.log("Ha", num)
        // // })

        // // // $scope.tasks = TaskService.TaskList("uno", "dos")

        // $scope.tasks.add(["Uno", "Dos"])

        var task = {}
        task.Descr = "Sample descr"
        $scope.tasks.push(task)

        // console.log($scope.tasks)
        // console.log($scope.tasks.length)


        // var [methods, init] = hubFactory;
        // init.then(function() {
        //     console.log("Double done")
        //     // register username with server
        //     methods.WhoAmI().then(function() {
        //         console.log("told server who we are")
        //         methods.GetTasks().then(function(res) {
        //             console.log("Got tasks", res)
        //             $scope.tasks.add(res)
        //         })
        //     })
        // }).catch(function() {
        //     console.log("Fudge")
        // })

        $scope.showTasks = false;
        $scope.popTasks = function() {
            $scope.showTasks = !$scope.showTasks ? true : false;
        }

        $scope.navigate = function(prospectID: number) {
            // console.log("activity ID", activityID)
            // $event.preventDefault();
            // $event.stopPropagation();
            // $scope.tasks.remove(activityID)
            // console.log($scope.tasks)
            // console.log("Passed", prospectID)
            $state.go('home.prospect', {
                ProspectID: prospectID
            })
        }

        $scope.ChangeTaskStatus = function(activityID, status) {
            console.log("activity id", activityID)
            // methods.ChangeTaskStatus(activityID, status)
        }

        // function markComplete() {

        // }





    })
