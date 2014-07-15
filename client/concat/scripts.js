var $__scripts__ = (function() {
  "use strict";
  var __moduleName = "scripts";
  var app = angular.module('uiRouterSample', ['ui.router', 'ngAnimate', 'ngResource', 'ngCookies', 'mgcrea.ngStrap', 'ngSanitize', 'chieffancypants.loadingBar', 'angular-table', 'ngTagsInput', 'xeditable']).run(['$rootScope', '$state', '$stateParams', '$cookies', "$http", function($rootScope, $state, $stateParams, $cookies, $http) {
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
      url: 'http://10.1.1.118:8000/api/Research?State=MO&Product=123&Order=ProspectID',
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
      url: 'search?ProspectID&CustID&NCPDP&NPI',
      views: {'content': {
          templateUrl: 'views/search.html',
          controller: "searchController"
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
  var Character = function Character(x, y) {
    this.x = x;
    this.y = y;
  };
  ($traceurRuntime.createClass)(Character, {}, {});
  var Monster = function Monster(x, y, name) {
    $traceurRuntime.superCall(this, $Monster.prototype, "constructor", [x, y]);
    this.name = name;
    this.health_ = 100;
  };
  var $Monster = Monster;
  ($traceurRuntime.createClass)(Monster, {
    attack: function(character) {
      $traceurRuntime.superCall(this, $Monster.prototype, "attack", [character]);
    },
    get isAlive() {
      return this.health_ > 0;
    },
    get health() {
      return this.health_;
    },
    set health(value) {
      if (value < 0)
        throw new Error('Health must be non-negative.');
      this.health_ = value;
    }
  }, {}, Character);
  var myMonster = new Monster(5, 1, 'arrrg');
  console.log("Monster", myMonster.health);
  myMonster.health = 0;
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
    var fetchAll = campaignFactory.getCampaigns();
    var displayResults = fetchAll.then(function(data) {
      console.log("Got...", data.data);
      $scope.availableCampaigns = data.data;
    });
  });
  angular.module('uiRouterSample').controller('campaignControllerDetails', function($scope, $rootScope, $state, campaignFactory, $alert) {
    console.log("Welcome to details from campaign controller");
    var campaignID = $rootScope.$stateParams.campaignID;
    $scope.campaignDetails = {};
    $scope.campaignPending = false;
    var getCampaign = campaignFactory.singleCampaign(campaignID);
    var displayCampaign = getCampaign.then(function(data) {
      console.log("got campaign...!", data.data);
      $scope.campaignDetails = data.data;
    });
  });
  angular.module('uiRouterSample').factory('campaignFactory', function($http) {
    return {
      queryResults: function(url, callback) {
        return $http.get('/api/campaigns');
      },
      singleCampaign: function(paramID) {
        console.log("Get campaign....#", paramID);
        return $http.get('http://10.1.1.118:8000/api/campaign/' + paramID);
      },
      thisSavedQuery: function(data) {
        return $http.get('api/thisQuery');
      },
      getQueries: function() {
        return $http.get('http://10.1.1.118:8000/api/Research/list');
      },
      singleQuery: function(queryID) {
        return $http.get('http://10.1.1.118:8000/api/Research/' + queryID);
      },
      convert: function(queryID) {
        return $http.post('http://10.1.1.118:8000/api/Campaign', $.param({QueryID: queryID}));
      },
      saveActivity: function(campaignID, activity) {
        return $http.post('http://10.1.1.118:8000/api/Campaign/' + campaignID + '/Activity', $.param(activity));
      },
      getUsers: function() {
        return $http.get('http://10.1.1.118:8000/api/users');
      },
      getCampaigns: function() {
        return $http.get('http://10.1.1.118:8000/api/campaign');
      }
    };
  });
  angular.module('uiRouterSample').controller('newCampaignController', function($scope, $rootScope, $state, $alert, campaignFactory, queryFactory) {
    console.log("Welcome to NEW campaign controller");
    $scope.tableConfig = {
      itemsPerPage: 10,
      fillLastPage: false,
      maxPages: 5
    };
    $scope.DeleteProspect = function(id) {
      $scope.campaignDetails.rows.forEach((function(a, b) {
        if (a.ProspectID == id) {
          a.Status ? a.Status = 0 : a.Status = 1;
          queryFactory.updateQueryStatus($scope.selectedQuery.QueryID, id, a.Status);
          return true;
        }
      }));
    };
    $scope.campaignID;
    $scope.campaignConverted = false;
    $scope.convert = function() {
      console.log("Converting...");
      campaignFactory.convert(1).then(function(data) {
        console.log("DONE, campaign ID ", data.data.CampaignID);
        $scope.campaignID = data.data.CampaignID;
        $scope.campaignConverted = true;
      });
    };
    $scope.userList = [];
    campaignFactory.getUsers().then(function(data) {
      console.log("Got all users....", data);
      $scope.userList = data.data.UserList;
    }).catch(function(err) {});
    $scope.savedQueries = [];
    $scope.selectedQuery;
    campaignFactory.getQueries().then(function(data) {
      console.log("Got...", data);
      $scope.savedQueries = data.data;
    }).catch(function(err) {});
    $scope.campaignDetails = {};
    $scope.campaignDetails.rows = [];
    $scope.setBillGroup = (function(data) {
      console.log("CHANGED", $scope.selectedQuery);
      campaignFactory.singleQuery($scope.selectedQuery.QueryID).then(function(data) {
        console.log("Okay got these details", data.data);
        $scope.campaignDetails = data.data;
        $scope.fetched = true;
      });
    });
    if ($state.params.campaignID !== "") {
      $scope.selectedQuery = {
        ProductID: 1,
        QueryID: $state.params.campaignID,
        Name: "mo test"
      };
      $scope.setBillGroup();
    }
    $scope.changeState = (function(bleh) {
      $state.go('home.campaign.details', {params: '1337'});
    });
    $scope.newActivity = {};
    $scope.savedActivites = [];
    $scope.activityNo = 0;
    $scope.selectedUser;
    $scope.saveActivity = function() {
      var campaignID = 5;
      $scope.newActivity.StartDateTime = "1900-01-01";
      $scope.newActivity.CompletionDateTime = '2014-06-20';
      $scope.newActivity.AssignedID = $scope.selectedUser.UserID;
      console.log("SAVING....", $scope.newActivity);
      var save = campaignFactory.saveActivity(campaignID, $scope.newActivity);
      save.catch(function(err) {
        var myAlert = $alert({
          title: err.statusText.toString(),
          content: err.data.Message,
          placement: 'top',
          type: 'danger',
          show: true,
          duration: 3
        });
      });
      save.then(function(result) {});
      $scope.savedActivites.push($scope.newActivity);
      $scope.activityNo++;
      $scope.newActivity = {};
    };
  });
  angular.module('uiRouterSample').controller('kimController', function($scope, $rootScope, $state, $alert, prospectFactory) {
    console.log("Hello kim");
    $scope.the_Prospect;
    $scope.Contacts = [];
    prospectFactory.getProspect_by_ID($state.params).then(function(data) {
      console.log("Got prospect", data);
      $scope.the_Prospect = new Prospect(data.data);
      console.log($scope.the_Prospect);
      $scope.currentContact = $scope.the_Prospect.Contacts[0];
      $scope.the_Prospect.Activities.reverse();
    });
    $scope.contactsCollapsed = true;
    $scope.issuesCollapsed = true;
    $scope.notesCollapsed = false;
    $scope.currentContact;
    $scope.onClickTab = function(contact) {
      $scope.currentContact = contact;
    };
    $scope.isActiveTab = function(contact) {
      return contact == $scope.currentContact;
    };
    $scope.currentPage = 1;
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
  angular.module('uiRouterSample').controller('loginController', function($scope, $rootScope, Privilege, $cookies, $alert, $http) {
    console.log("Controller loaded");
    $rootScope.loggedIn = $rootScope.loggedIn || false;
    $scope.creds = {};
    $scope.creds.userid = $cookies.userid;
    $scope.loginSubmit = function() {
      console.log("EXISTING XKEY IS", $http.defaults.headers.common[$traceurRuntime.toProperty('XKey')]);
      delete $http.defaults.headers.common[$traceurRuntime.toProperty('XKey')];
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
        $traceurRuntime.setProperty($http.defaults.headers.common, 'XKey', data.data.key);
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
  angular.module('uiRouterSample').directive('collapse', ['$transition', function($transition) {
    return {link: function(scope, element, attrs) {
        var initialAnimSkip = true;
        var currentTransition;
        function doTransition(change) {
          var newTransition = $transition(element, change);
          if (currentTransition) {
            currentTransition.cancel();
          }
          currentTransition = newTransition;
          newTransition.then(newTransitionDone, newTransitionDone);
          return newTransition;
          function newTransitionDone() {
            if (currentTransition === newTransition) {
              currentTransition = undefined;
            }
          }
        }
        function expand() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            expandDone();
          } else {
            element.removeClass('collapse').addClass('collapsing');
            doTransition({height: element[0].scrollHeight + 'px'}).then(expandDone);
          }
        }
        function expandDone() {
          element.removeClass('collapsing');
          element.addClass('collapse in');
          element.css({height: 'auto'});
        }
        function collapse() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            collapseDone();
            element.css({height: 0});
          } else {
            element.css({height: element[0].scrollHeight + 'px'});
            var x = element[0].offsetWidth;
            element.removeClass('collapse in').addClass('collapsing');
            doTransition({height: 0}).then(collapseDone);
          }
        }
        function collapseDone() {
          element.removeClass('collapsing');
          element.addClass('collapse');
        }
        scope.$watch(attrs.collapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }};
  }]).factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {
    var $transition = function(element, trigger, options) {
      options = options || {};
      var deferred = $q.defer();
      var endEventName = $transition[$traceurRuntime.toProperty(options.animation ? 'animationEndEventName' : 'transitionEndEventName')];
      var transitionEndHandler = function(event) {
        $rootScope.$apply(function() {
          element.unbind(endEventName, transitionEndHandler);
          deferred.resolve(element);
        });
      };
      if (endEventName) {
        element.bind(endEventName, transitionEndHandler);
      }
      $timeout(function() {
        if (angular.isString(trigger)) {
          element.addClass(trigger);
        } else if (angular.isFunction(trigger)) {
          trigger(element);
        } else if (angular.isObject(trigger)) {
          element.css(trigger);
        }
        if (!endEventName) {
          deferred.resolve(element);
        }
      });
      deferred.promise.cancel = function() {
        if (endEventName) {
          element.unbind(endEventName, transitionEndHandler);
        }
        deferred.reject('Transition cancelled');
      };
      return deferred.promise;
    };
    var transElement = document.createElement('trans');
    var transitionEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'transition': 'transitionend'
    };
    var animationEndEventNames = {
      'WebkitTransition': 'webkitAnimationEnd',
      'MozTransition': 'animationend',
      'OTransition': 'oAnimationEnd',
      'transition': 'animationend'
    };
    function findEndEventName(endEventNames) {
      for (var name in endEventNames) {
        if (transElement.style[$traceurRuntime.toProperty(name)] !== undefined) {
          return endEventNames[$traceurRuntime.toProperty(name)];
        }
      }
    }
    $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
    $transition.animationEndEventName = findEndEventName(animationEndEventNames);
    return $transition;
  }]);
  angular.module('uiRouterSample').filter('selectedTags', function() {
    return function(tasks, tags) {
      return tasks.filter(function(task) {
        for (var i in task.Tags) {
          if (tags.indexOf(task[$traceurRuntime.toProperty(i)]) != -1) {
            return true;
          }
        }
        return false;
      });
    };
  });
  angular.module('uiRouterSample').controller('navbarSearcher', function($scope, $rootScope, $state, $alert, prospectFactory) {
    console.log("Hello navbar");
    $scope.popover = {
      "title": "Title",
      "content": "Hello Popover<br />This is a multiline message!"
    };
  });
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
  var Prospect = function Prospect(obj) {
    var keys = Object.keys(obj);
    var self = this;
    keys.forEach((function(key) {
      $traceurRuntime.setProperty(self, key, obj[$traceurRuntime.toProperty(key)]);
    }));
    this.Issues = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__5 = obj.Issues[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6; !($__6 = $__5.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          x = $__6.value;
          $traceurRuntime.setProperty($__2, $__1++, new Issue(x));
        }
      }
      return $__2;
    }());
    this.Activities = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__5 = obj.Activities[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6; !($__6 = $__5.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          x = $__6.value;
          $traceurRuntime.setProperty($__2, $__1++, new Activity(x));
        }
      }
      return $__2;
    }());
    this.Contacts = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__5 = obj.Contacts[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6; !($__6 = $__5.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          x = $__6.value;
          $traceurRuntime.setProperty($__2, $__1++, new Contact(x));
        }
      }
      return $__2;
    }());
    this.IssueCount = obj.Issues.length;
    this.ActivityCount = obj.Activities.length;
    this.ContactCount = obj.Contacts.length;
  };
  ($traceurRuntime.createClass)(Prospect, {}, {});
  var Contact = function Contact(obj) {
    var keys = Object.keys(obj);
    var self = this;
    keys.forEach((function(key) {
      $traceurRuntime.setProperty(self, key, obj[$traceurRuntime.toProperty(key)]);
    }));
    this.HumanTypes_ = _.pluck(obj.Types, 'Type');
    this.OldTypes = [];
  };
  ($traceurRuntime.createClass)(Contact, {
    set HumanTypes(value) {
      this.OldTypes = this.HumanTypes_;
      this.HumanTypes_ = value;
    },
    get HumanTypes() {
      return this.HumanTypes_;
    },
    get old_vs_new() {
      return {
        'old': this.OldTypes,
        'new': this.HumanTypes_
      };
    }
  }, {});
  var Issue = function Issue(obj) {
    var keys = Object.keys(obj);
    var self = this;
    keys.forEach((function(key) {
      $traceurRuntime.setProperty(self, key, obj[$traceurRuntime.toProperty(key)]);
    }));
    this.issue = true;
    this.start = obj.CreationDateTime;
    this.end = obj.CompletionDateTime;
    this.startHuman = moment(obj.CreationDateTime).format("LL");
    this.endHuman = moment(obj.CompletionDateTime).format("ll");
    this.content = obj.Description.substring(0, 5);
    this.typeOf = "Closed Issues";
    if (this.end == "1900-01-01T00:00:00") {
      delete this.end;
      this.endHuman = "Still opened";
      this.className = "openIssue";
      this.typeOf = "Open Issues";
    }
    this.year = parseInt(moment(obj.CreationDateTime).format("YYYY"));
    this.month = parseInt(moment(obj.CreationDateTime).format("MM"));
    this.day = parseInt(moment(obj.CreationDateTime).format("DDD"));
    this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY");
    this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY");
    this.replyCount = obj.Followups.length;
    this.Followups = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__5 = obj.Followups[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__6; !($__6 = $__5.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          x = $__6.value;
          $traceurRuntime.setProperty($__2, $__1++, new Followups(x));
        }
      }
      return $__2;
    }());
  };
  ($traceurRuntime.createClass)(Issue, {}, {});
  var Activity = function Activity(obj) {
    var keys = Object.keys(obj);
    var self = this;
    keys.forEach((function(key) {
      $traceurRuntime.setProperty(self, key, obj[$traceurRuntime.toProperty(key)]);
    }));
    this.issue = false;
    this.startHuman = moment(obj.CreationDateTime).format("LL");
    this.start = obj.CreationDateTime;
    this.content = "1 note";
    this.typeOf = "All Activities";
    this.year = parseInt(moment(obj.CreationDateTime).format("YYYY"));
    this.month = parseInt(moment(obj.CreationDateTime).format("MM"));
    this.day = parseInt(moment(obj.CreationDateTime).format("DDD"));
    this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY");
    this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY");
  };
  ($traceurRuntime.createClass)(Activity, {}, {});
  var Followups = function Followups(obj) {
    var keys = Object.keys(obj);
    var self = this;
    keys.forEach((function(key) {
      $traceurRuntime.setProperty(self, key, obj[$traceurRuntime.toProperty(key)]);
    }));
    this.issue = false;
    this.startHuman = moment(obj.CreationDateTime).format("ll");
  };
  ($traceurRuntime.createClass)(Followups, {}, {});
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
  angular.module('uiRouterSample').factory('prospectFactory', function($http) {
    return {getProspect_by_ID: function(prospect) {
        return $http.get('http://10.1.1.118:8000/api/prospect/' + prospect.ProspectID);
      }};
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
        $state.go('home.campaign.new', {campaignID: res.data.QueryID});
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
        return $http.post('http://10.1.1.118:8000/api/Research', $.param(prospects));
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
  angular.module('uiRouterSample').factory('rolesFactory', function($http) {
    return {
      listRoles: function() {
        return $http.get('http://10.1.1.118:8000/api/Roles');
      },
      getUsers: function() {
        return $http.get('http://10.1.1.118:8000/api/users');
      },
      addRole: function(user, roleID) {
        return $http.post('http://10.1.1.118:8000/api/users/' + user + '/Roles/' + roleID);
      }
    };
  });
  angular.module('uiRouterSample').controller('rolesController', function($scope, $rootScope, $state, rolesFactory) {
    console.log("Roles controller");
    $scope.availableRoles;
    rolesFactory.listRoles().then(function(data) {
      console.log("Got roles...", data.data);
      $scope.availableRoles = data.data;
    });
    $scope.availableUsers;
    rolesFactory.getUsers().then(function(data) {
      console.log("Got users", data.data);
      $scope.availableUsers = data.data.UserList;
    });
    $scope.addRole = function(name, roleID) {
      console.log(name, roleID);
      rolesFactory.addRole(name, roleID).then(function(data) {
        console.log("Done");
      });
    };
  });
  angular.module('uiRouterSample').controller('searchController', function($scope, $rootScope, $state, $alert, searchFactory, $timeout, $location) {
    console.log("Hello search");
    console.log($state.params);
    var cow_dicks = $state.params;
    Object.keys(cow_dicks).forEach(function(k) {
      if (!cow_dicks[$traceurRuntime.toProperty(k)]) {
        delete cow_dicks[$traceurRuntime.toProperty(k)];
      }
    });
    console.log("Got", cow_dicks);
    if (cow_dicks) {
      console.log("There's params, guys!!!");
      searchFactory.search(cow_dicks).then(function(res) {
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
  });
  angular.module('uiRouterSample').factory('searchFactory', function($http) {
    return {search: function(paramsObj) {
        return $http.get('http://10.1.1.118:8000/api/Prospect', {params: paramsObj});
      }};
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
    $scope.myData = [{
      name: 'AngularJS',
      count: 300
    }, {
      name: 'D3.JS',
      count: 150
    }, {
      name: 'jQuery',
      count: 400
    }, {
      name: 'Backbone.js',
      count: 300
    }, {
      name: 'Ember.js',
      count: 100
    }];
  });
  angular.module('uiRouterSample').directive('crD3Bars', [function() {
    return {
      restrict: 'E',
      scope: {data: '='},
      link: function(scope, element) {
        scope.render = function(data) {
          var dataset = [5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25];
          d3.select("barchart").selectAll("div").data(dataset).enter().append("div").attr("class", "bar").style("height", function(d) {
            var barHeight = d * 5;
            return barHeight + "px";
          });
        };
        scope.$watch('data', function() {
          scope.render(scope.data);
        }, true);
      }
    };
  }]);
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
