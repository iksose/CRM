define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('prospectController', function($scope, $rootScope, $state, $alert, prospectFactory) {
    console.log("Hello prospect");
    var zoomcount = 3;
    $scope.currentContact;
    $scope.onClickTab = function(contact) {
      $scope.currentContact = contact;
    };
    $scope.isActiveTab = function(contact) {
      return contact == $scope.currentContact;
    };
    $scope.isCollapsed = true;
    $scope.showDetails = false;
    $scope.saveContact = function(contact) {
      console.log("Saving contact...", contact);
    };
    $scope.filters = ['All Activities', 'Only My Activities', 'Closed Issues', 'Open Issues', 'Trinet', 'ProfitGuard'];
    $scope.selection = ['All Activities', 'Closed Issues', 'Open Issues', 'Trinet', 'ProfitGuard'];
    $scope.toggleSelection = function toggleSelection(filterName) {
      var idx = $scope.selection.indexOf(filterName);
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
        deleteFilter(filterName);
      } else {
        addFilter(filterName);
        $scope.selection.push(filterName);
      }
    };
    function deleteFilter(filterName) {
      var itemsGet = items.get();
      var remove = _.filter(itemsGet, function(num) {
        return num.typeOf == filterName;
      });
      items.remove(remove);
    }
    function addFilter(filterName) {
      var itemsGet = Activities_and_Issues;
      var adds = _.filter(itemsGet, function(num) {
        return num.typeOf == filterName;
      });
      items.add(adds);
    }
    $scope.the_Prospect;
    $scope.Contacts = [];
    console.log($state.params);
    prospectFactory.getProspect_by_ID($state.params).then(function(data) {
      console.log("Got prospect", data);
      $scope.the_Prospect = new Prospect(data.data);
      console.log($scope.the_Prospect);
      makeTimeline();
      $scope.currentContact = $scope.the_Prospect.Contacts[0];
    });
    var timeline;
    var items;
    var Activities_and_Issues;
    function makeTimeline() {
      console.log("Making timeline...this concats all events on the same day");
      Activities_and_Issues = $scope.the_Prospect.Issues.concat($scope.the_Prospect.Activities);
      function compareNumbers(a, b) {
        return a.day - b.day;
      }
      Activities_and_Issues.sort(compareNumbers);
      var dupes = [];
      var ranges = _.pluck(Activities_and_Issues, 'year_day');
      var ranges = _.uniq(ranges);
      var mothership = [];
      ranges.forEach(function(range, it) {
        var groups = _.where(Activities_and_Issues, {'year_day': range});
        var issues = [];
        var found = false;
        groups.forEach(function(type) {
          if (type.issue && groups.length > 1) {
            var index = groups.indexOf(type);
            issues = groups.splice(index, 1);
            found = true;
          }
        });
        if (found) {
          mothership.push(issues);
          found = false;
        }
        mothership.push(groups);
      });
      Activities_and_Issues = [];
      mothership.forEach(function(arr) {
        if (arr[0].issue) {
          console.log("Issue in mothership");
          arr[0].content = "Issue";
          Activities_and_Issues.push(arr[0]);
        } else {
          arr[0].content = arr.length + " Notes";
          arr[0].warning = true;
          arr[0].subnotes = arr;
          Activities_and_Issues.push(arr[0]);
        }
      });
      items = new vis.DataSet(Activities_and_Issues);
      var container = document.getElementById('visualization');
      var options = {
        zoomable: false,
        width: '100%',
        minHeight: '150px',
        editable: false,
        start: new Date(2014, moment().subtract('month', 2).format("M"), 1),
        max: new Date(2014, 7, 1)
      };
      timeline = new vis.Timeline(container, items, options);
      timeline.on('select', function(properties) {
        logEvent('select', properties);
      });
      timeline.on('rangechanged', function(time) {});
    }
    $scope.message = "Select an event";
    function logEvent(event, properties) {
      var content = items._data[$traceurRuntime.toProperty(properties.items[0])];
      $scope.message = content.Note;
      console.log(content);
      if (content.warning) {
        console.log("Special message -> goto note");
        gotoNote(content);
      } else if (content.issue) {
        console.log("Special issue -> goto issue");
        gotoIssue(content);
      }
      $scope.msgInfo = content;
      $scope.showDetails = true;
      $scope.$digest();
    }
    function gotoIssue(note) {
      zoomcount = 3;
      var container = document.getElementById('visualization');
      var monthStart = moment(note.start).startOf('month').format("D");
      var monthEnd = moment(note.start).endOf('month').format("D");
      var options = {
        zoomable: false,
        width: '100%',
        minHeight: '150px',
        editable: false,
        start: new Date(note.year, note.month - 1, monthStart),
        max: new Date(note.year, note.month - 1, monthEnd)
      };
      note.content = note.Description.substring(0, 20);
      $scope.message = note.Description;
      timeline.destroy();
      timeline = new vis.Timeline(container, items, options);
      timeline.on('select', function(properties) {
        logEvent('select', properties);
      });
    }
    function gotoNote(note) {
      zoomcount = 3;
      var container = document.getElementById('visualization');
      var monthStart = moment(note.start).startOf('month').format("D");
      var monthEnd = moment(note.start).endOf('month').format("D");
      var options = {
        zoomable: false,
        width: '100%',
        minHeight: '150px',
        editable: false,
        start: new Date(note.year, note.month - 1, monthStart),
        max: new Date(note.year, note.month - 1, monthEnd)
      };
      console.log(note, monthStart, monthEnd);
      note.subnotes.forEach(function(notes) {
        notes.content = notes.Note.substring(0, 20);
        items.remove(note.id);
        items.add(notes);
      });
      timeline.destroy();
      timeline = new vis.Timeline(container, items, options);
      timeline.on('select', function(properties) {
        logEvent('select', properties);
      });
    }
    function zoom(zoom_in) {
      console.log("Amounts", zoomcount, zoom_in);
      zoomcount = zoomcount + zoom_in;
      var options;
      if (zoomcount == 4) {
        console.log("Zoom in", zoomcount);
        options = {
          zoomable: false,
          width: '100%',
          minHeight: '150px',
          editable: false,
          start: new Date(2014, 5, 1),
          max: new Date(2014, 7, 1)
        };
        zoomcount = 3;
        zoomTimeline();
      } else if (zoomcount == 2) {
        console.log("Zoom out 'month view' ", zoomcount);
        coolnewSortMethod();
        options = {
          zoomable: false,
          width: '100%',
          minHeight: '150px',
          editable: false,
          start: new Date(2014, 1, 1),
          max: new Date(2014, 7, 1)
        };
        zoomTimeline();
      } else if (zoomcount == 1) {
        console.error("Wildcard zoom, placeholder...Todo", zoomcount);
        zoomTimeline();
      } else if (zoomcount == 0) {
        console.error("cancel zoom", zoomcount);
        zoomcount++;
        return;
      }
      function zoomTimeline() {
        var container = document.getElementById('visualization');
        timeline.destroy();
        timeline = new vis.Timeline(container, items, options);
        timeline.on('select', function(properties) {
          logEvent('select', properties);
        });
      }
    }
    document.getElementById('zoomIn').onclick = function() {
      zoom(1);
    };
    document.getElementById('zoomOut').onclick = function() {
      zoom(-1);
    };
    $scope.icons = [{
      value: 1,
      label: 'Owner'
    }, {
      value: 2,
      label: 'Person in'
    }, {
      value: 3,
      label: 'Best Friend'
    }];
    $scope.update = function(contact) {
      var targ = _.findWhere($scope.the_Prospect.Contacts, contact);
      var diff = targ.old_vs_new;
      if (diff.old.length > diff.new.length) {
        var changed = _.difference(diff.old, diff.new);
        console.log("Subtracted", changed);
      } else {
        var changed = _.difference(diff.new, diff.old);
        console.log("Added", changed);
      }
    };
    function coolnewSortMethod() {
      var months = 12;
      var years = [2010, 2011, 2012, 2013, 2014];
      var ranges = _.pluck(Activities_and_Issues, 'month_year');
      var ranges = _.uniq(ranges);
      var mothership = [];
      ranges.forEach(function(range, it) {
        var groups = _.where(Activities_and_Issues, {'month_year': range});
        $traceurRuntime.setProperty(mothership, it, groups);
      });
      items.clear();
      mothership.forEach(function(arr) {
        delete arr[0].id;
        arr[0].content = arr.length + " Notes";
        arr[0].warning = true;
        arr[0].subnotes = arr;
        items.add(arr[0]);
      });
    }
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcHJvc3BlY3QvcHJvc3BlY3RDb250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvcHJvc3BlY3QvcHJvc3BlY3RDb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcigncHJvc3BlY3RDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCwgcHJvc3BlY3RGYWN0b3J5KSB7XG4gICAgY29uc29sZS5sb2coXCJIZWxsbyBwcm9zcGVjdFwiKVxuICAgIHZhciB6b29tY291bnQgPSAzXG5cblxuICAgICRzY29wZS5jdXJyZW50Q29udGFjdFxuXG4gICAgJHNjb3BlLm9uQ2xpY2tUYWIgPSBmdW5jdGlvbiAoY29udGFjdCkge1xuICAgICAgICAkc2NvcGUuY3VycmVudENvbnRhY3QgPSBjb250YWN0XG4gICAgfVxuICAgJHNjb3BlLmlzQWN0aXZlVGFiID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgfVxuXG5cbiAgICAvL2ZvciB0aGUgcHJvc3BlY3QgZGV0YWlscyBsaXN0XG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgIC8vc2hvdyBkZXRhaWxzIGlzIHdoZW4gdGhleSBjbGljayBhIHRpbWVsaW5lIGV2ZW50XG4gICAgJHNjb3BlLnNob3dEZXRhaWxzID0gZmFsc2U7XG5cbiAgICAkc2NvcGUuc2F2ZUNvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0KXtcbiAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgY29udGFjdC4uLlwiLCBjb250YWN0KVxuICAgIH1cblxuXG4gICAvLyBmaWx0ZXJzXG4gICRzY29wZS5maWx0ZXJzID0gWydBbGwgQWN0aXZpdGllcycsICdPbmx5IE15IEFjdGl2aXRpZXMnLCAnQ2xvc2VkIElzc3VlcycsICdPcGVuIElzc3VlcycsICdUcmluZXQnLCAnUHJvZml0R3VhcmQnXTtcbiAgLy8gc2VsZWN0ZWQgZmlsdGVyc1xuICAkc2NvcGUuc2VsZWN0aW9uID0gWydBbGwgQWN0aXZpdGllcycsICdDbG9zZWQgSXNzdWVzJywgJ09wZW4gSXNzdWVzJywgJ1RyaW5ldCcsICdQcm9maXRHdWFyZCddO1xuICAvLyB0b2dnbGUgc2VsZWN0aW9uIGZvciBhIGdpdmVuIGZpbHRlciBieSBuYW1lXG4gICRzY29wZS50b2dnbGVTZWxlY3Rpb24gPSBmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oZmlsdGVyTmFtZSkge1xuICAgIHZhciBpZHggPSAkc2NvcGUuc2VsZWN0aW9uLmluZGV4T2YoZmlsdGVyTmFtZSk7XG4gICAgLy8gaXMgY3VycmVudGx5IHNlbGVjdGVkXG4gICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAkc2NvcGUuc2VsZWN0aW9uLnNwbGljZShpZHgsIDEpO1xuICAgICAgZGVsZXRlRmlsdGVyKGZpbHRlck5hbWUpO1xuICAgIH1cbiAgICAvLyBpcyBuZXdseSBzZWxlY3RlZFxuICAgIGVsc2Uge1xuICAgICAgYWRkRmlsdGVyKGZpbHRlck5hbWUpO1xuICAgICAgJHNjb3BlLnNlbGVjdGlvbi5wdXNoKGZpbHRlck5hbWUpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBkZWxldGVGaWx0ZXIoZmlsdGVyTmFtZSl7XG4gICAgdmFyIGl0ZW1zR2V0ID0gaXRlbXMuZ2V0KCk7XG4gICAgdmFyIHJlbW92ZSA9IF8uZmlsdGVyKGl0ZW1zR2V0LCBmdW5jdGlvbihudW0peyByZXR1cm4gbnVtLnR5cGVPZiA9PSBmaWx0ZXJOYW1lIH0pO1xuICAgIGl0ZW1zLnJlbW92ZShyZW1vdmUpXG4gIH1cblxuICBmdW5jdGlvbiBhZGRGaWx0ZXIoZmlsdGVyTmFtZSl7XG4gICAgdmFyIGl0ZW1zR2V0ID0gQWN0aXZpdGllc19hbmRfSXNzdWVzO1xuICAgIHZhciBhZGRzID0gXy5maWx0ZXIoaXRlbXNHZXQsIGZ1bmN0aW9uKG51bSl7IHJldHVybiBudW0udHlwZU9mID09IGZpbHRlck5hbWUgfSk7XG4gICAgaXRlbXMuYWRkKGFkZHMpXG4gIH1cblxuICAkc2NvcGUudGhlX1Byb3NwZWN0O1xuICAkc2NvcGUuQ29udGFjdHMgPSBbXTtcbiAgY29uc29sZS5sb2coJHN0YXRlLnBhcmFtcylcbiAgcHJvc3BlY3RGYWN0b3J5LmdldFByb3NwZWN0X2J5X0lEKCRzdGF0ZS5wYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJHb3QgcHJvc3BlY3RcIiwgZGF0YSlcbiAgICAkc2NvcGUudGhlX1Byb3NwZWN0ID0gbmV3IFByb3NwZWN0KGRhdGEuZGF0YSk7XG4gICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnRoZV9Qcm9zcGVjdC5sYXRlc3QpO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS50aGVfUHJvc3BlY3QpXG4gICAgbWFrZVRpbWVsaW5lKCk7XG4gICAgJHNjb3BlLmN1cnJlbnRDb250YWN0ID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0c1swXVxuICB9KVxuXG4gIHZhciB0aW1lbGluZTtcbiAgdmFyIGl0ZW1zO1xuICB2YXIgQWN0aXZpdGllc19hbmRfSXNzdWVzO1xuICBmdW5jdGlvbiBtYWtlVGltZWxpbmUoKXtcbiAgICBjb25zb2xlLmxvZyhcIk1ha2luZyB0aW1lbGluZS4uLnRoaXMgY29uY2F0cyBhbGwgZXZlbnRzIG9uIHRoZSBzYW1lIGRheVwiKVxuXG4gICAgQWN0aXZpdGllc19hbmRfSXNzdWVzID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Jc3N1ZXMuY29uY2F0KCRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllcylcblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVOdW1iZXJzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuZGF5IC0gYi5kYXk7XG4gICAgfVxuICAgIEFjdGl2aXRpZXNfYW5kX0lzc3Vlcy5zb3J0KGNvbXBhcmVOdW1iZXJzKVxuXG4gICAgdmFyIGR1cGVzID0gW107XG4gICAgdmFyIHJhbmdlcyA9IF8ucGx1Y2soQWN0aXZpdGllc19hbmRfSXNzdWVzLCAneWVhcl9kYXknKTtcbiAgICB2YXIgcmFuZ2VzID0gXy51bmlxKHJhbmdlcylcbiAgICB2YXIgbW90aGVyc2hpcCA9IFtdXG4gICAgcmFuZ2VzLmZvckVhY2goZnVuY3Rpb24ocmFuZ2UsIGl0KXtcbiAgICAgICAgdmFyIGdyb3VwcyA9IF8ud2hlcmUoQWN0aXZpdGllc19hbmRfSXNzdWVzLCB7ICd5ZWFyX2RheSc6IHJhbmdlfSk7XG4gICAgICAgIC8vIHB1bGwgb3V0IGlzc3Vlc1xuICAgICAgICB2YXIgaXNzdWVzID0gW11cbiAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgIGdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUpe1xuICAgICAgICAgICAgaWYodHlwZS5pc3N1ZSAmJiBncm91cHMubGVuZ3RoID4gMSl7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZ3JvdXBzLmluZGV4T2YodHlwZSk7XG4gICAgICAgICAgICAgICAgaXNzdWVzID0gZ3JvdXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZihmb3VuZCl7XG4gICAgICAgICAgICBtb3RoZXJzaGlwLnB1c2goaXNzdWVzKVxuICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBtb3RoZXJzaGlwLnB1c2goZ3JvdXBzKTtcbiAgICB9KVxuXG4gICAgQWN0aXZpdGllc19hbmRfSXNzdWVzID0gW107XG4gICAgbW90aGVyc2hpcC5mb3JFYWNoKGZ1bmN0aW9uKGFycil7XG4gICAgICAgIGlmKGFyclswXS5pc3N1ZSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlIGluIG1vdGhlcnNoaXBcIilcbiAgICAgICAgICAgIGFyclswXS5jb250ZW50ID0gXCJJc3N1ZVwiXG4gICAgICAgICAgICBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMucHVzaChhcnJbMF0pXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYXJyWzBdLmNvbnRlbnQgPSBhcnIubGVuZ3RoICsgXCIgTm90ZXNcIlxuICAgICAgICAgICAgYXJyWzBdLndhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgYXJyWzBdLnN1Ym5vdGVzID0gYXJyO1xuICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzLnB1c2goYXJyWzBdKVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIGl0ZW1zID0gbmV3IHZpcy5EYXRhU2V0KEFjdGl2aXRpZXNfYW5kX0lzc3Vlcyk7XG5cbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgIC8vIGhlaWdodDogJzIwMHB4JyxcbiAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoMjAxNCwgbW9tZW50KCkuc3VidHJhY3QoJ21vbnRoJywgMikuZm9ybWF0KFwiTVwiKSwgMSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSgyMDE0LCBtb21lbnQoKS5zdWJ0cmFjdCgnbW9udGgnLCAyKS5mb3JtYXQoXCJNXCIpLCAxKSxcbiAgICAgICAgbWF4OiBuZXcgRGF0ZSgyMDE0LCA3LCAxKVxuICAgICAgICAvLyAgIHpvb21NaW46IDEwMDAgKiA2MCAqIDYwICogMjQgICAgICAgICAgICAvLyBvbmUgZGF5IGluIG1pbGxpc2Vjb25kcywgZnVydGhlc3QgXCJpblwiXG4gICAgICAgIC8vIHpvb21NYXg6IDEwMDAgKiA2MCAqIDYwICogMjQgKiAzMSAqIDMgICAvLyBhYm91dCB0aHJlZSBtb250aHMgaW4gbWlsbGlzZWNvbmRzXG4gICAgfTtcbiAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgdGltZWxpbmUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGxvZ0V2ZW50KCdzZWxlY3QnLCBwcm9wZXJ0aWVzKVxuICAgIH0pO1xuICAgIHRpbWVsaW5lLm9uKCdyYW5nZWNoYW5nZWQnLCBmdW5jdGlvbiAodGltZSkge1xuICAgICAgICAvLyB2YXIgc3RhcnQgPSBuZXcgRGF0ZSh0aW1lLnN0YXJ0KVxuICAgICAgICAvLyBzdGFydCA9IHN0YXJ0LnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsMTUpXG4gICAgICAgIC8vIHZhciBlbmQgPSBuZXcgRGF0ZSh0aW1lLmVuZClcbiAgICAgICAgLy8gZW5kID0gZW5kLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsMTUpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXJ0LCBlbmQpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCBtb21lbnQoZW5kKS5pc0FmdGVyKHN0YXJ0KSApO1xuICAgIH0pO1xuICB9XG5cblxuICAgICRzY29wZS5tZXNzYWdlID0gXCJTZWxlY3QgYW4gZXZlbnRcIjtcbiAgICBmdW5jdGlvbiBsb2dFdmVudChldmVudCwgcHJvcGVydGllcykge1xuICAgICAgLy8gY29uc29sZS5sb2coaXRlbXNbIHByb3BlcnRpZXMuaXRlbXNbMF0gXSlcbiAgICAgIHZhciBjb250ZW50ID0gaXRlbXMuX2RhdGFbIHByb3BlcnRpZXMuaXRlbXNbMF0gXVxuICAgICAgLy8gY29uc29sZS5sb2coY29udGVudC5jb250ZW50KVxuICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBjb250ZW50Lk5vdGU7XG4gICAgICBjb25zb2xlLmxvZyhjb250ZW50KVxuICAgICAgaWYoY29udGVudC53YXJuaW5nKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlNwZWNpYWwgbWVzc2FnZSAtPiBnb3RvIG5vdGVcIilcbiAgICAgICAgICBnb3RvTm90ZShjb250ZW50KTtcbiAgICAgIH1lbHNlIGlmKGNvbnRlbnQuaXNzdWUpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlY2lhbCBpc3N1ZSAtPiBnb3RvIGlzc3VlXCIpXG4gICAgICAgICAgZ290b0lzc3VlKGNvbnRlbnQpO1xuICAgICAgfVxuICAgICAgJHNjb3BlLm1zZ0luZm8gPSBjb250ZW50O1xuICAgICAgJHNjb3BlLnNob3dEZXRhaWxzID0gdHJ1ZTtcbiAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ290b0lzc3VlKG5vdGUpe1xuICAgICAgICAvL2dvdG8gbm90ZSBzaG91bGQgcmVzZXQgem9vbSB0byBcImJhc2VsaW5lXCJcbiAgICAgICAgem9vbWNvdW50ID0gM1xuICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgdmFyIG1vbnRoU3RhcnQgPSBtb21lbnQobm90ZS5zdGFydCkuc3RhcnRPZignbW9udGgnKS5mb3JtYXQoXCJEXCIpXG4gICAgICAgIHZhciBtb250aEVuZCA9IG1vbWVudChub3RlLnN0YXJ0KS5lbmRPZignbW9udGgnKS5mb3JtYXQoXCJEXCIpXG4gICAgICAgIHZhciBvcHRpb25zPSB7XG4gICAgICAgICAgICB6b29tYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKHllYXIsIG1vbnRoLTEsIGRheSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICBzdGFydDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhTdGFydCksXG4gICAgICAgICAgICBtYXg6IG5ldyBEYXRlKG5vdGUueWVhciwgbm90ZS5tb250aCAtIDEsIG1vbnRoRW5kKVxuICAgICAgICB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhub3RlLCBtb250aFN0YXJ0LCBtb250aEVuZClcbiAgICAgICAgbm90ZS5jb250ZW50ID0gbm90ZS5EZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgICRzY29wZS5tZXNzYWdlID0gbm90ZS5EZXNjcmlwdGlvbjtcbiAgICAgICAgdGltZWxpbmUuZGVzdHJveSgpO1xuICAgICAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gZ290b05vdGUobm90ZSl7XG4gICAgICAgIC8vZ290byBub3RlIHNob3VsZCByZXNldCB6b29tIHRvIFwiYmFzZWxpbmVcIlxuICAgICAgICB6b29tY291bnQgPSAzXG4gICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlzdWFsaXphdGlvbicpO1xuICAgICAgICB2YXIgbW9udGhTdGFydCA9IG1vbWVudChub3RlLnN0YXJ0KS5zdGFydE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgdmFyIG1vbnRoRW5kID0gbW9tZW50KG5vdGUuc3RhcnQpLmVuZE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgdmFyIG9wdGlvbnM9IHtcbiAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoeWVhciwgbW9udGgtMSwgZGF5KSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShub3RlLnllYXIsIG5vdGUubW9udGggLSAxLCBtb250aFN0YXJ0KSxcbiAgICAgICAgICAgIG1heDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhFbmQpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnNvbGUubG9nKG5vdGUsIG1vbnRoU3RhcnQsIG1vbnRoRW5kKVxuICAgICAgICBub3RlLnN1Ym5vdGVzLmZvckVhY2goZnVuY3Rpb24obm90ZXMpe1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm90ZXMpXG4gICAgICAgICAgICBub3Rlcy5jb250ZW50ID0gbm90ZXMuTm90ZS5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgICAgICAvLyBpdGVtcy5jbGVhcigpXG4gICAgICAgICAgICBpdGVtcy5yZW1vdmUobm90ZS5pZClcbiAgICAgICAgICAgIGl0ZW1zLmFkZChub3RlcylcbiAgICAgICAgfSlcbiAgICAgICAgdGltZWxpbmUuZGVzdHJveSgpO1xuICAgICAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFpvb20gdGhlIHRpbWVsaW5lIGEgZ2l2ZW4gcGVyY2VudGFnZSBpbiBvciBvdXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGVyY2VudGFnZSAgIEZvciBleGFtcGxlIDAuMSAoem9vbSBvdXQpIG9yIC0wLjEgKHpvb20gaW4pXG4gICAgICovXG4gICAgLy8gIHZhciB6b29tY291bnQgPSAzXG4gICAgZnVuY3Rpb24gem9vbSAoem9vbV9pbikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFtb3VudHNcIiwgem9vbWNvdW50LCB6b29tX2luKVxuICAgICAgICB6b29tY291bnQgPSB6b29tY291bnQgKyB6b29tX2luXG4gICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICBpZih6b29tY291bnQgPT0gNCl7XG4gICAgICAgICAgICAvLyB6b29tY291bnQrK1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJab29tIGluXCIsIHpvb21jb3VudClcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoMjAxNCwgNSwgMSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKDIwMTQsIDUsIDEpLFxuICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUoMjAxNCwgNywgMSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBwcmV2ZW50cyB6b29tIGNvdW50IGZyb20gZ29pbmcgcGFzdCA0XG4gICAgICAgICAgICB6b29tY291bnQgPSAzO1xuICAgICAgICAgICAgem9vbVRpbWVsaW5lKClcbiAgICAgICAgfWVsc2UgaWYoem9vbWNvdW50ID09IDIpe1xuICAgICAgICAgICAgLy8gem9vbWNvdW50LS1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWm9vbSBvdXQgJ21vbnRoIHZpZXcnIFwiLCB6b29tY291bnQpXG4gICAgICAgICAgICBjb29sbmV3U29ydE1ldGhvZCgpO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB6b29tYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vICAgbWluOiBuZXcgRGF0ZSgyMDEyLCA3LCAxKSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoMjAxNCwgMSwgMSksXG4gICAgICAgICAgICAgICAgbWF4OiBuZXcgRGF0ZSgyMDE0LCA3LCAxKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHpvb21UaW1lbGluZSgpXG4gICAgICAgIH1lbHNlIGlmKHpvb21jb3VudCA9PSAxKXtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXaWxkY2FyZCB6b29tLCBwbGFjZWhvbGRlci4uLlRvZG9cIiwgem9vbWNvdW50KVxuICAgICAgICAgICAgem9vbVRpbWVsaW5lKClcbiAgICAgICAgfWVsc2UgaWYoem9vbWNvdW50ID09IDApe1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNhbmNlbCB6b29tXCIsIHpvb21jb3VudClcbiAgICAgICAgICAgIHpvb21jb3VudCsrXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB6b29tVGltZWxpbmUoKXtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlzdWFsaXphdGlvbicpO1xuICAgICAgICAgICAgdGltZWxpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGltZWxpbmUgPSBuZXcgdmlzLlRpbWVsaW5lKGNvbnRhaW5lciwgaXRlbXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGltZWxpbmUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGF0dGFjaCBldmVudHMgdG8gdGhlIG5hdmlnYXRpb24gYnV0dG9uc1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tSW4nKS5vbmNsaWNrICAgID0gZnVuY3Rpb24gKCkgeyB6b29tKDEpOyB9O1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tT3V0Jykub25jbGljayAgID0gZnVuY3Rpb24gKCkgeyB6b29tKC0xKTsgfTtcbiAgICAkc2NvcGUuaWNvbnMgPSBbXG4gICAgICAgIHt2YWx1ZTogMSwgbGFiZWw6ICdPd25lcid9LFxuICAgICAgICB7dmFsdWU6IDIsIGxhYmVsOiAnUGVyc29uIGluJ30sXG4gICAgICAgIHt2YWx1ZTogMywgbGFiZWw6ICdCZXN0IEZyaWVuZCd9XG4gICAgXTtcblxuXG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNvbnRhY3Qpe1xuICAgICAgICB2YXIgdGFyZyA9IF8uZmluZFdoZXJlKCRzY29wZS50aGVfUHJvc3BlY3QuQ29udGFjdHMsIGNvbnRhY3QpXG4gICAgICAgIHZhciBkaWZmID0gdGFyZy5vbGRfdnNfbmV3O1xuICAgICAgICAvLyBuZWVkIHRvIGNoZWNrIHRoZSBsZW5ndGggdG8gc2VlIGlmIGl0J3MgYW4gYWRkIG9yIGEgZGVsZXRlXG4gICAgICAgIGlmKGRpZmYub2xkLmxlbmd0aCA+IGRpZmYubmV3Lmxlbmd0aCl7XG4gICAgICAgICAgICB2YXIgY2hhbmdlZCA9IF8uZGlmZmVyZW5jZShkaWZmLm9sZCwgZGlmZi5uZXcpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWJ0cmFjdGVkXCIsIGNoYW5nZWQpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdmFyIGNoYW5nZWQgPSBfLmRpZmZlcmVuY2UoZGlmZi5uZXcsIGRpZmYub2xkKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkZWRcIiwgY2hhbmdlZClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gY29vbG5ld1NvcnRNZXRob2QoKXtcbiAgICAgICAgdmFyIG1vbnRocyA9IDEyXG4gICAgICAgIHZhciB5ZWFycyA9IFsyMDEwLCAyMDExLCAyMDEyLCAyMDEzLCAyMDE0XVxuICAgICAgICB2YXIgcmFuZ2VzID0gXy5wbHVjayhBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMsICdtb250aF95ZWFyJyk7XG4gICAgICAgIHZhciByYW5nZXMgPSBfLnVuaXEocmFuZ2VzKVxuICAgICAgICB2YXIgbW90aGVyc2hpcCA9IFtdXG4gICAgICAgIHJhbmdlcy5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlLCBpdCl7XG4gICAgICAgICAgICB2YXIgZ3JvdXBzID0gXy53aGVyZShBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMsIHsgJ21vbnRoX3llYXInOiByYW5nZSB9KTtcbiAgICAgICAgICAgIG1vdGhlcnNoaXBbaXRdID0gZ3JvdXBzO1xuICAgICAgICB9KVxuXG4gICAgICAgIGl0ZW1zLmNsZWFyKCk7XG5cbiAgICAgICAgbW90aGVyc2hpcC5mb3JFYWNoKGZ1bmN0aW9uKGFycil7XG4gICAgICAgICAgICBkZWxldGUgYXJyWzBdLmlkO1xuICAgICAgICAgICAgYXJyWzBdLmNvbnRlbnQgPSBhcnIubGVuZ3RoICsgXCIgTm90ZXNcIlxuICAgICAgICAgICAgYXJyWzBdLndhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgYXJyWzBdLnN1Ym5vdGVzID0gYXJyO1xuICAgICAgICAgICAgaXRlbXMuYWRkKGFyclswXSlcbiAgICAgICAgfSlcbiAgICB9XG5cbn0pXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=