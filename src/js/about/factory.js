angular.module('uiRouterSample')
    .factory('hubFactory', function($rootScope, Hub, $q) {

        //declaring the hub connection
        var hub = new Hub('activityQueueHub', {
            // var hub = new Hub('moveShapeHub', {

            //client side methods
            listeners: {
                'updateShape': function(model) {
                    console.log("Changed", model)
                },
                'unlockEmployee': function(id) {
                    var employee = find(id);
                    employee.Locked = false;
                    $rootScope.$apply();
                }
            },

            // rootPath:"http://10.1.1.226/signalr",
            rootPath: "http://10.1.1.118:8000/signalr",

            //server side methods
            methods: ['lock', 'unlock', 'hello_Im_Connected', 'GetTasks', 'changeTaskStatusD', 'WhoAmI'],

            //query params sent on initial connection
            // queryParams:{
            //     'token': 'exampletoken'
            // }

        })

        var deferred = $q.defer();
        hub.init().then(function(res) {
            if (res._subscribedToHubs) {
                deferred.resolve()
            } else {
                deferred.reject();
            }
        })

        //moveShapeHub.invoke('updateModel', shapeModel)

        var shapeModel = {
            left: 0,
            top: 0
        }

        var edit = function(employee) {
            hub.lock(employee.Id); //Calling a server method
        };
        var done = function(employee) {
            hub.unlock(employee.Id); //Calling a server method
        }

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
            hub.WhoAmI("pbajoj").then(function(data) {
                def.resolve()
            })
            return def.promise;
        }

        var richardsmethod = function() {
            console.log("Start")
            var counter = 0
            var start = new Date().getTime();
            // console.log("Calling richard's")
            for (var i = 0; i < 1000; i++) {
                hub.changeTaskStatusD('4', '1').then(function(data) {
                    //
                    // for(var i = 0; i < 1; i++){
                    hub.getTasks('pbamrb').then(function(data) {
                        counter++
                        if (counter == 1000) {
                            var end = new Date().getTime();
                            var time = end - start;
                            console.log('Execution time from inside: ' + time);
                        }
                    })
                    // }
                })
            }
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time outside: ' + time);
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
                editEmployee: edit,
                doneWithEmployee: done,
                map: getCurrent,
                map2: richardsmethod,
                WhoAmI: getUser,
                GetTasks: GetTasks
            },
            deferred.promise
        ]


    });
