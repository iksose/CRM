angular.module('uiRouterSample')
    .controller('taskController', function($scope, hubFactory, TaskService) {
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

        // $scope.tasks.push("Tres")

        // console.log($scope.tasks)
        // console.log($scope.tasks.length)


        var [methods, init] = hubFactory;
        init.then(function() {
            console.log("Double done")
            // register username with server
            methods.WhoAmI().then(function() {
                console.log("told server who we are")
                methods.GetTasks().then(function(res) {
                    console.log("Got tasks", res)
                    // todo res.Tasks is an assosciative array
                    // $scope.tasks = res.Tasks.map(T => new Task(T));
                    // console.log("Done son", $scope.tasks)
                    // turn associative array into regular array
                    assMap(res.Tasks);
                    // $scope.tasks.add(arrCopy.map(T => new Task(T)))
                    $scope.tasks.add(arrCopy)
                    // console.log(TaskService.TaskList)
                })
            })
        }).catch(function() {
            console.log("Fudge")
        })

        // turn associative array into regular array
        var arrCopy = []

        function assMap(map) {
            for (var key in map) {
                arrCopy.push(map[key]);
            }
        }

        $scope.showTasks = false;
        $scope.popTasks = function() {
            $scope.showTasks = !$scope.showTasks ? true : false;
        }

        $scope.navigate = function($event, activityID: number) {
            console.log("activity ID", activityID)
            $event.preventDefault();
            $event.stopPropagation();
            $scope.tasks.remove(activityID)
            console.log($scope.tasks)
        }

        // function markComplete() {

        // }


    })
