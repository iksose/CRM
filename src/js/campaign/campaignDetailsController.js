// /#/Campaigns/details/{campaignID}
angular.module('uiRouterSample')
.controller('campaignControllerDetails', function($scope, $rootScope, $state, campaignFactory, $alert, queryFactory, $modal, activityFactory, campaign) {
    // campaign is passed in from the router resolve
    console.log("got campaign", campaign);
    $scope.campaignDetails = new Campaign(campaign.data);
    console.log("Class", $scope.campaignDetails)
    // array comprehension & object destructuring
    $scope.events = [
        for({Descr, StartDateTime, CompletionDateTime} of $scope.campaignDetails.Activities)
            {title: Descr, start: StartDateTime, end: CompletionDateTime}
    ]
    $scope.eventSources = [];

    $scope.Print = (()=>{
        // TODO ->
        console.log($scope.campaignDetails );
    })

    var editCampaign = $modal({scope: $scope, template: 'views/editCampaign.modal.html', show: false});
    // open modal for editing campaign details
    // modal passes true
    $scope.editCampaign = ((edit = false)=>{
        if(edit == false){
            editCampaign.show();
            return;
        }else if(edit == true){
            var cID = $scope.campaignDetails.CampaignID
            campaignFactory.editCampaigns(cID, $scope.campaignDetails ).then(function(data){
                console.log("Success?", data)
                editCampaign.hide();
            }).catch(function(err){
                console.error("Dude....", err)
            });
        }
    })


    $scope.modalSaveActivity = function(){
        var [activityModel, activityMethods] = activityFactory
        // class NewActivity parses the dates
        var activityModel = new NewActivity(activityModel);
        var cID = $scope.campaignDetails.CampaignID
        activityMethods.saveActivity_and_then_do_Attachments(cID, activityModel).then(function(data){
            console.log("Success?", data)
            addEvents(activityModel);
            activityModal.hide();
        }).catch(function(err){
            // console.error("Dude....", err)
        });
    }

    //when you click a calendar object, populate deets
    $scope.deets;

    $scope.prospectsCollapsed = true;
    $scope.activitiesCollapsed = false;
    $scope.onClickTab = function (contact) {
        $scope.currentContact = contact
    }
    $scope.isActiveTab = function(contact) {
        return contact == $scope.currentContact;
    }

    $scope.tableConfig = {
        itemsPerPage: 10,
        fillLastPage: false,
        maxPages: 5
    }

    //campaign is at pending @ Template @ Beginning, not pending
    //Is this always true though? What if it's at Pending to begin
    $scope.campaignPending = false;

    $scope.DeleteProspect = function(id){
        // TODO
        // doesn't have a query ID to send deletes to
        console.log("Not implemented")
        //   $scope.campaignDetails.Prospects.forEach((a,b) => {
        //     if(a.ProspectID == id){
        //       a.Status ? a.Status = 0 : a.Status = 1;
        //         queryFactory.updateQueryStatus($scope.selectedQuery.QueryID, id, a.Status);
        //       return true;
        //     }
        //   })
    }


    // CALENDAR FUNCTIONS
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    function addEvents({Descr, StartDateTime, CompletionDateTime}){
        $scope.events.push({title: Descr, start: StartDateTime, end: CompletionDateTime, allDay: true})
    }

    /* alert on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        var match = $scope.campaignDetails.Activities.find(x => x.Descr == event.title)
        console.log(match)
        $scope.deets = match;
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
    };

    $scope.onDayClick = function(date, jsEvent){
        console.log("Whoa", jsEvent)
    }
    /* alert on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      calendar.fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      calendar.fullCalendar('render');
    };

    var dayClicked;
    $scope.dayClick = function(a,b,c,d){
        dayClicked = moment(a).format("LL")
    }

    var activityModal = $modal({scope: $scope, template: 'views/add_activity.modal.html', show: false});
    $scope.dayDblClick = function(a,b,c,d){
        var [activityModel, activityMethods] = activityFactory
        activityModel.StartDateTime = dayClicked
        activityModal.show();
    }

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDblClick: $scope.onDayClick,
        dayClick: $scope.dayClick,
        dayDblClick: $scope.dayDblClick,
        // eventDrop: $scope.alertOnDrop,
        // eventResize: $scope.alertOnResize,
      }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];

    $scope.nextStatus = function(id){
        var cID = $scope.campaignDetails.CampaignID
        campaignFactory.editStatus(cID, 3)
    }




})
