define([], function() {
  "use strict";
  angular.module('uiRouterSample').directive('dirPaginate', ['$compile', '$parse', '$timeout', 'paginationService', function($compile, $parse, $timeout, paginationService) {
    return {
      priority: 5000,
      terminal: true,
      compile: function(element, attrs) {
        attrs.$set('ngRepeat', attrs.dirPaginate);
        var expression = attrs.dirPaginate;
        var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
        var filterPattern = /\|\s*itemsPerPage:[^|]*/;
        if (match[2].match(filterPattern) === null) {
          throw "pagination directive: the 'itemsPerPage' filter must be set.";
        }
        var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
        var collectionGetter = $parse(itemsPerPageFilterRemoved);
        var compiled = $compile(element, null, 5000);
        return function(scope, element, attrs) {
          var paginationId;
          paginationId = attrs.paginationId || "__default";
          paginationService.registerInstance(paginationId);
          var currentPageGetter;
          if (attrs.currentPage) {
            currentPageGetter = $parse(attrs.currentPage);
          } else {
            scope.__currentPage = 1;
            currentPageGetter = $parse('__currentPage');
          }
          paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);
          if (typeof attrs.totalItems !== 'undefined') {
            paginationService.setAsyncModeTrue(paginationId);
            scope.$watch(function() {
              return $parse(attrs.totalItems)(scope);
            }, function(result) {
              if (0 < result) {
                paginationService.setCollectionLength(paginationId, result);
              }
            });
          } else {
            scope.$watchCollection(function() {
              return collectionGetter(scope);
            }, function(collection) {
              if (collection) {
                paginationService.setCollectionLength(paginationId, collection.length);
              }
            });
          }
          compiled(scope);
        };
      }
    };
  }]).directive('dirPaginationControls', ['paginationService', function(paginationService) {
    function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
      var pages = [];
      var totalPages = Math.ceil(collectionLength / rowsPerPage);
      var halfWay = Math.ceil(paginationRange / 2);
      var position;
      if (currentPage <= halfWay) {
        position = 'start';
      } else if (totalPages - halfWay < currentPage) {
        position = 'end';
      } else {
        position = 'middle';
      }
      var ellipsesNeeded = paginationRange < totalPages;
      var i = 1;
      while (i <= totalPages && i <= paginationRange) {
        var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);
        var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
        var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
        if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
          pages.push('...');
        } else {
          pages.push(pageNumber);
        }
        i++;
      }
      return pages;
    }
    function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
      var halfWay = Math.ceil(paginationRange / 2);
      if (i === paginationRange) {
        return totalPages;
      } else if (i === 1) {
        return i;
      } else if (paginationRange < totalPages) {
        if (totalPages - halfWay < currentPage) {
          return totalPages - paginationRange + i;
        } else if (halfWay < currentPage) {
          return currentPage - halfWay + i;
        } else {
          return i;
        }
      } else {
        return i;
      }
    }
    return {
      restrict: 'AE',
      templateUrl: 'views/dirPagination.tpl.html',
      scope: {
        maxSize: '=?',
        onPageChange: '&?'
      },
      link: function(scope, element, attrs) {
        var paginationId;
        paginationId = attrs.paginationId || "__default";
        if (!scope.maxSize) {
          scope.maxSize = 9;
        }
        scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
        scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;
        if (!paginationService.isRegistered(paginationId)) {
          var idMessage = (paginationId !== '__default') ? " (id: " + paginationId + ") " : " ";
          throw "pagination directive: the pagination controls" + idMessage + "cannot be used without the corresponding pagination directive.";
        }
        var paginationRange = Math.max(scope.maxSize, 5);
        scope.pages = [];
        scope.pagination = {
          last: 1,
          current: 1
        };
        scope.$watch(function() {
          return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);
        }, function(length) {
          if (0 < length) {
            generatePagination();
          }
        });
        scope.$watch(function() {
          return paginationService.getCurrentPage(paginationId);
        }, function(currentPage) {
          scope.pages = generatePagesArray(currentPage, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
        });
        scope.setCurrent = function(num) {
          if (/^\d+$/.test(num)) {
            if (0 < num && num <= scope.pagination.last) {
              paginationService.setCurrentPage(paginationId, num);
              scope.pages = generatePagesArray(num, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
              scope.pagination.current = num;
              if (scope.onPageChange) {
                scope.onPageChange({newPageNumber: num});
              }
            }
          }
        };
        function generatePagination() {
          scope.pages = generatePagesArray(1, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
          scope.pagination.current = parseInt(paginationService.getCurrentPage(paginationId));
          scope.pagination.last = scope.pages[$traceurRuntime.toProperty(scope.pages.length - 1)];
          if (scope.pagination.last < scope.pagination.current) {
            scope.setCurrent(scope.pagination.last);
          }
        }
      }
    };
  }]).filter('itemsPerPage', ['paginationService', function(paginationService) {
    return function(collection, itemsPerPage, paginationId) {
      if (typeof(paginationId) === 'undefined') {
        paginationId = "__default";
      }
      if (!paginationService.isRegistered(paginationId)) {
        throw "pagination directive: the itemsPerPage id argument (id: " + paginationId + ") does not match a registered pagination-id.";
      }
      var end;
      var start;
      if (collection instanceof Array) {
        itemsPerPage = itemsPerPage || 9999999999;
        if (paginationService.isAsyncMode(paginationId)) {
          start = 0;
        } else {
          start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
        }
        end = start + itemsPerPage;
        paginationService.setItemsPerPage(paginationId, itemsPerPage);
        return collection.slice(start, end);
      } else {
        return collection;
      }
    };
  }]).service('paginationService', function() {
    var instances = {};
    var lastRegisteredInstance;
    this.paginationDirectiveInitialized = false;
    this.registerInstance = function(instanceId) {
      if (typeof instances[$traceurRuntime.toProperty(instanceId)] === 'undefined') {
        $traceurRuntime.setProperty(instances, instanceId, {asyncMode: false});
        lastRegisteredInstance = instanceId;
      }
    };
    this.isRegistered = function(instanceId) {
      return (typeof instances[$traceurRuntime.toProperty(instanceId)] !== 'undefined');
    };
    this.getLastInstanceId = function() {
      return lastRegisteredInstance;
    };
    this.setCurrentPageParser = function(instanceId, val, scope) {
      instances[$traceurRuntime.toProperty(instanceId)].currentPageParser = val;
      instances[$traceurRuntime.toProperty(instanceId)].context = scope;
    };
    this.setCurrentPage = function(instanceId, val) {
      instances[$traceurRuntime.toProperty(instanceId)].currentPageParser.assign(instances[$traceurRuntime.toProperty(instanceId)].context, val);
    };
    this.getCurrentPage = function(instanceId) {
      return instances[$traceurRuntime.toProperty(instanceId)].currentPageParser(instances[$traceurRuntime.toProperty(instanceId)].context);
    };
    this.setItemsPerPage = function(instanceId, val) {
      instances[$traceurRuntime.toProperty(instanceId)].itemsPerPage = val;
    };
    this.getItemsPerPage = function(instanceId) {
      return instances[$traceurRuntime.toProperty(instanceId)].itemsPerPage;
    };
    this.setCollectionLength = function(instanceId, val) {
      instances[$traceurRuntime.toProperty(instanceId)].collectionLength = val;
    };
    this.getCollectionLength = function(instanceId) {
      return instances[$traceurRuntime.toProperty(instanceId)].collectionLength;
    };
    this.setAsyncModeTrue = function(instanceId) {
      instances[$traceurRuntime.toProperty(instanceId)].asyncMode = true;
    };
    this.isAsyncMode = function(instanceId) {
      return instances[$traceurRuntime.toProperty(instanceId)].asyncMode;
    };
  });
  ;
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWlzYy9wYWdpbmF0ZS5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL21pc2MvcGFnaW5hdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBkaXJQYWdpbmF0aW9uIC0gQW5ndWxhckpTIG1vZHVsZSBmb3IgcGFnaW5hdGluZyAoYWxtb3N0KSBhbnl0aGluZy5cbiAqXG4gKlxuICogQ3JlZGl0c1xuICogPT09PT09PVxuICpcbiAqIERhbmllbCBUYWJ1ZW5jYTogaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9kL21zZy9hbmd1bGFyL2FuOVFwenFJWWlNL3I4di0zVzFYNXZjSlxuICogZm9yIHRoZSBpZGVhIG9uIGhvdyB0byBkeW5hbWljYWxseSBpbnZva2UgdGhlIG5nLXJlcGVhdCBkaXJlY3RpdmUuXG4gKlxuICogSSBib3Jyb3dlZCBhIGNvdXBsZSBvZiBsaW5lcyBhbmQgYSBmZXcgYXR0cmlidXRlIG5hbWVzIGZyb20gdGhlIEFuZ3VsYXJVSSBCb290c3RyYXAgcHJvamVjdDpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9zcmMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmpzXG4gKlxuICogQ3JlYXRlZCBieSBNaWNoYWVsIG9uIDA0LzA1LzE0LlxuICovXG5cbmFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmRpcmVjdGl2ZSgnZGlyUGFnaW5hdGUnLCBbJyRjb21waWxlJywgJyRwYXJzZScsICckdGltZW91dCcsICdwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKCRjb21waWxlLCAkcGFyc2UsICR0aW1lb3V0LCBwYWdpbmF0aW9uU2VydmljZSkge1xuICAgICAgICByZXR1cm4gIHtcbiAgICAgICAgICAgIHByaW9yaXR5OiA1MDAwLCAvL0hpZ2ggcHJpb3JpdHkgbWVhbnMgaXQgd2lsbCBleGVjdXRlIGZpcnN0XG4gICAgICAgICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCduZ1JlcGVhdCcsIGF0dHJzLmRpclBhZ2luYXRlKTsgLy9BZGQgbmctcmVwZWF0IHRvIHRoZSBkb21cblxuICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gYXR0cnMuZGlyUGFnaW5hdGU7XG4gICAgICAgICAgICAgICAgLy8gcmVnZXggdGFrZW4gZGlyZWN0bHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvbWFzdGVyL3NyYy9uZy9kaXJlY3RpdmUvbmdSZXBlYXQuanMjTDIxMVxuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goL15cXHMqKFtcXHNcXFNdKz8pXFxzK2luXFxzKyhbXFxzXFxTXSs/KSg/Olxccyt0cmFja1xccytieVxccysoW1xcc1xcU10rPykpP1xccyokLyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlsdGVyUGF0dGVybiA9IC9cXHxcXHMqaXRlbXNQZXJQYWdlOltefF0qLztcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0ubWF0Y2goZmlsdGVyUGF0dGVybikgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJwYWdpbmF0aW9uIGRpcmVjdGl2ZTogdGhlICdpdGVtc1BlclBhZ2UnIGZpbHRlciBtdXN0IGJlIHNldC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zUGVyUGFnZUZpbHRlclJlbW92ZWQgPSBtYXRjaFsyXS5yZXBsYWNlKGZpbHRlclBhdHRlcm4sICcnKTtcbiAgICAgICAgICAgICAgICB2YXIgY29sbGVjdGlvbkdldHRlciA9ICRwYXJzZShpdGVtc1BlclBhZ2VGaWx0ZXJSZW1vdmVkKTtcblxuICAgICAgICAgICAgICAgIC8vTm93IHRoYXQgd2UgYWRkZWQgbmctcmVwZWF0IHRvIHRoZSBlbGVtZW50LCBwcm9jZWVkIHdpdGggY29tcGlsYXRpb25cbiAgICAgICAgICAgICAgICAvL2J1dCBza2lwIGRpcmVjdGl2ZXMgd2l0aCBwcmlvcml0eSA1MDAwIG9yIGFib3ZlIHRvIGF2b2lkIGluZmluaXRlXG4gICAgICAgICAgICAgICAgLy9yZWN1cnNpb24gKHdlIGRvbid0IHdhbnQgdG8gY29tcGlsZSBvdXJzZWx2ZXMgYWdhaW4pXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBpbGVkID0gICRjb21waWxlKGVsZW1lbnQsIG51bGwsIDUwMDApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYWdpbmF0aW9uSWQ7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25JZCA9IGF0dHJzLnBhZ2luYXRpb25JZCB8fCBcIl9fZGVmYXVsdFwiO1xuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5yZWdpc3Rlckluc3RhbmNlKHBhZ2luYXRpb25JZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRQYWdlR2V0dGVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cnMuY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlR2V0dGVyID0gJHBhcnNlKGF0dHJzLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50LXBhZ2UgYXR0cmlidXRlIHdhcyBub3Qgc2V0LCB3ZSdsbCBtYWtlIG91ciBvd25cbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLl9fY3VycmVudFBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2VHZXR0ZXIgPSAkcGFyc2UoJ19fY3VycmVudFBhZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRDdXJyZW50UGFnZVBhcnNlcihwYWdpbmF0aW9uSWQsIGN1cnJlbnRQYWdlR2V0dGVyLCBzY29wZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRycy50b3RhbEl0ZW1zICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0QXN5bmNNb2RlVHJ1ZShwYWdpbmF0aW9uSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMudG90YWxJdGVtcykoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwIDwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbkdldHRlcihzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQsIGNvbGxlY3Rpb24ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL1doZW4gbGlua2luZyBqdXN0IGRlbGVnYXRlIHRvIHRoZSBsaW5rIGZ1bmN0aW9uIHJldHVybmVkIGJ5IHRoZSBuZXcgY29tcGlsZVxuICAgICAgICAgICAgICAgICAgICBjb21waWxlZChzY29wZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSlcblxuICAgIC5kaXJlY3RpdmUoJ2RpclBhZ2luYXRpb25Db250cm9scycsIFsncGFnaW5hdGlvblNlcnZpY2UnLCBmdW5jdGlvbihwYWdpbmF0aW9uU2VydmljZSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgYW4gYXJyYXkgb2YgcGFnZSBudW1iZXJzIChvciB0aGUgJy4uLicgc3RyaW5nKSB3aGljaCBpcyB1c2VkIGluIGFuIG5nLXJlcGVhdCB0byBnZW5lcmF0ZSB0aGVcbiAgICAgICAgICogbGlua3MgdXNlZCBpbiBwYWdpbmF0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBjdXJyZW50UGFnZVxuICAgICAgICAgKiBAcGFyYW0gcm93c1BlclBhZ2VcbiAgICAgICAgICogQHBhcmFtIHBhZ2luYXRpb25SYW5nZVxuICAgICAgICAgKiBAcGFyYW0gY29sbGVjdGlvbkxlbmd0aFxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVBhZ2VzQXJyYXkoY3VycmVudFBhZ2UsIGNvbGxlY3Rpb25MZW5ndGgsIHJvd3NQZXJQYWdlLCBwYWdpbmF0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwoY29sbGVjdGlvbkxlbmd0aCAvIHJvd3NQZXJQYWdlKTtcbiAgICAgICAgICAgIHZhciBoYWxmV2F5ID0gTWF0aC5jZWlsKHBhZ2luYXRpb25SYW5nZSAvIDIpO1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudFBhZ2UgPD0gaGFsZldheSkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG90YWxQYWdlcyAtIGhhbGZXYXkgPCBjdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gJ2VuZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gJ21pZGRsZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbGxpcHNlc05lZWRlZCA9IHBhZ2luYXRpb25SYW5nZSA8IHRvdGFsUGFnZXM7XG4gICAgICAgICAgICB2YXIgaSA9IDE7XG4gICAgICAgICAgICB3aGlsZSAoaSA8PSB0b3RhbFBhZ2VzICYmIGkgPD0gcGFnaW5hdGlvblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VOdW1iZXIgPSBjYWxjdWxhdGVQYWdlTnVtYmVyKGksIGN1cnJlbnRQYWdlLCBwYWdpbmF0aW9uUmFuZ2UsIHRvdGFsUGFnZXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG9wZW5pbmdFbGxpcHNlc05lZWRlZCA9IChpID09PSAyICYmIChwb3NpdGlvbiA9PT0gJ21pZGRsZScgfHwgcG9zaXRpb24gPT09ICdlbmQnKSk7XG4gICAgICAgICAgICAgICAgdmFyIGNsb3NpbmdFbGxpcHNlc05lZWRlZCA9IChpID09PSBwYWdpbmF0aW9uUmFuZ2UgLSAxICYmIChwb3NpdGlvbiA9PT0gJ21pZGRsZScgfHwgcG9zaXRpb24gPT09ICdzdGFydCcpKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxsaXBzZXNOZWVkZWQgJiYgKG9wZW5pbmdFbGxpcHNlc05lZWRlZCB8fCBjbG9zaW5nRWxsaXBzZXNOZWVkZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goJy4uLicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2gocGFnZU51bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkgKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2l2ZW4gdGhlIHBvc2l0aW9uIGluIHRoZSBzZXF1ZW5jZSBvZiBwYWdpbmF0aW9uIGxpbmtzIFtpXSwgZmlndXJlIG91dCB3aGF0IHBhZ2UgbnVtYmVyIGNvcnJlc3BvbmRzIHRvIHRoYXQgcG9zaXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBpXG4gICAgICAgICAqIEBwYXJhbSBjdXJyZW50UGFnZVxuICAgICAgICAgKiBAcGFyYW0gcGFnaW5hdGlvblJhbmdlXG4gICAgICAgICAqIEBwYXJhbSB0b3RhbFBhZ2VzXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlUGFnZU51bWJlcihpLCBjdXJyZW50UGFnZSwgcGFnaW5hdGlvblJhbmdlLCB0b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB2YXIgaGFsZldheSA9IE1hdGguY2VpbChwYWdpbmF0aW9uUmFuZ2UvMik7XG4gICAgICAgICAgICBpZiAoaSA9PT0gcGFnaW5hdGlvblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvdGFsUGFnZXM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFnaW5hdGlvblJhbmdlIDwgdG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgIGlmICh0b3RhbFBhZ2VzIC0gaGFsZldheSA8IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbFBhZ2VzIC0gcGFnaW5hdGlvblJhbmdlICsgaTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhbGZXYXkgPCBjdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFBhZ2UgLSBoYWxmV2F5ICsgaTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICAndmlld3MvZGlyUGFnaW5hdGlvbi50cGwuaHRtbCcsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG1heFNpemU6ICc9PycsXG4gICAgICAgICAgICAgICAgb25QYWdlQ2hhbmdlOiAnJj8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2luYXRpb25JZDtcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSWQgPSBhdHRycy5wYWdpbmF0aW9uSWQgfHwgXCJfX2RlZmF1bHRcIjtcbiAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLm1heFNpemUpIHsgc2NvcGUubWF4U2l6ZSA9IDk7IH1cbiAgICAgICAgICAgICAgICBzY29wZS5kaXJlY3Rpb25MaW5rcyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmRpcmVjdGlvbkxpbmtzKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuZGlyZWN0aW9uTGlua3MpIDogdHJ1ZTtcbiAgICAgICAgICAgICAgICBzY29wZS5ib3VuZGFyeUxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuYm91bmRhcnlMaW5rcykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmJvdW5kYXJ5TGlua3MpIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBhZ2luYXRpb25TZXJ2aWNlLmlzUmVnaXN0ZXJlZChwYWdpbmF0aW9uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZE1lc3NhZ2UgPSAocGFnaW5hdGlvbklkICE9PSAnX19kZWZhdWx0JykgPyBcIiAoaWQ6IFwiICsgcGFnaW5hdGlvbklkICsgXCIpIFwiIDogXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwicGFnaW5hdGlvbiBkaXJlY3RpdmU6IHRoZSBwYWdpbmF0aW9uIGNvbnRyb2xzXCIgKyBpZE1lc3NhZ2UgKyBcImNhbm5vdCBiZSB1c2VkIHdpdGhvdXQgdGhlIGNvcnJlc3BvbmRpbmcgcGFnaW5hdGlvbiBkaXJlY3RpdmUuXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2luYXRpb25SYW5nZSA9IE1hdGgubWF4KHNjb3BlLm1heFNpemUsIDUpO1xuICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gW107XG4gICAgICAgICAgICAgICAgc2NvcGUucGFnaW5hdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdDogMSxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudDogMVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAocGFnaW5hdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQpICsgMSkgKiBwYWdpbmF0aW9uU2VydmljZS5nZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDAgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWdpbmF0aW9uU2VydmljZS5nZXRDdXJyZW50UGFnZShwYWdpbmF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gZ2VuZXJhdGVQYWdlc0FycmF5KGN1cnJlbnRQYWdlLCBwYWdpbmF0aW9uU2VydmljZS5nZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25TZXJ2aWNlLmdldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uUmFuZ2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuc2V0Q3VycmVudCA9IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoL15cXGQrJC8udGVzdChudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IG51bSAmJiBudW0gPD0gc2NvcGUucGFnaW5hdGlvbi5sYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0Q3VycmVudFBhZ2UocGFnaW5hdGlvbklkLCBudW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gZ2VuZXJhdGVQYWdlc0FycmF5KG51bSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uU2VydmljZS5nZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblJhbmdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uLmN1cnJlbnQgPSBudW07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhIGNhbGxiYWNrIGhhcyBiZWVuIHNldCwgdGhlbiBjYWxsIGl0IHdpdGggdGhlIHBhZ2UgbnVtYmVyIGFzIGFuIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLm9uUGFnZUNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5vblBhZ2VDaGFuZ2UoeyBuZXdQYWdlTnVtYmVyIDogbnVtIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVBhZ2luYXRpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gZ2VuZXJhdGVQYWdlc0FycmF5KDEsIHBhZ2luYXRpb25TZXJ2aWNlLmdldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25SYW5nZSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2luYXRpb24uY3VycmVudCA9IHBhcnNlSW50KHBhZ2luYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRQYWdlKHBhZ2luYXRpb25JZCkpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uLmxhc3QgPSBzY29wZS5wYWdlc1tzY29wZS5wYWdlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLnBhZ2luYXRpb24ubGFzdCA8IHNjb3BlLnBhZ2luYXRpb24uY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2V0Q3VycmVudChzY29wZS5wYWdpbmF0aW9uLmxhc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKVxuXG4gICAgLmZpbHRlcignaXRlbXNQZXJQYWdlJywgWydwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKHBhZ2luYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVtc1BlclBhZ2UsIHBhZ2luYXRpb25JZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAocGFnaW5hdGlvbklkKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSWQgPSBcIl9fZGVmYXVsdFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwYWdpbmF0aW9uU2VydmljZS5pc1JlZ2lzdGVyZWQocGFnaW5hdGlvbklkKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwicGFnaW5hdGlvbiBkaXJlY3RpdmU6IHRoZSBpdGVtc1BlclBhZ2UgaWQgYXJndW1lbnQgKGlkOiBcIiArIHBhZ2luYXRpb25JZCArIFwiKSBkb2VzIG5vdCBtYXRjaCBhIHJlZ2lzdGVyZWQgcGFnaW5hdGlvbi1pZC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlbmQ7XG4gICAgICAgICAgICB2YXIgc3RhcnQ7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJQYWdlIHx8IDk5OTk5OTk5OTk7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25TZXJ2aWNlLmlzQXN5bmNNb2RlKHBhZ2luYXRpb25JZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gKHBhZ2luYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRQYWdlKHBhZ2luYXRpb25JZCkgLSAxKSAqIGl0ZW1zUGVyUGFnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW5kID0gc3RhcnQgKyBpdGVtc1BlclBhZ2U7XG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCwgaXRlbXNQZXJQYWdlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSlcblxuICAgIC5zZXJ2aWNlKCdwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5zdGFuY2VzID0ge307XG4gICAgICAgIHZhciBsYXN0UmVnaXN0ZXJlZEluc3RhbmNlO1xuICAgICAgICB0aGlzLnBhZ2luYXRpb25EaXJlY3RpdmVJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2VzW2luc3RhbmNlSWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmNNb2RlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGFzdFJlZ2lzdGVyZWRJbnN0YW5jZSA9IGluc3RhbmNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc1JlZ2lzdGVyZWQgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIGluc3RhbmNlc1tpbnN0YW5jZUlkXSAhPT0gJ3VuZGVmaW5lZCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TGFzdEluc3RhbmNlSWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBsYXN0UmVnaXN0ZXJlZEluc3RhbmNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudFBhZ2VQYXJzZXIgPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwsIHNjb3BlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY3VycmVudFBhZ2VQYXJzZXIgPSB2YWw7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29udGV4dCA9IHNjb3BlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldEN1cnJlbnRQYWdlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCwgdmFsKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY3VycmVudFBhZ2VQYXJzZXIuYXNzaWduKGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb250ZXh0LCB2YWwpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldEN1cnJlbnRQYWdlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jdXJyZW50UGFnZVBhcnNlcihpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29udGV4dCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRJdGVtc1BlclBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5pdGVtc1BlclBhZ2UgPSB2YWw7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0SXRlbXNQZXJQYWdlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5pdGVtc1BlclBhZ2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRDb2xsZWN0aW9uTGVuZ3RoID0gZnVuY3Rpb24oaW5zdGFuY2VJZCwgdmFsKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29sbGVjdGlvbkxlbmd0aCA9IHZhbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRDb2xsZWN0aW9uTGVuZ3RoID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb2xsZWN0aW9uTGVuZ3RoO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0QXN5bmNNb2RlVHJ1ZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5hc3luY01vZGUgPSB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXNBc3luY01vZGUgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLmFzeW5jTW9kZTtcbiAgICAgICAgfTtcbiAgICB9KVxuO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9