angular.module('uiRouterSample')
.factory('alertFactory',
// now Research Factory
 function ($alert) {
    return {
        alerts: function(message){
          console.log("Alert", message)
          var myAlert = $alert({title: message.config.url,
          content: message.statusText,
          placement: 'top',
          type: 'danger',
          show: true,
          keyboard: true,
          duration: 3
          // container: "body"
        });
        }
    };
  }
);
