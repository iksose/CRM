angular.module('uiRouterSample')
    .factory('campaignFactory',
        function($http) {
            return {
                queryResults: function(url, callback) {
                    return $http.get('/api/campaigns')
                },
                singleCampaign: function(paramID) {
                    console.log("Get campaign....#", paramID)
                    return $http.get('http://10.1.1.118:8000/api/campaign/' + paramID)
                },
                thisSavedQuery: function(data) {
                    //will have to pass which saved query in the future
                    return $http.get('api/thisQuery')
                },
                getQueries: function() {
                    return $http.get('http://10.1.1.118:8000/api/Research/list')
                },
                singleQuery: function(queryID) {
                    return $http.get('http://10.1.1.118:8000/api/Research/' + queryID);
                },
                convert: function(queryID) {
                    return $http.post('http://10.1.1.118:8000/api/Campaign', $.param({
                        QueryID: queryID
                    }));
                },
                saveActivity: function(campaignID, activity) {
                    return $http.post('http://10.1.1.118:8000/api/Campaign/' + campaignID + '/Activity', $.param(activity));
                },
                getUsers: function() {
                    return $http.get('http://10.1.1.118:8000/api/users')
                },
                getCampaigns: function() {
                    return $http.get('http://10.1.1.118:8000/api/campaign')
                },
                editCampaigns: function(cID, originalForm) {
                    console.log("Edit campaigns", originalForm)
                    var form = {}
                        // copying object affects original
                    Object.assign(form, originalForm);
                    // these arrays throw an error
                    delete form.Activities
                    delete form.Prospects
                    delete form.Attachments
                    delete form.BusinessOwners
                    return $http.put('http://10.1.1.118:8000/api/Campaign/' + cID, $.param(form))
                },
                editStatus: function(cID, status) {
                    console.log(cID, status)
                    return $http.put('http://10.1.1.118:8000/api/campaign/' + cID + '/status', $.param({
                        "status": status
                    }))
                }
            };
        }
);
