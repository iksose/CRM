"use strict";
var app = angular.module('uiRouterSample', ['ui.router', 'ngAnimate', 'ngResource', 'ngCookies', 'mgcrea.ngStrap', 'ngSanitize', 'chieffancypants.loadingBar', 'angular-table', 'ngTagsInput', 'xeditable', 'ui.calendar', 'angularFileUpload', 'SignalR', 'timer']).run(['$rootScope', '$state', '$stateParams', '$cookies', "$http", 'LoginService', function($rootScope, $state, $stateParams, $cookies, $http, LoginService) {
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
}]).config(['$stateProvider', '$provide', '$urlRouterProvider', '$httpProvider', function($stateProvider, $provide, $urlRouterProvider, $httpProvider) {
  $provide.factory('myHttpInterceptor', function($q, $injector) {
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        console.log("Response intercept");
        if (response.status === 401) {
          $injector.get('$state').transitionTo('login');
          return $q.reject(response);
        }
        $injector.get('alertFactory').alerts(response);
        return $q.reject(response);
      }
    };
  });
  $provide.factory('timeoutHttpIntercept', function($q, $rootScope) {
    return {'request': function(config) {
        config.timeout = 3000;
        return config;
      }};
  });
  $httpProvider.interceptors.push('myHttpInterceptor');
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
      'content@home': {templateUrl: 'views/landing.html'},
      'taskbar@home': {
        templateUrl: 'views/taskbar.html',
        controller: 'taskController'
      }
    }
  }).state('home.about', {
    url: 'about',
    views: {'content': {
        templateUrl: 'views/about.html',
        controller: "aboutController"
      }}
  }).state('home.query', {
    url: 'query/new/?State&Age&Product&Distance',
    reloadOnSearch: false,
    views: {'content': {
        templateUrl: 'views/Research.html',
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
        templateUrl: 'views/campaign-convert.html',
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
    url: 'search?ProspectID&CustID&NCPDP&NPI&Zip&City&State&ProspectType&CustomerType',
    views: {'content': {
        templateUrl: 'views/Prospect-query.html',
        controller: "searchController"
      }}
  });
}]);

"use strict";
var assert = require("assert").assert;
function checkTest(age) {
  assert.argumentTypes(age, $traceurRuntime.type.number);
  console.log("Passed? ", age);
}
checkTest.parameters = [[$traceurRuntime.type.number]];
checkTest(20);

"use strict";
angular.module('uiRouterSample').controller('aboutController', function($scope, $rootScope, $http) {
  console.log("About controller");
  $scope.dataset = [5, 10, 15, 20, 25];
  $scope.inc = function() {
    $scope.dataset[4]++;
    console.log($scope.dataset);
  };
  $scope.dataset2 = [5, 10, 15, 20, 25];
});

"use strict";
angular.module('uiRouterSample').directive('barsChart', function($parse) {
  var directiveDefinitionObject = {
    restrict: 'E',
    replace: false,
    scope: {data: '=chartData'},
    link: function(scope, element, attrs) {
      var chart = d3.select(element[0]);
      chart.append("div").attr("class", "chart").selectAll('div').data(scope.data).enter().append("div").transition().ease("elastic").style("width", ((function(d) {
        return d + "%";
      }))).text(((function(d) {
        return d + "%";
      })));
      scope.$watch('data', function(newVal, oldVal) {
        if (newVal === oldVal) {
          console.log("Changed 1");
          return;
        }
        if (newVal) {
          chart.selectAll("div").filter(function(d, i) {
            if (i == 0) {
              return false;
            }
            return true;
          }).data(scope.data).style("width", ((function(d) {
            return d + "%";
          }))).text(((function(d) {
            return d + "%";
          })));
        } else {
          console.log("Changed 3");
        }
      }, true);
      function transitionGroup() {
        chart.selectAll();
      }
    }
  };
  return directiveDefinitionObject;
}).directive('donutChart', function($parse) {
  var directiveDefinitionObject = {
    restrict: 'E',
    replace: false,
    scope: {data: '=chartData'},
    link: function(scope, element, attrs) {
      var width = 960,
          height = 500,
          radius = Math.min(width, height) / 2;
      var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70);
      var pie = d3.layout.pie().sort(null).value(function(d) {
        return d.population;
      });
      var svg = d3.select(element[0]).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      var g = svg.selectAll(".arc").data(pie(scope.data)).enter().append("g").attr("class", "arc");
      g.append("path").attr("d", arc);
    }
  };
  return directiveDefinitionObject;
});

"use strict";
angular.module('uiRouterSample').factory('notused', function($rootScope, Hub, $q, TaskService) {
  var hub = new Hub('activityQueueHub', {
    listeners: {
      'taskWorking': function(info) {
        console.log("a task status was changed....", info);
        TaskService.TaskList.update(info.ActivityID, info.Status);
        $rootScope.$apply();
      },
      'userJoined': function(user) {
        console.log("User joined", user);
        TaskService.UserList.push(user);
        $rootScope.$apply();
      },
      'userLeft': function(user) {
        console.log("User left", user);
        TaskService.UserList.remove(user.UserID);
        $rootScope.$apply();
      }
    },
    rootPath: "http://10.1.1.118:8000/signalr",
    methods: ['GetTasks', 'changeTaskStatusD', 'WhoAmI', 'ChangeTaskStatus', 'TimeUntilNextFill']
  });
  var TimeUntilNextFill = function() {
    var def = $q.defer();
    console.log("get time until next fill");
    hub.TimeUntilNextFill().then(function(data) {
      console.log("res", data);
      def.resolve(data);
    });
    return def.promise;
  };
  var deferred = $q.defer();
  hub.init().then(function(res) {
    if (res._subscribedToHubs) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  });
  var getCurrent = function() {
    var def = $q.defer();
    console.log("get current");
    hub.hello_Im_Connected(shapeModel).then(function(data) {
      def.resolve();
    });
    return def.promise;
  };
  var getUser = function() {
    var def = $q.defer();
    console.log("get WhoAmI");
    hub.WhoAmI("pbajoj").then(function(users) {
      var $__0;
      ($__0 = TaskService.UserList).push.apply($__0, $traceurRuntime.spread(users));
      users.forEach(function(user) {
        for (var key in TaskService.Groups) {
          TaskService.Groups[$traceurRuntime.toProperty(key)].forEach(function(role) {
            var idx = TaskService.Groups[$traceurRuntime.toProperty(key)].map((function(user) {
              return user.UserID;
            })).indexOf(user.UserID);
            if (idx != -1) {
              TaskService.Groups[$traceurRuntime.toProperty(key)][$traceurRuntime.toProperty(idx)].online = true;
            }
          });
        }
      });
      $rootScope.$apply();
      def.resolve();
    });
    return def.promise;
  };
  var ChangeTaskStatus = function(activityID, status) {
    var def = $q.defer();
    hub.ChangeTaskStatus(activityID, status).then(function(data) {
      console.log("Done changing status");
      def.resolve();
    });
    return def.promise;
  };
  var GetTasks = function() {
    console.log("Getting tasks");
    var def = $q.defer();
    hub.GetTasks().then(function(data) {
      def.resolve(data);
    });
    return def.promise;
  };
  return [{
    map: getCurrent,
    WhoAmI: getUser,
    GetTasks: GetTasks,
    ChangeTaskStatus: ChangeTaskStatus,
    TimeUntilNextFill: TimeUntilNextFill
  }, deferred.promise];
});

"use strict";
var NewActivity = function NewActivity(obj) {
  Object.assign(this, obj);
  this.StartDateTime = moment(obj.StartDateTime).format("YYYY-MM-DD");
  this.CompletionDateTime = moment(obj.CompletionDateTime).format("YYYY-MM-DD");
};
($traceurRuntime.createClass)(NewActivity, {}, {});

"use strict";
angular.module('uiRouterSample').controller('activityController', function($scope, $rootScope, $http, activityFactory, $upload) {
  console.log("Welcome to activity controller");
  $scope.userList = [];
  var getUsers = $http.get('http://10.1.1.118:8000/api/users').then(function(data) {
    console.log("Got users", data.data.UserList);
    $scope.userList = data.data.UserList;
  }).catch(function(err) {});
  $scope.model = activityFactory[0];
  $scope.setFile = function($files) {
    console.log("Passed", $files);
    activityFactory[2].file = $files[0];
    console.log("Model", activityFactory[2]);
  };
});

"use strict";
angular.module('uiRouterSample').factory('activityFactory', function($http, $upload, $alert, $q) {
  var activityFactory = {};
  var myUpload = {};
  var activityMethods = {
    self: this,
    _campaignID: "",
    _activity: "",
    saveActivity_and_then_do_Attachments: function(campaignID, activity) {
      console.log("Save activity and then do attachments", campaignID, activity);
      self._campaignID = campaignID;
      self.activity = activity;
      var deferred = $q.defer();
      $http.post('http://10.1.1.118:8000/api/Campaign/' + campaignID + '/Activity', $.param(activity)).success(function(data) {
        console.log("SUCCESS!", data);
        console.log("Now to upload...", myUpload);
        if (Object.keys(myUpload).length === 0) {
          console.log("Nevermind....myUpload is empty");
          deferred.resolve(data);
        } else {
          var activityID = data.ActivityID;
          $upload.http({
            url: 'http://10.1.1.118:8000/api/Campaign/' + campaignID + '/Activity/' + activityID + '/Attachment/' + myUpload.name,
            headers: {'Content-Type': myUpload.type},
            data: myUpload
          }).progress(function(evt) {
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data) {
            deferred.resolve(data);
            console.log("Success", data);
          }).catch(function(err) {
            fnShowAlert(err.config);
            deferred.reject();
          });
        }
      }).catch(function(err) {
        fnShowAlert(err.config);
        deferred.reject();
      });
      return deferred.promise;
    }
  };
  function fnShowAlert($__0) {
    var $__1 = $traceurRuntime.assertObject($__0),
        method = $__1.method,
        url = $__1.url;
    console.log("Err", method, url);
    var myAlert = $alert({
      title: "Error",
      content: method + " " + url,
      placement: 'top',
      type: 'danger',
      show: true
    });
  }
  return [activityFactory, activityMethods, myUpload];
});

"use strict";
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

"use strict";
angular.module('uiRouterSample').controller('campaignController', function($scope, $rootScope, $state, campaignFactory) {
  console.log("Welcome from campaign controller");
  $scope.availableCampaigns = [];
  var fetchAll = campaignFactory.getCampaigns();
  var displayResults = fetchAll.then(function(data) {
    console.log("Got...", data.data);
    $scope.availableCampaigns = data.data;
  });
});

"use strict";
angular.module('uiRouterSample').controller('campaignControllerDetails', function($scope, $rootScope, $state, campaignFactory, $alert, queryFactory, $modal, activityFactory, campaign) {
  $scope.campaignDetails = new Campaign(campaign.data);
  $scope.events = $scope.campaignDetails.events;
  $scope.eventSources = [];
  $scope.Print = ((function() {
    console.log($scope.campaignDetails);
  }));
  var editCampaign = $modal({
    scope: $scope,
    template: 'views/editCampaign.modal.html',
    show: false
  });
  $scope.editCampaign = function() {
    var edit = arguments[0] !== (void 0) ? arguments[0] : false;
    if (edit == true) {
      var cID = $scope.campaignDetails.CampaignID;
      campaignFactory.editCampaigns(cID, $scope.campaignDetails).then(function(data) {
        console.log("Success?", data);
        editCampaign.hide();
      }).catch(function(err) {
        console.error("Dude....", err);
      });
      return;
    }
    editCampaign.show();
  };
  $scope.modalSaveActivity = function() {
    var $__0 = $traceurRuntime.assertObject(activityFactory),
        activityModel = $__0[0],
        activityMethods = $__0[1];
    var activityModel = new NewActivity(activityModel);
    var cID = $scope.campaignDetails.CampaignID;
    activityMethods.saveActivity_and_then_do_Attachments(cID, activityModel).then(function(data) {
      console.log("Success?", data);
      addEvents(activityModel);
      activityModal.hide();
    }).catch(function(err) {});
  };
  $scope.deets;
  $scope.prospectsCollapsed = true;
  $scope.activitiesCollapsed = false;
  $scope.onClickTab = function(contact) {
    $scope.currentContact = contact;
  };
  $scope.isActiveTab = function(contact) {
    return contact == $scope.currentContact;
  };
  $scope.tableConfig = {
    itemsPerPage: 10,
    fillLastPage: false,
    maxPages: 5
  };
  $scope.campaignPending = false;
  $scope.DeleteProspect = function(id) {
    console.log("Not implemented");
  };
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  function addEvents($__0) {
    var $__1 = $traceurRuntime.assertObject($__0),
        Descr = $__1.Descr,
        StartDateTime = $__1.StartDateTime,
        CompletionDateTime = $__1.CompletionDateTime;
    $scope.events.push({
      title: Descr,
      start: StartDateTime,
      end: CompletionDateTime,
      allDay: true
    });
  }
  $scope.alertOnEventClick = function(event, allDay, jsEvent, view) {
    var match = $scope.campaignDetails.Activities.find((function(x) {
      return x.Descr == event.title;
    }));
    console.log(match);
    $scope.deets = match;
  };
  var dayClicked;
  $scope.dayClick = function(a, b, c, d) {
    dayClicked = moment(a).format("LL");
  };
  var activityModal = $modal({
    scope: $scope,
    template: 'views/add_activity.modal.html',
    show: false
  });
  $scope.dayDblClick = function(a, b, c, d) {
    var $__0 = $traceurRuntime.assertObject(activityFactory),
        activityModel = $__0[0],
        activityMethods = $__0[1];
    activityModel.StartDateTime = dayClicked;
    activityModal.show();
  };
  $scope.uiConfig = {calendar: {
      height: 450,
      editable: true,
      header: {
        left: 'title',
        center: '',
        right: 'today prev,next'
      },
      eventClick: $scope.alertOnEventClick,
      eventDblClick: $scope.onDayClick,
      dayClick: $scope.dayClick,
      dayDblClick: $scope.dayDblClick
    }};
  $scope.eventSources = [$scope.events];
  $scope.nextStatus = function(id) {
    var cID = $scope.campaignDetails.CampaignID;
    campaignFactory.editStatus(cID, 3);
  };
});

"use strict";
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
    },
    editCampaigns: function(cID, originalForm) {
      console.log("Edit campaigns", originalForm);
      var form = {};
      Object.assign(form, originalForm);
      delete form.Activities;
      delete form.Prospects;
      delete form.Attachments;
      delete form.BusinessOwners;
      return $http.put('http://10.1.1.118:8000/api/Campaign/' + cID, $.param(form));
    },
    editStatus: function(cID, status) {
      console.log(cID, status);
      return $http.put('http://10.1.1.118:8000/api/campaign/' + cID + '/status', $.param({"status": status}));
    }
  };
});

"use strict";
angular.module('uiRouterSample').controller('newCampaignController', function($scope, $rootScope, $state, $alert, campaignFactory, queryFactory, activityFactory) {
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
  $scope.convert = (function() {
    console.log("Converting...");
    var queryID = $scope.campaignDetails.QueryID;
    console.error(queryID);
    campaignFactory.convert(queryID).then((function(data) {
      console.log("DONE, campaign ID ", data.data.CampaignID);
      $scope.campaignID = data.data.CampaignID;
      $scope.campaignConverted = true;
    }));
  });
  $scope.userList = [];
  campaignFactory.getUsers().then((function(data) {
    console.log("Got all users....", data);
    $scope.userList = data.data.UserList;
  })).catch((function(err) {}));
  $scope.savedQueries = [];
  $scope.selectedQuery;
  campaignFactory.getQueries().then((function(data) {
    console.log("Got...", data);
    $scope.savedQueries = data.data;
  })).catch((function(err) {}));
  $scope.campaignDetails = {};
  $scope.campaignDetails.rows = [];
  $scope.setBillGroup = (function(data) {
    console.log("CHANGED", $scope.selectedQuery);
    campaignFactory.singleQuery($scope.selectedQuery.QueryID).then((function(data) {
      $scope.campaignDetails = new PendingCampaign(data.data);
      console.log($scope.campaignDetails);
      $scope.fetched = true;
    }));
  });
  if ($state.params.campaignID != "") {
    $scope.selectedQuery = {
      ProductID: 1,
      QueryID: $state.params.campaignID || 1,
      Name: "mo test"
    };
    $scope.setBillGroup();
  }
  $scope.changeState = (function(bleh) {
    $state.go('home.campaign.details', {params: '1337'});
  });
  $scope.newActivity = {};
  $scope.savedActivities = [];
  $scope.activityNo = 0;
  $scope.selectedUser;
  var activity_order = 1;
  $scope.saveActivity = (function() {
    var $__0 = $traceurRuntime.assertObject(activityFactory),
        activityModel = $__0[0],
        activityMethods = $__0[1];
    var activityModel = new NewActivity(activityModel);
    var cID = $scope.campaignID;
    activityMethods.saveActivity_and_then_do_Attachments(cID, activityModel).then((function(data) {
      data.Order = activity_order;
      activity_order++;
      console.log("Success?", data);
      $scope.savedActivities.push(data);
      $scope.savedActivities.sort(compareDates);
      if ($scope.savedActivities[$traceurRuntime.toProperty($scope.savedActivities.length - 1)] != data) {
        console.log("Whoa whoa, time mixup...");
        for (var i = 0; i < $scope.savedActivities.length; i++) {
          $scope.savedActivities[$traceurRuntime.toProperty(i)].Order = i + 1;
        }
        ;
      }
      $scope.activityNo++;
      $scope.newActivity = {};
    })).catch((function(err) {}));
  });
  function compareDates(a, b) {
    return moment(a.StartDateTime).isAfter(b.StartDateTime);
  }
});

"use strict";
var PendingCampaign = function PendingCampaign(obj) {
  var $__0 = this;
  Object.assign(this, obj);
  this.ParamStrUnpacked = '';
  var paramObj = $.deparam(obj.ParamStr);
  Object.keys(paramObj).forEach((function(key) {
    $__0.ParamStrUnpacked += key + " = " + paramObj[$traceurRuntime.toProperty(key)] + "; ";
  }));
};
($traceurRuntime.createClass)(PendingCampaign, {}, {});

"use strict";
var Activity2 = function Activity2(obj) {
  Object.assign(this, obj);
};
($traceurRuntime.createClass)(Activity2, {}, {});

"use strict";
var Campaign = function Campaign(obj) {
  Object.assign(this, obj);
  this.Activities = (function() {
    var $__1 = 0,
        $__2 = [];
    for (var $__4 = obj.Activities[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__5; !($__5 = $__4.next()).done; ) {
      try {
        throw undefined;
      } catch (x) {
        {
          x = $__5.value;
          $traceurRuntime.setProperty($__2, $__1++, new NewActivity(x));
        }
      }
    }
    return $__2;
  }());
  this.ProspectCount = obj.Prospects.length;
  this.ActivityCount = obj.Activities.length;
};
($traceurRuntime.createClass)(Campaign, {get events() {
    var $__3 = this;
    return (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__4 = $__3.Activities[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__5; !($__5 = $__4.next()).done; ) {
        try {
          throw undefined;
        } catch (CompletionDateTime) {
          try {
            throw undefined;
          } catch (StartDateTime) {
            try {
              throw undefined;
            } catch (Descr) {
              try {
                throw undefined;
              } catch ($__6) {
                {
                  {
                    $__6 = $traceurRuntime.assertObject($__5.value);
                    Descr = $__6.Descr;
                    StartDateTime = $__6.StartDateTime;
                    CompletionDateTime = $__6.CompletionDateTime;
                  }
                  $traceurRuntime.setProperty($__2, $__1++, {
                    title: Descr,
                    start: StartDateTime,
                    end: CompletionDateTime
                  });
                }
              }
            }
          }
        }
      }
      return $__2;
    }());
  }}, {});

