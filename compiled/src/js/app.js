define([], function() {
  "use strict";
  var app = angular.module('uiRouterSample', ['ui.router', 'ngAnimate', 'ngResource', 'ngCookies', 'mgcrea.ngStrap', 'ngSanitize', 'chieffancypants.loadingBar', 'angular-table', 'ngTagsInput', 'xeditable', 'ui.calendar']).run(['$rootScope', '$state', '$stateParams', '$cookies', "$http", function($rootScope, $state, $stateParams, $cookies, $http) {
    $traceurRuntime.setProperty($http.defaults.headers.common, 'XKey', $cookies.xkey);
    $http.defaults.headers.put = {'Content-Type': 'application/x-www-form-urlencoded'};
    $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.loggedIn = true;
    $rootScope.credentials = {
      group: "Undefined",
      username: $cookies.userid
    };
    var testKey = $http({
      method: 'GET',
      url: 'http://10.1.1.118:8000/api/Research?State=MO&ProductID=1',
      headers: {
        'Accept': 'application/json',
        'XKey': $cookies.xkey
      }
    });
    testKey.success(function(data) {});
    testKey.catch(function(data) {});
  }]).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    var interceptor = ['$location', '$q', '$injector', function($location, $q, $injector) {
      function success(response) {
        return response;
      }
      function error(response) {
        if (response.status === 401) {
          console.log("Interceptor 401");
          $injector.get('$state').transitionTo('login');
          return $q.reject(response);
        } else {
          console.log("Interceptor error...we should write these to a DB", response.statusText);
          return $q.reject(response);
        }
      }
      return function(promise) {
        return promise.then(success, error);
      };
    }];
    $httpProvider.responseInterceptors.push(interceptor);
    $urlRouterProvider.when('/c?id', '/contacts/:id').when('/user/:id', '/contacts/:id').otherwise('/');
    $stateProvider.state('login', {
      url: '/login',
      controller: 'loginController',
      templateUrl: 'views/Login.html'
    }).state("home", {
      url: "/",
      views: {
        '': {
          templateUrl: 'views/notsure.html',
          controller: 'landingController'
        },
        'content@home': {templateUrl: 'views/landing.html'}
      }
    }).state('home.about', {
      url: 'about',
      views: {'content': {template: '<br><br>This is about'}}
    }).state('home.query', {
      url: 'query/new/?State&Age&Product&Distance',
      reloadOnSearch: false,
      views: {'content': {
          templateUrl: 'views/newQuery.html',
          controller: "queryController"
        }}
    }).state('home.campaign', {
      url: 'Campaigns',
      views: {'content': {
          templateUrl: 'views/campaigns.html',
          controller: "campaignController"
        }}
    }).state('home.campaign.new', {
      url: '/new/:campaignID',
      views: {'content@home': {
          templateUrl: 'views/newcampaign.html',
          controller: "newCampaignController"
        }}
    }).state('home.campaign.details', {
      url: '/details/:campaignID',
      resolve: {
        campaignFactory: 'campaignFactory',
        campaign: function(campaignFactory, $stateParams) {
          return campaignFactory.singleCampaign($stateParams.campaignID);
        }
      },
      views: {'content@home': {
          templateUrl: 'views/campaign-details.html',
          controller: "campaignControllerDetails"
        }}
    }).state('home.tasks', {
      url: 'Tasks/:taskID',
      views: {'content': {
          templateUrl: 'views/tasks.html',
          controller: "taskController"
        }}
    }).state('home.admin', {
      url: 'admin/',
      views: {'content': {
          templateUrl: 'views/admin.html',
          controller: "adminController"
        }}
    }).state('home.timeline', {
      url: 'timeline/',
      views: {'content': {
          templateUrl: 'views/timeline.html',
          controller: "timelineController"
        }}
    }).state('home.roles', {
      url: 'roles/',
      views: {'content': {
          templateUrl: 'views/roles.html',
          controller: "rolesController"
        }}
    }).state('home.prospect', {
      url: 'Prospect/:ProspectID',
      views: {'content': {
          templateUrl: 'views/Prospect.html',
          controller: "prospectController"
        }}
    }).state('home.kim', {
      url: 'Kim/:ProspectID',
      views: {'content': {
          templateUrl: 'views/Kim.html',
          controller: "kimController"
        }},
      reloadOnSearch: false
    }).state('home.search', {
      url: 'search?ProspectID&CustID&NCPDP&NPI&Zip&City&State',
      views: {'content': {
          templateUrl: 'views/search.html',
          controller: "searchController"
        }}
    });
  }]);
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYXBwLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnLCBbXG4gICd1aS5yb3V0ZXInLFxuICAnbmdBbmltYXRlJyxcbiAgLy8gJ25nTW9ja0UyRScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ25nQ29va2llcycsXG4gICdtZ2NyZWEubmdTdHJhcCcsXG4gICduZ1Nhbml0aXplJyxcbiAgJ2NoaWVmZmFuY3lwYW50cy5sb2FkaW5nQmFyJyxcbiAgJ2FuZ3VsYXItdGFibGUnLFxuICAnbmdUYWdzSW5wdXQnLFxuICAneGVkaXRhYmxlJyxcbiAgJ3VpLmNhbGVuZGFyJ1xuXSlcblxuXG4ucnVuKFxuICBbICAgICAgICAgICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnJGNvb2tpZXMnLCBcIiRodHRwXCIsXG4gICAgZnVuY3Rpb24gKCRyb290U2NvcGUsICAgJHN0YXRlLCAgICRzdGF0ZVBhcmFtcywgJGNvb2tpZXMsICRodHRwKSB7XG5cbiAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWEtleSddID0gJGNvb2tpZXMueGtleTtcbiAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnB1dCA9IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCd9O1xuICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucG9zdCA9IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCd9O1xuICAgICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAgICRyb290U2NvcGUuJHN0YXRlUGFyYW1zID0gJHN0YXRlUGFyYW1zO1xuICAgICRyb290U2NvcGUubG9nZ2VkSW4gPSB0cnVlO1xuICAgICRyb290U2NvcGUuY3JlZGVudGlhbHMgPSB7XG4gICAgICBncm91cDogXCJVbmRlZmluZWRcIixcbiAgICAgIHVzZXJuYW1lOiAkY29va2llcy51c2VyaWRcbiAgICB9O1xuXG4gICAgLy8gcGVyZm9ybSBhbiBBUEkgY2FsbCB0byBzZWUgaWYgeGtleSBpcyBzdGlsbCB2YWxpZCBvciBuZWVkcyB0byBiZSByZS1hdXRoZWQ7XG4gICAgdmFyIHRlc3RLZXkgPSAkaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoP1N0YXRlPU1PJlByb2R1Y3RJRD0xJyxcbiAgICAgICAgLy8gdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24nLFxuICAgICAgICBoZWFkZXJzIDogeyAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWEtleSc6ICRjb29raWVzLnhrZXl9XG4gICAgICB9KVxuICAgIHRlc3RLZXkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgIC8vIGtleSBpcyB2YWxpZCwgY29udGludWVcbiAgICAgIC8vIHNldCBrZXkgZm9yIGFsbCByZXF1ZXN0c1xuICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXSA9ICRjb29raWVzLnhrZXk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIlNFVCBLRVkgRk9SIEVWRVJZIFJFUVVFU1RcIilcbiAgICAgIC8vIGRvZXNuJ3Qgd29yay4uLm90aGVyIHJlcXVlc3RzIGFyZSBhc3luY1xuICAgICAgLyokc3RhdGUuZ28oJ2hvbWUnKSovXG4gICAgfSlcbiAgICB0ZXN0S2V5LmNhdGNoKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgLy8ga2V5IGlzIGludmFsaWQsIHJvdXRlIHRvIExvZ2luXG4gICAgICAvLyAkcm9vdFNjb3BlLmxvZ2dlZEluID0gZmFsc2U7XG4gICAgICAvLyAkc3RhdGUuZ28oJ2xvZ2luJylcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiRnVja1wiKVxuICAgIH0pXG5cblxuICAgIH1cbiAgXVxuKVxuXG5cbi5jb25maWcoXG4gIFsgICAgICAgICAgJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckaHR0cFByb3ZpZGVyJyxcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICAgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAvLyAgICBBdXRoIEludGVyY2VwdG9yICAgICAvL1xuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHZhciBpbnRlcmNlcHRvciA9IFsnJGxvY2F0aW9uJywgJyRxJywgJyRpbmplY3RvcicsIGZ1bmN0aW9uKCRsb2NhdGlvbiwgJHEsICRpbmplY3Rvcikge1xuICAgICAgZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW50ZXJjZXB0b3IgNDAxXCIpXG4gICAgICAgICAgICAkaW5qZWN0b3IuZ2V0KCckc3RhdGUnKS50cmFuc2l0aW9uVG8oJ2xvZ2luJyk7XG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpbmRpdmlkdWFsIGVycm9yIGhhbmRsaW5nXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkludGVyY2VwdG9yIGVycm9yLi4ud2Ugc2hvdWxkIHdyaXRlIHRoZXNlIHRvIGEgREJcIiwgcmVzcG9uc2Uuc3RhdHVzVGV4dClcbiAgICAgICAgICAgIC8vIFRPRE8gc2VydmVyIHNob3VsZCByZXNwb25kIHdpdGggZGV0YWlsIGVycm9yIHRleHRzO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb21pc2UpIHtcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKHN1Y2Nlc3MsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XTtcblxuICAgICRodHRwUHJvdmlkZXIucmVzcG9uc2VJbnRlcmNlcHRvcnMucHVzaChpbnRlcmNlcHRvcik7XG5cblxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgIC8vIFJlZGlyZWN0cyBhbmQgT3RoZXJ3aXNlIC8vXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAvLyBVc2UgJHVybFJvdXRlclByb3ZpZGVyIHRvIGNvbmZpZ3VyZSBhbnkgcmVkaXJlY3RzICh3aGVuKSBhbmQgaW52YWxpZCB1cmxzIChvdGhlcndpc2UpLlxuICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG5cbiAgICAgICAgLy8gVGhlIGB3aGVuYCBtZXRob2Qgc2F5cyBpZiB0aGUgdXJsIGlzIGV2ZXIgdGhlIDFzdCBwYXJhbSwgdGhlbiByZWRpcmVjdCB0byB0aGUgMm5kIHBhcmFtXG4gICAgICAgIC8vIEhlcmUgd2UgYXJlIGp1c3Qgc2V0dGluZyB1cCBzb21lIGNvbnZlbmllbmNlIHVybHMuXG4gICAgICAgIC53aGVuKCcvYz9pZCcsICcvY29udGFjdHMvOmlkJylcbiAgICAgICAgLndoZW4oJy91c2VyLzppZCcsICcvY29udGFjdHMvOmlkJylcblxuICAgICAgICAvLyBJZiB0aGUgdXJsIGlzIGV2ZXIgaW52YWxpZCwgZS5nLiAnL2FzZGYnLCB0aGVuIHJlZGlyZWN0IHRvICcvJyBha2EgdGhlIGhvbWUgc3RhdGVcbiAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuXG5cbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAvLyBTdGF0ZSBDb25maWd1cmF0aW9ucyAvL1xuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgLy8gVXNlICRzdGF0ZVByb3ZpZGVyIHRvIGNvbmZpZ3VyZSB5b3VyIHN0YXRlcy5cbiAgICAgICRzdGF0ZVByb3ZpZGVyXG5cbiAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvTG9naW4uaHRtbCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLy8vLy8vLy8vXG4gICAgICAgIC8vIEhvbWUgLy9cbiAgICAgICAgLy8vLy8vLy8vL1xuXG4gICAgICAgIC5zdGF0ZShcImhvbWVcIiwge1xuXG4gICAgICAgICAgLy8gVXNlIGEgdXJsIG9mIFwiL1wiIHRvIHNldCBhIHN0YXRlcyBhcyB0aGUgXCJpbmRleFwiLlxuICAgICAgICAgIHVybDogXCIvXCIsXG5cbiAgICAgICAgICAvLyBjb250cm9sbGVyOiAnbGFuZGluZ0NvbnRyb2xsZXInLFxuICAgICAgICAgIC8vIHRlbXBsYXRlVXJsOiAndmlld3Mvbm90c3VyZS5odG1sJ1xuICAgICAgICAgIHZpZXdzOiB7XG5cbiAgICAgICAgICAgICAgLy8gU28gdGhpcyBvbmUgaXMgdGFyZ2V0aW5nIHRoZSB1bm5hbWVkIHZpZXcgd2l0aGluIHRoZSBwYXJlbnQgc3RhdGUncyB0ZW1wbGF0ZS5cbiAgICAgICAgICAgICAgJyc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL25vdHN1cmUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xhbmRpbmdDb250cm9sbGVyJ1xuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgIC8vIFRoaXMgb25lIGlzIHRhcmdldGluZyB0aGUgdWktdmlldz1cImhpbnRcIiB3aXRoaW4gdGhlIHVubmFtZWQgcm9vdCwgYWthIGluZGV4Lmh0bWwuXG4gICAgICAgICAgICAgIC8vIFRoaXMgc2hvd3Mgb2ZmIGhvdyB5b3UgY291bGQgcG9wdWxhdGUgKmFueSogdmlldyB3aXRoaW4gKmFueSogYW5jZXN0b3Igc3RhdGUuXG4gICAgICAgICAgICAgICdjb250ZW50QGhvbWUnOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9sYW5kaW5nLmh0bWwnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIC8vLy8vLy8vLy8vXG4gICAgICAgIC8vIEFib3V0IC8vXG4gICAgICAgIC8vLy8vLy8vLy8vXG5cbiAgICAgICAgLnN0YXRlKCdob21lLmFib3V0Jywge1xuICAgICAgICAgIHVybDogJ2Fib3V0JyxcbiAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGJyPjxicj5UaGlzIGlzIGFib3V0J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFNob3dpbmcgb2ZmIGhvdyB5b3UgY291bGQgcmV0dXJuIGEgcHJvbWlzZSBmcm9tIHRlbXBsYXRlUHJvdmlkZXJcbiAgICAgICAgICAvLyB0ZW1wbGF0ZVByb3ZpZGVyOiBbJyR0aW1lb3V0JyxcbiAgICAgICAgICAvLyAgIGZ1bmN0aW9uICggICAgICAgICR0aW1lb3V0KSB7XG4gICAgICAgICAgLy8gICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gICAgICAgcmV0dXJuICc8cCBjbGFzcz1cImxlYWRcIj5VSS1Sb3V0ZXIgUmVzb3VyY2VzPC9wPjx1bD4nICtcbiAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXIvdHJlZS9tYXN0ZXIvc2FtcGxlXCI+U291cmNlIGZvciB0aGlzIFNhbXBsZTwvYT48L2xpPicgK1xuICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclwiPkdpdGh1YiBNYWluIFBhZ2U8L2E+PC9saT4nICtcbiAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXIjcXVpY2stc3RhcnRcIj5RdWljayBTdGFydDwvYT48L2xpPicgK1xuICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlci93aWtpXCI+SW4tRGVwdGggR3VpZGU8L2E+PC9saT4nICtcbiAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXIvd2lraS9RdWljay1SZWZlcmVuY2VcIj5BUEkgUmVmZXJlbmNlPC9hPjwvbGk+JyArXG4gICAgICAgICAgLy8gICAgICAgICAgICAgICc8L3VsPic7XG4gICAgICAgICAgLy8gICAgIH0sIDEwMCk7XG4gICAgICAgICAgLy8gICB9XVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnaG9tZS5xdWVyeScsIHtcbiAgICAgICAgICB1cmw6ICdxdWVyeS9uZXcvP1N0YXRlJkFnZSZQcm9kdWN0JkRpc3RhbmNlJyxcbiAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2UsXG4gICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL25ld1F1ZXJ5Lmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInF1ZXJ5Q29udHJvbGxlclwiLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAvLyAuc3RhdGUoJ2hvbWUucXVlcnkucmVzdWx0cycsIHtcbiAgICAgICAgLy8gICB1cmw6ICcvcmVzdWx0cy8/bXlQYXJhbTEmbXlQYXJhbTInXG4gICAgICAgIC8vIH0pXG5cbiAgICAgICAgLnN0YXRlKCdob21lLmNhbXBhaWduJywge1xuICAgICAgICAgIHVybDogJ0NhbXBhaWducycsXG4gICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NhbXBhaWducy5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJjYW1wYWlnbkNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2hvbWUuY2FtcGFpZ24ubmV3Jywge1xuICAgICAgICAgIHVybDogJy9uZXcvOmNhbXBhaWduSUQnLFxuICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnY29udGVudEBob21lJzoge1xuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL25ld2NhbXBhaWduLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIm5ld0NhbXBhaWduQ29udHJvbGxlclwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnaG9tZS5jYW1wYWlnbi5kZXRhaWxzJywge1xuICAgICAgICAgICAgdXJsOiAnL2RldGFpbHMvOmNhbXBhaWduSUQnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGNhbXBhaWduRmFjdG9yeTogJ2NhbXBhaWduRmFjdG9yeScsXG4gICAgICAgICAgICAgICAgY2FtcGFpZ246IGZ1bmN0aW9uKGNhbXBhaWduRmFjdG9yeSwgJHN0YXRlUGFyYW1zKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbXBhaWduRmFjdG9yeS5zaW5nbGVDYW1wYWlnbigkc3RhdGVQYXJhbXMuY2FtcGFpZ25JRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnRAaG9tZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jYW1wYWlnbi1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImNhbXBhaWduQ29udHJvbGxlckRldGFpbHNcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2hvbWUudGFza3MnLCB7XG4gICAgICAgICAgdXJsOiAnVGFza3MvOnRhc2tJRCcsXG4gICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Rhc2tzLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInRhc2tDb250cm9sbGVyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdob21lLmFkbWluJywge1xuICAgICAgICAgIHVybDogJ2FkbWluLycsXG4gICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FkbWluLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImFkbWluQ29udHJvbGxlclwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnaG9tZS50aW1lbGluZScsIHtcbiAgICAgICAgICB1cmw6ICd0aW1lbGluZS8nLFxuICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90aW1lbGluZS5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJ0aW1lbGluZUNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2hvbWUucm9sZXMnLCB7XG4gICAgICAgICAgdXJsOiAncm9sZXMvJyxcbiAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvcm9sZXMuaHRtbCcsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicm9sZXNDb250cm9sbGVyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdob21lLnByb3NwZWN0Jywge1xuICAgICAgICAgIHVybDogJ1Byb3NwZWN0LzpQcm9zcGVjdElEJyxcbiAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvUHJvc3BlY3QuaHRtbCcsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicHJvc3BlY3RDb250cm9sbGVyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdob21lLmtpbScsIHtcbiAgICAgICAgICB1cmw6ICdLaW0vOlByb3NwZWN0SUQnLFxuICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9LaW0uaHRtbCcsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwia2ltQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnaG9tZS5zZWFyY2gnLCB7XG4gICAgICAgICAgdXJsOiAnc2VhcmNoP1Byb3NwZWN0SUQmQ3VzdElEJk5DUERQJk5QSSZaaXAmQ2l0eSZTdGF0ZScsXG4gICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaC5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gLnN0YXRlKCdob21lLnNlYXJjaC5yZXN1bHRzJywge1xuICAgICAgICAvLyAgIHVybDogJy9wcmlvcml0eScsXG4gICAgICAgIC8vICAgdmlld3M6IHtcbiAgICAgICAgLy8gICAgICdjb250ZW50Jzoge1xuICAgICAgICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaC5odG1sJyxcbiAgICAgICAgLy8gICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgLy8gICB9LFxuICAgICAgICAvLyAgICdzZWFyY2hWaWV3Jzoge1xuICAgICAgICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaC5odG1sJyxcbiAgICAgICAgLy8gICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9KVxuXG5cbiAgICB9XG4gIF1cbik7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=