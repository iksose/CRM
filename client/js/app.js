var app = angular.module('uiRouterSample', [
  'ui.router',
  'ngAnimate',
  // 'ngMockE2E',
  'ngResource',
  'ngCookies',
  'mgcrea.ngStrap',
  'ngSanitize',
  'chieffancypants.loadingBar',
  'angular-table',
  'ngTagsInput'
])


.run(
  [          '$rootScope', '$state', '$stateParams', '$cookies', "$http",
    function ($rootScope,   $state,   $stateParams, $cookies, $http) {

    $http.defaults.headers.common['XKey'] = $cookies.xkey;
    $http.defaults.headers.put = {'Content-Type': 'application/x-www-form-urlencoded'};
    $http.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded'};
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.loggedIn = true;
    $rootScope.credentials = {
      group: "Undefined",
      username: $cookies.userid
    };

    // perform an API call to see if xkey is still valid or needs to be re-authed;
    var testKey = $http({
        method: 'GET',
        url: 'http://10.1.1.118:8000/api/Research?State=MO&Product=123&Order=ProspectID',
        // url: 'http://10.1.1.118:8000/api/Campaign',
        headers : { 'Accept': 'application/json', 'XKey': $cookies.xkey}
      })
    testKey.success(function(data){
      // key is valid, continue
      // set key for all requests
      // $http.defaults.headers.common['XKey'] = $cookies.xkey;
      // console.log("SET KEY FOR EVERY REQUEST")
      // doesn't work...other requests are async
      /*$state.go('home')*/
    })
    testKey.catch(function(data){
      // key is invalid, route to Login
      // $rootScope.loggedIn = false;
      // $state.go('login')
      // console.log("Fuck")
    })


    }
  ]
)


.config(
  [          '$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider,   $urlRouterProvider, $httpProvider) {

      /////////////////////////////
      //    Auth Interceptor     //
      /////////////////////////////

    var interceptor = ['$location', '$q', '$injector', function($location, $q, $injector) {
      function success(response) {
          return response;
      }
      function error(response) {
          if(response.status === 401) {
            console.log("Interceptor 401")
            $injector.get('$state').transitionTo('login');
            return $q.reject(response);
          }
          else {
            // individual error handling
            console.log("Interceptor error...we should write these to a DB", response.statusText)
            // TODO server should respond with detail error texts;
            return $q.reject(response);
          }
      }
      return function(promise) {
          return promise.then(success, error);
      }
    }];

    $httpProvider.responseInterceptors.push(interceptor);


      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        .when('/c?id', '/contacts/:id')
        .when('/user/:id', '/contacts/:id')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/');


      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider

        .state('login', {
          url: '/login',
          controller: 'loginController',
          templateUrl: 'views/Login.html'
        })

        //////////
        // Home //
        //////////

        .state("home", {

          // Use a url of "/" to set a states as the "index".
          url: "/",

          // controller: 'landingController',
          // templateUrl: 'views/notsure.html'
          views: {

              // So this one is targeting the unnamed view within the parent state's template.
              '': {
                templateUrl: 'views/notsure.html',
                controller: 'landingController'
              },

              // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
              // This shows off how you could populate *any* view within *any* ancestor state.
              'content@home': {
                templateUrl: 'views/landing.html'
              }
            }

        })

        ///////////
        // About //
        ///////////

        .state('home.about', {
          url: 'about',
          views: {
            'content': {
              template: '<br><br>This is about'
            }
          }

          // Showing off how you could return a promise from templateProvider
          // templateProvider: ['$timeout',
          //   function (        $timeout) {
          //     return $timeout(function () {
          //       return '<p class="lead">UI-Router Resources</p><ul>' +
          //                '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' +
          //                '<li><a href="https://github.com/angular-ui/ui-router">Github Main Page</a></li>' +
          //                '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +
          //                '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +
          //                '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +
          //              '</ul>';
          //     }, 100);
          //   }]
        })

        .state('home.query', {
          url: 'query/new/?State&Age&Product&Distance',
          reloadOnSearch: false,
          views: {
            'content': {
              templateUrl: 'views/newQuery.html',
              controller: "queryController",
            }
          }
        })

        // .state('home.query.results', {
        //   url: '/results/?myParam1&myParam2'
        // })

        .state('home.campaign', {
          url: 'Campaigns',
          views: {
            'content': {
              templateUrl: 'views/campaigns.html',
              controller: "campaignController"
            }
          }
        })

        .state('home.campaign.new', {
          url: '/new',
          views: {
            'content@home': {
              templateUrl: 'views/newcampaign.html',
              controller: "newCampaignController"
            }
          }
        })

        .state('home.campaign.details', {
          url: '/details/:campaignID',
          views: {
            'content@home': {
              templateUrl: 'views/campaign-details.html',
              controller: "campaignControllerDetails"
            }
          }
        })

        .state('home.tasks', {
          url: 'Tasks/:taskID',
          views: {
            'content': {
              templateUrl: 'views/tasks.html',
              controller: "taskController"
            }
          }
        })

        .state('home.admin', {
          url: 'admin/',
          views: {
            'content': {
              templateUrl: 'views/admin.html',
              controller: "adminController"
            }
          }
        })

        .state('home.timeline', {
          url: 'timeline/',
          views: {
            'content': {
              templateUrl: 'views/timeline.html',
              controller: "timelineController"
            }
          }
        })

        .state('home.roles', {
          url: 'roles/',
          views: {
            'content': {
              templateUrl: 'views/roles.html',
              controller: "rolesController"
            }
          }
        })


    }
  ]
);
