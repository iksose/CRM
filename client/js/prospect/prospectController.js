angular.module('uiRouterSample')
.controller('prospectController', function($scope, $rootScope, $state, $alert, prospectFactory) {
  console.log("Hello prospect")

  $scope.isCollapsed = true;


   // filters
  $scope.filters = ['All Activities', 'Only My Activities', 'Closed Issues', 'Open Issues', 'Trinet', 'ProfitGuard'];
  // selected filters
  $scope.selection = ['All Activities', 'Closed Issues', 'Open Issues', 'Trinet', 'ProfitGuard'];
  // toggle selection for a given filter by name
  $scope.toggleSelection = function toggleSelection(filterName) {
    var idx = $scope.selection.indexOf(filterName);
    // is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
      deleteFilter(filterName);
    }
    // is newly selected
    else {
      addFilter(filterName);
      $scope.selection.push(filterName);
    }
    // runFilters();
  };

  function deleteFilter(filterName){
    var itemsGet = items.get();
    var remove = _.filter(itemsGet, function(num){ return num.typeOf == filterName });
    items.remove(remove)
  }

  function addFilter(filterName){
    var itemsGet = Activities_and_Issues;
    var adds = _.filter(itemsGet, function(num){ return num.typeOf == filterName });
    items.add(adds)
  }

  var the_Prospect;
  prospectFactory.getProspect_by_ID().then(function(data){
    // results.data.forEach(function(prospect){
    console.log("Got prospect", data)
      the_Prospect = new Prospect(data.data);
      console.log(the_Prospect.latest);
      // prospectList.push(prospect_constructor);
    // })
    // console.log("List", prospectList)
    console.log(the_Prospect)
    makeTimeline();
  })

  var timeline;
  var items;
  var Activities_and_Issues;
  function makeTimeline(){
    console.log("Making timeline")

    Activities_and_Issues = the_Prospect.Issues.concat(the_Prospect.Activities)

    // var Activities_and_Issues = _.reject(Activities_and_Issues, function(num){ return num.typeOf == 'activity'; });

    items = new vis.DataSet(Activities_and_Issues);

    var container = document.getElementById('visualization');
    var options = {
      editable: false,
      min: new Date(2001, 0, 1), //further back you can go
      // max: new Date(2016, 0, 1),
      zoomMin: 1000 * 60 * 60 * 24            // one day in milliseconds, furthest "in"
      // zoomMax: 1000 * 60 * 60 * 24 * 31 * 3   // about three months in milliseconds
    };
    timeline = new vis.Timeline(container, items, options);
    timeline.on('select', function (properties) {
      logEvent('select', properties);
    });
  }


    $scope.message = "Select an event";
    function logEvent(event, properties) {
      // console.log(items[ properties.items[0] ])
      var content = items._data[ properties.items[0] ]
      // console.log(content.content)
      $scope.message = content.content;
      console.log(content)
      $scope.msgInfo = content;
      $scope.$digest();
    }

    /**
     * Zoom the timeline a given percentage in or out
     * @param {Number} percentage   For example 0.1 (zoom out) or -0.1 (zoom in)
     */
    function zoom (percentage) {
      console.log(items._data)
      // items.remove('IssueID', 0)
      // var removeThis = _.where(items._data, {typeOf: "activities"})
      // console.log("Remove", removeThis)
        var range = timeline.getWindow();
        var interval = range.end - range.start;

        timeline.setWindow({
            start: range.start.valueOf() - interval * percentage,
            end:   range.end.valueOf()   + interval * percentage
        });
    }

    // attach events to the navigation buttons
    // document.getElementById('zoomIn').onclick    = function () { zoom(-0.2); };
    // document.getElementById('zoomOut').onclick   = function () { zoom( 0.2); };

})