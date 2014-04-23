angular.module('uiRouterSample')
.factory('queryFactory',
// now Research Factory
 function ($http) {
    return {
        queryResults:function (url, callback) {
            console.log("Getting query with params ", url)
            return $http.get('/api/prospects', {params: url } )
        },
        removeQuery: function(rowID){
          return $http.put('')
        },
        moreProspects: function(){
          return $http.get('/api/prospects', {params: {'start': '5', 'end': '20'} } )
        },
        deleteProspect: function(id){
          return $http.delete('/api/prospects', {params: {'start': '5', 'end': '20'} } )
        },
        saveQuery: function(prospects){
          console.log("Prospects ", prospects)
          return $http.post('/api/queries', prospects )
        }
    };
  }
);
