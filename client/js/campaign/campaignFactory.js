angular.module('uiRouterSample')
.factory('campaignFactory',
 function ($http) {
    return {
        queryResults:function (url, callback) {
            return $http.get('/api/campaigns')
        },
        singleCampaign:function (data) {
            return $http.post('/api/singlecampaign', data)
        },
        thisSavedQuery: function(data){
          //will have to pass which saved query in the future
          return $http.get('api/thisQuery')
        }
    };
  }
);
