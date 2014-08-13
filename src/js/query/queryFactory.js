angular.module('uiRouterSample')
.factory('queryFactory',
// now Research Factory
 function ($http) {
    return {
        queryResults:function (url, callback) {
          console.log("Getting query with params ", url)
          return $http.get('http://10.1.1.118:8000/api/Research', {params: url } )
        },
        removeQuery: function(rowID){
          return $http.put('')
        },
        deleteProspect: function(id){
          return $http.delete('/api/prospects', {params: {'start': '5', 'end': '20'} } )
        },
        saveQuery: function(prospects){
          console.log("Save query Prospects ", prospects)
          return $http.post('http://10.1.1.118:8000/api/Research', $.param(prospects) )
        },
        getQueries: function(){
          return $http.get('http://10.1.1.118:8000/api/Research/list')
        },
        singleQuery: function(queryID){
          // ES6 Template Strings
          // return $http.get(`/api/query/${queryID}`)
          return $http.get('http://10.1.1.118:8000/api/Research/' + queryID);
        },
        updateQueryName: function(queryID){
          return $http.put('http://10.1.1.118:8000/api/Research/' + queryID, $.param({'Name': 'Angular'}) )
        },
        updateQueryStatus: function(QueryID, ProspectID, status){
          return $http.put('http://10.1.1.118:8000/api/Research/' + QueryID + '/' + ProspectID, $.param({'Status': status}) )
        }
    };
  }
);
