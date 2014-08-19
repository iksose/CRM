angular.module('uiRouterSample')
    .controller('taskController', function($scope, hubFactory) {
        console.log("Task Controller loaded")

        $scope.tasks = []

        var [methods, init] = hubFactory;
        init.then(function() {
            console.log("Double done")
            // get all events
            methods.WhoAmI().then(function() {
                console.log("told server who we are")
                methods.GetTasks().then(function(res) {
                    console.log("Got tasks", res)
                    // todo res.Tasks is an assosciative array
                    // $scope.tasks = res.Tasks.map(T => new Task(T));
                    // console.log("Done son", $scope.tasks)
                    // turn associative array into regular array
                    assMap(res.Tasks)
                    $scope.tasks = arrCopy.map(T => new Task(T));
                    console.log("scope tasks", $scope.tasks)
                })
            })
        }).catch(function() {
            console.log("Fudge")
        })

        // turn associative array into regular array
        var arrCopy = []

        function assMap(map) {
            for (var key in map) {
                arrCopy.push(map[key])
            }
        }

        $scope.showTasks = false;
        $scope.popTasks = function() {
            $scope.showTasks = !$scope.showTasks ? true : false;
        }

        $scope.navigate = function(event) {
            console.log("Event", event)
            event.preventDefault();
            event.stopPropagation();
            return false;
        }


    })