"use strict";
var Customer = function Customer(obj) {
  Object.assign(this, obj);
  this.OrderingMethods = (function() {
    var $__1 = 0,
        $__2 = [];
    for (var $__3 = Object.keys({
      CrxSetup: obj.CrxSetup,
      CSOSSetup: obj.CSOSSetup,
      EWOMSetup: obj.EWOMSetup,
      PBAOSetup: obj.PBAOSetup
    })[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__4; !($__4 = $__3.next()).done; ) {
      try {
        throw undefined;
      } catch (x) {
        {
          x = $__4.value;
          if (obj[$traceurRuntime.toProperty(x)] == 0)
            $traceurRuntime.setProperty($__2, $__1++, x);
        }
      }
    }
    return $__2;
  }()).toString();
};
($traceurRuntime.createClass)(Customer, {}, {});

"use strict";
angular.module('uiRouterSample').controller('kimController', function($scope, $rootScope, $state, $alert, prospectFactory, $modal) {
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
  $scope.addContact = function() {
    var myModal = $modal({
      scope: $scope,
      template: 'views/add_contact.tpl.html',
      show: true
    });
  };
});

"use strict";
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
    "text": "Saved Campaigns",
    "click": '$state.go("home.campaign")'
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

"use strict";
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

"use strict";
angular.module('uiRouterSample').service('LoginService', function($cookies, $http, Privilege) {
  var User = function User(obj) {
    Object.assign(this, obj);
  };
  ($traceurRuntime.createClass)(User, {get user() {
      return this.userid;
    }}, {});
  var LoginService = {};
  LoginService.setUser = function(user) {
    LoginService.user = new User(user);
    Privilege.SetSession(user.key, this.user.user, this.user);
  };
  LoginService.cookie_user = function() {
    return $cookies.userid;
  };
  return LoginService;
});

"use strict";
angular.module('uiRouterSample').controller('loginController', function($scope, $state, Privilege, LoginService) {
  console.log("Controller loaded");
  $scope.creds = {};
  $scope.creds.userid = LoginService.cookie_user;
  $scope.loginSubmit = function() {
    Privilege.Login($scope.creds).then((function(data) {
      LoginService.setUser(data.data);
      $state.go("home");
    })).catch((function(err) {}));
  };
});

"use strict";
var assert = require("assert").assert;
angular.module('uiRouterSample').factory('Privilege', function($resource, $http, $q, $cookies) {
  console.log("Factory loaded");
  return {
    Login: function(creds) {
      console.log("POST DUDE", creds);
      delete $http.defaults.headers.common[$traceurRuntime.toProperty('XKey')];
      return $http({
        method: 'POST',
        url: 'http://10.1.1.118:8000/api/Auth',
        data: $.param(creds),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    Logout: function() {
      console.log("Todo");
    },
    SetSession: function(xkey, userid, pbauser) {
      assert.argumentTypes(xkey, $traceurRuntime.type.string, userid, $traceurRuntime.type.string, pbauser, $traceurRuntime.type.any);
      $cookies.xkey = xkey;
      $cookies.userid = userid;
      $traceurRuntime.setProperty($http.defaults.headers.common, 'XKey', xkey);
    }
  };
});

"use strict";
angular.module('uiRouterSample').factory('alertFactory', function($alert) {
  return {alerts: function(message) {
      console.log("Alert", message);
      var myAlert = $alert({
        title: message.config.url,
        content: message.statusText,
        placement: 'top',
        type: 'danger',
        show: true,
        keyboard: true,
        duration: 3
      });
    }};
});

"use strict";
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

"use strict";
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

"use strict";
angular.module('uiRouterSample').controller('navbarSearcher', function($scope, $rootScope, $state, $alert, prospectFactory) {
  console.log("Hello navbar");
  $scope.popover = {
    "title": "Title",
    "content": "Hello Popover<br />This is a multiline message!"
  };
  $scope.doodo = function() {
    console.log("Doo");
  };
  $scope.button = {
    "toggle": false,
    "checkbox": {
      "left": false,
      "middle": true,
      "right": false
    },
    "radio": 2
  };
  $scope.color = 'blue';
  $scope.specialValue = {
    "id": "12345",
    "value": "green"
  };
  $scope.popover = {
    "title": "Cocks",
    "content": "Hello Popover<br />This is a multiline message!"
  };
});

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

"use strict";
angular.module('SignalR', []).constant('$', $).factory('Hub', ['$', '$q', function($, $q) {
  var globalConnection = null;
  var initGlobalConnection = function(options) {
    if (options && options.rootPath) {
      globalConnection = $.hubConnection(options.rootPath, {userDefaultPath: false});
    } else {
      globalConnection = $.hubConnection();
    }
  };
  return function(hubName, options) {
    var Hub = this;
    if (globalConnection === null) {
      initGlobalConnection(options);
    }
    Hub.connection = globalConnection;
    Hub.proxy = Hub.connection.createHubProxy(hubName);
    Hub.on = function(event, fn) {
      Hub.proxy.on(event, fn);
    };
    Hub.invoke = function(method, args) {
      return Hub.proxy.invoke.apply(Hub.proxy, arguments);
    };
    Hub.disconnect = function() {
      Hub.connection.stop();
    };
    Hub.connect = function() {
      Hub.connection.start({transport: 'longPolling'});
    };
    if (options && options.listeners) {
      angular.forEach(options.listeners, function(fn, event) {
        Hub.on(event, fn);
      });
    }
    if (options && options.methods) {
      angular.forEach(options.methods, function(method) {
        $traceurRuntime.setProperty(Hub, method, function() {
          var args = $.makeArray(arguments);
          args.unshift(method);
          return Hub.invoke.apply(Hub, args);
        });
      });
    }
    if (options && options.queryParams) {
      Hub.connection.qs = options.queryParams;
    }
    Hub.init = function() {
      var deferred = $q.defer();
      Hub.connection.start().done(function(res) {
        console.log("Done", res);
        return deferred.resolve(res);
      }).fail(function(res) {
        console.log('Could not connect', Hub.connection);
        Hub.connection.start();
        return deferred.reject(res);
      });
      Hub.connection.disconnected(function() {
        console.log("Disconnected");
      });
      console.log("Not done, but not failed", Hub.connection);
      return deferred.promise;
    };
    return Hub;
  };
}]);

"use strict";
var Prospect = function Prospect(obj) {
  Object.assign(this, obj);
  this.Issues = (function() {
    var $__1 = 0,
        $__2 = [];
    for (var $__3 = obj.Issues[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__4; !($__4 = $__3.next()).done; ) {
      try {
        throw undefined;
      } catch (x) {
        {
          x = $__4.value;
          $traceurRuntime.setProperty($__2, $__1++, new Issue(x || {}));
        }
      }
    }
    return $__2;
  }());
  this.Activities = obj.Activities.map((function(C) {
    return new Activity(C || {});
  }));
  this.Contacts = obj.Contacts.map((function(C) {
    return new Contact(C || {});
  }));
  this.Customer = new Customer(obj.Customer || {});
  this.IssueCount = obj.Issues.length;
  this.ActivityCount = obj.Activities.length;
  this.ContactCount = obj.Contacts.length;
  this.CustomerType = "A";
};
($traceurRuntime.createClass)(Prospect, {}, {});
var Contact = function Contact(obj) {
  Object.assign(this, obj);
  this.Addr1 = this.Addr1 || '';
  this.Addr2 = this.Addr2 || '';
  this.City = this.City || '';
  this.ContactID = this.ContactID || '';
  this.Email = this.Email || '';
  this.Fax = this.Fax || '';
  this.Mobile = this.Mobile || '';
  this.Name = this.Name || '';
  this.Phone = this.Phone || '';
  this.State = this.State || '';
  this.Zip = this.Zip || '';
  this.Types = this.Types || [];
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
  Object.assign(this, obj);
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
    for (var $__3 = obj.Followups[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__4; !($__4 = $__3.next()).done; ) {
      try {
        throw undefined;
      } catch (x) {
        {
          x = $__4.value;
          $traceurRuntime.setProperty($__2, $__1++, new Followups(x || {}));
        }
      }
    }
    return $__2;
  }());
};
($traceurRuntime.createClass)(Issue, {}, {});
var Activity = function Activity(obj) {
  Object.assign(this, obj);
  this.issue = false;
  this.startHuman = moment(obj.CreationDateTime).format("LL");
  this.start = obj.CreationDateTime;
  this.content = "1 note";
  this.typeOf = "All Activities";
  this.year = parseInt(moment(obj.CreationDateTime).format("YYYY"));
  this.month = parseInt(moment(obj.CreationDateTime).format("MM"));
  this.day = parseInt(moment(obj.CreationDateTime).format("DDD"));
  this.smallDay = parseInt(moment(obj.CreationDateTime).format("DD"));
  this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY");
  this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY");
  this.Type_Human = (function() {
    var spread = Math.floor(Math.random() * (3 - 1)) + 1;
    if (spread == 1) {
      return "Phone";
    } else {
      return "Visit";
    }
  })();
  this.timebetween = "2 weeks";
};
($traceurRuntime.createClass)(Activity, {}, {});
var Followups = function Followups(obj) {
  Object.assign(this, obj);
  this.issue = false;
  this.startHuman = moment(obj.CreationDateTime).format("ll");
};
($traceurRuntime.createClass)(Followups, {}, {});
var AddEvent = function AddEvent(obj, info) {
  Object.assign(this, obj);
  this.Date = moment(this.Date).format("YYYY-MM-DD");
};
($traceurRuntime.createClass)(AddEvent, {}, {});
var AddIssue = function AddIssue(obj, info) {
  Object.assign(this, obj);
  this.CompletionDateTime = '1900-01-01';
  this.Status = 0;
  this.ProductID = 1;
};
($traceurRuntime.createClass)(AddIssue, {}, {});

"use strict";
angular.module('uiRouterSample').controller('prospectController', function($scope, $rootScope, $state, prospectFactory, $location, LoginService, $modal) {
  console.log("Hello prospect");
  $scope.details = {user: LoginService.user};
  $scope.contactCollapse = true;
  $scope.issueCollapse = true;
  $scope.AddEvent = {};
  $scope.AddContact = {};
  $scope.ContactKeys = [];
  $scope.the_Prospect;
  $scope.the_Prospect_edit = {};
  console.log($state.params);
  $scope.contactType = [{
    value: '1',
    label: 'Owner'
  }, {
    value: '2',
    label: 'In Charge'
  }, {
    value: '3',
    label: 'Gambler'
  }];
  $scope.selectedContactType = [];
  init();
  function init() {
    prospectFactory.getProspect_by_ID($state.params).then(function(data) {
      console.log("Got prospect", data);
      $scope.the_Prospect = new Prospect(data.data);
      $scope.the_Prospect.Activities.reverse();
      console.log($scope.the_Prospect);
      timeBetween();
      makeTimeline();
      $scope.currentContact = $scope.the_Prospect.Contacts[0];
      $scope.details.CampaignID = 0;
      $scope.details.CreationUser = "me";
      $scope.details.ProductID = 0;
      $scope.AddContact = new Contact({});
      delete $scope.AddContact.HumanTypes_;
      delete $scope.AddContact.OldTypes;
      $scope.ContactKeys = Object.keys($scope.AddContact);
    });
  }
  $scope.clearModel = function() {
    $scope.AddContact = new Contact({});
    delete $scope.AddContact.HumanTypes_;
    delete $scope.AddContact.OldTypes;
    $scope.editContactBool = false;
  };
  $scope.editContactBool = false;
  $scope.modalSaveContact = function(contact, modal) {
    console.log("Herp derp", contact);
    if (!contact.Types.length) {
      console.log("Must select a type");
      return;
    }
    if ($scope.editContactBool) {
      console.log("Do some edit http");
      prospectFactory.EditContact(contact).then(function() {
        modal.$hide();
      });
      return;
    }
    prospectFactory.AddContact(contact).then(function() {
      modal.$hide();
      $scope.the_Prospect.Contacts.push(new Contact(contact));
    });
  };
  $scope.editContact = function(contact) {
    console.log("edit", contact);
    $scope.AddContact = contact;
    $scope.editContactBool = true;
  };
  $scope.prospectEdit = function() {
    console.log("Editing prospect");
    $scope.the_Prospect_edit = Object.assign($scope.the_Prospect_edit, $scope.the_Prospect);
    delete $scope.the_Prospect_edit.Activities;
    delete $scope.the_Prospect_edit.Contacts;
    delete $scope.the_Prospect_edit.Customer;
    delete $scope.the_Prospect_edit.Issues;
  };
  $scope.editIssueBool = false;
  $scope.editEventBool = false;
  $scope.editEvent = function(evt) {
    console.log("herp", evt);
    if (evt.issue) {
      console.log("....issue...");
      $scope.AddIssue = new AddIssue(evt);
      var myModal = $modal({
        scope: $scope,
        template: '/src/js/prospect/add-issue.html',
        show: true
      });
      $scope.editIssueBool = true;
      return;
    } else {
      console.log("....note/event...");
      $scope.AddEvent = new AddEvent(evt);
      var myModal = $modal({
        scope: $scope,
        template: '/src/js/prospect/add-event.html',
        show: true
      });
      $scope.editEventBool = true;
    }
  };
  $scope.modalSaveProspect = function(evt, modal) {
    console.log("Saving prospect");
    prospectFactory.EditProspect(evt).then(function() {
      modal.$hide();
    });
  };
  $scope.modalSaveActivity = function(evt, modal) {
    var activity = new AddEvent(evt, $scope.details);
    if ($scope.editEventBool) {
      console.log("We're editing an event");
      prospectFactory.EditEvent(activity).then(function() {
        modal.$hide();
      });
      return;
    } else {
      prospectFactory.AddEvent(activity).then(function() {
        modal.$hide();
        $scope.the_Prospect.Activities.unshift(new Activity(evt));
      });
    }
  };
  $scope.modalSaveIssue = function(issue, modal) {
    var issue = new AddIssue(issue);
    if ($scope.editIssueBool) {
      console.log("Edit not save");
      prospectFactory.EditIssue(issue).then(function() {
        modal.$hide();
      });
      return;
    }
    prospectFactory.AddIssue(issue).then(function() {
      modal.$hide();
      $scope.the_Prospect.Issues.push(new Issue(issue));
    });
  };
  $scope.makeActive = function(contact) {
    console.log("Make active", contact);
  };
  $scope.scrolltoHref = function(id) {
    console.log(id);
    if (id == 'Details') {
      window.scrollBy(0, -5000);
    } else {
      $location.hash(id);
    }
  };
  $scope.currentPage = 1;
  var zoomcount = 3;
  $scope.currentContact;
  $scope.clickTab = 1;
  $scope.onClickTab = function(bool) {
    console.log(bool);
    $scope.clickTab = bool;
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
  function timeBetween() {
    var array = $scope.the_Prospect.Activities;
    if (array.length > 0) {
      for (var i = 0; i < array.length - 1; i++) {
        var arr = [];
        arr.push(array[$traceurRuntime.toProperty(i)].year);
        arr.push(array[$traceurRuntime.toProperty(i)].month);
        arr.push(array[$traceurRuntime.toProperty(i)].smallDay);
        var a = moment(arr);
        arr = [];
        arr.push(array[$traceurRuntime.toProperty(i + 1)].year);
        arr.push(array[$traceurRuntime.toProperty(i + 1)].month);
        arr.push(array[$traceurRuntime.toProperty(i + 1)].smallDay);
        var b = moment(arr);
        var diff = a.diff(b, 'days');
        $scope.the_Prospect.Activities[$traceurRuntime.toProperty(i + 1)].timebetween = diff + " days...";
        if (diff == 0) {
          $scope.the_Prospect.Activities[$traceurRuntime.toProperty(i + 1)].timebetween = "Same day";
        }
      }
      $scope.the_Prospect.Activities[0].timebetween = "";
    }
  }
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
      max: new Date(2014, moment().add('month', 2).format("M"), 1)
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

"use strict";
angular.module('uiRouterSample').factory('prospectFactory', function($http) {
  var prospectID;
  return {
    _request: function() {
      var method = arguments[0] !== (void 0) ? arguments[0] : 'get';
      var suffix = arguments[1] !== (void 0) ? arguments[1] : '';
      var data = arguments[2] !== (void 0) ? arguments[2] : null;
      return $http({
        method: method,
        url: ("http://10.1.1.118:8000/api/prospect/" + prospectID + "/" + suffix),
        data: data
      });
    },
    getProspect_by_ID: function(prospect) {
      prospectID = prospect.ProspectID;
      return this._request('get');
    },
    AddEvent: function(nEvent) {
      var nEvent = $.param(nEvent);
      return this._request('post', "Activity", nEvent);
    },
    EditEvent: function(myEvent) {
      delete myEvent.subnotes;
      var myEvent = $.param(myEvent);
      return this._request('put', "Activity", myEvent);
    },
    AddContact: function(contact) {
      var contact = $.param(contact);
      return this._request('post', "Contact", contact);
    },
    EditContact: function(contact) {
      var contactID = contact.ContactID;
      var contact = $.param(contact);
      return this._request('put', ("Contact/" + contactID), contact);
    },
    AddIssue: function(issue) {
      var issue = $.param(issue);
      return this._request('post', "Issue", issue);
    },
    EditIssue: function(issue) {
      console.log("issue", issue);
      var issueID = issue.IssueID;
      var issue = $.param(issue);
      return this._request('put', ("Issue/" + issueID), issue);
    },
    EditProspect: function(prospect) {
      for (var key in prospect) {
        if (prospect[$traceurRuntime.toProperty(key)] == '' || prospect[$traceurRuntime.toProperty(key)] == undefined) {
          $traceurRuntime.setProperty(prospect, key, " ");
        }
      }
      var prospect = $.param(prospect);
      return this._request('put', '', prospect);
    }
  };
});

"use strict";
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
    value: 'CA',
    label: 'California'
  }];
  $scope.queryParams = {State: []};
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
    $scope.queryParams.ProductID = 1;
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
    queryFactory.updateQueryName($scope.QueryID).then((function(data) {
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
      console.log("Update");
      $scope.whoa();
      return;
    } else {
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
    }
  };
  $scope.goHref = function(ev) {
    console.log(ev);
    ev.stopPropagation();
    ev.preventDefault();
  };
  if ($stateParams.State != null) {
    $scope.selectedStates = [$stateParams.State];
    $scope.querySearch();
  }
});

"use strict";
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

"use strict";
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

"use strict";
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

"use strict";

"use strict";
angular.module('uiRouterSample').controller('searchController', function($scope, $rootScope, $state, $alert, searchFactory, $timeout, $location) {
  console.log("Hello search");
  document.getElementById("searchbox").focus();
  $scope.paramsObj = {ProspectID: ''};
  $scope.prospectType = [{
    value: 'P',
    label: 'Prospect'
  }, {
    value: 'A',
    label: 'Active'
  }, {
    value: 'F',
    label: 'Former'
  }];
  $scope.selectedProspectType = $scope.prospectType.map((function(type) {
    return type.value;
  }));
  $scope.customerType = [{
    value: 'P',
    label: 'ProfitGuard'
  }, {
    value: 'N',
    label: 'Negotiator'
  }, {
    value: 'S',
    label: 'Services Only'
  }, {
    value: 'G',
    label: 'Government'
  }];
  $scope.selectedCustomerType = $scope.customerType.map((function(type) {
    return type.value;
  }));
  $scope.BDMs = ['BDM01', 'BDM02', 'BDM03', 'BDM04'];
  $scope.selectedBDM = (function() {
    var $__0 = 0,
        $__1 = [];
    for (var $__2 = $scope.BDMs[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__3; !($__3 = $__2.next()).done; ) {
      try {
        throw undefined;
      } catch (x) {
        {
          x = $__3.value;
          $traceurRuntime.setProperty($__1, $__0++, x);
        }
      }
    }
    return $__1;
  }());
  var stateParams = $state.params;
  Object.keys(stateParams).forEach((function(key) {
    if (!stateParams[$traceurRuntime.toProperty(key)]) {
      delete stateParams[$traceurRuntime.toProperty(key)];
    }
  }));
  console.log("Got", stateParams);
  if (Object.keys(stateParams).length) {
    console.log("There's params, guys!!!");
    searchFactory.search(stateParams).then((function(res) {
      console.log(res.data);
      $scope.searchResults = [];
      if (res.data.length > 0) {
        $scope.emptyResults = false;
        $scope.searchResults = res.data.map((function(searchResult) {
          return new Prospect(searchResult);
        }));
      } else {
        $scope.emptyResults = true;
        console.log("No data");
      }
      console.log($scope.searchResults);
    }));
  } else {
    console.log("No state params present");
  }
  $scope.config = {
    itemsPerPage: 10,
    fillLastPage: false
  };
  $scope.searchResults = [];
  $scope.emptyResults = false;
  $scope.searchString = '';
  $scope.startSearch = function() {
    console.log("Start?", $scope.paramsObj);
    Object.keys($scope.paramsObj).forEach((function(key) {
      $traceurRuntime.setProperty($scope.paramsObj, key, $scope.searchString);
    }));
    $location.search($scope.paramsObj);
  };
  $scope.searchOptions = ['ProspectID', 'CustID', 'NCPDP', 'NPI'];
  $scope.item = $scope.searchOptions[0];
  $scope.searchSet = function() {
    document.getElementById("searchbox").focus();
    Object.keys($scope.paramsObj).forEach((function(key) {
      delete $scope.paramsObj[$traceurRuntime.toProperty(key)];
    }));
    $traceurRuntime.setProperty($scope.paramsObj, $scope.item, '');
  };
  $scope.gotoProspect = function(prospectID) {
    $state.go('home.prospect', {ProspectID: prospectID});
  };
  $scope.CityStateZip_string;
  $scope.fnCityStateZip = function() {
    var array = [];
    $scope.CityStateZip_string.split(',').forEach((function(word) {
      array.push($.trim(word));
    }));
    console.log(array);
    var noSpaces = [];
    array.forEach((function(word) {
      noSpaces.push(word.split(' '));
    }));
    var zip = "";
    array.forEach((function(part) {
      zip = extractZip(part);
    }));
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
    array.forEach((function(string) {
      if (string.length == 2)
        state = string;
    }));
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
      $location.search({
        'State': state,
        "ProspectType": $scope.selectedProspectType,
        "CustomerType": $scope.selectedCustomerType
      });
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

"use strict";
angular.module('uiRouterSample').factory('searchFactory', function($http, $location) {
  return {search: function(paramsObj) {
      var borrowedTime = window.location.hash.split("search")[1];
      return $http.get('http://10.1.1.118:8000/api/Prospect' + borrowedTime);
    }};
});

"use strict";

"use strict";
var assert = require("assert").assert;
angular.module('uiRouterSample').service('TaskService', function(LoginService, taskFactory) {
  var Task = function Task(obj) {
    Object.assign(this, obj);
    this.DueDate = moment(obj.CompletionDateTime).format("ll");
  };
  ($traceurRuntime.createClass)(Task, {}, {});
  var TaskList = function TaskList() {
    for (var args = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      $traceurRuntime.setProperty(args, $__2, arguments[$traceurRuntime.toProperty($__2)]);
    $traceurRuntime.superCall(this, $TaskList.prototype, "constructor", $traceurRuntime.spread(args));
  };
  var $TaskList = TaskList;
  ($traceurRuntime.createClass)(TaskList, {
    add: function(array) {
      while (this.length) {
        this.pop();
      }
      for (var i = 0; i < array.length; i++) {
        this.push(new Task(array[$traceurRuntime.toProperty(i)]));
      }
    },
    remove: function(activityID) {
      this.splice(this.map((function(tasks) {
        return tasks.ActivityID;
      })).indexOf(activityID), 1);
    },
    update: function(ActivityID, Status) {
      this[$traceurRuntime.toProperty(this.map((function(tasks) {
        return tasks.ActivityID;
      })).indexOf(ActivityID))].Status = Status;
    },
    push: function() {
      for (var args = [],
          $__3 = 0; $__3 < arguments.length; $__3++)
        $traceurRuntime.setProperty(args, $__3, arguments[$traceurRuntime.toProperty($__3)]);
      for (var i = 0; i < args.length; i++) {
        var duplicate = false;
        for (var ii = 0; ii < this.length; ii++) {
          if (args[$traceurRuntime.toProperty(i)].ActivityID == this[$traceurRuntime.toProperty(ii)].ActivityID) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          this.unshift(new Task(args[$traceurRuntime.toProperty(i)]));
        }
      }
    }
  }, {}, Array);
  TaskList.prototype.update.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.number]];
  var UserList = function UserList() {
    for (var args = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      $traceurRuntime.setProperty(args, $__4, arguments[$traceurRuntime.toProperty($__4)]);
    $traceurRuntime.superCall(this, $UserList.prototype, "constructor", $traceurRuntime.spread(args));
  };
  var $UserList = UserList;
  ($traceurRuntime.createClass)(UserList, {
    push: function() {
      for (var args = [],
          $__5 = 0; $__5 < arguments.length; $__5++)
        $traceurRuntime.setProperty(args, $__5, arguments[$traceurRuntime.toProperty($__5)]);
      for (var i = 0; i < args.length; i++) {
        var duplicate = false;
        for (var ii = 0; ii < this.length; ii++) {
          if (args[$traceurRuntime.toProperty(i)].UserID == this[$traceurRuntime.toProperty(ii)].UserID) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          this.unshift(new User(args[$traceurRuntime.toProperty(i)]));
        }
      }
    },
    remove: function(UserID) {
      if (LoginService.cookie_user() == UserID) {
        return;
      }
      this.splice(this.map((function(user) {
        return user.UserID;
      })).indexOf(UserID), 1);
    }
  }, {}, Array);
  var User = function User(obj) {
    Object.assign(this, obj);
    this.Task = "blank";
  };
  ($traceurRuntime.createClass)(User, {}, {});
  var TaskService = function TaskService(obj) {
    this.TaskList = new TaskList();
    this.UserList = new UserList();
    this.Departments = [];
    this.Groups = {};
  };
  ($traceurRuntime.createClass)(TaskService, {FindUser: function(UserID) {
      var match = {};
      for (var key in this.Groups) {
        var self = this;
        this.Groups[$traceurRuntime.toProperty(key)].forEach(function(role) {
          var idx = self.Groups[$traceurRuntime.toProperty(key)].map((function(user) {
            return user.UserID;
          })).indexOf(UserID);
          if (idx != -1) {
            match = self.Groups[$traceurRuntime.toProperty(key)][$traceurRuntime.toProperty(idx)];
          }
        });
      }
      return assert.returnType((match), Object);
    }}, {});
  TaskService.prototype.FindUser.parameters = [[$traceurRuntime.type.number]];
  var taskService = new TaskService();
  taskFactory.getUsers().then(function(users) {
    var $__6;
    ($__6 = taskService.Departments).push.apply($__6, $traceurRuntime.spread(_.chain(users.data.UserList).pluck('Department').uniq().value()));
    var groups = _.groupBy(users.data.UserList, "Department");
    for (var key in groups) {
      $traceurRuntime.setProperty(taskService.Groups, key, groups[$traceurRuntime.toProperty(key)]);
      taskService.Groups[$traceurRuntime.toProperty(key)].forEach((function(x) {
        return x.online = false;
      }));
      taskService.Groups[$traceurRuntime.toProperty(key)].forEach((function(x) {
        return x.img = psuedoRandom();
      }));
    }
  });
  function psuedoRandom() {
    var lastResult = 1;
    var count = 1;
    var result = 1;
    if (count < 3) {
      result = Math.floor(Math.random() * (4 - lastResult) + count);
      lastResult = result;
      count++;
    } else {
      count = 0;
      var result = Math.floor(Math.random() * (4 - lastResult) + lastResult);
      lastResult = result;
    }
    return result;
  }
  return taskService;
});

"use strict";
angular.module('uiRouterSample').directive('tasks', function() {
  return {
    restrict: 'EA',
    scope: {title: '@'},
    templateUrl: 'src/js/tasks/tasks.tmpl.html',
    link: function($scope, element, attrs) {}
  };
});

"use strict";
angular.module('uiRouterSample').factory('hubFactory', function($rootScope, Hub, $q, TaskService) {
  var hub = new Hub('activityQueueHub', {
    listeners: {
      'taskWorking': function(info) {
        console.log("a task status was changed....", info);
        var task = TaskService.TaskList.find((function(x) {
          return x.ActivityID == info.ActivityID;
        }));
        task.Status = info.Status;
        TaskService.FindUser(info.UserID).Task = task;
        $rootScope.$apply();
      },
      'userJoined': function(user) {
        console.log("User joined", user);
        TaskService.UserList.push(user);
        $rootScope.$apply();
      },
      'userLeft': function(user) {
        console.log("User left", user);
        TaskService.UserList.remove(user.UserID);
        $rootScope.$apply();
      }
    },
    rootPath: "http://10.1.1.118:8000/signalr",
    methods: ['GetTasks', 'changeTaskStatusD', 'WhoAmI', 'ChangeTaskStatus', 'TimeUntilNextFill']
  });
  var TimeUntilNextFill = function() {
    var def = $q.defer();
    console.log("get time until next fill");
    hub.TimeUntilNextFill().then(function(data) {
      console.log("res", data);
      def.resolve(data);
    });
    return def.promise;
  };
  var deferred = $q.defer();
  hub.init().then(function(res) {
    if (res._subscribedToHubs) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  });
  var getCurrent = function() {
    var def = $q.defer();
    console.log("get current");
    hub.hello_Im_Connected(shapeModel).then(function(data) {
      def.resolve();
    });
    return def.promise;
  };
  var getUser = function() {
    var def = $q.defer();
    console.log("get WhoAmI");
    hub.WhoAmI("pbajoj").then(function(users) {
      var $__0;
      ($__0 = TaskService.UserList).push.apply($__0, $traceurRuntime.spread(users));
      users.forEach(function(user) {
        TaskService.FindUser(user.UserID).online = true;
      });
      $rootScope.$apply();
      def.resolve();
    });
    return def.promise;
  };
  var ChangeTaskStatus = function(activityID, status) {
    var def = $q.defer();
    hub.ChangeTaskStatus(activityID, status).then(function(data) {
      console.log("Done changing status");
      def.resolve();
    });
    return def.promise;
  };
  var GetTasks = function() {
    console.log("Getting tasks");
    var def = $q.defer();
    hub.GetTasks().then(function(data) {
      def.resolve(data);
    });
    return def.promise;
  };
  return [{
    map: getCurrent,
    WhoAmI: getUser,
    GetTasks: GetTasks,
    ChangeTaskStatus: ChangeTaskStatus,
    TimeUntilNextFill: TimeUntilNextFill
  }, deferred.promise];
});

"use strict";
var assert = require("assert").assert;
angular.module('uiRouterSample').controller('taskController', function($scope, TaskService, $state, hubFactory, $interval, $compile) {
  console.log("Task Controller loaded");
  $scope.time;
  $scope.tasks = TaskService.TaskList;
  $scope.users = TaskService.UserList;
  $scope.departments = TaskService.Departments;
  $scope.depCollapseOnline = false;
  $scope.depCollapse = true;
  $scope.groups = TaskService.Groups;
  $scope.config = {
    itemsPerPage: 5,
    fillLastPage: false
  };
  var $__1 = $traceurRuntime.assertObject(hubFactory),
      methods = $__1[0],
      init = $__1[1];
  init.then(function() {
    console.log("Double done");
    methods.WhoAmI().then(function() {
      console.log("told server who we are");
      methods.GetTasks().then(function(tasks) {
        var $__2;
        console.log("Got tasks", tasks);
        ($__2 = $scope.tasks).push.apply($__2, $traceurRuntime.spread(tasks));
        methods.TimeUntilNextFill().then(function(time) {
          console.log("Got time", time);
          $scope.time = time.toString();
          $("#cranked").append('<timer end-time="time">{{hours}} hours, {{minutes}} minutes, {{seconds}} seconds.</timer>');
          $compile($("#cranked"))($scope);
        });
      });
    });
  }).catch(function() {
    console.log("Fudge");
  });
  $scope.showTasks = false;
  $scope.popTasks = function() {
    $scope.showTasks = !$scope.showTasks ? true : false;
  };
  $scope.showUsers = false;
  $scope.popUsers = function() {
    console.log("Show users");
    $scope.showUsers = !$scope.showUsers ? true : false;
  };
  $scope.showTaskOptions = false;
  $scope.prospectID;
  $scope.navigate = function(prospectID, Status) {
    assert.argumentTypes(prospectID, $traceurRuntime.type.number, Status, $traceurRuntime.type.number);
    if (Status > 0) {
      console.log("No go, it's being worked already");
      return;
    }
    $scope.showTaskOptions = true;
    $scope.prospectID = prospectID;
    $state.go('home.prospect', {ProspectID: prospectID});
  };
  $scope.ChangeTaskStatus = function(activityID, status) {
    console.log("activity id", activityID, "status", status);
    if (status == 0) {
      status++;
    } else {
      status--;
    }
    methods.ChangeTaskStatus(activityID, status);
  };
  $scope.userMethod = function(user) {
    console.log("user", user);
  };
  var stop = $interval(function() {
    if (moment($scope.time).isBefore(moment(new Date))) {
      methods.GetTasks().then(function(tasks) {
        var $__2;
        console.log("Got", tasks);
        ($__2 = $scope.tasks).push.apply($__2, $traceurRuntime.spread(tasks));
        methods.TimeUntilNextFill().then(function(time) {
          console.log("Got time", time);
          $scope.time = time.toString();
          $("#cranked").empty();
          $("#cranked").append('<timer end-time="time">{{hours}} hours, {{minutes}} minutes, {{seconds}} seconds.</timer>');
          $compile($("#cranked"))($scope);
        });
      });
    }
  }, 10000);
  $scope.stopFight = function() {
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  };
  $scope.$on('$destroy', function() {
    $scope.stopFight();
  });
});

"use strict";
angular.module('uiRouterSample').factory('taskFactory', function($http) {
  return {getUsers: function() {
      return $http.get('http://10.1.1.118:8000/api/users');
    }};
});

"use strict";
var $html = angular.element(document.getElementsByTagName('html')[0]);
angular.element().ready(function() {
  angular.resumeBootstrap([app[$traceurRuntime.toProperty('name')]]);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2FwcC5qcyIsImpzL2VzNi5qcyIsImpzL2Fib3V0L2NvbnRyb2xsZXIuanMiLCJqcy9hYm91dC9kaXJlY3RpdmUuanMiLCJqcy9hYm91dC9mYWN0b3J5LmpzIiwianMvYWN0aXZpdHkvYWN0aXZpdHlDbGFzcy5qcyIsImpzL2FjdGl2aXR5L2FjdGl2aXR5Q29udHJvbGxlci5qcyIsImpzL2FjdGl2aXR5L2ZhY3RvcnkuanMiLCJqcy9hZG1pbi9hZG1pbkNvbnRyb2xsZXIuanMiLCJqcy9jYW1wYWlnbi9jYW1wYWlnbkNvbnRyb2xsZXIuanMiLCJqcy9jYW1wYWlnbi9jYW1wYWlnbkRldGFpbHNDb250cm9sbGVyLmpzIiwianMvY2FtcGFpZ24vY2FtcGFpZ25GYWN0b3J5LmpzIiwianMvY2FtcGFpZ24vbmV3Q2FtcGFpZ25Db250cm9sbGVyLmpzIiwianMvY2xhc3Nlcy9QZW5kaW5nQ2FtcGFpZ24uanMiLCJqcy9jbGFzc2VzL2FjdGl2aXRpZXMuanMiLCJqcy9jbGFzc2VzL2NhbXBhaWduLmpzIiwianMvY2xhc3Nlcy9jdXN0b21lci5qcyIsImpzL2tpbS9raW1Db250cm9sbGVyLmpzIiwianMvbGFuZGluZy9sYW5kaW5nQ29udHJvbGxlci5qcyIsImpzL2xhbmRpbmcvbGFuZGluZ0ZhY3RvcnkuanMiLCJqcy9sb2dpbi9Mb2dpblNlcnZpY2UuanMiLCJqcy9sb2dpbi9sb2dpbkNvbnRyb2xsZXIuanMiLCJqcy9sb2dpbi9sb2dpbkZhY3RvcnkuanMiLCJqcy9taXNjL2FsZXJ0Q29udHJvbGxlci5qcyIsImpzL21pc2MvY29sbGFwc2UuanMiLCJqcy9taXNjL2ZpbHRlci5qcyIsImpzL21pc2MvbmF2YmFyX3NlYXJjaC5qcyIsImpzL21pc2MvcGFnaW5hdGUuanMiLCJqcy9taXNjL3NpZ25hbHIuanMiLCJqcy9wcm9zcGVjdC9wcm9zcGVjdENsYXNzLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RDb250cm9sbGVyLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RGYWN0b3J5LmpzIiwianMvcXVlcnkvcXVlcnlDb250cm9sbGVyLmpzIiwianMvcXVlcnkvcXVlcnlGYWN0b3J5LmpzIiwianMvcm9sZXMvcm9sZUZhY3RvcnkuanMiLCJqcy9yb2xlcy9yb2xlc0NvbnRyb2xsZXIuanMiLCJqcy9zYW1wbGVzb2NrZXQvb25lLmpzIiwianMvc2VhcmNoL3NlYXJjaENvbnRyb2xsZXIuanMiLCJqcy9zZWFyY2gvc2VhcmNoRmFjdG9yeS5qcyIsImpzL3Rhc2tzL1Rhc2tDbGFzcy5qcyIsImpzL3Rhc2tzL1Rhc2tTZXJ2aWNlLmpzIiwianMvdGFza3MvZGlyZWN0aXZlcy5qcyIsImpzL3Rhc2tzL2h1YkZhY3RvcnkuanMiLCJqcy90YXNrcy90YXNrQ29udHJvbGxlci5qcyIsImpzL3Rhc2tzL3Rhc2tGYWN0b3J5LmpzIiwianMveC94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnbmdBbmltYXRlJyxcbiAgICAvLyAnbmdNb2NrRTJFJyxcbiAgICAnbmdSZXNvdXJjZScsXG4gICAgJ25nQ29va2llcycsXG4gICAgJ21nY3JlYS5uZ1N0cmFwJyxcbiAgICAnbmdTYW5pdGl6ZScsXG4gICAgJ2NoaWVmZmFuY3lwYW50cy5sb2FkaW5nQmFyJyxcbiAgICAnYW5ndWxhci10YWJsZScsXG4gICAgJ25nVGFnc0lucHV0JyxcbiAgICAneGVkaXRhYmxlJyxcbiAgICAndWkuY2FsZW5kYXInLFxuICAgICdhbmd1bGFyRmlsZVVwbG9hZCcsXG4gICAgJ1NpZ25hbFInLFxuICAgICd0aW1lcidcbl0pXG5cbi5ydW4oXG4gICAgWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnJGNvb2tpZXMnLCBcIiRodHRwXCIsICdMb2dpblNlcnZpY2UnLFxuICAgICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZXMsICRodHRwLCBMb2dpblNlcnZpY2UpIHtcblxuXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWEtleSddID0gJGNvb2tpZXMueGtleTtcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucHV0ID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucG9zdCA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy50aW1lb3V0ID0gMTA7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJHN0YXRlUGFyYW1zID0gJHN0YXRlUGFyYW1zO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIGdyb3VwOiBcIlVuZGVmaW5lZFwiLFxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAkY29va2llcy51c2VyaWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBpZiAoJGNvb2tpZXMucGJhdXNlcikge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwidXNlclwiLCAkY29va2llcy5wYmF1c2VyKVxuICAgICAgICAgICAgLy8gICAgIExvZ2luU2VydmljZS5zZXRVc2VyKCRjb29raWVzLnBiYXVzZXIpXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cbiAgICBdXG4pXG5cblxuLmNvbmZpZyhcbiAgICBbJyRzdGF0ZVByb3ZpZGVyJywgJyRwcm92aWRlJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckaHR0cFByb3ZpZGVyJyxcbiAgICAgICAgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICRwcm92aWRlLCAkdXJsUm91dGVyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vICAgIEF1dGggSW50ZXJjZXB0b3IgICAgIC8vXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAkcHJvdmlkZS5mYWN0b3J5KCdteUh0dHBJbnRlcmNlcHRvcicsIGZ1bmN0aW9uKCRxLCAkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyBvbiBzdWNjZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgb24gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVzcG9uc2UgaW50ZXJjZXB0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5qZWN0b3IuZ2V0KCckc3RhdGUnKS50cmFuc2l0aW9uVG8oJ2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQoJ2FsZXJ0RmFjdG9yeScpLmFsZXJ0cyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHByb3ZpZGUuZmFjdG9yeSgndGltZW91dEh0dHBJbnRlcmNlcHQnLCBmdW5jdGlvbigkcSwgJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICdyZXF1ZXN0JzogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcudGltZW91dCA9IDMwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdteUh0dHBJbnRlcmNlcHRvcicpO1xuICAgICAgICAgICAgLy8gJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgndGltZW91dEh0dHBJbnRlcmNlcHQnKTtcblxuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gUmVkaXJlY3RzIGFuZCBPdGhlcndpc2UgLy9cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vIFVzZSAkdXJsUm91dGVyUHJvdmlkZXIgdG8gY29uZmlndXJlIGFueSByZWRpcmVjdHMgKHdoZW4pIGFuZCBpbnZhbGlkIHVybHMgKG90aGVyd2lzZSkuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcblxuICAgICAgICAgICAgLy8gVGhlIGB3aGVuYCBtZXRob2Qgc2F5cyBpZiB0aGUgdXJsIGlzIGV2ZXIgdGhlIDFzdCBwYXJhbSwgdGhlbiByZWRpcmVjdCB0byB0aGUgMm5kIHBhcmFtXG4gICAgICAgICAgICAvLyBIZXJlIHdlIGFyZSBqdXN0IHNldHRpbmcgdXAgc29tZSBjb252ZW5pZW5jZSB1cmxzLlxuICAgICAgICAgICAgLndoZW4oJy9jP2lkJywgJy9jb250YWN0cy86aWQnKVxuICAgICAgICAgICAgICAgIC53aGVuKCcvdXNlci86aWQnLCAnL2NvbnRhY3RzLzppZCcpXG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB1cmwgaXMgZXZlciBpbnZhbGlkLCBlLmcuICcvYXNkZicsIHRoZW4gcmVkaXJlY3QgdG8gJy8nIGFrYSB0aGUgaG9tZSBzdGF0ZVxuICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBTdGF0ZSBDb25maWd1cmF0aW9ucyAvL1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLy8gVXNlICRzdGF0ZVByb3ZpZGVyIHRvIGNvbmZpZ3VyZSB5b3VyIHN0YXRlcy5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL0xvZ2luLmh0bWwnXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBIb21lIC8vXG4gICAgICAgICAgICAvLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC5zdGF0ZShcImhvbWVcIiwge1xuXG4gICAgICAgICAgICAgICAgLy8gVXNlIGEgdXJsIG9mIFwiL1wiIHRvIHNldCBhIHN0YXRlcyBhcyB0aGUgXCJpbmRleFwiLlxuICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXG5cbiAgICAgICAgICAgICAgICAvLyBjb250cm9sbGVyOiAnbGFuZGluZ0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIC8vIHRlbXBsYXRlVXJsOiAndmlld3Mvbm90c3VyZS5odG1sJ1xuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU28gdGhpcyBvbmUgaXMgdGFyZ2V0aW5nIHRoZSB1bm5hbWVkIHZpZXcgd2l0aGluIHRoZSBwYXJlbnQgc3RhdGUncyB0ZW1wbGF0ZS5cbiAgICAgICAgICAgICAgICAgICAgJyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvbm90c3VyZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdsYW5kaW5nQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG9uZSBpcyB0YXJnZXRpbmcgdGhlIHVpLXZpZXc9XCJoaW50XCIgd2l0aGluIHRoZSB1bm5hbWVkIHJvb3QsIGFrYSBpbmRleC5odG1sLlxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3dzIG9mZiBob3cgeW91IGNvdWxkIHBvcHVsYXRlICphbnkqIHZpZXcgd2l0aGluICphbnkqIGFuY2VzdG9yIHN0YXRlLlxuICAgICAgICAgICAgICAgICAgICAnY29udGVudEBob21lJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9sYW5kaW5nLmh0bWwnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICd0YXNrYmFyQGhvbWUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Rhc2tiYXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAndGFza0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBBYm91dCAvL1xuICAgICAgICAgICAgLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLmFib3V0Jywge1xuICAgICAgICAgICAgICAgIHVybDogJ2Fib3V0JyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvYWJvdXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImFib3V0Q29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTaG93aW5nIG9mZiBob3cgeW91IGNvdWxkIHJldHVybiBhIHByb21pc2UgZnJvbSB0ZW1wbGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLy8gdGVtcGxhdGVQcm92aWRlcjogWyckdGltZW91dCcsXG4gICAgICAgICAgICAgICAgLy8gICBmdW5jdGlvbiAoICAgICAgICAkdGltZW91dCkge1xuICAgICAgICAgICAgICAgIC8vICAgICByZXR1cm4gJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgIHJldHVybiAnPHAgY2xhc3M9XCJsZWFkXCI+VUktUm91dGVyIFJlc291cmNlczwvcD48dWw+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgJzxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyL3RyZWUvbWFzdGVyL3NhbXBsZVwiPlNvdXJjZSBmb3IgdGhpcyBTYW1wbGU8L2E+PC9saT4nICtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcIj5HaXRodWIgTWFpbiBQYWdlPC9hPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgJzxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyI3F1aWNrLXN0YXJ0XCI+UXVpY2sgU3RhcnQ8L2E+PC9saT4nICtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXIvd2lraVwiPkluLURlcHRoIEd1aWRlPC9hPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgJzxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyL3dpa2kvUXVpY2stUmVmZXJlbmNlXCI+QVBJIFJlZmVyZW5jZTwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAnPC91bD4nO1xuICAgICAgICAgICAgICAgIC8vICAgICB9LCAxMDApO1xuICAgICAgICAgICAgICAgIC8vICAgfV1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5xdWVyeScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdxdWVyeS9uZXcvP1N0YXRlJkFnZSZQcm9kdWN0JkRpc3RhbmNlJyxcbiAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL1Jlc2VhcmNoLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJxdWVyeUNvbnRyb2xsZXJcIixcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIC5zdGF0ZSgnaG9tZS5xdWVyeS5yZXN1bHRzJywge1xuICAgICAgICAgICAgLy8gICB1cmw6ICcvcmVzdWx0cy8/bXlQYXJhbTEmbXlQYXJhbTInXG4gICAgICAgICAgICAvLyB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuY2FtcGFpZ24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnQ2FtcGFpZ25zJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2FtcGFpZ25zLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJjYW1wYWlnbkNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLmNhbXBhaWduLm5ldycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvbmV3LzpjYW1wYWlnbklEJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudEBob21lJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jYW1wYWlnbi1jb252ZXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJuZXdDYW1wYWlnbkNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLmNhbXBhaWduLmRldGFpbHMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2RldGFpbHMvOmNhbXBhaWduSUQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY2FtcGFpZ25GYWN0b3J5OiAnY2FtcGFpZ25GYWN0b3J5JyxcbiAgICAgICAgICAgICAgICAgICAgY2FtcGFpZ246IGZ1bmN0aW9uKGNhbXBhaWduRmFjdG9yeSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FtcGFpZ25GYWN0b3J5LnNpbmdsZUNhbXBhaWduKCRzdGF0ZVBhcmFtcy5jYW1wYWlnbklEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAaG9tZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2FtcGFpZ24tZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiY2FtcGFpZ25Db250cm9sbGVyRGV0YWlsc1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUudGFza3MnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnVGFza3MvOnRhc2tJRCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Rhc2tzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJ0YXNrQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gJ3Rhc2tzJzp7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90YXNrcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBjb250cm9sbGVyOiBcInRhc2tDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5hZG1pbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdhZG1pbi8nLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9hZG1pbi5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRtaW5Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS50aW1lbGluZScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICd0aW1lbGluZS8nLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90aW1lbGluZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidGltZWxpbmVDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5yb2xlcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdyb2xlcy8nLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9yb2xlcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicm9sZXNDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5wcm9zcGVjdCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdQcm9zcGVjdC86UHJvc3BlY3RJRCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL1Byb3NwZWN0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJwcm9zcGVjdENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLmtpbScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdLaW0vOlByb3NwZWN0SUQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9LaW0uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImtpbUNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZWxvYWRPblNlYXJjaDogZmFsc2VcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5zZWFyY2gnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnc2VhcmNoP1Byb3NwZWN0SUQmQ3VzdElEJk5DUERQJk5QSSZaaXAmQ2l0eSZTdGF0ZSZQcm9zcGVjdFR5cGUmQ3VzdG9tZXJUeXBlJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvUHJvc3BlY3QtcXVlcnkuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInNlYXJjaENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gLnN0YXRlKCdob21lLnNlYXJjaC5yZXN1bHRzJywge1xuICAgICAgICAgICAgLy8gICB1cmw6ICcvcHJpb3JpdHknLFxuICAgICAgICAgICAgLy8gICB2aWV3czoge1xuICAgICAgICAgICAgLy8gICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgLy8gICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9zZWFyY2guaHRtbCcsXG4gICAgICAgICAgICAvLyAgICAgICBjb250cm9sbGVyOiBcInNlYXJjaENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgLy8gICB9LFxuICAgICAgICAgICAgLy8gICAnc2VhcmNoVmlldyc6IHtcbiAgICAgICAgICAgIC8vICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoLmh0bWwnLFxuICAgICAgICAgICAgLy8gICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvLyB9KVxuXG5cbiAgICAgICAgfVxuICAgIF1cbik7XG4iLCJmdW5jdGlvbiBjaGVja1Rlc3QoYWdlOiBudW1iZXIpIHtcbiAgICBjb25zb2xlLmxvZyhcIlBhc3NlZD8gXCIsIGFnZSlcbn1cbmNoZWNrVGVzdCgyMClcblxuLy8gdmFyIGN1c3RvbWVycyA9IFtdO1xuLy8gdmFyIGN1c3RvbWVyID0ge31cbi8vIGN1c3RvbWVyLmNpdHkgPSBcIlNlYXR0bGVcIlxuXG5cbi8vIGZvciAodmFyIGtleSBpbiBjdXN0b21lcikge1xuLy8gICAgIGNvbnNvbGUubG9nKGtleSlcbi8vIH1cblxuLy8gdmFyIGN1c3RvbWVyMiA9IHt9XG4vLyBjdXN0b21lcjIuY2l0eSA9IFwiS2Fuc2FzIENpdHlcIlxuLy8gY3VzdG9tZXJzLnB1c2goY3VzdG9tZXIpO1xuLy8gY3VzdG9tZXJzLnB1c2goY3VzdG9tZXIpO1xuLy8gY3VzdG9tZXJzLnB1c2goY3VzdG9tZXIyKTtcblxuLy8gdmFyIHJlc3VsdHMgPSBbXG4vLyAgICAgZm9yIChjIG9mIGN1c3RvbWVycylcbi8vICAgICAgICAgaWYgKGMuY2l0eSA9PSBcIlNlYXR0bGVcIikge1xuLy8gICAgICAgICAgICAgbmFtZTogYy5uYW1lLFxuLy8gICAgICAgICAgICAgYWdlOiBjLmFnZVxuLy8gICAgICAgICB9XG4vLyBdXG5cblxuXG4vLyB2YXIgZXZlbnMgPSBbMiwgNCwgNl07XG5cbi8vIHZhciBvZGRzID0gZXZlbnMubWFwKHYgPT4gdiArIDEpLmZpbHRlcih2ID0+IHYgPiAwKVxuXG4vLyBjb25zb2xlLmxvZyhcIm9kZHNcIiwgb2RkcylcblxuLy8gdmFyIGhlbGxvID0ge1xuLy8gICAgIGhlbGxvOiAnd29ybGQnLFxuLy8gICAgIGZvbzogJ2Jhcidcbi8vIH07XG4vLyB2YXIgcWF6ID0ge1xuLy8gICAgIGhlbGxvOiAnc3RldmllJyxcbi8vICAgICBmb286ICdiYXonXG4vLyB9XG5cbi8vIHZhciBteUFycmF5ID0gW107XG4vLyBteUFycmF5LnB1c2goaGVsbG8sIGhlbGxvLCBxYXopO1xuXG4vLyB2YXIgcG9zID0gbXlBcnJheS5tYXAodiA9PiB2LmhlbGxvKS5pbmRleE9mKCdzdGV2aWUnKTtcblxuLy8gY29uc29sZS5sb2coXCJwb3NpdGlvblwiLCBwb3MpXG5cbi8vIG15QXJyYXkuc3BsaWNlKG15QXJyYXkubWFwKHYgPT4gdi5oZWxsbykuaW5kZXhPZignc3RldmllJyksIDEpO1xuLy8gY29uc29sZS5sb2coXCJteUFycmF5XCIsIG15QXJyYXkpXG5cblxuLy8gdmFyIHRlc3RBcnJheSA9IFsxLCAyLCAzLCA0XVxuXG4vLyBjb25zb2xlLmxvZyhcInVoaGhcIilcblxuLy8gLy8gZnVuY3Rpb24gYXNzcnQoYXJyOkFycmF5KXtcbi8vIC8vICAgICBjb25zb2xlLmxvZyhcIkFycmF5XCIsIGFycilcbi8vIC8vIH1cblxuLy8gLy8gYXNzcnQoWzEsMiwzXSlcblxuLy8gZnVuY3Rpb24gdGltZW91dCgpIHtcbi8vICAgICB2YXIgbXMgPSBNYXRoLnJhbmRvbSgpICogKDUwMDAgLSAxMDAwKSArIDEwMDA7XG4vLyAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuLy8gfVxuXG5cbi8vIGFzeW5jXG5cbi8vIGZ1bmN0aW9uIGFzeW5jVmFsdWUodmFsdWUpIHtcbi8vICAgICBhd2FpdCB0aW1lb3V0KCk7XG4vLyAgICAgcmV0dXJuIHZhbHVlICogdmFsdWU7XG4vLyB9XG5cbi8vIGFzeW5jVmFsdWUoMikudGhlbigocmVzKSA9PiB7XG4vLyAgICAgLy8gY29uc29sZS5sb2coXCJyZXNcIiwgcmVzKVxuLy8gICAgIC8vIHZhciBkaWNrcyA9IHJlc1xuLy8gICAgIHJldHVybiByZXNcbi8vIH0pLnRoZW4oYXN5bmMoeCkgPT4ge1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKFwiU3RhcnRpbmcgbmV4dCByZXNcIiwgeCkgLy8geCA9IDRcbi8vICAgICB2YXIgeSA9IGF3YWl0IGFzeW5jVmFsdWUoeCkgLy8gSU8gb3IgZGIgdHJhbnNhY3Rpb247XG4vLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRG9uZSBhZnRlciByZXNcIiwgeSkgLy8geSA9IDE2XG4vLyAgICAgdmFyIHogPSBhd2FpdCBhc3luY1ZhbHVlKHkpIC8vIElPIG9yIGRiIHRyYW5zYWN0aW9uO1xuLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRvbmUgYWZ0ZXIgcmVzIDJcIiwgeikgLy8geiA9IDI1NlxuLy8gICAgICAgICAvLyByZXR1cm4geCAqIHg7XG4vLyB9KTtcblxuLy8gYXN5bmNcblxuLy8gZnVuY3Rpb24gbG9vcCh2YWwpIHtcbi8vICAgICB3aGlsZSAodmFsIDwgOTAwMCkge1xuLy8gICAgICAgICB2YWwgPSBhd2FpdCBhc3luY1ZhbHVlKHZhbClcbi8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJpdGVyYXRpb25cIiwgdmFsKVxuLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRlc3QgYXJyYXlcIiwgdGVzdEFycmF5Milcbi8vICAgICB9XG4vLyB9XG5cbi8vIGxvb3AoMilcblxuLy8gdmFyIHRlc3RBcnJheTIgPSBbXVxuLy8gdGVzdEFycmF5LmZvckVhY2goYXN5bmMoeCkgPT4ge1xuLy8gICAgIHZhciBkb3VibGUgPSBhd2FpdCBhc3luY1ZhbHVlKHgpXG4vLyAgICAgdGVzdEFycmF5Mi5wdXNoKGRvdWJsZSlcbi8vIH0pO1xuXG5cbi8vIGNsYXNzIFN0YWNrIGV4dGVuZHMgQXJyYXkge1xuLy8gICAgIGNvbnN0cnVjdG9yKCkge1xuLy8gICAgICAgICAvLyBzdXBlcigpXG4vLyAgICAgfVxuLy8gICAgIHRvcCgpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGggLSAxXTtcbi8vICAgICB9XG4vLyAgICAgYm90dG9tKCkge1xuLy8gICAgICAgICByZXR1cm4gdGhpc1swXVxuLy8gICAgIH1cbi8vICAgICBhc3luYyBxdWV1ZSh0YXNrKSB7XG4vLyAgICAgICAgIHRoaXMucHVzaCh0YXNrKVxuLy8gICAgICAgICB3aGlsZSAodGhpcy5sZW5ndGggPiAwKSB7XG4vLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZGluZ1wiLCB0YXNrKVxuLy8gICAgICAgICAgICAgYXdhaXQgdGhpcy5zb21ldGhpbmcodGFzaylcbi8vICAgICAgICAgfVxuLy8gICAgICAgICAvLyBhd2FpdCB0aGlzLnNvbWV0aGluZyh0YXNrKTtcbi8vICAgICB9XG4vLyAgICAgYXN5bmMgd29yayh0YXNrKSB7XG4vLyAgICAgICAgIGF3YWl0IHRpbWVvdXQoKSAvL2FrYSBnbyB0byB0aGUgREJcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJEb25lIHdpdGggdGFza1wiLCB0YXNrKVxuLy8gICAgICAgICByZXR1cm5cbi8vICAgICB9XG4vLyAgICAgYXN5bmMgc29tZXRoaW5nKHRhc2spIHtcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJTb21ldGhpbmdcIiwgdGFzaylcbi8vICAgICAgICAgYXdhaXQgdGltZW91dCgpXG4vLyAgICAgICAgIHRoaXMuc2hpZnQoKTtcbi8vICAgICAgICAgY29uc29sZS5sb2coXCJEb25lXCIsIHRhc2spXG4vLyAgICAgICAgIHJldHVyblxuLy8gICAgIH1cbi8vIH1cblxuLy8gdmFyIHMgPSBuZXcgU3RhY2soKTtcbi8vIC8vIHMucHVzaChcIndvcmxkXCIpO1xuLy8gLy8gcy5wdXNoKFwiaGVsbG9cIik7XG4vLyAvLyBjb25zb2xlLmxvZyhzLnRvcCgpKTsgIC8vIFwiaGVsbG9cIlxuLy8gLy8gY29uc29sZS5sb2cocy5sZW5ndGgpOyAvLyAyXG4vLyAvLyBjb25zb2xlLmxvZyhzLmJvdHRvbSgpKTsgLy8gd29ybGRcblxuXG4vLyB2YXIgbWFwID0gbmV3IE1hcCgpXG4vLyBtYXAuc2V0KCdKb2huJywgMjUpXG4vLyBtYXAuc2V0KCdBbGljZScsIDQwMClcblxuLy8gbWFwLmZvckVhY2goZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuLy8gICAgIGNvbnNvbGUubG9nKGtleSwgdmFsdWUpXG4vLyB9KVxuXG4vLyBmb3IgKHZhciBba2V5LCB2YWx1ZV0gb2YgbWFwKSB7XG4vLyAgICAgY29uc29sZS5sb2coXCJkdWRlXCIsIGtleSwgdmFsdWUpXG4vLyB9XG5cbi8vIHZhciBhcnIgPSBbMSwgMiwgMywgNF1cbi8vICAgICAvLyBpZiAoIWFyci5jb250YWlucyg1KSl7XG4vLyAgICAgLy8gICAgIGFyci5wdXNoKG9iaik7XG4vLyAgICAgLy8gfVxuLy8gICAgIC8vIGNvbnNvbGUubG9nKFwiQXJyXCIsIGFycilcblxuLy8gdmFyIGJvID0gXy5jb250YWlucyhbMSwgMiwgM10sIDUpO1xuLy8gY29uc29sZS5sb2coYm8pXG4vLyAvLyBjb25zb2xlLmxvZyggXy5jb250YWlucyhbMSwgMiwgM10sIDEpOyApXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdhYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRodHRwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWJvdXQgY29udHJvbGxlclwiKVxuICAgICAgICAkc2NvcGUuZGF0YXNldCA9IFs1LCAxMCwgMTUsIDIwLCAyNV07XG5cbiAgICAgICAgJHNjb3BlLmluYyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFzZXRbNF0rKztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhc2V0KVxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUuZGF0YXNldDIgPSBbNSwgMTAsIDE1LCAyMCwgMjVdO1xuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5kaXJlY3RpdmUoJ2JhcnNDaGFydCcsIGZ1bmN0aW9uKCRwYXJzZSkge1xuICAgICAgICAvL2V4cGxpY2l0bHkgY3JlYXRpbmcgYSBkaXJlY3RpdmUgZGVmaW5pdGlvbiB2YXJpYWJsZVxuICAgICAgICAvL3RoaXMgbWF5IGxvb2sgdmVyYm9zZSBidXQgaXMgZ29vZCBmb3IgY2xhcmlmaWNhdGlvbiBwdXJwb3Nlc1xuICAgICAgICAvL2luIHJlYWwgbGlmZSB5b3UnZCB3YW50IHRvIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdCB7Li4ufVxuICAgICAgICB2YXIgZGlyZWN0aXZlRGVmaW5pdGlvbk9iamVjdCA9IHtcbiAgICAgICAgICAgIC8vV2UgcmVzdHJpY3QgaXRzIHVzZSB0byBhbiBlbGVtZW50XG4gICAgICAgICAgICAvL2FzIHVzdWFsbHkgIDxiYXJzLWNoYXJ0PiBpcyBzZW1hbnRpY2FsbHlcbiAgICAgICAgICAgIC8vbW9yZSB1bmRlcnN0YW5kYWJsZVxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIC8vdGhpcyBpcyBpbXBvcnRhbnQsXG4gICAgICAgICAgICAvL3dlIGRvbid0IHdhbnQgdG8gb3ZlcndyaXRlIG91ciBkaXJlY3RpdmUgZGVjbGFyYXRpb25cbiAgICAgICAgICAgIC8vaW4gdGhlIEhUTUwgbWFyay11cFxuICAgICAgICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICAgICAgICAvL291ciBkYXRhIHNvdXJjZSB3b3VsZCBiZSBhbiBhcnJheVxuICAgICAgICAgICAgLy9wYXNzZWQgdGhydSBjaGFydC1kYXRhIGF0dHJpYnV0ZVxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnPWNoYXJ0RGF0YSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAvL2luIEQzLCBhbnkgc2VsZWN0aW9uWzBdIGNvbnRhaW5zIHRoZSBncm91cFxuICAgICAgICAgICAgICAgIC8vc2VsZWN0aW9uWzBdWzBdIGlzIHRoZSBET00gbm9kZVxuICAgICAgICAgICAgICAgIC8vYnV0IHdlIHdvbid0IG5lZWQgdGhhdCB0aGlzIHRpbWVcbiAgICAgICAgICAgICAgICB2YXIgY2hhcnQgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG4gICAgICAgICAgICAgICAgLy90byBvdXIgb3JpZ2luYWwgZGlyZWN0aXZlIG1hcmt1cCBiYXJzLWNoYXJ0XG4gICAgICAgICAgICAgICAgLy93ZSBhZGQgYSBkaXYgd2l0aCBvdXQgY2hhcnQgc3RsaW5nIGFuZCBiaW5kIGVhY2hcbiAgICAgICAgICAgICAgICAvL2RhdGEgZW50cnkgdG8gdGhlIGNoYXJ0XG4gICAgICAgICAgICAgICAgY2hhcnQuYXBwZW5kKFwiZGl2XCIpLmF0dHIoXCJjbGFzc1wiLCBcImNoYXJ0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ2RpdicpXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKHNjb3BlLmRhdGEpLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZWFzZShcImVsYXN0aWNcIilcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwid2lkdGhcIiwgKGQgPT4gZCArIFwiJVwiKSlcbiAgICAgICAgICAgICAgICAgICAgLnRleHQoKGQgPT4gZCArIFwiJVwiKSlcbiAgICAgICAgICAgICAgICAvL2EgbGl0dGxlIG9mIG1hZ2ljOiBzZXR0aW5nIGl0J3Mgd2lkdGggYmFzZWRcbiAgICAgICAgICAgICAgICAvL29uIHRoZSBkYXRhIHZhbHVlIChkKSBcbiAgICAgICAgICAgICAgICAvL2FuZCB0ZXh0IGFsbCB3aXRoIGEgc21vb3RoIHRyYW5zaXRpb25cbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2RhdGEnLCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsID09PSBvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ2hhbmdlZCAxXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhcnQuc2VsZWN0QWxsKFwiZGl2XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoc2NvcGUuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJ3aWR0aFwiLCAoZCA9PiBkICsgXCIlXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KChkID0+IGQgKyBcIiVcIikpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNoYW5nZWQgM1wiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSlcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHRyYW5zaXRpb25Hcm91cCgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuc2VsZWN0QWxsKClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZURlZmluaXRpb25PYmplY3Q7XG4gICAgfSlcbiAgICAuZGlyZWN0aXZlKCdkb251dENoYXJ0JywgZnVuY3Rpb24oJHBhcnNlKSB7XG4gICAgICAgIC8vZXhwbGljaXRseSBjcmVhdGluZyBhIGRpcmVjdGl2ZSBkZWZpbml0aW9uIHZhcmlhYmxlXG4gICAgICAgIC8vdGhpcyBtYXkgbG9vayB2ZXJib3NlIGJ1dCBpcyBnb29kIGZvciBjbGFyaWZpY2F0aW9uIHB1cnBvc2VzXG4gICAgICAgIC8vaW4gcmVhbCBsaWZlIHlvdSdkIHdhbnQgdG8gc2ltcGx5IHJldHVybiB0aGUgb2JqZWN0IHsuLi59XG4gICAgICAgIHZhciBkaXJlY3RpdmVEZWZpbml0aW9uT2JqZWN0ID0ge1xuICAgICAgICAgICAgLy9XZSByZXN0cmljdCBpdHMgdXNlIHRvIGFuIGVsZW1lbnRcbiAgICAgICAgICAgIC8vYXMgdXN1YWxseSAgPGJhcnMtY2hhcnQ+IGlzIHNlbWFudGljYWxseVxuICAgICAgICAgICAgLy9tb3JlIHVuZGVyc3RhbmRhYmxlXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgLy90aGlzIGlzIGltcG9ydGFudCxcbiAgICAgICAgICAgIC8vd2UgZG9uJ3Qgd2FudCB0byBvdmVyd3JpdGUgb3VyIGRpcmVjdGl2ZSBkZWNsYXJhdGlvblxuICAgICAgICAgICAgLy9pbiB0aGUgSFRNTCBtYXJrLXVwXG4gICAgICAgICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgICAgICAgIC8vb3VyIGRhdGEgc291cmNlIHdvdWxkIGJlIGFuIGFycmF5XG4gICAgICAgICAgICAvL3Bhc3NlZCB0aHJ1IGNoYXJ0LWRhdGEgYXR0cmlidXRlXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGRhdGE6ICc9Y2hhcnREYXRhJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIC8vaW4gRDMsIGFueSBzZWxlY3Rpb25bMF0gY29udGFpbnMgdGhlIGdyb3VwXG4gICAgICAgICAgICAgICAgLy9zZWxlY3Rpb25bMF1bMF0gaXMgdGhlIERPTSBub2RlXG4gICAgICAgICAgICAgICAgLy9idXQgd2Ugd29uJ3QgbmVlZCB0aGF0IHRoaXMgdGltZVxuICAgICAgICAgICAgICAgIC8vIHZhciBjaGFydCA9IGQzLnNlbGVjdChlbGVtZW50WzBdKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgZGF0YXNldCA9IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgYXBwbGVzOiBbNTMyNDUsIDI4NDc5LCAxOTY5NywgMjQwMzcsIDQwMjQ1XSxcbiAgICAgICAgICAgICAgICAvLyB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gOTYwLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSA1MDAsXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpIC8gMjtcblxuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IGQzLnNjYWxlLm9yZGluYWwoKVxuICAgICAgICAgICAgICAgICAgICAucmFuZ2UoW1wiIzk4YWJjNVwiLCBcIiM4YTg5YTZcIiwgXCIjN2I2ODg4XCIsIFwiIzZiNDg2YlwiLCBcIiNhMDVkNTZcIiwgXCIjZDA3NDNjXCIsIFwiI2ZmOGMwMFwiXSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgYXJjID0gZDMuc3ZnLmFyYygpXG4gICAgICAgICAgICAgICAgICAgIC5vdXRlclJhZGl1cyhyYWRpdXMgLSAxMClcbiAgICAgICAgICAgICAgICAgICAgLmlubmVyUmFkaXVzKHJhZGl1cyAtIDcwKTtcblxuICAgICAgICAgICAgICAgIHZhciBwaWUgPSBkMy5sYXlvdXQucGllKClcbiAgICAgICAgICAgICAgICAgICAgLnNvcnQobnVsbClcbiAgICAgICAgICAgICAgICAgICAgLnZhbHVlKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLnBvcHVsYXRpb247XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChlbGVtZW50WzBdKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHdpZHRoIC8gMiArIFwiLFwiICsgaGVpZ2h0IC8gMiArIFwiKVwiKTtcblxuICAgICAgICAgICAgICAgIC8vIGQzLmNzdihcImRhdGEuY3N2XCIsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBzY29wZS5kYXRhLmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgIC8vICAgICBkLnBvcHVsYXRpb24gPSArZC5wb3B1bGF0aW9uO1xuICAgICAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGcgPSBzdmcuc2VsZWN0QWxsKFwiLmFyY1wiKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YShwaWUoc2NvcGUuZGF0YSkpXG4gICAgICAgICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImFyY1wiKTtcblxuICAgICAgICAgICAgICAgIGcuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgYXJjKTtcblxuICAgICAgICAgICAgICAgIC8vIGcuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgICAgICAgIC8vICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBhcmMuY2VudHJvaWQoZCkgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgICAgICAgICAvLyAgICAgLmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXG4gICAgICAgICAgICAgICAgLy8gICAgIC5zdHlsZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgICAgICAgLy8gICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJldHVybiBkLmRhdGEuYWdlO1xuICAgICAgICAgICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVEZWZpbml0aW9uT2JqZWN0O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgnbm90dXNlZCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsIEh1YiwgJHEsIFRhc2tTZXJ2aWNlKSB7XG5cbiAgICAgICAgLy9kZWNsYXJpbmcgdGhlIGh1YiBjb25uZWN0aW9uXG4gICAgICAgIHZhciBodWIgPSBuZXcgSHViKCdhY3Rpdml0eVF1ZXVlSHViJywge1xuICAgICAgICAgICAgLy8gdmFyIGh1YiA9IG5ldyBIdWIoJ21vdmVTaGFwZUh1YicsIHtcblxuICAgICAgICAgICAgLy9jbGllbnQgc2lkZSBtZXRob2RzXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgICAgICAgICAndGFza1dvcmtpbmcnOiBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYSB0YXNrIHN0YXR1cyB3YXMgY2hhbmdlZC4uLi5cIiwgaW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlRhc2tMaXN0LnVwZGF0ZShpbmZvLkFjdGl2aXR5SUQsIGluZm8uU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICd1c2VySm9pbmVkJzogZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgam9pbmVkXCIsIHVzZXIpXG4gICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlVzZXJMaXN0LnB1c2godXNlcik7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAndXNlckxlZnQnOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBsZWZ0XCIsIHVzZXIpXG4gICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlVzZXJMaXN0LnJlbW92ZSh1c2VyLlVzZXJJRCk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gcm9vdFBhdGg6IFwiaHR0cDovLzEwLjEuMS4yMjYvc2lnbmFsclwiLFxuICAgICAgICAgICAgcm9vdFBhdGg6IFwiaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9zaWduYWxyXCIsXG5cbiAgICAgICAgICAgIC8vc2VydmVyIHNpZGUgbWV0aG9kc1xuICAgICAgICAgICAgbWV0aG9kczogWydHZXRUYXNrcycsICdjaGFuZ2VUYXNrU3RhdHVzRCcsICdXaG9BbUknLCAnQ2hhbmdlVGFza1N0YXR1cycsICdUaW1lVW50aWxOZXh0RmlsbCddLFxuXG4gICAgICAgICAgICAvL3F1ZXJ5IHBhcmFtcyBzZW50IG9uIGluaXRpYWwgY29ubmVjdGlvblxuICAgICAgICAgICAgLy8gcXVlcnlQYXJhbXM6e1xuICAgICAgICAgICAgLy8gICAgICd0b2tlbic6ICdleGFtcGxldG9rZW4nXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICB2YXIgVGltZVVudGlsTmV4dEZpbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQgdGltZSB1bnRpbCBuZXh0IGZpbGxcIilcbiAgICAgICAgICAgIGh1Yi5UaW1lVW50aWxOZXh0RmlsbCgpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzXCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICBodWIuaW5pdCgpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBpZiAocmVzLl9zdWJzY3JpYmVkVG9IdWJzKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vbW92ZVNoYXBlSHViLmludm9rZSgndXBkYXRlTW9kZWwnLCBzaGFwZU1vZGVsKVxuXG4gICAgICAgIHZhciBnZXRDdXJyZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IGN1cnJlbnRcIilcbiAgICAgICAgICAgIGh1Yi5oZWxsb19JbV9Db25uZWN0ZWQoc2hhcGVNb2RlbCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IFdob0FtSVwiKVxuICAgICAgICAgICAgaHViLldob0FtSShcInBiYWpvalwiKS50aGVuKGZ1bmN0aW9uKHVzZXJzKSB7XG4gICAgICAgICAgICAgICAgVGFza1NlcnZpY2UuVXNlckxpc3QucHVzaCguLi51c2Vycyk7XG4gICAgICAgICAgICAgICAgdXNlcnMuZm9yRWFjaChmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBUYXNrU2VydmljZS5Hcm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLkdyb3Vwc1trZXldLmZvckVhY2goZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZHggPSBUYXNrU2VydmljZS5Hcm91cHNba2V5XS5tYXAodXNlciA9PiB1c2VyLlVzZXJJRCkuaW5kZXhPZih1c2VyLlVzZXJJRClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLkdyb3Vwc1trZXldW2lkeF0ub25saW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQ2hhbmdlVGFza1N0YXR1cyA9IGZ1bmN0aW9uKGFjdGl2aXR5SUQsIHN0YXR1cykge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBodWIuQ2hhbmdlVGFza1N0YXR1cyhhY3Rpdml0eUlELCBzdGF0dXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZSBjaGFuZ2luZyBzdGF0dXNcIilcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgR2V0VGFza3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0dGluZyB0YXNrc1wiKVxuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBodWIuR2V0VGFza3MoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgIG1hcDogZ2V0Q3VycmVudCxcbiAgICAgICAgICAgICAgICBXaG9BbUk6IGdldFVzZXIsXG4gICAgICAgICAgICAgICAgR2V0VGFza3M6IEdldFRhc2tzLFxuICAgICAgICAgICAgICAgIENoYW5nZVRhc2tTdGF0dXM6IENoYW5nZVRhc2tTdGF0dXMsXG4gICAgICAgICAgICAgICAgVGltZVVudGlsTmV4dEZpbGw6IFRpbWVVbnRpbE5leHRGaWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVmZXJyZWQucHJvbWlzZVxuICAgICAgICBdXG5cblxuICAgIH0pO1xuIiwiLy8gZm9yIGFkZGluZyBhbiBhY3Rpdml0eSB0byBhIGNhbXBhaWduXG5jbGFzcyBOZXdBY3Rpdml0eSB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgdGhpcy5TdGFydERhdGVUaW1lID0gbW9tZW50KG9iai5TdGFydERhdGVUaW1lKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG4gICAgICAgIHRoaXMuQ29tcGxldGlvbkRhdGVUaW1lID0gbW9tZW50KG9iai5Db21wbGV0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVktTU0tRERcIilcbiAgICB9XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ2FjdGl2aXR5Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJGh0dHAsIGFjdGl2aXR5RmFjdG9yeSwgJHVwbG9hZCkge1xuICAgIGNvbnNvbGUubG9nKFwiV2VsY29tZSB0byBhY3Rpdml0eSBjb250cm9sbGVyXCIpXG5cbiAgICAkc2NvcGUudXNlckxpc3QgPSBbXTtcbiAgICB2YXIgZ2V0VXNlcnMgPSAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3VzZXJzJykudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgdXNlcnNcIiwgZGF0YS5kYXRhLlVzZXJMaXN0KVxuICAgICAgICAkc2NvcGUudXNlckxpc3QgPSBkYXRhLmRhdGEuVXNlckxpc3RcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgfSlcblxuICAgICRzY29wZS5tb2RlbCA9IGFjdGl2aXR5RmFjdG9yeVswXTtcblxuICAgICRzY29wZS5zZXRGaWxlID0gZnVuY3Rpb24oJGZpbGVzKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJQYXNzZWRcIiwgJGZpbGVzKVxuICAgICAgICBhY3Rpdml0eUZhY3RvcnlbMl0uZmlsZSA9ICRmaWxlc1swXTtcbiAgICAgICAgY29uc29sZS5sb2coXCJNb2RlbFwiLCBhY3Rpdml0eUZhY3RvcnlbMl0gKVxuICAgIH1cblxuXG59KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdhY3Rpdml0eUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgJHVwbG9hZCwgJGFsZXJ0LCAkcSkge1xuICAgIHZhciBhY3Rpdml0eUZhY3RvcnkgPSB7fTtcbiAgICB2YXIgbXlVcGxvYWQgPSB7fTtcbiAgICB2YXIgYWN0aXZpdHlNZXRob2RzID0ge1xuICAgICAgICBzZWxmOiB0aGlzLFxuICAgICAgICBfY2FtcGFpZ25JRDogXCJcIixcbiAgICAgICAgX2FjdGl2aXR5OiBcIlwiLFxuICAgICAgICBzYXZlQWN0aXZpdHlfYW5kX3RoZW5fZG9fQXR0YWNobWVudHM6IGZ1bmN0aW9uKGNhbXBhaWduSUQsIGFjdGl2aXR5KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2ZSBhY3Rpdml0eSBhbmQgdGhlbiBkbyBhdHRhY2htZW50c1wiLCBjYW1wYWlnbklELCBhY3Rpdml0eSk7XG4gICAgICAgICAgICAvLyBzbyB3ZSBjYW4gdXNlIHRoZW0gZm9yIHRoZSBuZXh0IGZ1bmN0aW9uXG4gICAgICAgICAgICBzZWxmLl9jYW1wYWlnbklEID0gY2FtcGFpZ25JRFxuICAgICAgICAgICAgc2VsZi5hY3Rpdml0eSA9IGFjdGl2aXR5XG4gICAgICAgICAgICAvLyAkcVxuICAgICAgICAgICAgdmFyIGRlZmVycmVkICA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAvLyBkZWZlcnJlZCBvbmx5IHJlc29sdmVzIGlmIHRoZXkgYm90aCByZXNvbHZlIVxuICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24vJytjYW1wYWlnbklEKycvQWN0aXZpdHknLCAkLnBhcmFtKGFjdGl2aXR5KSApLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUNDRVNTIVwiLCBkYXRhKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm93IHRvIHVwbG9hZC4uLlwiLCBteVVwbG9hZClcbiAgICAgICAgICAgICAgICBpZihPYmplY3Qua2V5cyhteVVwbG9hZCkubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXZlcm1pbmQuLi4ubXlVcGxvYWQgaXMgZW1wdHlcIilcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGl2aXR5SUQgPSBkYXRhLkFjdGl2aXR5SUQ7XG4gICAgICAgICAgICAgICAgICAgICR1cGxvYWQuaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9DYW1wYWlnbi8nK2NhbXBhaWduSUQrJy9BY3Rpdml0eS8nK2FjdGl2aXR5SUQrJy9BdHRhY2htZW50LycgKyAgbXlVcGxvYWQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogbXlVcGxvYWQudHlwZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBteVVwbG9hZFxuICAgICAgICAgICAgICAgICAgICB9KS5wcm9ncmVzcyhmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwZXJjZW50OiAnICsgcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzc1wiLCBkYXRhKVxuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZuU2hvd0FsZXJ0KGVyci5jb25maWcpXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGZuU2hvd0FsZXJ0KGVyci5jb25maWcpXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm5TaG93QWxlcnQoIHttZXRob2QsIHVybH0gKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJcIiwgbWV0aG9kLCB1cmwpXG4gICAgICAgIHZhciBteUFsZXJ0ID0gJGFsZXJ0KHt0aXRsZTogXCJFcnJvclwiLFxuICAgICAgICAgICAgY29udGVudDogbWV0aG9kICtcIiBcIisgdXJsLFxuICAgICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gW2FjdGl2aXR5RmFjdG9yeSwgYWN0aXZpdHlNZXRob2RzLCBteVVwbG9hZF1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdhZG1pbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0KSB7XG4gIGNvbnNvbGUubG9nKFwiV2VsY29tZSB0byB0aGUgQWRtaW4gQ29udHJvbGxlclwiKVxuICBpZighJHJvb3RTY29wZS5jcmVkZW50aWFscy5hZG1pbil7XG4gICAgJHN0YXRlLmdvKFwiaG9tZVwiKVxuICAgIHZhciBteUFsZXJ0ID0gJGFsZXJ0KHt0aXRsZTogXCJGb3JiaWRkZW4gLSBcIixcbiAgICAgICAgY29udGVudDogXCJXZSdyZSBjYWxsaW5nIHRoZSBjb3BzXCIsXG4gICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgICAgZHVyYXRpb246IDNcbiAgICAgICAgLy8gY29udGFpbmVyOiBcImJvZHlcIlxuICAgICAgfSk7XG4gIH1cblxufSlcbiIsIi8vIERpc3BsYXlzIHdob2xlIGxpc3Qgb2Ygc2F2ZWQgY2FtcGFpZ25zXG5hbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdjYW1wYWlnbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY2FtcGFpZ25GYWN0b3J5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2VsY29tZSBmcm9tIGNhbXBhaWduIGNvbnRyb2xsZXJcIilcbiAgICAgICAgJHNjb3BlLmF2YWlsYWJsZUNhbXBhaWducyA9IFtdXG4gICAgICAgIHZhciBmZXRjaEFsbCA9IGNhbXBhaWduRmFjdG9yeS5nZXRDYW1wYWlnbnMoKTtcbiAgICAgICAgdmFyIGRpc3BsYXlSZXN1bHRzID0gZmV0Y2hBbGwudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdC4uLlwiLCBkYXRhLmRhdGEpXG4gICAgICAgICAgICAkc2NvcGUuYXZhaWxhYmxlQ2FtcGFpZ25zID0gZGF0YS5kYXRhXG4gICAgICAgIH0pXG5cbiAgICB9KVxuIiwiLy8gLyMvQ2FtcGFpZ25zL2RldGFpbHMve2NhbXBhaWduSUR9XG5hbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdjYW1wYWlnbkNvbnRyb2xsZXJEZXRhaWxzJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGNhbXBhaWduRmFjdG9yeSwgJGFsZXJ0LCBxdWVyeUZhY3RvcnksICRtb2RhbCwgYWN0aXZpdHlGYWN0b3J5LCBjYW1wYWlnbikge1xuICAgICAgICAvLyBjYW1wYWlnbiBpcyBwYXNzZWQgaW4gZnJvbSB0aGUgcm91dGVyIHJlc29sdmVcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJnb3QgY2FtcGFpZ25cIiwgY2FtcGFpZ24pO1xuICAgICAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzID0gbmV3IENhbXBhaWduKGNhbXBhaWduLmRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNsYXNzXCIsICRzY29wZS5jYW1wYWlnbkRldGFpbHMpXG4gICAgICAgICRzY29wZS5ldmVudHMgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLmV2ZW50c1xuXG4gICAgICAgIC8vICRzY29wZS5ldmVudHMgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkFjdGl2aXRpZXMubWFwKEV2ZW50ID0+IEV2ZW50KTtcbiAgICAgICAgJHNjb3BlLmV2ZW50U291cmNlcyA9IFtdO1xuXG4gICAgICAgICRzY29wZS5QcmludCA9ICgoKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPIC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2FtcGFpZ25EZXRhaWxzKTtcbiAgICAgICAgfSlcblxuICAgICAgICB2YXIgZWRpdENhbXBhaWduID0gJG1vZGFsKHtcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2VkaXRDYW1wYWlnbi5tb2RhbC5odG1sJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBvcGVuIG1vZGFsIGZvciBlZGl0aW5nIGNhbXBhaWduIGRldGFpbHNcbiAgICAgICAgLy8gbW9kYWwgcGFzc2VzICd0cnVlJ1xuICAgICAgICAkc2NvcGUuZWRpdENhbXBhaWduID0gZnVuY3Rpb24oZWRpdCA9IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoZWRpdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNJRCA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQ2FtcGFpZ25JRFxuICAgICAgICAgICAgICAgIGNhbXBhaWduRmFjdG9yeS5lZGl0Q2FtcGFpZ25zKGNJRCwgJHNjb3BlLmNhbXBhaWduRGV0YWlscykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzcz9cIiwgZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZWRpdENhbXBhaWduLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkR1ZGUuLi4uXCIsIGVycilcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVsc2VcbiAgICAgICAgICAgIGVkaXRDYW1wYWlnbi5zaG93KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tb2RhbFNhdmVBY3Rpdml0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIFthY3Rpdml0eU1vZGVsLCBhY3Rpdml0eU1ldGhvZHNdID0gYWN0aXZpdHlGYWN0b3J5XG4gICAgICAgICAgICAvLyBjbGFzcyBOZXdBY3Rpdml0eSBwYXJzZXMgdGhlIGRhdGVzXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHlNb2RlbCA9IG5ldyBOZXdBY3Rpdml0eShhY3Rpdml0eU1vZGVsKTtcbiAgICAgICAgICAgIHZhciBjSUQgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkNhbXBhaWduSURcbiAgICAgICAgICAgIGFjdGl2aXR5TWV0aG9kcy5zYXZlQWN0aXZpdHlfYW5kX3RoZW5fZG9fQXR0YWNobWVudHMoY0lELCBhY3Rpdml0eU1vZGVsKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3M/XCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgYWRkRXZlbnRzKGFjdGl2aXR5TW9kZWwpO1xuICAgICAgICAgICAgICAgIGFjdGl2aXR5TW9kYWwuaGlkZSgpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIkR1ZGUuLi4uXCIsIGVycilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy93aGVuIHlvdSBjbGljayBhIGNhbGVuZGFyIG9iamVjdCwgcG9wdWxhdGUgZGVldHNcbiAgICAgICAgJHNjb3BlLmRlZXRzO1xuXG4gICAgICAgICRzY29wZS5wcm9zcGVjdHNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuYWN0aXZpdGllc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUub25DbGlja1RhYiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9IGNvbnRhY3RcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaXNBY3RpdmVUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSB7XG4gICAgICAgICAgICBpdGVtc1BlclBhZ2U6IDEwLFxuICAgICAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZSxcbiAgICAgICAgICAgIG1heFBhZ2VzOiA1XG4gICAgICAgIH1cblxuICAgICAgICAvL2NhbXBhaWduIGlzIGF0IHBlbmRpbmcgQCBUZW1wbGF0ZSBAIEJlZ2lubmluZywgbm90IHBlbmRpbmdcbiAgICAgICAgLy9JcyB0aGlzIGFsd2F5cyB0cnVlIHRob3VnaD8gV2hhdCBpZiBpdCdzIGF0IFBlbmRpbmcgdG8gYmVnaW5cbiAgICAgICAgJHNjb3BlLmNhbXBhaWduUGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5EZWxldGVQcm9zcGVjdCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICAvLyBkb2Vzbid0IGhhdmUgYSBxdWVyeSBJRCB0byBzZW5kIGRlbGV0ZXMgdG9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGltcGxlbWVudGVkXCIpXG4gICAgICAgICAgICAvLyAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMuUHJvc3BlY3RzLmZvckVhY2goKGEsYikgPT4ge1xuICAgICAgICAgICAgLy8gICAgIGlmKGEuUHJvc3BlY3RJRCA9PSBpZCl7XG4gICAgICAgICAgICAvLyAgICAgICBhLlN0YXR1cyA/IGEuU3RhdHVzID0gMCA6IGEuU3RhdHVzID0gMTtcbiAgICAgICAgICAgIC8vICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5U3RhdHVzKCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQsIGlkLCBhLlN0YXR1cyk7XG4gICAgICAgICAgICAvLyAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIENBTEVOREFSIEZVTkNUSU9OU1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBkID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIHZhciBtID0gZGF0ZS5nZXRNb250aCgpO1xuICAgICAgICB2YXIgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICBmdW5jdGlvbiBhZGRFdmVudHMoe1xuICAgICAgICAgICAgRGVzY3IsIFN0YXJ0RGF0ZVRpbWUsIENvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICB9KSB7XG4gICAgICAgICAgICAkc2NvcGUuZXZlbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBEZXNjcixcbiAgICAgICAgICAgICAgICBzdGFydDogU3RhcnREYXRlVGltZSxcbiAgICAgICAgICAgICAgICBlbmQ6IENvbXBsZXRpb25EYXRlVGltZSxcbiAgICAgICAgICAgICAgICBhbGxEYXk6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvKiBhbGVydCBvbiBldmVudENsaWNrICovXG4gICAgICAgICRzY29wZS5hbGVydE9uRXZlbnRDbGljayA9IGZ1bmN0aW9uKGV2ZW50LCBhbGxEYXksIGpzRXZlbnQsIHZpZXcpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQWN0aXZpdGllcy5maW5kKHggPT4geC5EZXNjciA9PSBldmVudC50aXRsZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hdGNoKVxuICAgICAgICAgICAgJHNjb3BlLmRlZXRzID0gbWF0Y2g7XG4gICAgICAgIH07XG4gICAgICAgIC8qIGFsZXJ0IG9uIERyb3AgKi9cbiAgICAgICAgLy8gJHNjb3BlLmFsZXJ0T25Ecm9wID0gZnVuY3Rpb24oZXZlbnQsIGRheURlbHRhLCBtaW51dGVEZWx0YSwgYWxsRGF5LCByZXZlcnRGdW5jLCBqc0V2ZW50LCB1aSwgdmlldykge1xuICAgICAgICAvLyAgICAgJHNjb3BlLmFsZXJ0TWVzc2FnZSA9ICgnRXZlbnQgRHJvcGVkIHRvIG1ha2UgZGF5RGVsdGEgJyArIGRheURlbHRhKTtcbiAgICAgICAgLy8gfTtcblxuICAgICAgICAvLyAkc2NvcGUub25EYXlDbGljayA9IGZ1bmN0aW9uKGRhdGUsIGpzRXZlbnQpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiV2hvYVwiLCBqc0V2ZW50KVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIC8qIGFsZXJ0IG9uIFJlc2l6ZSAqL1xuICAgICAgICAvLyAkc2NvcGUuYWxlcnRPblJlc2l6ZSA9IGZ1bmN0aW9uKGV2ZW50LCBkYXlEZWx0YSwgbWludXRlRGVsdGEsIHJldmVydEZ1bmMsIGpzRXZlbnQsIHVpLCB2aWV3KSB7XG4gICAgICAgIC8vICAgICAkc2NvcGUuYWxlcnRNZXNzYWdlID0gKCdFdmVudCBSZXNpemVkIHRvIG1ha2UgZGF5RGVsdGEgJyArIG1pbnV0ZURlbHRhKTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogYWRkIGFuZCByZW1vdmVzIGFuIGV2ZW50IHNvdXJjZSBvZiBjaG9pY2UgKi9cbiAgICAgICAgLy8gJHNjb3BlLmFkZFJlbW92ZUV2ZW50U291cmNlID0gZnVuY3Rpb24oc291cmNlcywgc291cmNlKSB7XG4gICAgICAgIC8vICAgICB2YXIgY2FuQWRkID0gMDtcbiAgICAgICAgLy8gICAgIGFuZ3VsYXIuZm9yRWFjaChzb3VyY2VzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIC8vICAgICAgICAgaWYgKHNvdXJjZXNba2V5XSA9PT0gc291cmNlKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHNvdXJjZXMuc3BsaWNlKGtleSwgMSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIGNhbkFkZCA9IDE7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vICAgICBpZiAoY2FuQWRkID09PSAwKSB7XG4gICAgICAgIC8vICAgICAgICAgc291cmNlcy5wdXNoKHNvdXJjZSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIC8qIGFkZCBjdXN0b20gZXZlbnQqL1xuICAgICAgICAvLyAkc2NvcGUuYWRkRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgICRzY29wZS5ldmVudHMucHVzaCh7XG4gICAgICAgIC8vICAgICAgICAgdGl0bGU6ICdPcGVuIFNlc2FtZScsXG4gICAgICAgIC8vICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDI4KSxcbiAgICAgICAgLy8gICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIDI5KSxcbiAgICAgICAgLy8gICAgICAgICBjbGFzc05hbWU6IFsnb3BlblNlc2FtZSddXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogcmVtb3ZlIGV2ZW50ICovXG4gICAgICAgIC8vICRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAvLyAgICAgJHNjb3BlLmV2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyAvKiBDaGFuZ2UgVmlldyAqL1xuICAgICAgICAvLyAkc2NvcGUuY2hhbmdlVmlldyA9IGZ1bmN0aW9uKHZpZXcsIGNhbGVuZGFyKSB7XG4gICAgICAgIC8vICAgICBjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ2NoYW5nZVZpZXcnLCB2aWV3KTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogQ2hhbmdlIFZpZXcgKi9cbiAgICAgICAgLy8gJHNjb3BlLnJlbmRlckNhbGVuZGVyID0gZnVuY3Rpb24oY2FsZW5kYXIpIHtcbiAgICAgICAgLy8gICAgIGNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVuZGVyJyk7XG4gICAgICAgIC8vIH07XG5cbiAgICAgICAgdmFyIGRheUNsaWNrZWQ7XG4gICAgICAgICRzY29wZS5kYXlDbGljayA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcbiAgICAgICAgICAgIGRheUNsaWNrZWQgPSBtb21lbnQoYSkuZm9ybWF0KFwiTExcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3Rpdml0eU1vZGFsID0gJG1vZGFsKHtcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2FkZF9hY3Rpdml0eS5tb2RhbC5odG1sJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUuZGF5RGJsQ2xpY2sgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG4gICAgICAgICAgICB2YXIgW2FjdGl2aXR5TW9kZWwsIGFjdGl2aXR5TWV0aG9kc10gPSBhY3Rpdml0eUZhY3RvcnlcbiAgICAgICAgICAgIGFjdGl2aXR5TW9kZWwuU3RhcnREYXRlVGltZSA9IGRheUNsaWNrZWRcbiAgICAgICAgICAgIGFjdGl2aXR5TW9kYWwuc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogY29uZmlnIG9iamVjdCAqL1xuICAgICAgICAkc2NvcGUudWlDb25maWcgPSB7XG4gICAgICAgICAgICBjYWxlbmRhcjoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAndGl0bGUnLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICByaWdodDogJ3RvZGF5IHByZXYsbmV4dCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2s6ICRzY29wZS5hbGVydE9uRXZlbnRDbGljayxcbiAgICAgICAgICAgICAgICBldmVudERibENsaWNrOiAkc2NvcGUub25EYXlDbGljayxcbiAgICAgICAgICAgICAgICBkYXlDbGljazogJHNjb3BlLmRheUNsaWNrLFxuICAgICAgICAgICAgICAgIGRheURibENsaWNrOiAkc2NvcGUuZGF5RGJsQ2xpY2ssXG4gICAgICAgICAgICAgICAgLy8gZXZlbnREcm9wOiAkc2NvcGUuYWxlcnRPbkRyb3AsXG4gICAgICAgICAgICAgICAgLy8gZXZlbnRSZXNpemU6ICRzY29wZS5hbGVydE9uUmVzaXplLFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIGV2ZW50IHNvdXJjZXMgYXJyYXkqL1xuICAgICAgICAkc2NvcGUuZXZlbnRTb3VyY2VzID0gWyRzY29wZS5ldmVudHNdO1xuXG4gICAgICAgICRzY29wZS5uZXh0U3RhdHVzID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHZhciBjSUQgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkNhbXBhaWduSURcbiAgICAgICAgICAgIGNhbXBhaWduRmFjdG9yeS5lZGl0U3RhdHVzKGNJRCwgMylcbiAgICAgICAgfVxuXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmZhY3RvcnkoJ2NhbXBhaWduRmFjdG9yeScsXG4gICAgICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHF1ZXJ5UmVzdWx0czogZnVuY3Rpb24odXJsLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NhbXBhaWducycpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzaW5nbGVDYW1wYWlnbjogZnVuY3Rpb24ocGFyYW1JRCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdldCBjYW1wYWlnbi4uLi4jXCIsIHBhcmFtSUQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL2NhbXBhaWduLycgKyBwYXJhbUlEKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGhpc1NhdmVkUXVlcnk6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy93aWxsIGhhdmUgdG8gcGFzcyB3aGljaCBzYXZlZCBxdWVyeSBpbiB0aGUgZnV0dXJlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS90aGlzUXVlcnknKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0UXVlcmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoL2xpc3QnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2luZ2xlUXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5SUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvJyArIHF1ZXJ5SUQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udmVydDogZnVuY3Rpb24ocXVlcnlJRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24nLCAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFF1ZXJ5SUQ6IHF1ZXJ5SURcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2F2ZUFjdGl2aXR5OiBmdW5jdGlvbihjYW1wYWlnbklELCBhY3Rpdml0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24vJyArIGNhbXBhaWduSUQgKyAnL0FjdGl2aXR5JywgJC5wYXJhbShhY3Rpdml0eSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0VXNlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2VycycpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRDYW1wYWlnbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9jYW1wYWlnbicpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlZGl0Q2FtcGFpZ25zOiBmdW5jdGlvbihjSUQsIG9yaWdpbmFsRm9ybSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXQgY2FtcGFpZ25zXCIsIG9yaWdpbmFsRm9ybSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm0gPSB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29weWluZyBvYmplY3QgYWZmZWN0cyBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGZvcm0sIG9yaWdpbmFsRm9ybSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZXNlIGFycmF5cyB0aHJvdyBhbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybS5BY3Rpdml0aWVzXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmb3JtLlByb3NwZWN0c1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybS5BdHRhY2htZW50c1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybS5CdXNpbmVzc093bmVyc1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9DYW1wYWlnbi8nICsgY0lELCAkLnBhcmFtKGZvcm0pKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZWRpdFN0YXR1czogZnVuY3Rpb24oY0lELCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY0lELCBzdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL2NhbXBhaWduLycgKyBjSUQgKyAnL3N0YXR1cycsICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogc3RhdHVzXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbik7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ25ld0NhbXBhaWduQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQsIGNhbXBhaWduRmFjdG9yeSwgcXVlcnlGYWN0b3J5LCBhY3Rpdml0eUZhY3RvcnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gTkVXIGNhbXBhaWduIGNvbnRyb2xsZXJcIilcblxuICAgICRzY29wZS50YWJsZUNvbmZpZyA9IHtcbiAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZSxcbiAgICAgICAgbWF4UGFnZXM6IDVcbiAgICB9XG5cbiAgICAkc2NvcGUuRGVsZXRlUHJvc3BlY3QgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMucm93cy5mb3JFYWNoKChhLGIpID0+IHtcbiAgICAgICAgICAgIGlmKGEuUHJvc3BlY3RJRCA9PSBpZCl7XG4gICAgICAgICAgICAgICAgYS5TdGF0dXMgPyBhLlN0YXR1cyA9IDAgOiBhLlN0YXR1cyA9IDE7XG4gICAgICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5U3RhdHVzKCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQsIGlkLCBhLlN0YXR1cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAkc2NvcGUuY2FtcGFpZ25JRDtcbiAgICAkc2NvcGUuY2FtcGFpZ25Db252ZXJ0ZWQgPSBmYWxzZTtcbiAgICAkc2NvcGUuY29udmVydCA9ICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDb252ZXJ0aW5nLi4uXCIpO1xuICAgICAgICB2YXIgcXVlcnlJRCAgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLlF1ZXJ5SUQ7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IocXVlcnlJRClcbiAgICAgICAgY2FtcGFpZ25GYWN0b3J5LmNvbnZlcnQocXVlcnlJRCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJET05FLCBjYW1wYWlnbiBJRCBcIiwgZGF0YS5kYXRhLkNhbXBhaWduSUQpXG4gICAgICAgICAgICAkc2NvcGUuY2FtcGFpZ25JRCA9IGRhdGEuZGF0YS5DYW1wYWlnbklEO1xuICAgICAgICAgICAgJHNjb3BlLmNhbXBhaWduQ29udmVydGVkID0gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVzZXJMaXN0ID0gW107XG4gICAgY2FtcGFpZ25GYWN0b3J5LmdldFVzZXJzKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBhbGwgdXNlcnMuLi4uXCIsIGRhdGEpXG4gICAgICAgICRzY29wZS51c2VyTGlzdCA9IGRhdGEuZGF0YS5Vc2VyTGlzdDtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgIH0pXG5cbiAgICAkc2NvcGUuc2F2ZWRRdWVyaWVzID0gW107XG4gICAgJHNjb3BlLnNlbGVjdGVkUXVlcnk7XG4gICAgY2FtcGFpZ25GYWN0b3J5LmdldFF1ZXJpZXMoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290Li4uXCIsIGRhdGEpXG4gICAgICAgICRzY29wZS5zYXZlZFF1ZXJpZXMgPSBkYXRhLmRhdGFcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgIH0pXG5cbiAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzID0ge307XG4gICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscy5yb3dzID0gW107XG4gICAgJHNjb3BlLnNldEJpbGxHcm91cCA9IChkYXRhKSA9PiB7XG4gICAgICAgIC8vIEZJWE1FIHRoaXMgaXMgYmVpbmcgZmlyZWQgb24gcGFnZSBpbml0IGJlY2F1c2UgaXQgdGhpbmtzIHRoZSB2YWx1ZVxuICAgICAgICAvLyBpcyBjaGFuZ2luZztcbiAgICAgICAgY29uc29sZS5sb2coXCJDSEFOR0VEXCIsICRzY29wZS5zZWxlY3RlZFF1ZXJ5KVxuICAgICAgICBjYW1wYWlnbkZhY3Rvcnkuc2luZ2xlUXVlcnkoJHNjb3BlLnNlbGVjdGVkUXVlcnkuUXVlcnlJRCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscyA9IG5ldyBQZW5kaW5nQ2FtcGFpZ24oZGF0YS5kYXRhKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmNhbXBhaWduRGV0YWlscylcbiAgICAgICAgICAgICRzY29wZS5mZXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICB9O1xuICAgIGlmKCRzdGF0ZS5wYXJhbXMuY2FtcGFpZ25JRCAhPVwiXCIpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlllcyB0aGVyZSdzIHBhcmFtc1wiKTtcbiAgICAgICAgLy8gVE9ETyBhbHdheXMgZmlyZXMgc2V0QmlsbEdyb3VwXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFF1ZXJ5ID0ge1Byb2R1Y3RJRDogMSwgUXVlcnlJRDogJHN0YXRlLnBhcmFtcy5jYW1wYWlnbklEIHx8IDEsIE5hbWU6IFwibW8gdGVzdFwifVxuICAgICAgICAkc2NvcGUuc2V0QmlsbEdyb3VwKCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoYW5nZVN0YXRlID0gKGJsZWgpID0+IHtcbiAgICAgICAgJHN0YXRlLmdvKCdob21lLmNhbXBhaWduLmRldGFpbHMnLCB7cGFyYW1zOicxMzM3J30pXG4gICAgfTtcblxuICAgICRzY29wZS5uZXdBY3Rpdml0eSA9IHt9O1xuICAgICRzY29wZS5zYXZlZEFjdGl2aXRpZXMgPSBbXTtcbiAgICAkc2NvcGUuYWN0aXZpdHlObyA9IDA7XG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlcjtcbiAgICB2YXIgYWN0aXZpdHlfb3JkZXIgPSAxO1xuICAgICRzY29wZS5zYXZlQWN0aXZpdHkgPSAoKSA9PiB7XG4gICAgICAgIHZhciBbYWN0aXZpdHlNb2RlbCwgYWN0aXZpdHlNZXRob2RzXSA9IGFjdGl2aXR5RmFjdG9yeVxuICAgICAgICAvLyBjbGFzcyBOZXdBY3Rpdml0eSBwYXJzZXMgdGhlIGRhdGVzXG4gICAgICAgIHZhciBhY3Rpdml0eU1vZGVsID0gbmV3IE5ld0FjdGl2aXR5KGFjdGl2aXR5TW9kZWwpO1xuICAgICAgICB2YXIgY0lEID0gJHNjb3BlLmNhbXBhaWduSURcbiAgICAgICAgYWN0aXZpdHlNZXRob2RzLnNhdmVBY3Rpdml0eV9hbmRfdGhlbl9kb19BdHRhY2htZW50cyhjSUQsIGFjdGl2aXR5TW9kZWwpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGRhdGEuT3JkZXIgPSBhY3Rpdml0eV9vcmRlclxuICAgICAgICAgICAgYWN0aXZpdHlfb3JkZXIrK1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzP1wiLCBkYXRhKVxuICAgICAgICAgICAgJHNjb3BlLnNhdmVkQWN0aXZpdGllcy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgJHNjb3BlLnNhdmVkQWN0aXZpdGllcy5zb3J0KGNvbXBhcmVEYXRlcylcbiAgICAgICAgICAgIC8vaWYgdGhlIGxhc3Qgb25lLCBhZnRlciBzb3J0aW5nLCBpcyBub3QgdGhlIG9uZSB3ZSBqdXN0IGFkZGVkXG4gICAgICAgICAgICBpZigkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzWyRzY29wZS5zYXZlZEFjdGl2aXRpZXMubGVuZ3RoIC0gMV0gIT0gZGF0YSl7XG4gICAgICAgICAgICAgICAgLy8gdGhlbiBnaXZlIHRoZW0gYWxsIG5ldyAnb3JkZXInIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAvLyBhbmQgcmVzZW5kIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldob2Egd2hvYSwgdGltZSBtaXh1cC4uLlwiKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLnNhdmVkQWN0aXZpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzW2ldLk9yZGVyID0gaSsxO1xuICAgICAgICAgICAgICAgICAgICAvL3NlbmQgdGhvc2UgdG8gdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUuYWN0aXZpdHlObysrO1xuICAgICAgICAgICAgJHNjb3BlLm5ld0FjdGl2aXR5ID0ge307XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJEdWRlLi4uLlwiLCBlcnIpXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjb21wYXJlRGF0ZXMoYSwgYikge1xuICAgICAgICByZXR1cm4gbW9tZW50KGEuU3RhcnREYXRlVGltZSkuaXNBZnRlcihiLlN0YXJ0RGF0ZVRpbWUpOyBcbiAgICB9XG5cbn0pXG4iLCJjbGFzcyBQZW5kaW5nQ2FtcGFpZ24ge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuUGFyYW1TdHJVbnBhY2tlZCA9ICcnO1xuICAgICAgICB2YXIgcGFyYW1PYmogPSAkLmRlcGFyYW0ob2JqLlBhcmFtU3RyKVxuICAgICAgICBPYmplY3Qua2V5cyggcGFyYW1PYmogKS5mb3JFYWNoKChrZXkgKT0+e1xuICAgICAgICAgICAgdGhpcy5QYXJhbVN0clVucGFja2VkICs9IGtleSArIFwiID0gXCIgKyBwYXJhbU9ialtrZXldICsgXCI7IFwiO1xuICAgICAgICB9KVxuICAgIH1cbn1cbiIsImNsYXNzIEFjdGl2aXR5MiB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICB9XG59XG4iLCJjbGFzcyBDYW1wYWlnbiB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgdGhpcy5BY3Rpdml0aWVzID0gW1xuICAgICAgICAgICAgZm9yICh4IG9mIG9iai5BY3Rpdml0aWVzKSBuZXcgTmV3QWN0aXZpdHkoeClcbiAgICAgICAgXVxuICAgICAgICB0aGlzLlByb3NwZWN0Q291bnQgPSBvYmouUHJvc3BlY3RzLmxlbmd0aFxuICAgICAgICB0aGlzLkFjdGl2aXR5Q291bnQgPSBvYmouQWN0aXZpdGllcy5sZW5ndGhcbiAgICB9XG4gICAgLy8gcmV0dXJucyB7RGVzY3IsIFN0YXJ0RGF0ZVRpbWUsIENvbXBsZXRpb25EYXRlVGltZX0gZnJvbSB0aGlzLkFjdGl2aXRlc1xuICAgIGdldCBldmVudHMoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBmb3IgKHtcbiAgICAgICAgICAgICAgICAgICAgRGVzY3IsIFN0YXJ0RGF0ZVRpbWUsIENvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvZiB0aGlzLkFjdGl2aXRpZXMpIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogRGVzY3IsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IFN0YXJ0RGF0ZVRpbWUsXG4gICAgICAgICAgICAgICAgZW5kOiBDb21wbGV0aW9uRGF0ZVRpbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbn1cbiIsImNsYXNzIEN1c3RvbWVyIHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAvLyB0aGlzLl9BbHBoYSA9IHtBdmFpbGFibGVDcmVkaXQgOiBvYmouQXZhaWxhYmxlQ3JlZGl0fVxuICAgICAgICB0aGlzLk9yZGVyaW5nTWV0aG9kcyA9IFsgZm9yKHggb2YgT2JqZWN0LmtleXMoe0NyeFNldHVwOiBvYmouQ3J4U2V0dXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU09TU2V0dXA6IG9iai5DU09TU2V0dXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFV09NU2V0dXA6IG9iai5FV09NU2V0dXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQQkFPU2V0dXA6IG9iai5QQkFPU2V0dXB9KSApaWYgKG9ialt4XSA9PSAwKSB4XS50b1N0cmluZygpO1xuICAgIH1cbn1cbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ2tpbUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0LCBwcm9zcGVjdEZhY3RvcnksICRtb2RhbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvIGtpbVwiKVxuICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0O1xuICAgICAgICAkc2NvcGUuQ29udGFjdHMgPSBbXTtcbiAgICAgICAgcHJvc3BlY3RGYWN0b3J5LmdldFByb3NwZWN0X2J5X0lEKCRzdGF0ZS5wYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgcHJvc3BlY3RcIiwgZGF0YSlcbiAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QgPSBuZXcgUHJvc3BlY3QoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS50aGVfUHJvc3BlY3QubGF0ZXN0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50aGVfUHJvc3BlY3QpXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbnRhY3QgPSAkc2NvcGUudGhlX1Byb3NwZWN0LkNvbnRhY3RzWzBdXG4gICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXMucmV2ZXJzZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgJHNjb3BlLmNvbnRhY3RzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmlzc3Vlc0NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5ub3Rlc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAvL2NvbnRhY3RzIHRhYnNcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0XG4gICAgICAgICRzY29wZS5vbkNsaWNrVGFiID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0ID0gY29udGFjdFxuICAgICAgICB9XG4gICAgICAgICRzY29wZS5pc0FjdGl2ZVRhYiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250YWN0ID09ICRzY29wZS5jdXJyZW50Q29udGFjdDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IDE7XG5cblxuICAgICAgICAkc2NvcGUuYWRkQ29udGFjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG15TW9kYWwgPSAkbW9kYWwoe1xuICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hZGRfY29udGFjdC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignbGFuZGluZ0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgVGFza3MpIHtcbiAgY29uc29sZS5sb2coXCJMYW5kaW5nIENvbnRyb2xsZXJcIilcbiAgLy8gUGFzc2VkIGluIFRhc2tzIGZhY3RvcnkuLi53ZSdsbCBoYW5kbGUgaXQgYWxsIGhlcmUgZm9yIG5vd1xuXG4gIGlmKCEkcm9vdFNjb3BlLmxvZ2dlZEluKXtcbiAgICBjb25zb2xlLmxvZyhcIk5vdCBsb2dnZWQgaW4sIHJlZGlyZWN0XCIpXG4gICAgJHN0YXRlLmdvKFwibG9naW5cIik7XG4gIH1cblxuICAkc2NvcGUuZHJvcGRvd24gPSBbXG4gIHtcbiAgICBcInRleHRcIjogXCJOZXcgQ2FtcGFpZ25cIixcbiAgICBcImNsaWNrXCI6ICckc3RhdGUuZ28oXCJob21lLmNhbXBhaWduLm5ld1wiKSdcbiAgfSxcbiAge1xuICAgIFwidGV4dFwiOiBcIlNhdmVkIENhbXBhaWduc1wiLFxuICAgIFwiY2xpY2tcIjogJyRzdGF0ZS5nbyhcImhvbWUuY2FtcGFpZ25cIiknXG4gIH1cbiAgLy8ge1xuICAvLyAgIFwiZGl2aWRlclwiOiB0cnVlXG4gIC8vIH0sXG4gIC8vIHtcbiAgLy8gICBcInRleHRcIjogXCJOZXcgUXVlcnlcIixcbiAgLy8gICBcImNsaWNrXCI6ICckc3RhdGUuZ28oXCJob21lLnF1ZXJ5XCIpJ1xuICAvLyB9XG5cbl07XG5cblxuJHNjb3BlLmluTWFya2V0aW5nID0gZmFsc2VcblxuXG5pZigkcm9vdFNjb3BlLmNyZWRlbnRpYWxzLmdyb3VwID09IFwiTWFya2V0aW5nXCIpe1xuICAkc2NvcGUuaW5NYXJrZXRpbmcgPSB0cnVlO1xuXG4gIC8vIGRldGVybWluZWQgdGhlaXIgZ3JvdXAsIHJlbmRlcmVkIHZpZXcsIG5vdyB0byBmZXRjaCB0YXNrcy5cbiAgLy8gZG8gd2Ugd2FudCB0byBkbyB0aGlzIGluIHRoZSBsYW5kaW5nIGNvbnRyb2xsZXI/XG4gIC8vIG9yIGEgVGFza3MgY29udHJvbGxlcj8gV2l0aCBhIHRhc2tzIHZpZXc/XG4gIHZhciB0aGlzVXNlcnNHcm91cCA9ICRyb290U2NvcGUuY3JlZGVudGlhbHNcblxuICAkc2NvcGUuYWxsVGFza3MgPSBbXVxuICB2YXIgZmV0Y2ggPSBUYXNrcy5teVRhc2tzKHRoaXNVc2Vyc0dyb3VwKTtcbiAgdmFyIHNob3dUYXNrcyA9IGZldGNoLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJTaG93IHRhc2tzLi4uLlwiLCBkYXRhKVxuICAgICRzY29wZS5hbGxUYXNrcyA9IGRhdGEuZGF0YVxuICB9KVxuXG59XG5cblxud2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbnRyaWVzID0gd2luZG93LnBlcmZvcm1hbmNlLmdldEVudHJpZXMoKTtcblxuICAgICAgICBlbnRyaWVzID0gZW50cmllcy5zb3J0KCBmdW5jdGlvbiggYSwgYiApIHtcbiAgICAgICAgICAgIHJldHVybiBiLmR1cmF0aW9uIC0gYS5kdXJhdGlvbjtcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRyb290U2NvcGUubWV0cmljcyA9IGVudHJpZXM7XG59LCA1MDApO1xuXG5cblxuXG59KSIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnVGFza3MnLFxuIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHF1ZXJ5UmVzdWx0czpmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9jYW1wYWlnbnMnKVxuICAgICAgICB9LFxuICAgICAgICBteVRhc2tzOmZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhY3RvcnkgVEFTS1MgZ2V0dGluZyBteVRhc2tzLi5cIiwgZGF0YSlcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3VzZXJ0YXNrcycsIGRhdGEpXG4gICAgICAgIH0sXG4gICAgICAgIHRhc2tEZXRhaWxzOmZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhY3RvcnkgVEFTS1MgZ2V0dGluZyBkZXRhaWxzLi5cIiwgZGF0YSlcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Rhc2tkZXRhaWxzJywgZGF0YSlcbiAgICAgICAgfSxcbiAgICAgICAgYWxsVGFza3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJGYWN0b3J5IHRhc2tzIHJldHVybmluZyBldmVyeSB0YXNrLi4uXCIpXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9hbGx0YXNrcycpXG4gICAgICAgIH0sXG4gICAgICAgIHRhc2tQcm9zcGVjdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyB0aGlzIHdvdWxkIGJlIGEgcG9zdCB3aXRoIGxpa2UsIHRhc2tJRCA9PSBwcm9zcGVjdC50YXNrSURcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3JhbmRvbVByb3NwZWN0JylcbiAgICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuc2VydmljZSgnTG9naW5TZXJ2aWNlJywgZnVuY3Rpb24oJGNvb2tpZXMsICRodHRwLCBQcml2aWxlZ2UpIHtcbiAgICAgICAgY2xhc3MgVXNlciB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnZXQgdXNlcigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51c2VyaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIExvZ2luU2VydmljZSA9IHt9XG4gICAgICAgIExvZ2luU2VydmljZS5zZXRVc2VyID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgTG9naW5TZXJ2aWNlLnVzZXIgPSBuZXcgVXNlcih1c2VyKTtcbiAgICAgICAgICAgIFByaXZpbGVnZS5TZXRTZXNzaW9uKHVzZXIua2V5LCB0aGlzLnVzZXIudXNlciwgdGhpcy51c2VyKVxuICAgICAgICB9XG4gICAgICAgIExvZ2luU2VydmljZS5jb29raWVfdXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRjb29raWVzLnVzZXJpZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBMb2dpblNlcnZpY2UudXNlciA9IG5ldyBVc2VyKHt9KTtcbiAgICAgICAgcmV0dXJuIExvZ2luU2VydmljZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBQcml2aWxlZ2UsIExvZ2luU2VydmljZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnRyb2xsZXIgbG9hZGVkXCIpXG4gICAgICAgICRzY29wZS5jcmVkcyA9IHt9O1xuICAgICAgICAkc2NvcGUuY3JlZHMudXNlcmlkID0gTG9naW5TZXJ2aWNlLmNvb2tpZV91c2VyXG4gICAgICAgICRzY29wZS5sb2dpblN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgUHJpdmlsZWdlLkxvZ2luKCRzY29wZS5jcmVkcykudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIExvZ2luU2VydmljZS5zZXRVc2VyKGRhdGEuZGF0YSlcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJob21lXCIpO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5mYWN0b3J5KCdQcml2aWxlZ2UnLCBmdW5jdGlvbigkcmVzb3VyY2UsICRodHRwLCAkcSwgJGNvb2tpZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJGYWN0b3J5IGxvYWRlZFwiKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgTG9naW46IGZ1bmN0aW9uKGNyZWRzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQT1NUIERVREVcIiwgY3JlZHMpXG4gICAgICAgICAgICAgICAgZGVsZXRlICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYS2V5J107XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0F1dGgnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiAkLnBhcmFtKGNyZWRzKSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIExvZ291dDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb2RvXCIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2V0U2Vzc2lvbjogZnVuY3Rpb24oeGtleTogc3RyaW5nLCB1c2VyaWQ6IHN0cmluZywgcGJhdXNlcikge1xuICAgICAgICAgICAgICAgICRjb29raWVzLnhrZXkgPSB4a2V5O1xuICAgICAgICAgICAgICAgICRjb29raWVzLnVzZXJpZCA9IHVzZXJpZDtcbiAgICAgICAgICAgICAgICAvLyAkY29va2llcy5wYmF1c2VyID0gcGJhdXNlcjtcbiAgICAgICAgICAgICAgICAvLyBmb3IgKHZhciBrZXkgaW4gcGJhdXNlcikge1xuICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcInVzZXJcIiwga2V5KVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWEtleSddID0geGtleVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ2FsZXJ0RmFjdG9yeScsXG4vLyBub3cgUmVzZWFyY2ggRmFjdG9yeVxuIGZ1bmN0aW9uICgkYWxlcnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhbGVydHM6IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWxlcnRcIiwgbWVzc2FnZSlcbiAgICAgICAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IG1lc3NhZ2UuY29uZmlnLnVybCxcbiAgICAgICAgICBjb250ZW50OiBtZXNzYWdlLnN0YXR1c1RleHQsXG4gICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgICAgIGR1cmF0aW9uOiAzXG4gICAgICAgICAgLy8gY29udGFpbmVyOiBcImJvZHlcIlxuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gIH1cbik7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAuZGlyZWN0aXZlKCdjb2xsYXBzZScsIFsnJHRyYW5zaXRpb24nLCBmdW5jdGlvbiAoJHRyYW5zaXRpb24pIHtcblxuICAgIHJldHVybiB7XG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgdmFyIGluaXRpYWxBbmltU2tpcCA9IHRydWU7XG4gICAgICAgIHZhciBjdXJyZW50VHJhbnNpdGlvbjtcblxuICAgICAgICBmdW5jdGlvbiBkb1RyYW5zaXRpb24oY2hhbmdlKSB7XG4gICAgICAgICAgdmFyIG5ld1RyYW5zaXRpb24gPSAkdHJhbnNpdGlvbihlbGVtZW50LCBjaGFuZ2UpO1xuICAgICAgICAgIGlmIChjdXJyZW50VHJhbnNpdGlvbikge1xuICAgICAgICAgICAgY3VycmVudFRyYW5zaXRpb24uY2FuY2VsKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRUcmFuc2l0aW9uID0gbmV3VHJhbnNpdGlvbjtcbiAgICAgICAgICBuZXdUcmFuc2l0aW9uLnRoZW4obmV3VHJhbnNpdGlvbkRvbmUsIG5ld1RyYW5zaXRpb25Eb25lKTtcbiAgICAgICAgICByZXR1cm4gbmV3VHJhbnNpdGlvbjtcblxuICAgICAgICAgIGZ1bmN0aW9uIG5ld1RyYW5zaXRpb25Eb25lKCkge1xuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGl0J3MgdGhpcyB0cmFuc2l0aW9uLCBvdGhlcndpc2UsIGxlYXZlIGl0IGFsb25lLlxuICAgICAgICAgICAgaWYgKGN1cnJlbnRUcmFuc2l0aW9uID09PSBuZXdUcmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRUcmFuc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4cGFuZCgpIHtcbiAgICAgICAgICBpZiAoaW5pdGlhbEFuaW1Ta2lwKSB7XG4gICAgICAgICAgICBpbml0aWFsQW5pbVNraXAgPSBmYWxzZTtcbiAgICAgICAgICAgIGV4cGFuZERvbmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2UnKS5hZGRDbGFzcygnY29sbGFwc2luZycpO1xuICAgICAgICAgICAgZG9UcmFuc2l0aW9uKHsgaGVpZ2h0OiBlbGVtZW50WzBdLnNjcm9sbEhlaWdodCArICdweCcgfSkudGhlbihleHBhbmREb25lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBleHBhbmREb25lKCkge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKTtcbiAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdjb2xsYXBzZSBpbicpO1xuICAgICAgICAgIGVsZW1lbnQuY3NzKHtoZWlnaHQ6ICdhdXRvJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29sbGFwc2UoKSB7XG4gICAgICAgICAgaWYgKGluaXRpYWxBbmltU2tpcCkge1xuICAgICAgICAgICAgaW5pdGlhbEFuaW1Ta2lwID0gZmFsc2U7XG4gICAgICAgICAgICBjb2xsYXBzZURvbmUoKTtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHtoZWlnaHQ6IDB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQ1NTIHRyYW5zaXRpb25zIGRvbid0IHdvcmsgd2l0aCBoZWlnaHQ6IGF1dG8sIHNvIHdlIGhhdmUgdG8gbWFudWFsbHkgY2hhbmdlIHRoZSBoZWlnaHQgdG8gYSBzcGVjaWZpYyB2YWx1ZVxuICAgICAgICAgICAgZWxlbWVudC5jc3MoeyBoZWlnaHQ6IGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ICsgJ3B4JyB9KTtcbiAgICAgICAgICAgIC8vdHJpZ2dlciByZWZsb3cgc28gYSBicm93c2VyIHJlYWxpemVzIHRoYXQgaGVpZ2h0IHdhcyB1cGRhdGVkIGZyb20gYXV0byB0byBhIHNwZWNpZmljIHZhbHVlXG4gICAgICAgICAgICB2YXIgeCA9IGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlIGluJykuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKTtcblxuICAgICAgICAgICAgZG9UcmFuc2l0aW9uKHsgaGVpZ2h0OiAwIH0pLnRoZW4oY29sbGFwc2VEb25lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb2xsYXBzZURvbmUoKSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpO1xuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS4kd2F0Y2goYXR0cnMuY29sbGFwc2UsIGZ1bmN0aW9uIChzaG91bGRDb2xsYXBzZSkge1xuICAgICAgICAgIGlmIChzaG91bGRDb2xsYXBzZSkge1xuICAgICAgICAgICAgY29sbGFwc2UoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwYW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XSlcbiAgLmZhY3RvcnkoJyR0cmFuc2l0aW9uJywgWyckcScsICckdGltZW91dCcsICckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHEsICR0aW1lb3V0LCAkcm9vdFNjb3BlKSB7XG5cbiAgdmFyICR0cmFuc2l0aW9uID0gZnVuY3Rpb24oZWxlbWVudCwgdHJpZ2dlciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgdmFyIGVuZEV2ZW50TmFtZSA9ICR0cmFuc2l0aW9uW29wdGlvbnMuYW5pbWF0aW9uID8gJ2FuaW1hdGlvbkVuZEV2ZW50TmFtZScgOiAndHJhbnNpdGlvbkVuZEV2ZW50TmFtZSddO1xuXG4gICAgdmFyIHRyYW5zaXRpb25FbmRIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICBlbGVtZW50LnVuYmluZChlbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmRIYW5kbGVyKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShlbGVtZW50KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoZW5kRXZlbnROYW1lKSB7XG4gICAgICBlbGVtZW50LmJpbmQoZW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kSGFuZGxlcik7XG4gICAgfVxuXG4gICAgLy8gV3JhcCBpbiBhIHRpbWVvdXQgdG8gYWxsb3cgdGhlIGJyb3dzZXIgdGltZSB0byB1cGRhdGUgdGhlIERPTSBiZWZvcmUgdGhlIHRyYW5zaXRpb24gaXMgdG8gb2NjdXJcbiAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmICggYW5ndWxhci5pc1N0cmluZyh0cmlnZ2VyKSApIHtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyh0cmlnZ2VyKTtcbiAgICAgIH0gZWxzZSBpZiAoIGFuZ3VsYXIuaXNGdW5jdGlvbih0cmlnZ2VyKSApIHtcbiAgICAgICAgdHJpZ2dlcihlbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoIGFuZ3VsYXIuaXNPYmplY3QodHJpZ2dlcikgKSB7XG4gICAgICAgIGVsZW1lbnQuY3NzKHRyaWdnZXIpO1xuICAgICAgfVxuICAgICAgLy9JZiBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdHJhbnNpdGlvbnMsIGluc3RhbnRseSByZXNvbHZlXG4gICAgICBpZiAoICFlbmRFdmVudE5hbWUgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoZWxlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgb3VyIGN1c3RvbSBjYW5jZWwgZnVuY3Rpb24gdG8gdGhlIHByb21pc2UgdGhhdCBpcyByZXR1cm5lZFxuICAgIC8vIFdlIGNhbiBjYWxsIHRoaXMgaWYgd2UgYXJlIGFib3V0IHRvIHJ1biBhIG5ldyB0cmFuc2l0aW9uLCB3aGljaCB3ZSBrbm93IHdpbGwgcHJldmVudCB0aGlzIHRyYW5zaXRpb24gZnJvbSBlbmRpbmcsXG4gICAgLy8gaS5lLiBpdCB3aWxsIHRoZXJlZm9yZSBuZXZlciByYWlzZSBhIHRyYW5zaXRpb25FbmQgZXZlbnQgZm9yIHRoYXQgdHJhbnNpdGlvblxuICAgIGRlZmVycmVkLnByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIGVuZEV2ZW50TmFtZSApIHtcbiAgICAgICAgZWxlbWVudC51bmJpbmQoZW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kSGFuZGxlcik7XG4gICAgICB9XG4gICAgICBkZWZlcnJlZC5yZWplY3QoJ1RyYW5zaXRpb24gY2FuY2VsbGVkJyk7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9O1xuXG4gIC8vIFdvcmsgb3V0IHRoZSBuYW1lIG9mIHRoZSB0cmFuc2l0aW9uRW5kIGV2ZW50XG4gIHZhciB0cmFuc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cmFucycpO1xuICB2YXIgdHJhbnNpdGlvbkVuZEV2ZW50TmFtZXMgPSB7XG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgJ01velRyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgJ09UcmFuc2l0aW9uJzogJ29UcmFuc2l0aW9uRW5kJyxcbiAgICAndHJhbnNpdGlvbic6ICd0cmFuc2l0aW9uZW5kJ1xuICB9O1xuICB2YXIgYW5pbWF0aW9uRW5kRXZlbnROYW1lcyA9IHtcbiAgICAnV2Via2l0VHJhbnNpdGlvbic6ICd3ZWJraXRBbmltYXRpb25FbmQnLFxuICAgICdNb3pUcmFuc2l0aW9uJzogJ2FuaW1hdGlvbmVuZCcsXG4gICAgJ09UcmFuc2l0aW9uJzogJ29BbmltYXRpb25FbmQnLFxuICAgICd0cmFuc2l0aW9uJzogJ2FuaW1hdGlvbmVuZCdcbiAgfTtcbiAgZnVuY3Rpb24gZmluZEVuZEV2ZW50TmFtZShlbmRFdmVudE5hbWVzKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBlbmRFdmVudE5hbWVzKXtcbiAgICAgIGlmICh0cmFuc0VsZW1lbnQuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZW5kRXZlbnROYW1lc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgJHRyYW5zaXRpb24udHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9IGZpbmRFbmRFdmVudE5hbWUodHJhbnNpdGlvbkVuZEV2ZW50TmFtZXMpO1xuICAkdHJhbnNpdGlvbi5hbmltYXRpb25FbmRFdmVudE5hbWUgPSBmaW5kRW5kRXZlbnROYW1lKGFuaW1hdGlvbkVuZEV2ZW50TmFtZXMpO1xuICByZXR1cm4gJHRyYW5zaXRpb247XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZpbHRlcignc2VsZWN0ZWRUYWdzJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhc2tzLCB0YWdzKSB7XG4gICAgICAgIHJldHVybiB0YXNrcy5maWx0ZXIoZnVuY3Rpb24odGFzaykge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIHRhc2suVGFncykge1xuICAgICAgICAgICAgICAgIGlmICh0YWdzLmluZGV4T2YodGFza1tpXSkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignbmF2YmFyU2VhcmNoZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0LCBwcm9zcGVjdEZhY3RvcnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIkhlbGxvIG5hdmJhclwiKVxuICAgICRzY29wZS5wb3BvdmVyID0ge1xuICAgICAgXCJ0aXRsZVwiOiBcIlRpdGxlXCIsXG4gICAgICBcImNvbnRlbnRcIjogXCJIZWxsbyBQb3BvdmVyPGJyIC8+VGhpcyBpcyBhIG11bHRpbGluZSBtZXNzYWdlIVwiXG4gICAgfTtcblxuICAgICRzY29wZS5kb29kbyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRG9vXCIpXG4gICAgfVxuXG4gICAgJHNjb3BlLmJ1dHRvbiA9IHtcbiAgXCJ0b2dnbGVcIjogZmFsc2UsXG4gIFwiY2hlY2tib3hcIjoge1xuICAgIFwibGVmdFwiOiBmYWxzZSxcbiAgICBcIm1pZGRsZVwiOiB0cnVlLFxuICAgIFwicmlnaHRcIjogZmFsc2VcbiAgfSxcbiAgXCJyYWRpb1wiOiAyXG59O1xuXG5cbiRzY29wZS5jb2xvciA9ICdibHVlJztcbiAgICAgICRzY29wZS5zcGVjaWFsVmFsdWUgPSB7XG4gICAgICAgIFwiaWRcIjogXCIxMjM0NVwiLFxuICAgICAgICBcInZhbHVlXCI6IFwiZ3JlZW5cIlxuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnBvcG92ZXIgPSB7XG4gIFwidGl0bGVcIjogXCJDb2Nrc1wiLFxuICBcImNvbnRlbnRcIjogXCJIZWxsbyBQb3BvdmVyPGJyIC8+VGhpcyBpcyBhIG11bHRpbGluZSBtZXNzYWdlIVwiXG59O1xuXG59KVxuIiwiLyoqXG4gKiBkaXJQYWdpbmF0aW9uIC0gQW5ndWxhckpTIG1vZHVsZSBmb3IgcGFnaW5hdGluZyAoYWxtb3N0KSBhbnl0aGluZy5cbiAqXG4gKlxuICogQ3JlZGl0c1xuICogPT09PT09PVxuICpcbiAqIERhbmllbCBUYWJ1ZW5jYTogaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9kL21zZy9hbmd1bGFyL2FuOVFwenFJWWlNL3I4di0zVzFYNXZjSlxuICogZm9yIHRoZSBpZGVhIG9uIGhvdyB0byBkeW5hbWljYWxseSBpbnZva2UgdGhlIG5nLXJlcGVhdCBkaXJlY3RpdmUuXG4gKlxuICogSSBib3Jyb3dlZCBhIGNvdXBsZSBvZiBsaW5lcyBhbmQgYSBmZXcgYXR0cmlidXRlIG5hbWVzIGZyb20gdGhlIEFuZ3VsYXJVSSBCb290c3RyYXAgcHJvamVjdDpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9zcmMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmpzXG4gKlxuICogQ3JlYXRlZCBieSBNaWNoYWVsIG9uIDA0LzA1LzE0LlxuICovXG5cbmFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmRpcmVjdGl2ZSgnZGlyUGFnaW5hdGUnLCBbJyRjb21waWxlJywgJyRwYXJzZScsICckdGltZW91dCcsICdwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKCRjb21waWxlLCAkcGFyc2UsICR0aW1lb3V0LCBwYWdpbmF0aW9uU2VydmljZSkge1xuICAgICAgICByZXR1cm4gIHtcbiAgICAgICAgICAgIHByaW9yaXR5OiA1MDAwLCAvL0hpZ2ggcHJpb3JpdHkgbWVhbnMgaXQgd2lsbCBleGVjdXRlIGZpcnN0XG4gICAgICAgICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCduZ1JlcGVhdCcsIGF0dHJzLmRpclBhZ2luYXRlKTsgLy9BZGQgbmctcmVwZWF0IHRvIHRoZSBkb21cblxuICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gYXR0cnMuZGlyUGFnaW5hdGU7XG4gICAgICAgICAgICAgICAgLy8gcmVnZXggdGFrZW4gZGlyZWN0bHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvbWFzdGVyL3NyYy9uZy9kaXJlY3RpdmUvbmdSZXBlYXQuanMjTDIxMVxuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goL15cXHMqKFtcXHNcXFNdKz8pXFxzK2luXFxzKyhbXFxzXFxTXSs/KSg/Olxccyt0cmFja1xccytieVxccysoW1xcc1xcU10rPykpP1xccyokLyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZmlsdGVyUGF0dGVybiA9IC9cXHxcXHMqaXRlbXNQZXJQYWdlOltefF0qLztcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0ubWF0Y2goZmlsdGVyUGF0dGVybikgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJwYWdpbmF0aW9uIGRpcmVjdGl2ZTogdGhlICdpdGVtc1BlclBhZ2UnIGZpbHRlciBtdXN0IGJlIHNldC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1zUGVyUGFnZUZpbHRlclJlbW92ZWQgPSBtYXRjaFsyXS5yZXBsYWNlKGZpbHRlclBhdHRlcm4sICcnKTtcbiAgICAgICAgICAgICAgICB2YXIgY29sbGVjdGlvbkdldHRlciA9ICRwYXJzZShpdGVtc1BlclBhZ2VGaWx0ZXJSZW1vdmVkKTtcblxuICAgICAgICAgICAgICAgIC8vTm93IHRoYXQgd2UgYWRkZWQgbmctcmVwZWF0IHRvIHRoZSBlbGVtZW50LCBwcm9jZWVkIHdpdGggY29tcGlsYXRpb25cbiAgICAgICAgICAgICAgICAvL2J1dCBza2lwIGRpcmVjdGl2ZXMgd2l0aCBwcmlvcml0eSA1MDAwIG9yIGFib3ZlIHRvIGF2b2lkIGluZmluaXRlXG4gICAgICAgICAgICAgICAgLy9yZWN1cnNpb24gKHdlIGRvbid0IHdhbnQgdG8gY29tcGlsZSBvdXJzZWx2ZXMgYWdhaW4pXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBpbGVkID0gICRjb21waWxlKGVsZW1lbnQsIG51bGwsIDUwMDApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYWdpbmF0aW9uSWQ7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25JZCA9IGF0dHJzLnBhZ2luYXRpb25JZCB8fCBcIl9fZGVmYXVsdFwiO1xuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5yZWdpc3Rlckluc3RhbmNlKHBhZ2luYXRpb25JZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRQYWdlR2V0dGVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cnMuY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlR2V0dGVyID0gJHBhcnNlKGF0dHJzLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50LXBhZ2UgYXR0cmlidXRlIHdhcyBub3Qgc2V0LCB3ZSdsbCBtYWtlIG91ciBvd25cbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLl9fY3VycmVudFBhZ2UgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2VHZXR0ZXIgPSAkcGFyc2UoJ19fY3VycmVudFBhZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRDdXJyZW50UGFnZVBhcnNlcihwYWdpbmF0aW9uSWQsIGN1cnJlbnRQYWdlR2V0dGVyLCBzY29wZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRycy50b3RhbEl0ZW1zICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0QXN5bmNNb2RlVHJ1ZShwYWdpbmF0aW9uSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMudG90YWxJdGVtcykoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwIDwgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbkdldHRlcihzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQsIGNvbGxlY3Rpb24ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL1doZW4gbGlua2luZyBqdXN0IGRlbGVnYXRlIHRvIHRoZSBsaW5rIGZ1bmN0aW9uIHJldHVybmVkIGJ5IHRoZSBuZXcgY29tcGlsZVxuICAgICAgICAgICAgICAgICAgICBjb21waWxlZChzY29wZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSlcblxuICAgIC5kaXJlY3RpdmUoJ2RpclBhZ2luYXRpb25Db250cm9scycsIFsncGFnaW5hdGlvblNlcnZpY2UnLCBmdW5jdGlvbihwYWdpbmF0aW9uU2VydmljZSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgYW4gYXJyYXkgb2YgcGFnZSBudW1iZXJzIChvciB0aGUgJy4uLicgc3RyaW5nKSB3aGljaCBpcyB1c2VkIGluIGFuIG5nLXJlcGVhdCB0byBnZW5lcmF0ZSB0aGVcbiAgICAgICAgICogbGlua3MgdXNlZCBpbiBwYWdpbmF0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBjdXJyZW50UGFnZVxuICAgICAgICAgKiBAcGFyYW0gcm93c1BlclBhZ2VcbiAgICAgICAgICogQHBhcmFtIHBhZ2luYXRpb25SYW5nZVxuICAgICAgICAgKiBAcGFyYW0gY29sbGVjdGlvbkxlbmd0aFxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVBhZ2VzQXJyYXkoY3VycmVudFBhZ2UsIGNvbGxlY3Rpb25MZW5ndGgsIHJvd3NQZXJQYWdlLCBwYWdpbmF0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwoY29sbGVjdGlvbkxlbmd0aCAvIHJvd3NQZXJQYWdlKTtcbiAgICAgICAgICAgIHZhciBoYWxmV2F5ID0gTWF0aC5jZWlsKHBhZ2luYXRpb25SYW5nZSAvIDIpO1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudFBhZ2UgPD0gaGFsZldheSkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG90YWxQYWdlcyAtIGhhbGZXYXkgPCBjdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gJ2VuZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gJ21pZGRsZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbGxpcHNlc05lZWRlZCA9IHBhZ2luYXRpb25SYW5nZSA8IHRvdGFsUGFnZXM7XG4gICAgICAgICAgICB2YXIgaSA9IDE7XG4gICAgICAgICAgICB3aGlsZSAoaSA8PSB0b3RhbFBhZ2VzICYmIGkgPD0gcGFnaW5hdGlvblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2VOdW1iZXIgPSBjYWxjdWxhdGVQYWdlTnVtYmVyKGksIGN1cnJlbnRQYWdlLCBwYWdpbmF0aW9uUmFuZ2UsIHRvdGFsUGFnZXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG9wZW5pbmdFbGxpcHNlc05lZWRlZCA9IChpID09PSAyICYmIChwb3NpdGlvbiA9PT0gJ21pZGRsZScgfHwgcG9zaXRpb24gPT09ICdlbmQnKSk7XG4gICAgICAgICAgICAgICAgdmFyIGNsb3NpbmdFbGxpcHNlc05lZWRlZCA9IChpID09PSBwYWdpbmF0aW9uUmFuZ2UgLSAxICYmIChwb3NpdGlvbiA9PT0gJ21pZGRsZScgfHwgcG9zaXRpb24gPT09ICdzdGFydCcpKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxsaXBzZXNOZWVkZWQgJiYgKG9wZW5pbmdFbGxpcHNlc05lZWRlZCB8fCBjbG9zaW5nRWxsaXBzZXNOZWVkZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goJy4uLicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2gocGFnZU51bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkgKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFnZXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2l2ZW4gdGhlIHBvc2l0aW9uIGluIHRoZSBzZXF1ZW5jZSBvZiBwYWdpbmF0aW9uIGxpbmtzIFtpXSwgZmlndXJlIG91dCB3aGF0IHBhZ2UgbnVtYmVyIGNvcnJlc3BvbmRzIHRvIHRoYXQgcG9zaXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBpXG4gICAgICAgICAqIEBwYXJhbSBjdXJyZW50UGFnZVxuICAgICAgICAgKiBAcGFyYW0gcGFnaW5hdGlvblJhbmdlXG4gICAgICAgICAqIEBwYXJhbSB0b3RhbFBhZ2VzXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlUGFnZU51bWJlcihpLCBjdXJyZW50UGFnZSwgcGFnaW5hdGlvblJhbmdlLCB0b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICB2YXIgaGFsZldheSA9IE1hdGguY2VpbChwYWdpbmF0aW9uUmFuZ2UvMik7XG4gICAgICAgICAgICBpZiAoaSA9PT0gcGFnaW5hdGlvblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvdGFsUGFnZXM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFnaW5hdGlvblJhbmdlIDwgdG90YWxQYWdlcykge1xuICAgICAgICAgICAgICAgIGlmICh0b3RhbFBhZ2VzIC0gaGFsZldheSA8IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbFBhZ2VzIC0gcGFnaW5hdGlvblJhbmdlICsgaTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhbGZXYXkgPCBjdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFBhZ2UgLSBoYWxmV2F5ICsgaTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICAndmlld3MvZGlyUGFnaW5hdGlvbi50cGwuaHRtbCcsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG1heFNpemU6ICc9PycsXG4gICAgICAgICAgICAgICAgb25QYWdlQ2hhbmdlOiAnJj8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhZ2luYXRpb25JZDtcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSWQgPSBhdHRycy5wYWdpbmF0aW9uSWQgfHwgXCJfX2RlZmF1bHRcIjtcbiAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLm1heFNpemUpIHsgc2NvcGUubWF4U2l6ZSA9IDk7IH1cbiAgICAgICAgICAgICAgICBzY29wZS5kaXJlY3Rpb25MaW5rcyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmRpcmVjdGlvbkxpbmtzKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuZGlyZWN0aW9uTGlua3MpIDogdHJ1ZTtcbiAgICAgICAgICAgICAgICBzY29wZS5ib3VuZGFyeUxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuYm91bmRhcnlMaW5rcykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmJvdW5kYXJ5TGlua3MpIDogZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXBhZ2luYXRpb25TZXJ2aWNlLmlzUmVnaXN0ZXJlZChwYWdpbmF0aW9uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZE1lc3NhZ2UgPSAocGFnaW5hdGlvbklkICE9PSAnX19kZWZhdWx0JykgPyBcIiAoaWQ6IFwiICsgcGFnaW5hdGlvbklkICsgXCIpIFwiIDogXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwicGFnaW5hdGlvbiBkaXJlY3RpdmU6IHRoZSBwYWdpbmF0aW9uIGNvbnRyb2xzXCIgKyBpZE1lc3NhZ2UgKyBcImNhbm5vdCBiZSB1c2VkIHdpdGhvdXQgdGhlIGNvcnJlc3BvbmRpbmcgcGFnaW5hdGlvbiBkaXJlY3RpdmUuXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2luYXRpb25SYW5nZSA9IE1hdGgubWF4KHNjb3BlLm1heFNpemUsIDUpO1xuICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gW107XG4gICAgICAgICAgICAgICAgc2NvcGUucGFnaW5hdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdDogMSxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudDogMVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAocGFnaW5hdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQpICsgMSkgKiBwYWdpbmF0aW9uU2VydmljZS5nZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDAgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWdpbmF0aW9uU2VydmljZS5nZXRDdXJyZW50UGFnZShwYWdpbmF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gZ2VuZXJhdGVQYWdlc0FycmF5KGN1cnJlbnRQYWdlLCBwYWdpbmF0aW9uU2VydmljZS5nZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25TZXJ2aWNlLmdldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uUmFuZ2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuc2V0Q3VycmVudCA9IGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoL15cXGQrJC8udGVzdChudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IG51bSAmJiBudW0gPD0gc2NvcGUucGFnaW5hdGlvbi5sYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0Q3VycmVudFBhZ2UocGFnaW5hdGlvbklkLCBudW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gZ2VuZXJhdGVQYWdlc0FycmF5KG51bSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uU2VydmljZS5nZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblJhbmdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uLmN1cnJlbnQgPSBudW07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhIGNhbGxiYWNrIGhhcyBiZWVuIHNldCwgdGhlbiBjYWxsIGl0IHdpdGggdGhlIHBhZ2UgbnVtYmVyIGFzIGFuIGFyZ3VtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLm9uUGFnZUNoYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5vblBhZ2VDaGFuZ2UoeyBuZXdQYWdlTnVtYmVyIDogbnVtIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZVBhZ2luYXRpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2VzID0gZ2VuZXJhdGVQYWdlc0FycmF5KDEsIHBhZ2luYXRpb25TZXJ2aWNlLmdldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25SYW5nZSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2luYXRpb24uY3VycmVudCA9IHBhcnNlSW50KHBhZ2luYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRQYWdlKHBhZ2luYXRpb25JZCkpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uLmxhc3QgPSBzY29wZS5wYWdlc1tzY29wZS5wYWdlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLnBhZ2luYXRpb24ubGFzdCA8IHNjb3BlLnBhZ2luYXRpb24uY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2V0Q3VycmVudChzY29wZS5wYWdpbmF0aW9uLmxhc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKVxuXG4gICAgLmZpbHRlcignaXRlbXNQZXJQYWdlJywgWydwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKHBhZ2luYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVtc1BlclBhZ2UsIHBhZ2luYXRpb25JZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAocGFnaW5hdGlvbklkKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSWQgPSBcIl9fZGVmYXVsdFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwYWdpbmF0aW9uU2VydmljZS5pc1JlZ2lzdGVyZWQocGFnaW5hdGlvbklkKSkge1xuICAgICAgICAgICAgICAgIHRocm93IFwicGFnaW5hdGlvbiBkaXJlY3RpdmU6IHRoZSBpdGVtc1BlclBhZ2UgaWQgYXJndW1lbnQgKGlkOiBcIiArIHBhZ2luYXRpb25JZCArIFwiKSBkb2VzIG5vdCBtYXRjaCBhIHJlZ2lzdGVyZWQgcGFnaW5hdGlvbi1pZC5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlbmQ7XG4gICAgICAgICAgICB2YXIgc3RhcnQ7XG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJQYWdlIHx8IDk5OTk5OTk5OTk7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25TZXJ2aWNlLmlzQXN5bmNNb2RlKHBhZ2luYXRpb25JZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gKHBhZ2luYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRQYWdlKHBhZ2luYXRpb25JZCkgLSAxKSAqIGl0ZW1zUGVyUGFnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW5kID0gc3RhcnQgKyBpdGVtc1BlclBhZ2U7XG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCwgaXRlbXNQZXJQYWdlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSlcblxuICAgIC5zZXJ2aWNlKCdwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5zdGFuY2VzID0ge307XG4gICAgICAgIHZhciBsYXN0UmVnaXN0ZXJlZEluc3RhbmNlO1xuICAgICAgICB0aGlzLnBhZ2luYXRpb25EaXJlY3RpdmVJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2VzW2luc3RhbmNlSWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmNNb2RlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGFzdFJlZ2lzdGVyZWRJbnN0YW5jZSA9IGluc3RhbmNlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc1JlZ2lzdGVyZWQgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIGluc3RhbmNlc1tpbnN0YW5jZUlkXSAhPT0gJ3VuZGVmaW5lZCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TGFzdEluc3RhbmNlSWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBsYXN0UmVnaXN0ZXJlZEluc3RhbmNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudFBhZ2VQYXJzZXIgPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwsIHNjb3BlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY3VycmVudFBhZ2VQYXJzZXIgPSB2YWw7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29udGV4dCA9IHNjb3BlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldEN1cnJlbnRQYWdlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCwgdmFsKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY3VycmVudFBhZ2VQYXJzZXIuYXNzaWduKGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb250ZXh0LCB2YWwpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldEN1cnJlbnRQYWdlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jdXJyZW50UGFnZVBhcnNlcihpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29udGV4dCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRJdGVtc1BlclBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5pdGVtc1BlclBhZ2UgPSB2YWw7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0SXRlbXNQZXJQYWdlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5pdGVtc1BlclBhZ2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRDb2xsZWN0aW9uTGVuZ3RoID0gZnVuY3Rpb24oaW5zdGFuY2VJZCwgdmFsKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29sbGVjdGlvbkxlbmd0aCA9IHZhbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRDb2xsZWN0aW9uTGVuZ3RoID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb2xsZWN0aW9uTGVuZ3RoO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0QXN5bmNNb2RlVHJ1ZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5hc3luY01vZGUgPSB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXNBc3luY01vZGUgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLmFzeW5jTW9kZTtcbiAgICAgICAgfTtcbiAgICB9KVxuO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1NpZ25hbFInLCBbXSlcbiAgICAuY29uc3RhbnQoJyQnLCAkKVxuICAgIC5mYWN0b3J5KCdIdWInLCBbJyQnLCAnJHEnLFxuICAgICAgICBmdW5jdGlvbigkLCAkcSkge1xuICAgICAgICAgICAgLy9UaGlzIHdpbGwgYWxsb3cgc2FtZSBjb25uZWN0aW9uIHRvIGJlIHVzZWQgZm9yIGFsbCBIdWJzXG4gICAgICAgICAgICAvL0l0IGFsc28ga2VlcHMgY29ubmVjdGlvbiBhcyBzaW5nbGV0b24uXG4gICAgICAgICAgICB2YXIgZ2xvYmFsQ29ubmVjdGlvbiA9IG51bGw7XG5cbiAgICAgICAgICAgIHZhciBpbml0R2xvYmFsQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJvb3RQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbENvbm5lY3Rpb24gPSAkLmh1YkNvbm5lY3Rpb24ob3B0aW9ucy5yb290UGF0aCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckRlZmF1bHRQYXRoOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxDb25uZWN0aW9uID0gJC5odWJDb25uZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGh1Yk5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgSHViID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsQ29ubmVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpbml0R2xvYmFsQ29ubmVjdGlvbihvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24gPSBnbG9iYWxDb25uZWN0aW9uO1xuICAgICAgICAgICAgICAgIEh1Yi5wcm94eSA9IEh1Yi5jb25uZWN0aW9uLmNyZWF0ZUh1YlByb3h5KGh1Yk5hbWUpO1xuXG4gICAgICAgICAgICAgICAgSHViLm9uID0gZnVuY3Rpb24oZXZlbnQsIGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIEh1Yi5wcm94eS5vbihldmVudCwgZm4pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgSHViLmludm9rZSA9IGZ1bmN0aW9uKG1ldGhvZCwgYXJncykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSHViLnByb3h5Lmludm9rZS5hcHBseShIdWIucHJveHksIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIEh1Yi5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLnN0YXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zcG9ydDogJ2xvbmdQb2xsaW5nJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5saXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMubGlzdGVuZXJzLCBmdW5jdGlvbihmbiwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEh1Yi5vbihldmVudCwgZm4pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5tZXRob2RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLm1ldGhvZHMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSHViW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9ICQubWFrZUFycmF5KGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEh1Yi5pbnZva2UuYXBwbHkoSHViLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLnFzID0gb3B0aW9ucy5xdWVyeVBhcmFtcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9BZGRpbmcgYWRkaXRpb25hbCBwcm9wZXJ0eSBvZiBwcm9taXNlIGFsbG93cyB0byBhY2Nlc3MgaXQgaW4gcmVzdCBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAgICAgICAgICAgICAgLy8gICBIdWIucHJvbWlzZSA9IEh1Yi5jb25uZWN0aW9uLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgLy8gdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICBIdWIuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbi5zdGFydCgpLmRvbmUoZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvbmVcIiwgcmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlc29sdmUocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgY29ubmVjdCcsIEh1Yi5jb25uZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbi5zdGFydCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnJlamVjdChyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24uZGlzY29ubmVjdGVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEaXNjb25uZWN0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEh1Yi5jb25uZWN0aW9uLnN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgZG9uZSwgYnV0IG5vdCBmYWlsZWRcIiwgSHViLmNvbm5lY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBIdWI7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgXSk7XG4iLCIgICAgY2xhc3MgUHJvc3BlY3Qge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuSXNzdWVzID0gW1xuICAgICAgICAgICAgICAgIGZvciAoeCBvZiBvYmouSXNzdWVzKSBuZXcgSXNzdWUoeCB8fCB7fSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgICAgIHRoaXMuQWN0aXZpdGllcyA9IG9iai5BY3Rpdml0aWVzLm1hcChDID0+IG5ldyBBY3Rpdml0eShDIHx8IHt9KSlcbiAgICAgICAgICAgIHRoaXMuQ29udGFjdHMgPSBvYmouQ29udGFjdHMubWFwKEMgPT4gbmV3IENvbnRhY3QoQyB8fCB7fSkpXG4gICAgICAgICAgICB0aGlzLkN1c3RvbWVyID0gbmV3IEN1c3RvbWVyKG9iai5DdXN0b21lciB8fCB7fSk7XG4gICAgICAgICAgICB0aGlzLklzc3VlQ291bnQgPSBvYmouSXNzdWVzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuQWN0aXZpdHlDb3VudCA9IG9iai5BY3Rpdml0aWVzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuQ29udGFjdENvdW50ID0gb2JqLkNvbnRhY3RzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuQ3VzdG9tZXJUeXBlID0gXCJBXCJcbiAgICAgICAgICAgIC8vIHRoaXMuUHJvc3BlY3RUeXBlID0gXCJQXCJcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIENvbnRhY3Qge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuQWRkcjEgPSB0aGlzLkFkZHIxIHx8ICcnXG4gICAgICAgICAgICB0aGlzLkFkZHIyID0gdGhpcy5BZGRyMiB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5DaXR5ID0gdGhpcy5DaXR5IHx8ICcnXG4gICAgICAgICAgICB0aGlzLkNvbnRhY3RJRCA9IHRoaXMuQ29udGFjdElEIHx8ICcnXG4gICAgICAgICAgICB0aGlzLkVtYWlsID0gdGhpcy5FbWFpbCB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5GYXggPSB0aGlzLkZheCB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5Nb2JpbGUgPSB0aGlzLk1vYmlsZSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5OYW1lID0gdGhpcy5OYW1lIHx8ICcnXG4gICAgICAgICAgICB0aGlzLlBob25lID0gdGhpcy5QaG9uZSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5TdGF0ZSA9IHRoaXMuU3RhdGUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuWmlwID0gdGhpcy5aaXAgfHwgJydcbiAgICAgICAgICAgIHRoaXMuVHlwZXMgPSB0aGlzLlR5cGVzIHx8IFtdO1xuICAgICAgICAgICAgLy8gZmluXG4gICAgICAgICAgICB0aGlzLkh1bWFuVHlwZXNfID0gXy5wbHVjayhvYmouVHlwZXMsICdUeXBlJylcbiAgICAgICAgICAgIHRoaXMuT2xkVHlwZXMgPSBbXVxuICAgICAgICB9XG4gICAgICAgIHNldCBIdW1hblR5cGVzKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLk9sZFR5cGVzID0gdGhpcy5IdW1hblR5cGVzXztcbiAgICAgICAgICAgIHRoaXMuSHVtYW5UeXBlc18gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBnZXQgSHVtYW5UeXBlcygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkh1bWFuVHlwZXNfXG4gICAgICAgIH1cbiAgICAgICAgZ2V0IG9sZF92c19uZXcoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdvbGQnOiB0aGlzLk9sZFR5cGVzLFxuICAgICAgICAgICAgICAgICduZXcnOiB0aGlzLkh1bWFuVHlwZXNfXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBJc3N1ZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5pc3N1ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ID0gb2JqLkNyZWF0aW9uRGF0ZVRpbWU7XG4gICAgICAgICAgICB0aGlzLmVuZCA9IG9iai5Db21wbGV0aW9uRGF0ZVRpbWVcbiAgICAgICAgICAgIHRoaXMuc3RhcnRIdW1hbiA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTExcIilcbiAgICAgICAgICAgIHRoaXMuZW5kSHVtYW4gPSBtb21lbnQob2JqLkNvbXBsZXRpb25EYXRlVGltZSkuZm9ybWF0KFwibGxcIilcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IG9iai5EZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgNSk7XG4gICAgICAgICAgICB0aGlzLnR5cGVPZiA9IFwiQ2xvc2VkIElzc3Vlc1wiXG4gICAgICAgICAgICBpZiAodGhpcy5lbmQgPT0gXCIxOTAwLTAxLTAxVDAwOjAwOjAwXCIpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5lbmRcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEh1bWFuID0gXCJTdGlsbCBvcGVuZWRcIlxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJvcGVuSXNzdWVcIlxuICAgICAgICAgICAgICAgIHRoaXMudHlwZU9mID0gXCJPcGVuIElzc3Vlc1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnllYXIgPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIikpO1xuICAgICAgICAgICAgdGhpcy5tb250aCA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikpO1xuICAgICAgICAgICAgdGhpcy5kYXkgPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkRERFwiKSk7XG4gICAgICAgICAgICB0aGlzLm1vbnRoX3llYXIgPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIk1NXCIpICsgbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpXG4gICAgICAgICAgICB0aGlzLnllYXJfZGF5ID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERERcIikgKyBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIilcbiAgICAgICAgICAgIHRoaXMucmVwbHlDb3VudCA9IG9iai5Gb2xsb3d1cHMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5Gb2xsb3d1cHMgPSBbXG4gICAgICAgICAgICAgICAgZm9yICh4IG9mIG9iai5Gb2xsb3d1cHMpIG5ldyBGb2xsb3d1cHMoeCB8fCB7fSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIEFjdGl2aXR5IHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLmlzc3VlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0SHVtYW4gPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkxMXCIpXG4gICAgICAgICAgICB0aGlzLnN0YXJ0ID0gb2JqLkNyZWF0aW9uRGF0ZVRpbWU7XG4gICAgICAgICAgICAvLyBkZWxldGUgQWN0aXZpdGllcy5DcmVhdGlvbkRhdGVUaW1lO1xuICAgICAgICAgICAgLy8gdGhpcy5jb250ZW50ID0gb2JqLk5vdGUuc3Vic3RyaW5nKDAsIDIwKVxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gXCIxIG5vdGVcIlxuICAgICAgICAgICAgLy8gZGVsZXRlIGFjdGl2aXRpZXMuTm90ZTtcbiAgICAgICAgICAgIHRoaXMudHlwZU9mID0gXCJBbGwgQWN0aXZpdGllc1wiO1xuICAgICAgICAgICAgdGhpcy55ZWFyID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpKTtcbiAgICAgICAgICAgIHRoaXMubW9udGggPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIk1NXCIpKTtcbiAgICAgICAgICAgIHRoaXMuZGF5ID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERERcIikpO1xuICAgICAgICAgICAgdGhpcy5zbWFsbERheSA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiRERcIikpO1xuICAgICAgICAgICAgdGhpcy5tb250aF95ZWFyID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJNTVwiKSArIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKTtcbiAgICAgICAgICAgIHRoaXMueWVhcl9kYXkgPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkRERFwiKSArIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKTtcbiAgICAgICAgICAgIHRoaXMuVHlwZV9IdW1hbiA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3ByZWFkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDMgLSAxKSkgKyAxO1xuICAgICAgICAgICAgICAgIGlmIChzcHJlYWQgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJQaG9uZVwiXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiVmlzaXRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKClcbiAgICAgICAgICAgIHRoaXMudGltZWJldHdlZW4gPSBcIjIgd2Vla3NcIlxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgRm9sbG93dXBzIHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLmlzc3VlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0SHVtYW4gPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcImxsXCIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBBZGRFdmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaiwgaW5mbykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5EYXRlID0gbW9tZW50KHRoaXMuRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcbiAgICAgICAgICAgIC8vIHRoaXMuUHJvc3BlY3RJRCA9ICcyJ1xuICAgICAgICAgICAgLy8gdGhpcy5DYW1wYWlnbklEID0gaW5mby5DYW1wYWlnbklEO1xuICAgICAgICAgICAgLy8gdGhpcy5DcmVhdGlvblVzZXIgPSBpbmZvLkNyZWF0aW9uVXNlcjtcbiAgICAgICAgICAgIC8vIHRoaXMuUHJvZHVjdElEID0gaW5mby5Qcm9kdWN0SUQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBBZGRJc3N1ZSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaiwgaW5mbykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5Db21wbGV0aW9uRGF0ZVRpbWUgPSAnMTkwMC0wMS0wMSdcbiAgICAgICAgICAgIHRoaXMuU3RhdHVzID0gMDtcbiAgICAgICAgICAgIHRoaXMuUHJvZHVjdElEID0gMTtcbiAgICAgICAgfVxuICAgIH1cbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ3Byb3NwZWN0Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBwcm9zcGVjdEZhY3RvcnksICRsb2NhdGlvbiwgTG9naW5TZXJ2aWNlLCAkbW9kYWwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbyBwcm9zcGVjdFwiKVxuICAgICAgICAkc2NvcGUuZGV0YWlscyA9IHtcbiAgICAgICAgICAgIHVzZXI6IExvZ2luU2VydmljZS51c2VyXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmNvbnRhY3RDb2xsYXBzZSA9IHRydWU7XG4gICAgICAgICRzY29wZS5pc3N1ZUNvbGxhcHNlID0gdHJ1ZTtcblxuICAgICAgICAkc2NvcGUuQWRkRXZlbnQgPSB7fTtcbiAgICAgICAgJHNjb3BlLkFkZENvbnRhY3QgPSB7fTtcbiAgICAgICAgJHNjb3BlLkNvbnRhY3RLZXlzID0gW11cblxuICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0O1xuICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0X2VkaXQgPSB7fTtcbiAgICAgICAgLy8gJHNjb3BlLkNvbnRhY3RzID0gW107XG4gICAgICAgIGNvbnNvbGUubG9nKCRzdGF0ZS5wYXJhbXMpXG4gICAgICAgICRzY29wZS5jb250YWN0VHlwZSA9IFt7XG4gICAgICAgICAgICB2YWx1ZTogJzEnLFxuICAgICAgICAgICAgbGFiZWw6ICdPd25lcidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgICAgIGxhYmVsOiAnSW4gQ2hhcmdlJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJzMnLFxuICAgICAgICAgICAgbGFiZWw6ICdHYW1ibGVyJ1xuICAgICAgICB9XTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQ29udGFjdFR5cGUgPSBbXTtcblxuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5nZXRQcm9zcGVjdF9ieV9JRCgkc3RhdGUucGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBwcm9zcGVjdFwiLCBkYXRhKVxuICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QgPSBuZXcgUHJvc3BlY3QoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50aGVfUHJvc3BlY3QpXG4gICAgICAgICAgICAgICAgdGltZUJldHdlZW4oKTtcbiAgICAgICAgICAgICAgICBtYWtlVGltZWxpbmUoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbnRhY3QgPSAkc2NvcGUudGhlX1Byb3NwZWN0LkNvbnRhY3RzWzBdXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRldGFpbHMuQ2FtcGFpZ25JRCA9IDA7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRldGFpbHMuQ3JlYXRpb25Vc2VyID0gXCJtZVwiO1xuICAgICAgICAgICAgICAgICRzY29wZS5kZXRhaWxzLlByb2R1Y3RJRCA9IDA7XG4gICAgICAgICAgICAgICAgLy8gY2FzdCB0byBuZXcgQ29udGFjdCBzbyBvbiBzYXZlIGl0IGhhcyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgJHNjb3BlLkFkZENvbnRhY3QgPSBuZXcgQ29udGFjdCh7fSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlICRzY29wZS5BZGRDb250YWN0Lkh1bWFuVHlwZXNfO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuQWRkQ29udGFjdC5PbGRUeXBlcztcbiAgICAgICAgICAgICAgICAkc2NvcGUuQ29udGFjdEtleXMgPSBPYmplY3Qua2V5cygkc2NvcGUuQWRkQ29udGFjdClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvLyB3aGVuIGxvYWRpbmcgbW9kYWwsIGNsZWFyIHRoZSBtb2RlbC4gRWxzZSBzZXQgXCJlZGl0XCIgdG8gZmFsc2VcbiAgICAgICAgJHNjb3BlLmNsZWFyTW9kZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5BZGRDb250YWN0ID0gbmV3IENvbnRhY3Qoe30pO1xuICAgICAgICAgICAgZGVsZXRlICRzY29wZS5BZGRDb250YWN0Lkh1bWFuVHlwZXNfO1xuICAgICAgICAgICAgZGVsZXRlICRzY29wZS5BZGRDb250YWN0Lk9sZFR5cGVzO1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRDb250YWN0Qm9vbCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmVkaXRDb250YWN0Qm9vbCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUubW9kYWxTYXZlQ29udGFjdCA9IGZ1bmN0aW9uKGNvbnRhY3QsIG1vZGFsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlcnAgZGVycFwiLCBjb250YWN0KVxuICAgICAgICAgICAgaWYgKCFjb250YWN0LlR5cGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTXVzdCBzZWxlY3QgYSB0eXBlXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgd2UncmUgZWRpdGluZyBhbmQgbm90IHNhdmluZ1xuICAgICAgICAgICAgaWYgKCRzY29wZS5lZGl0Q29udGFjdEJvb2wpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvIHNvbWUgZWRpdCBodHRwXCIpXG4gICAgICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkVkaXRDb250YWN0KGNvbnRhY3QpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5BZGRDb250YWN0KGNvbnRhY3QpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0LkNvbnRhY3RzLnB1c2gobmV3IENvbnRhY3QoY29udGFjdCkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmVkaXRDb250YWN0ID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlZGl0XCIsIGNvbnRhY3QpXG4gICAgICAgICAgICAvLyBwcmVwb3B1bGF0ZSB0aGUgbW9kZWxcbiAgICAgICAgICAgICRzY29wZS5BZGRDb250YWN0ID0gY29udGFjdDtcbiAgICAgICAgICAgICRzY29wZS5lZGl0Q29udGFjdEJvb2wgPSB0cnVlO1xuICAgICAgICAgICAgLy8gcHJvc3BlY3RGYWN0b3J5LkVkaXRDb250YWN0KGNvbnRhY3QpXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUucHJvc3BlY3RFZGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXRpbmcgcHJvc3BlY3RcIilcbiAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3RfZWRpdCA9IE9iamVjdC5hc3NpZ24oJHNjb3BlLnRoZV9Qcm9zcGVjdF9lZGl0LCAkc2NvcGUudGhlX1Byb3NwZWN0KTtcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUudGhlX1Byb3NwZWN0X2VkaXQuQWN0aXZpdGllcztcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUudGhlX1Byb3NwZWN0X2VkaXQuQ29udGFjdHM7XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLnRoZV9Qcm9zcGVjdF9lZGl0LkN1c3RvbWVyO1xuICAgICAgICAgICAgZGVsZXRlICRzY29wZS50aGVfUHJvc3BlY3RfZWRpdC5Jc3N1ZXM7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZWRpdElzc3VlQm9vbCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuZWRpdEV2ZW50Qm9vbCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuZWRpdEV2ZW50ID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhlcnBcIiwgZXZ0KVxuICAgICAgICAgICAgaWYgKGV2dC5pc3N1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLi4uLmlzc3VlLi4uXCIpXG4gICAgICAgICAgICAgICAgLy8gcHJlcG9wdWxhdGUgbW9kZWxcbiAgICAgICAgICAgICAgICAkc2NvcGUuQWRkSXNzdWUgPSBuZXcgQWRkSXNzdWUoZXZ0KVxuICAgICAgICAgICAgICAgIHZhciBteU1vZGFsID0gJG1vZGFsKHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICcvc3JjL2pzL3Byb3NwZWN0L2FkZC1pc3N1ZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS5lZGl0SXNzdWVCb29sID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLi4uLm5vdGUvZXZlbnQuLi5cIilcbiAgICAgICAgICAgICAgICAkc2NvcGUuQWRkRXZlbnQgPSBuZXcgQWRkRXZlbnQoZXZ0KVxuICAgICAgICAgICAgICAgIHZhciBteU1vZGFsID0gJG1vZGFsKHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICcvc3JjL2pzL3Byb3NwZWN0L2FkZC1ldmVudC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzY29wZS5lZGl0RXZlbnRCb29sID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tb2RhbFNhdmVQcm9zcGVjdCA9IGZ1bmN0aW9uKGV2dCwgbW9kYWwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIHByb3NwZWN0XCIpXG4gICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuRWRpdFByb3NwZWN0KGV2dCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllcy51bnNoaWZ0KG5ldyBBY3Rpdml0eShldnQpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLm1vZGFsU2F2ZUFjdGl2aXR5ID0gZnVuY3Rpb24oZXZ0LCBtb2RhbCkge1xuICAgICAgICAgICAgdmFyIGFjdGl2aXR5ID0gbmV3IEFkZEV2ZW50KGV2dCwgJHNjb3BlLmRldGFpbHMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJNeSBhY3Rpdml0eSBcIiwgYWN0aXZpdHkpXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVkaXRFdmVudEJvb2wpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldlJ3JlIGVkaXRpbmcgYW4gZXZlbnRcIilcbiAgICAgICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuRWRpdEV2ZW50KGFjdGl2aXR5KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuQWRkRXZlbnQoYWN0aXZpdHkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllcy51bnNoaWZ0KG5ldyBBY3Rpdml0eShldnQpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubW9kYWxTYXZlSXNzdWUgPSBmdW5jdGlvbihpc3N1ZSwgbW9kYWwpIHtcbiAgICAgICAgICAgIHZhciBpc3N1ZSA9IG5ldyBBZGRJc3N1ZShpc3N1ZSlcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZWRpdElzc3VlQm9vbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdCBub3Qgc2F2ZVwiKVxuICAgICAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5FZGl0SXNzdWUoaXNzdWUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5BZGRJc3N1ZShpc3N1ZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuSXNzdWVzLnB1c2gobmV3IElzc3VlKGlzc3VlKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubWFrZUFjdGl2ZSA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWFrZSBhY3RpdmVcIiwgY29udGFjdClcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zY3JvbGx0b0hyZWYgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaWQpXG4gICAgICAgICAgICBpZiAoaWQgPT0gJ0RldGFpbHMnKSB7XG4gICAgICAgICAgICAgICAgLy8gJGxvY2F0aW9uLmhhc2goaWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxCeSgwLCAtNTAwMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHNldCB0aGUgbG9jYXRpb24uaGFzaCB0byB0aGUgaWQgb2ZcbiAgICAgICAgICAgICAgICAvLyB0aGUgZWxlbWVudCB5b3Ugd2lzaCB0byBzY3JvbGwgdG8uXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLmhhc2goaWQpO1xuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5zY3JvbGxCeSgwLC0xMDApO1xuICAgICAgICAgICAgICAgIC8vIGNhbGwgJGFuY2hvclNjcm9sbCgpXG4gICAgICAgICAgICAgICAgLy8gJGFuY2hvclNjcm9sbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IDE7XG4gICAgICAgIHZhciB6b29tY291bnQgPSAzXG5cbiAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0XG5cbiAgICAgICAgJHNjb3BlLmNsaWNrVGFiID0gMTtcblxuICAgICAgICAkc2NvcGUub25DbGlja1RhYiA9IGZ1bmN0aW9uKGJvb2wpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGJvb2wpXG4gICAgICAgICAgICAkc2NvcGUuY2xpY2tUYWIgPSBib29sO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5pc0FjdGl2ZVRhYiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250YWN0ID09ICRzY29wZS5jdXJyZW50Q29udGFjdDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy9mb3IgdGhlIHByb3NwZWN0IGRldGFpbHMgbGlzdFxuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vc2hvdyBkZXRhaWxzIGlzIHdoZW4gdGhleSBjbGljayBhIHRpbWVsaW5lIGV2ZW50XG4gICAgICAgICRzY29wZS5zaG93RGV0YWlscyA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5zYXZlQ29udGFjdCA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2aW5nIGNvbnRhY3QuLi5cIiwgY29udGFjdClcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gZmlsdGVyc1xuICAgICAgICAkc2NvcGUuZmlsdGVycyA9IFsnQWxsIEFjdGl2aXRpZXMnLCAnT25seSBNeSBBY3Rpdml0aWVzJywgJ0Nsb3NlZCBJc3N1ZXMnLCAnT3BlbiBJc3N1ZXMnLCAnVHJpbmV0JywgJ1Byb2ZpdEd1YXJkJ107XG4gICAgICAgIC8vIHNlbGVjdGVkIGZpbHRlcnNcbiAgICAgICAgJHNjb3BlLnNlbGVjdGlvbiA9IFsnQWxsIEFjdGl2aXRpZXMnLCAnQ2xvc2VkIElzc3VlcycsICdPcGVuIElzc3VlcycsICdUcmluZXQnLCAnUHJvZml0R3VhcmQnXTtcbiAgICAgICAgLy8gdG9nZ2xlIHNlbGVjdGlvbiBmb3IgYSBnaXZlbiBmaWx0ZXIgYnkgbmFtZVxuICAgICAgICAkc2NvcGUudG9nZ2xlU2VsZWN0aW9uID0gZnVuY3Rpb24gdG9nZ2xlU2VsZWN0aW9uKGZpbHRlck5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSAkc2NvcGUuc2VsZWN0aW9uLmluZGV4T2YoZmlsdGVyTmFtZSk7XG4gICAgICAgICAgICAvLyBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcbiAgICAgICAgICAgIGlmIChpZHggPiAtMSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3Rpb24uc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlRmlsdGVyKGZpbHRlck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaXMgbmV3bHkgc2VsZWN0ZWRcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFkZEZpbHRlcihmaWx0ZXJOYW1lKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0aW9uLnB1c2goZmlsdGVyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gYW5ub3RhdGUgJ25vdGVzJyB3aXRoIHRpbWUgZGlmZiwgaWUuICd0d28gZGF5cyBzaW5jZSBsYXN0J1xuICAgICAgICBmdW5jdGlvbiB0aW1lQmV0d2VlbigpIHtcbiAgICAgICAgICAgIHZhciBhcnJheSA9ICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllc1xuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFycmF5W2ldLnllYXIpXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFycmF5W2ldLm1vbnRoKVxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpXS5zbWFsbERheSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBtb21lbnQoYXJyKTtcbiAgICAgICAgICAgICAgICAgICAgYXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFycmF5W2kgKyAxXS55ZWFyKVxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpICsgMV0ubW9udGgpXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFycmF5W2kgKyAxXS5zbWFsbERheSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSBtb21lbnQoYXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpZmYgPSBhLmRpZmYoYiwgJ2RheXMnKVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXNbaSArIDFdLnRpbWViZXR3ZWVuID0gZGlmZiArIFwiIGRheXMuLi5cIlxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXNbaSArIDFdLnRpbWViZXR3ZWVuID0gXCJTYW1lIGRheVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzWzBdLnRpbWViZXR3ZWVuID0gXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEb25lXCIsICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllc1swXS50aW1lYmV0d2VlbilcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUZpbHRlcihmaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXNHZXQgPSBpdGVtcy5nZXQoKTtcbiAgICAgICAgICAgIHZhciByZW1vdmUgPSBfLmZpbHRlcihpdGVtc0dldCwgZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bS50eXBlT2YgPT0gZmlsdGVyTmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdGVtcy5yZW1vdmUocmVtb3ZlKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkRmlsdGVyKGZpbHRlck5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpdGVtc0dldCA9IEFjdGl2aXRpZXNfYW5kX0lzc3VlcztcbiAgICAgICAgICAgIHZhciBhZGRzID0gXy5maWx0ZXIoaXRlbXNHZXQsIGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudW0udHlwZU9mID09IGZpbHRlck5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXRlbXMuYWRkKGFkZHMpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGltZWxpbmU7XG4gICAgICAgIHZhciBpdGVtcztcbiAgICAgICAgdmFyIEFjdGl2aXRpZXNfYW5kX0lzc3VlcztcblxuICAgICAgICBmdW5jdGlvbiBtYWtlVGltZWxpbmUoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2luZyB0aW1lbGluZS4uLnRoaXMgY29uY2F0cyBhbGwgZXZlbnRzIG9uIHRoZSBzYW1lIGRheVwiKVxuXG4gICAgICAgICAgICBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMgPSAkc2NvcGUudGhlX1Byb3NwZWN0Lklzc3Vlcy5jb25jYXQoJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzKVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjb21wYXJlTnVtYmVycyhhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuZGF5IC0gYi5kYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMuc29ydChjb21wYXJlTnVtYmVycylcblxuICAgICAgICAgICAgdmFyIGR1cGVzID0gW107XG4gICAgICAgICAgICB2YXIgcmFuZ2VzID0gXy5wbHVjayhBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMsICd5ZWFyX2RheScpO1xuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IF8udW5pcShyYW5nZXMpXG4gICAgICAgICAgICB2YXIgbW90aGVyc2hpcCA9IFtdXG4gICAgICAgICAgICByYW5nZXMuZm9yRWFjaChmdW5jdGlvbihyYW5nZSwgaXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gXy53aGVyZShBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgJ3llYXJfZGF5JzogcmFuZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBwdWxsIG91dCBpc3N1ZXNcbiAgICAgICAgICAgICAgICB2YXIgaXNzdWVzID0gW11cbiAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBncm91cHMuZm9yRWFjaChmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLmlzc3VlICYmIGdyb3Vwcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBncm91cHMuaW5kZXhPZih0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlcyA9IGdyb3Vwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgbW90aGVyc2hpcC5wdXNoKGlzc3VlcylcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW90aGVyc2hpcC5wdXNoKGdyb3Vwcyk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMgPSBbXTtcbiAgICAgICAgICAgIG1vdGhlcnNoaXAuZm9yRWFjaChmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJyWzBdLmlzc3VlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSXNzdWUgaW4gbW90aGVyc2hpcFwiKVxuICAgICAgICAgICAgICAgICAgICBhcnJbMF0uY29udGVudCA9IFwiSXNzdWVcIlxuICAgICAgICAgICAgICAgICAgICBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMucHVzaChhcnJbMF0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyWzBdLmNvbnRlbnQgPSBhcnIubGVuZ3RoICsgXCIgTm90ZXNcIlxuICAgICAgICAgICAgICAgICAgICBhcnJbMF0ud2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGFyclswXS5zdWJub3RlcyA9IGFycjtcbiAgICAgICAgICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzLnB1c2goYXJyWzBdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGl0ZW1zID0gbmV3IHZpcy5EYXRhU2V0KEFjdGl2aXRpZXNfYW5kX0lzc3Vlcyk7XG5cbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlzdWFsaXphdGlvbicpO1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIC8vIGhlaWdodDogJzIwMHB4JyxcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKDIwMTQsIG1vbWVudCgpLnN1YnRyYWN0KCdtb250aCcsIDIpLmZvcm1hdChcIk1cIiksIDEpLCAvL2Z1cnRoZXN0IGJhY2sgeW91IGNhbiBnb1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSgyMDE0LCBtb21lbnQoKS5zdWJ0cmFjdCgnbW9udGgnLCAyKS5mb3JtYXQoXCJNXCIpLCAxKSxcbiAgICAgICAgICAgICAgICAvLyBtYXg6IG5ldyBEYXRlKDIwMTQsIDcsIDEpXG4gICAgICAgICAgICAgICAgbWF4OiBuZXcgRGF0ZSgyMDE0LCBtb21lbnQoKS5hZGQoJ21vbnRoJywgMikuZm9ybWF0KFwiTVwiKSwgMSlcbiAgICAgICAgICAgICAgICAvLyAgIHpvb21NaW46IDEwMDAgKiA2MCAqIDYwICogMjQgICAgICAgICAgICAvLyBvbmUgZGF5IGluIG1pbGxpc2Vjb25kcywgZnVydGhlc3QgXCJpblwiXG4gICAgICAgICAgICAgICAgLy8gem9vbU1heDogMTAwMCAqIDYwICogNjAgKiAyNCAqIDMxICogMyAgIC8vIGFib3V0IHRocmVlIG1vbnRocyBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aW1lbGluZS5vbignc2VsZWN0JywgZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGxvZ0V2ZW50KCdzZWxlY3QnLCBwcm9wZXJ0aWVzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aW1lbGluZS5vbigncmFuZ2VjaGFuZ2VkJywgZnVuY3Rpb24odGltZSkge1xuICAgICAgICAgICAgICAgIC8vIHZhciBzdGFydCA9IG5ldyBEYXRlKHRpbWUuc3RhcnQpXG4gICAgICAgICAgICAgICAgLy8gc3RhcnQgPSBzdGFydC50b1N0cmluZygpLnN1YnN0cmluZygwLDE1KVxuICAgICAgICAgICAgICAgIC8vIHZhciBlbmQgPSBuZXcgRGF0ZSh0aW1lLmVuZClcbiAgICAgICAgICAgICAgICAvLyBlbmQgPSBlbmQudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwxNSlcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdGFydCwgZW5kKVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBtb21lbnQoZW5kKS5pc0FmdGVyKHN0YXJ0KSApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tZXNzYWdlID0gXCJTZWxlY3QgYW4gZXZlbnRcIjtcblxuICAgICAgICBmdW5jdGlvbiBsb2dFdmVudChldmVudCwgcHJvcGVydGllcykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaXRlbXNbIHByb3BlcnRpZXMuaXRlbXNbMF0gXSlcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gaXRlbXMuX2RhdGFbcHJvcGVydGllcy5pdGVtc1swXV1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjb250ZW50LmNvbnRlbnQpXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IGNvbnRlbnQuTm90ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbnRlbnQpXG4gICAgICAgICAgICBpZiAoY29udGVudC53YXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTcGVjaWFsIG1lc3NhZ2UgLT4gZ290byBub3RlXCIpXG4gICAgICAgICAgICAgICAgZ290b05vdGUoY29udGVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRlbnQuaXNzdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNwZWNpYWwgaXNzdWUgLT4gZ290byBpc3N1ZVwiKVxuICAgICAgICAgICAgICAgIGdvdG9Jc3N1ZShjb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS5tc2dJbmZvID0gY29udGVudDtcbiAgICAgICAgICAgICRzY29wZS5zaG93RGV0YWlscyA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ290b0lzc3VlKG5vdGUpIHtcbiAgICAgICAgICAgIC8vZ290byBub3RlIHNob3VsZCByZXNldCB6b29tIHRvIFwiYmFzZWxpbmVcIlxuICAgICAgICAgICAgem9vbWNvdW50ID0gM1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aXN1YWxpemF0aW9uJyk7XG4gICAgICAgICAgICB2YXIgbW9udGhTdGFydCA9IG1vbWVudChub3RlLnN0YXJ0KS5zdGFydE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgICAgIHZhciBtb250aEVuZCA9IG1vbWVudChub3RlLnN0YXJ0KS5lbmRPZignbW9udGgnKS5mb3JtYXQoXCJEXCIpXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB6b29tYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vICAgbWluOiBuZXcgRGF0ZSh5ZWFyLCBtb250aC0xLCBkYXkpLCAvL2Z1cnRoZXN0IGJhY2sgeW91IGNhbiBnb1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShub3RlLnllYXIsIG5vdGUubW9udGggLSAxLCBtb250aFN0YXJ0KSxcbiAgICAgICAgICAgICAgICBtYXg6IG5ldyBEYXRlKG5vdGUueWVhciwgbm90ZS5tb250aCAtIDEsIG1vbnRoRW5kKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5vdGUsIG1vbnRoU3RhcnQsIG1vbnRoRW5kKVxuICAgICAgICAgICAgbm90ZS5jb250ZW50ID0gbm90ZS5EZXNjcmlwdGlvbi5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9IG5vdGUuRGVzY3JpcHRpb247XG4gICAgICAgICAgICB0aW1lbGluZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aW1lbGluZS5vbignc2VsZWN0JywgZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGxvZ0V2ZW50KCdzZWxlY3QnLCBwcm9wZXJ0aWVzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGdvdG9Ob3RlKG5vdGUpIHtcbiAgICAgICAgICAgIC8vZ290byBub3RlIHNob3VsZCByZXNldCB6b29tIHRvIFwiYmFzZWxpbmVcIlxuICAgICAgICAgICAgem9vbWNvdW50ID0gM1xuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aXN1YWxpemF0aW9uJyk7XG4gICAgICAgICAgICB2YXIgbW9udGhTdGFydCA9IG1vbWVudChub3RlLnN0YXJ0KS5zdGFydE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgICAgIHZhciBtb250aEVuZCA9IG1vbWVudChub3RlLnN0YXJ0KS5lbmRPZignbW9udGgnKS5mb3JtYXQoXCJEXCIpXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB6b29tYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vICAgbWluOiBuZXcgRGF0ZSh5ZWFyLCBtb250aC0xLCBkYXkpLCAvL2Z1cnRoZXN0IGJhY2sgeW91IGNhbiBnb1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZShub3RlLnllYXIsIG5vdGUubW9udGggLSAxLCBtb250aFN0YXJ0KSxcbiAgICAgICAgICAgICAgICBtYXg6IG5ldyBEYXRlKG5vdGUueWVhciwgbm90ZS5tb250aCAtIDEsIG1vbnRoRW5kKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5vdGUsIG1vbnRoU3RhcnQsIG1vbnRoRW5kKVxuICAgICAgICAgICAgbm90ZS5zdWJub3Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vdGVzKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm90ZXMpXG4gICAgICAgICAgICAgICAgbm90ZXMuY29udGVudCA9IG5vdGVzLk5vdGUuc3Vic3RyaW5nKDAsIDIwKVxuICAgICAgICAgICAgICAgIC8vIGl0ZW1zLmNsZWFyKClcbiAgICAgICAgICAgICAgICBpdGVtcy5yZW1vdmUobm90ZS5pZClcbiAgICAgICAgICAgICAgICBpdGVtcy5hZGQobm90ZXMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGltZWxpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGltZWxpbmUgPSBuZXcgdmlzLlRpbWVsaW5lKGNvbnRhaW5lciwgaXRlbXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGltZWxpbmUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBsb2dFdmVudCgnc2VsZWN0JywgcHJvcGVydGllcylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFpvb20gdGhlIHRpbWVsaW5lIGEgZ2l2ZW4gcGVyY2VudGFnZSBpbiBvciBvdXRcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHBlcmNlbnRhZ2UgICBGb3IgZXhhbXBsZSAwLjEgKHpvb20gb3V0KSBvciAtMC4xICh6b29tIGluKVxuICAgICAgICAgKi9cbiAgICAgICAgLy8gIHZhciB6b29tY291bnQgPSAzXG4gICAgICAgIGZ1bmN0aW9uIHpvb20oem9vbV9pbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbW91bnRzXCIsIHpvb21jb3VudCwgem9vbV9pbilcbiAgICAgICAgICAgIHpvb21jb3VudCA9IHpvb21jb3VudCArIHpvb21faW5cbiAgICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgICAgaWYgKHpvb21jb3VudCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgLy8gem9vbWNvdW50KytcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlpvb20gaW5cIiwgem9vbWNvdW50KVxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbWluOiBuZXcgRGF0ZSgyMDE0LCA1LCAxKSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKDIwMTQsIDUsIDEpLFxuICAgICAgICAgICAgICAgICAgICBtYXg6IG5ldyBEYXRlKDIwMTQsIDcsIDEpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50cyB6b29tIGNvdW50IGZyb20gZ29pbmcgcGFzdCA0XG4gICAgICAgICAgICAgICAgem9vbWNvdW50ID0gMztcbiAgICAgICAgICAgICAgICB6b29tVGltZWxpbmUoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh6b29tY291bnQgPT0gMikge1xuICAgICAgICAgICAgICAgIC8vIHpvb21jb3VudC0tXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJab29tIG91dCAnbW9udGggdmlldycgXCIsIHpvb21jb3VudClcbiAgICAgICAgICAgICAgICBjb29sbmV3U29ydE1ldGhvZCgpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbWluOiBuZXcgRGF0ZSgyMDEyLCA3LCAxKSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKDIwMTQsIDEsIDEpLFxuICAgICAgICAgICAgICAgICAgICBtYXg6IG5ldyBEYXRlKDIwMTQsIDcsIDEpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB6b29tVGltZWxpbmUoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh6b29tY291bnQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXaWxkY2FyZCB6b29tLCBwbGFjZWhvbGRlci4uLlRvZG9cIiwgem9vbWNvdW50KVxuICAgICAgICAgICAgICAgIHpvb21UaW1lbGluZSgpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHpvb21jb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNhbmNlbCB6b29tXCIsIHpvb21jb3VudClcbiAgICAgICAgICAgICAgICB6b29tY291bnQrK1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB6b29tVGltZWxpbmUoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aXN1YWxpemF0aW9uJyk7XG4gICAgICAgICAgICAgICAgdGltZWxpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRpbWVsaW5lID0gbmV3IHZpcy5UaW1lbGluZShjb250YWluZXIsIGl0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB0aW1lbGluZS5vbignc2VsZWN0JywgZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICBsb2dFdmVudCgnc2VsZWN0JywgcHJvcGVydGllcylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGF0dGFjaCBldmVudHMgdG8gdGhlIG5hdmlnYXRpb24gYnV0dG9uc1xuICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbUluJykub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgem9vbSgxKTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3pvb21PdXQnKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICB6b29tKC0xKTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgJHNjb3BlLmljb25zID0gW3tcbiAgICAgICAgICAgIHZhbHVlOiAxLFxuICAgICAgICAgICAgbGFiZWw6ICdPd25lcidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDIsXG4gICAgICAgICAgICBsYWJlbDogJ1BlcnNvbiBpbidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDMsXG4gICAgICAgICAgICBsYWJlbDogJ0Jlc3QgRnJpZW5kJ1xuICAgICAgICB9XTtcblxuXG4gICAgICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICB2YXIgdGFyZyA9IF8uZmluZFdoZXJlKCRzY29wZS50aGVfUHJvc3BlY3QuQ29udGFjdHMsIGNvbnRhY3QpXG4gICAgICAgICAgICB2YXIgZGlmZiA9IHRhcmcub2xkX3ZzX25ldztcbiAgICAgICAgICAgIC8vIG5lZWQgdG8gY2hlY2sgdGhlIGxlbmd0aCB0byBzZWUgaWYgaXQncyBhbiBhZGQgb3IgYSBkZWxldGVcbiAgICAgICAgICAgIGlmIChkaWZmLm9sZC5sZW5ndGggPiBkaWZmLm5ldy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlZCA9IF8uZGlmZmVyZW5jZShkaWZmLm9sZCwgZGlmZi5uZXcpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VidHJhY3RlZFwiLCBjaGFuZ2VkKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlZCA9IF8uZGlmZmVyZW5jZShkaWZmLm5ldywgZGlmZi5vbGQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkZWRcIiwgY2hhbmdlZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gY29vbG5ld1NvcnRNZXRob2QoKSB7XG4gICAgICAgICAgICB2YXIgbW9udGhzID0gMTJcbiAgICAgICAgICAgIHZhciB5ZWFycyA9IFsyMDEwLCAyMDExLCAyMDEyLCAyMDEzLCAyMDE0XVxuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IF8ucGx1Y2soQWN0aXZpdGllc19hbmRfSXNzdWVzLCAnbW9udGhfeWVhcicpO1xuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IF8udW5pcShyYW5nZXMpXG4gICAgICAgICAgICB2YXIgbW90aGVyc2hpcCA9IFtdXG4gICAgICAgICAgICByYW5nZXMuZm9yRWFjaChmdW5jdGlvbihyYW5nZSwgaXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBzID0gXy53aGVyZShBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgJ21vbnRoX3llYXInOiByYW5nZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1vdGhlcnNoaXBbaXRdID0gZ3JvdXBzO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaXRlbXMuY2xlYXIoKTtcblxuICAgICAgICAgICAgbW90aGVyc2hpcC5mb3JFYWNoKGZ1bmN0aW9uKGFycikge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBhcnJbMF0uaWQ7XG4gICAgICAgICAgICAgICAgYXJyWzBdLmNvbnRlbnQgPSBhcnIubGVuZ3RoICsgXCIgTm90ZXNcIlxuICAgICAgICAgICAgICAgIGFyclswXS53YXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhcnJbMF0uc3Vibm90ZXMgPSBhcnI7XG4gICAgICAgICAgICAgICAgaXRlbXMuYWRkKGFyclswXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5mYWN0b3J5KCdwcm9zcGVjdEZhY3RvcnknLFxuICAgICAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgdmFyIHByb3NwZWN0SUQ7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9yZXF1ZXN0OiBmdW5jdGlvbihtZXRob2QgPSAnZ2V0Jywgc3VmZml4ID0gJycsIGRhdGEgPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYGh0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3Byb3NwZWN0LyR7cHJvc3BlY3RJRH0vJHtzdWZmaXh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRQcm9zcGVjdF9ieV9JRDogZnVuY3Rpb24ocHJvc3BlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvc3BlY3RJRCA9IHByb3NwZWN0LlByb3NwZWN0SURcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ2dldCcpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQWRkRXZlbnQ6IGZ1bmN0aW9uKG5FdmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbkV2ZW50ID0gJC5wYXJhbShuRXZlbnQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwb3N0JywgYEFjdGl2aXR5YCwgbkV2ZW50KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgRWRpdEV2ZW50OiBmdW5jdGlvbihteUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBldmVudElEID0gRXZlbnQuRXZlbnRJRDsgbm90IHVzZWRcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG15RXZlbnQuc3Vibm90ZXMgLy8gYXJyYXkgdGhyb3dzIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIHZhciBteUV2ZW50ID0gJC5wYXJhbShteUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3B1dCcsIGBBY3Rpdml0eWAsIG15RXZlbnQpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBZGRDb250YWN0OiBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250YWN0ID0gJC5wYXJhbShjb250YWN0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncG9zdCcsIGBDb250YWN0YCwgY29udGFjdClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEVkaXRDb250YWN0OiBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250YWN0SUQgPSBjb250YWN0LkNvbnRhY3RJRDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhY3QgPSAkLnBhcmFtKGNvbnRhY3QpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncHV0JywgYENvbnRhY3QvJHtjb250YWN0SUR9YCwgY29udGFjdClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFkZElzc3VlOiBmdW5jdGlvbihpc3N1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNzdWUgPSAkLnBhcmFtKGlzc3VlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Bvc3QnLCBgSXNzdWVgLCBpc3N1ZSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEVkaXRJc3N1ZTogZnVuY3Rpb24oaXNzdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZVwiLCBpc3N1ZSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzc3VlSUQgPSBpc3N1ZS5Jc3N1ZUlEO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNzdWUgPSAkLnBhcmFtKGlzc3VlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3B1dCcsIGBJc3N1ZS8ke2lzc3VlSUR9YCwgaXNzdWUpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBFZGl0UHJvc3BlY3Q6IGZ1bmN0aW9uKHByb3NwZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBwcm9zcGVjdElEID0gcHJvc3BlY3QuUHJvc3BlY3RJRDtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3NwZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXkpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvc3BlY3Rba2V5XSA9PSAnJyB8fCBwcm9zcGVjdFtrZXldID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQmxhbmsgdmFsdWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9zcGVjdFtrZXldID0gXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3NwZWN0ID0gJC5wYXJhbShwcm9zcGVjdCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwdXQnLCAnJywgcHJvc3BlY3QpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ3F1ZXJ5Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRsb2NhdGlvbiwgcXVlcnlGYWN0b3J5LCAkcSwgJGFsZXJ0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicXVlcnkgQ29udHJvbGxlclwiLCAkc3RhdGVQYXJhbXMpXG4gICAgICAgICRzY29wZS5yZXN1bHRzUmV0dXJuZWQgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSB7fTtcbiAgICAgICAgJHNjb3BlLnRhYmxlQ29uZmlnID0ge1xuICAgICAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgICAgIGZpbGxMYXN0UGFnZTogZmFsc2UsXG4gICAgICAgICAgICBtYXhQYWdlczogNVxuICAgICAgICB9XG4gICAgICAgICRzY29wZS5xdWVyeU5hbWUgPSBcIlwiO1xuICAgICAgICAkc2NvcGUucHJvZHVjdExpc3QgPSBbXG4gICAgICAgICAgICBcIlRyaU5ldFwiLFxuICAgICAgICAgICAgXCJQcm9maXRHdWFyZFwiXG4gICAgICAgIF1cbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkUHJvZHVjdDtcbiAgICAgICAgJHNjb3BlLnF1ZXJ5TGlzdDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkUXVlcnk7XG4gICAgICAgICRzY29wZS5DbGlja2luZ190aGVfdGFibGVfbm93X3BlcmZvcm1zX2h0dHAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLlF1ZXJ5SUQ7XG4gICAgICAgICRzY29wZS5wYXJhbXM7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFN0YXRlcyA9IFtdO1xuICAgICAgICAkc2NvcGUuc3RhdGVzID0gW3tcbiAgICAgICAgICAgIHZhbHVlOiAnS2Fuc2FzJyxcbiAgICAgICAgICAgIGxhYmVsOiAnS2Fuc2FzJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ0FLJyxcbiAgICAgICAgICAgIGxhYmVsOiAnQXJrYW5zYXMnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnTU8nLFxuICAgICAgICAgICAgbGFiZWw6ICdNaXNzb3VyaSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdUWCcsXG4gICAgICAgICAgICBsYWJlbDogJ1RleGFzJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ05ZJyxcbiAgICAgICAgICAgIGxhYmVsOiAnTmV3IFlvcmsnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnQ0EnLFxuICAgICAgICAgICAgbGFiZWw6ICdDYWxpZm9ybmlhJ1xuICAgICAgICB9LCBdO1xuICAgICAgICAkc2NvcGUucXVlcnlQYXJhbXMgPSB7XG4gICAgICAgICAgICBTdGF0ZTogW11cbiAgICAgICAgfVxuICAgICAgICAvLyBuZy1tb2RlbFxuICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdCA9IHt9O1xuXG4gICAgICAgIC8vIHBvcHVsYXRlIHF1ZXJ5IGxpc3Q7XG4gICAgICAgIHF1ZXJ5RmFjdG9yeS5nZXRRdWVyaWVzKCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICRzY29wZS5xdWVyeUxpc3QgPSBkYXRhLmRhdGFcbiAgICAgICAgfSlcblxuXG4gICAgICAgICRzY29wZS5maW5kUXVlcnkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzUmV0dXJuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRXJwXCIsICRzY29wZS5zZWxlY3RlZFF1ZXJ5KVxuICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnNpbmdsZVF1ZXJ5KCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJzbyB0aGUgdXNlciB3YW50cyB0byBzZWUuLi5cIiwgZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUucGFyYW1zID0gJC5kZXBhcmFtKGRhdGEuZGF0YS5QYXJhbVN0cilcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0cyA9IGRhdGEuZGF0YS5yb3dzO1xuICAgICAgICAgICAgICAgICRzY29wZS5RdWVyeUlEID0gZGF0YS5kYXRhLlF1ZXJ5SUQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkU3RhdGVzID0gJHNjb3BlLnBhcmFtcy5TdGF0ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdC5OYW1lID0gXCJMT0FERUQgRlJPTSBEUk9QRE9XTiAtLSBxdWVyeSBuYW1lIGlzIFwiICsgZGF0YS5kYXRhLk5hbWU7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICAvLyAkc2NvcGUuc2VsZWN0ZWRTdGF0ZSA9ICcnO1xuXG4gICAgICAgICRzY29wZS5xdWVyeVNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gY2xlYXJpbmcgb2xkIHJlc3VsdHNcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzID0ge307XG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldyBzZWFyY2guLi5wbGVhc2Ugd2FpdC4uLlwiKVxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBzZXQgZWFjaCB2YXJpYWJsZSB3aGVuIGxvYWRlZC5cbiAgICAgICAgICAgICRzY29wZS5xdWVyeVBhcmFtcy5TdGF0ZSA9ICRzY29wZS5zZWxlY3RlZFN0YXRlc1xuXG4gICAgICAgICAgICAvLyBUT0RPIGdldCBQcm9kdWN0IGZyb20gc2VsZWN0XG4gICAgICAgICAgICAkc2NvcGUucXVlcnlQYXJhbXMuUHJvZHVjdElEID0gMVxuXG4gICAgICAgICAgICB2YXIgc3VibWl0ID0gcXVlcnlGYWN0b3J5LnF1ZXJ5UmVzdWx0cygkc2NvcGUucXVlcnlQYXJhbXMpO1xuICAgICAgICAgICAgdmFyIHByb2Nlc3MgPSBzdWJtaXQudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkdvdCBpdC4uLlwiLCBkYXRhLmRhdGEpXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCgkc2NvcGUucXVlcnlQYXJhbXMpXG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PSA0MDEpXG4gICAgICAgICAgICAgICAgLy8gdW5hdXRob3JpemVkXG4gICAgICAgICAgICAgICAgLy8gJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIjQwMSBpcyBoYW5kbGVkIGJ5IEludGVyY2VwdG9yc1wiKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS53aG9hID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIldob2FcIilcbiAgICAgICAgICAgIHF1ZXJ5RmFjdG9yeS51cGRhdGVRdWVyeU5hbWUoJHNjb3BlLlF1ZXJ5SUQpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDT01QTEVURVwiKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLkRlbGV0ZVByb3NwZWN0ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzLmZvckVhY2goKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYS5Qcm9zcGVjdElEID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGEuU3RhdHVzID8gYS5TdGF0dXMgPSAwIDogYS5TdGF0dXMgPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLkNsaWNraW5nX3RoZV90YWJsZV9ub3dfcGVyZm9ybXNfaHR0cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5U3RhdHVzKCRzY29wZS5RdWVyeUlELCBpZCwgYS5TdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2F2ZVRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoJHNjb3BlLkNsaWNraW5nX3RoZV90YWJsZV9ub3dfcGVyZm9ybXNfaHR0cCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRlXCIpXG4gICAgICAgICAgICAgICAgJHNjb3BlLndob2EoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzY29wZS5zYXZlT2JqZWN0LnJvd3MgPSAkc2NvcGUucmVzdWx0cztcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gJGxvY2F0aW9uLnNlYXJjaCgpO1xuICAgICAgICAgICAgICAgIHZhciBtb2QgPSAkLnBhcmFtKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNhdmVPYmplY3QuUGFyYW1TdHIgPSBtb2Q7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNhdmVPYmplY3QuUHJvZHVjdCA9IDE7XG4gICAgICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnNhdmVRdWVyeSgkc2NvcGUuc2F2ZU9iamVjdCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUuY2FtcGFpZ24ubmV3Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FtcGFpZ25JRDogcmVzLmRhdGEuUXVlcnlJRFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBteUFsZXJ0ID0gJGFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlcnIuc3RhdHVzLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBlcnIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5nb0hyZWYgPSBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXYpXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVja2VkIG9uIGxvYWQ7XG4gICAgICAgIGlmICgkc3RhdGVQYXJhbXMuU3RhdGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byByZWFkIHRoZSBVUkwgYW5kIHNldCBlYWNoICRzY29wZSB2YXJpYWJsZVxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkU3RhdGVzID0gWyRzdGF0ZVBhcmFtcy5TdGF0ZV1cbiAgICAgICAgICAgICRzY29wZS5xdWVyeVNlYXJjaCgpO1xuICAgICAgICB9XG5cblxuXG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdxdWVyeUZhY3RvcnknLFxuLy8gbm93IFJlc2VhcmNoIEZhY3RvcnlcbiBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBxdWVyeVJlc3VsdHM6ZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkdldHRpbmcgcXVlcnkgd2l0aCBwYXJhbXMgXCIsIHVybClcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaCcsIHtwYXJhbXM6IHVybCB9IClcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlUXVlcnk6IGZ1bmN0aW9uKHJvd0lEKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCcnKVxuICAgICAgICB9LFxuICAgICAgICBkZWxldGVQcm9zcGVjdDogZnVuY3Rpb24oaWQpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvcHJvc3BlY3RzJywge3BhcmFtczogeydzdGFydCc6ICc1JywgJ2VuZCc6ICcyMCd9IH0gKVxuICAgICAgICB9LFxuICAgICAgICBzYXZlUXVlcnk6IGZ1bmN0aW9uKHByb3NwZWN0cyl7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJTYXZlIHF1ZXJ5IFByb3NwZWN0cyBcIiwgcHJvc3BlY3RzKVxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaCcsICQucGFyYW0ocHJvc3BlY3RzKSApXG4gICAgICAgIH0sXG4gICAgICAgIGdldFF1ZXJpZXM6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvbGlzdCcpXG4gICAgICAgIH0sXG4gICAgICAgIHNpbmdsZVF1ZXJ5OiBmdW5jdGlvbihxdWVyeUlEKXtcbiAgICAgICAgICAvLyBFUzYgVGVtcGxhdGUgU3RyaW5nc1xuICAgICAgICAgIC8vIHJldHVybiAkaHR0cC5nZXQoYC9hcGkvcXVlcnkvJHtxdWVyeUlEfWApXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvJyArIHF1ZXJ5SUQpO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVRdWVyeU5hbWU6IGZ1bmN0aW9uKHF1ZXJ5SUQpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoLycgKyBxdWVyeUlELCAkLnBhcmFtKHsnTmFtZSc6ICdBbmd1bGFyJ30pIClcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlUXVlcnlTdGF0dXM6IGZ1bmN0aW9uKFF1ZXJ5SUQsIFByb3NwZWN0SUQsIHN0YXR1cyl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvJyArIFF1ZXJ5SUQgKyAnLycgKyBQcm9zcGVjdElELCAkLnBhcmFtKHsnU3RhdHVzJzogc3RhdHVzfSkgKVxuICAgICAgICB9XG4gICAgfTtcbiAgfVxuKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgncm9sZXNGYWN0b3J5Jyxcbi8vIG5vdyBSZXNlYXJjaCBGYWN0b3J5XG4gZnVuY3Rpb24gKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGlzdFJvbGVzOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9Sb2xlcycgKVxuICAgICAgICB9LFxuICAgICAgICBnZXRVc2VyczpmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3VzZXJzJylcbiAgICAgICAgfSxcbiAgICAgICAgYWRkUm9sZTpmdW5jdGlvbih1c2VyLCByb2xlSUQpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2Vycy8nK3VzZXIrJy9Sb2xlcy8nK3JvbGVJRClcbiAgICAgICAgfVxuICAgIH07XG4gIH1cbik7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ3JvbGVzQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCByb2xlc0ZhY3RvcnkpIHtcbiAgY29uc29sZS5sb2coXCJSb2xlcyBjb250cm9sbGVyXCIpXG5cbiAgJHNjb3BlLmF2YWlsYWJsZVJvbGVzO1xuICByb2xlc0ZhY3RvcnkubGlzdFJvbGVzKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCByb2xlcy4uLlwiLCBkYXRhLmRhdGEpXG4gICAgJHNjb3BlLmF2YWlsYWJsZVJvbGVzID0gZGF0YS5kYXRhO1xuICB9KTtcblxuICAkc2NvcGUuYXZhaWxhYmxlVXNlcnM7XG4gIHJvbGVzRmFjdG9yeS5nZXRVc2VycygpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJHb3QgdXNlcnNcIiwgZGF0YS5kYXRhKVxuICAgICRzY29wZS5hdmFpbGFibGVVc2VycyA9IGRhdGEuZGF0YS5Vc2VyTGlzdFxuICB9KVxuXG5cbiAgJHNjb3BlLmFkZFJvbGUgPSBmdW5jdGlvbihuYW1lLCByb2xlSUQpe1xuICAgIGNvbnNvbGUubG9nKG5hbWUsIHJvbGVJRClcbiAgICByb2xlc0ZhY3RvcnkuYWRkUm9sZShuYW1lLCByb2xlSUQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICBjb25zb2xlLmxvZyhcIkRvbmVcIilcbiAgICB9KVxuICB9XG5cbn0pXG4iLCJcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ3NlYXJjaENvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0LCBzZWFyY2hGYWN0b3J5LCAkdGltZW91dCwgJGxvY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8gc2VhcmNoXCIpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoYm94XCIpLmZvY3VzKCk7XG4gICAgICAgICRzY29wZS5wYXJhbXNPYmogPSB7XG4gICAgICAgICAgICBQcm9zcGVjdElEOiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnByb3NwZWN0VHlwZSA9IFt7XG4gICAgICAgICAgICB2YWx1ZTogJ1AnLFxuICAgICAgICAgICAgbGFiZWw6ICdQcm9zcGVjdCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdBJyxcbiAgICAgICAgICAgIGxhYmVsOiAnQWN0aXZlJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ0YnLFxuICAgICAgICAgICAgbGFiZWw6ICdGb3JtZXInXG4gICAgICAgIH1dO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRQcm9zcGVjdFR5cGUgPSAkc2NvcGUucHJvc3BlY3RUeXBlLm1hcCh0eXBlID0+IHR5cGUudmFsdWUpXG4gICAgICAgICRzY29wZS5jdXN0b21lclR5cGUgPSBbe1xuICAgICAgICAgICAgdmFsdWU6ICdQJyxcbiAgICAgICAgICAgIGxhYmVsOiAnUHJvZml0R3VhcmQnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnTicsXG4gICAgICAgICAgICBsYWJlbDogJ05lZ290aWF0b3InXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnUycsXG4gICAgICAgICAgICBsYWJlbDogJ1NlcnZpY2VzIE9ubHknXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnRycsXG4gICAgICAgICAgICBsYWJlbDogJ0dvdmVybm1lbnQnXG4gICAgICAgIH1dO1xuXG4gICAgICAgICRzY29wZS5zZWxlY3RlZEN1c3RvbWVyVHlwZSA9ICRzY29wZS5jdXN0b21lclR5cGUubWFwKHR5cGUgPT4gdHlwZS52YWx1ZSlcblxuXG4gICAgICAgIC8vICRzY29wZS5zZWxlY3RlZEN1c3RvbWVyVHlwZSA9IFtcbiAgICAgICAgLy8gICAgIGZvciAoe1xuICAgICAgICAvLyAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICBvZiAkc2NvcGUuY3VzdG9tZXJUeXBlKSB2YWx1ZVxuICAgICAgICAvLyBdXG5cbiAgICAgICAgJHNjb3BlLkJETXMgPSBbJ0JETTAxJywgJ0JETTAyJywgJ0JETTAzJywgJ0JETTA0J11cbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQkRNID0gW1xuICAgICAgICAgICAgZm9yICh4IG9mICRzY29wZS5CRE1zKSB4XG4gICAgICAgIF1cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInBhcmFtc1wiLCAkc3RhdGUucGFyYW1zKVxuXG4gICAgICAgIHZhciBzdGF0ZVBhcmFtcyA9ICRzdGF0ZS5wYXJhbXNcbiAgICAgICAgT2JqZWN0LmtleXMoc3RhdGVQYXJhbXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzdGF0ZVBhcmFtc1trZXldKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0YXRlUGFyYW1zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290XCIsIHN0YXRlUGFyYW1zKVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhzdGF0ZVBhcmFtcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRoZXJlJ3MgcGFyYW1zLCBndXlzISEhXCIpXG4gICAgICAgICAgICBzZWFyY2hGYWN0b3J5LnNlYXJjaChzdGF0ZVBhcmFtcykudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlYXJjaFJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZW1wdHlSZXN1bHRzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zZWFyY2hSZXN1bHRzID0gcmVzLmRhdGEubWFwKHNlYXJjaFJlc3VsdCA9PiBuZXcgUHJvc3BlY3Qoc2VhcmNoUmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzLmRhdGEuZm9yRWFjaChmdW5jdGlvbihwcm9zcGVjdCl7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cy5wdXNoKCBuZXcgUHJvc3BlY3QocHJvc3BlY3QpIClcbiAgICAgICAgICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZW1wdHlSZXN1bHRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBkYXRhXCIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5zZWFyY2hSZXN1bHRzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gc3RhdGUgcGFyYW1zIHByZXNlbnRcIilcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jb25maWcgPSB7XG4gICAgICAgICAgICBpdGVtc1BlclBhZ2U6IDEwLFxuICAgICAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNlYXJjaFJlc3VsdHMgPSBbXTtcbiAgICAgICAgJHNjb3BlLmVtcHR5UmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuc2VhcmNoU3RyaW5nID0gJydcblxuICAgICAgICAkc2NvcGUuc3RhcnRTZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RhcnQ/XCIsICRzY29wZS5wYXJhbXNPYmopXG4gICAgICAgICAgICBPYmplY3Qua2V5cygkc2NvcGUucGFyYW1zT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucGFyYW1zT2JqW2tleV0gPSAkc2NvcGUuc2VhcmNoU3RyaW5nO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goJHNjb3BlLnBhcmFtc09iailcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zZWFyY2hPcHRpb25zID0gW1xuICAgICAgICAgICAgJ1Byb3NwZWN0SUQnLFxuICAgICAgICAgICAgJ0N1c3RJRCcsXG4gICAgICAgICAgICAnTkNQRFAnLFxuICAgICAgICAgICAgJ05QSSdcbiAgICAgICAgXVxuICAgICAgICAvLyBzZXRzIGRlZmF1bHQgdG8gJ1Byb3NwZWN0SUQnXG4gICAgICAgICRzY29wZS5pdGVtID0gJHNjb3BlLnNlYXJjaE9wdGlvbnNbMF1cblxuICAgICAgICAvLyBzZXQgJHNjb3BlLnBhcmFtc09iaiBmcm9tIGRyb3Bkb3duXG4gICAgICAgICRzY29wZS5zZWFyY2hTZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoYm94XCIpLmZvY3VzKCk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cygkc2NvcGUucGFyYW1zT2JqKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgJHNjb3BlLnBhcmFtc09ialtrZXldXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJHNjb3BlLnBhcmFtc09ialskc2NvcGUuaXRlbV0gPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5nb3RvUHJvc3BlY3QgPSBmdW5jdGlvbihwcm9zcGVjdElEKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUucHJvc3BlY3QnLCB7XG4gICAgICAgICAgICAgICAgUHJvc3BlY3RJRDogcHJvc3BlY3RJRFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5DaXR5U3RhdGVaaXBfc3RyaW5nO1xuXG4gICAgICAgICRzY29wZS5mbkNpdHlTdGF0ZVppcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9wcmlvcml0aXplcyB6aXAsIHRoZW4gY2l0eSwgYW5kIGxhc3RseSBzdGF0ZVxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW11cbiAgICAgICAgICAgICRzY29wZS5DaXR5U3RhdGVaaXBfc3RyaW5nLnNwbGl0KCcsJykuZm9yRWFjaCgod29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goJC50cmltKHdvcmQpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFycmF5KVxuXG5cbiAgICAgICAgICAgIC8vdHVybnMgXCJNTyA2NDExMFwiIGludG8gdHdvIHN0cmluZ3NcbiAgICAgICAgICAgIC8vIG9yIFwiS2Fuc2FzIENpdHkgNjQxMTBcIlxuICAgICAgICAgICAgdmFyIG5vU3BhY2VzID0gW107XG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKCh3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgbm9TcGFjZXMucHVzaCh3b3JkLnNwbGl0KCcgJykpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdmFyIHppcCA9IFwiXCI7XG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKChwYXJ0KSA9PiB7XG4gICAgICAgICAgICAgICAgemlwID0gZXh0cmFjdFppcChwYXJ0KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWmlwP1wiLCB6aXApXG4gICAgICAgICAgICBpZiAoemlwLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcbiAgICAgICAgICAgICAgICAgICAgJ1ppcCc6IHppcFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbW1hIHNlcGFyYXRlZFwiLCBhcnJheSlcblxuICAgICAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZih6aXApO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlbW92ZWQgemlwIG9iamVjdFwiLCBhcnJheSlcblxuICAgICAgICAgICAgLy8gaWYgc3RyaW5nIGlzID09IHRoYW4gMiBpdCdzIHN0YXRlXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSAnJ1xuICAgICAgICAgICAgYXJyYXkuZm9yRWFjaCgoc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPT0gMikgc3RhdGUgPSBzdHJpbmdcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3RhdGVcIiwgc3RhdGUpXG5cbiAgICAgICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2Yoc3RhdGUpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZW1vdmVkIHN0YXRlIG9iamVjdFwiLCBhcnJheSlcblxuICAgICAgICAgICAgLy8gaWYgbm8gemlwLCBzZWFyY2ggYnkgY2l0eVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaW5hbCBjaGVja1wiLCBhcnJheSlcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwICYmIHppcC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWxsIHdlJ3ZlIGdvdCBsZWZ0IGlzIENpdHlcIilcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcbiAgICAgICAgICAgICAgICAgICAgJ0NpdHknOiBhcnJheVswXVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIG5vIHppcCBvciBjaXR5LCBzZWFyY2ggYnkgc3RhdGVcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT0gMCAmJiB6aXAubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHtcbiAgICAgICAgICAgICAgICAgICAgJ1N0YXRlJzogc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIFwiUHJvc3BlY3RUeXBlXCI6ICRzY29wZS5zZWxlY3RlZFByb3NwZWN0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgXCJDdXN0b21lclR5cGVcIjogJHNjb3BlLnNlbGVjdGVkQ3VzdG9tZXJUeXBlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZXh0cmFjdFppcChzdHIpIHtcbiAgICAgICAgICAgICAgICAvL3RoZSByZWd1bGFyIGV4cHJlc3Npb24gYmVsb3cgaXMgZm9yIDUgZGlnaXQgVVMgWklQIGNvZGUsIDUgZGlnaXQgVVMgWklQIGNvZGUgKyA0LFxuICAgICAgICAgICAgICAgIC8vYW5kIDYgZGlnaXQgYWxwaGFudW1lcmljIENhbmFkaWFuIFBvc3RhbCBDb2RlXG4gICAgICAgICAgICAgICAgdmFyIHJlID0gL1xcZHs1fS1cXGR7NH18XFxkezV9fFtBLVpdXFxkW0EtWl0gXFxkW0EtWl1cXGQvXG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gc3RyO1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHJlLmV4ZWMoaW5wdXQpXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuIiwiLy8gYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi8vIC5mYWN0b3J5KCdzZWFyY2hGYWN0b3J5Jyxcbi8vICBmdW5jdGlvbiAoJGh0dHApIHtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICBzZWFyY2g6IGZ1bmN0aW9uKHBhcmFtc09iail7XG4vLyAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUHJvc3BlY3QnLCB7cGFyYW1zOiBwYXJhbXNPYmogfSApXG4vLyAgICAgICAgIH1cbi8vICAgICB9O1xuLy8gICB9XG4vLyApO1xuXG5hbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ3NlYXJjaEZhY3RvcnknLFxuICAgIGZ1bmN0aW9uICgkaHR0cCwgJGxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2VhcmNoOiBmdW5jdGlvbihwYXJhbXNPYmope1xuICAgICAgICAgICAgdmFyIGJvcnJvd2VkVGltZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KFwic2VhcmNoXCIpWzFdXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9Qcm9zcGVjdCcgKyBib3Jyb3dlZFRpbWUgKVxuICAgICAgICB9XG4gICAgfTtcbiAgfVxuKTtcbiIsIi8vIGNsYXNzIFRhc2sge1xuLy8gICAgIGNvbnN0cnVjdG9yKG9iaikge1xuLy8gICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4vLyAgICAgfVxuLy8gfVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuc2VydmljZSgnVGFza1NlcnZpY2UnLCBmdW5jdGlvbihMb2dpblNlcnZpY2UsIHRhc2tGYWN0b3J5KSB7XG4gICAgICAgIGNsYXNzIFRhc2sge1xuICAgICAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgICAgIHRoaXMuRHVlRGF0ZSA9IG1vbWVudChvYmouQ29tcGxldGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJsbFwiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2xhc3MgVGFza0xpc3QgZXh0ZW5kcyBBcnJheSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGQoYXJyYXkpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2gobmV3IFRhc2soYXJyYXlbaV0pKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZShhY3Rpdml0eUlEKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UodGhpcy5tYXAodGFza3MgPT4gdGFza3MuQWN0aXZpdHlJRCkuaW5kZXhPZihhY3Rpdml0eUlEKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGUoQWN0aXZpdHlJRDogbnVtYmVyLCBTdGF0dXM6IG51bWJlcikge1xuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy5tYXAodGFza3MgPT4gdGFza3MuQWN0aXZpdHlJRCkuaW5kZXhPZihBY3Rpdml0eUlEKV0uU3RhdHVzID0gU3RhdHVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHVzaCguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkdXBsaWNhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHRoaXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnc1tpXS5BY3Rpdml0eUlEID09IHRoaXNbaWldLkFjdGl2aXR5SUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2hpZnQobmV3IFRhc2soYXJnc1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNsYXNzIFVzZXJMaXN0IGV4dGVuZHMgQXJyYXkge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHVzaCguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgLy8gdW5pcXVlIGFycmF5O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZHVwbGljYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB0aGlzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3NbaV0uVXNlcklEID09IHRoaXNbaWldLlVzZXJJRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5zaGlmdChuZXcgVXNlcihhcmdzW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmUoVXNlcklEKSB7XG4gICAgICAgICAgICAgICAgaWYgKExvZ2luU2VydmljZS5jb29raWVfdXNlcigpID09IFVzZXJJRCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW4ndCByZW1vdmUgeW91cnNlbGZcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNwbGljZSh0aGlzLm1hcCh1c2VyID0+IHVzZXIuVXNlcklEKS5pbmRleE9mKFVzZXJJRCksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNsYXNzIFVzZXIge1xuICAgICAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgICAgIHRoaXMuVGFzayA9IFwiYmxhbmtcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlKHVzZXIpIHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZSB0aGlzIHVzZXIuLi4/XCIsIHVzZXIpXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH1cblxuICAgICAgICBjbGFzcyBUYXNrU2VydmljZSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgICAgICB0aGlzLlRhc2tMaXN0ID0gbmV3IFRhc2tMaXN0KClcbiAgICAgICAgICAgICAgICB0aGlzLlVzZXJMaXN0ID0gbmV3IFVzZXJMaXN0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5EZXBhcnRtZW50cyA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuR3JvdXBzID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBGaW5kVXNlcihVc2VySUQ6IG51bWJlcik6IE9iamVjdCB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJGaW5kIHVzZXIgYnkgdXNlciBJRFwiKVxuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLkdyb3Vwcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuR3JvdXBzW2tleV0uZm9yRWFjaChmdW5jdGlvbihyb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWR4ID0gc2VsZi5Hcm91cHNba2V5XS5tYXAodXNlciA9PiB1c2VyLlVzZXJJRCkuaW5kZXhPZihVc2VySUQpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBzZWxmLkdyb3Vwc1trZXldW2lkeF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGFza1NlcnZpY2UgPSBuZXcgVGFza1NlcnZpY2UoKTtcbiAgICAgICAgLy8gdG9kbyAtPiB0aGlzIGlzIGEgY29tcGxldGVseSBkaWZmZXJlbnQgYXJyYXkvc2NvcGUvbW9kZWxcbiAgICAgICAgdGFza0ZhY3RvcnkuZ2V0VXNlcnMoKS50aGVuKGZ1bmN0aW9uKHVzZXJzKSB7XG4gICAgICAgICAgICB0YXNrU2VydmljZS5EZXBhcnRtZW50cy5wdXNoKC4uLl8uY2hhaW4odXNlcnMuZGF0YS5Vc2VyTGlzdClcbiAgICAgICAgICAgICAgICAucGx1Y2soJ0RlcGFydG1lbnQnKVxuICAgICAgICAgICAgICAgIC51bmlxKClcbiAgICAgICAgICAgICAgICAudmFsdWUoKSlcbiAgICAgICAgICAgIHZhciBncm91cHMgPSBfLmdyb3VwQnkodXNlcnMuZGF0YS5Vc2VyTGlzdCwgXCJEZXBhcnRtZW50XCIpO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGdyb3Vwcykge1xuICAgICAgICAgICAgICAgIHRhc2tTZXJ2aWNlLkdyb3Vwc1trZXldID0gZ3JvdXBzW2tleV07XG4gICAgICAgICAgICAgICAgdGFza1NlcnZpY2UuR3JvdXBzW2tleV0uZm9yRWFjaCh4ID0+IHgub25saW5lID0gZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRhc2tTZXJ2aWNlLkdyb3Vwc1trZXldLmZvckVhY2goeCA9PiB4LmltZyA9IHBzdWVkb1JhbmRvbSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBmdW5jdGlvbiBwc3VlZG9SYW5kb20oKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFJlc3VsdCA9IDE7XG4gICAgICAgICAgICB2YXIgY291bnQgPSAxO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDFcbiAgICAgICAgICAgIGlmIChjb3VudCA8IDMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNCAtIGxhc3RSZXN1bHQpICsgY291bnQpXG4gICAgICAgICAgICAgICAgbGFzdFJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvdW50ID0gMFxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNCAtIGxhc3RSZXN1bHQpICsgbGFzdFJlc3VsdClcbiAgICAgICAgICAgICAgICBsYXN0UmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXNrU2VydmljZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmRpcmVjdGl2ZSgndGFza3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLCAvL0UgPSBlbGVtZW50LCBBID0gYXR0cmlidXRlLCBDID0gY2xhc3MsIE0gPSBjb21tZW50ICAgICAgICAgXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIC8vQCByZWFkcyB0aGUgYXR0cmlidXRlIHZhbHVlLCA9IHByb3ZpZGVzIHR3by13YXkgYmluZGluZywgJiB3b3JrcyB3aXRoIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyB0ZW1wbGF0ZTogJzxkaXY+e3sgbXlWYWwgfX08L2Rpdj4nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvdGFza3MvdGFza3MudG1wbC5odG1sJyxcbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXJGdW5jdGlvbiwgLy9FbWJlZCBhIGN1c3RvbSBjb250cm9sbGVyIGluIHRoZSBkaXJlY3RpdmVcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHt9IC8vRE9NIG1hbmlwdWxhdGlvblxuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5mYWN0b3J5KCdodWJGYWN0b3J5JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgSHViLCAkcSwgVGFza1NlcnZpY2UpIHtcblxuICAgICAgICAvL2RlY2xhcmluZyB0aGUgaHViIGNvbm5lY3Rpb25cbiAgICAgICAgdmFyIGh1YiA9IG5ldyBIdWIoJ2FjdGl2aXR5UXVldWVIdWInLCB7XG4gICAgICAgICAgICAvLyB2YXIgaHViID0gbmV3IEh1YignbW92ZVNoYXBlSHViJywge1xuXG4gICAgICAgICAgICAvL2NsaWVudCBzaWRlIG1ldGhvZHNcbiAgICAgICAgICAgIGxpc3RlbmVyczoge1xuICAgICAgICAgICAgICAgICd0YXNrV29ya2luZyc6IGZ1bmN0aW9uKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhIHRhc2sgc3RhdHVzIHdhcyBjaGFuZ2VkLi4uLlwiLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhc2sgPSBUYXNrU2VydmljZS5UYXNrTGlzdC5maW5kKHggPT4geC5BY3Rpdml0eUlEID09IGluZm8uQWN0aXZpdHlJRClcbiAgICAgICAgICAgICAgICAgICAgdGFzay5TdGF0dXMgPSBpbmZvLlN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgVGFza1NlcnZpY2UuRmluZFVzZXIoaW5mby5Vc2VySUQpLlRhc2sgPSB0YXNrXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAndXNlckpvaW5lZCc6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGpvaW5lZFwiLCB1c2VyKVxuICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5Vc2VyTGlzdC5wdXNoKHVzZXIpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ3VzZXJMZWZ0JzogZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgbGVmdFwiLCB1c2VyKVxuICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5Vc2VyTGlzdC5yZW1vdmUodXNlci5Vc2VySUQpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIHJvb3RQYXRoOiBcImh0dHA6Ly8xMC4xLjEuMjI2L3NpZ25hbHJcIixcbiAgICAgICAgICAgIHJvb3RQYXRoOiBcImh0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvc2lnbmFsclwiLFxuXG4gICAgICAgICAgICAvL3NlcnZlciBzaWRlIG1ldGhvZHNcbiAgICAgICAgICAgIG1ldGhvZHM6IFsnR2V0VGFza3MnLCAnY2hhbmdlVGFza1N0YXR1c0QnLCAnV2hvQW1JJywgJ0NoYW5nZVRhc2tTdGF0dXMnLCAnVGltZVVudGlsTmV4dEZpbGwnXSxcblxuICAgICAgICAgICAgLy9xdWVyeSBwYXJhbXMgc2VudCBvbiBpbml0aWFsIGNvbm5lY3Rpb25cbiAgICAgICAgICAgIC8vIHF1ZXJ5UGFyYW1zOntcbiAgICAgICAgICAgIC8vICAgICAndG9rZW4nOiAnZXhhbXBsZXRva2VuJ1xuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgdmFyIFRpbWVVbnRpbE5leHRGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IHRpbWUgdW50aWwgbmV4dCBmaWxsXCIpXG4gICAgICAgICAgICBodWIuVGltZVVudGlsTmV4dEZpbGwoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc1wiLCBkYXRhKVxuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgaHViLmluaXQoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgaWYgKHJlcy5fc3Vic2NyaWJlZFRvSHVicykge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAvL21vdmVTaGFwZUh1Yi5pbnZva2UoJ3VwZGF0ZU1vZGVsJywgc2hhcGVNb2RlbClcblxuICAgICAgICB2YXIgZ2V0Q3VycmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldCBjdXJyZW50XCIpXG4gICAgICAgICAgICBodWIuaGVsbG9fSW1fQ29ubmVjdGVkKHNoYXBlTW9kZWwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldCBXaG9BbUlcIilcbiAgICAgICAgICAgIGh1Yi5XaG9BbUkoXCJwYmFqb2pcIikudGhlbihmdW5jdGlvbih1c2Vycykge1xuICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlVzZXJMaXN0LnB1c2goLi4udXNlcnMpO1xuICAgICAgICAgICAgICAgIHVzZXJzLmZvckVhY2goZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5GaW5kVXNlcih1c2VyLlVzZXJJRCkub25saW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBDaGFuZ2VUYXNrU3RhdHVzID0gZnVuY3Rpb24oYWN0aXZpdHlJRCwgc3RhdHVzKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGh1Yi5DaGFuZ2VUYXNrU3RhdHVzKGFjdGl2aXR5SUQsIHN0YXR1cykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEb25lIGNoYW5naW5nIHN0YXR1c1wiKVxuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHZhciBHZXRUYXNrcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHZXR0aW5nIHRhc2tzXCIpXG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGh1Yi5HZXRUYXNrcygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgbWFwOiBnZXRDdXJyZW50LFxuICAgICAgICAgICAgICAgIFdob0FtSTogZ2V0VXNlcixcbiAgICAgICAgICAgICAgICBHZXRUYXNrczogR2V0VGFza3MsXG4gICAgICAgICAgICAgICAgQ2hhbmdlVGFza1N0YXR1czogQ2hhbmdlVGFza1N0YXR1cyxcbiAgICAgICAgICAgICAgICBUaW1lVW50aWxOZXh0RmlsbDogVGltZVVudGlsTmV4dEZpbGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWZlcnJlZC5wcm9taXNlXG4gICAgICAgIF1cblxuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCd0YXNrQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgVGFza1NlcnZpY2UsICRzdGF0ZSwgaHViRmFjdG9yeSwgJGludGVydmFsLCAkY29tcGlsZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlRhc2sgQ29udHJvbGxlciBsb2FkZWRcIilcbiAgICAgICAgJHNjb3BlLnRpbWU7XG4gICAgICAgICRzY29wZS50YXNrcyA9IFRhc2tTZXJ2aWNlLlRhc2tMaXN0O1xuICAgICAgICAkc2NvcGUudXNlcnMgPSBUYXNrU2VydmljZS5Vc2VyTGlzdDtcbiAgICAgICAgJHNjb3BlLmRlcGFydG1lbnRzID0gVGFza1NlcnZpY2UuRGVwYXJ0bWVudHM7XG5cbiAgICAgICAgJHNjb3BlLmRlcENvbGxhcHNlT25saW5lID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLmRlcENvbGxhcHNlID0gdHJ1ZTtcblxuICAgICAgICAkc2NvcGUuZ3JvdXBzID0gVGFza1NlcnZpY2UuR3JvdXBzO1xuXG4gICAgICAgICRzY29wZS5jb25maWcgPSB7XG4gICAgICAgICAgICBpdGVtc1BlclBhZ2U6IDUsXG4gICAgICAgICAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgW21ldGhvZHMsIGluaXRdID0gaHViRmFjdG9yeTtcbiAgICAgICAgaW5pdC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJEb3VibGUgZG9uZVwiKVxuICAgICAgICAgICAgLy8gcmVnaXN0ZXIgdXNlcm5hbWUgd2l0aCBzZXJ2ZXJcbiAgICAgICAgICAgIG1ldGhvZHMuV2hvQW1JKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRvbGQgc2VydmVyIHdobyB3ZSBhcmVcIilcbiAgICAgICAgICAgICAgICBtZXRob2RzLkdldFRhc2tzKCkudGhlbihmdW5jdGlvbih0YXNrcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCB0YXNrc1wiLCB0YXNrcylcbiAgICAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRhc2tzLmFkZChyZXMpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50YXNrcy5wdXNoKC4uLnRhc2tzKVxuICAgICAgICAgICAgICAgICAgICAvLyAkc2NvcGUudGFza3MucHVzaCguLi50YXNrcylcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5UaW1lVW50aWxOZXh0RmlsbCgpLnRoZW4oZnVuY3Rpb24odGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgdGltZVwiLCB0aW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRpbWUgPSB0aW1lLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiI2NyYW5rZWRcIikuYXBwZW5kKCc8dGltZXIgZW5kLXRpbWU9XCJ0aW1lXCI+e3tob3Vyc319IGhvdXJzLCB7e21pbnV0ZXN9fSBtaW51dGVzLCB7e3NlY29uZHN9fSBzZWNvbmRzLjwvdGltZXI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29tcGlsZSgkKFwiI2NyYW5rZWRcIikpKCRzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGdWRnZVwiKVxuICAgICAgICB9KVxuXG4gICAgICAgICRzY29wZS5zaG93VGFza3MgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnBvcFRhc2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd1Rhc2tzID0gISRzY29wZS5zaG93VGFza3MgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2hvd1VzZXJzID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5wb3BVc2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93IHVzZXJzXCIpXG4gICAgICAgICAgICAkc2NvcGUuc2hvd1VzZXJzID0gISRzY29wZS5zaG93VXNlcnMgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2hvd1Rhc2tPcHRpb25zID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5wcm9zcGVjdElEO1xuICAgICAgICAkc2NvcGUubmF2aWdhdGUgPSBmdW5jdGlvbihwcm9zcGVjdElEOiBudW1iZXIsIFN0YXR1czogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoU3RhdHVzID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gZ28sIGl0J3MgYmVpbmcgd29ya2VkIGFscmVhZHlcIilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUuc2hvd1Rhc2tPcHRpb25zID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5wcm9zcGVjdElEID0gcHJvc3BlY3RJRFxuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lLnByb3NwZWN0Jywge1xuICAgICAgICAgICAgICAgIFByb3NwZWN0SUQ6IHByb3NwZWN0SURcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuQ2hhbmdlVGFza1N0YXR1cyA9IGZ1bmN0aW9uKGFjdGl2aXR5SUQsIHN0YXR1cykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpdml0eSBpZFwiLCBhY3Rpdml0eUlELCBcInN0YXR1c1wiLCBzdGF0dXMpXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXRob2RzLkNoYW5nZVRhc2tTdGF0dXMoYWN0aXZpdHlJRCwgc3RhdHVzKVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnVzZXJNZXRob2QgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXJcIiwgdXNlcilcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdG9wID0gJGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gaWYgdGltZSBzb21ldGhpbmcgc29tZXRoaW5nXG4gICAgICAgICAgICBpZiAobW9tZW50KCRzY29wZS50aW1lKS5pc0JlZm9yZShtb21lbnQobmV3IERhdGUpKSkge1xuICAgICAgICAgICAgICAgIG1ldGhvZHMuR2V0VGFza3MoKS50aGVuKGZ1bmN0aW9uKHRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290XCIsIHRhc2tzKVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGFza3MucHVzaCguLi50YXNrcylcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy5UaW1lVW50aWxOZXh0RmlsbCgpLnRoZW4oZnVuY3Rpb24odGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgdGltZVwiLCB0aW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRpbWUgPSB0aW1lLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiI2NyYW5rZWRcIikuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjY3JhbmtlZFwiKS5hcHBlbmQoJzx0aW1lciBlbmQtdGltZT1cInRpbWVcIj57e2hvdXJzfX0gaG91cnMsIHt7bWludXRlc319IG1pbnV0ZXMsIHt7c2Vjb25kc319IHNlY29uZHMuPC90aW1lcj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb21waWxlKCQoXCIjY3JhbmtlZFwiKSkoJHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIDEwMDAwKTtcblxuICAgICAgICAkc2NvcGUuc3RvcEZpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoc3RvcCkpIHtcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKHN0b3ApO1xuICAgICAgICAgICAgICAgIHN0b3AgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBpbnRlcnZhbCBpcyBkZXN0cm95ZWQgdG9vXG4gICAgICAgICAgICAkc2NvcGUuc3RvcEZpZ2h0KCk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5mYWN0b3J5KCd0YXNrRmFjdG9yeScsXG4gICAgICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldFVzZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuIiwidmFyICRodG1sID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF0pO1xuXG5hbmd1bGFyLmVsZW1lbnQoKS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBhbmd1bGFyLnJlc3VtZUJvb3RzdHJhcChbYXBwWyduYW1lJ11dKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9