var $__scripts__ = (function() {
  "use strict";
  var __moduleName = "scripts";
  var app = angular.module('uiRouterSample', ['ui.router', 'ngAnimate', 'ngResource', 'ngCookies', 'mgcrea.ngStrap', 'ngSanitize', 'chieffancypants.loadingBar', 'angular-table', 'ngTagsInput']).run(['$rootScope', '$state', '$stateParams', '$cookies', "$http", function($rootScope, $state, $stateParams, $cookies, $http) {
    $traceurRuntime.setProperty($http.defaults.headers.common, 'XKey', $cookies.xkey);
    $http.defaults.headers.put = {'Content-Type': 'application/x-www-form-urlencoded'};
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.loggedIn = true;
    $rootScope.credentials = {group: "Undefined"};
    var testKey = $http({
      method: 'GET',
      url: 'http://10.1.1.118:8000/api/Research?State=MO&Product=123&Order=ProspectID',
      headers: {
        'Accept': 'application/json',
        'XKey': $cookies.xkey
      }
    });
  }]).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    var interceptor = ['$location', '$q', '$injector', function($location, $q, $injector) {
      function success(response) {
        return response;
      }
      function error(response) {
        if (response.status === 401) {
          $injector.get('$state').transitionTo('login');
          return $q.reject(response);
        } else {
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
      url: '/new',
      views: {'content@home': {
          templateUrl: 'views/newcampaign.html',
          controller: "newCampaignController"
        }}
    }).state('home.campaign.details', {
      url: '/details/:params',
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
    });
  }]);
  var list = [1, 2, 3, 4];
  var res = (function() {
    var $__3,
        $__4,
        x;
    return $traceurRuntime.generatorWrap(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__3 = list[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__4 = $__3.next()).done) ? 5 : -2;
            break;
          case 5:
            x = $__4.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return x;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, this);
  }());
  console.log("Res", res);
  var acc = '';
  for (var $__3 = res[$traceurRuntime.toProperty(Symbol.iterator)](),
      $__4; !($__4 = $__3.next()).done; ) {
    var x = $__4.value;
    {
      acc += x;
      console.log("Acc", acc);
    }
  }
  var res = (function() {
    var $__5,
        $__6,
        x;
    return $traceurRuntime.generatorWrap(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__5 = list[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__6 = $__5.next()).done) ? 5 : -2;
            break;
          case 5:
            x = $__6.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return x;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, this);
  }());
  console.log("Res next", res.next(), res.next());
  function timeout(ms) {
    return new Promise((function(resolve) {
      setTimeout(resolve, ms);
    }));
  }
  timeout(1000).then((function() {
    console.log('done');
  }));
  var evens = [2, 4, 6, 8];
  var odds = evens.map((function(v) {
    return v + 1;
  }));
  var nums = evens.map((function(v, i) {
    return v + i;
  }));
  console.log("Nums", nums);
  var melter = (function(obj) {
    var temp = obj;
    temp.melted = "melted";
    return temp;
  });
  var empty = (function() {});
  var Car = function Car(make) {
    this.make = make;
    this.currentSpeed = 25;
  };
  ($traceurRuntime.createClass)(Car, {printCurrentSpeed: function() {
      console.log(this.make + ' is going ' + this.currentSpeed + ' mph.');
    }}, {});
  var RaceCar = function RaceCar(make, topSpeed) {
    $traceurRuntime.superCall(this, $RaceCar.prototype, "constructor", [make]);
    this.topSpeed = topSpeed;
  };
  var $RaceCar = RaceCar;
  ($traceurRuntime.createClass)(RaceCar, {goFast: function() {
      this.currentSpeed = this.topSpeed;
    }}, {}, Car);
  var stang = new RaceCar('Mustang', 150);
  var prius = new Car('Prius', 100);
  stang.printCurrentSpeed();
  stang.goFast();
  stang.printCurrentSpeed();
  prius.printCurrentSpeed();
  var num = 0;
  {
    try {
      throw undefined;
    } catch ($i) {
      $i = 0;
      for (; $i < 10; $i++) {
        try {
          throw undefined;
        } catch (i) {
          i = $i;
          try {
            num += i;
            console.log('value of i in block: ' + i);
          } finally {
            $i = i;
          }
        }
      }
    }
  }
  console.log('Is i defined here?: ' + (typeof i !== 'undefined'));
  var customers = [{
    city: "Seattle",
    note: "i'm gay",
    name: "Jesus"
  }];
  var results = (function() {
    var $__1 = 0,
        $__2 = [];
    for (var $__5 = customers[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__6; !($__6 = $__5.next()).done; ) {
      try {
        throw undefined;
      } catch (c) {
        c = $__6.value;
        if (c.city == "Seattle")
          $traceurRuntime.setProperty($__2, $__1++, {
            name: c.name,
            age: c.age
          });
      }
    }
    return $__2;
  }());
  console.log("RESULTS", customers, results);
  'use strict';
  function entries(obj) {
    var $__5,
        $__6,
        key;
    return $traceurRuntime.generatorWrap(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__5 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__6 = $__5.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__6.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return [key, obj[$traceurRuntime.toProperty(key)]];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, this);
  }
  function keys(obj) {
    var $__5,
        $__6,
        key;
    return $traceurRuntime.generatorWrap(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__5 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__6 = $__5.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__6.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return key;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, this);
  }
  function take(iterator, n) {
    return $traceurRuntime.generatorWrap(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (n > 0) ? 1 : -2;
            break;
          case 1:
            $ctx.state = 2;
            return iterator.next();
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            n--;
            $ctx.state = 0;
            break;
          default:
            return $ctx.end();
        }
    }, this);
  }
  function values(obj) {
    var $__5,
        $__6,
        key;
    return $traceurRuntime.generatorWrap(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__5 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__6 = $__5.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__6.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return obj[$traceurRuntime.toProperty(key)];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, this);
  }
  angular.module('uiRouterSample').controller('adminController', function($scope, $rootScope, $state, $alert) {
    console.log("Welcome to the Admin Controller");
    if (!$rootScope.credentials.admin) {
      $state.go("home");
      var myAlert = $alert({
        title: "Forbidden - ",
        content: "We're calling the cops",
        placement: 'top',
        type: 'danger',
        show: true,
        keyboard: true,
        duration: 3
      });
    }
  });
  angular.module('uiRouterSample').controller('campaignController', function($scope, $rootScope, $state, campaignFactory) {
    console.log("Welcome from campaign controller");
    $scope.availableCampaigns = [];
    var fetchAll = campaignFactory.queryResults();
    var displayResults = fetchAll.then(function(data) {
      console.log("Got...", data.data);
      $scope.availableCampaigns = data.data;
    });
  });
  angular.module('uiRouterSample').controller('campaignControllerDetails', function($scope, $rootScope, $state, campaignFactory, $alert) {
    console.log("Welcome to details from campaign controller");
    $scope.params = $rootScope.$stateParams;
    $scope.theCampaign = {};
    $scope.campaignPending = false;
    var getCampaign = campaignFactory.singleCampaign($scope.params);
    var displayCampaign = getCampaign.then(function(data) {
      console.log("Success...!", data);
      $scope.theCampaign = data.data;
    });
    var invalidCampaign = getCampaign.catch(function(err) {
      var myAlert = $alert({
        title: err.statusText,
        content: err.data,
        placement: 'top',
        type: 'danger',
        show: true
      });
    });
    $scope.nextStatus = function(cID) {
      console.log("Taking this campaign to the next status...!", cID);
      $scope.campaignPending = true;
    };
    $scope.savetoPending = function(cID) {
      console.log("Saving this template to PENDING ", cID);
      $state.go('home');
    };
    $scope.todoText = "";
    $scope.activities = [];
    $scope.activities.push("Example Activity 1 -- Assigned to Marketing");
    $scope.activities.push("Example Activity 2 -- Assigned to Rick");
    $scope.addActivity = function() {
      console.log("Adding activity ", $scope.todoText);
      $scope.activities.push($scope.todoText);
      $scope.todoText = "";
    };
  });
  angular.module('uiRouterSample').factory('campaignFactory', function($http) {
    return {
      queryResults: function(url, callback) {
        return $http.get('/api/campaigns');
      },
      singleCampaign: function(data) {
        return $http.post('/api/singlecampaign', data);
      },
      thisSavedQuery: function(data) {
        return $http.get('api/thisQuery');
      }
    };
  });
  angular.module('uiRouterSample').controller('newCampaignController', function($scope, $rootScope, $state, campaignFactory) {
    console.log("Welcome to NEW campaign controller");
    $scope.savedQueries = [{id: "id1"}, {id: "id2"}];
    $scope.colors = [{
      name: 'Northeast Barrens',
      shade: 'dark'
    }, {
      name: 'Alaska',
      shade: 'light'
    }, {
      name: 'Jamiacan Wonderland',
      shade: 'dark'
    }, {
      name: 'Coral Reef',
      shade: 'dark'
    }, {
      name: 'Stranglethorn Vale',
      shade: 'light'
    }, {
      name: 'Elwynn Forest',
      shade: 'light'
    }];
    $scope.fetched = false;
    $scope.savedQueryData = "";
    $scope.color = $scope.colors[2];
    $scope.setBillGroup = (function(data) {
      $scope.savedQueryData = "";
      console.log("CHANGED");
      console.log($scope.color);
      var getData = campaignFactory.thisSavedQuery();
      var processData = getData.then(function(data) {
        console.log("Got....", data);
        $scope.fetched = true;
        $scope.savedQueryData = data.data[0];
      });
    });
    $scope.changeState = (function(bleh) {
      $state.go('home.campaign.details', {params: '1337'});
    });
  });
  angular.module('uiRouterSample').controller('landingController', function($scope, $rootScope, $state, Tasks) {
    console.log("Landing Controller");
    if (!$rootScope.loggedIn) {
      console.log("Not logged in, redirect");
      $state.go("login");
    }
    $scope.dropdown = [{
      "text": "New Campaign",
      "click": '$state.go("home.campaign.new")'
    }, {
      "text": "Other Campaigns",
      "click": '$state.go("home.campaign")'
    }, {"divider": true}, {
      "text": "New Query",
      "click": '$state.go("home.query")'
    }];
    $scope.inMarketing = false;
    if ($rootScope.credentials.group == "Marketing") {
      $scope.inMarketing = true;
      var thisUsersGroup = $rootScope.credentials;
      $scope.allTasks = [];
      var fetch = Tasks.myTasks(thisUsersGroup);
      var showTasks = fetch.then(function(data) {
        console.log("Show tasks....", data);
        $scope.allTasks = data.data;
      });
    }
    window.setInterval(function() {
      var entries = window.performance.getEntries();
      entries = entries.sort(function(a, b) {
        return b.duration - a.duration;
      });
      $rootScope.metrics = entries;
    }, 500);
  });
  angular.module('uiRouterSample').factory('Tasks', function($http) {
    return {
      queryResults: function(url, callback) {
        return $http.get('/api/campaigns');
      },
      myTasks: function(data) {
        console.log("Factory TASKS getting myTasks..", data);
        return $http.post('/api/usertasks', data);
      },
      taskDetails: function(data) {
        console.log("Factory TASKS getting details..", data);
        return $http.post('/api/taskdetails', data);
      },
      allTasks: function() {
        console.log("Factory tasks returning every task...");
        return $http.get('/api/alltasks');
      },
      taskProspect: function() {
        return $http.get('/api/randomProspect');
      }
    };
  });
  angular.module('uiRouterSample').controller('loginController', function($scope, $rootScope, Privilege, $cookies, $alert) {
    console.log("Controller loaded");
    $rootScope.loggedIn = $rootScope.loggedIn || false;
    $scope.creds = {};
    $scope.creds.userid = $cookies.userid;
    $scope.loginSubmit = function() {
      var test = Privilege.Cocks($scope.creds);
      var test2 = test.then(function(data) {
        console.log("Then....", data.data);
        $rootScope.loggedIn = true;
        $rootScope.$state.go("home");
        $rootScope.credentials.username = data.data.userid;
        $rootScope.credentials.key = data.data.key;
        $rootScope.credentials.admin = data.admin;
        $rootScope.credentials.group = data.group;
        $cookies.xkey = data.data.key;
        $cookies.userid = data.data.userid;
      }, function(data) {
        var myAlert = $alert({
          title: "Title",
          content: "err",
          placement: 'top',
          type: 'danger',
          show: true
        });
      });
      var catchError = test.catch(function(err) {
        var myAlert = $alert({
          title: err.message,
          content: err.data,
          placement: 'top',
          type: 'danger',
          show: true
        });
        console.log("Never fire this error", err);
      });
    };
    $scope.logOut = function() {
      $rootScope.loggedIn = false;
    };
  });
  angular.module('uiRouterSample').factory('Privilege', function($resource, $http, $q) {
    console.log("Factory loaded");
    return {
      Recipe: $resource('/recipes/:id', {id: '@id'}),
      Users: $resource('/users/:id', {id: '@id'}),
      Group: $resource('/groups/:id', {id: '@id'}),
      Login: $resource('http://10.1.1.118:8000/api/Auth', {userId: '@id'}, {'query': {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          isArray: false
        }}),
      Example: $resource('api/users/:userId/privileges', {userId: '@id'}, {'query': {
          method: 'GET',
          isArray: false
        }}),
      Cocks: function(alpha, beta) {
        var local = "blargh gargh";
        console.log("POST DUDE", alpha, beta);
        return $http({
          method: 'POST',
          url: 'http://10.1.1.118:8000/api/Auth',
          data: $.param(alpha),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }
    };
  });
  angular.module('uiRouterSample').controller('queryController', function($scope, $rootScope, $state, $stateParams, $location, queryFactory, $q, $alert) {
    console.log("query Controller", $stateParams);
    $scope.resultsReturned = false;
    $scope.results = {};
    $scope.tableConfig = {
      itemsPerPage: 10,
      fillLastPage: false,
      maxPages: 5
    };
    $scope.queryName = "";
    $scope.productList = ["TriNet", "ProfitGuard"];
    $scope.selectedProduct;
    $scope.queryList;
    $scope.selectedQuery;
    $scope.Clicking_the_table_now_performs_http = false;
    $scope.QueryID;
    $scope.params;
    $scope.selectedStates = [];
    $scope.states = [{
      value: 'Kansas',
      label: 'Kansas'
    }, {
      value: 'AK',
      label: 'Arkansas'
    }, {
      value: 'MO',
      label: 'Missouri'
    }, {
      value: 'TX',
      label: 'Texas'
    }, {
      value: 'NY',
      label: 'New York'
    }, {
      value: 'California',
      label: 'California'
    }];
    $scope.queryParams = {
      State: [],
      Bill: "Yes"
    };
    $scope.saveObject = {};
    queryFactory.getQueries().then((function(data) {
      $scope.queryList = data.data;
    }));
    $scope.findQuery = function() {
      $scope.resultsReturned = false;
      queryFactory.singleQuery($scope.selectedQuery.QueryID).then((function(data) {
        $scope.params = $.deparam(data.data.ParamStr);
        $scope.results = data.data.rows;
        $scope.QueryID = data.data.QueryID;
        $scope.resultsReturned = true;
        $scope.selectedStates = $scope.params.State;
        $scope.Clicking_the_table_now_performs_http = true;
        $scope.saveObject.Name = "LOADED FROM DROPDOWN -- query name is " + data.data.Name;
      }));
    };
    $scope.querySearch = function() {
      $scope.results = {};
      $scope.resultsReturned = false;
      console.log("New search...please wait...");
      $scope.queryParams.State = $scope.selectedStates;
      var submit = queryFactory.queryResults($scope.queryParams);
      var process = submit.then((function(data) {
        $scope.results = data.data;
        $scope.resultsReturned = true;
        $location.search($scope.queryParams);
      })).catch(function(err) {
        if (err.status == 401)
          console.log("401 is handled by Interceptors");
      });
    };
    $scope.whoa = function() {
      queryFactory.updateQueryName("1").then((function(data) {
        console.log("COMPLETE");
      }));
    };
    $scope.DeleteProspect = function(id) {
      $scope.results.forEach((function(a, b) {
        if (a.ProspectID == id) {
          a.Status ? a.Status = 0 : a.Status = 1;
          if ($scope.Clicking_the_table_now_performs_http) {
            queryFactory.updateQueryStatus($scope.QueryID, id, a.Status);
          }
          return true;
        }
      }));
    };
    $scope.saveTemplate = function() {
      if ($scope.Clicking_the_table_now_performs_http) {
        return;
      }
      $scope.saveObject.rows = $scope.results;
      var params = $location.search();
      var mod = $.param(params);
      $scope.saveObject.ParamStr = mod;
      $scope.saveObject.Product = 1;
      queryFactory.saveQuery($scope.saveObject).then((function(res) {
        $state.go('home.campaign');
      })).catch((function(err) {
        var myAlert = $alert({
          title: err.status.toString(),
          content: err.statusText,
          placement: 'top',
          type: 'danger',
          show: true
        });
      }));
    };
    if ($stateParams.State != null) {
      $scope.selectedStates = [$stateParams.State];
      $scope.querySearch();
    }
  });
  angular.module('uiRouterSample').factory('queryFactory', function($http) {
    return {
      queryResults: function(url, callback) {
        console.log("Getting query with params ", url);
        return $http.get('http://10.1.1.118:8000/api/Research', {params: url});
      },
      removeQuery: function(rowID) {
        return $http.put('');
      },
      deleteProspect: function(id) {
        return $http.delete('/api/prospects', {params: {
            'start': '5',
            'end': '20'
          }});
      },
      saveQuery: function(prospects) {
        console.log("Save query Prospects ", prospects);
        return $http.post('http://10.1.1.118:8000/api/Research', prospects);
      },
      getQueries: function() {
        return $http.get('http://10.1.1.118:8000/api/Research/list');
      },
      singleQuery: function(queryID) {
        return $http.get('http://10.1.1.118:8000/api/Research/' + queryID);
      },
      updateQueryName: function(queryID) {
        return $http.put('http://10.1.1.118:8000/api/Research/' + queryID, $.param({'Name': 'Angular'}));
      },
      updateQueryStatus: function(QueryID, ProspectID, status) {
        return $http.put('http://10.1.1.118:8000/api/Research/' + QueryID + '/' + ProspectID, $.param({'Status': status}));
      }
    };
  });
  angular.module('uiRouterSample').controller('taskController', function($scope, $rootScope, $state, Tasks) {
    console.log("Task Controller", $state);
    $scope.singleTask = {};
    $scope.everyTask = [];
    $scope.workingProspect = {};
    $scope.singleTaskBool = false;
    $scope.everyTaskBool = false;
    $scope.taskTypeBulk = false;
    $scope.taskTypeSingle = false;
    if ($state.params.taskID !== "") {
      console.log("Show specific task", $state.params.taskID);
      var getSingleTask = Tasks.taskDetails($state.params);
      var displaySingleTask = getSingleTask.then(function(data) {
        console.log("Got single task", data);
        $scope.singleTask = data.data;
        $scope.singleTaskBool = true;
        if (data.data.taskName.toLowerCase() == "bulk activity") {
          $scope.taskTypeBulk = true;
        } else {
          $scope.taskTypeSingle = true;
          Tasks.taskProspect().then(function(data) {
            console.log("My working prospect is...", data.data);
            $scope.workingProspect = data.data;
          });
        }
      });
    } else {
      console.log("Not enough params, just show all tasks?");
      var everyTask = Tasks.allTasks().then(function(data) {
        console.log("Got everything! ", data.data);
        $scope.everyTask = data.data;
        $scope.everyTaskBool = true;
      });
    }
  });
  angular.module('uiRouterSample').controller('timelineController', function($scope, $rootScope, $state, Tasks) {
    console.log("TIMELINE");
  });
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
})();
