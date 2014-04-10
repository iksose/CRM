var app = angular.module('uiRouterSample', [
  'ui.router',
  'ngAnimate',
  // 'ngMockE2E',
  'ngResource',
  'ngCookies',
  'mgcrea.ngStrap'
])

// .run(function($httpBackend) {
//     var phones = [{name: 'phone1'}, {name: 'phone2'}];
//
//     // var username = {username: "pbajoj", role: "admin"}
//
//     var username =
//
//     // $httpBackend.whenGET('api/login').respond(username)
//     $httpBackend.whenGET('api/login').respond(function(){
//       var succeedOrFail = Math.floor(Math.random() * (10 -1) + 1)
//       if(succeedOrFail > 3)
//       return [200, username]
//       else
//       return [500, {hello:"world"}]
//     })
//
//     // returns the current list of phones
//     $httpBackend.whenGET('/phones').respond(phones);
//
//     // adds a new phone to the phones array
//     $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
//       phones.push(angular.fromJson(data));
//     });
//     $httpBackend.whenGET(/^\/templates\//).passThrough();
//     $httpBackend.whenGET(/^\/views\//).passThrough();
//     //...
//
//     $httpBackend.whenGET('api/users/2/privileges').respond({
//       "Roles": [
//       {
//         "Active": true,
//         "Name": "Role 1",
//         "RoleId": 1
//       },
//       {
//         "Active": true,
//         "Name": "Role 2",
//         "RoleId": 2
//       },
//       {
//         "Active": false,
//         "Name": "Role 3",
//         "RoleId": 3
//       }
//       ],
//       "SubRoles": [
//       {
//         "Active": true,
//         "Name": "SubRole 1",
//         "RoleId": 1,
//         "SubRoleId": 1
//       },
//       {
//         "Active": true,
//         "Name": "SubRole 2",
//         "RoleId": 1,
//         "SubRoleId": 2
//       },
//       {
//         "Active": false,
//         "Name": "SubRole 3",
//         "RoleId": 1,
//         "SubRoleId": 3
//       }
//       ]
//       });
//
//   })

.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ui-sref-active="active }"> will set the <li> // to active whenever
    // 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
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
          url: 'query/new',
          views: {
            'content': {
              templateUrl: 'views/newQuery.html',
              controller: "queryController"
            }
          }
        })

        .state('home.campaign', {
          url: 'Campaigns',
          views: {
            'content': {
              templateUrl: 'views/campaigns.html',
              controller: "campaignController"
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


    }
  ]
);
