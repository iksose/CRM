angular.module('uiRouterSample')
    .controller('taskController', function($scope, hubFactory, TaskService) {
        console.log("Task Controller loaded")

        // $scope.tasks = new TaskList([]);
        $scope.tasks = TaskService.TaskList

        window.dicks = $scope.tasks;

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
                    $scope.tasks = arrCopy.map(T => new Task(T));
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
        }


    })
