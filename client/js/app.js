var app = angular.module('uiRouterSample', [
  'ui.router',
  'ngAnimate',
  // 'ngMockE2E',
  'ngResource',
  'ngCookies',
  'mgcrea.ngStrap',
  'ngSanitize',
  'chieffancypants.loadingBar',
  'angular-table'
])


.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ui-sref-active="active }"> will set the <li> // to active whenever
    // 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.credentials = {
      group: "Undefined"
    };
    }
  ]
)

.config(
  [          '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

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
          url: 'query/new/?myParam1&myParam2',
          views: {
            'content': {
              templateUrl: 'views/newQuery.html',
              controller: "queryController"
            },
            resolve: {
              reloadOnSearch: false
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
          url: '/details/:params',
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


    }
  ]
);
