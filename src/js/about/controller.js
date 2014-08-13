angular.module('uiRouterSample')
.controller('aboutController', function($scope, $rootScope, hubFactory) {
    console.log("About controller")

    var [methods, promise] = hubFactory;
    promise.then(function(){
        console.log("Double done")
        // get all events
        methods.map().then(function(data){
            console.log("Cranked", data)
        })

        // var start = new Date().getTime();
        // // for(var i = 0; i < 1000; i++){
        //     methods.wtf2();
        // // }
        // var end = new Date().getTime();
        // var time = end - start;
        // console.error('Execution time: ' + time);
    })

})
