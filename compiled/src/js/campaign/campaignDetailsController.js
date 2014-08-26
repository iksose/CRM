define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('campaignControllerDetails', function($scope, $rootScope, $state, campaignFactory, $alert, queryFactory, $modal, activityFactory, campaign) {
    console.log("got campaign", campaign);
    $scope.campaignDetails = new Campaign(campaign.data);
    console.log("Class", $scope.campaignDetails);
    makeEvents();
    $scope.eventSources = [];
    $scope.events = [];
    $scope.test = function() {
      console.log($scope.campaignDetails);
    };
    $scope.modalSaveActivity = function() {
      var $__0 = $traceurRuntime.assertObject(activityFactory),
          activityModel = $__0[0],
          activityMethods = $__0[1];
      var activityModel = new NewActivity(activityModel);
      activityMethods.saveActivity("4", activityModel).then(function(data) {
        console.log("Done", data);
        addEvents(activityModel);
        myOtherModal.hide();
      }).catch(function(err) {
        console.error(err);
      });
    };
    $scope.deets;
    $scope.prospectsCollapsed = true;
    $scope.activitiesCollapsed = false;
    $scope.onClickTab = function(contact) {
      $scope.currentContact = contact;
    };
    $scope.isActiveTab = function(contact) {
      return contact == $scope.currentContact;
    };
    $scope.tableConfig = {
      itemsPerPage: 10,
      fillLastPage: false,
      maxPages: 5
    };
    var campaignID = $rootScope.$stateParams.campaignID;
    $scope.campaignPending = false;
    $scope.DeleteProspect = function(id) {
      console.log("Not implemented");
    };
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.changeTo = 'Hungarian';
    $scope.eventSource = {
      url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
      className: 'gcal-event',
      currentTimezone: 'America/Chicago'
    };
    function addEvents($__0) {
      var $__1 = $traceurRuntime.assertObject($__0),
          Descr = $__1.Descr,
          StartDateTime = $__1.StartDateTime,
          CompletionDateTime = $__1.CompletionDateTime;
      $scope.events.push({
        title: Descr,
        start: StartDateTime,
        end: CompletionDateTime,
        allDay: true
      });
    }
    function makeEvents() {
      $scope.campaignDetails.Activities.forEach(function(obj) {
        var transform = obj;
        transform.title = obj.Descr;
        transform.start = obj.StartDateTime;
        transform.end = obj.CompletionDateTime;
        transform.allDay = true;
        $scope.events.push(transform);
      });
    }
    $scope.eventsF = function(start, end, callback) {};
    $scope.calEventsExt = {
      color: '#f00',
      textColor: 'yellow',
      events: [{
        type: 'party',
        title: 'Lunch',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: false
      }, {
        type: 'party',
        title: 'Lunch 2',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: false
      }, {
        type: 'party',
        title: 'Click for Google',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://google.com/'
      }]
    };
    $scope.alertOnEventClick = function(event, allDay, jsEvent, view) {
      console.log(event);
      $scope.deets = event;
    };
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
      $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
    };
    $scope.onDayClick = function(date, jsEvent) {
      console.log("Whoa", jsEvent);
    };
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
      $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
    };
    $scope.addRemoveEventSource = function(sources, source) {
      var canAdd = 0;
      angular.forEach(sources, function(value, key) {
        if (sources[$traceurRuntime.toProperty(key)] === source) {
          sources.splice(key, 1);
          canAdd = 1;
        }
      });
      if (canAdd === 0) {
        sources.push(source);
      }
    };
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    $scope.remove = function(index) {
      $scope.events.splice(index, 1);
    };
    $scope.changeView = function(view, calendar) {
      calendar.fullCalendar('changeView', view);
    };
    $scope.renderCalender = function(calendar) {
      calendar.fullCalendar('render');
    };
    var dayClicked;
    $scope.dayClick = function(a, b, c, d) {
      dayClicked = moment(a).format("LL");
    };
    var myOtherModal = $modal({
      scope: $scope,
      template: 'views/add_activity.modal.html',
      show: false
    });
    $scope.dayDblClick = function(a, b, c, d) {
      var $__0 = $traceurRuntime.assertObject(activityFactory),
          activityModel = $__0[0],
          activityMethods = $__0[1];
      activityModel.StartDateTime = dayClicked;
      myOtherModal.show();
    };
    $scope.uiConfig = {calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDblClick: $scope.onDayClick,
        dayClick: $scope.dayClick,
        dayDblClick: $scope.dayDblClick
      }};
    $scope.eventSources = [$scope.events];
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY2FtcGFpZ24vY2FtcGFpZ25EZXRhaWxzQ29udHJvbGxlci5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL2NhbXBhaWduL2NhbXBhaWduRGV0YWlsc0NvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdjYW1wYWlnbkNvbnRyb2xsZXJEZXRhaWxzJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGNhbXBhaWduRmFjdG9yeSwgJGFsZXJ0LCBxdWVyeUZhY3RvcnksICRtb2RhbCwgYWN0aXZpdHlGYWN0b3J5LCBjYW1wYWlnbikge1xuICAgIC8vIGNhbXBhaWduIGlzIHBhc3NlZCBpbiBmcm9tIHRoZSByb3V0ZXIgcmVzb2x2ZVxuICAgIGNvbnNvbGUubG9nKFwiZ290IGNhbXBhaWduXCIsIGNhbXBhaWduKTtcblxuICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMgPSBuZXcgQ2FtcGFpZ24oY2FtcGFpZ24uZGF0YSk7XG4gICAgY29uc29sZS5sb2coXCJDbGFzc1wiLCAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzKVxuICAgIG1ha2VFdmVudHMoKTtcbiAgICAkc2NvcGUuZXZlbnRTb3VyY2VzID0gW107XG4gICAgJHNjb3BlLmV2ZW50cyA9IFtdO1xuXG4gICAgJHNjb3BlLnRlc3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2FsZW5kYXIuZnVsbENhbGVuZGFyKVxuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2FtcGFpZ25EZXRhaWxzICk7XG4gICAgfVxuXG5cbiAgICAkc2NvcGUubW9kYWxTYXZlQWN0aXZpdHkgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgW2FjdGl2aXR5TW9kZWwsIGFjdGl2aXR5TWV0aG9kc10gPSBhY3Rpdml0eUZhY3RvcnlcbiAgICAgICAgLy8gY2xhc3MgTmV3QWN0aXZpdHkgcGFyc2VzIHRoZSBkYXRlc1xuICAgICAgICB2YXIgYWN0aXZpdHlNb2RlbCA9IG5ldyBOZXdBY3Rpdml0eShhY3Rpdml0eU1vZGVsKTtcbiAgICAgICAgYWN0aXZpdHlNZXRob2RzLnNhdmVBY3Rpdml0eShcIjRcIiwgYWN0aXZpdHlNb2RlbCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiLCBkYXRhKVxuICAgICAgICAgICAgYWRkRXZlbnRzKGFjdGl2aXR5TW9kZWwpO1xuICAgICAgICAgICAgbXlPdGhlck1vZGFsLmhpZGUoKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvL3doZW4geW91IGNsaWNrIGEgY2FsZW5kYXIgb2JqZWN0XG4gICAgJHNjb3BlLmRlZXRzO1xuXG4gICAgJHNjb3BlLnByb3NwZWN0c0NvbGxhcHNlZCA9IHRydWU7XG4gICAgJHNjb3BlLmFjdGl2aXRpZXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAkc2NvcGUub25DbGlja1RhYiA9IGZ1bmN0aW9uIChjb250YWN0KSB7XG4gICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9IGNvbnRhY3RcbiAgICB9XG4gICAgJHNjb3BlLmlzQWN0aXZlVGFiID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgfVxuXG4gICAgJHNjb3BlLnRhYmxlQ29uZmlnID0ge1xuICAgICAgICBpdGVtc1BlclBhZ2U6IDEwLFxuICAgICAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlLFxuICAgICAgICBtYXhQYWdlczogNVxuICAgIH1cblxuXG5cbiAgdmFyIGNhbXBhaWduSUQgPSAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcy5jYW1wYWlnbklEO1xuXG5cblxuXG4gIC8vY2FtcGFpZ24gaXMgYXQgcGVuZGluZyBAIFRlbXBsYXRlIEAgQmVnaW5uaW5nLCBub3QgcGVuZGluZ1xuICAvL0lzIHRoaXMgYWx3YXlzIHRydWUgdGhvdWdoPyBXaGF0IGlmIGl0J3MgYXQgUGVuZGluZyB0byBiZWdpblxuICAkc2NvcGUuY2FtcGFpZ25QZW5kaW5nID0gZmFsc2U7XG5cbiAgLy8gdmFyIGdldENhbXBhaWduID0gY2FtcGFpZ25GYWN0b3J5LnNpbmdsZUNhbXBhaWduKGNhbXBhaWduSUQpXG4gIC8vIHZhciBkaXNwbGF5Q2FtcGFpZ24gPSBnZXRDYW1wYWlnbi50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAvLyAgIGNvbnNvbGUubG9nKFwiZ290IGNhbXBhaWduLi4uIVwiLCBkYXRhLmRhdGEpXG4gIC8vICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscyA9IG5ldyBDYW1wYWlnbihkYXRhLmRhdGEpXG4gIC8vICAgY29uc29sZS5sb2coXCJDYW1wYWlnblwiLCAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzIClcbiAgLy8gICBtYWtlRXZlbnRzKCk7XG4gIC8vIH0pXG5cbiAgJHNjb3BlLkRlbGV0ZVByb3NwZWN0ID0gZnVuY3Rpb24oaWQpe1xuICAgIC8vIFRPRE9cbiAgICAvLyBkb2Vzbid0IGhhdmUgYSBxdWVyeSBJRCB0byBzZW5kIGRlbGV0ZXMgdG9cbiAgICBjb25zb2xlLmxvZyhcIk5vdCBpbXBsZW1lbnRlZFwiKVxuICAgIC8vICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscy5Qcm9zcGVjdHMuZm9yRWFjaCgoYSxiKSA9PiB7XG4gICAgLy8gICAgIGlmKGEuUHJvc3BlY3RJRCA9PSBpZCl7XG4gICAgLy8gICAgICAgYS5TdGF0dXMgPyBhLlN0YXR1cyA9IDAgOiBhLlN0YXR1cyA9IDE7XG4gICAgLy8gICAgICAgICBxdWVyeUZhY3RvcnkudXBkYXRlUXVlcnlTdGF0dXMoJHNjb3BlLnNlbGVjdGVkUXVlcnkuUXVlcnlJRCwgaWQsIGEuU3RhdHVzKTtcbiAgICAvLyAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSlcbiAgfVxuXG5cblxudmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBkID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdmFyIG0gPSBkYXRlLmdldE1vbnRoKCk7XG4gICAgdmFyIHkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICAkc2NvcGUuY2hhbmdlVG8gPSAnSHVuZ2FyaWFuJztcbiAgICAvKiBldmVudCBzb3VyY2UgdGhhdCBwdWxscyBmcm9tIGdvb2dsZS5jb20gKi9cbiAgICAkc2NvcGUuZXZlbnRTb3VyY2UgPSB7XG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL3d3dy5nb29nbGUuY29tL2NhbGVuZGFyL2ZlZWRzL3VzYV9fZW4lNDBob2xpZGF5LmNhbGVuZGFyLmdvb2dsZS5jb20vcHVibGljL2Jhc2ljXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdnY2FsLWV2ZW50JywgICAgICAgICAgIC8vIGFuIG9wdGlvbiFcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lem9uZTogJ0FtZXJpY2EvQ2hpY2FnbycgLy8gYW4gb3B0aW9uIVxuICAgIH07XG4gICAgLyogZXZlbnQgc291cmNlIHRoYXQgY29udGFpbnMgY3VzdG9tIGV2ZW50cyBvbiB0aGUgc2NvcGUgKi9cbiAgICAvLyAkc2NvcGUuZXZlbnRzID0gW1xuICAgIC8vICAge3RpdGxlOiAnQWxsIERheSBFdmVudCcsc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDEpfSxcbiAgICAvLyAgIHt0aXRsZTogJ0xvbmcgRXZlbnQnLHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gNSksZW5kOiBuZXcgRGF0ZSh5LCBtLCBkIC0gMil9LFxuICAgIC8vICAge3RpdGxlOiAnQmlydGhkYXkgUGFydHknLHN0YXJ0OiAnMjAxNC0wNy0wOScsZW5kOiAnMjAxNC0wNy0wOScsYWxsRGF5OiBmYWxzZX0sXG4gICAgLy8gICB7dGl0bGU6ICdCaXJ0aGRheSBQYXJ0eScsc3RhcnQ6ICcyMDE0LTA3LTA5JyxlbmQ6ICcyMDE0LTA3LTA5JyxhbGxEYXk6IGZhbHNlfVxuICAgIC8vIF07XG5cbiAgICBmdW5jdGlvbiBhZGRFdmVudHMoe0Rlc2NyLCBTdGFydERhdGVUaW1lLCBDb21wbGV0aW9uRGF0ZVRpbWV9KXtcbiAgICAgICAgJHNjb3BlLmV2ZW50cy5wdXNoKHt0aXRsZTogRGVzY3IsIHN0YXJ0OiBTdGFydERhdGVUaW1lLCBlbmQ6IENvbXBsZXRpb25EYXRlVGltZSwgYWxsRGF5OiB0cnVlfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRXZlbnRzKCl7XG4gICAgICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQWN0aXZpdGllcy5mb3JFYWNoKGZ1bmN0aW9uKG9iail7XG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtID0gb2JqO1xuICAgICAgICAgICAgdHJhbnNmb3JtLnRpdGxlID0gb2JqLkRlc2NyO1xuICAgICAgICAgICAgdHJhbnNmb3JtLnN0YXJ0ID0gb2JqLlN0YXJ0RGF0ZVRpbWU7XG4gICAgICAgICAgICB0cmFuc2Zvcm0uZW5kID0gb2JqLkNvbXBsZXRpb25EYXRlVGltZTtcbiAgICAgICAgICAgIHRyYW5zZm9ybS5hbGxEYXkgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLmV2ZW50cy5wdXNoKHRyYW5zZm9ybSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyAkc2NvcGUuZXZlbnRzID0gW1xuICAgIC8vICAgICBmb3IoYWN0aXZpdHkgb2YgWzEsMl0pXG4gICAgLy8gICAgICAgICAvLyBpZiAoYy5jaXR5ID09IFwiU2VhdHRsZVwiKVxuICAgIC8vICAgICAgICAge3RpdGxlOiAnQmlydGhkYXkgUGFydHknLHN0YXJ0OiAnMjAxNC0wNy0wOScsZW5kOiAnMjAxNC0wNy0wOScsYWxsRGF5OiBmYWxzZX1cbiAgICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGVycFwiKVxuICAgIC8vIF1cblxuXG5cblxuICAgIC8qIGV2ZW50IHNvdXJjZSB0aGF0IGNhbGxzIGEgZnVuY3Rpb24gb24gZXZlcnkgdmlldyBzd2l0Y2ggKi9cbiAgICAkc2NvcGUuZXZlbnRzRiA9IGZ1bmN0aW9uIChzdGFydCwgZW5kLCBjYWxsYmFjaykge1xuICAgIC8vICAgdmFyIHMgPSBuZXcgRGF0ZShzdGFydCkuZ2V0VGltZSgpIC8gMTAwMDtcbiAgICAvLyAgIHZhciBlID0gbmV3IERhdGUoZW5kKS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgIC8vICAgdmFyIG0gPSBuZXcgRGF0ZShzdGFydCkuZ2V0TW9udGgoKTtcbiAgICAvLyAgIHZhciBldmVudHMgPSBbe3RpdGxlOiAnRmVlZCBNZSAnICsgbSxzdGFydDogcyArICg1MDAwMCksZW5kOiBzICsgKDEwMDAwMCksYWxsRGF5OiBmYWxzZSwgY2xhc3NOYW1lOiBbJ2N1c3RvbUZlZWQnXX1dO1xuICAgIC8vICAgY2FsbGJhY2soZXZlbnRzKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbEV2ZW50c0V4dCA9IHtcbiAgICAgICBjb2xvcjogJyNmMDAnLFxuICAgICAgIHRleHRDb2xvcjogJ3llbGxvdycsXG4gICAgICAgZXZlbnRzOiBbXG4gICAgICAgICAge3R5cGU6J3BhcnR5Jyx0aXRsZTogJ0x1bmNoJyxzdGFydDogbmV3IERhdGUoeSwgbSwgZCwgMTIsIDApLGVuZDogbmV3IERhdGUoeSwgbSwgZCwgMTQsIDApLGFsbERheTogZmFsc2V9LFxuICAgICAgICAgIHt0eXBlOidwYXJ0eScsdGl0bGU6ICdMdW5jaCAyJyxzdGFydDogbmV3IERhdGUoeSwgbSwgZCwgMTIsIDApLGVuZDogbmV3IERhdGUoeSwgbSwgZCwgMTQsIDApLGFsbERheTogZmFsc2V9LFxuICAgICAgICAgIHt0eXBlOidwYXJ0eScsdGl0bGU6ICdDbGljayBmb3IgR29vZ2xlJyxzdGFydDogbmV3IERhdGUoeSwgbSwgMjgpLGVuZDogbmV3IERhdGUoeSwgbSwgMjkpLHVybDogJ2h0dHA6Ly9nb29nbGUuY29tLyd9XG4gICAgICAgIF1cbiAgICB9O1xuICAgIC8qIGFsZXJ0IG9uIGV2ZW50Q2xpY2sgKi9cbiAgICAkc2NvcGUuYWxlcnRPbkV2ZW50Q2xpY2sgPSBmdW5jdGlvbiggZXZlbnQsIGFsbERheSwganNFdmVudCwgdmlldyApe1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudClcbiAgICAgICAgJHNjb3BlLmRlZXRzID0gZXZlbnQ7XG4gICAgICAgIC8vICRzY29wZS5hbGVydE1lc3NhZ2UgPSAoZXZlbnQgKyAnIHdhcyBjbGlja2VkICcpO1xuICAgIH07XG4gICAgLyogYWxlcnQgb24gRHJvcCAqL1xuICAgICAkc2NvcGUuYWxlcnRPbkRyb3AgPSBmdW5jdGlvbihldmVudCwgZGF5RGVsdGEsIG1pbnV0ZURlbHRhLCBhbGxEYXksIHJldmVydEZ1bmMsIGpzRXZlbnQsIHVpLCB2aWV3KXtcbiAgICAgICAkc2NvcGUuYWxlcnRNZXNzYWdlID0gKCdFdmVudCBEcm9wZWQgdG8gbWFrZSBkYXlEZWx0YSAnICsgZGF5RGVsdGEpO1xuICAgIH07XG5cbiAgICAkc2NvcGUub25EYXlDbGljayA9IGZ1bmN0aW9uKGRhdGUsIGpzRXZlbnQpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIldob2FcIiwganNFdmVudClcbiAgICB9XG4gICAgLyogYWxlcnQgb24gUmVzaXplICovXG4gICAgJHNjb3BlLmFsZXJ0T25SZXNpemUgPSBmdW5jdGlvbihldmVudCwgZGF5RGVsdGEsIG1pbnV0ZURlbHRhLCByZXZlcnRGdW5jLCBqc0V2ZW50LCB1aSwgdmlldyApe1xuICAgICAgICRzY29wZS5hbGVydE1lc3NhZ2UgPSAoJ0V2ZW50IFJlc2l6ZWQgdG8gbWFrZSBkYXlEZWx0YSAnICsgbWludXRlRGVsdGEpO1xuICAgIH07XG4gICAgLyogYWRkIGFuZCByZW1vdmVzIGFuIGV2ZW50IHNvdXJjZSBvZiBjaG9pY2UgKi9cbiAgICAkc2NvcGUuYWRkUmVtb3ZlRXZlbnRTb3VyY2UgPSBmdW5jdGlvbihzb3VyY2VzLHNvdXJjZSkge1xuICAgICAgdmFyIGNhbkFkZCA9IDA7XG4gICAgICBhbmd1bGFyLmZvckVhY2goc291cmNlcyxmdW5jdGlvbih2YWx1ZSwga2V5KXtcbiAgICAgICAgaWYoc291cmNlc1trZXldID09PSBzb3VyY2Upe1xuICAgICAgICAgIHNvdXJjZXMuc3BsaWNlKGtleSwxKTtcbiAgICAgICAgICBjYW5BZGQgPSAxO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmKGNhbkFkZCA9PT0gMCl7XG4gICAgICAgIHNvdXJjZXMucHVzaChzb3VyY2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgLyogYWRkIGN1c3RvbSBldmVudCovXG4gICAgJHNjb3BlLmFkZEV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUuZXZlbnRzLnB1c2goe1xuICAgICAgICB0aXRsZTogJ09wZW4gU2VzYW1lJyxcbiAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDI4KSxcbiAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCAyOSksXG4gICAgICAgIGNsYXNzTmFtZTogWydvcGVuU2VzYW1lJ11cbiAgICAgIH0pO1xuICAgIH07XG4gICAgLyogcmVtb3ZlIGV2ZW50ICovXG4gICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAkc2NvcGUuZXZlbnRzLnNwbGljZShpbmRleCwxKTtcbiAgICB9O1xuICAgIC8qIENoYW5nZSBWaWV3ICovXG4gICAgJHNjb3BlLmNoYW5nZVZpZXcgPSBmdW5jdGlvbih2aWV3LGNhbGVuZGFyKSB7XG4gICAgICBjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ2NoYW5nZVZpZXcnLHZpZXcpO1xuICAgIH07XG4gICAgLyogQ2hhbmdlIFZpZXcgKi9cbiAgICAkc2NvcGUucmVuZGVyQ2FsZW5kZXIgPSBmdW5jdGlvbihjYWxlbmRhcikge1xuICAgICAgY2FsZW5kYXIuZnVsbENhbGVuZGFyKCdyZW5kZXInKTtcbiAgICB9O1xuXG4gICAgdmFyIGRheUNsaWNrZWQ7XG4gICAgJHNjb3BlLmRheUNsaWNrID0gZnVuY3Rpb24oYSxiLGMsZCl7XG4gICAgICAgIGRheUNsaWNrZWQgPSBtb21lbnQoYSkuZm9ybWF0KFwiTExcIilcbiAgICB9XG5cbiAgICB2YXIgbXlPdGhlck1vZGFsID0gJG1vZGFsKHtzY29wZTogJHNjb3BlLCB0ZW1wbGF0ZTogJ3ZpZXdzL2FkZF9hY3Rpdml0eS5tb2RhbC5odG1sJywgc2hvdzogZmFsc2V9KTtcbiAgICAkc2NvcGUuZGF5RGJsQ2xpY2sgPSBmdW5jdGlvbihhLGIsYyxkKXtcbiAgICAgICAgdmFyIFthY3Rpdml0eU1vZGVsLCBhY3Rpdml0eU1ldGhvZHNdID0gYWN0aXZpdHlGYWN0b3J5XG4gICAgICAgIGFjdGl2aXR5TW9kZWwuU3RhcnREYXRlVGltZSA9IGRheUNsaWNrZWRcbiAgICAgICAgbXlPdGhlck1vZGFsLnNob3coKTtcbiAgICB9XG5cbiAgICAvKiBjb25maWcgb2JqZWN0ICovXG4gICAgJHNjb3BlLnVpQ29uZmlnID0ge1xuICAgICAgY2FsZW5kYXI6e1xuICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgIGhlYWRlcjp7XG4gICAgICAgICAgbGVmdDogJ3RpdGxlJyxcbiAgICAgICAgICBjZW50ZXI6ICcnLFxuICAgICAgICAgIHJpZ2h0OiAndG9kYXkgcHJldixuZXh0J1xuICAgICAgICB9LFxuICAgICAgICBldmVudENsaWNrOiAkc2NvcGUuYWxlcnRPbkV2ZW50Q2xpY2ssXG4gICAgICAgIGV2ZW50RGJsQ2xpY2s6ICRzY29wZS5vbkRheUNsaWNrLFxuICAgICAgICBkYXlDbGljazogJHNjb3BlLmRheUNsaWNrLFxuICAgICAgICBkYXlEYmxDbGljazogJHNjb3BlLmRheURibENsaWNrLFxuICAgICAgICAvLyBldmVudERyb3A6ICRzY29wZS5hbGVydE9uRHJvcCxcbiAgICAgICAgLy8gZXZlbnRSZXNpemU6ICRzY29wZS5hbGVydE9uUmVzaXplLFxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBldmVudCBzb3VyY2VzIGFycmF5Ki9cbiAgICAkc2NvcGUuZXZlbnRTb3VyY2VzID0gWyRzY29wZS5ldmVudHNdO1xuICAgIC8vICRzY29wZS5ldmVudFNvdXJjZXMyID0gWyRzY29wZS5jYWxFdmVudHNFeHQsICRzY29wZS5ldmVudHNGLCAkc2NvcGUuZXZlbnRzXTtcblxuXG5cblxufSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==