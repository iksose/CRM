angular.module('uiRouterSample')
.controller('newCampaignController', function($scope, $rootScope, $state, $alert, campaignFactory, queryFactory, activityFactory) {
    console.log("Welcome to NEW campaign controller")

    $scope.tableConfig = {
        itemsPerPage: 10,
        fillLastPage: false,
        maxPages: 5
    }

    $scope.DeleteProspect = function(id){
        $scope.campaignDetails.rows.forEach((a,b) => {
            if(a.ProspectID == id){
                a.Status ? a.Status = 0 : a.Status = 1;
                queryFactory.updateQueryStatus($scope.selectedQuery.QueryID, id, a.Status);
                return true;
            }
        })
    }


    $scope.campaignID;
    $scope.campaignConverted = false;
    $scope.convert = () => {
        console.log("Converting...");
        var queryID  = $scope.campaignDetails.QueryID;
        console.error(queryID)
        campaignFactory.convert(queryID).then((data) => {
            console.log("DONE, campaign ID ", data.data.CampaignID)
            $scope.campaignID = data.data.CampaignID;
            $scope.campaignConverted = true;
        })
    };

    $scope.userList = [];
    campaignFactory.getUsers().then((data) => {
        console.log("Got all users....", data)
        $scope.userList = data.data.UserList;
    }).catch((err) => {
        // do something
    })

    $scope.savedQueries = [];
    $scope.selectedQuery;
    campaignFactory.getQueries().then((data) => {
        console.log("Got...", data)
        $scope.savedQueries = data.data
    }).catch((err) => {
        // do something
    })

    $scope.campaignDetails = {};
    $scope.campaignDetails.rows = [];
    $scope.setBillGroup = (data) => {
        // FIXME this is being fired on page init because it thinks the value
        // is changing;
        console.log("CHANGED", $scope.selectedQuery)
        campaignFactory.singleQuery($scope.selectedQuery.QueryID).then((data) => {
            $scope.campaignDetails = new PendingCampaign(data.data)
            console.log($scope.campaignDetails)
            $scope.fetched = true;
        })
    };
    if($state.params.campaignID !=""){
        // console.log("Yes there's params");
        // TODO always fires setBillGroup
        $scope.selectedQuery = {ProductID: 1, QueryID: $state.params.campaignID || 1, Name: "mo test"}
        $scope.setBillGroup();
    }

    $scope.changeState = (bleh) => {
        $state.go('home.campaign.details', {params:'1337'})
    };

    $scope.newActivity = {};
    $scope.savedActivities = [];
    $scope.activityNo = 0;
    $scope.selectedUser;
    var activity_order = 1;
    $scope.saveActivity = () => {
        var [activityModel, activityMethods] = activityFactory
        // class NewActivity parses the dates
        var activityModel = new NewActivity(activityModel);
        var cID = $scope.campaignID
        activityMethods.saveActivity_and_then_do_Attachments(cID, activityModel).then((data) => {
            data.Order = activity_order
            activity_order++
            console.log("Success?", data)
            $scope.savedActivities.push(data);
            $scope.savedActivities.sort(compareDates)
            //if the last one, after sorting, is not the one we just added
            if($scope.savedActivities[$scope.savedActivities.length - 1] != data){
                // then give them all new 'order' properties
                // and resend to the server
                console.log("Whoa whoa, time mixup...")
                for (var i = 0; i < $scope.savedActivities.length; i++) {
                    $scope.savedActivities[i].Order = i+1;
                    //send those to the server
                };
            }
            $scope.activityNo++;
            $scope.newActivity = {};
        }).catch((err) => {
            // console.error("Dude....", err)
        });
    };

    function compareDates(a, b) {
        return moment(a.StartDateTime).isAfter(b.StartDateTime); 
    }

})
