define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('timelineController', function($scope, $rootScope, $state, Tasks) {
    console.log("TIMELINE");
    $scope.myData = [{
      name: 'AngularJS',
      count: 300
    }, {
      name: 'D3.JS',
      count: 150
    }, {
      name: 'jQuery',
      count: 400
    }, {
      name: 'Backbone.js',
      count: 300
    }, {
      name: 'Ember.js',
      count: 100
    }];
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvdGltZWxpbmUvY29udHJvbGxlci5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL3RpbWVsaW5lL2NvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCd0aW1lbGluZUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgVGFza3MpIHtcbiAgY29uc29sZS5sb2coXCJUSU1FTElORVwiKVxuXG4kc2NvcGUubXlEYXRhID0gW1xuICAgIHtuYW1lOiAnQW5ndWxhckpTJywgY291bnQ6IDMwMH0sXG4gICAge25hbWU6ICdEMy5KUycsIGNvdW50OiAxNTB9LFxuICAgIHtuYW1lOiAnalF1ZXJ5JywgY291bnQ6IDQwMH0sXG4gICAge25hbWU6ICdCYWNrYm9uZS5qcycsIGNvdW50OiAzMDB9LFxuICAgIHtuYW1lOiAnRW1iZXIuanMnLCBjb3VudDogMTAwfVxuXTtcblxuXG59KVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9