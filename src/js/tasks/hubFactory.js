angular.module('uiRouterSample')
    .factory('hubFactory', function($rootScope, Hub, $q, TaskService) {

        //declaring the hub connection
        var hub = new Hub('activityQueueHub', {
            // var hub = new Hub('moveShapeHub', {

            //client side methods
            listeners: {
                'taskWorking': function(info) {
                    console.log("a task status was changed....", info);
                    var task = TaskService.TaskList.find(x => x.ActivityID == info.ActivityID)
                    task.Status = info.Status;
                    TaskService.FindUser(info.UserID).Task = task
                    $rootScope.$apply();
                },
                'userJoined': function(user) {
                    console.log("User joined", user)
                    TaskService.UserList.push(user);
                    $rootScope.$apply();
                },
                'userLeft': function(user) {
                    console.log("User left", user)
                    TaskService.UserList.remove(user.UserID);
                    $rootScope.$apply();
                }
            },

            // rootPath: "http://10.1.1.226/signalr",
            rootPath: "http://10.1.1.118:8000/signalr",

            //server side methods
            methods: ['GetTasks', 'changeTaskStatusD', 'WhoAmI', 'ChangeTaskStatus', 'TimeUntilNextFill'],

            //query params sent on initial connection
            // queryParams:{
            //     'token': 'exampletoken'
            // }

        })

        var TimeUntilNextFill = function() {
            var def = $q.defer();
            console.log("get time until next fill")
            hub.TimeUntilNextFill().then(function(data) {
                console.log("res", data)
                def.resolve(data)
            })
            return def.promise;
        }

        var deferred = $q.defer();
        hub.init().then(function(res) {
            if (res._subscribedToHubs) {
                deferred.resolve()
            } else {
                deferred.reject();
            }
        })

        //moveShapeHub.invoke('updateModel', shapeModel)

        var getCurrent = function() {
            var def = $q.defer();
            console.log("get current")
            hub.hello_Im_Connected(shapeModel).then(function(data) {
                def.resolve()
            })
            return def.promise;
        }

        var getUser = function() {
            var def = $q.defer();
            console.log("get WhoAmI")
            hub.WhoAmI("pbajoj").then(function(users) {
                TaskService.UserList.push(...users);
                users.forEach(function(user) {
                    TaskService.FindUser(user.UserID).online = true;
                })
                $rootScope.$apply();
                def.resolve()
            })
            return def.promise;
        }

        var ChangeTaskStatus = function(activityID, status) {
            var def = $q.defer();
            hub.ChangeTaskStatus(activityID, status).then(function(data) {
                console.log("Done changing status")
                def.resolve()
            })
            return def.promise;
        }


        var GetTasks = function() {
            console.log("Getting tasks")
            var def = $q.defer();
            hub.GetTasks().then(function(data) {
                def.resolve(data)
            })
            return def.promise;
        }

        return [{
                map: getCurrent,
                WhoAmI: getUser,
                GetTasks: GetTasks,
                ChangeTaskStatus: ChangeTaskStatus,
                TimeUntilNextFill: TimeUntilNextFill
            },
            deferred.promise
        ]


    });
