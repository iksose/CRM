angular.module('uiRouterSample')
.factory('campaignFactory',
 function ($http) {
    return {
        queryResults:function (url, callback) {
            return $http.get('/api/campaigns')
        },
        singleCampaign:function (paramID) {
          console.log("Get campaign....#", paramID)
          return $http.get('http://10.1.1.118:8000/api/campaign/' + paramID)
        },
        thisSavedQuery: function(data){
          //will have to pass which saved query in the future
          return $http.get('api/thisQuery')
        },
        getQueries: function(){
          return $http.get('http://10.1.1.118:8000/api/Research/list')
        },
        singleQuery: function(queryID){
          return $http.get('http://10.1.1.118:8000/api/Research/' + queryID);
        },
        convert: function(queryID){
          return $http.post('http://10.1.1.118:8000/api/Campaign', $.param( { QueryID : queryID } ) );
        },
        saveActivity: function(campaignID, activity){
          return $http.post('http://10.1.1.118:8000/api/Campaign/'+campaignID+'/Activity', $.param(activity) );
        },
        getUsers:function(){
          return $http.get('http://10.1.1.118:8000/api/users')
        },
        getCampaigns: function(){
          return $http.get('http://10.1.1.118:8000/api/campaign')
        }
    };
  }
);
