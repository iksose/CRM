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
function checkTest(age) {
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
angular.module('uiRouterSample').service('TaskService', function(LoginService, taskFactory) {
  var Task = function Task(obj) {
    Object.assign(this, obj);
    this.DueDate = moment(obj.CompletionDateTime).format("ll");
  };
  ($traceurRuntime.createClass)(Task, {}, {});
  var TaskList = function TaskList() {
    for (var args = [],
        $__1 = 0; $__1 < arguments.length; $__1++)
      $traceurRuntime.setProperty(args, $__1, arguments[$traceurRuntime.toProperty($__1)]);
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
          $__2 = 0; $__2 < arguments.length; $__2++)
        $traceurRuntime.setProperty(args, $__2, arguments[$traceurRuntime.toProperty($__2)]);
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
        $__3 = 0; $__3 < arguments.length; $__3++)
      $traceurRuntime.setProperty(args, $__3, arguments[$traceurRuntime.toProperty($__3)]);
    $traceurRuntime.superCall(this, $UserList.prototype, "constructor", $traceurRuntime.spread(args));
  };
  var $UserList = UserList;
  ($traceurRuntime.createClass)(UserList, {
    push: function() {
      for (var args = [],
          $__4 = 0; $__4 < arguments.length; $__4++)
        $traceurRuntime.setProperty(args, $__4, arguments[$traceurRuntime.toProperty($__4)]);
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
      return match;
    }}, {});
  TaskService.prototype.FindUser.parameters = [[$traceurRuntime.type.number]];
  var taskService = new TaskService();
  taskFactory.getUsers().then(function(users) {
    var $__5;
    ($__5 = taskService.Departments).push.apply($__5, $traceurRuntime.spread(_.chain(users.data.UserList).pluck('Department').uniq().value()));
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
  var $__0 = $traceurRuntime.assertObject(hubFactory),
      methods = $__0[0],
      init = $__0[1];
  init.then(function() {
    console.log("Double done");
    methods.WhoAmI().then(function() {
      console.log("told server who we are");
      methods.GetTasks().then(function(tasks) {
        var $__1;
        console.log("Got tasks", tasks);
        ($__1 = $scope.tasks).push.apply($__1, $traceurRuntime.spread(tasks));
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
        var $__1;
        console.log("Got", tasks);
        ($__1 = $scope.tasks).push.apply($__1, $traceurRuntime.spread(tasks));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2FwcC5qcyIsImpzL2VzNi5qcyIsImpzL2Fib3V0L2NvbnRyb2xsZXIuanMiLCJqcy9hYm91dC9kaXJlY3RpdmUuanMiLCJqcy9hYm91dC9mYWN0b3J5LmpzIiwianMvYWN0aXZpdHkvYWN0aXZpdHlDbGFzcy5qcyIsImpzL2FjdGl2aXR5L2FjdGl2aXR5Q29udHJvbGxlci5qcyIsImpzL2FjdGl2aXR5L2ZhY3RvcnkuanMiLCJqcy9hZG1pbi9hZG1pbkNvbnRyb2xsZXIuanMiLCJqcy9jbGFzc2VzL1BlbmRpbmdDYW1wYWlnbi5qcyIsImpzL2NsYXNzZXMvYWN0aXZpdGllcy5qcyIsImpzL2NsYXNzZXMvY2FtcGFpZ24uanMiLCJqcy9jbGFzc2VzL2N1c3RvbWVyLmpzIiwianMvY2FtcGFpZ24vY2FtcGFpZ25Db250cm9sbGVyLmpzIiwianMvY2FtcGFpZ24vY2FtcGFpZ25EZXRhaWxzQ29udHJvbGxlci5qcyIsImpzL2NhbXBhaWduL2NhbXBhaWduRmFjdG9yeS5qcyIsImpzL2NhbXBhaWduL25ld0NhbXBhaWduQ29udHJvbGxlci5qcyIsImpzL2tpbS9raW1Db250cm9sbGVyLmpzIiwianMvbGFuZGluZy9sYW5kaW5nQ29udHJvbGxlci5qcyIsImpzL2xhbmRpbmcvbGFuZGluZ0ZhY3RvcnkuanMiLCJqcy9sb2dpbi9Mb2dpblNlcnZpY2UuanMiLCJqcy9sb2dpbi9sb2dpbkNvbnRyb2xsZXIuanMiLCJqcy9sb2dpbi9sb2dpbkZhY3RvcnkuanMiLCJqcy9taXNjL2FsZXJ0Q29udHJvbGxlci5qcyIsImpzL21pc2MvY29sbGFwc2UuanMiLCJqcy9taXNjL2ZpbHRlci5qcyIsImpzL21pc2MvbmF2YmFyX3NlYXJjaC5qcyIsImpzL21pc2MvcGFnaW5hdGUuanMiLCJqcy9taXNjL3NpZ25hbHIuanMiLCJqcy9wcm9zcGVjdC9wcm9zcGVjdENsYXNzLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RDb250cm9sbGVyLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RGYWN0b3J5LmpzIiwianMvcXVlcnkvcXVlcnlDb250cm9sbGVyLmpzIiwianMvcXVlcnkvcXVlcnlGYWN0b3J5LmpzIiwianMvcm9sZXMvcm9sZUZhY3RvcnkuanMiLCJqcy9yb2xlcy9yb2xlc0NvbnRyb2xsZXIuanMiLCJqcy9zYW1wbGVzb2NrZXQvb25lLmpzIiwianMvc2VhcmNoL3NlYXJjaENvbnRyb2xsZXIuanMiLCJqcy9zZWFyY2gvc2VhcmNoRmFjdG9yeS5qcyIsImpzL3Rhc2tzL1Rhc2tDbGFzcy5qcyIsImpzL3Rhc2tzL1Rhc2tTZXJ2aWNlLmpzIiwianMvdGFza3MvZGlyZWN0aXZlcy5qcyIsImpzL3Rhc2tzL2h1YkZhY3RvcnkuanMiLCJqcy90YXNrcy90YXNrQ29udHJvbGxlci5qcyIsImpzL3Rhc2tzL3Rhc2tGYWN0b3J5LmpzIiwianMveC94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgLy8gJ25nTW9ja0UyRScsXG4gICAgJ25nUmVzb3VyY2UnLFxuICAgICduZ0Nvb2tpZXMnLFxuICAgICdtZ2NyZWEubmdTdHJhcCcsXG4gICAgJ25nU2FuaXRpemUnLFxuICAgICdjaGllZmZhbmN5cGFudHMubG9hZGluZ0JhcicsXG4gICAgJ2FuZ3VsYXItdGFibGUnLFxuICAgICduZ1RhZ3NJbnB1dCcsXG4gICAgJ3hlZGl0YWJsZScsXG4gICAgJ3VpLmNhbGVuZGFyJyxcbiAgICAnYW5ndWxhckZpbGVVcGxvYWQnLFxuICAgICdTaWduYWxSJyxcbiAgICAndGltZXInXG5dKVxuXG4ucnVuKFxuICAgIFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJyRjb29raWVzJywgXCIkaHR0cFwiLCAnTG9naW5TZXJ2aWNlJyxcbiAgICAgICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVzLCAkaHR0cCwgTG9naW5TZXJ2aWNlKSB7XG5cblxuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXSA9ICRjb29raWVzLnhrZXk7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnB1dCA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnBvc3QgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMudGltZW91dCA9IDEwO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcyA9ICRzdGF0ZVBhcmFtcztcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgICAgICBncm91cDogXCJVbmRlZmluZWRcIixcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogJGNvb2tpZXMudXNlcmlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gaWYgKCRjb29raWVzLnBiYXVzZXIpIHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcInVzZXJcIiwgJGNvb2tpZXMucGJhdXNlcilcbiAgICAgICAgICAgIC8vICAgICBMb2dpblNlcnZpY2Uuc2V0VXNlcigkY29va2llcy5wYmF1c2VyKVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG4gICAgXVxuKVxuXG5cbi5jb25maWcoXG4gICAgWyckc3RhdGVQcm92aWRlcicsICckcHJvdmlkZScsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsXG4gICAgICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkcHJvdmlkZSwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyAgICBBdXRoIEludGVyY2VwdG9yICAgICAvL1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgJHByb3ZpZGUuZmFjdG9yeSgnbXlIdHRwSW50ZXJjZXB0b3InLCBmdW5jdGlvbigkcSwgJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgb24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nIG9uIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGludGVyY2VwdFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCgnJHN0YXRlJykudHJhbnNpdGlvblRvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5qZWN0b3IuZ2V0KCdhbGVydEZhY3RvcnknKS5hbGVydHMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRwcm92aWRlLmZhY3RvcnkoJ3RpbWVvdXRIdHRwSW50ZXJjZXB0JywgZnVuY3Rpb24oJHEsICRyb290U2NvcGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAncmVxdWVzdCc6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLnRpbWVvdXQgPSAzMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnbXlIdHRwSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIC8vICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ3RpbWVvdXRIdHRwSW50ZXJjZXB0Jyk7XG5cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFJlZGlyZWN0cyBhbmQgT3RoZXJ3aXNlIC8vXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvLyBVc2UgJHVybFJvdXRlclByb3ZpZGVyIHRvIGNvbmZpZ3VyZSBhbnkgcmVkaXJlY3RzICh3aGVuKSBhbmQgaW52YWxpZCB1cmxzIChvdGhlcndpc2UpLlxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG5cbiAgICAgICAgICAgIC8vIFRoZSBgd2hlbmAgbWV0aG9kIHNheXMgaWYgdGhlIHVybCBpcyBldmVyIHRoZSAxc3QgcGFyYW0sIHRoZW4gcmVkaXJlY3QgdG8gdGhlIDJuZCBwYXJhbVxuICAgICAgICAgICAgLy8gSGVyZSB3ZSBhcmUganVzdCBzZXR0aW5nIHVwIHNvbWUgY29udmVuaWVuY2UgdXJscy5cbiAgICAgICAgICAgIC53aGVuKCcvYz9pZCcsICcvY29udGFjdHMvOmlkJylcbiAgICAgICAgICAgICAgICAud2hlbignL3VzZXIvOmlkJywgJy9jb250YWN0cy86aWQnKVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgdXJsIGlzIGV2ZXIgaW52YWxpZCwgZS5nLiAnL2FzZGYnLCB0aGVuIHJlZGlyZWN0IHRvICcvJyBha2EgdGhlIGhvbWUgc3RhdGVcbiAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gU3RhdGUgQ29uZmlndXJhdGlvbnMgLy9cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vIFVzZSAkc3RhdGVQcm92aWRlciB0byBjb25maWd1cmUgeW91ciBzdGF0ZXMuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxuXG4gICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9Mb2dpbi5odG1sJ1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gSG9tZSAvL1xuICAgICAgICAgICAgLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAuc3RhdGUoXCJob21lXCIsIHtcblxuICAgICAgICAgICAgICAgIC8vIFVzZSBhIHVybCBvZiBcIi9cIiB0byBzZXQgYSBzdGF0ZXMgYXMgdGhlIFwiaW5kZXhcIi5cbiAgICAgICAgICAgICAgICB1cmw6IFwiL1wiLFxuXG4gICAgICAgICAgICAgICAgLy8gY29udHJvbGxlcjogJ2xhbmRpbmdDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAvLyB0ZW1wbGF0ZVVybDogJ3ZpZXdzL25vdHN1cmUuaHRtbCdcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHRoaXMgb25lIGlzIHRhcmdldGluZyB0aGUgdW5uYW1lZCB2aWV3IHdpdGhpbiB0aGUgcGFyZW50IHN0YXRlJ3MgdGVtcGxhdGUuXG4gICAgICAgICAgICAgICAgICAgICcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL25vdHN1cmUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbGFuZGluZ0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBvbmUgaXMgdGFyZ2V0aW5nIHRoZSB1aS12aWV3PVwiaGludFwiIHdpdGhpbiB0aGUgdW5uYW1lZCByb290LCBha2EgaW5kZXguaHRtbC5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG93cyBvZmYgaG93IHlvdSBjb3VsZCBwb3B1bGF0ZSAqYW55KiB2aWV3IHdpdGhpbiAqYW55KiBhbmNlc3RvciBzdGF0ZS5cbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAaG9tZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbGFuZGluZy5odG1sJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAndGFza2JhckBob21lJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90YXNrYmFyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Rhc2tDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gQWJvdXQgLy9cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5hYm91dCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdhYm91dCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Fib3V0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJhYm91dENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gU2hvd2luZyBvZmYgaG93IHlvdSBjb3VsZCByZXR1cm4gYSBwcm9taXNlIGZyb20gdGVtcGxhdGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC8vIHRlbXBsYXRlUHJvdmlkZXI6IFsnJHRpbWVvdXQnLFxuICAgICAgICAgICAgICAgIC8vICAgZnVuY3Rpb24gKCAgICAgICAgJHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICByZXR1cm4gJzxwIGNsYXNzPVwibGVhZFwiPlVJLVJvdXRlciBSZXNvdXJjZXM8L3A+PHVsPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlci90cmVlL21hc3Rlci9zYW1wbGVcIj5Tb3VyY2UgZm9yIHRoaXMgU2FtcGxlPC9hPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgJzxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXCI+R2l0aHViIE1haW4gUGFnZTwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlciNxdWljay1zdGFydFwiPlF1aWNrIFN0YXJ0PC9hPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgJzxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyL3dpa2lcIj5Jbi1EZXB0aCBHdWlkZTwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlci93aWtpL1F1aWNrLVJlZmVyZW5jZVwiPkFQSSBSZWZlcmVuY2U8L2E+PC9saT4nICtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgJzwvdWw+JztcbiAgICAgICAgICAgICAgICAvLyAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAvLyAgIH1dXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUucXVlcnknLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAncXVlcnkvbmV3Lz9TdGF0ZSZBZ2UmUHJvZHVjdCZEaXN0YW5jZScsXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9SZXNlYXJjaC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicXVlcnlDb250cm9sbGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyAuc3RhdGUoJ2hvbWUucXVlcnkucmVzdWx0cycsIHtcbiAgICAgICAgICAgIC8vICAgdXJsOiAnL3Jlc3VsdHMvP215UGFyYW0xJm15UGFyYW0yJ1xuICAgICAgICAgICAgLy8gfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLmNhbXBhaWduJywge1xuICAgICAgICAgICAgICAgIHVybDogJ0NhbXBhaWducycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NhbXBhaWducy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiY2FtcGFpZ25Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5jYW1wYWlnbi5uZXcnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL25ldy86Y2FtcGFpZ25JRCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAaG9tZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2FtcGFpZ24tY29udmVydC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibmV3Q2FtcGFpZ25Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5jYW1wYWlnbi5kZXRhaWxzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWxzLzpjYW1wYWlnbklEJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNhbXBhaWduRmFjdG9yeTogJ2NhbXBhaWduRmFjdG9yeScsXG4gICAgICAgICAgICAgICAgICAgIGNhbXBhaWduOiBmdW5jdGlvbihjYW1wYWlnbkZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbXBhaWduRmFjdG9yeS5zaW5nbGVDYW1wYWlnbigkc3RhdGVQYXJhbXMuY2FtcGFpZ25JRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50QGhvbWUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NhbXBhaWduLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImNhbXBhaWduQ29udHJvbGxlckRldGFpbHNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLnRhc2tzJywge1xuICAgICAgICAgICAgICAgIHVybDogJ1Rhc2tzLzp0YXNrSUQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90YXNrcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidGFza0NvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vICd0YXNrcyc6e1xuICAgICAgICAgICAgICAgICAgICAvLyAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGFza3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgY29udHJvbGxlcjogXCJ0YXNrQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuYWRtaW4nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnYWRtaW4vJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvYWRtaW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImFkbWluQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUudGltZWxpbmUnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAndGltZWxpbmUvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGltZWxpbmUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInRpbWVsaW5lQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUucm9sZXMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAncm9sZXMvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvcm9sZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInJvbGVzQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUucHJvc3BlY3QnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnUHJvc3BlY3QvOlByb3NwZWN0SUQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9Qcm9zcGVjdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicHJvc3BlY3RDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5raW0nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnS2ltLzpQcm9zcGVjdElEJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvS2ltLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJraW1Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuc2VhcmNoJywge1xuICAgICAgICAgICAgICAgIHVybDogJ3NlYXJjaD9Qcm9zcGVjdElEJkN1c3RJRCZOQ1BEUCZOUEkmWmlwJkNpdHkmU3RhdGUmUHJvc3BlY3RUeXBlJkN1c3RvbWVyVHlwZScsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL1Byb3NwZWN0LXF1ZXJ5Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIC5zdGF0ZSgnaG9tZS5zZWFyY2gucmVzdWx0cycsIHtcbiAgICAgICAgICAgIC8vICAgdXJsOiAnL3ByaW9yaXR5JyxcbiAgICAgICAgICAgIC8vICAgdmlld3M6IHtcbiAgICAgICAgICAgIC8vICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgIC8vICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoLmh0bWwnLFxuICAgICAgICAgICAgLy8gICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgICAgIC8vICAgfSxcbiAgICAgICAgICAgIC8vICAgJ3NlYXJjaFZpZXcnOiB7XG4gICAgICAgICAgICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaC5odG1sJyxcbiAgICAgICAgICAgIC8vICAgICAgIGNvbnRyb2xsZXI6IFwic2VhcmNoQ29udHJvbGxlclwiXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy8gfSlcblxuXG4gICAgICAgIH1cbiAgICBdXG4pO1xuIiwiZnVuY3Rpb24gY2hlY2tUZXN0KGFnZTogbnVtYmVyKSB7XG4gICAgY29uc29sZS5sb2coXCJQYXNzZWQ/IFwiLCBhZ2UpXG59XG5jaGVja1Rlc3QoMjApXG5cbi8vIHZhciBjdXN0b21lcnMgPSBbXTtcbi8vIHZhciBjdXN0b21lciA9IHt9XG4vLyBjdXN0b21lci5jaXR5ID0gXCJTZWF0dGxlXCJcblxuXG4vLyBmb3IgKHZhciBrZXkgaW4gY3VzdG9tZXIpIHtcbi8vICAgICBjb25zb2xlLmxvZyhrZXkpXG4vLyB9XG5cbi8vIHZhciBjdXN0b21lcjIgPSB7fVxuLy8gY3VzdG9tZXIyLmNpdHkgPSBcIkthbnNhcyBDaXR5XCJcbi8vIGN1c3RvbWVycy5wdXNoKGN1c3RvbWVyKTtcbi8vIGN1c3RvbWVycy5wdXNoKGN1c3RvbWVyKTtcbi8vIGN1c3RvbWVycy5wdXNoKGN1c3RvbWVyMik7XG5cbi8vIHZhciByZXN1bHRzID0gW1xuLy8gICAgIGZvciAoYyBvZiBjdXN0b21lcnMpXG4vLyAgICAgICAgIGlmIChjLmNpdHkgPT0gXCJTZWF0dGxlXCIpIHtcbi8vICAgICAgICAgICAgIG5hbWU6IGMubmFtZSxcbi8vICAgICAgICAgICAgIGFnZTogYy5hZ2Vcbi8vICAgICAgICAgfVxuLy8gXVxuXG5cblxuLy8gdmFyIGV2ZW5zID0gWzIsIDQsIDZdO1xuXG4vLyB2YXIgb2RkcyA9IGV2ZW5zLm1hcCh2ID0+IHYgKyAxKS5maWx0ZXIodiA9PiB2ID4gMClcblxuLy8gY29uc29sZS5sb2coXCJvZGRzXCIsIG9kZHMpXG5cbi8vIHZhciBoZWxsbyA9IHtcbi8vICAgICBoZWxsbzogJ3dvcmxkJyxcbi8vICAgICBmb286ICdiYXInXG4vLyB9O1xuLy8gdmFyIHFheiA9IHtcbi8vICAgICBoZWxsbzogJ3N0ZXZpZScsXG4vLyAgICAgZm9vOiAnYmF6J1xuLy8gfVxuXG4vLyB2YXIgbXlBcnJheSA9IFtdO1xuLy8gbXlBcnJheS5wdXNoKGhlbGxvLCBoZWxsbywgcWF6KTtcblxuLy8gdmFyIHBvcyA9IG15QXJyYXkubWFwKHYgPT4gdi5oZWxsbykuaW5kZXhPZignc3RldmllJyk7XG5cbi8vIGNvbnNvbGUubG9nKFwicG9zaXRpb25cIiwgcG9zKVxuXG4vLyBteUFycmF5LnNwbGljZShteUFycmF5Lm1hcCh2ID0+IHYuaGVsbG8pLmluZGV4T2YoJ3N0ZXZpZScpLCAxKTtcbi8vIGNvbnNvbGUubG9nKFwibXlBcnJheVwiLCBteUFycmF5KVxuXG5cbi8vIHZhciB0ZXN0QXJyYXkgPSBbMSwgMiwgMywgNF1cblxuLy8gY29uc29sZS5sb2coXCJ1aGhoXCIpXG5cbi8vIC8vIGZ1bmN0aW9uIGFzc3J0KGFycjpBcnJheSl7XG4vLyAvLyAgICAgY29uc29sZS5sb2coXCJBcnJheVwiLCBhcnIpXG4vLyAvLyB9XG5cbi8vIC8vIGFzc3J0KFsxLDIsM10pXG5cbi8vIGZ1bmN0aW9uIHRpbWVvdXQoKSB7XG4vLyAgICAgdmFyIG1zID0gTWF0aC5yYW5kb20oKSAqICg1MDAwIC0gMTAwMCkgKyAxMDAwO1xuLy8gICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbi8vIH1cblxuXG4vLyBhc3luY1xuXG4vLyBmdW5jdGlvbiBhc3luY1ZhbHVlKHZhbHVlKSB7XG4vLyAgICAgYXdhaXQgdGltZW91dCgpO1xuLy8gICAgIHJldHVybiB2YWx1ZSAqIHZhbHVlO1xuLy8gfVxuXG4vLyBhc3luY1ZhbHVlKDIpLnRoZW4oKHJlcykgPT4ge1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKFwicmVzXCIsIHJlcylcbi8vICAgICAvLyB2YXIgZGlja3MgPSByZXNcbi8vICAgICByZXR1cm4gcmVzXG4vLyB9KS50aGVuKGFzeW5jKHgpID0+IHtcbi8vICAgICAvLyBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIG5leHQgcmVzXCIsIHgpIC8vIHggPSA0XG4vLyAgICAgdmFyIHkgPSBhd2FpdCBhc3luY1ZhbHVlKHgpIC8vIElPIG9yIGRiIHRyYW5zYWN0aW9uO1xuLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRvbmUgYWZ0ZXIgcmVzXCIsIHkpIC8vIHkgPSAxNlxuLy8gICAgIHZhciB6ID0gYXdhaXQgYXN5bmNWYWx1ZSh5KSAvLyBJTyBvciBkYiB0cmFuc2FjdGlvbjtcbi8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEb25lIGFmdGVyIHJlcyAyXCIsIHopIC8vIHogPSAyNTZcbi8vICAgICAgICAgLy8gcmV0dXJuIHggKiB4O1xuLy8gfSk7XG5cbi8vIGFzeW5jXG5cbi8vIGZ1bmN0aW9uIGxvb3AodmFsKSB7XG4vLyAgICAgd2hpbGUgKHZhbCA8IDkwMDApIHtcbi8vICAgICAgICAgdmFsID0gYXdhaXQgYXN5bmNWYWx1ZSh2YWwpXG4vLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXRlcmF0aW9uXCIsIHZhbClcbi8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJUZXN0IGFycmF5XCIsIHRlc3RBcnJheTIpXG4vLyAgICAgfVxuLy8gfVxuXG4vLyBsb29wKDIpXG5cbi8vIHZhciB0ZXN0QXJyYXkyID0gW11cbi8vIHRlc3RBcnJheS5mb3JFYWNoKGFzeW5jKHgpID0+IHtcbi8vICAgICB2YXIgZG91YmxlID0gYXdhaXQgYXN5bmNWYWx1ZSh4KVxuLy8gICAgIHRlc3RBcnJheTIucHVzaChkb3VibGUpXG4vLyB9KTtcblxuXG4vLyBjbGFzcyBTdGFjayBleHRlbmRzIEFycmF5IHtcbi8vICAgICBjb25zdHJ1Y3RvcigpIHtcbi8vICAgICAgICAgLy8gc3VwZXIoKVxuLy8gICAgIH1cbi8vICAgICB0b3AoKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV07XG4vLyAgICAgfVxuLy8gICAgIGJvdHRvbSgpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXNbMF1cbi8vICAgICB9XG4vLyAgICAgYXN5bmMgcXVldWUodGFzaykge1xuLy8gICAgICAgICB0aGlzLnB1c2godGFzaylcbi8vICAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoID4gMCkge1xuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGRpbmdcIiwgdGFzaylcbi8vICAgICAgICAgICAgIGF3YWl0IHRoaXMuc29tZXRoaW5nKHRhc2spXG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgLy8gYXdhaXQgdGhpcy5zb21ldGhpbmcodGFzayk7XG4vLyAgICAgfVxuLy8gICAgIGFzeW5jIHdvcmsodGFzaykge1xuLy8gICAgICAgICBhd2FpdCB0aW1lb3V0KCkgLy9ha2EgZ28gdG8gdGhlIERCXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZSB3aXRoIHRhc2tcIiwgdGFzaylcbi8vICAgICAgICAgcmV0dXJuXG4vLyAgICAgfVxuLy8gICAgIGFzeW5jIHNvbWV0aGluZyh0YXNrKSB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU29tZXRoaW5nXCIsIHRhc2spXG4vLyAgICAgICAgIGF3YWl0IHRpbWVvdXQoKVxuLy8gICAgICAgICB0aGlzLnNoaWZ0KCk7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiLCB0YXNrKVxuLy8gICAgICAgICByZXR1cm5cbi8vICAgICB9XG4vLyB9XG5cbi8vIHZhciBzID0gbmV3IFN0YWNrKCk7XG4vLyAvLyBzLnB1c2goXCJ3b3JsZFwiKTtcbi8vIC8vIHMucHVzaChcImhlbGxvXCIpO1xuLy8gLy8gY29uc29sZS5sb2cocy50b3AoKSk7ICAvLyBcImhlbGxvXCJcbi8vIC8vIGNvbnNvbGUubG9nKHMubGVuZ3RoKTsgLy8gMlxuLy8gLy8gY29uc29sZS5sb2cocy5ib3R0b20oKSk7IC8vIHdvcmxkXG5cblxuLy8gdmFyIG1hcCA9IG5ldyBNYXAoKVxuLy8gbWFwLnNldCgnSm9obicsIDI1KVxuLy8gbWFwLnNldCgnQWxpY2UnLCA0MDApXG5cbi8vIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbi8vICAgICBjb25zb2xlLmxvZyhrZXksIHZhbHVlKVxuLy8gfSlcblxuLy8gZm9yICh2YXIgW2tleSwgdmFsdWVdIG9mIG1hcCkge1xuLy8gICAgIGNvbnNvbGUubG9nKFwiZHVkZVwiLCBrZXksIHZhbHVlKVxuLy8gfVxuXG4vLyB2YXIgYXJyID0gWzEsIDIsIDMsIDRdXG4vLyAgICAgLy8gaWYgKCFhcnIuY29udGFpbnMoNSkpe1xuLy8gICAgIC8vICAgICBhcnIucHVzaChvYmopO1xuLy8gICAgIC8vIH1cbi8vICAgICAvLyBjb25zb2xlLmxvZyhcIkFyclwiLCBhcnIpXG5cbi8vIHZhciBibyA9IF8uY29udGFpbnMoWzEsIDIsIDNdLCA1KTtcbi8vIGNvbnNvbGUubG9nKGJvKVxuLy8gLy8gY29uc29sZS5sb2coIF8uY29udGFpbnMoWzEsIDIsIDNdLCAxKTsgKVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcignYWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkaHR0cCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFib3V0IGNvbnRyb2xsZXJcIilcbiAgICAgICAgJHNjb3BlLmRhdGFzZXQgPSBbNSwgMTAsIDE1LCAyMCwgMjVdO1xuXG4gICAgICAgICRzY29wZS5pbmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhc2V0WzRdKys7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YXNldClcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLmRhdGFzZXQyID0gWzUsIDEwLCAxNSwgMjAsIDI1XTtcbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdiYXJzQ2hhcnQnLCBmdW5jdGlvbigkcGFyc2UpIHtcbiAgICAgICAgLy9leHBsaWNpdGx5IGNyZWF0aW5nIGEgZGlyZWN0aXZlIGRlZmluaXRpb24gdmFyaWFibGVcbiAgICAgICAgLy90aGlzIG1heSBsb29rIHZlcmJvc2UgYnV0IGlzIGdvb2QgZm9yIGNsYXJpZmljYXRpb24gcHVycG9zZXNcbiAgICAgICAgLy9pbiByZWFsIGxpZmUgeW91J2Qgd2FudCB0byBzaW1wbHkgcmV0dXJuIHRoZSBvYmplY3Qgey4uLn1cbiAgICAgICAgdmFyIGRpcmVjdGl2ZURlZmluaXRpb25PYmplY3QgPSB7XG4gICAgICAgICAgICAvL1dlIHJlc3RyaWN0IGl0cyB1c2UgdG8gYW4gZWxlbWVudFxuICAgICAgICAgICAgLy9hcyB1c3VhbGx5ICA8YmFycy1jaGFydD4gaXMgc2VtYW50aWNhbGx5XG4gICAgICAgICAgICAvL21vcmUgdW5kZXJzdGFuZGFibGVcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAvL3RoaXMgaXMgaW1wb3J0YW50LFxuICAgICAgICAgICAgLy93ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSBvdXIgZGlyZWN0aXZlIGRlY2xhcmF0aW9uXG4gICAgICAgICAgICAvL2luIHRoZSBIVE1MIG1hcmstdXBcbiAgICAgICAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgICAgICAgLy9vdXIgZGF0YSBzb3VyY2Ugd291bGQgYmUgYW4gYXJyYXlcbiAgICAgICAgICAgIC8vcGFzc2VkIHRocnUgY2hhcnQtZGF0YSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgZGF0YTogJz1jaGFydERhdGEnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgLy9pbiBEMywgYW55IHNlbGVjdGlvblswXSBjb250YWlucyB0aGUgZ3JvdXBcbiAgICAgICAgICAgICAgICAvL3NlbGVjdGlvblswXVswXSBpcyB0aGUgRE9NIG5vZGVcbiAgICAgICAgICAgICAgICAvL2J1dCB3ZSB3b24ndCBuZWVkIHRoYXQgdGhpcyB0aW1lXG4gICAgICAgICAgICAgICAgdmFyIGNoYXJ0ID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pO1xuICAgICAgICAgICAgICAgIC8vdG8gb3VyIG9yaWdpbmFsIGRpcmVjdGl2ZSBtYXJrdXAgYmFycy1jaGFydFxuICAgICAgICAgICAgICAgIC8vd2UgYWRkIGEgZGl2IHdpdGggb3V0IGNoYXJ0IHN0bGluZyBhbmQgYmluZCBlYWNoXG4gICAgICAgICAgICAgICAgLy9kYXRhIGVudHJ5IHRvIHRoZSBjaGFydFxuICAgICAgICAgICAgICAgIGNoYXJ0LmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgXCJjaGFydFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2VsZWN0QWxsKCdkaXYnKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YShzY29wZS5kYXRhKS5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpLmVhc2UoXCJlbGFzdGljXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIndpZHRoXCIsIChkID0+IGQgKyBcIiVcIikpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KChkID0+IGQgKyBcIiVcIikpXG4gICAgICAgICAgICAgICAgLy9hIGxpdHRsZSBvZiBtYWdpYzogc2V0dGluZyBpdCdzIHdpZHRoIGJhc2VkXG4gICAgICAgICAgICAgICAgLy9vbiB0aGUgZGF0YSB2YWx1ZSAoZCkgXG4gICAgICAgICAgICAgICAgLy9hbmQgdGV4dCBhbGwgd2l0aCBhIHNtb290aCB0cmFuc2l0aW9uXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdkYXRhJywgZnVuY3Rpb24obmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCA9PT0gb2xkVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNoYW5nZWQgMVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJ0LnNlbGVjdEFsbChcImRpdlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKHNjb3BlLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwid2lkdGhcIiwgKGQgPT4gZCArIFwiJVwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dCgoZCA9PiBkICsgXCIlXCIpKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2VkIDNcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRydWUpXG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB0cmFuc2l0aW9uR3JvdXAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LnNlbGVjdEFsbCgpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVEZWZpbml0aW9uT2JqZWN0O1xuICAgIH0pXG4gICAgLmRpcmVjdGl2ZSgnZG9udXRDaGFydCcsIGZ1bmN0aW9uKCRwYXJzZSkge1xuICAgICAgICAvL2V4cGxpY2l0bHkgY3JlYXRpbmcgYSBkaXJlY3RpdmUgZGVmaW5pdGlvbiB2YXJpYWJsZVxuICAgICAgICAvL3RoaXMgbWF5IGxvb2sgdmVyYm9zZSBidXQgaXMgZ29vZCBmb3IgY2xhcmlmaWNhdGlvbiBwdXJwb3Nlc1xuICAgICAgICAvL2luIHJlYWwgbGlmZSB5b3UnZCB3YW50IHRvIHNpbXBseSByZXR1cm4gdGhlIG9iamVjdCB7Li4ufVxuICAgICAgICB2YXIgZGlyZWN0aXZlRGVmaW5pdGlvbk9iamVjdCA9IHtcbiAgICAgICAgICAgIC8vV2UgcmVzdHJpY3QgaXRzIHVzZSB0byBhbiBlbGVtZW50XG4gICAgICAgICAgICAvL2FzIHVzdWFsbHkgIDxiYXJzLWNoYXJ0PiBpcyBzZW1hbnRpY2FsbHlcbiAgICAgICAgICAgIC8vbW9yZSB1bmRlcnN0YW5kYWJsZVxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIC8vdGhpcyBpcyBpbXBvcnRhbnQsXG4gICAgICAgICAgICAvL3dlIGRvbid0IHdhbnQgdG8gb3ZlcndyaXRlIG91ciBkaXJlY3RpdmUgZGVjbGFyYXRpb25cbiAgICAgICAgICAgIC8vaW4gdGhlIEhUTUwgbWFyay11cFxuICAgICAgICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICAgICAgICAvL291ciBkYXRhIHNvdXJjZSB3b3VsZCBiZSBhbiBhcnJheVxuICAgICAgICAgICAgLy9wYXNzZWQgdGhydSBjaGFydC1kYXRhIGF0dHJpYnV0ZVxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnPWNoYXJ0RGF0YSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAvL2luIEQzLCBhbnkgc2VsZWN0aW9uWzBdIGNvbnRhaW5zIHRoZSBncm91cFxuICAgICAgICAgICAgICAgIC8vc2VsZWN0aW9uWzBdWzBdIGlzIHRoZSBET00gbm9kZVxuICAgICAgICAgICAgICAgIC8vYnV0IHdlIHdvbid0IG5lZWQgdGhhdCB0aGlzIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB2YXIgY2hhcnQgPSBkMy5zZWxlY3QoZWxlbWVudFswXSk7XG4gICAgICAgICAgICAgICAgLy8gdmFyIGRhdGFzZXQgPSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGFwcGxlczogWzUzMjQ1LCAyODQ3OSwgMTk2OTcsIDI0MDM3LCA0MDI0NV0sXG4gICAgICAgICAgICAgICAgLy8gfTtcblxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IDk2MCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gNTAwLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXMgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KSAvIDI7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSBkMy5zY2FsZS5vcmRpbmFsKClcbiAgICAgICAgICAgICAgICAgICAgLnJhbmdlKFtcIiM5OGFiYzVcIiwgXCIjOGE4OWE2XCIsIFwiIzdiNjg4OFwiLCBcIiM2YjQ4NmJcIiwgXCIjYTA1ZDU2XCIsIFwiI2QwNzQzY1wiLCBcIiNmZjhjMDBcIl0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFyYyA9IGQzLnN2Zy5hcmMoKVxuICAgICAgICAgICAgICAgICAgICAub3V0ZXJSYWRpdXMocmFkaXVzIC0gMTApXG4gICAgICAgICAgICAgICAgICAgIC5pbm5lclJhZGl1cyhyYWRpdXMgLSA3MCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGllID0gZDMubGF5b3V0LnBpZSgpXG4gICAgICAgICAgICAgICAgICAgIC5zb3J0KG51bGwpXG4gICAgICAgICAgICAgICAgICAgIC52YWx1ZShmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5wb3B1bGF0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoZWxlbWVudFswXSkuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB3aWR0aCAvIDIgKyBcIixcIiArIGhlaWdodCAvIDIgKyBcIilcIik7XG5cbiAgICAgICAgICAgICAgICAvLyBkMy5jc3YoXCJkYXRhLmNzdlwiLCBmdW5jdGlvbihlcnJvciwgZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgLy8gc2NvcGUuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgZC5wb3B1bGF0aW9uID0gK2QucG9wdWxhdGlvbjtcbiAgICAgICAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBnID0gc3ZnLnNlbGVjdEFsbChcIi5hcmNcIilcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEocGllKHNjb3BlLmRhdGEpKVxuICAgICAgICAgICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJhcmNcIik7XG5cbiAgICAgICAgICAgICAgICBnLmFwcGVuZChcInBhdGhcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGFyYyk7XG5cbiAgICAgICAgICAgICAgICAvLyBnLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgICAgICAvLyAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgYXJjLmNlbnRyb2lkKGQpICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgLy8gICAgIH0pXG4gICAgICAgICAgICAgICAgLy8gICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxuICAgICAgICAgICAgICAgIC8vICAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgICAgICAgIC8vICAgICAudGV4dChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm4gZC5kYXRhLmFnZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlRGVmaW5pdGlvbk9iamVjdDtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmZhY3RvcnkoJ25vdHVzZWQnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCBIdWIsICRxLCBUYXNrU2VydmljZSkge1xuXG4gICAgICAgIC8vZGVjbGFyaW5nIHRoZSBodWIgY29ubmVjdGlvblxuICAgICAgICB2YXIgaHViID0gbmV3IEh1YignYWN0aXZpdHlRdWV1ZUh1YicsIHtcbiAgICAgICAgICAgIC8vIHZhciBodWIgPSBuZXcgSHViKCdtb3ZlU2hhcGVIdWInLCB7XG5cbiAgICAgICAgICAgIC8vY2xpZW50IHNpZGUgbWV0aG9kc1xuICAgICAgICAgICAgbGlzdGVuZXJzOiB7XG4gICAgICAgICAgICAgICAgJ3Rhc2tXb3JraW5nJzogZnVuY3Rpb24oaW5mbykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImEgdGFzayBzdGF0dXMgd2FzIGNoYW5nZWQuLi4uXCIsIGluZm8pO1xuICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5UYXNrTGlzdC51cGRhdGUoaW5mby5BY3Rpdml0eUlELCBpbmZvLlN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAndXNlckpvaW5lZCc6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGpvaW5lZFwiLCB1c2VyKVxuICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5Vc2VyTGlzdC5wdXNoKHVzZXIpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ3VzZXJMZWZ0JzogZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgbGVmdFwiLCB1c2VyKVxuICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5Vc2VyTGlzdC5yZW1vdmUodXNlci5Vc2VySUQpO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIHJvb3RQYXRoOiBcImh0dHA6Ly8xMC4xLjEuMjI2L3NpZ25hbHJcIixcbiAgICAgICAgICAgIHJvb3RQYXRoOiBcImh0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvc2lnbmFsclwiLFxuXG4gICAgICAgICAgICAvL3NlcnZlciBzaWRlIG1ldGhvZHNcbiAgICAgICAgICAgIG1ldGhvZHM6IFsnR2V0VGFza3MnLCAnY2hhbmdlVGFza1N0YXR1c0QnLCAnV2hvQW1JJywgJ0NoYW5nZVRhc2tTdGF0dXMnLCAnVGltZVVudGlsTmV4dEZpbGwnXSxcblxuICAgICAgICAgICAgLy9xdWVyeSBwYXJhbXMgc2VudCBvbiBpbml0aWFsIGNvbm5lY3Rpb25cbiAgICAgICAgICAgIC8vIHF1ZXJ5UGFyYW1zOntcbiAgICAgICAgICAgIC8vICAgICAndG9rZW4nOiAnZXhhbXBsZXRva2VuJ1xuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgdmFyIFRpbWVVbnRpbE5leHRGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IHRpbWUgdW50aWwgbmV4dCBmaWxsXCIpXG4gICAgICAgICAgICBodWIuVGltZVVudGlsTmV4dEZpbGwoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc1wiLCBkYXRhKVxuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKGRhdGEpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgaHViLmluaXQoKS50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgaWYgKHJlcy5fc3Vic2NyaWJlZFRvSHVicykge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAvL21vdmVTaGFwZUh1Yi5pbnZva2UoJ3VwZGF0ZU1vZGVsJywgc2hhcGVNb2RlbClcblxuICAgICAgICB2YXIgZ2V0Q3VycmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldCBjdXJyZW50XCIpXG4gICAgICAgICAgICBodWIuaGVsbG9fSW1fQ29ubmVjdGVkKHNoYXBlTW9kZWwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldCBXaG9BbUlcIilcbiAgICAgICAgICAgIGh1Yi5XaG9BbUkoXCJwYmFqb2pcIikudGhlbihmdW5jdGlvbih1c2Vycykge1xuICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlVzZXJMaXN0LnB1c2goLi4udXNlcnMpO1xuICAgICAgICAgICAgICAgIHVzZXJzLmZvckVhY2goZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gVGFza1NlcnZpY2UuR3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5Hcm91cHNba2V5XS5mb3JFYWNoKGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWR4ID0gVGFza1NlcnZpY2UuR3JvdXBzW2tleV0ubWFwKHVzZXIgPT4gdXNlci5Vc2VySUQpLmluZGV4T2YodXNlci5Vc2VySUQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5Hcm91cHNba2V5XVtpZHhdLm9ubGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIENoYW5nZVRhc2tTdGF0dXMgPSBmdW5jdGlvbihhY3Rpdml0eUlELCBzdGF0dXMpIHtcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgaHViLkNoYW5nZVRhc2tTdGF0dXMoYWN0aXZpdHlJRCwgc3RhdHVzKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvbmUgY2hhbmdpbmcgc3RhdHVzXCIpXG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIEdldFRhc2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdldHRpbmcgdGFza3NcIilcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgaHViLkdldFRhc2tzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICBtYXA6IGdldEN1cnJlbnQsXG4gICAgICAgICAgICAgICAgV2hvQW1JOiBnZXRVc2VyLFxuICAgICAgICAgICAgICAgIEdldFRhc2tzOiBHZXRUYXNrcyxcbiAgICAgICAgICAgICAgICBDaGFuZ2VUYXNrU3RhdHVzOiBDaGFuZ2VUYXNrU3RhdHVzLFxuICAgICAgICAgICAgICAgIFRpbWVVbnRpbE5leHRGaWxsOiBUaW1lVW50aWxOZXh0RmlsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlZmVycmVkLnByb21pc2VcbiAgICAgICAgXVxuXG5cbiAgICB9KTtcbiIsIi8vIGZvciBhZGRpbmcgYW4gYWN0aXZpdHkgdG8gYSBjYW1wYWlnblxuY2xhc3MgTmV3QWN0aXZpdHkge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuU3RhcnREYXRlVGltZSA9IG1vbWVudChvYmouU3RhcnREYXRlVGltZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuICAgICAgICB0aGlzLkNvbXBsZXRpb25EYXRlVGltZSA9IG1vbWVudChvYmouQ29tcGxldGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG4gICAgfVxufVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdhY3Rpdml0eUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRodHRwLCBhY3Rpdml0eUZhY3RvcnksICR1cGxvYWQpIHtcbiAgICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gYWN0aXZpdHkgY29udHJvbGxlclwiKVxuXG4gICAgJHNjb3BlLnVzZXJMaXN0ID0gW107XG4gICAgdmFyIGdldFVzZXJzID0gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2VycycpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IHVzZXJzXCIsIGRhdGEuZGF0YS5Vc2VyTGlzdClcbiAgICAgICAgJHNjb3BlLnVzZXJMaXN0ID0gZGF0YS5kYXRhLlVzZXJMaXN0XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgIH0pXG5cbiAgICAkc2NvcGUubW9kZWwgPSBhY3Rpdml0eUZhY3RvcnlbMF07XG5cbiAgICAkc2NvcGUuc2V0RmlsZSA9IGZ1bmN0aW9uKCRmaWxlcyl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc2VkXCIsICRmaWxlcylcbiAgICAgICAgYWN0aXZpdHlGYWN0b3J5WzJdLmZpbGUgPSAkZmlsZXNbMF07XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTW9kZWxcIiwgYWN0aXZpdHlGYWN0b3J5WzJdIClcbiAgICB9XG5cblxufSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnYWN0aXZpdHlGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsICR1cGxvYWQsICRhbGVydCwgJHEpIHtcbiAgICB2YXIgYWN0aXZpdHlGYWN0b3J5ID0ge307XG4gICAgdmFyIG15VXBsb2FkID0ge307XG4gICAgdmFyIGFjdGl2aXR5TWV0aG9kcyA9IHtcbiAgICAgICAgc2VsZjogdGhpcyxcbiAgICAgICAgX2NhbXBhaWduSUQ6IFwiXCIsXG4gICAgICAgIF9hY3Rpdml0eTogXCJcIixcbiAgICAgICAgc2F2ZUFjdGl2aXR5X2FuZF90aGVuX2RvX0F0dGFjaG1lbnRzOiBmdW5jdGlvbihjYW1wYWlnbklELCBhY3Rpdml0eSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmUgYWN0aXZpdHkgYW5kIHRoZW4gZG8gYXR0YWNobWVudHNcIiwgY2FtcGFpZ25JRCwgYWN0aXZpdHkpO1xuICAgICAgICAgICAgLy8gc28gd2UgY2FuIHVzZSB0aGVtIGZvciB0aGUgbmV4dCBmdW5jdGlvblxuICAgICAgICAgICAgc2VsZi5fY2FtcGFpZ25JRCA9IGNhbXBhaWduSURcbiAgICAgICAgICAgIHNlbGYuYWN0aXZpdHkgPSBhY3Rpdml0eVxuICAgICAgICAgICAgLy8gJHFcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCAgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgLy8gZGVmZXJyZWQgb25seSByZXNvbHZlcyBpZiB0aGV5IGJvdGggcmVzb2x2ZSFcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduLycrY2FtcGFpZ25JRCsnL0FjdGl2aXR5JywgJC5wYXJhbShhY3Rpdml0eSkgKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VDQ0VTUyFcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdyB0byB1cGxvYWQuLi5cIiwgbXlVcGxvYWQpXG4gICAgICAgICAgICAgICAgaWYoT2JqZWN0LmtleXMobXlVcGxvYWQpLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV2ZXJtaW5kLi4uLm15VXBsb2FkIGlzIGVtcHR5XCIpXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpdml0eUlEID0gZGF0YS5BY3Rpdml0eUlEO1xuICAgICAgICAgICAgICAgICAgICAkdXBsb2FkLmh0dHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24vJytjYW1wYWlnbklEKycvQWN0aXZpdHkvJythY3Rpdml0eUlEKycvQXR0YWNobWVudC8nICsgIG15VXBsb2FkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IG15VXBsb2FkLnR5cGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbXlVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgfSkucHJvZ3Jlc3MoZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncGVyY2VudDogJyArIHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xuICAgICAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3NcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmblNob3dBbGVydChlcnIuY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBmblNob3dBbGVydChlcnIuY29uZmlnKVxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZuU2hvd0FsZXJ0KCB7bWV0aG9kLCB1cmx9ICl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyXCIsIG1ldGhvZCwgdXJsKVxuICAgICAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IFwiRXJyb3JcIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IG1ldGhvZCArXCIgXCIrIHVybCxcbiAgICAgICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFthY3Rpdml0eUZhY3RvcnksIGFjdGl2aXR5TWV0aG9kcywgbXlVcGxvYWRdXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCkge1xuICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gdGhlIEFkbWluIENvbnRyb2xsZXJcIilcbiAgaWYoISRyb290U2NvcGUuY3JlZGVudGlhbHMuYWRtaW4pe1xuICAgICRzdGF0ZS5nbyhcImhvbWVcIilcbiAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IFwiRm9yYmlkZGVuIC0gXCIsXG4gICAgICAgIGNvbnRlbnQ6IFwiV2UncmUgY2FsbGluZyB0aGUgY29wc1wiLFxuICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICAgIGR1cmF0aW9uOiAzXG4gICAgICAgIC8vIGNvbnRhaW5lcjogXCJib2R5XCJcbiAgICAgIH0pO1xuICB9XG5cbn0pXG4iLCJjbGFzcyBQZW5kaW5nQ2FtcGFpZ24ge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuUGFyYW1TdHJVbnBhY2tlZCA9ICcnO1xuICAgICAgICB2YXIgcGFyYW1PYmogPSAkLmRlcGFyYW0ob2JqLlBhcmFtU3RyKVxuICAgICAgICBPYmplY3Qua2V5cyggcGFyYW1PYmogKS5mb3JFYWNoKChrZXkgKT0+e1xuICAgICAgICAgICAgdGhpcy5QYXJhbVN0clVucGFja2VkICs9IGtleSArIFwiID0gXCIgKyBwYXJhbU9ialtrZXldICsgXCI7IFwiO1xuICAgICAgICB9KVxuICAgIH1cbn1cbiIsImNsYXNzIEFjdGl2aXR5MiB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICB9XG59XG4iLCJjbGFzcyBDYW1wYWlnbiB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgdGhpcy5BY3Rpdml0aWVzID0gW1xuICAgICAgICAgICAgZm9yICh4IG9mIG9iai5BY3Rpdml0aWVzKSBuZXcgTmV3QWN0aXZpdHkoeClcbiAgICAgICAgXVxuICAgICAgICB0aGlzLlByb3NwZWN0Q291bnQgPSBvYmouUHJvc3BlY3RzLmxlbmd0aFxuICAgICAgICB0aGlzLkFjdGl2aXR5Q291bnQgPSBvYmouQWN0aXZpdGllcy5sZW5ndGhcbiAgICB9XG4gICAgLy8gcmV0dXJucyB7RGVzY3IsIFN0YXJ0RGF0ZVRpbWUsIENvbXBsZXRpb25EYXRlVGltZX0gZnJvbSB0aGlzLkFjdGl2aXRlc1xuICAgIGdldCBldmVudHMoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBmb3IgKHtcbiAgICAgICAgICAgICAgICAgICAgRGVzY3IsIFN0YXJ0RGF0ZVRpbWUsIENvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvZiB0aGlzLkFjdGl2aXRpZXMpIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogRGVzY3IsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IFN0YXJ0RGF0ZVRpbWUsXG4gICAgICAgICAgICAgICAgZW5kOiBDb21wbGV0aW9uRGF0ZVRpbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbn1cbiIsImNsYXNzIEN1c3RvbWVyIHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAvLyB0aGlzLl9BbHBoYSA9IHtBdmFpbGFibGVDcmVkaXQgOiBvYmouQXZhaWxhYmxlQ3JlZGl0fVxuICAgICAgICB0aGlzLk9yZGVyaW5nTWV0aG9kcyA9IFsgZm9yKHggb2YgT2JqZWN0LmtleXMoe0NyeFNldHVwOiBvYmouQ3J4U2V0dXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU09TU2V0dXA6IG9iai5DU09TU2V0dXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFV09NU2V0dXA6IG9iai5FV09NU2V0dXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQQkFPU2V0dXA6IG9iai5QQkFPU2V0dXB9KSApaWYgKG9ialt4XSA9PSAwKSB4XS50b1N0cmluZygpO1xuICAgIH1cbn1cbiIsIi8vIERpc3BsYXlzIHdob2xlIGxpc3Qgb2Ygc2F2ZWQgY2FtcGFpZ25zXG5hbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdjYW1wYWlnbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY2FtcGFpZ25GYWN0b3J5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2VsY29tZSBmcm9tIGNhbXBhaWduIGNvbnRyb2xsZXJcIilcbiAgICAgICAgJHNjb3BlLmF2YWlsYWJsZUNhbXBhaWducyA9IFtdXG4gICAgICAgIHZhciBmZXRjaEFsbCA9IGNhbXBhaWduRmFjdG9yeS5nZXRDYW1wYWlnbnMoKTtcbiAgICAgICAgdmFyIGRpc3BsYXlSZXN1bHRzID0gZmV0Y2hBbGwudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdC4uLlwiLCBkYXRhLmRhdGEpXG4gICAgICAgICAgICAkc2NvcGUuYXZhaWxhYmxlQ2FtcGFpZ25zID0gZGF0YS5kYXRhXG4gICAgICAgIH0pXG5cbiAgICB9KVxuIiwiLy8gLyMvQ2FtcGFpZ25zL2RldGFpbHMve2NhbXBhaWduSUR9XG5hbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdjYW1wYWlnbkNvbnRyb2xsZXJEZXRhaWxzJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGNhbXBhaWduRmFjdG9yeSwgJGFsZXJ0LCBxdWVyeUZhY3RvcnksICRtb2RhbCwgYWN0aXZpdHlGYWN0b3J5LCBjYW1wYWlnbikge1xuICAgICAgICAvLyBjYW1wYWlnbiBpcyBwYXNzZWQgaW4gZnJvbSB0aGUgcm91dGVyIHJlc29sdmVcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJnb3QgY2FtcGFpZ25cIiwgY2FtcGFpZ24pO1xuICAgICAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzID0gbmV3IENhbXBhaWduKGNhbXBhaWduLmRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNsYXNzXCIsICRzY29wZS5jYW1wYWlnbkRldGFpbHMpXG4gICAgICAgICRzY29wZS5ldmVudHMgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLmV2ZW50c1xuXG4gICAgICAgIC8vICRzY29wZS5ldmVudHMgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkFjdGl2aXRpZXMubWFwKEV2ZW50ID0+IEV2ZW50KTtcbiAgICAgICAgJHNjb3BlLmV2ZW50U291cmNlcyA9IFtdO1xuXG4gICAgICAgICRzY29wZS5QcmludCA9ICgoKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPIC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2FtcGFpZ25EZXRhaWxzKTtcbiAgICAgICAgfSlcblxuICAgICAgICB2YXIgZWRpdENhbXBhaWduID0gJG1vZGFsKHtcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2VkaXRDYW1wYWlnbi5tb2RhbC5odG1sJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBvcGVuIG1vZGFsIGZvciBlZGl0aW5nIGNhbXBhaWduIGRldGFpbHNcbiAgICAgICAgLy8gbW9kYWwgcGFzc2VzICd0cnVlJ1xuICAgICAgICAkc2NvcGUuZWRpdENhbXBhaWduID0gZnVuY3Rpb24oZWRpdCA9IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoZWRpdCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNJRCA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQ2FtcGFpZ25JRFxuICAgICAgICAgICAgICAgIGNhbXBhaWduRmFjdG9yeS5lZGl0Q2FtcGFpZ25zKGNJRCwgJHNjb3BlLmNhbXBhaWduRGV0YWlscykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzcz9cIiwgZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgZWRpdENhbXBhaWduLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkR1ZGUuLi4uXCIsIGVycilcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVsc2VcbiAgICAgICAgICAgIGVkaXRDYW1wYWlnbi5zaG93KCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tb2RhbFNhdmVBY3Rpdml0eSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIFthY3Rpdml0eU1vZGVsLCBhY3Rpdml0eU1ldGhvZHNdID0gYWN0aXZpdHlGYWN0b3J5XG4gICAgICAgICAgICAvLyBjbGFzcyBOZXdBY3Rpdml0eSBwYXJzZXMgdGhlIGRhdGVzXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHlNb2RlbCA9IG5ldyBOZXdBY3Rpdml0eShhY3Rpdml0eU1vZGVsKTtcbiAgICAgICAgICAgIHZhciBjSUQgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkNhbXBhaWduSURcbiAgICAgICAgICAgIGFjdGl2aXR5TWV0aG9kcy5zYXZlQWN0aXZpdHlfYW5kX3RoZW5fZG9fQXR0YWNobWVudHMoY0lELCBhY3Rpdml0eU1vZGVsKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3M/XCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgYWRkRXZlbnRzKGFjdGl2aXR5TW9kZWwpO1xuICAgICAgICAgICAgICAgIGFjdGl2aXR5TW9kYWwuaGlkZSgpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIkR1ZGUuLi4uXCIsIGVycilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy93aGVuIHlvdSBjbGljayBhIGNhbGVuZGFyIG9iamVjdCwgcG9wdWxhdGUgZGVldHNcbiAgICAgICAgJHNjb3BlLmRlZXRzO1xuXG4gICAgICAgICRzY29wZS5wcm9zcGVjdHNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuYWN0aXZpdGllc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUub25DbGlja1RhYiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9IGNvbnRhY3RcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaXNBY3RpdmVUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSB7XG4gICAgICAgICAgICBpdGVtc1BlclBhZ2U6IDEwLFxuICAgICAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZSxcbiAgICAgICAgICAgIG1heFBhZ2VzOiA1XG4gICAgICAgIH1cblxuICAgICAgICAvL2NhbXBhaWduIGlzIGF0IHBlbmRpbmcgQCBUZW1wbGF0ZSBAIEJlZ2lubmluZywgbm90IHBlbmRpbmdcbiAgICAgICAgLy9JcyB0aGlzIGFsd2F5cyB0cnVlIHRob3VnaD8gV2hhdCBpZiBpdCdzIGF0IFBlbmRpbmcgdG8gYmVnaW5cbiAgICAgICAgJHNjb3BlLmNhbXBhaWduUGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5EZWxldGVQcm9zcGVjdCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICAvLyBkb2Vzbid0IGhhdmUgYSBxdWVyeSBJRCB0byBzZW5kIGRlbGV0ZXMgdG9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGltcGxlbWVudGVkXCIpXG4gICAgICAgICAgICAvLyAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMuUHJvc3BlY3RzLmZvckVhY2goKGEsYikgPT4ge1xuICAgICAgICAgICAgLy8gICAgIGlmKGEuUHJvc3BlY3RJRCA9PSBpZCl7XG4gICAgICAgICAgICAvLyAgICAgICBhLlN0YXR1cyA/IGEuU3RhdHVzID0gMCA6IGEuU3RhdHVzID0gMTtcbiAgICAgICAgICAgIC8vICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5U3RhdHVzKCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQsIGlkLCBhLlN0YXR1cyk7XG4gICAgICAgICAgICAvLyAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIENBTEVOREFSIEZVTkNUSU9OU1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBkID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIHZhciBtID0gZGF0ZS5nZXRNb250aCgpO1xuICAgICAgICB2YXIgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICBmdW5jdGlvbiBhZGRFdmVudHMoe1xuICAgICAgICAgICAgRGVzY3IsIFN0YXJ0RGF0ZVRpbWUsIENvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICB9KSB7XG4gICAgICAgICAgICAkc2NvcGUuZXZlbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBEZXNjcixcbiAgICAgICAgICAgICAgICBzdGFydDogU3RhcnREYXRlVGltZSxcbiAgICAgICAgICAgICAgICBlbmQ6IENvbXBsZXRpb25EYXRlVGltZSxcbiAgICAgICAgICAgICAgICBhbGxEYXk6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvKiBhbGVydCBvbiBldmVudENsaWNrICovXG4gICAgICAgICRzY29wZS5hbGVydE9uRXZlbnRDbGljayA9IGZ1bmN0aW9uKGV2ZW50LCBhbGxEYXksIGpzRXZlbnQsIHZpZXcpIHtcbiAgICAgICAgICAgIHZhciBtYXRjaCA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQWN0aXZpdGllcy5maW5kKHggPT4geC5EZXNjciA9PSBldmVudC50aXRsZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hdGNoKVxuICAgICAgICAgICAgJHNjb3BlLmRlZXRzID0gbWF0Y2g7XG4gICAgICAgIH07XG4gICAgICAgIC8qIGFsZXJ0IG9uIERyb3AgKi9cbiAgICAgICAgLy8gJHNjb3BlLmFsZXJ0T25Ecm9wID0gZnVuY3Rpb24oZXZlbnQsIGRheURlbHRhLCBtaW51dGVEZWx0YSwgYWxsRGF5LCByZXZlcnRGdW5jLCBqc0V2ZW50LCB1aSwgdmlldykge1xuICAgICAgICAvLyAgICAgJHNjb3BlLmFsZXJ0TWVzc2FnZSA9ICgnRXZlbnQgRHJvcGVkIHRvIG1ha2UgZGF5RGVsdGEgJyArIGRheURlbHRhKTtcbiAgICAgICAgLy8gfTtcblxuICAgICAgICAvLyAkc2NvcGUub25EYXlDbGljayA9IGZ1bmN0aW9uKGRhdGUsIGpzRXZlbnQpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiV2hvYVwiLCBqc0V2ZW50KVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIC8qIGFsZXJ0IG9uIFJlc2l6ZSAqL1xuICAgICAgICAvLyAkc2NvcGUuYWxlcnRPblJlc2l6ZSA9IGZ1bmN0aW9uKGV2ZW50LCBkYXlEZWx0YSwgbWludXRlRGVsdGEsIHJldmVydEZ1bmMsIGpzRXZlbnQsIHVpLCB2aWV3KSB7XG4gICAgICAgIC8vICAgICAkc2NvcGUuYWxlcnRNZXNzYWdlID0gKCdFdmVudCBSZXNpemVkIHRvIG1ha2UgZGF5RGVsdGEgJyArIG1pbnV0ZURlbHRhKTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogYWRkIGFuZCByZW1vdmVzIGFuIGV2ZW50IHNvdXJjZSBvZiBjaG9pY2UgKi9cbiAgICAgICAgLy8gJHNjb3BlLmFkZFJlbW92ZUV2ZW50U291cmNlID0gZnVuY3Rpb24oc291cmNlcywgc291cmNlKSB7XG4gICAgICAgIC8vICAgICB2YXIgY2FuQWRkID0gMDtcbiAgICAgICAgLy8gICAgIGFuZ3VsYXIuZm9yRWFjaChzb3VyY2VzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIC8vICAgICAgICAgaWYgKHNvdXJjZXNba2V5XSA9PT0gc291cmNlKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHNvdXJjZXMuc3BsaWNlKGtleSwgMSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIGNhbkFkZCA9IDE7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vICAgICBpZiAoY2FuQWRkID09PSAwKSB7XG4gICAgICAgIC8vICAgICAgICAgc291cmNlcy5wdXNoKHNvdXJjZSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIC8qIGFkZCBjdXN0b20gZXZlbnQqL1xuICAgICAgICAvLyAkc2NvcGUuYWRkRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgICRzY29wZS5ldmVudHMucHVzaCh7XG4gICAgICAgIC8vICAgICAgICAgdGl0bGU6ICdPcGVuIFNlc2FtZScsXG4gICAgICAgIC8vICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDI4KSxcbiAgICAgICAgLy8gICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIDI5KSxcbiAgICAgICAgLy8gICAgICAgICBjbGFzc05hbWU6IFsnb3BlblNlc2FtZSddXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogcmVtb3ZlIGV2ZW50ICovXG4gICAgICAgIC8vICRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAvLyAgICAgJHNjb3BlLmV2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyAvKiBDaGFuZ2UgVmlldyAqL1xuICAgICAgICAvLyAkc2NvcGUuY2hhbmdlVmlldyA9IGZ1bmN0aW9uKHZpZXcsIGNhbGVuZGFyKSB7XG4gICAgICAgIC8vICAgICBjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ2NoYW5nZVZpZXcnLCB2aWV3KTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogQ2hhbmdlIFZpZXcgKi9cbiAgICAgICAgLy8gJHNjb3BlLnJlbmRlckNhbGVuZGVyID0gZnVuY3Rpb24oY2FsZW5kYXIpIHtcbiAgICAgICAgLy8gICAgIGNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVuZGVyJyk7XG4gICAgICAgIC8vIH07XG5cbiAgICAgICAgdmFyIGRheUNsaWNrZWQ7XG4gICAgICAgICRzY29wZS5kYXlDbGljayA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcbiAgICAgICAgICAgIGRheUNsaWNrZWQgPSBtb21lbnQoYSkuZm9ybWF0KFwiTExcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3Rpdml0eU1vZGFsID0gJG1vZGFsKHtcbiAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2FkZF9hY3Rpdml0eS5tb2RhbC5odG1sJyxcbiAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICAkc2NvcGUuZGF5RGJsQ2xpY2sgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG4gICAgICAgICAgICB2YXIgW2FjdGl2aXR5TW9kZWwsIGFjdGl2aXR5TWV0aG9kc10gPSBhY3Rpdml0eUZhY3RvcnlcbiAgICAgICAgICAgIGFjdGl2aXR5TW9kZWwuU3RhcnREYXRlVGltZSA9IGRheUNsaWNrZWRcbiAgICAgICAgICAgIGFjdGl2aXR5TW9kYWwuc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogY29uZmlnIG9iamVjdCAqL1xuICAgICAgICAkc2NvcGUudWlDb25maWcgPSB7XG4gICAgICAgICAgICBjYWxlbmRhcjoge1xuICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAndGl0bGUnLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICByaWdodDogJ3RvZGF5IHByZXYsbmV4dCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV2ZW50Q2xpY2s6ICRzY29wZS5hbGVydE9uRXZlbnRDbGljayxcbiAgICAgICAgICAgICAgICBldmVudERibENsaWNrOiAkc2NvcGUub25EYXlDbGljayxcbiAgICAgICAgICAgICAgICBkYXlDbGljazogJHNjb3BlLmRheUNsaWNrLFxuICAgICAgICAgICAgICAgIGRheURibENsaWNrOiAkc2NvcGUuZGF5RGJsQ2xpY2ssXG4gICAgICAgICAgICAgICAgLy8gZXZlbnREcm9wOiAkc2NvcGUuYWxlcnRPbkRyb3AsXG4gICAgICAgICAgICAgICAgLy8gZXZlbnRSZXNpemU6ICRzY29wZS5hbGVydE9uUmVzaXplLFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIGV2ZW50IHNvdXJjZXMgYXJyYXkqL1xuICAgICAgICAkc2NvcGUuZXZlbnRTb3VyY2VzID0gWyRzY29wZS5ldmVudHNdO1xuXG4gICAgICAgICRzY29wZS5uZXh0U3RhdHVzID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHZhciBjSUQgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkNhbXBhaWduSURcbiAgICAgICAgICAgIGNhbXBhaWduRmFjdG9yeS5lZGl0U3RhdHVzKGNJRCwgMylcbiAgICAgICAgfVxuXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmZhY3RvcnkoJ2NhbXBhaWduRmFjdG9yeScsXG4gICAgICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHF1ZXJ5UmVzdWx0czogZnVuY3Rpb24odXJsLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NhbXBhaWducycpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzaW5nbGVDYW1wYWlnbjogZnVuY3Rpb24ocGFyYW1JRCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdldCBjYW1wYWlnbi4uLi4jXCIsIHBhcmFtSUQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL2NhbXBhaWduLycgKyBwYXJhbUlEKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGhpc1NhdmVkUXVlcnk6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy93aWxsIGhhdmUgdG8gcGFzcyB3aGljaCBzYXZlZCBxdWVyeSBpbiB0aGUgZnV0dXJlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2FwaS90aGlzUXVlcnknKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0UXVlcmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoL2xpc3QnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2luZ2xlUXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5SUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvJyArIHF1ZXJ5SUQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udmVydDogZnVuY3Rpb24ocXVlcnlJRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24nLCAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFF1ZXJ5SUQ6IHF1ZXJ5SURcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2F2ZUFjdGl2aXR5OiBmdW5jdGlvbihjYW1wYWlnbklELCBhY3Rpdml0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24vJyArIGNhbXBhaWduSUQgKyAnL0FjdGl2aXR5JywgJC5wYXJhbShhY3Rpdml0eSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0VXNlcnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2VycycpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRDYW1wYWlnbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9jYW1wYWlnbicpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlZGl0Q2FtcGFpZ25zOiBmdW5jdGlvbihjSUQsIG9yaWdpbmFsRm9ybSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXQgY2FtcGFpZ25zXCIsIG9yaWdpbmFsRm9ybSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm0gPSB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29weWluZyBvYmplY3QgYWZmZWN0cyBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGZvcm0sIG9yaWdpbmFsRm9ybSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZXNlIGFycmF5cyB0aHJvdyBhbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybS5BY3Rpdml0aWVzXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmb3JtLlByb3NwZWN0c1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybS5BdHRhY2htZW50c1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybS5CdXNpbmVzc093bmVyc1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9DYW1wYWlnbi8nICsgY0lELCAkLnBhcmFtKGZvcm0pKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZWRpdFN0YXR1czogZnVuY3Rpb24oY0lELCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY0lELCBzdGF0dXMpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL2NhbXBhaWduLycgKyBjSUQgKyAnL3N0YXR1cycsICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogc3RhdHVzXG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbik7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ25ld0NhbXBhaWduQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQsIGNhbXBhaWduRmFjdG9yeSwgcXVlcnlGYWN0b3J5LCBhY3Rpdml0eUZhY3RvcnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gTkVXIGNhbXBhaWduIGNvbnRyb2xsZXJcIilcblxuICAgICRzY29wZS50YWJsZUNvbmZpZyA9IHtcbiAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZSxcbiAgICAgICAgbWF4UGFnZXM6IDVcbiAgICB9XG5cbiAgICAkc2NvcGUuRGVsZXRlUHJvc3BlY3QgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMucm93cy5mb3JFYWNoKChhLGIpID0+IHtcbiAgICAgICAgICAgIGlmKGEuUHJvc3BlY3RJRCA9PSBpZCl7XG4gICAgICAgICAgICAgICAgYS5TdGF0dXMgPyBhLlN0YXR1cyA9IDAgOiBhLlN0YXR1cyA9IDE7XG4gICAgICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5U3RhdHVzKCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQsIGlkLCBhLlN0YXR1cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAkc2NvcGUuY2FtcGFpZ25JRDtcbiAgICAkc2NvcGUuY2FtcGFpZ25Db252ZXJ0ZWQgPSBmYWxzZTtcbiAgICAkc2NvcGUuY29udmVydCA9ICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDb252ZXJ0aW5nLi4uXCIpO1xuICAgICAgICB2YXIgcXVlcnlJRCAgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLlF1ZXJ5SUQ7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IocXVlcnlJRClcbiAgICAgICAgY2FtcGFpZ25GYWN0b3J5LmNvbnZlcnQocXVlcnlJRCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJET05FLCBjYW1wYWlnbiBJRCBcIiwgZGF0YS5kYXRhLkNhbXBhaWduSUQpXG4gICAgICAgICAgICAkc2NvcGUuY2FtcGFpZ25JRCA9IGRhdGEuZGF0YS5DYW1wYWlnbklEO1xuICAgICAgICAgICAgJHNjb3BlLmNhbXBhaWduQ29udmVydGVkID0gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVzZXJMaXN0ID0gW107XG4gICAgY2FtcGFpZ25GYWN0b3J5LmdldFVzZXJzKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBhbGwgdXNlcnMuLi4uXCIsIGRhdGEpXG4gICAgICAgICRzY29wZS51c2VyTGlzdCA9IGRhdGEuZGF0YS5Vc2VyTGlzdDtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgIH0pXG5cbiAgICAkc2NvcGUuc2F2ZWRRdWVyaWVzID0gW107XG4gICAgJHNjb3BlLnNlbGVjdGVkUXVlcnk7XG4gICAgY2FtcGFpZ25GYWN0b3J5LmdldFF1ZXJpZXMoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290Li4uXCIsIGRhdGEpXG4gICAgICAgICRzY29wZS5zYXZlZFF1ZXJpZXMgPSBkYXRhLmRhdGFcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgIH0pXG5cbiAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzID0ge307XG4gICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscy5yb3dzID0gW107XG4gICAgJHNjb3BlLnNldEJpbGxHcm91cCA9IChkYXRhKSA9PiB7XG4gICAgICAgIC8vIEZJWE1FIHRoaXMgaXMgYmVpbmcgZmlyZWQgb24gcGFnZSBpbml0IGJlY2F1c2UgaXQgdGhpbmtzIHRoZSB2YWx1ZVxuICAgICAgICAvLyBpcyBjaGFuZ2luZztcbiAgICAgICAgY29uc29sZS5sb2coXCJDSEFOR0VEXCIsICRzY29wZS5zZWxlY3RlZFF1ZXJ5KVxuICAgICAgICBjYW1wYWlnbkZhY3Rvcnkuc2luZ2xlUXVlcnkoJHNjb3BlLnNlbGVjdGVkUXVlcnkuUXVlcnlJRCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscyA9IG5ldyBQZW5kaW5nQ2FtcGFpZ24oZGF0YS5kYXRhKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmNhbXBhaWduRGV0YWlscylcbiAgICAgICAgICAgICRzY29wZS5mZXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICB9O1xuICAgIGlmKCRzdGF0ZS5wYXJhbXMuY2FtcGFpZ25JRCAhPVwiXCIpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlllcyB0aGVyZSdzIHBhcmFtc1wiKTtcbiAgICAgICAgLy8gVE9ETyBhbHdheXMgZmlyZXMgc2V0QmlsbEdyb3VwXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFF1ZXJ5ID0ge1Byb2R1Y3RJRDogMSwgUXVlcnlJRDogJHN0YXRlLnBhcmFtcy5jYW1wYWlnbklEIHx8IDEsIE5hbWU6IFwibW8gdGVzdFwifVxuICAgICAgICAkc2NvcGUuc2V0QmlsbEdyb3VwKCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmNoYW5nZVN0YXRlID0gKGJsZWgpID0+IHtcbiAgICAgICAgJHN0YXRlLmdvKCdob21lLmNhbXBhaWduLmRldGFpbHMnLCB7cGFyYW1zOicxMzM3J30pXG4gICAgfTtcblxuICAgICRzY29wZS5uZXdBY3Rpdml0eSA9IHt9O1xuICAgICRzY29wZS5zYXZlZEFjdGl2aXRpZXMgPSBbXTtcbiAgICAkc2NvcGUuYWN0aXZpdHlObyA9IDA7XG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlcjtcbiAgICB2YXIgYWN0aXZpdHlfb3JkZXIgPSAxO1xuICAgICRzY29wZS5zYXZlQWN0aXZpdHkgPSAoKSA9PiB7XG4gICAgICAgIHZhciBbYWN0aXZpdHlNb2RlbCwgYWN0aXZpdHlNZXRob2RzXSA9IGFjdGl2aXR5RmFjdG9yeVxuICAgICAgICAvLyBjbGFzcyBOZXdBY3Rpdml0eSBwYXJzZXMgdGhlIGRhdGVzXG4gICAgICAgIHZhciBhY3Rpdml0eU1vZGVsID0gbmV3IE5ld0FjdGl2aXR5KGFjdGl2aXR5TW9kZWwpO1xuICAgICAgICB2YXIgY0lEID0gJHNjb3BlLmNhbXBhaWduSURcbiAgICAgICAgYWN0aXZpdHlNZXRob2RzLnNhdmVBY3Rpdml0eV9hbmRfdGhlbl9kb19BdHRhY2htZW50cyhjSUQsIGFjdGl2aXR5TW9kZWwpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGRhdGEuT3JkZXIgPSBhY3Rpdml0eV9vcmRlclxuICAgICAgICAgICAgYWN0aXZpdHlfb3JkZXIrK1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzP1wiLCBkYXRhKVxuICAgICAgICAgICAgJHNjb3BlLnNhdmVkQWN0aXZpdGllcy5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgJHNjb3BlLnNhdmVkQWN0aXZpdGllcy5zb3J0KGNvbXBhcmVEYXRlcylcbiAgICAgICAgICAgIC8vaWYgdGhlIGxhc3Qgb25lLCBhZnRlciBzb3J0aW5nLCBpcyBub3QgdGhlIG9uZSB3ZSBqdXN0IGFkZGVkXG4gICAgICAgICAgICBpZigkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzWyRzY29wZS5zYXZlZEFjdGl2aXRpZXMubGVuZ3RoIC0gMV0gIT0gZGF0YSl7XG4gICAgICAgICAgICAgICAgLy8gdGhlbiBnaXZlIHRoZW0gYWxsIG5ldyAnb3JkZXInIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAvLyBhbmQgcmVzZW5kIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIldob2Egd2hvYSwgdGltZSBtaXh1cC4uLlwiKVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLnNhdmVkQWN0aXZpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzW2ldLk9yZGVyID0gaSsxO1xuICAgICAgICAgICAgICAgICAgICAvL3NlbmQgdGhvc2UgdG8gdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUuYWN0aXZpdHlObysrO1xuICAgICAgICAgICAgJHNjb3BlLm5ld0FjdGl2aXR5ID0ge307XG4gICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJEdWRlLi4uLlwiLCBlcnIpXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjb21wYXJlRGF0ZXMoYSwgYikge1xuICAgICAgICByZXR1cm4gbW9tZW50KGEuU3RhcnREYXRlVGltZSkuaXNBZnRlcihiLlN0YXJ0RGF0ZVRpbWUpOyBcbiAgICB9XG5cbn0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdraW1Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCwgcHJvc3BlY3RGYWN0b3J5LCAkbW9kYWwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbyBraW1cIilcbiAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdDtcbiAgICAgICAgJHNjb3BlLkNvbnRhY3RzID0gW107XG4gICAgICAgIHByb3NwZWN0RmFjdG9yeS5nZXRQcm9zcGVjdF9ieV9JRCgkc3RhdGUucGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IHByb3NwZWN0XCIsIGRhdGEpXG4gICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0ID0gbmV3IFByb3NwZWN0KGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUudGhlX1Byb3NwZWN0LmxhdGVzdCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGhlX1Byb3NwZWN0KVxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0ID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0c1swXVxuICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnJldmVyc2UoKVxuICAgICAgICB9KVxuXG4gICAgICAgICRzY29wZS5jb250YWN0c0NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5pc3N1ZXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUubm90ZXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgLy9jb250YWN0cyB0YWJzXG4gICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdFxuICAgICAgICAkc2NvcGUub25DbGlja1RhYiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9IGNvbnRhY3RcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaXNBY3RpdmVUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSAxO1xuXG5cbiAgICAgICAgJHNjb3BlLmFkZENvbnRhY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBteU1vZGFsID0gJG1vZGFsKHtcbiAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYWRkX2NvbnRhY3QudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ2xhbmRpbmdDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIFRhc2tzKSB7XG4gIGNvbnNvbGUubG9nKFwiTGFuZGluZyBDb250cm9sbGVyXCIpXG4gIC8vIFBhc3NlZCBpbiBUYXNrcyBmYWN0b3J5Li4ud2UnbGwgaGFuZGxlIGl0IGFsbCBoZXJlIGZvciBub3dcblxuICBpZighJHJvb3RTY29wZS5sb2dnZWRJbil7XG4gICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIGluLCByZWRpcmVjdFwiKVxuICAgICRzdGF0ZS5nbyhcImxvZ2luXCIpO1xuICB9XG5cbiAgJHNjb3BlLmRyb3Bkb3duID0gW1xuICB7XG4gICAgXCJ0ZXh0XCI6IFwiTmV3IENhbXBhaWduXCIsXG4gICAgXCJjbGlja1wiOiAnJHN0YXRlLmdvKFwiaG9tZS5jYW1wYWlnbi5uZXdcIiknXG4gIH0sXG4gIHtcbiAgICBcInRleHRcIjogXCJTYXZlZCBDYW1wYWlnbnNcIixcbiAgICBcImNsaWNrXCI6ICckc3RhdGUuZ28oXCJob21lLmNhbXBhaWduXCIpJ1xuICB9XG4gIC8vIHtcbiAgLy8gICBcImRpdmlkZXJcIjogdHJ1ZVxuICAvLyB9LFxuICAvLyB7XG4gIC8vICAgXCJ0ZXh0XCI6IFwiTmV3IFF1ZXJ5XCIsXG4gIC8vICAgXCJjbGlja1wiOiAnJHN0YXRlLmdvKFwiaG9tZS5xdWVyeVwiKSdcbiAgLy8gfVxuXG5dO1xuXG5cbiRzY29wZS5pbk1hcmtldGluZyA9IGZhbHNlXG5cblxuaWYoJHJvb3RTY29wZS5jcmVkZW50aWFscy5ncm91cCA9PSBcIk1hcmtldGluZ1wiKXtcbiAgJHNjb3BlLmluTWFya2V0aW5nID0gdHJ1ZTtcblxuICAvLyBkZXRlcm1pbmVkIHRoZWlyIGdyb3VwLCByZW5kZXJlZCB2aWV3LCBub3cgdG8gZmV0Y2ggdGFza3MuXG4gIC8vIGRvIHdlIHdhbnQgdG8gZG8gdGhpcyBpbiB0aGUgbGFuZGluZyBjb250cm9sbGVyP1xuICAvLyBvciBhIFRhc2tzIGNvbnRyb2xsZXI/IFdpdGggYSB0YXNrcyB2aWV3P1xuICB2YXIgdGhpc1VzZXJzR3JvdXAgPSAkcm9vdFNjb3BlLmNyZWRlbnRpYWxzXG5cbiAgJHNjb3BlLmFsbFRhc2tzID0gW11cbiAgdmFyIGZldGNoID0gVGFza3MubXlUYXNrcyh0aGlzVXNlcnNHcm91cCk7XG4gIHZhciBzaG93VGFza3MgPSBmZXRjaC50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvdyB0YXNrcy4uLi5cIiwgZGF0YSlcbiAgICAkc2NvcGUuYWxsVGFza3MgPSBkYXRhLmRhdGFcbiAgfSlcblxufVxuXG5cbndpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICB2YXIgZW50cmllcyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzKCk7XG5cbiAgICAgICAgZW50cmllcyA9IGVudHJpZXMuc29ydCggZnVuY3Rpb24oIGEsIGIgKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5kdXJhdGlvbiAtIGEuZHVyYXRpb247XG4gICAgICAgIH0gKTtcblxuICAgICAgICAkcm9vdFNjb3BlLm1ldHJpY3MgPSBlbnRyaWVzO1xufSwgNTAwKTtcblxuXG5cblxufSkiLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ1Rhc2tzJyxcbiBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBxdWVyeVJlc3VsdHM6ZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FtcGFpZ25zJylcbiAgICAgICAgfSxcbiAgICAgICAgbXlUYXNrczpmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGYWN0b3J5IFRBU0tTIGdldHRpbmcgbXlUYXNrcy4uXCIsIGRhdGEpXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS91c2VydGFza3MnLCBkYXRhKVxuICAgICAgICB9LFxuICAgICAgICB0YXNrRGV0YWlsczpmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGYWN0b3J5IFRBU0tTIGdldHRpbmcgZGV0YWlscy4uXCIsIGRhdGEpXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS90YXNrZGV0YWlscycsIGRhdGEpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbFRhc2tzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFjdG9yeSB0YXNrcyByZXR1cm5pbmcgZXZlcnkgdGFzay4uLlwiKVxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWxsdGFza3MnKVxuICAgICAgICB9LFxuICAgICAgICB0YXNrUHJvc3BlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdGhpcyB3b3VsZCBiZSBhIHBvc3Qgd2l0aCBsaWtlLCB0YXNrSUQgPT0gcHJvc3BlY3QudGFza0lEXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9yYW5kb21Qcm9zcGVjdCcpXG4gICAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLnNlcnZpY2UoJ0xvZ2luU2VydmljZScsIGZ1bmN0aW9uKCRjb29raWVzLCAkaHR0cCwgUHJpdmlsZWdlKSB7XG4gICAgICAgIGNsYXNzIFVzZXIge1xuICAgICAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2V0IHVzZXIoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBMb2dpblNlcnZpY2UgPSB7fVxuICAgICAgICBMb2dpblNlcnZpY2Uuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgIExvZ2luU2VydmljZS51c2VyID0gbmV3IFVzZXIodXNlcik7XG4gICAgICAgICAgICBQcml2aWxlZ2UuU2V0U2Vzc2lvbih1c2VyLmtleSwgdGhpcy51c2VyLnVzZXIsIHRoaXMudXNlcilcbiAgICAgICAgfVxuICAgICAgICBMb2dpblNlcnZpY2UuY29va2llX3VzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkY29va2llcy51c2VyaWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTG9naW5TZXJ2aWNlLnVzZXIgPSBuZXcgVXNlcih7fSk7XG4gICAgICAgIHJldHVybiBMb2dpblNlcnZpY2U7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgUHJpdmlsZWdlLCBMb2dpblNlcnZpY2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDb250cm9sbGVyIGxvYWRlZFwiKVxuICAgICAgICAkc2NvcGUuY3JlZHMgPSB7fTtcbiAgICAgICAgJHNjb3BlLmNyZWRzLnVzZXJpZCA9IExvZ2luU2VydmljZS5jb29raWVfdXNlclxuICAgICAgICAkc2NvcGUubG9naW5TdWJtaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFByaXZpbGVnZS5Mb2dpbigkc2NvcGUuY3JlZHMpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBMb2dpblNlcnZpY2Uuc2V0VXNlcihkYXRhLmRhdGEpXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiaG9tZVwiKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgnUHJpdmlsZWdlJywgZnVuY3Rpb24oJHJlc291cmNlLCAkaHR0cCwgJHEsICRjb29raWVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmFjdG9yeSBsb2FkZWRcIilcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIExvZ2luOiBmdW5jdGlvbihjcmVkcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUE9TVCBEVURFXCIsIGNyZWRzKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWEtleSddO1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9BdXRoJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbShjcmVkcyksXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBMb2dvdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG9kb1wiKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNldFNlc3Npb246IGZ1bmN0aW9uKHhrZXk6IHN0cmluZywgdXNlcmlkOiBzdHJpbmcsIHBiYXVzZXIpIHtcbiAgICAgICAgICAgICAgICAkY29va2llcy54a2V5ID0geGtleTtcbiAgICAgICAgICAgICAgICAkY29va2llcy51c2VyaWQgPSB1c2VyaWQ7XG4gICAgICAgICAgICAgICAgLy8gJGNvb2tpZXMucGJhdXNlciA9IHBiYXVzZXI7XG4gICAgICAgICAgICAgICAgLy8gZm9yICh2YXIga2V5IGluIHBiYXVzZXIpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJ1c2VyXCIsIGtleSlcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXSA9IHhrZXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdhbGVydEZhY3RvcnknLFxuLy8gbm93IFJlc2VhcmNoIEZhY3RvcnlcbiBmdW5jdGlvbiAoJGFsZXJ0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWxlcnRzOiBmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFsZXJ0XCIsIG1lc3NhZ2UpXG4gICAgICAgICAgdmFyIG15QWxlcnQgPSAkYWxlcnQoe3RpdGxlOiBtZXNzYWdlLmNvbmZpZy51cmwsXG4gICAgICAgICAgY29udGVudDogbWVzc2FnZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICAgICAgICBkdXJhdGlvbjogM1xuICAgICAgICAgIC8vIGNvbnRhaW5lcjogXCJib2R5XCJcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgLmRpcmVjdGl2ZSgnY29sbGFwc2UnLCBbJyR0cmFuc2l0aW9uJywgZnVuY3Rpb24gKCR0cmFuc2l0aW9uKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgIHZhciBpbml0aWFsQW5pbVNraXAgPSB0cnVlO1xuICAgICAgICB2YXIgY3VycmVudFRyYW5zaXRpb247XG5cbiAgICAgICAgZnVuY3Rpb24gZG9UcmFuc2l0aW9uKGNoYW5nZSkge1xuICAgICAgICAgIHZhciBuZXdUcmFuc2l0aW9uID0gJHRyYW5zaXRpb24oZWxlbWVudCwgY2hhbmdlKTtcbiAgICAgICAgICBpZiAoY3VycmVudFRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgIGN1cnJlbnRUcmFuc2l0aW9uLmNhbmNlbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50VHJhbnNpdGlvbiA9IG5ld1RyYW5zaXRpb247XG4gICAgICAgICAgbmV3VHJhbnNpdGlvbi50aGVuKG5ld1RyYW5zaXRpb25Eb25lLCBuZXdUcmFuc2l0aW9uRG9uZSk7XG4gICAgICAgICAgcmV0dXJuIG5ld1RyYW5zaXRpb247XG5cbiAgICAgICAgICBmdW5jdGlvbiBuZXdUcmFuc2l0aW9uRG9uZSgpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBpdCdzIHRoaXMgdHJhbnNpdGlvbiwgb3RoZXJ3aXNlLCBsZWF2ZSBpdCBhbG9uZS5cbiAgICAgICAgICAgIGlmIChjdXJyZW50VHJhbnNpdGlvbiA9PT0gbmV3VHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICBjdXJyZW50VHJhbnNpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBleHBhbmQoKSB7XG4gICAgICAgICAgaWYgKGluaXRpYWxBbmltU2tpcCkge1xuICAgICAgICAgICAgaW5pdGlhbEFuaW1Ta2lwID0gZmFsc2U7XG4gICAgICAgICAgICBleHBhbmREb25lKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJykuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKTtcbiAgICAgICAgICAgIGRvVHJhbnNpdGlvbih7IGhlaWdodDogZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgKyAncHgnIH0pLnRoZW4oZXhwYW5kRG9uZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwYW5kRG9uZSgpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJyk7XG4gICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnY29sbGFwc2UgaW4nKTtcbiAgICAgICAgICBlbGVtZW50LmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbGxhcHNlKCkge1xuICAgICAgICAgIGlmIChpbml0aWFsQW5pbVNraXApIHtcbiAgICAgICAgICAgIGluaXRpYWxBbmltU2tpcCA9IGZhbHNlO1xuICAgICAgICAgICAgY29sbGFwc2VEb25lKCk7XG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7aGVpZ2h0OiAwfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIENTUyB0cmFuc2l0aW9ucyBkb24ndCB3b3JrIHdpdGggaGVpZ2h0OiBhdXRvLCBzbyB3ZSBoYXZlIHRvIG1hbnVhbGx5IGNoYW5nZSB0aGUgaGVpZ2h0IHRvIGEgc3BlY2lmaWMgdmFsdWVcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgaGVpZ2h0OiBlbGVtZW50WzBdLnNjcm9sbEhlaWdodCArICdweCcgfSk7XG4gICAgICAgICAgICAvL3RyaWdnZXIgcmVmbG93IHNvIGEgYnJvd3NlciByZWFsaXplcyB0aGF0IGhlaWdodCB3YXMgdXBkYXRlZCBmcm9tIGF1dG8gdG8gYSBzcGVjaWZpYyB2YWx1ZVxuICAgICAgICAgICAgdmFyIHggPSBlbGVtZW50WzBdLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZSBpbicpLmFkZENsYXNzKCdjb2xsYXBzaW5nJyk7XG5cbiAgICAgICAgICAgIGRvVHJhbnNpdGlvbih7IGhlaWdodDogMCB9KS50aGVuKGNvbGxhcHNlRG9uZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29sbGFwc2VEb25lKCkge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKTtcbiAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdjb2xsYXBzZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLmNvbGxhcHNlLCBmdW5jdGlvbiAoc2hvdWxkQ29sbGFwc2UpIHtcbiAgICAgICAgICBpZiAoc2hvdWxkQ29sbGFwc2UpIHtcbiAgICAgICAgICAgIGNvbGxhcHNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cGFuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pXG4gIC5mYWN0b3J5KCckdHJhbnNpdGlvbicsIFsnJHEnLCAnJHRpbWVvdXQnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgJHJvb3RTY29wZSkge1xuXG4gIHZhciAkdHJhbnNpdGlvbiA9IGZ1bmN0aW9uKGVsZW1lbnQsIHRyaWdnZXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIHZhciBlbmRFdmVudE5hbWUgPSAkdHJhbnNpdGlvbltvcHRpb25zLmFuaW1hdGlvbiA/ICdhbmltYXRpb25FbmRFdmVudE5hbWUnIDogJ3RyYW5zaXRpb25FbmRFdmVudE5hbWUnXTtcblxuICAgIHZhciB0cmFuc2l0aW9uRW5kSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbWVudC51bmJpbmQoZW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kSGFuZGxlcik7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoZWxlbWVudCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGVuZEV2ZW50TmFtZSkge1xuICAgICAgZWxlbWVudC5iaW5kKGVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZEhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8vIFdyYXAgaW4gYSB0aW1lb3V0IHRvIGFsbG93IHRoZSBicm93c2VyIHRpbWUgdG8gdXBkYXRlIHRoZSBET00gYmVmb3JlIHRoZSB0cmFuc2l0aW9uIGlzIHRvIG9jY3VyXG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIGFuZ3VsYXIuaXNTdHJpbmcodHJpZ2dlcikgKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3ModHJpZ2dlcik7XG4gICAgICB9IGVsc2UgaWYgKCBhbmd1bGFyLmlzRnVuY3Rpb24odHJpZ2dlcikgKSB7XG4gICAgICAgIHRyaWdnZXIoZWxlbWVudCk7XG4gICAgICB9IGVsc2UgaWYgKCBhbmd1bGFyLmlzT2JqZWN0KHRyaWdnZXIpICkge1xuICAgICAgICBlbGVtZW50LmNzcyh0cmlnZ2VyKTtcbiAgICAgIH1cbiAgICAgIC8vSWYgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRyYW5zaXRpb25zLCBpbnN0YW50bHkgcmVzb2x2ZVxuICAgICAgaWYgKCAhZW5kRXZlbnROYW1lICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIG91ciBjdXN0b20gY2FuY2VsIGZ1bmN0aW9uIHRvIHRoZSBwcm9taXNlIHRoYXQgaXMgcmV0dXJuZWRcbiAgICAvLyBXZSBjYW4gY2FsbCB0aGlzIGlmIHdlIGFyZSBhYm91dCB0byBydW4gYSBuZXcgdHJhbnNpdGlvbiwgd2hpY2ggd2Uga25vdyB3aWxsIHByZXZlbnQgdGhpcyB0cmFuc2l0aW9uIGZyb20gZW5kaW5nLFxuICAgIC8vIGkuZS4gaXQgd2lsbCB0aGVyZWZvcmUgbmV2ZXIgcmFpc2UgYSB0cmFuc2l0aW9uRW5kIGV2ZW50IGZvciB0aGF0IHRyYW5zaXRpb25cbiAgICBkZWZlcnJlZC5wcm9taXNlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCBlbmRFdmVudE5hbWUgKSB7XG4gICAgICAgIGVsZW1lbnQudW5iaW5kKGVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZEhhbmRsZXIpO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQucmVqZWN0KCdUcmFuc2l0aW9uIGNhbmNlbGxlZCcpO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICAvLyBXb3JrIG91dCB0aGUgbmFtZSBvZiB0aGUgdHJhbnNpdGlvbkVuZCBldmVudFxuICB2YXIgdHJhbnNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHJhbnMnKTtcbiAgdmFyIHRyYW5zaXRpb25FbmRFdmVudE5hbWVzID0ge1xuICAgICdXZWJraXRUcmFuc2l0aW9uJzogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICdNb3pUcmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnLFxuICAgICdPVHJhbnNpdGlvbic6ICdvVHJhbnNpdGlvbkVuZCcsXG4gICAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCdcbiAgfTtcbiAgdmFyIGFuaW1hdGlvbkVuZEV2ZW50TmFtZXMgPSB7XG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAnTW96VHJhbnNpdGlvbic6ICdhbmltYXRpb25lbmQnLFxuICAgICdPVHJhbnNpdGlvbic6ICdvQW5pbWF0aW9uRW5kJyxcbiAgICAndHJhbnNpdGlvbic6ICdhbmltYXRpb25lbmQnXG4gIH07XG4gIGZ1bmN0aW9uIGZpbmRFbmRFdmVudE5hbWUoZW5kRXZlbnROYW1lcykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gZW5kRXZlbnROYW1lcyl7XG4gICAgICBpZiAodHJhbnNFbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGVuZEV2ZW50TmFtZXNbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gICR0cmFuc2l0aW9uLnRyYW5zaXRpb25FbmRFdmVudE5hbWUgPSBmaW5kRW5kRXZlbnROYW1lKHRyYW5zaXRpb25FbmRFdmVudE5hbWVzKTtcbiAgJHRyYW5zaXRpb24uYW5pbWF0aW9uRW5kRXZlbnROYW1lID0gZmluZEVuZEV2ZW50TmFtZShhbmltYXRpb25FbmRFdmVudE5hbWVzKTtcbiAgcmV0dXJuICR0cmFuc2l0aW9uO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5maWx0ZXIoJ3NlbGVjdGVkVGFncycsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbih0YXNrcywgdGFncykge1xuICAgICAgICByZXR1cm4gdGFza3MuZmlsdGVyKGZ1bmN0aW9uKHRhc2spIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiB0YXNrLlRhZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFncy5pbmRleE9mKHRhc2tbaV0pICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ25hdmJhclNlYXJjaGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCwgcHJvc3BlY3RGYWN0b3J5KSB7XG4gICAgY29uc29sZS5sb2coXCJIZWxsbyBuYXZiYXJcIilcbiAgICAkc2NvcGUucG9wb3ZlciA9IHtcbiAgICAgIFwidGl0bGVcIjogXCJUaXRsZVwiLFxuICAgICAgXCJjb250ZW50XCI6IFwiSGVsbG8gUG9wb3ZlcjxiciAvPlRoaXMgaXMgYSBtdWx0aWxpbmUgbWVzc2FnZSFcIlxuICAgIH07XG5cbiAgICAkc2NvcGUuZG9vZG8gPSBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRvb1wiKVxuICAgIH1cblxuICAgICRzY29wZS5idXR0b24gPSB7XG4gIFwidG9nZ2xlXCI6IGZhbHNlLFxuICBcImNoZWNrYm94XCI6IHtcbiAgICBcImxlZnRcIjogZmFsc2UsXG4gICAgXCJtaWRkbGVcIjogdHJ1ZSxcbiAgICBcInJpZ2h0XCI6IGZhbHNlXG4gIH0sXG4gIFwicmFkaW9cIjogMlxufTtcblxuXG4kc2NvcGUuY29sb3IgPSAnYmx1ZSc7XG4gICAgICAkc2NvcGUuc3BlY2lhbFZhbHVlID0ge1xuICAgICAgICBcImlkXCI6IFwiMTIzNDVcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiBcImdyZWVuXCJcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5wb3BvdmVyID0ge1xuICBcInRpdGxlXCI6IFwiQ29ja3NcIixcbiAgXCJjb250ZW50XCI6IFwiSGVsbG8gUG9wb3ZlcjxiciAvPlRoaXMgaXMgYSBtdWx0aWxpbmUgbWVzc2FnZSFcIlxufTtcblxufSlcbiIsIi8qKlxuICogZGlyUGFnaW5hdGlvbiAtIEFuZ3VsYXJKUyBtb2R1bGUgZm9yIHBhZ2luYXRpbmcgKGFsbW9zdCkgYW55dGhpbmcuXG4gKlxuICpcbiAqIENyZWRpdHNcbiAqID09PT09PT1cbiAqXG4gKiBEYW5pZWwgVGFidWVuY2E6IGh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZC9tc2cvYW5ndWxhci9hbjlRcHpxSVlpTS9yOHYtM1cxWDV2Y0pcbiAqIGZvciB0aGUgaWRlYSBvbiBob3cgdG8gZHluYW1pY2FsbHkgaW52b2tlIHRoZSBuZy1yZXBlYXQgZGlyZWN0aXZlLlxuICpcbiAqIEkgYm9ycm93ZWQgYSBjb3VwbGUgb2YgbGluZXMgYW5kIGEgZmV3IGF0dHJpYnV0ZSBuYW1lcyBmcm9tIHRoZSBBbmd1bGFyVUkgQm9vdHN0cmFwIHByb2plY3Q6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS9ib290c3RyYXAvYmxvYi9tYXN0ZXIvc3JjL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5qc1xuICpcbiAqIENyZWF0ZWQgYnkgTWljaGFlbCBvbiAwNC8wNS8xNC5cbiAqL1xuXG5hbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5kaXJlY3RpdmUoJ2RpclBhZ2luYXRlJywgWyckY29tcGlsZScsICckcGFyc2UnLCAnJHRpbWVvdXQnLCAncGFnaW5hdGlvblNlcnZpY2UnLCBmdW5jdGlvbigkY29tcGlsZSwgJHBhcnNlLCAkdGltZW91dCwgcGFnaW5hdGlvblNlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuICB7XG4gICAgICAgICAgICBwcmlvcml0eTogNTAwMCwgLy9IaWdoIHByaW9yaXR5IG1lYW5zIGl0IHdpbGwgZXhlY3V0ZSBmaXJzdFxuICAgICAgICAgICAgdGVybWluYWw6IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRycyl7XG4gICAgICAgICAgICAgICAgYXR0cnMuJHNldCgnbmdSZXBlYXQnLCBhdHRycy5kaXJQYWdpbmF0ZSk7IC8vQWRkIG5nLXJlcGVhdCB0byB0aGUgZG9tXG5cbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2lvbiA9IGF0dHJzLmRpclBhZ2luYXRlO1xuICAgICAgICAgICAgICAgIC8vIHJlZ2V4IHRha2VuIGRpcmVjdGx5IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iL21hc3Rlci9zcmMvbmcvZGlyZWN0aXZlL25nUmVwZWF0LmpzI0wyMTFcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBleHByZXNzaW9uLm1hdGNoKC9eXFxzKihbXFxzXFxTXSs/KVxccytpblxccysoW1xcc1xcU10rPykoPzpcXHMrdHJhY2tcXHMrYnlcXHMrKFtcXHNcXFNdKz8pKT9cXHMqJC8pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlclBhdHRlcm4gPSAvXFx8XFxzKml0ZW1zUGVyUGFnZTpbXnxdKi87XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdLm1hdGNoKGZpbHRlclBhdHRlcm4pID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwicGFnaW5hdGlvbiBkaXJlY3RpdmU6IHRoZSAnaXRlbXNQZXJQYWdlJyBmaWx0ZXIgbXVzdCBiZSBzZXQuXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpdGVtc1BlclBhZ2VGaWx0ZXJSZW1vdmVkID0gbWF0Y2hbMl0ucmVwbGFjZShmaWx0ZXJQYXR0ZXJuLCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbGxlY3Rpb25HZXR0ZXIgPSAkcGFyc2UoaXRlbXNQZXJQYWdlRmlsdGVyUmVtb3ZlZCk7XG5cbiAgICAgICAgICAgICAgICAvL05vdyB0aGF0IHdlIGFkZGVkIG5nLXJlcGVhdCB0byB0aGUgZWxlbWVudCwgcHJvY2VlZCB3aXRoIGNvbXBpbGF0aW9uXG4gICAgICAgICAgICAgICAgLy9idXQgc2tpcCBkaXJlY3RpdmVzIHdpdGggcHJpb3JpdHkgNTAwMCBvciBhYm92ZSB0byBhdm9pZCBpbmZpbml0ZVxuICAgICAgICAgICAgICAgIC8vcmVjdXJzaW9uICh3ZSBkb24ndCB3YW50IHRvIGNvbXBpbGUgb3Vyc2VsdmVzIGFnYWluKVxuICAgICAgICAgICAgICAgIHZhciBjb21waWxlZCA9ICAkY29tcGlsZShlbGVtZW50LCBudWxsLCA1MDAwKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFnaW5hdGlvbklkO1xuICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uSWQgPSBhdHRycy5wYWdpbmF0aW9uSWQgfHwgXCJfX2RlZmF1bHRcIjtcbiAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2UucmVnaXN0ZXJJbnN0YW5jZShwYWdpbmF0aW9uSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UGFnZUdldHRlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJzLmN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGFnZUdldHRlciA9ICRwYXJzZShhdHRycy5jdXJyZW50UGFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudC1wYWdlIGF0dHJpYnV0ZSB3YXMgbm90IHNldCwgd2UnbGwgbWFrZSBvdXIgb3duXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5fX2N1cnJlbnRQYWdlID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlR2V0dGVyID0gJHBhcnNlKCdfX2N1cnJlbnRQYWdlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0Q3VycmVudFBhZ2VQYXJzZXIocGFnaW5hdGlvbklkLCBjdXJyZW50UGFnZUdldHRlciwgc2NvcGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cnMudG90YWxJdGVtcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldEFzeW5jTW9kZVRydWUocGFnaW5hdGlvbklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLnRvdGFsSXRlbXMpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25HZXR0ZXIoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkLCBjb2xsZWN0aW9uLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy9XaGVuIGxpbmtpbmcganVzdCBkZWxlZ2F0ZSB0byB0aGUgbGluayBmdW5jdGlvbiByZXR1cm5lZCBieSB0aGUgbmV3IGNvbXBpbGVcbiAgICAgICAgICAgICAgICAgICAgY29tcGlsZWQoc2NvcGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pXG5cbiAgICAuZGlyZWN0aXZlKCdkaXJQYWdpbmF0aW9uQ29udHJvbHMnLCBbJ3BhZ2luYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24ocGFnaW5hdGlvblNlcnZpY2UpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIGFuIGFycmF5IG9mIHBhZ2UgbnVtYmVycyAob3IgdGhlICcuLi4nIHN0cmluZykgd2hpY2ggaXMgdXNlZCBpbiBhbiBuZy1yZXBlYXQgdG8gZ2VuZXJhdGUgdGhlXG4gICAgICAgICAqIGxpbmtzIHVzZWQgaW4gcGFnaW5hdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gY3VycmVudFBhZ2VcbiAgICAgICAgICogQHBhcmFtIHJvd3NQZXJQYWdlXG4gICAgICAgICAqIEBwYXJhbSBwYWdpbmF0aW9uUmFuZ2VcbiAgICAgICAgICogQHBhcmFtIGNvbGxlY3Rpb25MZW5ndGhcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVQYWdlc0FycmF5KGN1cnJlbnRQYWdlLCBjb2xsZWN0aW9uTGVuZ3RoLCByb3dzUGVyUGFnZSwgcGFnaW5hdGlvblJhbmdlKSB7XG4gICAgICAgICAgICB2YXIgcGFnZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciB0b3RhbFBhZ2VzID0gTWF0aC5jZWlsKGNvbGxlY3Rpb25MZW5ndGggLyByb3dzUGVyUGFnZSk7XG4gICAgICAgICAgICB2YXIgaGFsZldheSA9IE1hdGguY2VpbChwYWdpbmF0aW9uUmFuZ2UgLyAyKTtcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbjtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRQYWdlIDw9IGhhbGZXYXkpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICdzdGFydCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRvdGFsUGFnZXMgLSBoYWxmV2F5IDwgY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICdlbmQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICdtaWRkbGUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZWxsaXBzZXNOZWVkZWQgPSBwYWdpbmF0aW9uUmFuZ2UgPCB0b3RhbFBhZ2VzO1xuICAgICAgICAgICAgdmFyIGkgPSAxO1xuICAgICAgICAgICAgd2hpbGUgKGkgPD0gdG90YWxQYWdlcyAmJiBpIDw9IHBhZ2luYXRpb25SYW5nZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYWdlTnVtYmVyID0gY2FsY3VsYXRlUGFnZU51bWJlcihpLCBjdXJyZW50UGFnZSwgcGFnaW5hdGlvblJhbmdlLCB0b3RhbFBhZ2VzKTtcblxuICAgICAgICAgICAgICAgIHZhciBvcGVuaW5nRWxsaXBzZXNOZWVkZWQgPSAoaSA9PT0gMiAmJiAocG9zaXRpb24gPT09ICdtaWRkbGUnIHx8IHBvc2l0aW9uID09PSAnZW5kJykpO1xuICAgICAgICAgICAgICAgIHZhciBjbG9zaW5nRWxsaXBzZXNOZWVkZWQgPSAoaSA9PT0gcGFnaW5hdGlvblJhbmdlIC0gMSAmJiAocG9zaXRpb24gPT09ICdtaWRkbGUnIHx8IHBvc2l0aW9uID09PSAnc3RhcnQnKSk7XG4gICAgICAgICAgICAgICAgaWYgKGVsbGlwc2VzTmVlZGVkICYmIChvcGVuaW5nRWxsaXBzZXNOZWVkZWQgfHwgY2xvc2luZ0VsbGlwc2VzTmVlZGVkKSkge1xuICAgICAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKCcuLi4nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKHBhZ2VOdW1iZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpICsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIHRoZSBwb3NpdGlvbiBpbiB0aGUgc2VxdWVuY2Ugb2YgcGFnaW5hdGlvbiBsaW5rcyBbaV0sIGZpZ3VyZSBvdXQgd2hhdCBwYWdlIG51bWJlciBjb3JyZXNwb25kcyB0byB0aGF0IHBvc2l0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gaVxuICAgICAgICAgKiBAcGFyYW0gY3VycmVudFBhZ2VcbiAgICAgICAgICogQHBhcmFtIHBhZ2luYXRpb25SYW5nZVxuICAgICAgICAgKiBAcGFyYW0gdG90YWxQYWdlc1xuICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVBhZ2VOdW1iZXIoaSwgY3VycmVudFBhZ2UsIHBhZ2luYXRpb25SYW5nZSwgdG90YWxQYWdlcykge1xuICAgICAgICAgICAgdmFyIGhhbGZXYXkgPSBNYXRoLmNlaWwocGFnaW5hdGlvblJhbmdlLzIpO1xuICAgICAgICAgICAgaWYgKGkgPT09IHBhZ2luYXRpb25SYW5nZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbFBhZ2VzO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhZ2luYXRpb25SYW5nZSA8IHRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodG90YWxQYWdlcyAtIGhhbGZXYXkgPCBjdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG90YWxQYWdlcyAtIHBhZ2luYXRpb25SYW5nZSArIGk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYWxmV2F5IDwgY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRQYWdlIC0gaGFsZldheSArIGk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0FFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAgJ3ZpZXdzL2RpclBhZ2luYXRpb24udHBsLmh0bWwnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBtYXhTaXplOiAnPT8nLFxuICAgICAgICAgICAgICAgIG9uUGFnZUNoYW5nZTogJyY/J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBwYWdpbmF0aW9uSWQ7XG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbklkID0gYXR0cnMucGFnaW5hdGlvbklkIHx8IFwiX19kZWZhdWx0XCI7XG4gICAgICAgICAgICAgICAgaWYgKCFzY29wZS5tYXhTaXplKSB7IHNjb3BlLm1heFNpemUgPSA5OyB9XG4gICAgICAgICAgICAgICAgc2NvcGUuZGlyZWN0aW9uTGlua3MgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5kaXJlY3Rpb25MaW5rcykgPyBzY29wZS4kcGFyZW50LiRldmFsKGF0dHJzLmRpcmVjdGlvbkxpbmtzKSA6IHRydWU7XG4gICAgICAgICAgICAgICAgc2NvcGUuYm91bmRhcnlMaW5rcyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmJvdW5kYXJ5TGlua3MpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5ib3VuZGFyeUxpbmtzKSA6IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFwYWdpbmF0aW9uU2VydmljZS5pc1JlZ2lzdGVyZWQocGFnaW5hdGlvbklkKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRNZXNzYWdlID0gKHBhZ2luYXRpb25JZCAhPT0gJ19fZGVmYXVsdCcpID8gXCIgKGlkOiBcIiArIHBhZ2luYXRpb25JZCArIFwiKSBcIiA6IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcInBhZ2luYXRpb24gZGlyZWN0aXZlOiB0aGUgcGFnaW5hdGlvbiBjb250cm9sc1wiICsgaWRNZXNzYWdlICsgXCJjYW5ub3QgYmUgdXNlZCB3aXRob3V0IHRoZSBjb3JyZXNwb25kaW5nIHBhZ2luYXRpb24gZGlyZWN0aXZlLlwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBwYWdpbmF0aW9uUmFuZ2UgPSBNYXRoLm1heChzY29wZS5tYXhTaXplLCA1KTtcbiAgICAgICAgICAgICAgICBzY29wZS5wYWdlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2luYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3Q6IDEsXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDFcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHBhZ2luYXRpb25TZXJ2aWNlLmdldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkKSArIDEpICogcGFnaW5hdGlvblNlcnZpY2UuZ2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24obGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVBhZ2luYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFnaW5hdGlvblNlcnZpY2UuZ2V0Q3VycmVudFBhZ2UocGFnaW5hdGlvbklkKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihjdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdlcyA9IGdlbmVyYXRlUGFnZXNBcnJheShjdXJyZW50UGFnZSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uU2VydmljZS5nZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblJhbmdlKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnNldEN1cnJlbnQgPSBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3QobnVtKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPCBudW0gJiYgbnVtIDw9IHNjb3BlLnBhZ2luYXRpb24ubGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldEN1cnJlbnRQYWdlKHBhZ2luYXRpb25JZCwgbnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdlcyA9IGdlbmVyYXRlUGFnZXNBcnJheShudW0sIHBhZ2luYXRpb25TZXJ2aWNlLmdldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25SYW5nZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnaW5hdGlvbi5jdXJyZW50ID0gbnVtO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgYSBjYWxsYmFjayBoYXMgYmVlbiBzZXQsIHRoZW4gY2FsbCBpdCB3aXRoIHRoZSBwYWdlIG51bWJlciBhcyBhbiBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5vblBhZ2VDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUub25QYWdlQ2hhbmdlKHsgbmV3UGFnZU51bWJlciA6IG51bSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVQYWdpbmF0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdlcyA9IGdlbmVyYXRlUGFnZXNBcnJheSgxLCBwYWdpbmF0aW9uU2VydmljZS5nZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25TZXJ2aWNlLmdldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uUmFuZ2UpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uLmN1cnJlbnQgPSBwYXJzZUludChwYWdpbmF0aW9uU2VydmljZS5nZXRDdXJyZW50UGFnZShwYWdpbmF0aW9uSWQpKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnaW5hdGlvbi5sYXN0ID0gc2NvcGUucGFnZXNbc2NvcGUucGFnZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5wYWdpbmF0aW9uLmxhc3QgPCBzY29wZS5wYWdpbmF0aW9uLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnNldEN1cnJlbnQoc2NvcGUucGFnaW5hdGlvbi5sYXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSlcblxuICAgIC5maWx0ZXIoJ2l0ZW1zUGVyUGFnZScsIFsncGFnaW5hdGlvblNlcnZpY2UnLCBmdW5jdGlvbihwYWdpbmF0aW9uU2VydmljZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlbXNQZXJQYWdlLCBwYWdpbmF0aW9uSWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHBhZ2luYXRpb25JZCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbklkID0gXCJfX2RlZmF1bHRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcGFnaW5hdGlvblNlcnZpY2UuaXNSZWdpc3RlcmVkKHBhZ2luYXRpb25JZCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBcInBhZ2luYXRpb24gZGlyZWN0aXZlOiB0aGUgaXRlbXNQZXJQYWdlIGlkIGFyZ3VtZW50IChpZDogXCIgKyBwYWdpbmF0aW9uSWQgKyBcIikgZG9lcyBub3QgbWF0Y2ggYSByZWdpc3RlcmVkIHBhZ2luYXRpb24taWQuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZW5kO1xuICAgICAgICAgICAgdmFyIHN0YXJ0O1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGl0ZW1zUGVyUGFnZSA9IGl0ZW1zUGVyUGFnZSB8fCA5OTk5OTk5OTk5O1xuICAgICAgICAgICAgICAgIGlmIChwYWdpbmF0aW9uU2VydmljZS5pc0FzeW5jTW9kZShwYWdpbmF0aW9uSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IChwYWdpbmF0aW9uU2VydmljZS5nZXRDdXJyZW50UGFnZShwYWdpbmF0aW9uSWQpIC0gMSkgKiBpdGVtc1BlclBhZ2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVuZCA9IHN0YXJ0ICsgaXRlbXNQZXJQYWdlO1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQsIGl0ZW1zUGVyUGFnZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pXG5cbiAgICAuc2VydmljZSgncGFnaW5hdGlvblNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlcyA9IHt9O1xuICAgICAgICB2YXIgbGFzdFJlZ2lzdGVyZWRJbnN0YW5jZTtcbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uRGlyZWN0aXZlSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGluc3RhbmNlc1tpbnN0YW5jZUlkXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jTW9kZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxhc3RSZWdpc3RlcmVkSW5zdGFuY2UgPSBpbnN0YW5jZUlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXNSZWdpc3RlcmVkID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0gIT09ICd1bmRlZmluZWQnKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExhc3RJbnN0YW5jZUlkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gbGFzdFJlZ2lzdGVyZWRJbnN0YW5jZTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldEN1cnJlbnRQYWdlUGFyc2VyID0gZnVuY3Rpb24oaW5zdGFuY2VJZCwgdmFsLCBzY29wZSkge1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLmN1cnJlbnRQYWdlUGFyc2VyID0gdmFsO1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLmNvbnRleHQgPSBzY29wZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50UGFnZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQsIHZhbCkge1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLmN1cnJlbnRQYWdlUGFyc2VyLmFzc2lnbihpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29udGV4dCwgdmFsKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRDdXJyZW50UGFnZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY3VycmVudFBhZ2VQYXJzZXIoaW5zdGFuY2VzW2luc3RhbmNlSWRdLmNvbnRleHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0SXRlbXNQZXJQYWdlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCwgdmFsKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uaXRlbXNQZXJQYWdlID0gdmFsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldEl0ZW1zUGVyUGFnZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uaXRlbXNQZXJQYWdlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2V0Q29sbGVjdGlvbkxlbmd0aCA9IGZ1bmN0aW9uKGluc3RhbmNlSWQsIHZhbCkge1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLmNvbGxlY3Rpb25MZW5ndGggPSB2YWw7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0Q29sbGVjdGlvbkxlbmd0aCA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uY29sbGVjdGlvbkxlbmd0aDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldEFzeW5jTW9kZVRydWUgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uYXN5bmNNb2RlID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmlzQXN5bmNNb2RlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5hc3luY01vZGU7XG4gICAgICAgIH07XG4gICAgfSlcbjtcbiIsImFuZ3VsYXIubW9kdWxlKCdTaWduYWxSJywgW10pXG4gICAgLmNvbnN0YW50KCckJywgJClcbiAgICAuZmFjdG9yeSgnSHViJywgWyckJywgJyRxJyxcbiAgICAgICAgZnVuY3Rpb24oJCwgJHEpIHtcbiAgICAgICAgICAgIC8vVGhpcyB3aWxsIGFsbG93IHNhbWUgY29ubmVjdGlvbiB0byBiZSB1c2VkIGZvciBhbGwgSHVic1xuICAgICAgICAgICAgLy9JdCBhbHNvIGtlZXBzIGNvbm5lY3Rpb24gYXMgc2luZ2xldG9uLlxuICAgICAgICAgICAgdmFyIGdsb2JhbENvbm5lY3Rpb24gPSBudWxsO1xuXG4gICAgICAgICAgICB2YXIgaW5pdEdsb2JhbENvbm5lY3Rpb24gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yb290UGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxDb25uZWN0aW9uID0gJC5odWJDb25uZWN0aW9uKG9wdGlvbnMucm9vdFBhdGgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJEZWZhdWx0UGF0aDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsQ29ubmVjdGlvbiA9ICQuaHViQ29ubmVjdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihodWJOYW1lLCBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdmFyIEh1YiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbENvbm5lY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdEdsb2JhbENvbm5lY3Rpb24ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uID0gZ2xvYmFsQ29ubmVjdGlvbjtcbiAgICAgICAgICAgICAgICBIdWIucHJveHkgPSBIdWIuY29ubmVjdGlvbi5jcmVhdGVIdWJQcm94eShodWJOYW1lKTtcblxuICAgICAgICAgICAgICAgIEh1Yi5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBmbikge1xuICAgICAgICAgICAgICAgICAgICBIdWIucHJveHkub24oZXZlbnQsIGZuKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIEh1Yi5pbnZva2UgPSBmdW5jdGlvbihtZXRob2QsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEh1Yi5wcm94eS5pbnZva2UuYXBwbHkoSHViLnByb3h5LCBhcmd1bWVudHMpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBIdWIuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBIdWIuY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbi5zdGFydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnQ6ICdsb25nUG9sbGluZydcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLmxpc3RlbmVycywgZnVuY3Rpb24oZm4sIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBIdWIub24oZXZlbnQsIGZuKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubWV0aG9kcykge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5tZXRob2RzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEh1YlttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSAkLm1ha2VBcnJheShhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MudW5zaGlmdChtZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBIdWIuaW52b2tlLmFwcGx5KEh1YiwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5xdWVyeVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbi5xcyA9IG9wdGlvbnMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vQWRkaW5nIGFkZGl0aW9uYWwgcHJvcGVydHkgb2YgcHJvbWlzZSBhbGxvd3MgdG8gYWNjZXNzIGl0IGluIHJlc3Qgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgICAgICAgICAgICAgIC8vICAgSHViLnByb21pc2UgPSBIdWIuY29ubmVjdGlvbi5zdGFydCgpO1xuICAgICAgICAgICAgICAgIC8vIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgSHViLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24uc3RhcnQoKS5kb25lKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEb25lXCIsIHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGNvbm5lY3QnLCBIdWIuY29ubmVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24uc3RhcnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5yZWplY3QocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLmRpc2Nvbm5lY3RlZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRGlzY29ubmVjdGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIdWIuY29ubmVjdGlvbi5zdGFydCgpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IGRvbmUsIGJ1dCBub3QgZmFpbGVkXCIsIEh1Yi5jb25uZWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gSHViO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIF0pO1xuIiwiICAgIGNsYXNzIFByb3NwZWN0IHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLklzc3VlcyA9IFtcbiAgICAgICAgICAgICAgICBmb3IgKHggb2Ygb2JqLklzc3VlcykgbmV3IElzc3VlKHggfHwge30pXG4gICAgICAgICAgICBdXG4gICAgICAgICAgICB0aGlzLkFjdGl2aXRpZXMgPSBvYmouQWN0aXZpdGllcy5tYXAoQyA9PiBuZXcgQWN0aXZpdHkoQyB8fCB7fSkpXG4gICAgICAgICAgICB0aGlzLkNvbnRhY3RzID0gb2JqLkNvbnRhY3RzLm1hcChDID0+IG5ldyBDb250YWN0KEMgfHwge30pKVxuICAgICAgICAgICAgdGhpcy5DdXN0b21lciA9IG5ldyBDdXN0b21lcihvYmouQ3VzdG9tZXIgfHwge30pO1xuICAgICAgICAgICAgdGhpcy5Jc3N1ZUNvdW50ID0gb2JqLklzc3Vlcy5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLkFjdGl2aXR5Q291bnQgPSBvYmouQWN0aXZpdGllcy5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLkNvbnRhY3RDb3VudCA9IG9iai5Db250YWN0cy5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLkN1c3RvbWVyVHlwZSA9IFwiQVwiXG4gICAgICAgICAgICAvLyB0aGlzLlByb3NwZWN0VHlwZSA9IFwiUFwiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBDb250YWN0IHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLkFkZHIxID0gdGhpcy5BZGRyMSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5BZGRyMiA9IHRoaXMuQWRkcjIgfHwgJydcbiAgICAgICAgICAgIHRoaXMuQ2l0eSA9IHRoaXMuQ2l0eSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5Db250YWN0SUQgPSB0aGlzLkNvbnRhY3RJRCB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5FbWFpbCA9IHRoaXMuRW1haWwgfHwgJydcbiAgICAgICAgICAgIHRoaXMuRmF4ID0gdGhpcy5GYXggfHwgJydcbiAgICAgICAgICAgIHRoaXMuTW9iaWxlID0gdGhpcy5Nb2JpbGUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuTmFtZSA9IHRoaXMuTmFtZSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5QaG9uZSA9IHRoaXMuUGhvbmUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuU3RhdGUgPSB0aGlzLlN0YXRlIHx8ICcnXG4gICAgICAgICAgICB0aGlzLlppcCA9IHRoaXMuWmlwIHx8ICcnXG4gICAgICAgICAgICB0aGlzLlR5cGVzID0gdGhpcy5UeXBlcyB8fCBbXTtcbiAgICAgICAgICAgIC8vIGZpblxuICAgICAgICAgICAgdGhpcy5IdW1hblR5cGVzXyA9IF8ucGx1Y2sob2JqLlR5cGVzLCAnVHlwZScpXG4gICAgICAgICAgICB0aGlzLk9sZFR5cGVzID0gW11cbiAgICAgICAgfVxuICAgICAgICBzZXQgSHVtYW5UeXBlcyh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5PbGRUeXBlcyA9IHRoaXMuSHVtYW5UeXBlc187XG4gICAgICAgICAgICB0aGlzLkh1bWFuVHlwZXNfID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0IEh1bWFuVHlwZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5IdW1hblR5cGVzX1xuICAgICAgICB9XG4gICAgICAgIGdldCBvbGRfdnNfbmV3KCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnb2xkJzogdGhpcy5PbGRUeXBlcyxcbiAgICAgICAgICAgICAgICAnbmV3JzogdGhpcy5IdW1hblR5cGVzX1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgSXNzdWUge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuaXNzdWUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zdGFydCA9IG9iai5DcmVhdGlvbkRhdGVUaW1lO1xuICAgICAgICAgICAgdGhpcy5lbmQgPSBvYmouQ29tcGxldGlvbkRhdGVUaW1lXG4gICAgICAgICAgICB0aGlzLnN0YXJ0SHVtYW4gPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkxMXCIpXG4gICAgICAgICAgICB0aGlzLmVuZEh1bWFuID0gbW9tZW50KG9iai5Db21wbGV0aW9uRGF0ZVRpbWUpLmZvcm1hdChcImxsXCIpXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBvYmouRGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsIDUpO1xuICAgICAgICAgICAgdGhpcy50eXBlT2YgPSBcIkNsb3NlZCBJc3N1ZXNcIlxuICAgICAgICAgICAgaWYgKHRoaXMuZW5kID09IFwiMTkwMC0wMS0wMVQwMDowMDowMFwiKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZW5kXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRIdW1hbiA9IFwiU3RpbGwgb3BlbmVkXCJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3Blbklzc3VlXCJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVPZiA9IFwiT3BlbiBJc3N1ZXNcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy55ZWFyID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpKTtcbiAgICAgICAgICAgIHRoaXMubW9udGggPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIk1NXCIpKTtcbiAgICAgICAgICAgIHRoaXMuZGF5ID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERERcIikpO1xuICAgICAgICAgICAgdGhpcy5tb250aF95ZWFyID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJNTVwiKSArIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKVxuICAgICAgICAgICAgdGhpcy55ZWFyX2RheSA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiREREXCIpICsgbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpXG4gICAgICAgICAgICB0aGlzLnJlcGx5Q291bnQgPSBvYmouRm9sbG93dXBzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuRm9sbG93dXBzID0gW1xuICAgICAgICAgICAgICAgIGZvciAoeCBvZiBvYmouRm9sbG93dXBzKSBuZXcgRm9sbG93dXBzKHggfHwge30pXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBBY3Rpdml0eSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5pc3N1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdGFydEh1bWFuID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJMTFwiKVxuICAgICAgICAgICAgdGhpcy5zdGFydCA9IG9iai5DcmVhdGlvbkRhdGVUaW1lO1xuICAgICAgICAgICAgLy8gZGVsZXRlIEFjdGl2aXRpZXMuQ3JlYXRpb25EYXRlVGltZTtcbiAgICAgICAgICAgIC8vIHRoaXMuY29udGVudCA9IG9iai5Ob3RlLnN1YnN0cmluZygwLCAyMClcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IFwiMSBub3RlXCJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBhY3Rpdml0aWVzLk5vdGU7XG4gICAgICAgICAgICB0aGlzLnR5cGVPZiA9IFwiQWxsIEFjdGl2aXRpZXNcIjtcbiAgICAgICAgICAgIHRoaXMueWVhciA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKSk7XG4gICAgICAgICAgICB0aGlzLm1vbnRoID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJNTVwiKSk7XG4gICAgICAgICAgICB0aGlzLmRheSA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiREREXCIpKTtcbiAgICAgICAgICAgIHRoaXMuc21hbGxEYXkgPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkREXCIpKTtcbiAgICAgICAgICAgIHRoaXMubW9udGhfeWVhciA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikgKyBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIik7XG4gICAgICAgICAgICB0aGlzLnllYXJfZGF5ID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERERcIikgKyBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIik7XG4gICAgICAgICAgICB0aGlzLlR5cGVfSHVtYW4gPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwcmVhZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgzIC0gMSkpICsgMTtcbiAgICAgICAgICAgICAgICBpZiAoc3ByZWFkID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiUGhvbmVcIlxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlZpc2l0XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICB0aGlzLnRpbWViZXR3ZWVuID0gXCIyIHdlZWtzXCJcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIEZvbGxvd3VwcyB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5pc3N1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdGFydEh1bWFuID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJsbFwiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQWRkRXZlbnQge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmosIGluZm8pIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuRGF0ZSA9IG1vbWVudCh0aGlzLkRhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIik7XG4gICAgICAgICAgICAvLyB0aGlzLlByb3NwZWN0SUQgPSAnMidcbiAgICAgICAgICAgIC8vIHRoaXMuQ2FtcGFpZ25JRCA9IGluZm8uQ2FtcGFpZ25JRDtcbiAgICAgICAgICAgIC8vIHRoaXMuQ3JlYXRpb25Vc2VyID0gaW5mby5DcmVhdGlvblVzZXI7XG4gICAgICAgICAgICAvLyB0aGlzLlByb2R1Y3RJRCA9IGluZm8uUHJvZHVjdElEO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQWRkSXNzdWUge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmosIGluZm8pIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuQ29tcGxldGlvbkRhdGVUaW1lID0gJzE5MDAtMDEtMDEnXG4gICAgICAgICAgICB0aGlzLlN0YXR1cyA9IDA7XG4gICAgICAgICAgICB0aGlzLlByb2R1Y3RJRCA9IDE7XG4gICAgICAgIH1cbiAgICB9XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdwcm9zcGVjdENvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgcHJvc3BlY3RGYWN0b3J5LCAkbG9jYXRpb24sIExvZ2luU2VydmljZSwgJG1vZGFsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8gcHJvc3BlY3RcIilcbiAgICAgICAgJHNjb3BlLmRldGFpbHMgPSB7XG4gICAgICAgICAgICB1c2VyOiBMb2dpblNlcnZpY2UudXNlclxuICAgICAgICB9XG4gICAgICAgICRzY29wZS5jb250YWN0Q29sbGFwc2UgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaXNzdWVDb2xsYXBzZSA9IHRydWU7XG5cbiAgICAgICAgJHNjb3BlLkFkZEV2ZW50ID0ge307XG4gICAgICAgICRzY29wZS5BZGRDb250YWN0ID0ge307XG4gICAgICAgICRzY29wZS5Db250YWN0S2V5cyA9IFtdXG5cbiAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdDtcbiAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdF9lZGl0ID0ge307XG4gICAgICAgIC8vICRzY29wZS5Db250YWN0cyA9IFtdO1xuICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUucGFyYW1zKVxuICAgICAgICAkc2NvcGUuY29udGFjdFR5cGUgPSBbe1xuICAgICAgICAgICAgdmFsdWU6ICcxJyxcbiAgICAgICAgICAgIGxhYmVsOiAnT3duZXInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnMicsXG4gICAgICAgICAgICBsYWJlbDogJ0luIENoYXJnZSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICczJyxcbiAgICAgICAgICAgIGxhYmVsOiAnR2FtYmxlcidcbiAgICAgICAgfV07XG4gICAgICAgICRzY29wZS5zZWxlY3RlZENvbnRhY3RUeXBlID0gW107XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuZ2V0UHJvc3BlY3RfYnlfSUQoJHN0YXRlLnBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgcHJvc3BlY3RcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0ID0gbmV3IFByb3NwZWN0KGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGhlX1Byb3NwZWN0KVxuICAgICAgICAgICAgICAgIHRpbWVCZXR3ZWVuKCk7XG4gICAgICAgICAgICAgICAgbWFrZVRpbWVsaW5lKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0ID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0c1swXVxuICAgICAgICAgICAgICAgICRzY29wZS5kZXRhaWxzLkNhbXBhaWduSUQgPSAwO1xuICAgICAgICAgICAgICAgICRzY29wZS5kZXRhaWxzLkNyZWF0aW9uVXNlciA9IFwibWVcIjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGV0YWlscy5Qcm9kdWN0SUQgPSAwO1xuICAgICAgICAgICAgICAgIC8vIGNhc3QgdG8gbmV3IENvbnRhY3Qgc28gb24gc2F2ZSBpdCBoYXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICRzY29wZS5BZGRDb250YWN0ID0gbmV3IENvbnRhY3Qoe30pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuQWRkQ29udGFjdC5IdW1hblR5cGVzXztcbiAgICAgICAgICAgICAgICBkZWxldGUgJHNjb3BlLkFkZENvbnRhY3QuT2xkVHlwZXM7XG4gICAgICAgICAgICAgICAgJHNjb3BlLkNvbnRhY3RLZXlzID0gT2JqZWN0LmtleXMoJHNjb3BlLkFkZENvbnRhY3QpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2hlbiBsb2FkaW5nIG1vZGFsLCBjbGVhciB0aGUgbW9kZWwuIEVsc2Ugc2V0IFwiZWRpdFwiIHRvIGZhbHNlXG4gICAgICAgICRzY29wZS5jbGVhck1vZGVsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuQWRkQ29udGFjdCA9IG5ldyBDb250YWN0KHt9KTtcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuQWRkQ29udGFjdC5IdW1hblR5cGVzXztcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuQWRkQ29udGFjdC5PbGRUeXBlcztcbiAgICAgICAgICAgICRzY29wZS5lZGl0Q29udGFjdEJvb2wgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5lZGl0Q29udGFjdEJvb2wgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLm1vZGFsU2F2ZUNvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0LCBtb2RhbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJIZXJwIGRlcnBcIiwgY29udGFjdClcbiAgICAgICAgICAgIGlmICghY29udGFjdC5UeXBlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk11c3Qgc2VsZWN0IGEgdHlwZVwiKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHdlJ3JlIGVkaXRpbmcgYW5kIG5vdCBzYXZpbmdcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZWRpdENvbnRhY3RCb29sKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEbyBzb21lIGVkaXQgaHR0cFwiKVxuICAgICAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5FZGl0Q29udGFjdChjb250YWN0KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuQWRkQ29udGFjdChjb250YWN0KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0cy5wdXNoKG5ldyBDb250YWN0KGNvbnRhY3QpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5lZGl0Q29udGFjdCA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZWRpdFwiLCBjb250YWN0KVxuICAgICAgICAgICAgLy8gcHJlcG9wdWxhdGUgdGhlIG1vZGVsXG4gICAgICAgICAgICAkc2NvcGUuQWRkQ29udGFjdCA9IGNvbnRhY3Q7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdENvbnRhY3RCb29sID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHByb3NwZWN0RmFjdG9yeS5FZGl0Q29udGFjdChjb250YWN0KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnByb3NwZWN0RWRpdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0aW5nIHByb3NwZWN0XCIpXG4gICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0X2VkaXQgPSBPYmplY3QuYXNzaWduKCRzY29wZS50aGVfUHJvc3BlY3RfZWRpdCwgJHNjb3BlLnRoZV9Qcm9zcGVjdCk7XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLnRoZV9Qcm9zcGVjdF9lZGl0LkFjdGl2aXRpZXM7XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLnRoZV9Qcm9zcGVjdF9lZGl0LkNvbnRhY3RzO1xuICAgICAgICAgICAgZGVsZXRlICRzY29wZS50aGVfUHJvc3BlY3RfZWRpdC5DdXN0b21lcjtcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUudGhlX1Byb3NwZWN0X2VkaXQuSXNzdWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmVkaXRJc3N1ZUJvb2wgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmVkaXRFdmVudEJvb2wgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmVkaXRFdmVudCA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoZXJwXCIsIGV2dClcbiAgICAgICAgICAgIGlmIChldnQuaXNzdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi4uLi5pc3N1ZS4uLlwiKVxuICAgICAgICAgICAgICAgIC8vIHByZXBvcHVsYXRlIG1vZGVsXG4gICAgICAgICAgICAgICAgJHNjb3BlLkFkZElzc3VlID0gbmV3IEFkZElzc3VlKGV2dClcbiAgICAgICAgICAgICAgICB2YXIgbXlNb2RhbCA9ICRtb2RhbCh7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnL3NyYy9qcy9wcm9zcGVjdC9hZGQtaXNzdWUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdElzc3VlQm9vbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi4uLi5ub3RlL2V2ZW50Li4uXCIpXG4gICAgICAgICAgICAgICAgJHNjb3BlLkFkZEV2ZW50ID0gbmV3IEFkZEV2ZW50KGV2dClcbiAgICAgICAgICAgICAgICB2YXIgbXlNb2RhbCA9ICRtb2RhbCh7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnL3NyYy9qcy9wcm9zcGVjdC9hZGQtZXZlbnQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdEV2ZW50Qm9vbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubW9kYWxTYXZlUHJvc3BlY3QgPSBmdW5jdGlvbihldnQsIG1vZGFsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBwcm9zcGVjdFwiKVxuICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkVkaXRQcm9zcGVjdChldnQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXMudW5zaGlmdChuZXcgQWN0aXZpdHkoZXZ0KSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tb2RhbFNhdmVBY3Rpdml0eSA9IGZ1bmN0aW9uKGV2dCwgbW9kYWwpIHtcbiAgICAgICAgICAgIHZhciBhY3Rpdml0eSA9IG5ldyBBZGRFdmVudChldnQsICRzY29wZS5kZXRhaWxzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTXkgYWN0aXZpdHkgXCIsIGFjdGl2aXR5KVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lZGl0RXZlbnRCb29sKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXZSdyZSBlZGl0aW5nIGFuIGV2ZW50XCIpXG4gICAgICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkVkaXRFdmVudChhY3Rpdml0eSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkFkZEV2ZW50KGFjdGl2aXR5KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXMudW5zaGlmdChuZXcgQWN0aXZpdHkoZXZ0KSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1vZGFsU2F2ZUlzc3VlID0gZnVuY3Rpb24oaXNzdWUsIG1vZGFsKSB7XG4gICAgICAgICAgICB2YXIgaXNzdWUgPSBuZXcgQWRkSXNzdWUoaXNzdWUpXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVkaXRJc3N1ZUJvb2wpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVkaXQgbm90IHNhdmVcIilcbiAgICAgICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuRWRpdElzc3VlKGlzc3VlKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuQWRkSXNzdWUoaXNzdWUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0Lklzc3Vlcy5wdXNoKG5ldyBJc3N1ZShpc3N1ZSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1ha2VBY3RpdmUgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2UgYWN0aXZlXCIsIGNvbnRhY3QpXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2Nyb2xsdG9IcmVmID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkKVxuICAgICAgICAgICAgaWYgKGlkID09ICdEZXRhaWxzJykge1xuICAgICAgICAgICAgICAgIC8vICRsb2NhdGlvbi5oYXNoKGlkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgLTUwMDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIGxvY2F0aW9uLmhhc2ggdG8gdGhlIGlkIG9mXG4gICAgICAgICAgICAgICAgLy8gdGhlIGVsZW1lbnQgeW91IHdpc2ggdG8gc2Nyb2xsIHRvLlxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5oYXNoKGlkKTtcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2Nyb2xsQnkoMCwtMTAwKTtcbiAgICAgICAgICAgICAgICAvLyBjYWxsICRhbmNob3JTY3JvbGwoKVxuICAgICAgICAgICAgICAgIC8vICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSAxO1xuICAgICAgICB2YXIgem9vbWNvdW50ID0gM1xuXG4gICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdFxuXG4gICAgICAgICRzY29wZS5jbGlja1RhYiA9IDE7XG5cbiAgICAgICAgJHNjb3BlLm9uQ2xpY2tUYWIgPSBmdW5jdGlvbihib29sKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhib29sKVxuICAgICAgICAgICAgJHNjb3BlLmNsaWNrVGFiID0gYm9vbDtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaXNBY3RpdmVUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vZm9yIHRoZSBwcm9zcGVjdCBkZXRhaWxzIGxpc3RcbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAvL3Nob3cgZGV0YWlscyBpcyB3aGVuIHRoZXkgY2xpY2sgYSB0aW1lbGluZSBldmVudFxuICAgICAgICAkc2NvcGUuc2hvd0RldGFpbHMgPSBmYWxzZTtcblxuICAgICAgICAkc2NvcGUuc2F2ZUNvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBjb250YWN0Li4uXCIsIGNvbnRhY3QpXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIGZpbHRlcnNcbiAgICAgICAgJHNjb3BlLmZpbHRlcnMgPSBbJ0FsbCBBY3Rpdml0aWVzJywgJ09ubHkgTXkgQWN0aXZpdGllcycsICdDbG9zZWQgSXNzdWVzJywgJ09wZW4gSXNzdWVzJywgJ1RyaW5ldCcsICdQcm9maXRHdWFyZCddO1xuICAgICAgICAvLyBzZWxlY3RlZCBmaWx0ZXJzXG4gICAgICAgICRzY29wZS5zZWxlY3Rpb24gPSBbJ0FsbCBBY3Rpdml0aWVzJywgJ0Nsb3NlZCBJc3N1ZXMnLCAnT3BlbiBJc3N1ZXMnLCAnVHJpbmV0JywgJ1Byb2ZpdEd1YXJkJ107XG4gICAgICAgIC8vIHRvZ2dsZSBzZWxlY3Rpb24gZm9yIGEgZ2l2ZW4gZmlsdGVyIGJ5IG5hbWVcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNlbGVjdGlvbiA9IGZ1bmN0aW9uIHRvZ2dsZVNlbGVjdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gJHNjb3BlLnNlbGVjdGlvbi5pbmRleE9mKGZpbHRlck5hbWUpO1xuICAgICAgICAgICAgLy8gaXMgY3VycmVudGx5IHNlbGVjdGVkXG4gICAgICAgICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0aW9uLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZUZpbHRlcihmaWx0ZXJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlzIG5ld2x5IHNlbGVjdGVkXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhZGRGaWx0ZXIoZmlsdGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGlvbi5wdXNoKGZpbHRlck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGFubm90YXRlICdub3Rlcycgd2l0aCB0aW1lIGRpZmYsIGllLiAndHdvIGRheXMgc2luY2UgbGFzdCdcbiAgICAgICAgZnVuY3Rpb24gdGltZUJldHdlZW4oKSB7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXNcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpXS55ZWFyKVxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpXS5tb250aClcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaV0uc21hbGxEYXkpXG4gICAgICAgICAgICAgICAgICAgIHZhciBhID0gbW9tZW50KGFycik7XG4gICAgICAgICAgICAgICAgICAgIGFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpICsgMV0ueWVhcilcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaSArIDFdLm1vbnRoKVxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpICsgMV0uc21hbGxEYXkpXG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gbW9tZW50KGFycik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWZmID0gYS5kaWZmKGIsICdkYXlzJylcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzW2kgKyAxXS50aW1lYmV0d2VlbiA9IGRpZmYgKyBcIiBkYXlzLi4uXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZmYgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzW2kgKyAxXS50aW1lYmV0d2VlbiA9IFwiU2FtZSBkYXlcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllc1swXS50aW1lYmV0d2VlbiA9IFwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRG9uZVwiLCAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXNbMF0udGltZWJldHdlZW4pXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWxldGVGaWx0ZXIoZmlsdGVyTmFtZSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1zR2V0ID0gaXRlbXMuZ2V0KCk7XG4gICAgICAgICAgICB2YXIgcmVtb3ZlID0gXy5maWx0ZXIoaXRlbXNHZXQsIGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudW0udHlwZU9mID09IGZpbHRlck5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXRlbXMucmVtb3ZlKHJlbW92ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZEZpbHRlcihmaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXNHZXQgPSBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXM7XG4gICAgICAgICAgICB2YXIgYWRkcyA9IF8uZmlsdGVyKGl0ZW1zR2V0LCBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtLnR5cGVPZiA9PSBmaWx0ZXJOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0ZW1zLmFkZChhZGRzKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRpbWVsaW5lO1xuICAgICAgICB2YXIgaXRlbXM7XG4gICAgICAgIHZhciBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXM7XG5cbiAgICAgICAgZnVuY3Rpb24gbWFrZVRpbWVsaW5lKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNYWtpbmcgdGltZWxpbmUuLi50aGlzIGNvbmNhdHMgYWxsIGV2ZW50cyBvbiB0aGUgc2FtZSBkYXlcIilcblxuICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Jc3N1ZXMuY29uY2F0KCRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllcylcblxuICAgICAgICAgICAgZnVuY3Rpb24gY29tcGFyZU51bWJlcnMoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmRheSAtIGIuZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzLnNvcnQoY29tcGFyZU51bWJlcnMpXG5cbiAgICAgICAgICAgIHZhciBkdXBlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IF8ucGx1Y2soQWN0aXZpdGllc19hbmRfSXNzdWVzLCAneWVhcl9kYXknKTtcbiAgICAgICAgICAgIHZhciByYW5nZXMgPSBfLnVuaXEocmFuZ2VzKVxuICAgICAgICAgICAgdmFyIG1vdGhlcnNoaXAgPSBbXVxuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goZnVuY3Rpb24ocmFuZ2UsIGl0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IF8ud2hlcmUoQWN0aXZpdGllc19hbmRfSXNzdWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICd5ZWFyX2RheSc6IHJhbmdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gcHVsbCBvdXQgaXNzdWVzXG4gICAgICAgICAgICAgICAgdmFyIGlzc3VlcyA9IFtdXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS5pc3N1ZSAmJiBncm91cHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZ3JvdXBzLmluZGV4T2YodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXMgPSBncm91cHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdGhlcnNoaXAucHVzaChpc3N1ZXMpXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vdGhlcnNoaXAucHVzaChncm91cHMpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzID0gW107XG4gICAgICAgICAgICBtb3RoZXJzaGlwLmZvckVhY2goZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyclswXS5pc3N1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlIGluIG1vdGhlcnNoaXBcIilcbiAgICAgICAgICAgICAgICAgICAgYXJyWzBdLmNvbnRlbnQgPSBcIklzc3VlXCJcbiAgICAgICAgICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzLnB1c2goYXJyWzBdKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyclswXS5jb250ZW50ID0gYXJyLmxlbmd0aCArIFwiIE5vdGVzXCJcbiAgICAgICAgICAgICAgICAgICAgYXJyWzBdLndhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBhcnJbMF0uc3Vibm90ZXMgPSBhcnI7XG4gICAgICAgICAgICAgICAgICAgIEFjdGl2aXRpZXNfYW5kX0lzc3Vlcy5wdXNoKGFyclswXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpdGVtcyA9IG5ldyB2aXMuRGF0YVNldChBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMpO1xuXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICAvLyBoZWlnaHQ6ICcyMDBweCcsXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vICAgbWluOiBuZXcgRGF0ZSgyMDE0LCBtb21lbnQoKS5zdWJ0cmFjdCgnbW9udGgnLCAyKS5mb3JtYXQoXCJNXCIpLCAxKSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoMjAxNCwgbW9tZW50KCkuc3VidHJhY3QoJ21vbnRoJywgMikuZm9ybWF0KFwiTVwiKSwgMSksXG4gICAgICAgICAgICAgICAgLy8gbWF4OiBuZXcgRGF0ZSgyMDE0LCA3LCAxKVxuICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUoMjAxNCwgbW9tZW50KCkuYWRkKCdtb250aCcsIDIpLmZvcm1hdChcIk1cIiksIDEpXG4gICAgICAgICAgICAgICAgLy8gICB6b29tTWluOiAxMDAwICogNjAgKiA2MCAqIDI0ICAgICAgICAgICAgLy8gb25lIGRheSBpbiBtaWxsaXNlY29uZHMsIGZ1cnRoZXN0IFwiaW5cIlxuICAgICAgICAgICAgICAgIC8vIHpvb21NYXg6IDEwMDAgKiA2MCAqIDYwICogMjQgKiAzMSAqIDMgICAvLyBhYm91dCB0aHJlZSBtb250aHMgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGltZWxpbmUgPSBuZXcgdmlzLlRpbWVsaW5lKGNvbnRhaW5lciwgaXRlbXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGltZWxpbmUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBsb2dFdmVudCgnc2VsZWN0JywgcHJvcGVydGllcylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGltZWxpbmUub24oJ3JhbmdlY2hhbmdlZCcsIGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICAgICAgICAvLyB2YXIgc3RhcnQgPSBuZXcgRGF0ZSh0aW1lLnN0YXJ0KVxuICAgICAgICAgICAgICAgIC8vIHN0YXJ0ID0gc3RhcnQudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwxNSlcbiAgICAgICAgICAgICAgICAvLyB2YXIgZW5kID0gbmV3IERhdGUodGltZS5lbmQpXG4gICAgICAgICAgICAgICAgLy8gZW5kID0gZW5kLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsMTUpXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3RhcnQsIGVuZClcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggbW9tZW50KGVuZCkuaXNBZnRlcihzdGFydCkgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUubWVzc2FnZSA9IFwiU2VsZWN0IGFuIGV2ZW50XCI7XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nRXZlbnQoZXZlbnQsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW1zWyBwcm9wZXJ0aWVzLml0ZW1zWzBdIF0pXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGl0ZW1zLl9kYXRhW3Byb3BlcnRpZXMuaXRlbXNbMF1dXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY29udGVudC5jb250ZW50KVxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBjb250ZW50Lk5vdGU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb250ZW50KVxuICAgICAgICAgICAgaWYgKGNvbnRlbnQud2FybmluZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlY2lhbCBtZXNzYWdlIC0+IGdvdG8gbm90ZVwiKVxuICAgICAgICAgICAgICAgIGdvdG9Ob3RlKGNvbnRlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZW50Lmlzc3VlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTcGVjaWFsIGlzc3VlIC0+IGdvdG8gaXNzdWVcIilcbiAgICAgICAgICAgICAgICBnb3RvSXNzdWUoY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUubXNnSW5mbyA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd0RldGFpbHMgPSB0cnVlO1xuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdvdG9Jc3N1ZShub3RlKSB7XG4gICAgICAgICAgICAvL2dvdG8gbm90ZSBzaG91bGQgcmVzZXQgem9vbSB0byBcImJhc2VsaW5lXCJcbiAgICAgICAgICAgIHpvb21jb3VudCA9IDNcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlzdWFsaXphdGlvbicpO1xuICAgICAgICAgICAgdmFyIG1vbnRoU3RhcnQgPSBtb21lbnQobm90ZS5zdGFydCkuc3RhcnRPZignbW9udGgnKS5mb3JtYXQoXCJEXCIpXG4gICAgICAgICAgICB2YXIgbW9udGhFbmQgPSBtb21lbnQobm90ZS5zdGFydCkuZW5kT2YoJ21vbnRoJykuZm9ybWF0KFwiRFwiKVxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoeWVhciwgbW9udGgtMSwgZGF5KSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhTdGFydCksXG4gICAgICAgICAgICAgICAgbWF4OiBuZXcgRGF0ZShub3RlLnllYXIsIG5vdGUubW9udGggLSAxLCBtb250aEVuZClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub3RlLCBtb250aFN0YXJ0LCBtb250aEVuZClcbiAgICAgICAgICAgIG5vdGUuY29udGVudCA9IG5vdGUuRGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsIDIwKVxuICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBub3RlLkRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgdGltZWxpbmUuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGltZWxpbmUgPSBuZXcgdmlzLlRpbWVsaW5lKGNvbnRhaW5lciwgaXRlbXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGltZWxpbmUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBsb2dFdmVudCgnc2VsZWN0JywgcHJvcGVydGllcylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBnb3RvTm90ZShub3RlKSB7XG4gICAgICAgICAgICAvL2dvdG8gbm90ZSBzaG91bGQgcmVzZXQgem9vbSB0byBcImJhc2VsaW5lXCJcbiAgICAgICAgICAgIHpvb21jb3VudCA9IDNcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlzdWFsaXphdGlvbicpO1xuICAgICAgICAgICAgdmFyIG1vbnRoU3RhcnQgPSBtb21lbnQobm90ZS5zdGFydCkuc3RhcnRPZignbW9udGgnKS5mb3JtYXQoXCJEXCIpXG4gICAgICAgICAgICB2YXIgbW9udGhFbmQgPSBtb21lbnQobm90ZS5zdGFydCkuZW5kT2YoJ21vbnRoJykuZm9ybWF0KFwiRFwiKVxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgbWluSGVpZ2h0OiAnMTUwcHgnLFxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoeWVhciwgbW9udGgtMSwgZGF5KSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhTdGFydCksXG4gICAgICAgICAgICAgICAgbWF4OiBuZXcgRGF0ZShub3RlLnllYXIsIG5vdGUubW9udGggLSAxLCBtb250aEVuZClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhub3RlLCBtb250aFN0YXJ0LCBtb250aEVuZClcbiAgICAgICAgICAgIG5vdGUuc3Vibm90ZXMuZm9yRWFjaChmdW5jdGlvbihub3Rlcykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5vdGVzKVxuICAgICAgICAgICAgICAgIG5vdGVzLmNvbnRlbnQgPSBub3Rlcy5Ob3RlLnN1YnN0cmluZygwLCAyMClcbiAgICAgICAgICAgICAgICAvLyBpdGVtcy5jbGVhcigpXG4gICAgICAgICAgICAgICAgaXRlbXMucmVtb3ZlKG5vdGUuaWQpXG4gICAgICAgICAgICAgICAgaXRlbXMuYWRkKG5vdGVzKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRpbWVsaW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRpbWVsaW5lID0gbmV3IHZpcy5UaW1lbGluZShjb250YWluZXIsIGl0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBab29tIHRoZSB0aW1lbGluZSBhIGdpdmVuIHBlcmNlbnRhZ2UgaW4gb3Igb3V0XG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwZXJjZW50YWdlICAgRm9yIGV4YW1wbGUgMC4xICh6b29tIG91dCkgb3IgLTAuMSAoem9vbSBpbilcbiAgICAgICAgICovXG4gICAgICAgIC8vICB2YXIgem9vbWNvdW50ID0gM1xuICAgICAgICBmdW5jdGlvbiB6b29tKHpvb21faW4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQW1vdW50c1wiLCB6b29tY291bnQsIHpvb21faW4pXG4gICAgICAgICAgICB6b29tY291bnQgPSB6b29tY291bnQgKyB6b29tX2luXG4gICAgICAgICAgICB2YXIgb3B0aW9ucztcbiAgICAgICAgICAgIGlmICh6b29tY291bnQgPT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIHpvb21jb3VudCsrXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJab29tIGluXCIsIHpvb21jb3VudClcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICB6b29tYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoMjAxNCwgNSwgMSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSgyMDE0LCA1LCAxKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiBuZXcgRGF0ZSgyMDE0LCA3LCAxKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgLy8gcHJldmVudHMgem9vbSBjb3VudCBmcm9tIGdvaW5nIHBhc3QgNFxuICAgICAgICAgICAgICAgIHpvb21jb3VudCA9IDM7XG4gICAgICAgICAgICAgICAgem9vbVRpbWVsaW5lKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoem9vbWNvdW50ID09IDIpIHtcbiAgICAgICAgICAgICAgICAvLyB6b29tY291bnQtLVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWm9vbSBvdXQgJ21vbnRoIHZpZXcnIFwiLCB6b29tY291bnQpXG4gICAgICAgICAgICAgICAgY29vbG5ld1NvcnRNZXRob2QoKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICB6b29tYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoMjAxMiwgNywgMSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSgyMDE0LCAxLCAxKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4OiBuZXcgRGF0ZSgyMDE0LCA3LCAxKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgem9vbVRpbWVsaW5lKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoem9vbWNvdW50ID09IDEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiV2lsZGNhcmQgem9vbSwgcGxhY2Vob2xkZXIuLi5Ub2RvXCIsIHpvb21jb3VudClcbiAgICAgICAgICAgICAgICB6b29tVGltZWxpbmUoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh6b29tY291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYW5jZWwgem9vbVwiLCB6b29tY291bnQpXG4gICAgICAgICAgICAgICAgem9vbWNvdW50KytcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gem9vbVRpbWVsaW5lKCkge1xuICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlzdWFsaXphdGlvbicpO1xuICAgICAgICAgICAgICAgIHRpbWVsaW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgdGltZWxpbmUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhdHRhY2ggZXZlbnRzIHRvIHRoZSBuYXZpZ2F0aW9uIGJ1dHRvbnNcbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3pvb21JbicpLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHpvb20oMSk7XG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tT3V0Jykub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgem9vbSgtMSk7XG4gICAgICAgIC8vIH07XG4gICAgICAgICRzY29wZS5pY29ucyA9IFt7XG4gICAgICAgICAgICB2YWx1ZTogMSxcbiAgICAgICAgICAgIGxhYmVsOiAnT3duZXInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAyLFxuICAgICAgICAgICAgbGFiZWw6ICdQZXJzb24gaW4nXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAzLFxuICAgICAgICAgICAgbGFiZWw6ICdCZXN0IEZyaWVuZCdcbiAgICAgICAgfV07XG5cblxuICAgICAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgdmFyIHRhcmcgPSBfLmZpbmRXaGVyZSgkc2NvcGUudGhlX1Byb3NwZWN0LkNvbnRhY3RzLCBjb250YWN0KVxuICAgICAgICAgICAgdmFyIGRpZmYgPSB0YXJnLm9sZF92c19uZXc7XG4gICAgICAgICAgICAvLyBuZWVkIHRvIGNoZWNrIHRoZSBsZW5ndGggdG8gc2VlIGlmIGl0J3MgYW4gYWRkIG9yIGEgZGVsZXRlXG4gICAgICAgICAgICBpZiAoZGlmZi5vbGQubGVuZ3RoID4gZGlmZi5uZXcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5nZWQgPSBfLmRpZmZlcmVuY2UoZGlmZi5vbGQsIGRpZmYubmV3KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1YnRyYWN0ZWRcIiwgY2hhbmdlZClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5nZWQgPSBfLmRpZmZlcmVuY2UoZGlmZi5uZXcsIGRpZmYub2xkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZGVkXCIsIGNoYW5nZWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGNvb2xuZXdTb3J0TWV0aG9kKCkge1xuICAgICAgICAgICAgdmFyIG1vbnRocyA9IDEyXG4gICAgICAgICAgICB2YXIgeWVhcnMgPSBbMjAxMCwgMjAxMSwgMjAxMiwgMjAxMywgMjAxNF1cbiAgICAgICAgICAgIHZhciByYW5nZXMgPSBfLnBsdWNrKEFjdGl2aXRpZXNfYW5kX0lzc3VlcywgJ21vbnRoX3llYXInKTtcbiAgICAgICAgICAgIHZhciByYW5nZXMgPSBfLnVuaXEocmFuZ2VzKVxuICAgICAgICAgICAgdmFyIG1vdGhlcnNoaXAgPSBbXVxuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goZnVuY3Rpb24ocmFuZ2UsIGl0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IF8ud2hlcmUoQWN0aXZpdGllc19hbmRfSXNzdWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICdtb250aF95ZWFyJzogcmFuZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtb3RoZXJzaGlwW2l0XSA9IGdyb3VwcztcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGl0ZW1zLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIG1vdGhlcnNoaXAuZm9yRWFjaChmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgYXJyWzBdLmlkO1xuICAgICAgICAgICAgICAgIGFyclswXS5jb250ZW50ID0gYXJyLmxlbmd0aCArIFwiIE5vdGVzXCJcbiAgICAgICAgICAgICAgICBhcnJbMF0ud2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYXJyWzBdLnN1Ym5vdGVzID0gYXJyO1xuICAgICAgICAgICAgICAgIGl0ZW1zLmFkZChhcnJbMF0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgncHJvc3BlY3RGYWN0b3J5JyxcbiAgICAgICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgICAgIHZhciBwcm9zcGVjdElEO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfcmVxdWVzdDogZnVuY3Rpb24obWV0aG9kID0gJ2dldCcsIHN1ZmZpeCA9ICcnLCBkYXRhID0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGBodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9wcm9zcGVjdC8ke3Byb3NwZWN0SUR9LyR7c3VmZml4fWAsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0UHJvc3BlY3RfYnlfSUQ6IGZ1bmN0aW9uKHByb3NwZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3NwZWN0SUQgPSBwcm9zcGVjdC5Qcm9zcGVjdElEXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdnZXQnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFkZEV2ZW50OiBmdW5jdGlvbihuRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5FdmVudCA9ICQucGFyYW0obkV2ZW50KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncG9zdCcsIGBBY3Rpdml0eWAsIG5FdmVudClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEVkaXRFdmVudDogZnVuY3Rpb24obXlFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgZXZlbnRJRCA9IEV2ZW50LkV2ZW50SUQ7IG5vdCB1c2VkXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBteUV2ZW50LnN1Ym5vdGVzIC8vIGFycmF5IHRocm93cyBlcnJvclxuICAgICAgICAgICAgICAgICAgICB2YXIgbXlFdmVudCA9ICQucGFyYW0obXlFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwdXQnLCBgQWN0aXZpdHlgLCBteUV2ZW50KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQWRkQ29udGFjdDogZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFjdCA9ICQucGFyYW0oY29udGFjdClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Bvc3QnLCBgQ29udGFjdGAsIGNvbnRhY3QpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBFZGl0Q29udGFjdDogZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFjdElEID0gY29udGFjdC5Db250YWN0SUQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250YWN0ID0gJC5wYXJhbShjb250YWN0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3B1dCcsIGBDb250YWN0LyR7Y29udGFjdElEfWAsIGNvbnRhY3QpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBZGRJc3N1ZTogZnVuY3Rpb24oaXNzdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzc3VlID0gJC5wYXJhbShpc3N1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwb3N0JywgYElzc3VlYCwgaXNzdWUpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBFZGl0SXNzdWU6IGZ1bmN0aW9uKGlzc3VlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaXNzdWVcIiwgaXNzdWUpXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc3N1ZUlEID0gaXNzdWUuSXNzdWVJRDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzc3VlID0gJC5wYXJhbShpc3N1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwdXQnLCBgSXNzdWUvJHtpc3N1ZUlEfWAsIGlzc3VlKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgRWRpdFByb3NwZWN0OiBmdW5jdGlvbihwcm9zcGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB2YXIgcHJvc3BlY3RJRCA9IHByb3NwZWN0LlByb3NwZWN0SUQ7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9zcGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coa2V5KVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3NwZWN0W2tleV0gPT0gJycgfHwgcHJvc3BlY3Rba2V5XSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJsYW5rIHZhbHVlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvc3BlY3Rba2V5XSA9IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9zcGVjdCA9ICQucGFyYW0ocHJvc3BlY3QpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncHV0JywgJycsIHByb3NwZWN0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbik7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdxdWVyeUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkbG9jYXRpb24sIHF1ZXJ5RmFjdG9yeSwgJHEsICRhbGVydCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInF1ZXJ5IENvbnRyb2xsZXJcIiwgJHN0YXRlUGFyYW1zKVxuICAgICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5yZXN1bHRzID0ge307XG4gICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IHtcbiAgICAgICAgICAgIGl0ZW1zUGVyUGFnZTogMTAsXG4gICAgICAgICAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlLFxuICAgICAgICAgICAgbWF4UGFnZXM6IDVcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUucXVlcnlOYW1lID0gXCJcIjtcbiAgICAgICAgJHNjb3BlLnByb2R1Y3RMaXN0ID0gW1xuICAgICAgICAgICAgXCJUcmlOZXRcIixcbiAgICAgICAgICAgIFwiUHJvZml0R3VhcmRcIlxuICAgICAgICBdXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFByb2R1Y3Q7XG4gICAgICAgICRzY29wZS5xdWVyeUxpc3Q7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFF1ZXJ5O1xuICAgICAgICAkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5RdWVyeUlEO1xuICAgICAgICAkc2NvcGUucGFyYW1zO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSBbXTtcbiAgICAgICAgJHNjb3BlLnN0YXRlcyA9IFt7XG4gICAgICAgICAgICB2YWx1ZTogJ0thbnNhcycsXG4gICAgICAgICAgICBsYWJlbDogJ0thbnNhcydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdBSycsXG4gICAgICAgICAgICBsYWJlbDogJ0Fya2Fuc2FzJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ01PJyxcbiAgICAgICAgICAgIGxhYmVsOiAnTWlzc291cmknXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnVFgnLFxuICAgICAgICAgICAgbGFiZWw6ICdUZXhhcydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdOWScsXG4gICAgICAgICAgICBsYWJlbDogJ05ldyBZb3JrJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ0NBJyxcbiAgICAgICAgICAgIGxhYmVsOiAnQ2FsaWZvcm5pYSdcbiAgICAgICAgfSwgXTtcbiAgICAgICAgJHNjb3BlLnF1ZXJ5UGFyYW1zID0ge1xuICAgICAgICAgICAgU3RhdGU6IFtdXG4gICAgICAgIH1cbiAgICAgICAgLy8gbmctbW9kZWxcbiAgICAgICAgJHNjb3BlLnNhdmVPYmplY3QgPSB7fTtcblxuICAgICAgICAvLyBwb3B1bGF0ZSBxdWVyeSBsaXN0O1xuICAgICAgICBxdWVyeUZhY3RvcnkuZ2V0UXVlcmllcygpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUucXVlcnlMaXN0ID0gZGF0YS5kYXRhXG4gICAgICAgIH0pXG5cblxuICAgICAgICAkc2NvcGUuZmluZFF1ZXJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkVycFwiLCAkc2NvcGUuc2VsZWN0ZWRRdWVyeSlcbiAgICAgICAgICAgIHF1ZXJ5RmFjdG9yeS5zaW5nbGVRdWVyeSgkc2NvcGUuc2VsZWN0ZWRRdWVyeS5RdWVyeUlEKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwic28gdGhlIHVzZXIgd2FudHMgdG8gc2VlLi4uXCIsIGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICQuZGVwYXJhbShkYXRhLmRhdGEuUGFyYW1TdHIpXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSBkYXRhLmRhdGEucm93cztcbiAgICAgICAgICAgICAgICAkc2NvcGUuUXVlcnlJRCA9IGRhdGEuZGF0YS5RdWVyeUlEO1xuICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRzUmV0dXJuZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFN0YXRlcyA9ICRzY29wZS5wYXJhbXMuU3RhdGU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLkNsaWNraW5nX3RoZV90YWJsZV9ub3dfcGVyZm9ybXNfaHR0cCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNhdmVPYmplY3QuTmFtZSA9IFwiTE9BREVEIEZST00gRFJPUERPV04gLS0gcXVlcnkgbmFtZSBpcyBcIiArIGRhdGEuZGF0YS5OYW1lO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkU3RhdGUgPSAnJztcblxuICAgICAgICAkc2NvcGUucXVlcnlTZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGNsZWFyaW5nIG9sZCByZXN1bHRzXG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXcgc2VhcmNoLi4ucGxlYXNlIHdhaXQuLi5cIilcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gc2V0IGVhY2ggdmFyaWFibGUgd2hlbiBsb2FkZWQuXG4gICAgICAgICAgICAkc2NvcGUucXVlcnlQYXJhbXMuU3RhdGUgPSAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXNcblxuICAgICAgICAgICAgLy8gVE9ETyBnZXQgUHJvZHVjdCBmcm9tIHNlbGVjdFxuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5UGFyYW1zLlByb2R1Y3RJRCA9IDFcblxuICAgICAgICAgICAgdmFyIHN1Ym1pdCA9IHF1ZXJ5RmFjdG9yeS5xdWVyeVJlc3VsdHMoJHNjb3BlLnF1ZXJ5UGFyYW1zKTtcbiAgICAgICAgICAgIHZhciBwcm9jZXNzID0gc3VibWl0LnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJHb3QgaXQuLi5cIiwgZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRzUmV0dXJuZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goJHNjb3BlLnF1ZXJ5UGFyYW1zKVxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT0gNDAxKVxuICAgICAgICAgICAgICAgIC8vIHVuYXV0aG9yaXplZFxuICAgICAgICAgICAgICAgIC8vICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI0MDEgaXMgaGFuZGxlZCBieSBJbnRlcmNlcHRvcnNcIilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUud2hvYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJXaG9hXCIpXG4gICAgICAgICAgICBxdWVyeUZhY3RvcnkudXBkYXRlUXVlcnlOYW1lKCRzY29wZS5RdWVyeUlEKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ09NUExFVEVcIilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5EZWxldGVQcm9zcGVjdCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0cy5mb3JFYWNoKChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGEuUHJvc3BlY3RJRCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICBhLlN0YXR1cyA/IGEuU3RhdHVzID0gMCA6IGEuU3RhdHVzID0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5DbGlja2luZ190aGVfdGFibGVfbm93X3BlcmZvcm1zX2h0dHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5RmFjdG9yeS51cGRhdGVRdWVyeVN0YXR1cygkc2NvcGUuUXVlcnlJRCwgaWQsIGEuU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNhdmVUZW1wbGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCRzY29wZS5DbGlja2luZ190aGVfdGFibGVfbm93X3BlcmZvcm1zX2h0dHApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZVwiKVxuICAgICAgICAgICAgICAgICRzY29wZS53aG9hKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdC5yb3dzID0gJHNjb3BlLnJlc3VsdHM7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9ICRsb2NhdGlvbi5zZWFyY2goKTtcbiAgICAgICAgICAgICAgICB2YXIgbW9kID0gJC5wYXJhbShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICRzY29wZS5zYXZlT2JqZWN0LlBhcmFtU3RyID0gbW9kO1xuICAgICAgICAgICAgICAgICRzY29wZS5zYXZlT2JqZWN0LlByb2R1Y3QgPSAxO1xuICAgICAgICAgICAgICAgIHF1ZXJ5RmFjdG9yeS5zYXZlUXVlcnkoJHNjb3BlLnNhdmVPYmplY3QpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lLmNhbXBhaWduLm5ldycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbXBhaWduSUQ6IHJlcy5kYXRhLlF1ZXJ5SURcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogZXJyLnN0YXR1cy50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogZXJyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZ29IcmVmID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2KVxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2tlZCBvbiBsb2FkO1xuICAgICAgICBpZiAoJHN0YXRlUGFyYW1zLlN0YXRlICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8gcmVhZCB0aGUgVVJMIGFuZCBzZXQgZWFjaCAkc2NvcGUgdmFyaWFibGVcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFN0YXRlcyA9IFskc3RhdGVQYXJhbXMuU3RhdGVdXG4gICAgICAgICAgICAkc2NvcGUucXVlcnlTZWFyY2goKTtcbiAgICAgICAgfVxuXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgncXVlcnlGYWN0b3J5Jyxcbi8vIG5vdyBSZXNlYXJjaCBGYWN0b3J5XG4gZnVuY3Rpb24gKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcXVlcnlSZXN1bHRzOmZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJHZXR0aW5nIHF1ZXJ5IHdpdGggcGFyYW1zIFwiLCB1cmwpXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gnLCB7cGFyYW1zOiB1cmwgfSApXG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZVF1ZXJ5OiBmdW5jdGlvbihyb3dJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnJylcbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlUHJvc3BlY3Q6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCcvYXBpL3Byb3NwZWN0cycsIHtwYXJhbXM6IHsnc3RhcnQnOiAnNScsICdlbmQnOiAnMjAnfSB9IClcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZVF1ZXJ5OiBmdW5jdGlvbihwcm9zcGVjdHMpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2F2ZSBxdWVyeSBQcm9zcGVjdHMgXCIsIHByb3NwZWN0cylcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gnLCAkLnBhcmFtKHByb3NwZWN0cykgKVxuICAgICAgICB9LFxuICAgICAgICBnZXRRdWVyaWVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoL2xpc3QnKVxuICAgICAgICB9LFxuICAgICAgICBzaW5nbGVRdWVyeTogZnVuY3Rpb24ocXVlcnlJRCl7XG4gICAgICAgICAgLy8gRVM2IFRlbXBsYXRlIFN0cmluZ3NcbiAgICAgICAgICAvLyByZXR1cm4gJGh0dHAuZ2V0KGAvYXBpL3F1ZXJ5LyR7cXVlcnlJRH1gKVxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoLycgKyBxdWVyeUlEKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlUXVlcnlOYW1lOiBmdW5jdGlvbihxdWVyeUlEKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgcXVlcnlJRCwgJC5wYXJhbSh7J05hbWUnOiAnQW5ndWxhcid9KSApXG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVF1ZXJ5U3RhdHVzOiBmdW5jdGlvbihRdWVyeUlELCBQcm9zcGVjdElELCBzdGF0dXMpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoLycgKyBRdWVyeUlEICsgJy8nICsgUHJvc3BlY3RJRCwgJC5wYXJhbSh7J1N0YXR1cyc6IHN0YXR1c30pIClcbiAgICAgICAgfVxuICAgIH07XG4gIH1cbik7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ3JvbGVzRmFjdG9yeScsXG4vLyBub3cgUmVzZWFyY2ggRmFjdG9yeVxuIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxpc3RSb2xlczpmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUm9sZXMnIClcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VXNlcnM6ZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2VycycpXG4gICAgICAgIH0sXG4gICAgICAgIGFkZFJvbGU6ZnVuY3Rpb24odXNlciwgcm9sZUlEKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMvJyt1c2VyKycvUm9sZXMvJytyb2xlSUQpXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdyb2xlc0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgcm9sZXNGYWN0b3J5KSB7XG4gIGNvbnNvbGUubG9nKFwiUm9sZXMgY29udHJvbGxlclwiKVxuXG4gICRzY29wZS5hdmFpbGFibGVSb2xlcztcbiAgcm9sZXNGYWN0b3J5Lmxpc3RSb2xlcygpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coXCJHb3Qgcm9sZXMuLi5cIiwgZGF0YS5kYXRhKVxuICAgICRzY29wZS5hdmFpbGFibGVSb2xlcyA9IGRhdGEuZGF0YTtcbiAgfSk7XG5cbiAgJHNjb3BlLmF2YWlsYWJsZVVzZXJzO1xuICByb2xlc0ZhY3RvcnkuZ2V0VXNlcnMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKFwiR290IHVzZXJzXCIsIGRhdGEuZGF0YSlcbiAgICAkc2NvcGUuYXZhaWxhYmxlVXNlcnMgPSBkYXRhLmRhdGEuVXNlckxpc3RcbiAgfSlcblxuXG4gICRzY29wZS5hZGRSb2xlID0gZnVuY3Rpb24obmFtZSwgcm9sZUlEKXtcbiAgICBjb25zb2xlLmxvZyhuYW1lLCByb2xlSUQpXG4gICAgcm9sZXNGYWN0b3J5LmFkZFJvbGUobmFtZSwgcm9sZUlEKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgY29uc29sZS5sb2coXCJEb25lXCIpXG4gICAgfSlcbiAgfVxuXG59KVxuIiwiXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdzZWFyY2hDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCwgc2VhcmNoRmFjdG9yeSwgJHRpbWVvdXQsICRsb2NhdGlvbikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvIHNlYXJjaFwiKVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaGJveFwiKS5mb2N1cygpO1xuICAgICAgICAkc2NvcGUucGFyYW1zT2JqID0ge1xuICAgICAgICAgICAgUHJvc3BlY3RJRDogJydcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5wcm9zcGVjdFR5cGUgPSBbe1xuICAgICAgICAgICAgdmFsdWU6ICdQJyxcbiAgICAgICAgICAgIGxhYmVsOiAnUHJvc3BlY3QnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnQScsXG4gICAgICAgICAgICBsYWJlbDogJ0FjdGl2ZSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdGJyxcbiAgICAgICAgICAgIGxhYmVsOiAnRm9ybWVyJ1xuICAgICAgICB9XTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkUHJvc3BlY3RUeXBlID0gJHNjb3BlLnByb3NwZWN0VHlwZS5tYXAodHlwZSA9PiB0eXBlLnZhbHVlKVxuICAgICAgICAkc2NvcGUuY3VzdG9tZXJUeXBlID0gW3tcbiAgICAgICAgICAgIHZhbHVlOiAnUCcsXG4gICAgICAgICAgICBsYWJlbDogJ1Byb2ZpdEd1YXJkJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ04nLFxuICAgICAgICAgICAgbGFiZWw6ICdOZWdvdGlhdG9yJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ1MnLFxuICAgICAgICAgICAgbGFiZWw6ICdTZXJ2aWNlcyBPbmx5J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ0cnLFxuICAgICAgICAgICAgbGFiZWw6ICdHb3Zlcm5tZW50J1xuICAgICAgICB9XTtcblxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRDdXN0b21lclR5cGUgPSAkc2NvcGUuY3VzdG9tZXJUeXBlLm1hcCh0eXBlID0+IHR5cGUudmFsdWUpXG5cblxuICAgICAgICAvLyAkc2NvcGUuc2VsZWN0ZWRDdXN0b21lclR5cGUgPSBbXG4gICAgICAgIC8vICAgICBmb3IgKHtcbiAgICAgICAgLy8gICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgb2YgJHNjb3BlLmN1c3RvbWVyVHlwZSkgdmFsdWVcbiAgICAgICAgLy8gXVxuXG4gICAgICAgICRzY29wZS5CRE1zID0gWydCRE0wMScsICdCRE0wMicsICdCRE0wMycsICdCRE0wNCddXG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJETSA9IFtcbiAgICAgICAgICAgIGZvciAoeCBvZiAkc2NvcGUuQkRNcykgeFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJwYXJhbXNcIiwgJHN0YXRlLnBhcmFtcylcblxuICAgICAgICB2YXIgc3RhdGVQYXJhbXMgPSAkc3RhdGUucGFyYW1zXG4gICAgICAgIE9iamVjdC5rZXlzKHN0YXRlUGFyYW1zKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmICghc3RhdGVQYXJhbXNba2V5XSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdGF0ZVBhcmFtc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdFwiLCBzdGF0ZVBhcmFtcylcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMoc3RhdGVQYXJhbXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaGVyZSdzIHBhcmFtcywgZ3V5cyEhIVwiKVxuICAgICAgICAgICAgc2VhcmNoRmFjdG9yeS5zZWFyY2goc3RhdGVQYXJhbXMpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxuICAgICAgICAgICAgICAgICRzY29wZS5zZWFyY2hSZXN1bHRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVtcHR5UmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cyA9IHJlcy5kYXRhLm1hcChzZWFyY2hSZXN1bHQgPT4gbmV3IFByb3NwZWN0KHNlYXJjaFJlc3VsdCkpXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlcy5kYXRhLmZvckVhY2goZnVuY3Rpb24ocHJvc3BlY3Qpe1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgJHNjb3BlLnNlYXJjaFJlc3VsdHMucHVzaCggbmV3IFByb3NwZWN0KHByb3NwZWN0KSApXG4gICAgICAgICAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVtcHR5UmVzdWx0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gZGF0YVwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuc2VhcmNoUmVzdWx0cylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIHN0YXRlIHBhcmFtcyBwcmVzZW50XCIpXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY29uZmlnID0ge1xuICAgICAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgICAgIGZpbGxMYXN0UGFnZTogZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zZWFyY2hSZXN1bHRzID0gW107XG4gICAgICAgICRzY29wZS5lbXB0eVJlc3VsdHMgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnNlYXJjaFN0cmluZyA9ICcnXG5cbiAgICAgICAgJHNjb3BlLnN0YXJ0U2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0P1wiLCAkc2NvcGUucGFyYW1zT2JqKVxuICAgICAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLnBhcmFtc09iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBhcmFtc09ialtrZXldID0gJHNjb3BlLnNlYXJjaFN0cmluZztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKCRzY29wZS5wYXJhbXNPYmopXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2VhcmNoT3B0aW9ucyA9IFtcbiAgICAgICAgICAgICdQcm9zcGVjdElEJyxcbiAgICAgICAgICAgICdDdXN0SUQnLFxuICAgICAgICAgICAgJ05DUERQJyxcbiAgICAgICAgICAgICdOUEknXG4gICAgICAgIF1cbiAgICAgICAgLy8gc2V0cyBkZWZhdWx0IHRvICdQcm9zcGVjdElEJ1xuICAgICAgICAkc2NvcGUuaXRlbSA9ICRzY29wZS5zZWFyY2hPcHRpb25zWzBdXG5cbiAgICAgICAgLy8gc2V0ICRzY29wZS5wYXJhbXNPYmogZnJvbSBkcm9wZG93blxuICAgICAgICAkc2NvcGUuc2VhcmNoU2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaGJveFwiKS5mb2N1cygpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLnBhcmFtc09iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlICRzY29wZS5wYXJhbXNPYmpba2V5XVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICRzY29wZS5wYXJhbXNPYmpbJHNjb3BlLml0ZW1dID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZ290b1Byb3NwZWN0ID0gZnVuY3Rpb24ocHJvc3BlY3RJRCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lLnByb3NwZWN0Jywge1xuICAgICAgICAgICAgICAgIFByb3NwZWN0SUQ6IHByb3NwZWN0SURcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuQ2l0eVN0YXRlWmlwX3N0cmluZztcblxuICAgICAgICAkc2NvcGUuZm5DaXR5U3RhdGVaaXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vcHJpb3JpdGl6ZXMgemlwLCB0aGVuIGNpdHksIGFuZCBsYXN0bHkgc3RhdGVcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdXG4gICAgICAgICAgICAkc2NvcGUuQ2l0eVN0YXRlWmlwX3N0cmluZy5zcGxpdCgnLCcpLmZvckVhY2goKHdvcmQpID0+IHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKCQudHJpbSh3b3JkKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcnJheSlcblxuXG4gICAgICAgICAgICAvL3R1cm5zIFwiTU8gNjQxMTBcIiBpbnRvIHR3byBzdHJpbmdzXG4gICAgICAgICAgICAvLyBvciBcIkthbnNhcyBDaXR5IDY0MTEwXCJcbiAgICAgICAgICAgIHZhciBub1NwYWNlcyA9IFtdO1xuICAgICAgICAgICAgYXJyYXkuZm9yRWFjaCgod29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIG5vU3BhY2VzLnB1c2god29yZC5zcGxpdCgnICcpKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHZhciB6aXAgPSBcIlwiO1xuICAgICAgICAgICAgYXJyYXkuZm9yRWFjaCgocGFydCkgPT4ge1xuICAgICAgICAgICAgICAgIHppcCA9IGV4dHJhY3RaaXAocGFydClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlppcD9cIiwgemlwKVxuICAgICAgICAgICAgaWYgKHppcC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XG4gICAgICAgICAgICAgICAgICAgICdaaXAnOiB6aXBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb21tYSBzZXBhcmF0ZWRcIiwgYXJyYXkpXG5cbiAgICAgICAgICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoemlwKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZW1vdmVkIHppcCBvYmplY3RcIiwgYXJyYXkpXG5cbiAgICAgICAgICAgIC8vIGlmIHN0cmluZyBpcyA9PSB0aGFuIDIgaXQncyBzdGF0ZVxuICAgICAgICAgICAgdmFyIHN0YXRlID0gJydcbiAgICAgICAgICAgIGFycmF5LmZvckVhY2goKHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID09IDIpIHN0YXRlID0gc3RyaW5nXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXRlXCIsIHN0YXRlKVxuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVtb3ZlZCBzdGF0ZSBvYmplY3RcIiwgYXJyYXkpXG5cbiAgICAgICAgICAgIC8vIGlmIG5vIHppcCwgc2VhcmNoIGJ5IGNpdHlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmluYWwgY2hlY2tcIiwgYXJyYXkpXG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCAmJiB6aXAubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFsbCB3ZSd2ZSBnb3QgbGVmdCBpcyBDaXR5XCIpXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XG4gICAgICAgICAgICAgICAgICAgICdDaXR5JzogYXJyYXlbMF1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBubyB6aXAgb3IgY2l0eSwgc2VhcmNoIGJ5IHN0YXRlXG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09IDAgJiYgemlwLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh7XG4gICAgICAgICAgICAgICAgICAgICdTdGF0ZSc6IHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBcIlByb3NwZWN0VHlwZVwiOiAkc2NvcGUuc2VsZWN0ZWRQcm9zcGVjdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIFwiQ3VzdG9tZXJUeXBlXCI6ICRzY29wZS5zZWxlY3RlZEN1c3RvbWVyVHlwZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RaaXAoc3RyKSB7XG4gICAgICAgICAgICAgICAgLy90aGUgcmVndWxhciBleHByZXNzaW9uIGJlbG93IGlzIGZvciA1IGRpZ2l0IFVTIFpJUCBjb2RlLCA1IGRpZ2l0IFVTIFpJUCBjb2RlICsgNCxcbiAgICAgICAgICAgICAgICAvL2FuZCA2IGRpZ2l0IGFscGhhbnVtZXJpYyBDYW5hZGlhbiBQb3N0YWwgQ29kZVxuICAgICAgICAgICAgICAgIHZhciByZSA9IC9cXGR7NX0tXFxkezR9fFxcZHs1fXxbQS1aXVxcZFtBLVpdIFxcZFtBLVpdXFxkL1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHN0cjtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSByZS5leGVjKGlucHV0KVxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbiIsIi8vIGFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4vLyAuZmFjdG9yeSgnc2VhcmNoRmFjdG9yeScsXG4vLyAgZnVuY3Rpb24gKCRodHRwKSB7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgc2VhcmNoOiBmdW5jdGlvbihwYXJhbXNPYmope1xuLy8gICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Byb3NwZWN0Jywge3BhcmFtczogcGFyYW1zT2JqIH0gKVxuLy8gICAgICAgICB9XG4vLyAgICAgfTtcbi8vICAgfVxuLy8gKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdzZWFyY2hGYWN0b3J5JyxcbiAgICBmdW5jdGlvbiAoJGh0dHAsICRsb2NhdGlvbikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlYXJjaDogZnVuY3Rpb24ocGFyYW1zT2JqKXtcbiAgICAgICAgICAgIHZhciBib3Jyb3dlZFRpbWUgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdChcInNlYXJjaFwiKVsxXVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUHJvc3BlY3QnICsgYm9ycm93ZWRUaW1lIClcbiAgICAgICAgfVxuICAgIH07XG4gIH1cbik7XG4iLCIvLyBjbGFzcyBUYXNrIHtcbi8vICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbi8vICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuLy8gICAgIH1cbi8vIH1cbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLnNlcnZpY2UoJ1Rhc2tTZXJ2aWNlJywgZnVuY3Rpb24oTG9naW5TZXJ2aWNlLCB0YXNrRmFjdG9yeSkge1xuICAgICAgICBjbGFzcyBUYXNrIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgICAgICB0aGlzLkR1ZURhdGUgPSBtb21lbnQob2JqLkNvbXBsZXRpb25EYXRlVGltZSkuZm9ybWF0KFwibGxcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNsYXNzIFRhc2tMaXN0IGV4dGVuZHMgQXJyYXkge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkKGFycmF5KSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKG5ldyBUYXNrKGFycmF5W2ldKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmUoYWN0aXZpdHlJRCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaWNlKHRoaXMubWFwKHRhc2tzID0+IHRhc2tzLkFjdGl2aXR5SUQpLmluZGV4T2YoYWN0aXZpdHlJRCksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlKEFjdGl2aXR5SUQ6IG51bWJlciwgU3RhdHVzOiBudW1iZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3RoaXMubWFwKHRhc2tzID0+IHRhc2tzLkFjdGl2aXR5SUQpLmluZGV4T2YoQWN0aXZpdHlJRCldLlN0YXR1cyA9IFN0YXR1cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHB1c2goLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZHVwbGljYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB0aGlzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3NbaV0uQWN0aXZpdHlJRCA9PSB0aGlzW2lpXS5BY3Rpdml0eUlEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWR1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNoaWZ0KG5ldyBUYXNrKGFyZ3NbaV0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjbGFzcyBVc2VyTGlzdCBleHRlbmRzIEFycmF5IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHB1c2goLi4uYXJncykge1xuICAgICAgICAgICAgICAgIC8vIHVuaXF1ZSBhcnJheTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGR1cGxpY2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgdGhpcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzW2ldLlVzZXJJRCA9PSB0aGlzW2lpXS5Vc2VySUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2hpZnQobmV3IFVzZXIoYXJnc1tpXSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlKFVzZXJJRCkge1xuICAgICAgICAgICAgICAgIGlmIChMb2dpblNlcnZpY2UuY29va2llX3VzZXIoKSA9PSBVc2VySUQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuJ3QgcmVtb3ZlIHlvdXJzZWxmXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UodGhpcy5tYXAodXNlciA9PiB1c2VyLlVzZXJJRCkuaW5kZXhPZihVc2VySUQpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjbGFzcyBVc2VyIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgICAgICB0aGlzLlRhc2sgPSBcImJsYW5rXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVwZGF0ZSh1c2VyKSB7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJVcGRhdGUgdGhpcyB1c2VyLi4uP1wiLCB1c2VyKVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9XG5cbiAgICAgICAgY2xhc3MgVGFza1NlcnZpY2Uge1xuICAgICAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5UYXNrTGlzdCA9IG5ldyBUYXNrTGlzdCgpXG4gICAgICAgICAgICAgICAgdGhpcy5Vc2VyTGlzdCA9IG5ldyBVc2VyTGlzdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuRGVwYXJ0bWVudHMgPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLkdyb3VwcyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRmluZFVzZXIoVXNlcklEOiBudW1iZXIpOiBPYmplY3Qge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRmluZCB1c2VyIGJ5IHVzZXIgSURcIilcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5Hcm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1trZXldLmZvckVhY2goZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkeCA9IHNlbGYuR3JvdXBzW2tleV0ubWFwKHVzZXIgPT4gdXNlci5Vc2VySUQpLmluZGV4T2YoVXNlcklEKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkeCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gc2VsZi5Hcm91cHNba2V5XVtpZHhdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRhc2tTZXJ2aWNlID0gbmV3IFRhc2tTZXJ2aWNlKCk7XG4gICAgICAgIC8vIHRvZG8gLT4gdGhpcyBpcyBhIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFycmF5L3Njb3BlL21vZGVsXG4gICAgICAgIHRhc2tGYWN0b3J5LmdldFVzZXJzKCkudGhlbihmdW5jdGlvbih1c2Vycykge1xuICAgICAgICAgICAgdGFza1NlcnZpY2UuRGVwYXJ0bWVudHMucHVzaCguLi5fLmNoYWluKHVzZXJzLmRhdGEuVXNlckxpc3QpXG4gICAgICAgICAgICAgICAgLnBsdWNrKCdEZXBhcnRtZW50JylcbiAgICAgICAgICAgICAgICAudW5pcSgpXG4gICAgICAgICAgICAgICAgLnZhbHVlKCkpXG4gICAgICAgICAgICB2YXIgZ3JvdXBzID0gXy5ncm91cEJ5KHVzZXJzLmRhdGEuVXNlckxpc3QsIFwiRGVwYXJ0bWVudFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBncm91cHMpIHtcbiAgICAgICAgICAgICAgICB0YXNrU2VydmljZS5Hcm91cHNba2V5XSA9IGdyb3Vwc1trZXldO1xuICAgICAgICAgICAgICAgIHRhc2tTZXJ2aWNlLkdyb3Vwc1trZXldLmZvckVhY2goeCA9PiB4Lm9ubGluZSA9IGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0YXNrU2VydmljZS5Hcm91cHNba2V5XS5mb3JFYWNoKHggPT4geC5pbWcgPSBwc3VlZG9SYW5kb20oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgZnVuY3Rpb24gcHN1ZWRvUmFuZG9tKCkge1xuICAgICAgICAgICAgdmFyIGxhc3RSZXN1bHQgPSAxO1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gMTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAxXG4gICAgICAgICAgICBpZiAoY291bnQgPCAzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDQgLSBsYXN0UmVzdWx0KSArIGNvdW50KVxuICAgICAgICAgICAgICAgIGxhc3RSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3VudCA9IDBcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDQgLSBsYXN0UmVzdWx0KSArIGxhc3RSZXN1bHQpXG4gICAgICAgICAgICAgICAgbGFzdFJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFza1NlcnZpY2U7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5kaXJlY3RpdmUoJ3Rhc2tzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJywgLy9FID0gZWxlbWVudCwgQSA9IGF0dHJpYnV0ZSwgQyA9IGNsYXNzLCBNID0gY29tbWVudCAgICAgICAgIFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAvL0AgcmVhZHMgdGhlIGF0dHJpYnV0ZSB2YWx1ZSwgPSBwcm92aWRlcyB0d28td2F5IGJpbmRpbmcsICYgd29ya3Mgd2l0aCBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gdGVtcGxhdGU6ICc8ZGl2Pnt7IG15VmFsIH19PC9kaXY+JyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL3Rhc2tzL3Rhc2tzLnRtcGwuaHRtbCcsXG4gICAgICAgICAgICAvLyBjb250cm9sbGVyOiBjb250cm9sbGVyRnVuY3Rpb24sIC8vRW1iZWQgYSBjdXN0b20gY29udHJvbGxlciBpbiB0aGUgZGlyZWN0aXZlXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7fSAvL0RPTSBtYW5pcHVsYXRpb25cbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgnaHViRmFjdG9yeScsIGZ1bmN0aW9uKCRyb290U2NvcGUsIEh1YiwgJHEsIFRhc2tTZXJ2aWNlKSB7XG5cbiAgICAgICAgLy9kZWNsYXJpbmcgdGhlIGh1YiBjb25uZWN0aW9uXG4gICAgICAgIHZhciBodWIgPSBuZXcgSHViKCdhY3Rpdml0eVF1ZXVlSHViJywge1xuICAgICAgICAgICAgLy8gdmFyIGh1YiA9IG5ldyBIdWIoJ21vdmVTaGFwZUh1YicsIHtcblxuICAgICAgICAgICAgLy9jbGllbnQgc2lkZSBtZXRob2RzXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgICAgICAgICAndGFza1dvcmtpbmcnOiBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYSB0YXNrIHN0YXR1cyB3YXMgY2hhbmdlZC4uLi5cIiwgaW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXNrID0gVGFza1NlcnZpY2UuVGFza0xpc3QuZmluZCh4ID0+IHguQWN0aXZpdHlJRCA9PSBpbmZvLkFjdGl2aXR5SUQpXG4gICAgICAgICAgICAgICAgICAgIHRhc2suU3RhdHVzID0gaW5mby5TdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLkZpbmRVc2VyKGluZm8uVXNlcklEKS5UYXNrID0gdGFza1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ3VzZXJKb2luZWQnOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBqb2luZWRcIiwgdXNlcilcbiAgICAgICAgICAgICAgICAgICAgVGFza1NlcnZpY2UuVXNlckxpc3QucHVzaCh1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICd1c2VyTGVmdCc6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGxlZnRcIiwgdXNlcilcbiAgICAgICAgICAgICAgICAgICAgVGFza1NlcnZpY2UuVXNlckxpc3QucmVtb3ZlKHVzZXIuVXNlcklEKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyByb290UGF0aDogXCJodHRwOi8vMTAuMS4xLjIyNi9zaWduYWxyXCIsXG4gICAgICAgICAgICByb290UGF0aDogXCJodHRwOi8vMTAuMS4xLjExODo4MDAwL3NpZ25hbHJcIixcblxuICAgICAgICAgICAgLy9zZXJ2ZXIgc2lkZSBtZXRob2RzXG4gICAgICAgICAgICBtZXRob2RzOiBbJ0dldFRhc2tzJywgJ2NoYW5nZVRhc2tTdGF0dXNEJywgJ1dob0FtSScsICdDaGFuZ2VUYXNrU3RhdHVzJywgJ1RpbWVVbnRpbE5leHRGaWxsJ10sXG5cbiAgICAgICAgICAgIC8vcXVlcnkgcGFyYW1zIHNlbnQgb24gaW5pdGlhbCBjb25uZWN0aW9uXG4gICAgICAgICAgICAvLyBxdWVyeVBhcmFtczp7XG4gICAgICAgICAgICAvLyAgICAgJ3Rva2VuJzogJ2V4YW1wbGV0b2tlbidcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIHZhciBUaW1lVW50aWxOZXh0RmlsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImdldCB0aW1lIHVudGlsIG5leHQgZmlsbFwiKVxuICAgICAgICAgICAgaHViLlRpbWVVbnRpbE5leHRGaWxsKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXNcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIGh1Yi5pbml0KCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGlmIChyZXMuX3N1YnNjcmliZWRUb0h1YnMpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy9tb3ZlU2hhcGVIdWIuaW52b2tlKCd1cGRhdGVNb2RlbCcsIHNoYXBlTW9kZWwpXG5cbiAgICAgICAgdmFyIGdldEN1cnJlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQgY3VycmVudFwiKVxuICAgICAgICAgICAgaHViLmhlbGxvX0ltX0Nvbm5lY3RlZChzaGFwZU1vZGVsKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdldFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJnZXQgV2hvQW1JXCIpXG4gICAgICAgICAgICBodWIuV2hvQW1JKFwicGJham9qXCIpLnRoZW4oZnVuY3Rpb24odXNlcnMpIHtcbiAgICAgICAgICAgICAgICBUYXNrU2VydmljZS5Vc2VyTGlzdC5wdXNoKC4uLnVzZXJzKTtcbiAgICAgICAgICAgICAgICB1c2Vycy5mb3JFYWNoKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgVGFza1NlcnZpY2UuRmluZFVzZXIodXNlci5Vc2VySUQpLm9ubGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQ2hhbmdlVGFza1N0YXR1cyA9IGZ1bmN0aW9uKGFjdGl2aXR5SUQsIHN0YXR1cykge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBodWIuQ2hhbmdlVGFza1N0YXR1cyhhY3Rpdml0eUlELCBzdGF0dXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZSBjaGFuZ2luZyBzdGF0dXNcIilcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgR2V0VGFza3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0dGluZyB0YXNrc1wiKVxuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBodWIuR2V0VGFza3MoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgIG1hcDogZ2V0Q3VycmVudCxcbiAgICAgICAgICAgICAgICBXaG9BbUk6IGdldFVzZXIsXG4gICAgICAgICAgICAgICAgR2V0VGFza3M6IEdldFRhc2tzLFxuICAgICAgICAgICAgICAgIENoYW5nZVRhc2tTdGF0dXM6IENoYW5nZVRhc2tTdGF0dXMsXG4gICAgICAgICAgICAgICAgVGltZVVudGlsTmV4dEZpbGw6IFRpbWVVbnRpbE5leHRGaWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVmZXJyZWQucHJvbWlzZVxuICAgICAgICBdXG5cblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcigndGFza0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsIFRhc2tTZXJ2aWNlLCAkc3RhdGUsIGh1YkZhY3RvcnksICRpbnRlcnZhbCwgJGNvbXBpbGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJUYXNrIENvbnRyb2xsZXIgbG9hZGVkXCIpXG4gICAgICAgICRzY29wZS50aW1lO1xuICAgICAgICAkc2NvcGUudGFza3MgPSBUYXNrU2VydmljZS5UYXNrTGlzdDtcbiAgICAgICAgJHNjb3BlLnVzZXJzID0gVGFza1NlcnZpY2UuVXNlckxpc3Q7XG4gICAgICAgICRzY29wZS5kZXBhcnRtZW50cyA9IFRhc2tTZXJ2aWNlLkRlcGFydG1lbnRzO1xuXG4gICAgICAgICRzY29wZS5kZXBDb2xsYXBzZU9ubGluZSA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5kZXBDb2xsYXBzZSA9IHRydWU7XG5cbiAgICAgICAgJHNjb3BlLmdyb3VwcyA9IFRhc2tTZXJ2aWNlLkdyb3VwcztcblxuICAgICAgICAkc2NvcGUuY29uZmlnID0ge1xuICAgICAgICAgICAgaXRlbXNQZXJQYWdlOiA1LFxuICAgICAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIFttZXRob2RzLCBpbml0XSA9IGh1YkZhY3Rvcnk7XG4gICAgICAgIGluaXQudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG91YmxlIGRvbmVcIilcbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHVzZXJuYW1lIHdpdGggc2VydmVyXG4gICAgICAgICAgICBtZXRob2RzLldob0FtSSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0b2xkIHNlcnZlciB3aG8gd2UgYXJlXCIpXG4gICAgICAgICAgICAgICAgbWV0aG9kcy5HZXRUYXNrcygpLnRoZW4oZnVuY3Rpb24odGFza3MpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgdGFza3NcIiwgdGFza3MpXG4gICAgICAgICAgICAgICAgICAgIC8vICRzY29wZS50YXNrcy5hZGQocmVzKVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGFza3MucHVzaCguLi50YXNrcylcbiAgICAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRhc2tzLnB1c2goLi4udGFza3MpXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuVGltZVVudGlsTmV4dEZpbGwoKS50aGVuKGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IHRpbWVcIiwgdGltZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50aW1lID0gdGltZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNjcmFua2VkXCIpLmFwcGVuZCgnPHRpbWVyIGVuZC10aW1lPVwidGltZVwiPnt7aG91cnN9fSBob3Vycywge3ttaW51dGVzfX0gbWludXRlcywge3tzZWNvbmRzfX0gc2Vjb25kcy48L3RpbWVyPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUoJChcIiNjcmFua2VkXCIpKSgkc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRnVkZ2VcIilcbiAgICAgICAgfSlcblxuICAgICAgICAkc2NvcGUuc2hvd1Rhc2tzID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5wb3BUYXNrcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnNob3dUYXNrcyA9ICEkc2NvcGUuc2hvd1Rhc2tzID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNob3dVc2VycyA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUucG9wVXNlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2hvdyB1c2Vyc1wiKVxuICAgICAgICAgICAgJHNjb3BlLnNob3dVc2VycyA9ICEkc2NvcGUuc2hvd1VzZXJzID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNob3dUYXNrT3B0aW9ucyA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUucHJvc3BlY3RJRDtcbiAgICAgICAgJHNjb3BlLm5hdmlnYXRlID0gZnVuY3Rpb24ocHJvc3BlY3RJRDogbnVtYmVyLCBTdGF0dXM6IG51bWJlcikge1xuICAgICAgICAgICAgaWYgKFN0YXR1cyA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGdvLCBpdCdzIGJlaW5nIHdvcmtlZCBhbHJlYWR5XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLnNob3dUYXNrT3B0aW9ucyA9IHRydWU7XG4gICAgICAgICAgICAkc2NvcGUucHJvc3BlY3RJRCA9IHByb3NwZWN0SURcbiAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZS5wcm9zcGVjdCcsIHtcbiAgICAgICAgICAgICAgICBQcm9zcGVjdElEOiBwcm9zcGVjdElEXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLkNoYW5nZVRhc2tTdGF0dXMgPSBmdW5jdGlvbihhY3Rpdml0eUlELCBzdGF0dXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aXZpdHkgaWRcIiwgYWN0aXZpdHlJRCwgXCJzdGF0dXNcIiwgc3RhdHVzKVxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXR1cy0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWV0aG9kcy5DaGFuZ2VUYXNrU3RhdHVzKGFjdGl2aXR5SUQsIHN0YXR1cylcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS51c2VyTWV0aG9kID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyXCIsIHVzZXIpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RvcCA9ICRpbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGlmIHRpbWUgc29tZXRoaW5nIHNvbWV0aGluZ1xuICAgICAgICAgICAgaWYgKG1vbWVudCgkc2NvcGUudGltZSkuaXNCZWZvcmUobW9tZW50KG5ldyBEYXRlKSkpIHtcbiAgICAgICAgICAgICAgICBtZXRob2RzLkdldFRhc2tzKCkudGhlbihmdW5jdGlvbih0YXNrcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdFwiLCB0YXNrcylcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRhc2tzLnB1c2goLi4udGFza3MpXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMuVGltZVVudGlsTmV4dEZpbGwoKS50aGVuKGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IHRpbWVcIiwgdGltZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50aW1lID0gdGltZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNjcmFua2VkXCIpLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiI2NyYW5rZWRcIikuYXBwZW5kKCc8dGltZXIgZW5kLXRpbWU9XCJ0aW1lXCI+e3tob3Vyc319IGhvdXJzLCB7e21pbnV0ZXN9fSBtaW51dGVzLCB7e3NlY29uZHN9fSBzZWNvbmRzLjwvdGltZXI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29tcGlsZSgkKFwiI2NyYW5rZWRcIikpKCRzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCAxMDAwMCk7XG5cbiAgICAgICAgJHNjb3BlLnN0b3BGaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHN0b3ApKSB7XG4gICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChzdG9wKTtcbiAgICAgICAgICAgICAgICBzdG9wID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgaW50ZXJ2YWwgaXMgZGVzdHJveWVkIHRvb1xuICAgICAgICAgICAgJHNjb3BlLnN0b3BGaWdodCgpO1xuICAgICAgICB9KTtcbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgndGFza0ZhY3RvcnknLFxuICAgICAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRVc2VyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3VzZXJzJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiIsInZhciAkaHRtbCA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaHRtbCcpWzBdKTtcblxuYW5ndWxhci5lbGVtZW50KCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgYW5ndWxhci5yZXN1bWVCb290c3RyYXAoW2FwcFsnbmFtZSddXSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==