define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('searchController', function($scope, $rootScope, $state, $alert, searchFactory, $timeout, $location) {
    console.log("Hello search");
    console.log($state.params);
    var stateParams = $state.params;
    Object.keys(stateParams).forEach(function(key) {
      if (!stateParams[$traceurRuntime.toProperty(key)]) {
        delete stateParams[$traceurRuntime.toProperty(key)];
      }
    });
    console.log("Got", stateParams);
    if (Object.keys(stateParams).length) {
      console.log("There's params, guys!!!");
      searchFactory.search(stateParams).then(function(res) {
        console.log(res.data);
        $scope.searchResults = [];
        if (res.data.length > 0) {
          $scope.emptyResults = false;
          res.data.forEach(function(prospect) {
            $scope.searchResults.push(new Prospect(prospect));
          });
        } else {
          $scope.emptyResults = true;
          console.log("No data");
        }
        console.log($scope.searchResults);
      });
    } else {
      console.log("No state params present");
    }
    $scope.paramsObj = {ProspectID: ''};
    $scope.config = {
      itemsPerPage: 10,
      fillLastPage: false
    };
    $scope.searchResults = [];
    $scope.emptyResults = false;
    $scope.searchString = '';
    $scope.startSearch = function() {
      Object.keys($scope.paramsObj).forEach(function(key) {
        $traceurRuntime.setProperty($scope.paramsObj, key, $scope.searchString);
      });
      $location.search($scope.paramsObj);
    };
    $scope.searchOptions = ['ProspectID', 'CustID', 'NCPDP', 'NPI'];
    $scope.item = $scope.searchOptions[0];
    $scope.searchSet = function() {
      Object.keys($scope.paramsObj).forEach(function(key) {
        delete $scope.paramsObj[$traceurRuntime.toProperty(key)];
      });
      $traceurRuntime.setProperty($scope.paramsObj, $scope.item, '');
    };
    $scope.gotoProspect = function(prospectID) {
      console.log("Okay");
      $state.go('home.prospect', {ProspectID: prospectID});
    };
    $scope.CityStateZip_string;
    $scope.fnCityStateZip = function() {
      var array = [];
      $scope.CityStateZip_string.split(',').forEach(function(word) {
        array.push($.trim(word));
      });
      console.log(array);
      var noSpaces = [];
      array.forEach(function(word) {
        noSpaces.push(word.split(' '));
      });
      var zip = "";
      array.forEach(function(part) {
        zip = extractZip(part);
      });
      console.log("Zip?", zip);
      if (zip.length > 0) {
        $location.search({'Zip': zip});
      }
      console.log("comma separated", array);
      var index = array.indexOf(zip);
      if (index > -1) {
        array.splice(index, 1);
      }
      console.log("Removed zip object", array);
      var state = '';
      array.forEach(function(string) {
        if (string.length == 2)
          state = string;
      });
      console.log("State", state);
      var index = array.indexOf(state);
      if (index > -1) {
        array.splice(index, 1);
      }
      console.log("Removed state object", array);
      console.log("Final check", array);
      if (array.length > 0 && zip.length == 0) {
        console.log("All we've got left is City");
        $location.search({'City': array[0]});
      }
      if (array.length == 0 && zip.length == 0) {
        $location.search({'State': state});
      }
      function extractZip(str) {
        var re = /\d{5}-\d{4}|\d{5}|[A-Z]\d[A-Z] \d[A-Z]\d/;
        var input = str;
        var match = re.exec(input);
        if (match) {
          return match[0];
        } else {
          return "";
        }
      }
    };
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvc2VhcmNoL3NlYXJjaENvbnRyb2xsZXIuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9zZWFyY2gvc2VhcmNoQ29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ3NlYXJjaENvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0LCBzZWFyY2hGYWN0b3J5LCAkdGltZW91dCwgJGxvY2F0aW9uKSB7XG4gICAgY29uc29sZS5sb2coXCJIZWxsbyBzZWFyY2hcIilcblxuICAgIGNvbnNvbGUubG9nKCRzdGF0ZS5wYXJhbXMpXG5cblxuICAgIHZhciBzdGF0ZVBhcmFtcyA9ICRzdGF0ZS5wYXJhbXNcbiAgICBPYmplY3Qua2V5cyhzdGF0ZVBhcmFtcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKCFzdGF0ZVBhcmFtc1trZXldKSB7XG4gICAgICAgICAgICBkZWxldGUgc3RhdGVQYXJhbXNba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coXCJHb3RcIiwgc3RhdGVQYXJhbXMpXG5cbiAgICBpZihPYmplY3Qua2V5cyhzdGF0ZVBhcmFtcykubGVuZ3RoKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSdzIHBhcmFtcywgZ3V5cyEhIVwiKVxuICAgICAgICBzZWFyY2hGYWN0b3J5LnNlYXJjaChzdGF0ZVBhcmFtcykudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgaWYocmVzLmRhdGEubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVtcHR5UmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlcy5kYXRhLmZvckVhY2goZnVuY3Rpb24ocHJvc3BlY3Qpe1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cy5wdXNoKCBuZXcgUHJvc3BlY3QocHJvc3BlY3QpIClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVtcHR5UmVzdWx0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBkYXRhXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuc2VhcmNoUmVzdWx0cylcbiAgICAgICAgfSlcbiAgICB9ZWxzZXtcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBzdGF0ZSBwYXJhbXMgcHJlc2VudFwiKVxuICAgIH1cblxuXG5cbiAgICAkc2NvcGUucGFyYW1zT2JqID0ge1xuICAgICAgICBQcm9zcGVjdElEOiAnJ1xuICAgIH1cblxuICAgIC8vXG4gICAgJHNjb3BlLmNvbmZpZyA9IHtcbiAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZVxuICAgIH1cblxuICAgICRzY29wZS5zZWFyY2hSZXN1bHRzID0gW107XG4gICAgJHNjb3BlLmVtcHR5UmVzdWx0cyA9IGZhbHNlO1xuICAgICRzY29wZS5zZWFyY2hTdHJpbmcgPSAnJ1xuXG4gICAgJHNjb3BlLnN0YXJ0U2VhcmNoID0gZnVuY3Rpb24oKXtcbiAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLnBhcmFtc09iaikuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgJHNjb3BlLnBhcmFtc09ialtrZXldID0gJHNjb3BlLnNlYXJjaFN0cmluZztcbiAgICAgICAgfSlcbiAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCgkc2NvcGUucGFyYW1zT2JqKVxuICAgIH1cblxuXG5cbiAgICAkc2NvcGUuc2VhcmNoT3B0aW9ucyA9IFtcbiAgICAgICAgJ1Byb3NwZWN0SUQnLFxuICAgICAgICAnQ3VzdElEJyxcbiAgICAgICAgJ05DUERQJyxcbiAgICAgICAgJ05QSSdcbiAgICBdXG4gICAgLy8gc2V0cyBkZWZhdWx0IHRvICdQcm9zcGVjdElEJ1xuICAgICRzY29wZS5pdGVtID0gJHNjb3BlLnNlYXJjaE9wdGlvbnNbMF1cblxuICAgIC8vIHNldCAkc2NvcGUucGFyYW1zT2JqIGZyb20gZHJvcGRvd25cbiAgICAkc2NvcGUuc2VhcmNoU2V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLnBhcmFtc09iaikuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuICAgICAgICAgICAgZGVsZXRlICRzY29wZS5wYXJhbXNPYmpba2V5XVxuICAgICAgICB9KVxuICAgICAgICAkc2NvcGUucGFyYW1zT2JqWyRzY29wZS5pdGVtXSA9ICcnO1xuICAgIH1cblxuICAgICRzY29wZS5nb3RvUHJvc3BlY3QgPSBmdW5jdGlvbihwcm9zcGVjdElEKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJPa2F5XCIpXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZS5wcm9zcGVjdCcsIHtQcm9zcGVjdElEOiBwcm9zcGVjdElEfSlcbiAgICB9XG5cbiAgICAkc2NvcGUuQ2l0eVN0YXRlWmlwX3N0cmluZztcblxuICAgICRzY29wZS5mbkNpdHlTdGF0ZVppcCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vcHJpb3JpdGl6ZXMgemlwLCB0aGVuIGNpdHksIGFuZCBsYXN0bHkgc3RhdGVcbiAgICAgICAgdmFyIGFycmF5ID0gW11cbiAgICAgICAgJHNjb3BlLkNpdHlTdGF0ZVppcF9zdHJpbmcuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKHdvcmQpe1xuICAgICAgICAgICAgYXJyYXkucHVzaCgkLnRyaW0od29yZCkpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKGFycmF5KVxuXG5cbiAgICAgICAgLy90dXJucyBcIk1PIDY0MTEwXCIgaW50byB0d28gc3RyaW5nc1xuICAgICAgICAvLyBvciBcIkthbnNhcyBDaXR5IDY0MTEwXCJcbiAgICAgICAgdmFyIG5vU3BhY2VzID0gW107XG4gICAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24od29yZCl7XG4gICAgICAgICAgICBub1NwYWNlcy5wdXNoKCB3b3JkLnNwbGl0KCcgJykgKTtcbiAgICAgICAgfSlcblxuICAgICAgICB2YXIgemlwID0gXCJcIjtcbiAgICAgICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbihwYXJ0KXtcbiAgICAgICAgICAgIHppcCA9IGV4dHJhY3RaaXAocGFydClcbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coXCJaaXA/XCIsIHppcClcbiAgICAgICAgaWYoemlwLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7J1ppcCc6IHppcH0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJjb21tYSBzZXBhcmF0ZWRcIiwgYXJyYXkpXG5cbiAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZih6aXApO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVtb3ZlZCB6aXAgb2JqZWN0XCIsIGFycmF5KVxuXG4gICAgICAgIC8vIGlmIHN0cmluZyBpcyA9PSB0aGFuIDIgaXQncyBzdGF0ZVxuICAgICAgICB2YXIgc3RhdGUgPSAnJ1xuICAgICAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHN0cmluZyl7XG4gICAgICAgICAgICBpZihzdHJpbmcubGVuZ3RoID09IDIpIHN0YXRlID0gc3RyaW5nXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc29sZS5sb2coXCJTdGF0ZVwiLCBzdGF0ZSlcblxuICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKHN0YXRlKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJSZW1vdmVkIHN0YXRlIG9iamVjdFwiLCBhcnJheSlcblxuICAgICAgICAvLyBpZiBubyB6aXAsIHNlYXJjaCBieSBjaXR5XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmluYWwgY2hlY2tcIiwgYXJyYXkpXG4gICAgICAgIGlmKGFycmF5Lmxlbmd0aCA+IDAgJiYgemlwLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWxsIHdlJ3ZlIGdvdCBsZWZ0IGlzIENpdHlcIilcbiAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goeydDaXR5JzogYXJyYXlbMF19KVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgbm8gemlwIG9yIGNpdHksIHNlYXJjaCBieSBzdGF0ZVxuICAgICAgICBpZihhcnJheS5sZW5ndGggPT0gMCAmJiB6aXAubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7J1N0YXRlJzogc3RhdGV9KVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXh0cmFjdFppcChzdHIpIHtcbiAgICAgICAgICAgIC8vdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBiZWxvdyBpcyBmb3IgNSBkaWdpdCBVUyBaSVAgY29kZSwgNSBkaWdpdCBVUyBaSVAgY29kZSArIDQsXG4gICAgICAgICAgICAvL2FuZCA2IGRpZ2l0IGFscGhhbnVtZXJpYyBDYW5hZGlhbiBQb3N0YWwgQ29kZVxuICAgICAgICAgICAgdmFyIHJlID0gL1xcZHs1fS1cXGR7NH18XFxkezV9fFtBLVpdXFxkW0EtWl0gXFxkW0EtWl1cXGQvXG4gICAgICAgICAgICB2YXIgaW5wdXQgPSBzdHI7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSByZS5leGVjKGlucHV0KVxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=