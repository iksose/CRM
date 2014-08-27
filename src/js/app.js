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
    'ngTagsInput',
    'xeditable',
    'ui.calendar',
    'angularFileUpload',
    'SignalR'
])

.run(
    ['$rootScope', '$state', '$stateParams', '$cookies', "$http", 'LoginService',
        function($rootScope, $state, $stateParams, $cookies, $http, LoginService) {


            $http.defaults.headers.common['XKey'] = $cookies.xkey;
            $http.defaults.headers.put = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            $http.defaults.headers.post = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            // $http.defaults.timeout = 10;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.loggedIn = true;
            $rootScope.credentials = {
                group: "Undefined",
                username: $cookies.userid
            };
            // if ($cookies.pbauser) {
            //     console.log("user", $cookies.pbauser)
            //     LoginService.setUser($cookies.pbauser)
            // }
        }
    ]
)


.config(
    ['$stateProvider', '$provide', '$urlRouterProvider', '$httpProvider',
        function($stateProvider, $provide, $urlRouterProvider, $httpProvider) {

            /////////////////////////////
            //    Auth Interceptor     //
            /////////////////////////////

            $provide.factory('myHttpInterceptor', function($q, $injector) {
                return {
                    response: function(response) {
                        // do something on success
                        return response;
                    },
                    responseError: function(response) {
                        // do something on error
                        console.log("Response intercept")
                        if (response.status === 401) {
                            $injector.get('$state').transitionTo('login');
                            return $q.reject(response);
                        }
                        // console.log(response)
                        $injector.get('alertFactory').alerts(response);
                        return $q.reject(response);
                    }
                };
            });

            $provide.factory('timeoutHttpIntercept', function($q, $rootScope) {
                return {
                    'request': function(config) {
                        config.timeout = 3000;
                        return config;
                    }
                };
            });

            $httpProvider.interceptors.push('myHttpInterceptor');
            // $httpProvider.interceptors.push('timeoutHttpIntercept');


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
                    },
                    'taskbar@home': {
                        templateUrl: 'views/taskbar.html',
                        controller: 'taskController'
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
                        templateUrl: 'views/about.html',
                        controller: "aboutController"
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
                        templateUrl: 'views/Research.html',
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
                url: '/new/:campaignID',
                views: {
                    'content@home': {
                        templateUrl: 'views/campaign-convert.html',
                        controller: "newCampaignController"
                    }
                }
            })

            .state('home.campaign.details', {
                url: '/details/:campaignID',
                resolve: {
                    campaignFactory: 'campaignFactory',
                    campaign: function(campaignFactory, $stateParams) {
                        return campaignFactory.singleCampaign($stateParams.campaignID);
                    }
                },
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
                    // 'tasks':{
                    //   templateUrl: 'views/tasks.html',
                    //   controller: "taskController"
                    // }
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

            .state('home.prospect', {
                url: 'Prospect/:ProspectID',
                views: {
                    'content': {
                        templateUrl: 'views/Prospect.html',
                        controller: "prospectController"
                    }
                }
            })

            .state('home.kim', {
                url: 'Kim/:ProspectID',
                views: {
                    'content': {
                        templateUrl: 'views/Kim.html',
                        controller: "kimController"
                    }
                },
                reloadOnSearch: false
            })

            .state('home.search', {
                url: 'search?ProspectID&CustID&NCPDP&NPI&Zip&City&State&ProspectType&CustomerType',
                views: {
                    'content': {
                        templateUrl: 'views/Prospect-query.html',
                        controller: "searchController"
                    }
                }
            })

            // .state('home.search.results', {
            //   url: '/priority',
            //   views: {
            //     'content': {
            //       templateUrl: 'views/search.html',
            //       controller: "searchController"
            //   },
            //   'searchView': {
            //       templateUrl: 'views/search.html',
            //       controller: "searchController"
            //   }
            //   }
            // })


        }
    ]
);
