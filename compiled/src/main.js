"use strict";
var app = angular.module('uiRouterSample', ['ui.router', 'ngAnimate', 'ngResource', 'ngCookies', 'mgcrea.ngStrap', 'ngSanitize', 'chieffancypants.loadingBar', 'angular-table', 'ngTagsInput', 'xeditable', 'ui.calendar', 'angularFileUpload', 'SignalR']).run(['$rootScope', '$state', '$stateParams', '$cookies', "$http", 'LoginService', function($rootScope, $state, $stateParams, $cookies, $http, LoginService) {
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
});

"use strict";
angular.module('uiRouterSample').directive('barsChart', function($parse) {
  var directiveDefinitionObject = {
    restrict: 'E',
    replace: false,
    scope: {data: '=chartData'},
    link: function(scope, element, attrs) {
      var chart = d3.select(element[0]);
      chart.append("div").attr("class", "chart").selectAll('div').data(scope.data).enter().append("div").transition().ease("elastic").style("width", function(d) {
        return d + "%";
      }).text(function(d) {
        return d + "%";
      });
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
          }).data(scope.data).style("width", function(d) {
            return d + "%";
          });
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
});

"use strict";
angular.module('uiRouterSample').factory('hubFactory', function($rootScope, Hub, $q, TaskService) {
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
    methods: ['GetTasks', 'changeTaskStatusD', 'WhoAmI', 'ChangeTaskStatus']
  });
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
    ChangeTaskStatus: ChangeTaskStatus
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
        this.unshift(new Task(args[$traceurRuntime.toProperty(i)]));
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
          this.unshift(args[$traceurRuntime.toProperty(i)]);
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
  var TaskService = function TaskService(obj) {
    this.TaskList = new TaskList();
    this.UserList = new UserList();
    this.Departments = [];
    this.Groups = {};
  };
  ($traceurRuntime.createClass)(TaskService, {}, {});
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
    }
  });
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
angular.module('uiRouterSample').controller('taskController', function($scope, TaskService, $state, hubFactory) {
  console.log("Task Controller loaded");
  $scope.tasks = TaskService.TaskList;
  $scope.users = TaskService.UserList;
  $scope.departments = TaskService.Departments;
  $scope.depCollapseOnline = false;
  $scope.depCollapse = true;
  $scope.groups = TaskService.Groups;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2FwcC5qcyIsImpzL2VzNi5qcyIsImpzL2Fib3V0L2NvbnRyb2xsZXIuanMiLCJqcy9hYm91dC9kaXJlY3RpdmUuanMiLCJqcy9hYm91dC9mYWN0b3J5LmpzIiwianMvYWN0aXZpdHkvYWN0aXZpdHlDbGFzcy5qcyIsImpzL2FjdGl2aXR5L2FjdGl2aXR5Q29udHJvbGxlci5qcyIsImpzL2FjdGl2aXR5L2ZhY3RvcnkuanMiLCJqcy9hZG1pbi9hZG1pbkNvbnRyb2xsZXIuanMiLCJqcy9jYW1wYWlnbi9jYW1wYWlnbkNvbnRyb2xsZXIuanMiLCJqcy9jYW1wYWlnbi9jYW1wYWlnbkRldGFpbHNDb250cm9sbGVyLmpzIiwianMvY2FtcGFpZ24vY2FtcGFpZ25GYWN0b3J5LmpzIiwianMvY2FtcGFpZ24vbmV3Q2FtcGFpZ25Db250cm9sbGVyLmpzIiwianMvY2xhc3Nlcy9QZW5kaW5nQ2FtcGFpZ24uanMiLCJqcy9jbGFzc2VzL2FjdGl2aXRpZXMuanMiLCJqcy9jbGFzc2VzL2NhbXBhaWduLmpzIiwianMvY2xhc3Nlcy9jdXN0b21lci5qcyIsImpzL2tpbS9raW1Db250cm9sbGVyLmpzIiwianMvbGFuZGluZy9sYW5kaW5nQ29udHJvbGxlci5qcyIsImpzL2xhbmRpbmcvbGFuZGluZ0ZhY3RvcnkuanMiLCJqcy9sb2dpbi9Mb2dpblNlcnZpY2UuanMiLCJqcy9sb2dpbi9sb2dpbkNvbnRyb2xsZXIuanMiLCJqcy9sb2dpbi9sb2dpbkZhY3RvcnkuanMiLCJqcy9taXNjL2FsZXJ0Q29udHJvbGxlci5qcyIsImpzL21pc2MvY29sbGFwc2UuanMiLCJqcy9taXNjL2ZpbHRlci5qcyIsImpzL21pc2MvbmF2YmFyX3NlYXJjaC5qcyIsImpzL21pc2MvcGFnaW5hdGUuanMiLCJqcy9taXNjL3NpZ25hbHIuanMiLCJqcy9wcm9zcGVjdC9wcm9zcGVjdENsYXNzLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RDb250cm9sbGVyLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RGYWN0b3J5LmpzIiwianMvcXVlcnkvcXVlcnlDb250cm9sbGVyLmpzIiwianMvcXVlcnkvcXVlcnlGYWN0b3J5LmpzIiwianMvcm9sZXMvcm9sZUZhY3RvcnkuanMiLCJqcy9yb2xlcy9yb2xlc0NvbnRyb2xsZXIuanMiLCJqcy9zYW1wbGVzb2NrZXQvb25lLmpzIiwianMvc2VhcmNoL3NlYXJjaENvbnRyb2xsZXIuanMiLCJqcy9zZWFyY2gvc2VhcmNoRmFjdG9yeS5qcyIsImpzL3Rhc2tzL1Rhc2tDbGFzcy5qcyIsImpzL3Rhc2tzL1Rhc2tTZXJ2aWNlLmpzIiwianMvdGFza3MvZGlyZWN0aXZlcy5qcyIsImpzL3Rhc2tzL3Rhc2tDb250cm9sbGVyLmpzIiwianMvdGFza3MvdGFza0ZhY3RvcnkuanMiLCJqcy94L3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgLy8gJ25nTW9ja0UyRScsXG4gICAgJ25nUmVzb3VyY2UnLFxuICAgICduZ0Nvb2tpZXMnLFxuICAgICdtZ2NyZWEubmdTdHJhcCcsXG4gICAgJ25nU2FuaXRpemUnLFxuICAgICdjaGllZmZhbmN5cGFudHMubG9hZGluZ0JhcicsXG4gICAgJ2FuZ3VsYXItdGFibGUnLFxuICAgICduZ1RhZ3NJbnB1dCcsXG4gICAgJ3hlZGl0YWJsZScsXG4gICAgJ3VpLmNhbGVuZGFyJyxcbiAgICAnYW5ndWxhckZpbGVVcGxvYWQnLFxuICAgICdTaWduYWxSJ1xuXSlcblxuLnJ1bihcbiAgICBbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICckY29va2llcycsIFwiJGh0dHBcIiwgJ0xvZ2luU2VydmljZScsXG4gICAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkY29va2llcywgJGh0dHAsIExvZ2luU2VydmljZSkge1xuXG5cbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYS2V5J10gPSAkY29va2llcy54a2V5O1xuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5wdXQgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5wb3N0ID0ge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLnRpbWVvdXQgPSAxMDtcbiAgICAgICAgICAgICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kc3RhdGVQYXJhbXMgPSAkc3RhdGVQYXJhbXM7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2dlZEluID0gdHJ1ZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgZ3JvdXA6IFwiVW5kZWZpbmVkXCIsXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6ICRjb29raWVzLnVzZXJpZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGlmICgkY29va2llcy5wYmF1c2VyKSB7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJ1c2VyXCIsICRjb29raWVzLnBiYXVzZXIpXG4gICAgICAgICAgICAvLyAgICAgTG9naW5TZXJ2aWNlLnNldFVzZXIoJGNvb2tpZXMucGJhdXNlcilcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgIF1cbilcblxuXG4uY29uZmlnKFxuICAgIFsnJHN0YXRlUHJvdmlkZXInLCAnJHByb3ZpZGUnLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJyRodHRwUHJvdmlkZXInLFxuICAgICAgICBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHByb3ZpZGUsICR1cmxSb3V0ZXJQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gICAgQXV0aCBJbnRlcmNlcHRvciAgICAgLy9cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgICRwcm92aWRlLmZhY3RvcnkoJ215SHR0cEludGVyY2VwdG9yJywgZnVuY3Rpb24oJHEsICRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nIG9uIHN1Y2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyBvbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBpbnRlcmNlcHRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbmplY3Rvci5nZXQoJyRzdGF0ZScpLnRyYW5zaXRpb25UbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCgnYWxlcnRGYWN0b3J5JykuYWxlcnRzKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkcHJvdmlkZS5mYWN0b3J5KCd0aW1lb3V0SHR0cEludGVyY2VwdCcsIGZ1bmN0aW9uKCRxLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3JlcXVlc3QnOiBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy50aW1lb3V0ID0gMzAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ215SHR0cEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICAvLyAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCd0aW1lb3V0SHR0cEludGVyY2VwdCcpO1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyBSZWRpcmVjdHMgYW5kIE90aGVyd2lzZSAvL1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLy8gVXNlICR1cmxSb3V0ZXJQcm92aWRlciB0byBjb25maWd1cmUgYW55IHJlZGlyZWN0cyAod2hlbikgYW5kIGludmFsaWQgdXJscyAob3RoZXJ3aXNlKS5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuXG4gICAgICAgICAgICAvLyBUaGUgYHdoZW5gIG1ldGhvZCBzYXlzIGlmIHRoZSB1cmwgaXMgZXZlciB0aGUgMXN0IHBhcmFtLCB0aGVuIHJlZGlyZWN0IHRvIHRoZSAybmQgcGFyYW1cbiAgICAgICAgICAgIC8vIEhlcmUgd2UgYXJlIGp1c3Qgc2V0dGluZyB1cCBzb21lIGNvbnZlbmllbmNlIHVybHMuXG4gICAgICAgICAgICAud2hlbignL2M/aWQnLCAnL2NvbnRhY3RzLzppZCcpXG4gICAgICAgICAgICAgICAgLndoZW4oJy91c2VyLzppZCcsICcvY29udGFjdHMvOmlkJylcblxuICAgICAgICAgICAgLy8gSWYgdGhlIHVybCBpcyBldmVyIGludmFsaWQsIGUuZy4gJy9hc2RmJywgdGhlbiByZWRpcmVjdCB0byAnLycgYWthIHRoZSBob21lIHN0YXRlXG4gICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFN0YXRlIENvbmZpZ3VyYXRpb25zIC8vXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvLyBVc2UgJHN0YXRlUHJvdmlkZXIgdG8gY29uZmlndXJlIHlvdXIgc3RhdGVzLlxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcblxuICAgICAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvTG9naW4uaHRtbCdcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIEhvbWUgLy9cbiAgICAgICAgICAgIC8vLy8vLy8vLy9cblxuICAgICAgICAgICAgLnN0YXRlKFwiaG9tZVwiLCB7XG5cbiAgICAgICAgICAgICAgICAvLyBVc2UgYSB1cmwgb2YgXCIvXCIgdG8gc2V0IGEgc3RhdGVzIGFzIHRoZSBcImluZGV4XCIuXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9cIixcblxuICAgICAgICAgICAgICAgIC8vIGNvbnRyb2xsZXI6ICdsYW5kaW5nQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgLy8gdGVtcGxhdGVVcmw6ICd2aWV3cy9ub3RzdXJlLmh0bWwnXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTbyB0aGlzIG9uZSBpcyB0YXJnZXRpbmcgdGhlIHVubmFtZWQgdmlldyB3aXRoaW4gdGhlIHBhcmVudCBzdGF0ZSdzIHRlbXBsYXRlLlxuICAgICAgICAgICAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9ub3RzdXJlLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xhbmRpbmdDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgb25lIGlzIHRhcmdldGluZyB0aGUgdWktdmlldz1cImhpbnRcIiB3aXRoaW4gdGhlIHVubmFtZWQgcm9vdCwgYWthIGluZGV4Lmh0bWwuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgc2hvd3Mgb2ZmIGhvdyB5b3UgY291bGQgcG9wdWxhdGUgKmFueSogdmlldyB3aXRoaW4gKmFueSogYW5jZXN0b3Igc3RhdGUuXG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50QGhvbWUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2xhbmRpbmcuaHRtbCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3Rhc2tiYXJAaG9tZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGFza2Jhci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICd0YXNrQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIEFib3V0IC8vXG4gICAgICAgICAgICAvLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuYWJvdXQnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnYWJvdXQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9hYm91dC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWJvdXRDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFNob3dpbmcgb2ZmIGhvdyB5b3UgY291bGQgcmV0dXJuIGEgcHJvbWlzZSBmcm9tIHRlbXBsYXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAvLyB0ZW1wbGF0ZVByb3ZpZGVyOiBbJyR0aW1lb3V0JyxcbiAgICAgICAgICAgICAgICAvLyAgIGZ1bmN0aW9uICggICAgICAgICR0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybiAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgcmV0dXJuICc8cCBjbGFzcz1cImxlYWRcIj5VSS1Sb3V0ZXIgUmVzb3VyY2VzPC9wPjx1bD4nICtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXIvdHJlZS9tYXN0ZXIvc2FtcGxlXCI+U291cmNlIGZvciB0aGlzIFNhbXBsZTwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclwiPkdpdGh1YiBNYWluIFBhZ2U8L2E+PC9saT4nICtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXIjcXVpY2stc3RhcnRcIj5RdWljayBTdGFydDwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlci93aWtpXCI+SW4tRGVwdGggR3VpZGU8L2E+PC9saT4nICtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAnPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXIvd2lraS9RdWljay1SZWZlcmVuY2VcIj5BUEkgUmVmZXJlbmNlPC9hPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICc8L3VsPic7XG4gICAgICAgICAgICAgICAgLy8gICAgIH0sIDEwMCk7XG4gICAgICAgICAgICAgICAgLy8gICB9XVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLnF1ZXJ5Jywge1xuICAgICAgICAgICAgICAgIHVybDogJ3F1ZXJ5L25ldy8/U3RhdGUmQWdlJlByb2R1Y3QmRGlzdGFuY2UnLFxuICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvUmVzZWFyY2guaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInF1ZXJ5Q29udHJvbGxlclwiLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gLnN0YXRlKCdob21lLnF1ZXJ5LnJlc3VsdHMnLCB7XG4gICAgICAgICAgICAvLyAgIHVybDogJy9yZXN1bHRzLz9teVBhcmFtMSZteVBhcmFtMidcbiAgICAgICAgICAgIC8vIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5jYW1wYWlnbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdDYW1wYWlnbnMnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jYW1wYWlnbnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImNhbXBhaWduQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuY2FtcGFpZ24ubmV3Jywge1xuICAgICAgICAgICAgICAgIHVybDogJy9uZXcvOmNhbXBhaWduSUQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50QGhvbWUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NhbXBhaWduLWNvbnZlcnQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIm5ld0NhbXBhaWduQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuY2FtcGFpZ24uZGV0YWlscycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlscy86Y2FtcGFpZ25JRCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBjYW1wYWlnbkZhY3Rvcnk6ICdjYW1wYWlnbkZhY3RvcnknLFxuICAgICAgICAgICAgICAgICAgICBjYW1wYWlnbjogZnVuY3Rpb24oY2FtcGFpZ25GYWN0b3J5LCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYW1wYWlnbkZhY3Rvcnkuc2luZ2xlQ2FtcGFpZ24oJHN0YXRlUGFyYW1zLmNhbXBhaWduSUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudEBob21lJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jYW1wYWlnbi1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJjYW1wYWlnbkNvbnRyb2xsZXJEZXRhaWxzXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS50YXNrcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdUYXNrcy86dGFza0lEJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGFza3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInRhc2tDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyAndGFza3MnOntcbiAgICAgICAgICAgICAgICAgICAgLy8gICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3Rhc2tzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnRyb2xsZXI6IFwidGFza0NvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLmFkbWluJywge1xuICAgICAgICAgICAgICAgIHVybDogJ2FkbWluLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FkbWluLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZG1pbkNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLnRpbWVsaW5lJywge1xuICAgICAgICAgICAgICAgIHVybDogJ3RpbWVsaW5lLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3RpbWVsaW5lLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJ0aW1lbGluZUNvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLnJvbGVzJywge1xuICAgICAgICAgICAgICAgIHVybDogJ3JvbGVzLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3JvbGVzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJyb2xlc0NvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLnByb3NwZWN0Jywge1xuICAgICAgICAgICAgICAgIHVybDogJ1Byb3NwZWN0LzpQcm9zcGVjdElEJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvUHJvc3BlY3QuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInByb3NwZWN0Q29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUua2ltJywge1xuICAgICAgICAgICAgICAgIHVybDogJ0tpbS86UHJvc3BlY3RJRCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL0tpbS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwia2ltQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlbG9hZE9uU2VhcmNoOiBmYWxzZVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLnNlYXJjaCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdzZWFyY2g/UHJvc3BlY3RJRCZDdXN0SUQmTkNQRFAmTlBJJlppcCZDaXR5JlN0YXRlJlByb3NwZWN0VHlwZSZDdXN0b21lclR5cGUnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9Qcm9zcGVjdC1xdWVyeS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwic2VhcmNoQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyAuc3RhdGUoJ2hvbWUuc2VhcmNoLnJlc3VsdHMnLCB7XG4gICAgICAgICAgICAvLyAgIHVybDogJy9wcmlvcml0eScsXG4gICAgICAgICAgICAvLyAgIHZpZXdzOiB7XG4gICAgICAgICAgICAvLyAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaC5odG1sJyxcbiAgICAgICAgICAgIC8vICAgICAgIGNvbnRyb2xsZXI6IFwic2VhcmNoQ29udHJvbGxlclwiXG4gICAgICAgICAgICAvLyAgIH0sXG4gICAgICAgICAgICAvLyAgICdzZWFyY2hWaWV3Jzoge1xuICAgICAgICAgICAgLy8gICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9zZWFyY2guaHRtbCcsXG4gICAgICAgICAgICAvLyAgICAgICBjb250cm9sbGVyOiBcInNlYXJjaENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vIH0pXG5cblxuICAgICAgICB9XG4gICAgXVxuKTtcbiIsImZ1bmN0aW9uIGNoZWNrVGVzdChhZ2U6IG51bWJlcikge1xuICAgIGNvbnNvbGUubG9nKFwiUGFzc2VkPyBcIiwgYWdlKVxufVxuY2hlY2tUZXN0KDIwKVxuXG4vLyB2YXIgY3VzdG9tZXJzID0gW107XG4vLyB2YXIgY3VzdG9tZXIgPSB7fVxuLy8gY3VzdG9tZXIuY2l0eSA9IFwiU2VhdHRsZVwiXG5cblxuLy8gZm9yICh2YXIga2V5IGluIGN1c3RvbWVyKSB7XG4vLyAgICAgY29uc29sZS5sb2coa2V5KVxuLy8gfVxuXG4vLyB2YXIgY3VzdG9tZXIyID0ge31cbi8vIGN1c3RvbWVyMi5jaXR5ID0gXCJLYW5zYXMgQ2l0eVwiXG4vLyBjdXN0b21lcnMucHVzaChjdXN0b21lcik7XG4vLyBjdXN0b21lcnMucHVzaChjdXN0b21lcik7XG4vLyBjdXN0b21lcnMucHVzaChjdXN0b21lcjIpO1xuXG4vLyB2YXIgcmVzdWx0cyA9IFtcbi8vICAgICBmb3IgKGMgb2YgY3VzdG9tZXJzKVxuLy8gICAgICAgICBpZiAoYy5jaXR5ID09IFwiU2VhdHRsZVwiKSB7XG4vLyAgICAgICAgICAgICBuYW1lOiBjLm5hbWUsXG4vLyAgICAgICAgICAgICBhZ2U6IGMuYWdlXG4vLyAgICAgICAgIH1cbi8vIF1cblxuXG5cbi8vIHZhciBldmVucyA9IFsyLCA0LCA2XTtcblxuLy8gdmFyIG9kZHMgPSBldmVucy5tYXAodiA9PiB2ICsgMSkuZmlsdGVyKHYgPT4gdiA+IDApXG5cbi8vIGNvbnNvbGUubG9nKFwib2Rkc1wiLCBvZGRzKVxuXG4vLyB2YXIgaGVsbG8gPSB7XG4vLyAgICAgaGVsbG86ICd3b3JsZCcsXG4vLyAgICAgZm9vOiAnYmFyJ1xuLy8gfTtcbi8vIHZhciBxYXogPSB7XG4vLyAgICAgaGVsbG86ICdzdGV2aWUnLFxuLy8gICAgIGZvbzogJ2Jheidcbi8vIH1cblxuLy8gdmFyIG15QXJyYXkgPSBbXTtcbi8vIG15QXJyYXkucHVzaChoZWxsbywgaGVsbG8sIHFheik7XG5cbi8vIHZhciBwb3MgPSBteUFycmF5Lm1hcCh2ID0+IHYuaGVsbG8pLmluZGV4T2YoJ3N0ZXZpZScpO1xuXG4vLyBjb25zb2xlLmxvZyhcInBvc2l0aW9uXCIsIHBvcylcblxuLy8gbXlBcnJheS5zcGxpY2UobXlBcnJheS5tYXAodiA9PiB2LmhlbGxvKS5pbmRleE9mKCdzdGV2aWUnKSwgMSk7XG4vLyBjb25zb2xlLmxvZyhcIm15QXJyYXlcIiwgbXlBcnJheSlcblxuXG4vLyB2YXIgdGVzdEFycmF5ID0gWzEsIDIsIDMsIDRdXG5cbi8vIGNvbnNvbGUubG9nKFwidWhoaFwiKVxuXG4vLyAvLyBmdW5jdGlvbiBhc3NydChhcnI6QXJyYXkpe1xuLy8gLy8gICAgIGNvbnNvbGUubG9nKFwiQXJyYXlcIiwgYXJyKVxuLy8gLy8gfVxuXG4vLyAvLyBhc3NydChbMSwyLDNdKVxuXG4vLyBmdW5jdGlvbiB0aW1lb3V0KCkge1xuLy8gICAgIHZhciBtcyA9IE1hdGgucmFuZG9tKCkgKiAoNTAwMCAtIDEwMDApICsgMTAwMDtcbi8vICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG4vLyB9XG5cblxuLy8gYXN5bmNcblxuLy8gZnVuY3Rpb24gYXN5bmNWYWx1ZSh2YWx1ZSkge1xuLy8gICAgIGF3YWl0IHRpbWVvdXQoKTtcbi8vICAgICByZXR1cm4gdmFsdWUgKiB2YWx1ZTtcbi8vIH1cblxuLy8gYXN5bmNWYWx1ZSgyKS50aGVuKChyZXMpID0+IHtcbi8vICAgICAvLyBjb25zb2xlLmxvZyhcInJlc1wiLCByZXMpXG4vLyAgICAgLy8gdmFyIGRpY2tzID0gcmVzXG4vLyAgICAgcmV0dXJuIHJlc1xuLy8gfSkudGhlbihhc3luYyh4KSA9PiB7XG4vLyAgICAgLy8gY29uc29sZS5sb2coXCJTdGFydGluZyBuZXh0IHJlc1wiLCB4KSAvLyB4ID0gNFxuLy8gICAgIHZhciB5ID0gYXdhaXQgYXN5bmNWYWx1ZSh4KSAvLyBJTyBvciBkYiB0cmFuc2FjdGlvbjtcbi8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEb25lIGFmdGVyIHJlc1wiLCB5KSAvLyB5ID0gMTZcbi8vICAgICB2YXIgeiA9IGF3YWl0IGFzeW5jVmFsdWUoeSkgLy8gSU8gb3IgZGIgdHJhbnNhY3Rpb247XG4vLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRG9uZSBhZnRlciByZXMgMlwiLCB6KSAvLyB6ID0gMjU2XG4vLyAgICAgICAgIC8vIHJldHVybiB4ICogeDtcbi8vIH0pO1xuXG4vLyBhc3luY1xuXG4vLyBmdW5jdGlvbiBsb29wKHZhbCkge1xuLy8gICAgIHdoaWxlICh2YWwgPCA5MDAwKSB7XG4vLyAgICAgICAgIHZhbCA9IGF3YWl0IGFzeW5jVmFsdWUodmFsKVxuLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhcIml0ZXJhdGlvblwiLCB2YWwpXG4vLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVGVzdCBhcnJheVwiLCB0ZXN0QXJyYXkyKVxuLy8gICAgIH1cbi8vIH1cblxuLy8gbG9vcCgyKVxuXG4vLyB2YXIgdGVzdEFycmF5MiA9IFtdXG4vLyB0ZXN0QXJyYXkuZm9yRWFjaChhc3luYyh4KSA9PiB7XG4vLyAgICAgdmFyIGRvdWJsZSA9IGF3YWl0IGFzeW5jVmFsdWUoeClcbi8vICAgICB0ZXN0QXJyYXkyLnB1c2goZG91YmxlKVxuLy8gfSk7XG5cblxuLy8gY2xhc3MgU3RhY2sgZXh0ZW5kcyBBcnJheSB7XG4vLyAgICAgY29uc3RydWN0b3IoKSB7XG4vLyAgICAgICAgIC8vIHN1cGVyKClcbi8vICAgICB9XG4vLyAgICAgdG9wKCkge1xuLy8gICAgICAgICByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdO1xuLy8gICAgIH1cbi8vICAgICBib3R0b20oKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzWzBdXG4vLyAgICAgfVxuLy8gICAgIGFzeW5jIHF1ZXVlKHRhc2spIHtcbi8vICAgICAgICAgdGhpcy5wdXNoKHRhc2spXG4vLyAgICAgICAgIHdoaWxlICh0aGlzLmxlbmd0aCA+IDApIHtcbi8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkaW5nXCIsIHRhc2spXG4vLyAgICAgICAgICAgICBhd2FpdCB0aGlzLnNvbWV0aGluZyh0YXNrKVxuLy8gICAgICAgICB9XG4vLyAgICAgICAgIC8vIGF3YWl0IHRoaXMuc29tZXRoaW5nKHRhc2spO1xuLy8gICAgIH1cbi8vICAgICBhc3luYyB3b3JrKHRhc2spIHtcbi8vICAgICAgICAgYXdhaXQgdGltZW91dCgpIC8vYWthIGdvIHRvIHRoZSBEQlxuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkRvbmUgd2l0aCB0YXNrXCIsIHRhc2spXG4vLyAgICAgICAgIHJldHVyblxuLy8gICAgIH1cbi8vICAgICBhc3luYyBzb21ldGhpbmcodGFzaykge1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIlNvbWV0aGluZ1wiLCB0YXNrKVxuLy8gICAgICAgICBhd2FpdCB0aW1lb3V0KClcbi8vICAgICAgICAgdGhpcy5zaGlmdCgpO1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkRvbmVcIiwgdGFzaylcbi8vICAgICAgICAgcmV0dXJuXG4vLyAgICAgfVxuLy8gfVxuXG4vLyB2YXIgcyA9IG5ldyBTdGFjaygpO1xuLy8gLy8gcy5wdXNoKFwid29ybGRcIik7XG4vLyAvLyBzLnB1c2goXCJoZWxsb1wiKTtcbi8vIC8vIGNvbnNvbGUubG9nKHMudG9wKCkpOyAgLy8gXCJoZWxsb1wiXG4vLyAvLyBjb25zb2xlLmxvZyhzLmxlbmd0aCk7IC8vIDJcbi8vIC8vIGNvbnNvbGUubG9nKHMuYm90dG9tKCkpOyAvLyB3b3JsZFxuXG5cbi8vIHZhciBtYXAgPSBuZXcgTWFwKClcbi8vIG1hcC5zZXQoJ0pvaG4nLCAyNSlcbi8vIG1hcC5zZXQoJ0FsaWNlJywgNDAwKVxuXG4vLyBtYXAuZm9yRWFjaChmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4vLyAgICAgY29uc29sZS5sb2coa2V5LCB2YWx1ZSlcbi8vIH0pXG5cbi8vIGZvciAodmFyIFtrZXksIHZhbHVlXSBvZiBtYXApIHtcbi8vICAgICBjb25zb2xlLmxvZyhcImR1ZGVcIiwga2V5LCB2YWx1ZSlcbi8vIH1cblxuLy8gdmFyIGFyciA9IFsxLCAyLCAzLCA0XVxuLy8gICAgIC8vIGlmICghYXJyLmNvbnRhaW5zKDUpKXtcbi8vICAgICAvLyAgICAgYXJyLnB1c2gob2JqKTtcbi8vICAgICAvLyB9XG4vLyAgICAgLy8gY29uc29sZS5sb2coXCJBcnJcIiwgYXJyKVxuXG4vLyB2YXIgYm8gPSBfLmNvbnRhaW5zKFsxLCAyLCAzXSwgNSk7XG4vLyBjb25zb2xlLmxvZyhibylcbi8vIC8vIGNvbnNvbGUubG9nKCBfLmNvbnRhaW5zKFsxLCAyLCAzXSwgMSk7IClcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ2Fib3V0Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJGh0dHApIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJBYm91dCBjb250cm9sbGVyXCIpXG4gICAgICAgICRzY29wZS5kYXRhc2V0ID0gWzUsIDEwLCAxNSwgMjAsIDI1XTtcblxuICAgICAgICAkc2NvcGUuaW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YXNldFs0XSsrO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFzZXQpXG4gICAgICAgIH1cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdiYXJzQ2hhcnQnLCBmdW5jdGlvbigkcGFyc2UpIHtcbiAgICAgICAgLy9leHBsaWNpdGx5IGNyZWF0aW5nIGEgZGlyZWN0aXZlIGRlZmluaXRpb24gdmFyaWFibGVcbiAgICAgICAgLy90aGlzIG1heSBsb29rIHZlcmJvc2UgYnV0IGlzIGdvb2QgZm9yIGNsYXJpZmljYXRpb24gcHVycG9zZXNcbiAgICAgICAgLy9pbiByZWFsIGxpZmUgeW91J2Qgd2FudCB0byBzaW1wbHkgcmV0dXJuIHRoZSBvYmplY3Qgey4uLn1cbiAgICAgICAgdmFyIGRpcmVjdGl2ZURlZmluaXRpb25PYmplY3QgPSB7XG4gICAgICAgICAgICAvL1dlIHJlc3RyaWN0IGl0cyB1c2UgdG8gYW4gZWxlbWVudFxuICAgICAgICAgICAgLy9hcyB1c3VhbGx5ICA8YmFycy1jaGFydD4gaXMgc2VtYW50aWNhbGx5XG4gICAgICAgICAgICAvL21vcmUgdW5kZXJzdGFuZGFibGVcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAvL3RoaXMgaXMgaW1wb3J0YW50LFxuICAgICAgICAgICAgLy93ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSBvdXIgZGlyZWN0aXZlIGRlY2xhcmF0aW9uXG4gICAgICAgICAgICAvL2luIHRoZSBIVE1MIG1hcmstdXBcbiAgICAgICAgICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgICAgICAgICAgLy9vdXIgZGF0YSBzb3VyY2Ugd291bGQgYmUgYW4gYXJyYXlcbiAgICAgICAgICAgIC8vcGFzc2VkIHRocnUgY2hhcnQtZGF0YSBhdHRyaWJ1dGVcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgZGF0YTogJz1jaGFydERhdGEnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgLy9pbiBEMywgYW55IHNlbGVjdGlvblswXSBjb250YWlucyB0aGUgZ3JvdXBcbiAgICAgICAgICAgICAgICAvL3NlbGVjdGlvblswXVswXSBpcyB0aGUgRE9NIG5vZGVcbiAgICAgICAgICAgICAgICAvL2J1dCB3ZSB3b24ndCBuZWVkIHRoYXQgdGhpcyB0aW1lXG4gICAgICAgICAgICAgICAgdmFyIGNoYXJ0ID0gZDMuc2VsZWN0KGVsZW1lbnRbMF0pO1xuICAgICAgICAgICAgICAgIC8vdG8gb3VyIG9yaWdpbmFsIGRpcmVjdGl2ZSBtYXJrdXAgYmFycy1jaGFydFxuICAgICAgICAgICAgICAgIC8vd2UgYWRkIGEgZGl2IHdpdGggb3V0IGNoYXJ0IHN0bGluZyBhbmQgYmluZCBlYWNoXG4gICAgICAgICAgICAgICAgLy9kYXRhIGVudHJ5IHRvIHRoZSBjaGFydFxuICAgICAgICAgICAgICAgIGNoYXJ0LmFwcGVuZChcImRpdlwiKS5hdHRyKFwiY2xhc3NcIiwgXCJjaGFydFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2VsZWN0QWxsKCdkaXYnKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YShzY29wZS5kYXRhKS5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpLmVhc2UoXCJlbGFzdGljXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vYSBsaXR0bGUgb2YgbWFnaWM6IHNldHRpbmcgaXQncyB3aWR0aCBiYXNlZFxuICAgICAgICAgICAgICAgIC8vb24gdGhlIGRhdGEgdmFsdWUgKGQpIFxuICAgICAgICAgICAgICAgIC8vYW5kIHRleHQgYWxsIHdpdGggYSBzbW9vdGggdHJhbnNpdGlvblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnZGF0YScsIGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWwgPT09IG9sZFZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2VkIDFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFydC5zZWxlY3RBbGwoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShzY29wZS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQgKyBcIiVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2VkIDNcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRydWUpXG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB0cmFuc2l0aW9uR3JvdXAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LnNlbGVjdEFsbCgpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVEZWZpbml0aW9uT2JqZWN0O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgnaHViRmFjdG9yeScsIGZ1bmN0aW9uKCRyb290U2NvcGUsIEh1YiwgJHEsIFRhc2tTZXJ2aWNlKSB7XG5cbiAgICAgICAgLy9kZWNsYXJpbmcgdGhlIGh1YiBjb25uZWN0aW9uXG4gICAgICAgIHZhciBodWIgPSBuZXcgSHViKCdhY3Rpdml0eVF1ZXVlSHViJywge1xuICAgICAgICAgICAgLy8gdmFyIGh1YiA9IG5ldyBIdWIoJ21vdmVTaGFwZUh1YicsIHtcblxuICAgICAgICAgICAgLy9jbGllbnQgc2lkZSBtZXRob2RzXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IHtcbiAgICAgICAgICAgICAgICAndGFza1dvcmtpbmcnOiBmdW5jdGlvbihpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYSB0YXNrIHN0YXR1cyB3YXMgY2hhbmdlZC4uLi5cIiwgaW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlRhc2tMaXN0LnVwZGF0ZShpbmZvLkFjdGl2aXR5SUQsIGluZm8uU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICd1c2VySm9pbmVkJzogZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgam9pbmVkXCIsIHVzZXIpXG4gICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlVzZXJMaXN0LnB1c2godXNlcik7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAndXNlckxlZnQnOiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBsZWZ0XCIsIHVzZXIpXG4gICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLlVzZXJMaXN0LnJlbW92ZSh1c2VyLlVzZXJJRCk7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gcm9vdFBhdGg6IFwiaHR0cDovLzEwLjEuMS4yMjYvc2lnbmFsclwiLFxuICAgICAgICAgICAgcm9vdFBhdGg6IFwiaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9zaWduYWxyXCIsXG5cbiAgICAgICAgICAgIC8vc2VydmVyIHNpZGUgbWV0aG9kc1xuICAgICAgICAgICAgbWV0aG9kczogWydHZXRUYXNrcycsICdjaGFuZ2VUYXNrU3RhdHVzRCcsICdXaG9BbUknLCAnQ2hhbmdlVGFza1N0YXR1cyddLFxuXG4gICAgICAgICAgICAvL3F1ZXJ5IHBhcmFtcyBzZW50IG9uIGluaXRpYWwgY29ubmVjdGlvblxuICAgICAgICAgICAgLy8gcXVlcnlQYXJhbXM6e1xuICAgICAgICAgICAgLy8gICAgICd0b2tlbic6ICdleGFtcGxldG9rZW4nXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgfSlcblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICBodWIuaW5pdCgpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBpZiAocmVzLl9zdWJzY3JpYmVkVG9IdWJzKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vbW92ZVNoYXBlSHViLmludm9rZSgndXBkYXRlTW9kZWwnLCBzaGFwZU1vZGVsKVxuXG4gICAgICAgIHZhciBnZXRDdXJyZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IGN1cnJlbnRcIilcbiAgICAgICAgICAgIGh1Yi5oZWxsb19JbV9Db25uZWN0ZWQoc2hhcGVNb2RlbCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IFdob0FtSVwiKVxuICAgICAgICAgICAgaHViLldob0FtSShcInBiYWpvalwiKS50aGVuKGZ1bmN0aW9uKHVzZXJzKSB7XG4gICAgICAgICAgICAgICAgVGFza1NlcnZpY2UuVXNlckxpc3QucHVzaCguLi51c2Vycyk7XG4gICAgICAgICAgICAgICAgdXNlcnMuZm9yRWFjaChmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBUYXNrU2VydmljZS5Hcm91cHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLkdyb3Vwc1trZXldLmZvckVhY2goZnVuY3Rpb24ocm9sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZHggPSBUYXNrU2VydmljZS5Hcm91cHNba2V5XS5tYXAodXNlciA9PiB1c2VyLlVzZXJJRCkuaW5kZXhPZih1c2VyLlVzZXJJRClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRhc2tTZXJ2aWNlLkdyb3Vwc1trZXldW2lkeF0ub25saW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQ2hhbmdlVGFza1N0YXR1cyA9IGZ1bmN0aW9uKGFjdGl2aXR5SUQsIHN0YXR1cykge1xuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBodWIuQ2hhbmdlVGFza1N0YXR1cyhhY3Rpdml0eUlELCBzdGF0dXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZSBjaGFuZ2luZyBzdGF0dXNcIilcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cblxuICAgICAgICB2YXIgR2V0VGFza3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0dGluZyB0YXNrc1wiKVxuICAgICAgICAgICAgdmFyIGRlZiA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICBodWIuR2V0VGFza3MoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgIG1hcDogZ2V0Q3VycmVudCxcbiAgICAgICAgICAgICAgICBXaG9BbUk6IGdldFVzZXIsXG4gICAgICAgICAgICAgICAgR2V0VGFza3M6IEdldFRhc2tzLFxuICAgICAgICAgICAgICAgIENoYW5nZVRhc2tTdGF0dXM6IENoYW5nZVRhc2tTdGF0dXNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWZlcnJlZC5wcm9taXNlXG4gICAgICAgIF1cblxuXG4gICAgfSk7XG4iLCIvLyBmb3IgYWRkaW5nIGFuIGFjdGl2aXR5IHRvIGEgY2FtcGFpZ25cbmNsYXNzIE5ld0FjdGl2aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICB0aGlzLlN0YXJ0RGF0ZVRpbWUgPSBtb21lbnQob2JqLlN0YXJ0RGF0ZVRpbWUpLmZvcm1hdChcIllZWVktTU0tRERcIilcbiAgICAgICAgdGhpcy5Db21wbGV0aW9uRGF0ZVRpbWUgPSBtb21lbnQob2JqLkNvbXBsZXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuICAgIH1cbn1cbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignYWN0aXZpdHlDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkaHR0cCwgYWN0aXZpdHlGYWN0b3J5LCAkdXBsb2FkKSB7XG4gICAgY29uc29sZS5sb2coXCJXZWxjb21lIHRvIGFjdGl2aXR5IGNvbnRyb2xsZXJcIilcblxuICAgICRzY29wZS51c2VyTGlzdCA9IFtdO1xuICAgIHZhciBnZXRVc2VycyA9ICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMnKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCB1c2Vyc1wiLCBkYXRhLmRhdGEuVXNlckxpc3QpXG4gICAgICAgICRzY29wZS51c2VyTGlzdCA9IGRhdGEuZGF0YS5Vc2VyTGlzdFxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICB9KVxuXG4gICAgJHNjb3BlLm1vZGVsID0gYWN0aXZpdHlGYWN0b3J5WzBdO1xuXG4gICAgJHNjb3BlLnNldEZpbGUgPSBmdW5jdGlvbigkZmlsZXMpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3NlZFwiLCAkZmlsZXMpXG4gICAgICAgIGFjdGl2aXR5RmFjdG9yeVsyXS5maWxlID0gJGZpbGVzWzBdO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk1vZGVsXCIsIGFjdGl2aXR5RmFjdG9yeVsyXSApXG4gICAgfVxuXG5cbn0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ2FjdGl2aXR5RmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCAkdXBsb2FkLCAkYWxlcnQsICRxKSB7XG4gICAgdmFyIGFjdGl2aXR5RmFjdG9yeSA9IHt9O1xuICAgIHZhciBteVVwbG9hZCA9IHt9O1xuICAgIHZhciBhY3Rpdml0eU1ldGhvZHMgPSB7XG4gICAgICAgIHNlbGY6IHRoaXMsXG4gICAgICAgIF9jYW1wYWlnbklEOiBcIlwiLFxuICAgICAgICBfYWN0aXZpdHk6IFwiXCIsXG4gICAgICAgIHNhdmVBY3Rpdml0eV9hbmRfdGhlbl9kb19BdHRhY2htZW50czogZnVuY3Rpb24oY2FtcGFpZ25JRCwgYWN0aXZpdHkpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZlIGFjdGl2aXR5IGFuZCB0aGVuIGRvIGF0dGFjaG1lbnRzXCIsIGNhbXBhaWduSUQsIGFjdGl2aXR5KTtcbiAgICAgICAgICAgIC8vIHNvIHdlIGNhbiB1c2UgdGhlbSBmb3IgdGhlIG5leHQgZnVuY3Rpb25cbiAgICAgICAgICAgIHNlbGYuX2NhbXBhaWduSUQgPSBjYW1wYWlnbklEXG4gICAgICAgICAgICBzZWxmLmFjdGl2aXR5ID0gYWN0aXZpdHlcbiAgICAgICAgICAgIC8vICRxXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIC8vIGRlZmVycmVkIG9ubHkgcmVzb2x2ZXMgaWYgdGhleSBib3RoIHJlc29sdmUhXG4gICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9DYW1wYWlnbi8nK2NhbXBhaWduSUQrJy9BY3Rpdml0eScsICQucGFyYW0oYWN0aXZpdHkpICkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQ0NFU1MhXCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3cgdG8gdXBsb2FkLi4uXCIsIG15VXBsb2FkKVxuICAgICAgICAgICAgICAgIGlmKE9iamVjdC5rZXlzKG15VXBsb2FkKS5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldmVybWluZC4uLi5teVVwbG9hZCBpcyBlbXB0eVwiKVxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZpdHlJRCA9IGRhdGEuQWN0aXZpdHlJRDtcbiAgICAgICAgICAgICAgICAgICAgJHVwbG9hZC5odHRwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduLycrY2FtcGFpZ25JRCsnL0FjdGl2aXR5LycrYWN0aXZpdHlJRCsnL0F0dGFjaG1lbnQvJyArICBteVVwbG9hZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiBteVVwbG9hZC50eXBlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IG15VXBsb2FkXG4gICAgICAgICAgICAgICAgICAgIH0pLnByb2dyZXNzKGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BlcmNlbnQ6ICcgKyBwYXJzZUludCgxMDAuMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWwpKTtcbiAgICAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzXCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm5TaG93QWxlcnQoZXJyLmNvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgZm5TaG93QWxlcnQoZXJyLmNvbmZpZylcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmblNob3dBbGVydCgge21ldGhvZCwgdXJsfSApe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVyclwiLCBtZXRob2QsIHVybClcbiAgICAgICAgdmFyIG15QWxlcnQgPSAkYWxlcnQoe3RpdGxlOiBcIkVycm9yXCIsXG4gICAgICAgICAgICBjb250ZW50OiBtZXRob2QgK1wiIFwiKyB1cmwsXG4gICAgICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBbYWN0aXZpdHlGYWN0b3J5LCBhY3Rpdml0eU1ldGhvZHMsIG15VXBsb2FkXVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ2FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQpIHtcbiAgY29uc29sZS5sb2coXCJXZWxjb21lIHRvIHRoZSBBZG1pbiBDb250cm9sbGVyXCIpXG4gIGlmKCEkcm9vdFNjb3BlLmNyZWRlbnRpYWxzLmFkbWluKXtcbiAgICAkc3RhdGUuZ28oXCJob21lXCIpXG4gICAgdmFyIG15QWxlcnQgPSAkYWxlcnQoe3RpdGxlOiBcIkZvcmJpZGRlbiAtIFwiLFxuICAgICAgICBjb250ZW50OiBcIldlJ3JlIGNhbGxpbmcgdGhlIGNvcHNcIixcbiAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIGtleWJvYXJkOiB0cnVlLFxuICAgICAgICBkdXJhdGlvbjogM1xuICAgICAgICAvLyBjb250YWluZXI6IFwiYm9keVwiXG4gICAgICB9KTtcbiAgfVxuXG59KVxuIiwiLy8gRGlzcGxheXMgd2hvbGUgbGlzdCBvZiBzYXZlZCBjYW1wYWlnbnNcbmFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ2NhbXBhaWduQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBjYW1wYWlnbkZhY3RvcnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJXZWxjb21lIGZyb20gY2FtcGFpZ24gY29udHJvbGxlclwiKVxuICAgICAgICAkc2NvcGUuYXZhaWxhYmxlQ2FtcGFpZ25zID0gW11cbiAgICAgICAgdmFyIGZldGNoQWxsID0gY2FtcGFpZ25GYWN0b3J5LmdldENhbXBhaWducygpO1xuICAgICAgICB2YXIgZGlzcGxheVJlc3VsdHMgPSBmZXRjaEFsbC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290Li4uXCIsIGRhdGEuZGF0YSlcbiAgICAgICAgICAgICRzY29wZS5hdmFpbGFibGVDYW1wYWlnbnMgPSBkYXRhLmRhdGFcbiAgICAgICAgfSlcblxuICAgIH0pXG4iLCIvLyAvIy9DYW1wYWlnbnMvZGV0YWlscy97Y2FtcGFpZ25JRH1cbmFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ2NhbXBhaWduQ29udHJvbGxlckRldGFpbHMnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY2FtcGFpZ25GYWN0b3J5LCAkYWxlcnQsIHF1ZXJ5RmFjdG9yeSwgJG1vZGFsLCBhY3Rpdml0eUZhY3RvcnksIGNhbXBhaWduKSB7XG4gICAgICAgIC8vIGNhbXBhaWduIGlzIHBhc3NlZCBpbiBmcm9tIHRoZSByb3V0ZXIgcmVzb2x2ZVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImdvdCBjYW1wYWlnblwiLCBjYW1wYWlnbik7XG4gICAgICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMgPSBuZXcgQ2FtcGFpZ24oY2FtcGFpZ24uZGF0YSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2xhc3NcIiwgJHNjb3BlLmNhbXBhaWduRGV0YWlscylcbiAgICAgICAgJHNjb3BlLmV2ZW50cyA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuZXZlbnRzXG5cbiAgICAgICAgLy8gJHNjb3BlLmV2ZW50cyA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQWN0aXZpdGllcy5tYXAoRXZlbnQgPT4gRXZlbnQpO1xuICAgICAgICAkc2NvcGUuZXZlbnRTb3VyY2VzID0gW107XG5cbiAgICAgICAgJHNjb3BlLlByaW50ID0gKCgpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE8gLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jYW1wYWlnbkRldGFpbHMpO1xuICAgICAgICB9KVxuXG4gICAgICAgIHZhciBlZGl0Q2FtcGFpZ24gPSAkbW9kYWwoe1xuICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvZWRpdENhbXBhaWduLm1vZGFsLmh0bWwnLFxuICAgICAgICAgICAgc2hvdzogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIG9wZW4gbW9kYWwgZm9yIGVkaXRpbmcgY2FtcGFpZ24gZGV0YWlsc1xuICAgICAgICAvLyBtb2RhbCBwYXNzZXMgJ3RydWUnXG4gICAgICAgICRzY29wZS5lZGl0Q2FtcGFpZ24gPSBmdW5jdGlvbihlZGl0ID0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmIChlZGl0ID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY0lEID0gJHNjb3BlLmNhbXBhaWduRGV0YWlscy5DYW1wYWlnbklEXG4gICAgICAgICAgICAgICAgY2FtcGFpZ25GYWN0b3J5LmVkaXRDYW1wYWlnbnMoY0lELCAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzP1wiLCBkYXRhKVxuICAgICAgICAgICAgICAgICAgICBlZGl0Q2FtcGFpZ24uaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRHVkZS4uLi5cIiwgZXJyKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZVxuICAgICAgICAgICAgZWRpdENhbXBhaWduLnNob3coKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLm1vZGFsU2F2ZUFjdGl2aXR5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgW2FjdGl2aXR5TW9kZWwsIGFjdGl2aXR5TWV0aG9kc10gPSBhY3Rpdml0eUZhY3RvcnlcbiAgICAgICAgICAgIC8vIGNsYXNzIE5ld0FjdGl2aXR5IHBhcnNlcyB0aGUgZGF0ZXNcbiAgICAgICAgICAgIHZhciBhY3Rpdml0eU1vZGVsID0gbmV3IE5ld0FjdGl2aXR5KGFjdGl2aXR5TW9kZWwpO1xuICAgICAgICAgICAgdmFyIGNJRCA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQ2FtcGFpZ25JRFxuICAgICAgICAgICAgYWN0aXZpdHlNZXRob2RzLnNhdmVBY3Rpdml0eV9hbmRfdGhlbl9kb19BdHRhY2htZW50cyhjSUQsIGFjdGl2aXR5TW9kZWwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzcz9cIiwgZGF0YSlcbiAgICAgICAgICAgICAgICBhZGRFdmVudHMoYWN0aXZpdHlNb2RlbCk7XG4gICAgICAgICAgICAgICAgYWN0aXZpdHlNb2RhbC5oaWRlKCk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiRHVkZS4uLi5cIiwgZXJyKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3doZW4geW91IGNsaWNrIGEgY2FsZW5kYXIgb2JqZWN0LCBwb3B1bGF0ZSBkZWV0c1xuICAgICAgICAkc2NvcGUuZGVldHM7XG5cbiAgICAgICAgJHNjb3BlLnByb3NwZWN0c0NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5hY3Rpdml0aWVzQ29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5vbkNsaWNrVGFiID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0ID0gY29udGFjdFxuICAgICAgICB9XG4gICAgICAgICRzY29wZS5pc0FjdGl2ZVRhYiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBjb250YWN0ID09ICRzY29wZS5jdXJyZW50Q29udGFjdDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50YWJsZUNvbmZpZyA9IHtcbiAgICAgICAgICAgIGl0ZW1zUGVyUGFnZTogMTAsXG4gICAgICAgICAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlLFxuICAgICAgICAgICAgbWF4UGFnZXM6IDVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY2FtcGFpZ24gaXMgYXQgcGVuZGluZyBAIFRlbXBsYXRlIEAgQmVnaW5uaW5nLCBub3QgcGVuZGluZ1xuICAgICAgICAvL0lzIHRoaXMgYWx3YXlzIHRydWUgdGhvdWdoPyBXaGF0IGlmIGl0J3MgYXQgUGVuZGluZyB0byBiZWdpblxuICAgICAgICAkc2NvcGUuY2FtcGFpZ25QZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLkRlbGV0ZVByb3NwZWN0ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAgIC8vIGRvZXNuJ3QgaGF2ZSBhIHF1ZXJ5IElEIHRvIHNlbmQgZGVsZXRlcyB0b1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgaW1wbGVtZW50ZWRcIilcbiAgICAgICAgICAgIC8vICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscy5Qcm9zcGVjdHMuZm9yRWFjaCgoYSxiKSA9PiB7XG4gICAgICAgICAgICAvLyAgICAgaWYoYS5Qcm9zcGVjdElEID09IGlkKXtcbiAgICAgICAgICAgIC8vICAgICAgIGEuU3RhdHVzID8gYS5TdGF0dXMgPSAwIDogYS5TdGF0dXMgPSAxO1xuICAgICAgICAgICAgLy8gICAgICAgICBxdWVyeUZhY3RvcnkudXBkYXRlUXVlcnlTdGF0dXMoJHNjb3BlLnNlbGVjdGVkUXVlcnkuUXVlcnlJRCwgaWQsIGEuU3RhdHVzKTtcbiAgICAgICAgICAgIC8vICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gQ0FMRU5EQVIgRlVOQ1RJT05TXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIGQgPSBkYXRlLmdldERhdGUoKTtcbiAgICAgICAgdmFyIG0gPSBkYXRlLmdldE1vbnRoKCk7XG4gICAgICAgIHZhciB5ID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFkZEV2ZW50cyh7XG4gICAgICAgICAgICBEZXNjciwgU3RhcnREYXRlVGltZSwgQ29tcGxldGlvbkRhdGVUaW1lXG4gICAgICAgIH0pIHtcbiAgICAgICAgICAgICRzY29wZS5ldmVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IERlc2NyLFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBTdGFydERhdGVUaW1lLFxuICAgICAgICAgICAgICAgIGVuZDogQ29tcGxldGlvbkRhdGVUaW1lLFxuICAgICAgICAgICAgICAgIGFsbERheTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGFsZXJ0IG9uIGV2ZW50Q2xpY2sgKi9cbiAgICAgICAgJHNjb3BlLmFsZXJ0T25FdmVudENsaWNrID0gZnVuY3Rpb24oZXZlbnQsIGFsbERheSwganNFdmVudCwgdmlldykge1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gJHNjb3BlLmNhbXBhaWduRGV0YWlscy5BY3Rpdml0aWVzLmZpbmQoeCA9PiB4LkRlc2NyID09IGV2ZW50LnRpdGxlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cobWF0Y2gpXG4gICAgICAgICAgICAkc2NvcGUuZGVldHMgPSBtYXRjaDtcbiAgICAgICAgfTtcbiAgICAgICAgLyogYWxlcnQgb24gRHJvcCAqL1xuICAgICAgICAvLyAkc2NvcGUuYWxlcnRPbkRyb3AgPSBmdW5jdGlvbihldmVudCwgZGF5RGVsdGEsIG1pbnV0ZURlbHRhLCBhbGxEYXksIHJldmVydEZ1bmMsIGpzRXZlbnQsIHVpLCB2aWV3KSB7XG4gICAgICAgIC8vICAgICAkc2NvcGUuYWxlcnRNZXNzYWdlID0gKCdFdmVudCBEcm9wZWQgdG8gbWFrZSBkYXlEZWx0YSAnICsgZGF5RGVsdGEpO1xuICAgICAgICAvLyB9O1xuXG4gICAgICAgIC8vICRzY29wZS5vbkRheUNsaWNrID0gZnVuY3Rpb24oZGF0ZSwganNFdmVudCkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJXaG9hXCIsIGpzRXZlbnQpXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gLyogYWxlcnQgb24gUmVzaXplICovXG4gICAgICAgIC8vICRzY29wZS5hbGVydE9uUmVzaXplID0gZnVuY3Rpb24oZXZlbnQsIGRheURlbHRhLCBtaW51dGVEZWx0YSwgcmV2ZXJ0RnVuYywganNFdmVudCwgdWksIHZpZXcpIHtcbiAgICAgICAgLy8gICAgICRzY29wZS5hbGVydE1lc3NhZ2UgPSAoJ0V2ZW50IFJlc2l6ZWQgdG8gbWFrZSBkYXlEZWx0YSAnICsgbWludXRlRGVsdGEpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyAvKiBhZGQgYW5kIHJlbW92ZXMgYW4gZXZlbnQgc291cmNlIG9mIGNob2ljZSAqL1xuICAgICAgICAvLyAkc2NvcGUuYWRkUmVtb3ZlRXZlbnRTb3VyY2UgPSBmdW5jdGlvbihzb3VyY2VzLCBzb3VyY2UpIHtcbiAgICAgICAgLy8gICAgIHZhciBjYW5BZGQgPSAwO1xuICAgICAgICAvLyAgICAgYW5ndWxhci5mb3JFYWNoKHNvdXJjZXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgLy8gICAgICAgICBpZiAoc291cmNlc1trZXldID09PSBzb3VyY2UpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgc291cmNlcy5zcGxpY2Uoa2V5LCAxKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgY2FuQWRkID0gMTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gICAgIGlmIChjYW5BZGQgPT09IDApIHtcbiAgICAgICAgLy8gICAgICAgICBzb3VyY2VzLnB1c2goc291cmNlKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogYWRkIGN1c3RvbSBldmVudCovXG4gICAgICAgIC8vICRzY29wZS5hZGRFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgJHNjb3BlLmV2ZW50cy5wdXNoKHtcbiAgICAgICAgLy8gICAgICAgICB0aXRsZTogJ09wZW4gU2VzYW1lJyxcbiAgICAgICAgLy8gICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgMjgpLFxuICAgICAgICAvLyAgICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgMjkpLFxuICAgICAgICAvLyAgICAgICAgIGNsYXNzTmFtZTogWydvcGVuU2VzYW1lJ11cbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyAvKiByZW1vdmUgZXZlbnQgKi9cbiAgICAgICAgLy8gJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIC8vICAgICAkc2NvcGUuZXZlbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIC8qIENoYW5nZSBWaWV3ICovXG4gICAgICAgIC8vICRzY29wZS5jaGFuZ2VWaWV3ID0gZnVuY3Rpb24odmlldywgY2FsZW5kYXIpIHtcbiAgICAgICAgLy8gICAgIGNhbGVuZGFyLmZ1bGxDYWxlbmRhcignY2hhbmdlVmlldycsIHZpZXcpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyAvKiBDaGFuZ2UgVmlldyAqL1xuICAgICAgICAvLyAkc2NvcGUucmVuZGVyQ2FsZW5kZXIgPSBmdW5jdGlvbihjYWxlbmRhcikge1xuICAgICAgICAvLyAgICAgY2FsZW5kYXIuZnVsbENhbGVuZGFyKCdyZW5kZXInKTtcbiAgICAgICAgLy8gfTtcblxuICAgICAgICB2YXIgZGF5Q2xpY2tlZDtcbiAgICAgICAgJHNjb3BlLmRheUNsaWNrID0gZnVuY3Rpb24oYSwgYiwgYywgZCkge1xuICAgICAgICAgICAgZGF5Q2xpY2tlZCA9IG1vbWVudChhKS5mb3JtYXQoXCJMTFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGl2aXR5TW9kYWwgPSAkbW9kYWwoe1xuICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYWRkX2FjdGl2aXR5Lm1vZGFsLmh0bWwnLFxuICAgICAgICAgICAgc2hvdzogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgICRzY29wZS5kYXlEYmxDbGljayA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcbiAgICAgICAgICAgIHZhciBbYWN0aXZpdHlNb2RlbCwgYWN0aXZpdHlNZXRob2RzXSA9IGFjdGl2aXR5RmFjdG9yeVxuICAgICAgICAgICAgYWN0aXZpdHlNb2RlbC5TdGFydERhdGVUaW1lID0gZGF5Q2xpY2tlZFxuICAgICAgICAgICAgYWN0aXZpdHlNb2RhbC5zaG93KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBjb25maWcgb2JqZWN0ICovXG4gICAgICAgICRzY29wZS51aUNvbmZpZyA9IHtcbiAgICAgICAgICAgIGNhbGVuZGFyOiB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICd0aXRsZScsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogJycsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAndG9kYXkgcHJldixuZXh0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXZlbnRDbGljazogJHNjb3BlLmFsZXJ0T25FdmVudENsaWNrLFxuICAgICAgICAgICAgICAgIGV2ZW50RGJsQ2xpY2s6ICRzY29wZS5vbkRheUNsaWNrLFxuICAgICAgICAgICAgICAgIGRheUNsaWNrOiAkc2NvcGUuZGF5Q2xpY2ssXG4gICAgICAgICAgICAgICAgZGF5RGJsQ2xpY2s6ICRzY29wZS5kYXlEYmxDbGljayxcbiAgICAgICAgICAgICAgICAvLyBldmVudERyb3A6ICRzY29wZS5hbGVydE9uRHJvcCxcbiAgICAgICAgICAgICAgICAvLyBldmVudFJlc2l6ZTogJHNjb3BlLmFsZXJ0T25SZXNpemUsXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogZXZlbnQgc291cmNlcyBhcnJheSovXG4gICAgICAgICRzY29wZS5ldmVudFNvdXJjZXMgPSBbJHNjb3BlLmV2ZW50c107XG5cbiAgICAgICAgJHNjb3BlLm5leHRTdGF0dXMgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgdmFyIGNJRCA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuQ2FtcGFpZ25JRFxuICAgICAgICAgICAgY2FtcGFpZ25GYWN0b3J5LmVkaXRTdGF0dXMoY0lELCAzKVxuICAgICAgICB9XG5cblxuXG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgnY2FtcGFpZ25GYWN0b3J5JyxcbiAgICAgICAgZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcXVlcnlSZXN1bHRzOiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FtcGFpZ25zJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNpbmdsZUNhbXBhaWduOiBmdW5jdGlvbihwYXJhbUlEKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0IGNhbXBhaWduLi4uLiNcIiwgcGFyYW1JRClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvY2FtcGFpZ24vJyArIHBhcmFtSUQpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aGlzU2F2ZWRRdWVyeTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvL3dpbGwgaGF2ZSB0byBwYXNzIHdoaWNoIHNhdmVkIHF1ZXJ5IGluIHRoZSBmdXR1cmVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnYXBpL3RoaXNRdWVyeScpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRRdWVyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvbGlzdCcpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzaW5nbGVRdWVyeTogZnVuY3Rpb24ocXVlcnlJRCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgcXVlcnlJRCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb252ZXJ0OiBmdW5jdGlvbihxdWVyeUlEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9DYW1wYWlnbicsICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgUXVlcnlJRDogcXVlcnlJRFxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzYXZlQWN0aXZpdHk6IGZ1bmN0aW9uKGNhbXBhaWduSUQsIGFjdGl2aXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9DYW1wYWlnbi8nICsgY2FtcGFpZ25JRCArICcvQWN0aXZpdHknLCAkLnBhcmFtKGFjdGl2aXR5KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRVc2VyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3VzZXJzJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldENhbXBhaWduczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL2NhbXBhaWduJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVkaXRDYW1wYWlnbnM6IGZ1bmN0aW9uKGNJRCwgb3JpZ2luYWxGb3JtKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdCBjYW1wYWlnbnNcIiwgb3JpZ2luYWxGb3JtKVxuICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3B5aW5nIG9iamVjdCBhZmZlY3RzIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZm9ybSwgb3JpZ2luYWxGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlc2UgYXJyYXlzIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmb3JtLkFjdGl2aXRpZXNcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZvcm0uUHJvc3BlY3RzXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmb3JtLkF0dGFjaG1lbnRzXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmb3JtLkJ1c2luZXNzT3duZXJzXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduLycgKyBjSUQsICQucGFyYW0oZm9ybSkpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlZGl0U3RhdHVzOiBmdW5jdGlvbihjSUQsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjSUQsIHN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvY2FtcGFpZ24vJyArIGNJRCArICcvc3RhdHVzJywgJC5wYXJhbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiBzdGF0dXNcbiAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignbmV3Q2FtcGFpZ25Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCwgY2FtcGFpZ25GYWN0b3J5LCBxdWVyeUZhY3RvcnksIGFjdGl2aXR5RmFjdG9yeSkge1xuICAgIGNvbnNvbGUubG9nKFwiV2VsY29tZSB0byBORVcgY2FtcGFpZ24gY29udHJvbGxlclwiKVxuXG4gICAgJHNjb3BlLnRhYmxlQ29uZmlnID0ge1xuICAgICAgICBpdGVtc1BlclBhZ2U6IDEwLFxuICAgICAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlLFxuICAgICAgICBtYXhQYWdlczogNVxuICAgIH1cblxuICAgICRzY29wZS5EZWxldGVQcm9zcGVjdCA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscy5yb3dzLmZvckVhY2goKGEsYikgPT4ge1xuICAgICAgICAgICAgaWYoYS5Qcm9zcGVjdElEID09IGlkKXtcbiAgICAgICAgICAgICAgICBhLlN0YXR1cyA/IGEuU3RhdHVzID0gMCA6IGEuU3RhdHVzID0gMTtcbiAgICAgICAgICAgICAgICBxdWVyeUZhY3RvcnkudXBkYXRlUXVlcnlTdGF0dXMoJHNjb3BlLnNlbGVjdGVkUXVlcnkuUXVlcnlJRCwgaWQsIGEuU3RhdHVzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgICRzY29wZS5jYW1wYWlnbklEO1xuICAgICRzY29wZS5jYW1wYWlnbkNvbnZlcnRlZCA9IGZhbHNlO1xuICAgICRzY29wZS5jb252ZXJ0ID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbnZlcnRpbmcuLi5cIik7XG4gICAgICAgIHZhciBxdWVyeUlEICA9ICRzY29wZS5jYW1wYWlnbkRldGFpbHMuUXVlcnlJRDtcbiAgICAgICAgY29uc29sZS5lcnJvcihxdWVyeUlEKVxuICAgICAgICBjYW1wYWlnbkZhY3RvcnkuY29udmVydChxdWVyeUlEKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRPTkUsIGNhbXBhaWduIElEIFwiLCBkYXRhLmRhdGEuQ2FtcGFpZ25JRClcbiAgICAgICAgICAgICRzY29wZS5jYW1wYWlnbklEID0gZGF0YS5kYXRhLkNhbXBhaWduSUQ7XG4gICAgICAgICAgICAkc2NvcGUuY2FtcGFpZ25Db252ZXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9KVxuICAgIH07XG5cbiAgICAkc2NvcGUudXNlckxpc3QgPSBbXTtcbiAgICBjYW1wYWlnbkZhY3RvcnkuZ2V0VXNlcnMoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IGFsbCB1c2Vycy4uLi5cIiwgZGF0YSlcbiAgICAgICAgJHNjb3BlLnVzZXJMaXN0ID0gZGF0YS5kYXRhLlVzZXJMaXN0O1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgfSlcblxuICAgICRzY29wZS5zYXZlZFF1ZXJpZXMgPSBbXTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRRdWVyeTtcbiAgICBjYW1wYWlnbkZhY3RvcnkuZ2V0UXVlcmllcygpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QuLi5cIiwgZGF0YSlcbiAgICAgICAgJHNjb3BlLnNhdmVkUXVlcmllcyA9IGRhdGEuZGF0YVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgfSlcblxuICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMgPSB7fTtcbiAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLnJvd3MgPSBbXTtcbiAgICAkc2NvcGUuc2V0QmlsbEdyb3VwID0gKGRhdGEpID0+IHtcbiAgICAgICAgLy8gRklYTUUgdGhpcyBpcyBiZWluZyBmaXJlZCBvbiBwYWdlIGluaXQgYmVjYXVzZSBpdCB0aGlua3MgdGhlIHZhbHVlXG4gICAgICAgIC8vIGlzIGNoYW5naW5nO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNIQU5HRURcIiwgJHNjb3BlLnNlbGVjdGVkUXVlcnkpXG4gICAgICAgIGNhbXBhaWduRmFjdG9yeS5zaW5nbGVRdWVyeSgkc2NvcGUuc2VsZWN0ZWRRdWVyeS5RdWVyeUlEKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzID0gbmV3IFBlbmRpbmdDYW1wYWlnbihkYXRhLmRhdGEpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2FtcGFpZ25EZXRhaWxzKVxuICAgICAgICAgICAgJHNjb3BlLmZldGNoZWQgPSB0cnVlO1xuICAgICAgICB9KVxuICAgIH07XG4gICAgaWYoJHN0YXRlLnBhcmFtcy5jYW1wYWlnbklEICE9XCJcIil7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiWWVzIHRoZXJlJ3MgcGFyYW1zXCIpO1xuICAgICAgICAvLyBUT0RPIGFsd2F5cyBmaXJlcyBzZXRCaWxsR3JvdXBcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkUXVlcnkgPSB7UHJvZHVjdElEOiAxLCBRdWVyeUlEOiAkc3RhdGUucGFyYW1zLmNhbXBhaWduSUQgfHwgMSwgTmFtZTogXCJtbyB0ZXN0XCJ9XG4gICAgICAgICRzY29wZS5zZXRCaWxsR3JvdXAoKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuY2hhbmdlU3RhdGUgPSAoYmxlaCkgPT4ge1xuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUuY2FtcGFpZ24uZGV0YWlscycsIHtwYXJhbXM6JzEzMzcnfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLm5ld0FjdGl2aXR5ID0ge307XG4gICAgJHNjb3BlLnNhdmVkQWN0aXZpdGllcyA9IFtdO1xuICAgICRzY29wZS5hY3Rpdml0eU5vID0gMDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyO1xuICAgIHZhciBhY3Rpdml0eV9vcmRlciA9IDE7XG4gICAgJHNjb3BlLnNhdmVBY3Rpdml0eSA9ICgpID0+IHtcbiAgICAgICAgdmFyIFthY3Rpdml0eU1vZGVsLCBhY3Rpdml0eU1ldGhvZHNdID0gYWN0aXZpdHlGYWN0b3J5XG4gICAgICAgIC8vIGNsYXNzIE5ld0FjdGl2aXR5IHBhcnNlcyB0aGUgZGF0ZXNcbiAgICAgICAgdmFyIGFjdGl2aXR5TW9kZWwgPSBuZXcgTmV3QWN0aXZpdHkoYWN0aXZpdHlNb2RlbCk7XG4gICAgICAgIHZhciBjSUQgPSAkc2NvcGUuY2FtcGFpZ25JRFxuICAgICAgICBhY3Rpdml0eU1ldGhvZHMuc2F2ZUFjdGl2aXR5X2FuZF90aGVuX2RvX0F0dGFjaG1lbnRzKGNJRCwgYWN0aXZpdHlNb2RlbCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgZGF0YS5PcmRlciA9IGFjdGl2aXR5X29yZGVyXG4gICAgICAgICAgICBhY3Rpdml0eV9vcmRlcisrXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3M/XCIsIGRhdGEpXG4gICAgICAgICAgICAkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzLnNvcnQoY29tcGFyZURhdGVzKVxuICAgICAgICAgICAgLy9pZiB0aGUgbGFzdCBvbmUsIGFmdGVyIHNvcnRpbmcsIGlzIG5vdCB0aGUgb25lIHdlIGp1c3QgYWRkZWRcbiAgICAgICAgICAgIGlmKCRzY29wZS5zYXZlZEFjdGl2aXRpZXNbJHNjb3BlLnNhdmVkQWN0aXZpdGllcy5sZW5ndGggLSAxXSAhPSBkYXRhKXtcbiAgICAgICAgICAgICAgICAvLyB0aGVuIGdpdmUgdGhlbSBhbGwgbmV3ICdvcmRlcicgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgIC8vIGFuZCByZXNlbmQgdG8gdGhlIHNlcnZlclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2hvYSB3aG9hLCB0aW1lIG1peHVwLi4uXCIpXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zYXZlZEFjdGl2aXRpZXNbaV0uT3JkZXIgPSBpKzE7XG4gICAgICAgICAgICAgICAgICAgIC8vc2VuZCB0aG9zZSB0byB0aGUgc2VydmVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS5hY3Rpdml0eU5vKys7XG4gICAgICAgICAgICAkc2NvcGUubmV3QWN0aXZpdHkgPSB7fTtcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIkR1ZGUuLi4uXCIsIGVycilcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVEYXRlcyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBtb21lbnQoYS5TdGFydERhdGVUaW1lKS5pc0FmdGVyKGIuU3RhcnREYXRlVGltZSk7IFxuICAgIH1cblxufSlcbiIsImNsYXNzIFBlbmRpbmdDYW1wYWlnbiB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgdGhpcy5QYXJhbVN0clVucGFja2VkID0gJyc7XG4gICAgICAgIHZhciBwYXJhbU9iaiA9ICQuZGVwYXJhbShvYmouUGFyYW1TdHIpXG4gICAgICAgIE9iamVjdC5rZXlzKCBwYXJhbU9iaiApLmZvckVhY2goKGtleSApPT57XG4gICAgICAgICAgICB0aGlzLlBhcmFtU3RyVW5wYWNrZWQgKz0ga2V5ICsgXCIgPSBcIiArIHBhcmFtT2JqW2tleV0gKyBcIjsgXCI7XG4gICAgICAgIH0pXG4gICAgfVxufVxuIiwiY2xhc3MgQWN0aXZpdHkyIHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgIH1cbn1cbiIsImNsYXNzIENhbXBhaWduIHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICB0aGlzLkFjdGl2aXRpZXMgPSBbXG4gICAgICAgICAgICBmb3IgKHggb2Ygb2JqLkFjdGl2aXRpZXMpIG5ldyBOZXdBY3Rpdml0eSh4KVxuICAgICAgICBdXG4gICAgICAgIHRoaXMuUHJvc3BlY3RDb3VudCA9IG9iai5Qcm9zcGVjdHMubGVuZ3RoXG4gICAgICAgIHRoaXMuQWN0aXZpdHlDb3VudCA9IG9iai5BY3Rpdml0aWVzLmxlbmd0aFxuICAgIH1cbiAgICAvLyByZXR1cm5zIHtEZXNjciwgU3RhcnREYXRlVGltZSwgQ29tcGxldGlvbkRhdGVUaW1lfSBmcm9tIHRoaXMuQWN0aXZpdGVzXG4gICAgZ2V0IGV2ZW50cygpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGZvciAoe1xuICAgICAgICAgICAgICAgICAgICBEZXNjciwgU3RhcnREYXRlVGltZSwgQ29tcGxldGlvbkRhdGVUaW1lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9mIHRoaXMuQWN0aXZpdGllcykge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBEZXNjcixcbiAgICAgICAgICAgICAgICBzdGFydDogU3RhcnREYXRlVGltZSxcbiAgICAgICAgICAgICAgICBlbmQ6IENvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxufVxuIiwiY2xhc3MgQ3VzdG9tZXIge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIC8vIHRoaXMuX0FscGhhID0ge0F2YWlsYWJsZUNyZWRpdCA6IG9iai5BdmFpbGFibGVDcmVkaXR9XG4gICAgICAgIHRoaXMuT3JkZXJpbmdNZXRob2RzID0gWyBmb3IoeCBvZiBPYmplY3Qua2V5cyh7Q3J4U2V0dXA6IG9iai5DcnhTZXR1cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENTT1NTZXR1cDogb2JqLkNTT1NTZXR1cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVXT01TZXR1cDogb2JqLkVXT01TZXR1cCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBCQU9TZXR1cDogb2JqLlBCQU9TZXR1cH0pIClpZiAob2JqW3hdID09IDApIHhdLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcigna2ltQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQsIHByb3NwZWN0RmFjdG9yeSwgJG1vZGFsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSGVsbG8ga2ltXCIpXG4gICAgICAgICRzY29wZS50aGVfUHJvc3BlY3Q7XG4gICAgICAgICRzY29wZS5Db250YWN0cyA9IFtdO1xuICAgICAgICBwcm9zcGVjdEZhY3RvcnkuZ2V0UHJvc3BlY3RfYnlfSUQoJHN0YXRlLnBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBwcm9zcGVjdFwiLCBkYXRhKVxuICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdCA9IG5ldyBQcm9zcGVjdChkYXRhLmRhdGEpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnRoZV9Qcm9zcGVjdC5sYXRlc3QpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnRoZV9Qcm9zcGVjdClcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9ICRzY29wZS50aGVfUHJvc3BlY3QuQ29udGFjdHNbMF1cbiAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllcy5yZXZlcnNlKClcbiAgICAgICAgfSlcblxuICAgICAgICAkc2NvcGUuY29udGFjdHNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaXNzdWVzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLm5vdGVzQ29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgIC8vY29udGFjdHMgdGFic1xuICAgICAgICAkc2NvcGUuY3VycmVudENvbnRhY3RcbiAgICAgICAgJHNjb3BlLm9uQ2xpY2tUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbnRhY3QgPSBjb250YWN0XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmlzQWN0aXZlVGFiID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRhY3QgPT0gJHNjb3BlLmN1cnJlbnRDb250YWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcblxuXG4gICAgICAgICRzY29wZS5hZGRDb250YWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbXlNb2RhbCA9ICRtb2RhbCh7XG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3ZpZXdzL2FkZF9jb250YWN0LnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdsYW5kaW5nQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBUYXNrcykge1xuICBjb25zb2xlLmxvZyhcIkxhbmRpbmcgQ29udHJvbGxlclwiKVxuICAvLyBQYXNzZWQgaW4gVGFza3MgZmFjdG9yeS4uLndlJ2xsIGhhbmRsZSBpdCBhbGwgaGVyZSBmb3Igbm93XG5cbiAgaWYoISRyb290U2NvcGUubG9nZ2VkSW4pe1xuICAgIGNvbnNvbGUubG9nKFwiTm90IGxvZ2dlZCBpbiwgcmVkaXJlY3RcIilcbiAgICAkc3RhdGUuZ28oXCJsb2dpblwiKTtcbiAgfVxuXG4gICRzY29wZS5kcm9wZG93biA9IFtcbiAge1xuICAgIFwidGV4dFwiOiBcIk5ldyBDYW1wYWlnblwiLFxuICAgIFwiY2xpY2tcIjogJyRzdGF0ZS5nbyhcImhvbWUuY2FtcGFpZ24ubmV3XCIpJ1xuICB9LFxuICB7XG4gICAgXCJ0ZXh0XCI6IFwiU2F2ZWQgQ2FtcGFpZ25zXCIsXG4gICAgXCJjbGlja1wiOiAnJHN0YXRlLmdvKFwiaG9tZS5jYW1wYWlnblwiKSdcbiAgfVxuICAvLyB7XG4gIC8vICAgXCJkaXZpZGVyXCI6IHRydWVcbiAgLy8gfSxcbiAgLy8ge1xuICAvLyAgIFwidGV4dFwiOiBcIk5ldyBRdWVyeVwiLFxuICAvLyAgIFwiY2xpY2tcIjogJyRzdGF0ZS5nbyhcImhvbWUucXVlcnlcIiknXG4gIC8vIH1cblxuXTtcblxuXG4kc2NvcGUuaW5NYXJrZXRpbmcgPSBmYWxzZVxuXG5cbmlmKCRyb290U2NvcGUuY3JlZGVudGlhbHMuZ3JvdXAgPT0gXCJNYXJrZXRpbmdcIil7XG4gICRzY29wZS5pbk1hcmtldGluZyA9IHRydWU7XG5cbiAgLy8gZGV0ZXJtaW5lZCB0aGVpciBncm91cCwgcmVuZGVyZWQgdmlldywgbm93IHRvIGZldGNoIHRhc2tzLlxuICAvLyBkbyB3ZSB3YW50IHRvIGRvIHRoaXMgaW4gdGhlIGxhbmRpbmcgY29udHJvbGxlcj9cbiAgLy8gb3IgYSBUYXNrcyBjb250cm9sbGVyPyBXaXRoIGEgdGFza3Mgdmlldz9cbiAgdmFyIHRoaXNVc2Vyc0dyb3VwID0gJHJvb3RTY29wZS5jcmVkZW50aWFsc1xuXG4gICRzY29wZS5hbGxUYXNrcyA9IFtdXG4gIHZhciBmZXRjaCA9IFRhc2tzLm15VGFza3ModGhpc1VzZXJzR3JvdXApO1xuICB2YXIgc2hvd1Rhc2tzID0gZmV0Y2gudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhcIlNob3cgdGFza3MuLi4uXCIsIGRhdGEpXG4gICAgJHNjb3BlLmFsbFRhc2tzID0gZGF0YS5kYXRhXG4gIH0pXG5cbn1cblxuXG53aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVudHJpZXMgPSB3aW5kb3cucGVyZm9ybWFuY2UuZ2V0RW50cmllcygpO1xuXG4gICAgICAgIGVudHJpZXMgPSBlbnRyaWVzLnNvcnQoIGZ1bmN0aW9uKCBhLCBiICkge1xuICAgICAgICAgICAgcmV0dXJuIGIuZHVyYXRpb24gLSBhLmR1cmF0aW9uO1xuICAgICAgICB9ICk7XG5cbiAgICAgICAgJHJvb3RTY29wZS5tZXRyaWNzID0gZW50cmllcztcbn0sIDUwMCk7XG5cblxuXG5cbn0pIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdUYXNrcycsXG4gZnVuY3Rpb24gKCRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcXVlcnlSZXN1bHRzOmZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NhbXBhaWducycpXG4gICAgICAgIH0sXG4gICAgICAgIG15VGFza3M6ZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFjdG9yeSBUQVNLUyBnZXR0aW5nIG15VGFza3MuLlwiLCBkYXRhKVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcnRhc2tzJywgZGF0YSlcbiAgICAgICAgfSxcbiAgICAgICAgdGFza0RldGFpbHM6ZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFjdG9yeSBUQVNLUyBnZXR0aW5nIGRldGFpbHMuLlwiLCBkYXRhKVxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdGFza2RldGFpbHMnLCBkYXRhKVxuICAgICAgICB9LFxuICAgICAgICBhbGxUYXNrczogZnVuY3Rpb24oKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkZhY3RvcnkgdGFza3MgcmV0dXJuaW5nIGV2ZXJ5IHRhc2suLi5cIilcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FsbHRhc2tzJylcbiAgICAgICAgfSxcbiAgICAgICAgdGFza1Byb3NwZWN0OiBmdW5jdGlvbigpe1xuICAgICAgICAgIC8vIHRoaXMgd291bGQgYmUgYSBwb3N0IHdpdGggbGlrZSwgdGFza0lEID09IHByb3NwZWN0LnRhc2tJRFxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcmFuZG9tUHJvc3BlY3QnKVxuICAgICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5zZXJ2aWNlKCdMb2dpblNlcnZpY2UnLCBmdW5jdGlvbigkY29va2llcywgJGh0dHAsIFByaXZpbGVnZSkge1xuICAgICAgICBjbGFzcyBVc2VyIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdldCB1c2VyKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgTG9naW5TZXJ2aWNlID0ge31cbiAgICAgICAgTG9naW5TZXJ2aWNlLnNldFVzZXIgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICBMb2dpblNlcnZpY2UudXNlciA9IG5ldyBVc2VyKHVzZXIpO1xuICAgICAgICAgICAgUHJpdmlsZWdlLlNldFNlc3Npb24odXNlci5rZXksIHRoaXMudXNlci51c2VyLCB0aGlzLnVzZXIpXG4gICAgICAgIH1cbiAgICAgICAgTG9naW5TZXJ2aWNlLmNvb2tpZV91c2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGNvb2tpZXMudXNlcmlkO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvZ2luU2VydmljZS51c2VyID0gbmV3IFVzZXIoe30pO1xuICAgICAgICByZXR1cm4gTG9naW5TZXJ2aWNlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFByaXZpbGVnZSwgTG9naW5TZXJ2aWNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29udHJvbGxlciBsb2FkZWRcIilcbiAgICAgICAgJHNjb3BlLmNyZWRzID0ge307XG4gICAgICAgICRzY29wZS5jcmVkcy51c2VyaWQgPSBMb2dpblNlcnZpY2UuY29va2llX3VzZXJcbiAgICAgICAgJHNjb3BlLmxvZ2luU3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBQcml2aWxlZ2UuTG9naW4oJHNjb3BlLmNyZWRzKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLnNldFVzZXIoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImhvbWVcIik7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmZhY3RvcnkoJ1ByaXZpbGVnZScsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJGh0dHAsICRxLCAkY29va2llcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZhY3RvcnkgbG9hZGVkXCIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBMb2dpbjogZnVuY3Rpb24oY3JlZHMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBPU1QgRFVERVwiLCBjcmVkcylcbiAgICAgICAgICAgICAgICBkZWxldGUgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQXV0aCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oY3JlZHMpLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTG9nb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG9cIilcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXRTZXNzaW9uOiBmdW5jdGlvbih4a2V5OiBzdHJpbmcsIHVzZXJpZDogc3RyaW5nLCBwYmF1c2VyKSB7XG4gICAgICAgICAgICAgICAgJGNvb2tpZXMueGtleSA9IHhrZXk7XG4gICAgICAgICAgICAgICAgJGNvb2tpZXMudXNlcmlkID0gdXNlcmlkO1xuICAgICAgICAgICAgICAgIC8vICRjb29raWVzLnBiYXVzZXIgPSBwYmF1c2VyO1xuICAgICAgICAgICAgICAgIC8vIGZvciAodmFyIGtleSBpbiBwYmF1c2VyKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwidXNlclwiLCBrZXkpXG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYS2V5J10gPSB4a2V5XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnYWxlcnRGYWN0b3J5Jyxcbi8vIG5vdyBSZXNlYXJjaCBGYWN0b3J5XG4gZnVuY3Rpb24gKCRhbGVydCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFsZXJ0czogZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBbGVydFwiLCBtZXNzYWdlKVxuICAgICAgICAgIHZhciBteUFsZXJ0ID0gJGFsZXJ0KHt0aXRsZTogbWVzc2FnZS5jb25maWcudXJsLFxuICAgICAgICAgIGNvbnRlbnQ6IG1lc3NhZ2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICAgICAgZHVyYXRpb246IDNcbiAgICAgICAgICAvLyBjb250YWluZXI6IFwiYm9keVwiXG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgfVxuKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gIC5kaXJlY3RpdmUoJ2NvbGxhcHNlJywgWyckdHJhbnNpdGlvbicsIGZ1bmN0aW9uICgkdHJhbnNpdGlvbikge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICB2YXIgaW5pdGlhbEFuaW1Ta2lwID0gdHJ1ZTtcbiAgICAgICAgdmFyIGN1cnJlbnRUcmFuc2l0aW9uO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRvVHJhbnNpdGlvbihjaGFuZ2UpIHtcbiAgICAgICAgICB2YXIgbmV3VHJhbnNpdGlvbiA9ICR0cmFuc2l0aW9uKGVsZW1lbnQsIGNoYW5nZSk7XG4gICAgICAgICAgaWYgKGN1cnJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICAgICAgICBjdXJyZW50VHJhbnNpdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFRyYW5zaXRpb24gPSBuZXdUcmFuc2l0aW9uO1xuICAgICAgICAgIG5ld1RyYW5zaXRpb24udGhlbihuZXdUcmFuc2l0aW9uRG9uZSwgbmV3VHJhbnNpdGlvbkRvbmUpO1xuICAgICAgICAgIHJldHVybiBuZXdUcmFuc2l0aW9uO1xuXG4gICAgICAgICAgZnVuY3Rpb24gbmV3VHJhbnNpdGlvbkRvbmUoKSB7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgaXQncyB0aGlzIHRyYW5zaXRpb24sIG90aGVyd2lzZSwgbGVhdmUgaXQgYWxvbmUuXG4gICAgICAgICAgICBpZiAoY3VycmVudFRyYW5zaXRpb24gPT09IG5ld1RyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICAgY3VycmVudFRyYW5zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwYW5kKCkge1xuICAgICAgICAgIGlmIChpbml0aWFsQW5pbVNraXApIHtcbiAgICAgICAgICAgIGluaXRpYWxBbmltU2tpcCA9IGZhbHNlO1xuICAgICAgICAgICAgZXhwYW5kRG9uZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpLmFkZENsYXNzKCdjb2xsYXBzaW5nJyk7XG4gICAgICAgICAgICBkb1RyYW5zaXRpb24oeyBoZWlnaHQ6IGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ICsgJ3B4JyB9KS50aGVuKGV4cGFuZERvbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4cGFuZERvbmUoKSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpO1xuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlIGluJyk7XG4gICAgICAgICAgZWxlbWVudC5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb2xsYXBzZSgpIHtcbiAgICAgICAgICBpZiAoaW5pdGlhbEFuaW1Ta2lwKSB7XG4gICAgICAgICAgICBpbml0aWFsQW5pbVNraXAgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbGxhcHNlRG9uZSgpO1xuICAgICAgICAgICAgZWxlbWVudC5jc3Moe2hlaWdodDogMH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBDU1MgdHJhbnNpdGlvbnMgZG9uJ3Qgd29yayB3aXRoIGhlaWdodDogYXV0bywgc28gd2UgaGF2ZSB0byBtYW51YWxseSBjaGFuZ2UgdGhlIGhlaWdodCB0byBhIHNwZWNpZmljIHZhbHVlXG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7IGhlaWdodDogZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgKyAncHgnIH0pO1xuICAgICAgICAgICAgLy90cmlnZ2VyIHJlZmxvdyBzbyBhIGJyb3dzZXIgcmVhbGl6ZXMgdGhhdCBoZWlnaHQgd2FzIHVwZGF0ZWQgZnJvbSBhdXRvIHRvIGEgc3BlY2lmaWMgdmFsdWVcbiAgICAgICAgICAgIHZhciB4ID0gZWxlbWVudFswXS5vZmZzZXRXaWR0aDtcblxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2UgaW4nKS5hZGRDbGFzcygnY29sbGFwc2luZycpO1xuXG4gICAgICAgICAgICBkb1RyYW5zaXRpb24oeyBoZWlnaHQ6IDAgfSkudGhlbihjb2xsYXBzZURvbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbGxhcHNlRG9uZSgpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJyk7XG4gICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnY29sbGFwc2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5jb2xsYXBzZSwgZnVuY3Rpb24gKHNob3VsZENvbGxhcHNlKSB7XG4gICAgICAgICAgaWYgKHNob3VsZENvbGxhcHNlKSB7XG4gICAgICAgICAgICBjb2xsYXBzZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBhbmQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKVxuICAuZmFjdG9yeSgnJHRyYW5zaXRpb24nLCBbJyRxJywgJyR0aW1lb3V0JywgJyRyb290U2NvcGUnLCBmdW5jdGlvbigkcSwgJHRpbWVvdXQsICRyb290U2NvcGUpIHtcblxuICB2YXIgJHRyYW5zaXRpb24gPSBmdW5jdGlvbihlbGVtZW50LCB0cmlnZ2VyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgZW5kRXZlbnROYW1lID0gJHRyYW5zaXRpb25bb3B0aW9ucy5hbmltYXRpb24gPyAnYW5pbWF0aW9uRW5kRXZlbnROYW1lJyA6ICd0cmFuc2l0aW9uRW5kRXZlbnROYW1lJ107XG5cbiAgICB2YXIgdHJhbnNpdGlvbkVuZEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQudW5iaW5kKGVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZEhhbmRsZXIpO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChlbmRFdmVudE5hbWUpIHtcbiAgICAgIGVsZW1lbnQuYmluZChlbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICAvLyBXcmFwIGluIGEgdGltZW91dCB0byBhbGxvdyB0aGUgYnJvd3NlciB0aW1lIHRvIHVwZGF0ZSB0aGUgRE9NIGJlZm9yZSB0aGUgdHJhbnNpdGlvbiBpcyB0byBvY2N1clxuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCBhbmd1bGFyLmlzU3RyaW5nKHRyaWdnZXIpICkge1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKHRyaWdnZXIpO1xuICAgICAgfSBlbHNlIGlmICggYW5ndWxhci5pc0Z1bmN0aW9uKHRyaWdnZXIpICkge1xuICAgICAgICB0cmlnZ2VyKGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmICggYW5ndWxhci5pc09iamVjdCh0cmlnZ2VyKSApIHtcbiAgICAgICAgZWxlbWVudC5jc3ModHJpZ2dlcik7XG4gICAgICB9XG4gICAgICAvL0lmIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0cmFuc2l0aW9ucywgaW5zdGFudGx5IHJlc29sdmVcbiAgICAgIGlmICggIWVuZEV2ZW50TmFtZSApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFkZCBvdXIgY3VzdG9tIGNhbmNlbCBmdW5jdGlvbiB0byB0aGUgcHJvbWlzZSB0aGF0IGlzIHJldHVybmVkXG4gICAgLy8gV2UgY2FuIGNhbGwgdGhpcyBpZiB3ZSBhcmUgYWJvdXQgdG8gcnVuIGEgbmV3IHRyYW5zaXRpb24sIHdoaWNoIHdlIGtub3cgd2lsbCBwcmV2ZW50IHRoaXMgdHJhbnNpdGlvbiBmcm9tIGVuZGluZyxcbiAgICAvLyBpLmUuIGl0IHdpbGwgdGhlcmVmb3JlIG5ldmVyIHJhaXNlIGEgdHJhbnNpdGlvbkVuZCBldmVudCBmb3IgdGhhdCB0cmFuc2l0aW9uXG4gICAgZGVmZXJyZWQucHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICggZW5kRXZlbnROYW1lICkge1xuICAgICAgICBlbGVtZW50LnVuYmluZChlbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmRIYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIGRlZmVycmVkLnJlamVjdCgnVHJhbnNpdGlvbiBjYW5jZWxsZWQnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG5cbiAgLy8gV29yayBvdXQgdGhlIG5hbWUgb2YgdGhlIHRyYW5zaXRpb25FbmQgZXZlbnRcbiAgdmFyIHRyYW5zRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyYW5zJyk7XG4gIHZhciB0cmFuc2l0aW9uRW5kRXZlbnROYW1lcyA9IHtcbiAgICAnV2Via2l0VHJhbnNpdGlvbic6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAnTW96VHJhbnNpdGlvbic6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAnT1RyYW5zaXRpb24nOiAnb1RyYW5zaXRpb25FbmQnLFxuICAgICd0cmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnXG4gIH07XG4gIHZhciBhbmltYXRpb25FbmRFdmVudE5hbWVzID0ge1xuICAgICdXZWJraXRUcmFuc2l0aW9uJzogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgJ01velRyYW5zaXRpb24nOiAnYW5pbWF0aW9uZW5kJyxcbiAgICAnT1RyYW5zaXRpb24nOiAnb0FuaW1hdGlvbkVuZCcsXG4gICAgJ3RyYW5zaXRpb24nOiAnYW5pbWF0aW9uZW5kJ1xuICB9O1xuICBmdW5jdGlvbiBmaW5kRW5kRXZlbnROYW1lKGVuZEV2ZW50TmFtZXMpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIGVuZEV2ZW50TmFtZXMpe1xuICAgICAgaWYgKHRyYW5zRWxlbWVudC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBlbmRFdmVudE5hbWVzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAkdHJhbnNpdGlvbi50cmFuc2l0aW9uRW5kRXZlbnROYW1lID0gZmluZEVuZEV2ZW50TmFtZSh0cmFuc2l0aW9uRW5kRXZlbnROYW1lcyk7XG4gICR0cmFuc2l0aW9uLmFuaW1hdGlvbkVuZEV2ZW50TmFtZSA9IGZpbmRFbmRFdmVudE5hbWUoYW5pbWF0aW9uRW5kRXZlbnROYW1lcyk7XG4gIHJldHVybiAkdHJhbnNpdGlvbjtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmlsdGVyKCdzZWxlY3RlZFRhZ3MnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFza3MsIHRhZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRhc2tzLmZpbHRlcihmdW5jdGlvbih0YXNrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGFzay5UYWdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ3MuaW5kZXhPZih0YXNrW2ldKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCduYXZiYXJTZWFyY2hlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQsIHByb3NwZWN0RmFjdG9yeSkge1xuICAgIGNvbnNvbGUubG9nKFwiSGVsbG8gbmF2YmFyXCIpXG4gICAgJHNjb3BlLnBvcG92ZXIgPSB7XG4gICAgICBcInRpdGxlXCI6IFwiVGl0bGVcIixcbiAgICAgIFwiY29udGVudFwiOiBcIkhlbGxvIFBvcG92ZXI8YnIgLz5UaGlzIGlzIGEgbXVsdGlsaW5lIG1lc3NhZ2UhXCJcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRvb2RvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJEb29cIilcbiAgICB9XG5cbiAgICAkc2NvcGUuYnV0dG9uID0ge1xuICBcInRvZ2dsZVwiOiBmYWxzZSxcbiAgXCJjaGVja2JveFwiOiB7XG4gICAgXCJsZWZ0XCI6IGZhbHNlLFxuICAgIFwibWlkZGxlXCI6IHRydWUsXG4gICAgXCJyaWdodFwiOiBmYWxzZVxuICB9LFxuICBcInJhZGlvXCI6IDJcbn07XG5cblxuJHNjb3BlLmNvbG9yID0gJ2JsdWUnO1xuICAgICAgJHNjb3BlLnNwZWNpYWxWYWx1ZSA9IHtcbiAgICAgICAgXCJpZFwiOiBcIjEyMzQ1XCIsXG4gICAgICAgIFwidmFsdWVcIjogXCJncmVlblwiXG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUucG9wb3ZlciA9IHtcbiAgXCJ0aXRsZVwiOiBcIkNvY2tzXCIsXG4gIFwiY29udGVudFwiOiBcIkhlbGxvIFBvcG92ZXI8YnIgLz5UaGlzIGlzIGEgbXVsdGlsaW5lIG1lc3NhZ2UhXCJcbn07XG5cbn0pXG4iLCIvKipcbiAqIGRpclBhZ2luYXRpb24gLSBBbmd1bGFySlMgbW9kdWxlIGZvciBwYWdpbmF0aW5nIChhbG1vc3QpIGFueXRoaW5nLlxuICpcbiAqXG4gKiBDcmVkaXRzXG4gKiA9PT09PT09XG4gKlxuICogRGFuaWVsIFRhYnVlbmNhOiBodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2QvbXNnL2FuZ3VsYXIvYW45UXB6cUlZaU0vcjh2LTNXMVg1dmNKXG4gKiBmb3IgdGhlIGlkZWEgb24gaG93IHRvIGR5bmFtaWNhbGx5IGludm9rZSB0aGUgbmctcmVwZWF0IGRpcmVjdGl2ZS5cbiAqXG4gKiBJIGJvcnJvd2VkIGEgY291cGxlIG9mIGxpbmVzIGFuZCBhIGZldyBhdHRyaWJ1dGUgbmFtZXMgZnJvbSB0aGUgQW5ndWxhclVJIEJvb3RzdHJhcCBwcm9qZWN0OlxuICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL3NyYy9wYWdpbmF0aW9uL3BhZ2luYXRpb24uanNcbiAqXG4gKiBDcmVhdGVkIGJ5IE1pY2hhZWwgb24gMDQvMDUvMTQuXG4gKi9cblxuYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdkaXJQYWdpbmF0ZScsIFsnJGNvbXBpbGUnLCAnJHBhcnNlJywgJyR0aW1lb3V0JywgJ3BhZ2luYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24oJGNvbXBpbGUsICRwYXJzZSwgJHRpbWVvdXQsIHBhZ2luYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiAge1xuICAgICAgICAgICAgcHJpb3JpdHk6IDUwMDAsIC8vSGlnaCBwcmlvcml0eSBtZWFucyBpdCB3aWxsIGV4ZWN1dGUgZmlyc3RcbiAgICAgICAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgICAgIGF0dHJzLiRzZXQoJ25nUmVwZWF0JywgYXR0cnMuZGlyUGFnaW5hdGUpOyAvL0FkZCBuZy1yZXBlYXQgdG8gdGhlIGRvbVxuXG4gICAgICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSBhdHRycy5kaXJQYWdpbmF0ZTtcbiAgICAgICAgICAgICAgICAvLyByZWdleCB0YWtlbiBkaXJlY3RseSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvYmxvYi9tYXN0ZXIvc3JjL25nL2RpcmVjdGl2ZS9uZ1JlcGVhdC5qcyNMMjExXG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gZXhwcmVzc2lvbi5tYXRjaCgvXlxccyooW1xcc1xcU10rPylcXHMraW5cXHMrKFtcXHNcXFNdKz8pKD86XFxzK3RyYWNrXFxzK2J5XFxzKyhbXFxzXFxTXSs/KSk/XFxzKiQvKTtcblxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJQYXR0ZXJuID0gL1xcfFxccyppdGVtc1BlclBhZ2U6W158XSovO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFsyXS5tYXRjaChmaWx0ZXJQYXR0ZXJuKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcInBhZ2luYXRpb24gZGlyZWN0aXZlOiB0aGUgJ2l0ZW1zUGVyUGFnZScgZmlsdGVyIG11c3QgYmUgc2V0LlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgaXRlbXNQZXJQYWdlRmlsdGVyUmVtb3ZlZCA9IG1hdGNoWzJdLnJlcGxhY2UoZmlsdGVyUGF0dGVybiwgJycpO1xuICAgICAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uR2V0dGVyID0gJHBhcnNlKGl0ZW1zUGVyUGFnZUZpbHRlclJlbW92ZWQpO1xuXG4gICAgICAgICAgICAgICAgLy9Ob3cgdGhhdCB3ZSBhZGRlZCBuZy1yZXBlYXQgdG8gdGhlIGVsZW1lbnQsIHByb2NlZWQgd2l0aCBjb21waWxhdGlvblxuICAgICAgICAgICAgICAgIC8vYnV0IHNraXAgZGlyZWN0aXZlcyB3aXRoIHByaW9yaXR5IDUwMDAgb3IgYWJvdmUgdG8gYXZvaWQgaW5maW5pdGVcbiAgICAgICAgICAgICAgICAvL3JlY3Vyc2lvbiAod2UgZG9uJ3Qgd2FudCB0byBjb21waWxlIG91cnNlbHZlcyBhZ2FpbilcbiAgICAgICAgICAgICAgICB2YXIgY29tcGlsZWQgPSAgJGNvbXBpbGUoZWxlbWVudCwgbnVsbCwgNTAwMCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhZ2luYXRpb25JZDtcbiAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbklkID0gYXR0cnMucGFnaW5hdGlvbklkIHx8IFwiX19kZWZhdWx0XCI7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnJlZ2lzdGVySW5zdGFuY2UocGFnaW5hdGlvbklkKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFBhZ2VHZXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRycy5jdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2VHZXR0ZXIgPSAkcGFyc2UoYXR0cnMuY3VycmVudFBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQtcGFnZSBhdHRyaWJ1dGUgd2FzIG5vdCBzZXQsIHdlJ2xsIG1ha2Ugb3VyIG93blxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuX19jdXJyZW50UGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGFnZUdldHRlciA9ICRwYXJzZSgnX19jdXJyZW50UGFnZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldEN1cnJlbnRQYWdlUGFyc2VyKHBhZ2luYXRpb25JZCwgY3VycmVudFBhZ2VHZXR0ZXIsIHNjb3BlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJzLnRvdGFsSXRlbXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRBc3luY01vZGVUcnVlKHBhZ2luYXRpb25JZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy50b3RhbEl0ZW1zKShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uR2V0dGVyKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCwgY29sbGVjdGlvbi5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vV2hlbiBsaW5raW5nIGp1c3QgZGVsZWdhdGUgdG8gdGhlIGxpbmsgZnVuY3Rpb24gcmV0dXJuZWQgYnkgdGhlIG5ldyBjb21waWxlXG4gICAgICAgICAgICAgICAgICAgIGNvbXBpbGVkKHNjb3BlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKVxuXG4gICAgLmRpcmVjdGl2ZSgnZGlyUGFnaW5hdGlvbkNvbnRyb2xzJywgWydwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKHBhZ2luYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBhbiBhcnJheSBvZiBwYWdlIG51bWJlcnMgKG9yIHRoZSAnLi4uJyBzdHJpbmcpIHdoaWNoIGlzIHVzZWQgaW4gYW4gbmctcmVwZWF0IHRvIGdlbmVyYXRlIHRoZVxuICAgICAgICAgKiBsaW5rcyB1c2VkIGluIHBhZ2luYXRpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGN1cnJlbnRQYWdlXG4gICAgICAgICAqIEBwYXJhbSByb3dzUGVyUGFnZVxuICAgICAgICAgKiBAcGFyYW0gcGFnaW5hdGlvblJhbmdlXG4gICAgICAgICAqIEBwYXJhbSBjb2xsZWN0aW9uTGVuZ3RoXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUGFnZXNBcnJheShjdXJyZW50UGFnZSwgY29sbGVjdGlvbkxlbmd0aCwgcm93c1BlclBhZ2UsIHBhZ2luYXRpb25SYW5nZSkge1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gW107XG4gICAgICAgICAgICB2YXIgdG90YWxQYWdlcyA9IE1hdGguY2VpbChjb2xsZWN0aW9uTGVuZ3RoIC8gcm93c1BlclBhZ2UpO1xuICAgICAgICAgICAgdmFyIGhhbGZXYXkgPSBNYXRoLmNlaWwocGFnaW5hdGlvblJhbmdlIC8gMik7XG4gICAgICAgICAgICB2YXIgcG9zaXRpb247XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFnZSA8PSBoYWxmV2F5KSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAnc3RhcnQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b3RhbFBhZ2VzIC0gaGFsZldheSA8IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAnZW5kJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAnbWlkZGxlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsbGlwc2VzTmVlZGVkID0gcGFnaW5hdGlvblJhbmdlIDwgdG90YWxQYWdlcztcbiAgICAgICAgICAgIHZhciBpID0gMTtcbiAgICAgICAgICAgIHdoaWxlIChpIDw9IHRvdGFsUGFnZXMgJiYgaSA8PSBwYWdpbmF0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZU51bWJlciA9IGNhbGN1bGF0ZVBhZ2VOdW1iZXIoaSwgY3VycmVudFBhZ2UsIHBhZ2luYXRpb25SYW5nZSwgdG90YWxQYWdlcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3BlbmluZ0VsbGlwc2VzTmVlZGVkID0gKGkgPT09IDIgJiYgKHBvc2l0aW9uID09PSAnbWlkZGxlJyB8fCBwb3NpdGlvbiA9PT0gJ2VuZCcpKTtcbiAgICAgICAgICAgICAgICB2YXIgY2xvc2luZ0VsbGlwc2VzTmVlZGVkID0gKGkgPT09IHBhZ2luYXRpb25SYW5nZSAtIDEgJiYgKHBvc2l0aW9uID09PSAnbWlkZGxlJyB8fCBwb3NpdGlvbiA9PT0gJ3N0YXJ0JykpO1xuICAgICAgICAgICAgICAgIGlmIChlbGxpcHNlc05lZWRlZCAmJiAob3BlbmluZ0VsbGlwc2VzTmVlZGVkIHx8IGNsb3NpbmdFbGxpcHNlc05lZWRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZXMucHVzaCgnLi4uJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZXMucHVzaChwYWdlTnVtYmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYWdlcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiB0aGUgcG9zaXRpb24gaW4gdGhlIHNlcXVlbmNlIG9mIHBhZ2luYXRpb24gbGlua3MgW2ldLCBmaWd1cmUgb3V0IHdoYXQgcGFnZSBudW1iZXIgY29ycmVzcG9uZHMgdG8gdGhhdCBwb3NpdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGlcbiAgICAgICAgICogQHBhcmFtIGN1cnJlbnRQYWdlXG4gICAgICAgICAqIEBwYXJhbSBwYWdpbmF0aW9uUmFuZ2VcbiAgICAgICAgICogQHBhcmFtIHRvdGFsUGFnZXNcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVQYWdlTnVtYmVyKGksIGN1cnJlbnRQYWdlLCBwYWdpbmF0aW9uUmFuZ2UsIHRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIHZhciBoYWxmV2F5ID0gTWF0aC5jZWlsKHBhZ2luYXRpb25SYW5nZS8yKTtcbiAgICAgICAgICAgIGlmIChpID09PSBwYWdpbmF0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG90YWxQYWdlcztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYWdpbmF0aW9uUmFuZ2UgPCB0b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvdGFsUGFnZXMgLSBoYWxmV2F5IDwgY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvdGFsUGFnZXMgLSBwYWdpbmF0aW9uUmFuZ2UgKyBpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFsZldheSA8IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50UGFnZSAtIGhhbGZXYXkgKyBpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogICd2aWV3cy9kaXJQYWdpbmF0aW9uLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgbWF4U2l6ZTogJz0/JyxcbiAgICAgICAgICAgICAgICBvblBhZ2VDaGFuZ2U6ICcmPydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnaW5hdGlvbklkO1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25JZCA9IGF0dHJzLnBhZ2luYXRpb25JZCB8fCBcIl9fZGVmYXVsdFwiO1xuICAgICAgICAgICAgICAgIGlmICghc2NvcGUubWF4U2l6ZSkgeyBzY29wZS5tYXhTaXplID0gOTsgfVxuICAgICAgICAgICAgICAgIHNjb3BlLmRpcmVjdGlvbkxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuZGlyZWN0aW9uTGlua3MpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5kaXJlY3Rpb25MaW5rcykgOiB0cnVlO1xuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kYXJ5TGlua3MgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5ib3VuZGFyeUxpbmtzKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuYm91bmRhcnlMaW5rcykgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICghcGFnaW5hdGlvblNlcnZpY2UuaXNSZWdpc3RlcmVkKHBhZ2luYXRpb25JZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkTWVzc2FnZSA9IChwYWdpbmF0aW9uSWQgIT09ICdfX2RlZmF1bHQnKSA/IFwiIChpZDogXCIgKyBwYWdpbmF0aW9uSWQgKyBcIikgXCIgOiBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJwYWdpbmF0aW9uIGRpcmVjdGl2ZTogdGhlIHBhZ2luYXRpb24gY29udHJvbHNcIiArIGlkTWVzc2FnZSArIFwiY2Fubm90IGJlIHVzZWQgd2l0aG91dCB0aGUgY29ycmVzcG9uZGluZyBwYWdpbmF0aW9uIGRpcmVjdGl2ZS5cIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcGFnaW5hdGlvblJhbmdlID0gTWF0aC5tYXgoc2NvcGUubWF4U2l6ZSwgNSk7XG4gICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBsYXN0OiAxLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiAxXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChwYWdpbmF0aW9uU2VydmljZS5nZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCkgKyAxKSAqIHBhZ2luYXRpb25TZXJ2aWNlLmdldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2luYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRQYWdlKHBhZ2luYXRpb25JZCk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBnZW5lcmF0ZVBhZ2VzQXJyYXkoY3VycmVudFBhZ2UsIHBhZ2luYXRpb25TZXJ2aWNlLmdldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25SYW5nZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5zZXRDdXJyZW50ID0gZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgvXlxcZCskLy50ZXN0KG51bSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwIDwgbnVtICYmIG51bSA8PSBzY29wZS5wYWdpbmF0aW9uLmxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRDdXJyZW50UGFnZShwYWdpbmF0aW9uSWQsIG51bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBnZW5lcmF0ZVBhZ2VzQXJyYXkobnVtLCBwYWdpbmF0aW9uU2VydmljZS5nZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25TZXJ2aWNlLmdldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uUmFuZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2luYXRpb24uY3VycmVudCA9IG51bTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgY2FsbGJhY2sgaGFzIGJlZW4gc2V0LCB0aGVuIGNhbGwgaXQgd2l0aCB0aGUgcGFnZSBudW1iZXIgYXMgYW4gYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUub25QYWdlQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm9uUGFnZUNoYW5nZSh7IG5ld1BhZ2VOdW1iZXIgOiBudW0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUGFnaW5hdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBnZW5lcmF0ZVBhZ2VzQXJyYXkoMSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uU2VydmljZS5nZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblJhbmdlKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnaW5hdGlvbi5jdXJyZW50ID0gcGFyc2VJbnQocGFnaW5hdGlvblNlcnZpY2UuZ2V0Q3VycmVudFBhZ2UocGFnaW5hdGlvbklkKSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2luYXRpb24ubGFzdCA9IHNjb3BlLnBhZ2VzW3Njb3BlLnBhZ2VzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUucGFnaW5hdGlvbi5sYXN0IDwgc2NvcGUucGFnaW5hdGlvbi5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zZXRDdXJyZW50KHNjb3BlLnBhZ2luYXRpb24ubGFzdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pXG5cbiAgICAuZmlsdGVyKCdpdGVtc1BlclBhZ2UnLCBbJ3BhZ2luYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24ocGFnaW5hdGlvblNlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZW1zUGVyUGFnZSwgcGFnaW5hdGlvbklkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIChwYWdpbmF0aW9uSWQpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25JZCA9IFwiX19kZWZhdWx0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXBhZ2luYXRpb25TZXJ2aWNlLmlzUmVnaXN0ZXJlZChwYWdpbmF0aW9uSWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJwYWdpbmF0aW9uIGRpcmVjdGl2ZTogdGhlIGl0ZW1zUGVyUGFnZSBpZCBhcmd1bWVudCAoaWQ6IFwiICsgcGFnaW5hdGlvbklkICsgXCIpIGRvZXMgbm90IG1hdGNoIGEgcmVnaXN0ZXJlZCBwYWdpbmF0aW9uLWlkLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVuZDtcbiAgICAgICAgICAgIHZhciBzdGFydDtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpdGVtc1BlclBhZ2UgPSBpdGVtc1BlclBhZ2UgfHwgOTk5OTk5OTk5OTtcbiAgICAgICAgICAgICAgICBpZiAocGFnaW5hdGlvblNlcnZpY2UuaXNBc3luY01vZGUocGFnaW5hdGlvbklkKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSAocGFnaW5hdGlvblNlcnZpY2UuZ2V0Q3VycmVudFBhZ2UocGFnaW5hdGlvbklkKSAtIDEpICogaXRlbXNQZXJQYWdlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbmQgPSBzdGFydCArIGl0ZW1zUGVyUGFnZTtcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkLCBpdGVtc1BlclBhZ2UpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKVxuXG4gICAgLnNlcnZpY2UoJ3BhZ2luYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZXMgPSB7fTtcbiAgICAgICAgdmFyIGxhc3RSZWdpc3RlcmVkSW5zdGFuY2U7XG4gICAgICAgIHRoaXMucGFnaW5hdGlvbkRpcmVjdGl2ZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdID0ge1xuICAgICAgICAgICAgICAgICAgICBhc3luY01vZGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsYXN0UmVnaXN0ZXJlZEluc3RhbmNlID0gaW5zdGFuY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmlzUmVnaXN0ZXJlZCA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgaW5zdGFuY2VzW2luc3RhbmNlSWRdICE9PSAndW5kZWZpbmVkJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMYXN0SW5zdGFuY2VJZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGxhc3RSZWdpc3RlcmVkSW5zdGFuY2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50UGFnZVBhcnNlciA9IGZ1bmN0aW9uKGluc3RhbmNlSWQsIHZhbCwgc2NvcGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jdXJyZW50UGFnZVBhcnNlciA9IHZhbDtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb250ZXh0ID0gc2NvcGU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jdXJyZW50UGFnZVBhcnNlci5hc3NpZ24oaW5zdGFuY2VzW2luc3RhbmNlSWRdLmNvbnRleHQsIHZhbCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLmN1cnJlbnRQYWdlUGFyc2VyKGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb250ZXh0KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldEl0ZW1zUGVyUGFnZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQsIHZhbCkge1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLml0ZW1zUGVyUGFnZSA9IHZhbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRJdGVtc1BlclBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLml0ZW1zUGVyUGFnZTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldENvbGxlY3Rpb25MZW5ndGggPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb2xsZWN0aW9uTGVuZ3RoID0gdmFsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldENvbGxlY3Rpb25MZW5ndGggPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLmNvbGxlY3Rpb25MZW5ndGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRBc3luY01vZGVUcnVlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLmFzeW5jTW9kZSA9IHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc0FzeW5jTW9kZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uYXN5bmNNb2RlO1xuICAgICAgICB9O1xuICAgIH0pXG47XG4iLCJhbmd1bGFyLm1vZHVsZSgnU2lnbmFsUicsIFtdKVxuICAgIC5jb25zdGFudCgnJCcsICQpXG4gICAgLmZhY3RvcnkoJ0h1YicsIFsnJCcsICckcScsXG4gICAgICAgIGZ1bmN0aW9uKCQsICRxKSB7XG4gICAgICAgICAgICAvL1RoaXMgd2lsbCBhbGxvdyBzYW1lIGNvbm5lY3Rpb24gdG8gYmUgdXNlZCBmb3IgYWxsIEh1YnNcbiAgICAgICAgICAgIC8vSXQgYWxzbyBrZWVwcyBjb25uZWN0aW9uIGFzIHNpbmdsZXRvbi5cbiAgICAgICAgICAgIHZhciBnbG9iYWxDb25uZWN0aW9uID0gbnVsbDtcblxuICAgICAgICAgICAgdmFyIGluaXRHbG9iYWxDb25uZWN0aW9uID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucm9vdFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsQ29ubmVjdGlvbiA9ICQuaHViQ29ubmVjdGlvbihvcHRpb25zLnJvb3RQYXRoLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyRGVmYXVsdFBhdGg6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbENvbm5lY3Rpb24gPSAkLmh1YkNvbm5lY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaHViTmFtZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHZhciBIdWIgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxDb25uZWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXRHbG9iYWxDb25uZWN0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbiA9IGdsb2JhbENvbm5lY3Rpb247XG4gICAgICAgICAgICAgICAgSHViLnByb3h5ID0gSHViLmNvbm5lY3Rpb24uY3JlYXRlSHViUHJveHkoaHViTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBIdWIub24gPSBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLnByb3h5Lm9uKGV2ZW50LCBmbik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBIdWIuaW52b2tlID0gZnVuY3Rpb24obWV0aG9kLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBIdWIucHJveHkuaW52b2tlLmFwcGx5KEh1Yi5wcm94eSwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgSHViLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24uc3RvcCgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgSHViLmNvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24uc3RhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0OiAnbG9uZ1BvbGxpbmcnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5saXN0ZW5lcnMsIGZ1bmN0aW9uKGZuLCBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSHViLm9uKGV2ZW50LCBmbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm1ldGhvZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMubWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBIdWJbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gJC5tYWtlQXJyYXkoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQobWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSHViLmludm9rZS5hcHBseShIdWIsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucXVlcnlQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24ucXMgPSBvcHRpb25zLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL0FkZGluZyBhZGRpdGlvbmFsIHByb3BlcnR5IG9mIHByb21pc2UgYWxsb3dzIHRvIGFjY2VzcyBpdCBpbiByZXN0IG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICAgICAgICAgICAgICAvLyAgIEh1Yi5wcm9taXNlID0gSHViLmNvbm5lY3Rpb24uc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIEh1Yi5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLnN0YXJ0KCkuZG9uZShmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiLCByZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBjb25uZWN0JywgSHViLmNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLnN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbi5kaXNjb25uZWN0ZWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2Nvbm5lY3RlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHViLmNvbm5lY3Rpb24uc3RhcnQoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBkb25lLCBidXQgbm90IGZhaWxlZFwiLCBIdWIuY29ubmVjdGlvbilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIEh1YjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICBdKTtcbiIsIiAgICBjbGFzcyBQcm9zcGVjdCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5Jc3N1ZXMgPSBbXG4gICAgICAgICAgICAgICAgZm9yICh4IG9mIG9iai5Jc3N1ZXMpIG5ldyBJc3N1ZSh4IHx8IHt9KVxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgdGhpcy5BY3Rpdml0aWVzID0gb2JqLkFjdGl2aXRpZXMubWFwKEMgPT4gbmV3IEFjdGl2aXR5KEMgfHwge30pKVxuICAgICAgICAgICAgdGhpcy5Db250YWN0cyA9IG9iai5Db250YWN0cy5tYXAoQyA9PiBuZXcgQ29udGFjdChDIHx8IHt9KSlcbiAgICAgICAgICAgIHRoaXMuQ3VzdG9tZXIgPSBuZXcgQ3VzdG9tZXIob2JqLkN1c3RvbWVyIHx8IHt9KTtcbiAgICAgICAgICAgIHRoaXMuSXNzdWVDb3VudCA9IG9iai5Jc3N1ZXMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5BY3Rpdml0eUNvdW50ID0gb2JqLkFjdGl2aXRpZXMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5Db250YWN0Q291bnQgPSBvYmouQ29udGFjdHMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5DdXN0b21lclR5cGUgPSBcIkFcIlxuICAgICAgICAgICAgLy8gdGhpcy5Qcm9zcGVjdFR5cGUgPSBcIlBcIlxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQ29udGFjdCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5BZGRyMSA9IHRoaXMuQWRkcjEgfHwgJydcbiAgICAgICAgICAgIHRoaXMuQWRkcjIgPSB0aGlzLkFkZHIyIHx8ICcnXG4gICAgICAgICAgICB0aGlzLkNpdHkgPSB0aGlzLkNpdHkgfHwgJydcbiAgICAgICAgICAgIHRoaXMuQ29udGFjdElEID0gdGhpcy5Db250YWN0SUQgfHwgJydcbiAgICAgICAgICAgIHRoaXMuRW1haWwgPSB0aGlzLkVtYWlsIHx8ICcnXG4gICAgICAgICAgICB0aGlzLkZheCA9IHRoaXMuRmF4IHx8ICcnXG4gICAgICAgICAgICB0aGlzLk1vYmlsZSA9IHRoaXMuTW9iaWxlIHx8ICcnXG4gICAgICAgICAgICB0aGlzLk5hbWUgPSB0aGlzLk5hbWUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuUGhvbmUgPSB0aGlzLlBob25lIHx8ICcnXG4gICAgICAgICAgICB0aGlzLlN0YXRlID0gdGhpcy5TdGF0ZSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5aaXAgPSB0aGlzLlppcCB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5UeXBlcyA9IHRoaXMuVHlwZXMgfHwgW107XG4gICAgICAgICAgICAvLyBmaW5cbiAgICAgICAgICAgIHRoaXMuSHVtYW5UeXBlc18gPSBfLnBsdWNrKG9iai5UeXBlcywgJ1R5cGUnKVxuICAgICAgICAgICAgdGhpcy5PbGRUeXBlcyA9IFtdXG4gICAgICAgIH1cbiAgICAgICAgc2V0IEh1bWFuVHlwZXModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuT2xkVHlwZXMgPSB0aGlzLkh1bWFuVHlwZXNfO1xuICAgICAgICAgICAgdGhpcy5IdW1hblR5cGVzXyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGdldCBIdW1hblR5cGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSHVtYW5UeXBlc19cbiAgICAgICAgfVxuICAgICAgICBnZXQgb2xkX3ZzX25ldygpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ29sZCc6IHRoaXMuT2xkVHlwZXMsXG4gICAgICAgICAgICAgICAgJ25ldyc6IHRoaXMuSHVtYW5UeXBlc19cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIElzc3VlIHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLmlzc3VlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBvYmouQ3JlYXRpb25EYXRlVGltZTtcbiAgICAgICAgICAgIHRoaXMuZW5kID0gb2JqLkNvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICAgICAgdGhpcy5zdGFydEh1bWFuID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJMTFwiKVxuICAgICAgICAgICAgdGhpcy5lbmRIdW1hbiA9IG1vbWVudChvYmouQ29tcGxldGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJsbFwiKVxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gb2JqLkRlc2NyaXB0aW9uLnN1YnN0cmluZygwLCA1KTtcbiAgICAgICAgICAgIHRoaXMudHlwZU9mID0gXCJDbG9zZWQgSXNzdWVzXCJcbiAgICAgICAgICAgIGlmICh0aGlzLmVuZCA9PSBcIjE5MDAtMDEtMDFUMDA6MDA6MDBcIikge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmVuZFxuICAgICAgICAgICAgICAgIHRoaXMuZW5kSHVtYW4gPSBcIlN0aWxsIG9wZW5lZFwiXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9wZW5Jc3N1ZVwiXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlT2YgPSBcIk9wZW4gSXNzdWVzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMueWVhciA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKSk7XG4gICAgICAgICAgICB0aGlzLm1vbnRoID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJNTVwiKSk7XG4gICAgICAgICAgICB0aGlzLmRheSA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiREREXCIpKTtcbiAgICAgICAgICAgIHRoaXMubW9udGhfeWVhciA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikgKyBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIilcbiAgICAgICAgICAgIHRoaXMueWVhcl9kYXkgPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkRERFwiKSArIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKVxuICAgICAgICAgICAgdGhpcy5yZXBseUNvdW50ID0gb2JqLkZvbGxvd3Vwcy5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLkZvbGxvd3VwcyA9IFtcbiAgICAgICAgICAgICAgICBmb3IgKHggb2Ygb2JqLkZvbGxvd3VwcykgbmV3IEZvbGxvd3Vwcyh4IHx8IHt9KVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQWN0aXZpdHkge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuaXNzdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRIdW1hbiA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTExcIilcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBvYmouQ3JlYXRpb25EYXRlVGltZTtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBBY3Rpdml0aWVzLkNyZWF0aW9uRGF0ZVRpbWU7XG4gICAgICAgICAgICAvLyB0aGlzLmNvbnRlbnQgPSBvYmouTm90ZS5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBcIjEgbm90ZVwiXG4gICAgICAgICAgICAvLyBkZWxldGUgYWN0aXZpdGllcy5Ob3RlO1xuICAgICAgICAgICAgdGhpcy50eXBlT2YgPSBcIkFsbCBBY3Rpdml0aWVzXCI7XG4gICAgICAgICAgICB0aGlzLnllYXIgPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIikpO1xuICAgICAgICAgICAgdGhpcy5tb250aCA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikpO1xuICAgICAgICAgICAgdGhpcy5kYXkgPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkRERFwiKSk7XG4gICAgICAgICAgICB0aGlzLnNtYWxsRGF5ID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERFwiKSk7XG4gICAgICAgICAgICB0aGlzLm1vbnRoX3llYXIgPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIk1NXCIpICsgbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpO1xuICAgICAgICAgICAgdGhpcy55ZWFyX2RheSA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiREREXCIpICsgbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpO1xuICAgICAgICAgICAgdGhpcy5UeXBlX0h1bWFuID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzcHJlYWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMyAtIDEpKSArIDE7XG4gICAgICAgICAgICAgICAgaWYgKHNwcmVhZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlBob25lXCJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJWaXNpdFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgdGhpcy50aW1lYmV0d2VlbiA9IFwiMiB3ZWVrc1wiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBGb2xsb3d1cHMge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuaXNzdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRIdW1hbiA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwibGxcIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIEFkZEV2ZW50IHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqLCBpbmZvKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLkRhdGUgPSBtb21lbnQodGhpcy5EYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgLy8gdGhpcy5Qcm9zcGVjdElEID0gJzInXG4gICAgICAgICAgICAvLyB0aGlzLkNhbXBhaWduSUQgPSBpbmZvLkNhbXBhaWduSUQ7XG4gICAgICAgICAgICAvLyB0aGlzLkNyZWF0aW9uVXNlciA9IGluZm8uQ3JlYXRpb25Vc2VyO1xuICAgICAgICAgICAgLy8gdGhpcy5Qcm9kdWN0SUQgPSBpbmZvLlByb2R1Y3RJRDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIEFkZElzc3VlIHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqLCBpbmZvKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLkNvbXBsZXRpb25EYXRlVGltZSA9ICcxOTAwLTAxLTAxJ1xuICAgICAgICAgICAgdGhpcy5TdGF0dXMgPSAwO1xuICAgICAgICAgICAgdGhpcy5Qcm9kdWN0SUQgPSAxO1xuICAgICAgICB9XG4gICAgfVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcigncHJvc3BlY3RDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIHByb3NwZWN0RmFjdG9yeSwgJGxvY2F0aW9uLCBMb2dpblNlcnZpY2UsICRtb2RhbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvIHByb3NwZWN0XCIpXG4gICAgICAgICRzY29wZS5kZXRhaWxzID0ge1xuICAgICAgICAgICAgdXNlcjogTG9naW5TZXJ2aWNlLnVzZXJcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuY29udGFjdENvbGxhcHNlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmlzc3VlQ29sbGFwc2UgPSB0cnVlO1xuXG4gICAgICAgICRzY29wZS5BZGRFdmVudCA9IHt9O1xuICAgICAgICAkc2NvcGUuQWRkQ29udGFjdCA9IHt9O1xuICAgICAgICAkc2NvcGUuQ29udGFjdEtleXMgPSBbXVxuXG4gICAgICAgICRzY29wZS50aGVfUHJvc3BlY3Q7XG4gICAgICAgICRzY29wZS50aGVfUHJvc3BlY3RfZWRpdCA9IHt9O1xuICAgICAgICAvLyAkc2NvcGUuQ29udGFjdHMgPSBbXTtcbiAgICAgICAgY29uc29sZS5sb2coJHN0YXRlLnBhcmFtcylcbiAgICAgICAgJHNjb3BlLmNvbnRhY3RUeXBlID0gW3tcbiAgICAgICAgICAgIHZhbHVlOiAnMScsXG4gICAgICAgICAgICBsYWJlbDogJ093bmVyJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJzInLFxuICAgICAgICAgICAgbGFiZWw6ICdJbiBDaGFyZ2UnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnMycsXG4gICAgICAgICAgICBsYWJlbDogJ0dhbWJsZXInXG4gICAgICAgIH1dO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRDb250YWN0VHlwZSA9IFtdO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LmdldFByb3NwZWN0X2J5X0lEKCRzdGF0ZS5wYXJhbXMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IHByb3NwZWN0XCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdCA9IG5ldyBQcm9zcGVjdChkYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllcy5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnRoZV9Qcm9zcGVjdClcbiAgICAgICAgICAgICAgICB0aW1lQmV0d2VlbigpO1xuICAgICAgICAgICAgICAgIG1ha2VUaW1lbGluZSgpO1xuICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9ICRzY29wZS50aGVfUHJvc3BlY3QuQ29udGFjdHNbMF1cbiAgICAgICAgICAgICAgICAkc2NvcGUuZGV0YWlscy5DYW1wYWlnbklEID0gMDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGV0YWlscy5DcmVhdGlvblVzZXIgPSBcIm1lXCI7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRldGFpbHMuUHJvZHVjdElEID0gMDtcbiAgICAgICAgICAgICAgICAvLyBjYXN0IHRvIG5ldyBDb250YWN0IHNvIG9uIHNhdmUgaXQgaGFzIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAkc2NvcGUuQWRkQ29udGFjdCA9IG5ldyBDb250YWN0KHt9KTtcbiAgICAgICAgICAgICAgICBkZWxldGUgJHNjb3BlLkFkZENvbnRhY3QuSHVtYW5UeXBlc187XG4gICAgICAgICAgICAgICAgZGVsZXRlICRzY29wZS5BZGRDb250YWN0Lk9sZFR5cGVzO1xuICAgICAgICAgICAgICAgICRzY29wZS5Db250YWN0S2V5cyA9IE9iamVjdC5rZXlzKCRzY29wZS5BZGRDb250YWN0KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdoZW4gbG9hZGluZyBtb2RhbCwgY2xlYXIgdGhlIG1vZGVsLiBFbHNlIHNldCBcImVkaXRcIiB0byBmYWxzZVxuICAgICAgICAkc2NvcGUuY2xlYXJNb2RlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLkFkZENvbnRhY3QgPSBuZXcgQ29udGFjdCh7fSk7XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLkFkZENvbnRhY3QuSHVtYW5UeXBlc187XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLkFkZENvbnRhY3QuT2xkVHlwZXM7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdENvbnRhY3RCb29sID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZWRpdENvbnRhY3RCb29sID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5tb2RhbFNhdmVDb250YWN0ID0gZnVuY3Rpb24oY29udGFjdCwgbW9kYWwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSGVycCBkZXJwXCIsIGNvbnRhY3QpXG4gICAgICAgICAgICBpZiAoIWNvbnRhY3QuVHlwZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNdXN0IHNlbGVjdCBhIHR5cGVcIilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB3ZSdyZSBlZGl0aW5nIGFuZCBub3Qgc2F2aW5nXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVkaXRDb250YWN0Qm9vbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG8gc29tZSBlZGl0IGh0dHBcIilcbiAgICAgICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuRWRpdENvbnRhY3QoY29udGFjdCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkFkZENvbnRhY3QoY29udGFjdCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQ29udGFjdHMucHVzaChuZXcgQ29udGFjdChjb250YWN0KSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZWRpdENvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVkaXRcIiwgY29udGFjdClcbiAgICAgICAgICAgIC8vIHByZXBvcHVsYXRlIHRoZSBtb2RlbFxuICAgICAgICAgICAgJHNjb3BlLkFkZENvbnRhY3QgPSBjb250YWN0O1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRDb250YWN0Qm9vbCA9IHRydWU7XG4gICAgICAgICAgICAvLyBwcm9zcGVjdEZhY3RvcnkuRWRpdENvbnRhY3QoY29udGFjdClcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5wcm9zcGVjdEVkaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRWRpdGluZyBwcm9zcGVjdFwiKVxuICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdF9lZGl0ID0gT2JqZWN0LmFzc2lnbigkc2NvcGUudGhlX1Byb3NwZWN0X2VkaXQsICRzY29wZS50aGVfUHJvc3BlY3QpO1xuICAgICAgICAgICAgZGVsZXRlICRzY29wZS50aGVfUHJvc3BlY3RfZWRpdC5BY3Rpdml0aWVzO1xuICAgICAgICAgICAgZGVsZXRlICRzY29wZS50aGVfUHJvc3BlY3RfZWRpdC5Db250YWN0cztcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUudGhlX1Byb3NwZWN0X2VkaXQuQ3VzdG9tZXI7XG4gICAgICAgICAgICBkZWxldGUgJHNjb3BlLnRoZV9Qcm9zcGVjdF9lZGl0Lklzc3VlcztcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5lZGl0SXNzdWVCb29sID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5lZGl0RXZlbnRCb29sID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5lZGl0RXZlbnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVycFwiLCBldnQpXG4gICAgICAgICAgICBpZiAoZXZ0Lmlzc3VlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIuLi4uaXNzdWUuLi5cIilcbiAgICAgICAgICAgICAgICAvLyBwcmVwb3B1bGF0ZSBtb2RlbFxuICAgICAgICAgICAgICAgICRzY29wZS5BZGRJc3N1ZSA9IG5ldyBBZGRJc3N1ZShldnQpXG4gICAgICAgICAgICAgICAgdmFyIG15TW9kYWwgPSAkbW9kYWwoe1xuICAgICAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJy9zcmMvanMvcHJvc3BlY3QvYWRkLWlzc3VlLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRJc3N1ZUJvb2wgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIuLi4ubm90ZS9ldmVudC4uLlwiKVxuICAgICAgICAgICAgICAgICRzY29wZS5BZGRFdmVudCA9IG5ldyBBZGRFdmVudChldnQpXG4gICAgICAgICAgICAgICAgdmFyIG15TW9kYWwgPSAkbW9kYWwoe1xuICAgICAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJy9zcmMvanMvcHJvc3BlY3QvYWRkLWV2ZW50Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRFdmVudEJvb2wgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1vZGFsU2F2ZVByb3NwZWN0ID0gZnVuY3Rpb24oZXZ0LCBtb2RhbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgcHJvc3BlY3RcIilcbiAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5FZGl0UHJvc3BlY3QoZXZ0KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnVuc2hpZnQobmV3IEFjdGl2aXR5KGV2dCkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUubW9kYWxTYXZlQWN0aXZpdHkgPSBmdW5jdGlvbihldnQsIG1vZGFsKSB7XG4gICAgICAgICAgICB2YXIgYWN0aXZpdHkgPSBuZXcgQWRkRXZlbnQoZXZ0LCAkc2NvcGUuZGV0YWlscyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk15IGFjdGl2aXR5IFwiLCBhY3Rpdml0eSlcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZWRpdEV2ZW50Qm9vbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2UncmUgZWRpdGluZyBhbiBldmVudFwiKVxuICAgICAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5FZGl0RXZlbnQoYWN0aXZpdHkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5BZGRFdmVudChhY3Rpdml0eSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnVuc2hpZnQobmV3IEFjdGl2aXR5KGV2dCkpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tb2RhbFNhdmVJc3N1ZSA9IGZ1bmN0aW9uKGlzc3VlLCBtb2RhbCkge1xuICAgICAgICAgICAgdmFyIGlzc3VlID0gbmV3IEFkZElzc3VlKGlzc3VlKVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lZGl0SXNzdWVCb29sKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0IG5vdCBzYXZlXCIpXG4gICAgICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkVkaXRJc3N1ZShpc3N1ZSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkFkZElzc3VlKGlzc3VlKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5Jc3N1ZXMucHVzaChuZXcgSXNzdWUoaXNzdWUpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tYWtlQWN0aXZlID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNYWtlIGFjdGl2ZVwiLCBjb250YWN0KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNjcm9sbHRvSHJlZiA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpZClcbiAgICAgICAgICAgIGlmIChpZCA9PSAnRGV0YWlscycpIHtcbiAgICAgICAgICAgICAgICAvLyAkbG9jYXRpb24uaGFzaChpZCk7XG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbEJ5KDAsIC01MDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHRoZSBsb2NhdGlvbi5oYXNoIHRvIHRoZSBpZCBvZlxuICAgICAgICAgICAgICAgIC8vIHRoZSBlbGVtZW50IHlvdSB3aXNoIHRvIHNjcm9sbCB0by5cbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uaGFzaChpZCk7XG4gICAgICAgICAgICAgICAgLy8gd2luZG93LnNjcm9sbEJ5KDAsLTEwMCk7XG4gICAgICAgICAgICAgICAgLy8gY2FsbCAkYW5jaG9yU2Nyb2xsKClcbiAgICAgICAgICAgICAgICAvLyAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgICAgdmFyIHpvb21jb3VudCA9IDNcblxuICAgICAgICAkc2NvcGUuY3VycmVudENvbnRhY3RcblxuICAgICAgICAkc2NvcGUuY2xpY2tUYWIgPSAxO1xuXG4gICAgICAgICRzY29wZS5vbkNsaWNrVGFiID0gZnVuY3Rpb24oYm9vbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYm9vbClcbiAgICAgICAgICAgICRzY29wZS5jbGlja1RhYiA9IGJvb2w7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmlzQWN0aXZlVGFiID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRhY3QgPT0gJHNjb3BlLmN1cnJlbnRDb250YWN0O1xuICAgICAgICB9XG5cblxuICAgICAgICAvL2ZvciB0aGUgcHJvc3BlY3QgZGV0YWlscyBsaXN0XG4gICAgICAgICRzY29wZS5pc0NvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgLy9zaG93IGRldGFpbHMgaXMgd2hlbiB0aGV5IGNsaWNrIGEgdGltZWxpbmUgZXZlbnRcbiAgICAgICAgJHNjb3BlLnNob3dEZXRhaWxzID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLnNhdmVDb250YWN0ID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTYXZpbmcgY29udGFjdC4uLlwiLCBjb250YWN0KVxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBmaWx0ZXJzXG4gICAgICAgICRzY29wZS5maWx0ZXJzID0gWydBbGwgQWN0aXZpdGllcycsICdPbmx5IE15IEFjdGl2aXRpZXMnLCAnQ2xvc2VkIElzc3VlcycsICdPcGVuIElzc3VlcycsICdUcmluZXQnLCAnUHJvZml0R3VhcmQnXTtcbiAgICAgICAgLy8gc2VsZWN0ZWQgZmlsdGVyc1xuICAgICAgICAkc2NvcGUuc2VsZWN0aW9uID0gWydBbGwgQWN0aXZpdGllcycsICdDbG9zZWQgSXNzdWVzJywgJ09wZW4gSXNzdWVzJywgJ1RyaW5ldCcsICdQcm9maXRHdWFyZCddO1xuICAgICAgICAvLyB0b2dnbGUgc2VsZWN0aW9uIGZvciBhIGdpdmVuIGZpbHRlciBieSBuYW1lXG4gICAgICAgICRzY29wZS50b2dnbGVTZWxlY3Rpb24gPSBmdW5jdGlvbiB0b2dnbGVTZWxlY3Rpb24oZmlsdGVyTmFtZSkge1xuICAgICAgICAgICAgdmFyIGlkeCA9ICRzY29wZS5zZWxlY3Rpb24uaW5kZXhPZihmaWx0ZXJOYW1lKTtcbiAgICAgICAgICAgIC8vIGlzIGN1cnJlbnRseSBzZWxlY3RlZFxuICAgICAgICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGlvbi5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICBkZWxldGVGaWx0ZXIoZmlsdGVyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpcyBuZXdseSBzZWxlY3RlZFxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWRkRmlsdGVyKGZpbHRlck5hbWUpO1xuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3Rpb24ucHVzaChmaWx0ZXJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBhbm5vdGF0ZSAnbm90ZXMnIHdpdGggdGltZSBkaWZmLCBpZS4gJ3R3byBkYXlzIHNpbmNlIGxhc3QnXG4gICAgICAgIGZ1bmN0aW9uIHRpbWVCZXR3ZWVuKCkge1xuICAgICAgICAgICAgdmFyIGFycmF5ID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzXG4gICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaV0ueWVhcilcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaV0ubW9udGgpXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFycmF5W2ldLnNtYWxsRGF5KVxuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IG1vbWVudChhcnIpO1xuICAgICAgICAgICAgICAgICAgICBhcnIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaSArIDFdLnllYXIpXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGFycmF5W2kgKyAxXS5tb250aClcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaSArIDFdLnNtYWxsRGF5KVxuICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IG1vbWVudChhcnIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IGEuZGlmZihiLCAnZGF5cycpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllc1tpICsgMV0udGltZWJldHdlZW4gPSBkaWZmICsgXCIgZGF5cy4uLlwiXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaWZmID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllc1tpICsgMV0udGltZWJldHdlZW4gPSBcIlNhbWUgZGF5XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXNbMF0udGltZWJldHdlZW4gPSBcIlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRvbmVcIiwgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzWzBdLnRpbWViZXR3ZWVuKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlRmlsdGVyKGZpbHRlck5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpdGVtc0dldCA9IGl0ZW1zLmdldCgpO1xuICAgICAgICAgICAgdmFyIHJlbW92ZSA9IF8uZmlsdGVyKGl0ZW1zR2V0LCBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtLnR5cGVPZiA9PSBmaWx0ZXJOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0ZW1zLnJlbW92ZShyZW1vdmUpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGRGaWx0ZXIoZmlsdGVyTmFtZSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1zR2V0ID0gQWN0aXZpdGllc19hbmRfSXNzdWVzO1xuICAgICAgICAgICAgdmFyIGFkZHMgPSBfLmZpbHRlcihpdGVtc0dldCwgZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bS50eXBlT2YgPT0gZmlsdGVyTmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpdGVtcy5hZGQoYWRkcylcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aW1lbGluZTtcbiAgICAgICAgdmFyIGl0ZW1zO1xuICAgICAgICB2YXIgQWN0aXZpdGllc19hbmRfSXNzdWVzO1xuXG4gICAgICAgIGZ1bmN0aW9uIG1ha2VUaW1lbGluZSgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWFraW5nIHRpbWVsaW5lLi4udGhpcyBjb25jYXRzIGFsbCBldmVudHMgb24gdGhlIHNhbWUgZGF5XCIpXG5cbiAgICAgICAgICAgIEFjdGl2aXRpZXNfYW5kX0lzc3VlcyA9ICRzY29wZS50aGVfUHJvc3BlY3QuSXNzdWVzLmNvbmNhdCgkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXMpXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbXBhcmVOdW1iZXJzKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5kYXkgLSBiLmRheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEFjdGl2aXRpZXNfYW5kX0lzc3Vlcy5zb3J0KGNvbXBhcmVOdW1iZXJzKVxuXG4gICAgICAgICAgICB2YXIgZHVwZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciByYW5nZXMgPSBfLnBsdWNrKEFjdGl2aXRpZXNfYW5kX0lzc3VlcywgJ3llYXJfZGF5Jyk7XG4gICAgICAgICAgICB2YXIgcmFuZ2VzID0gXy51bmlxKHJhbmdlcylcbiAgICAgICAgICAgIHZhciBtb3RoZXJzaGlwID0gW11cbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlLCBpdCkge1xuICAgICAgICAgICAgICAgIHZhciBncm91cHMgPSBfLndoZXJlKEFjdGl2aXRpZXNfYW5kX0lzc3Vlcywge1xuICAgICAgICAgICAgICAgICAgICAneWVhcl9kYXknOiByYW5nZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIHB1bGwgb3V0IGlzc3Vlc1xuICAgICAgICAgICAgICAgIHZhciBpc3N1ZXMgPSBbXVxuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGdyb3Vwcy5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUuaXNzdWUgJiYgZ3JvdXBzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGdyb3Vwcy5pbmRleE9mKHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzID0gZ3JvdXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICBtb3RoZXJzaGlwLnB1c2goaXNzdWVzKVxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb3RoZXJzaGlwLnB1c2goZ3JvdXBzKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIEFjdGl2aXRpZXNfYW5kX0lzc3VlcyA9IFtdO1xuICAgICAgICAgICAgbW90aGVyc2hpcC5mb3JFYWNoKGZ1bmN0aW9uKGFycikge1xuICAgICAgICAgICAgICAgIGlmIChhcnJbMF0uaXNzdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJc3N1ZSBpbiBtb3RoZXJzaGlwXCIpXG4gICAgICAgICAgICAgICAgICAgIGFyclswXS5jb250ZW50ID0gXCJJc3N1ZVwiXG4gICAgICAgICAgICAgICAgICAgIEFjdGl2aXRpZXNfYW5kX0lzc3Vlcy5wdXNoKGFyclswXSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcnJbMF0uY29udGVudCA9IGFyci5sZW5ndGggKyBcIiBOb3Rlc1wiXG4gICAgICAgICAgICAgICAgICAgIGFyclswXS53YXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYXJyWzBdLnN1Ym5vdGVzID0gYXJyO1xuICAgICAgICAgICAgICAgICAgICBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMucHVzaChhcnJbMF0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaXRlbXMgPSBuZXcgdmlzLkRhdGFTZXQoQWN0aXZpdGllc19hbmRfSXNzdWVzKTtcblxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aXN1YWxpemF0aW9uJyk7XG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB6b29tYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgLy8gaGVpZ2h0OiAnMjAwcHgnLFxuICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvLyAgIG1pbjogbmV3IERhdGUoMjAxNCwgbW9tZW50KCkuc3VidHJhY3QoJ21vbnRoJywgMikuZm9ybWF0KFwiTVwiKSwgMSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKDIwMTQsIG1vbWVudCgpLnN1YnRyYWN0KCdtb250aCcsIDIpLmZvcm1hdChcIk1cIiksIDEpLFxuICAgICAgICAgICAgICAgIC8vIG1heDogbmV3IERhdGUoMjAxNCwgNywgMSlcbiAgICAgICAgICAgICAgICBtYXg6IG5ldyBEYXRlKDIwMTQsIG1vbWVudCgpLmFkZCgnbW9udGgnLCAyKS5mb3JtYXQoXCJNXCIpLCAxKVxuICAgICAgICAgICAgICAgIC8vICAgem9vbU1pbjogMTAwMCAqIDYwICogNjAgKiAyNCAgICAgICAgICAgIC8vIG9uZSBkYXkgaW4gbWlsbGlzZWNvbmRzLCBmdXJ0aGVzdCBcImluXCJcbiAgICAgICAgICAgICAgICAvLyB6b29tTWF4OiAxMDAwICogNjAgKiA2MCAqIDI0ICogMzEgKiAzICAgLy8gYWJvdXQgdGhyZWUgbW9udGhzIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRpbWVsaW5lID0gbmV3IHZpcy5UaW1lbGluZShjb250YWluZXIsIGl0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdyYW5nZWNoYW5nZWQnLCBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gdmFyIHN0YXJ0ID0gbmV3IERhdGUodGltZS5zdGFydClcbiAgICAgICAgICAgICAgICAvLyBzdGFydCA9IHN0YXJ0LnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsMTUpXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVuZCA9IG5ldyBEYXRlKHRpbWUuZW5kKVxuICAgICAgICAgICAgICAgIC8vIGVuZCA9IGVuZC50b1N0cmluZygpLnN1YnN0cmluZygwLDE1KVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXJ0LCBlbmQpXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coIG1vbWVudChlbmQpLmlzQWZ0ZXIoc3RhcnQpICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBcIlNlbGVjdCBhbiBldmVudFwiO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ0V2ZW50KGV2ZW50LCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtc1sgcHJvcGVydGllcy5pdGVtc1swXSBdKVxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBpdGVtcy5fZGF0YVtwcm9wZXJ0aWVzLml0ZW1zWzBdXVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNvbnRlbnQuY29udGVudClcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gY29udGVudC5Ob3RlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29udGVudClcbiAgICAgICAgICAgIGlmIChjb250ZW50Lndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNwZWNpYWwgbWVzc2FnZSAtPiBnb3RvIG5vdGVcIilcbiAgICAgICAgICAgICAgICBnb3RvTm90ZShjb250ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGVudC5pc3N1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlY2lhbCBpc3N1ZSAtPiBnb3RvIGlzc3VlXCIpXG4gICAgICAgICAgICAgICAgZ290b0lzc3VlKGNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLm1zZ0luZm8gPSBjb250ZW50O1xuICAgICAgICAgICAgJHNjb3BlLnNob3dEZXRhaWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnb3RvSXNzdWUobm90ZSkge1xuICAgICAgICAgICAgLy9nb3RvIG5vdGUgc2hvdWxkIHJlc2V0IHpvb20gdG8gXCJiYXNlbGluZVwiXG4gICAgICAgICAgICB6b29tY291bnQgPSAzXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgIHZhciBtb250aFN0YXJ0ID0gbW9tZW50KG5vdGUuc3RhcnQpLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KFwiRFwiKVxuICAgICAgICAgICAgdmFyIG1vbnRoRW5kID0gbW9tZW50KG5vdGUuc3RhcnQpLmVuZE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKHllYXIsIG1vbnRoLTEsIGRheSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKG5vdGUueWVhciwgbm90ZS5tb250aCAtIDEsIG1vbnRoU3RhcnQpLFxuICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhFbmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm90ZSwgbW9udGhTdGFydCwgbW9udGhFbmQpXG4gICAgICAgICAgICBub3RlLmNvbnRlbnQgPSBub3RlLkRlc2NyaXB0aW9uLnN1YnN0cmluZygwLCAyMClcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gbm90ZS5EZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIHRpbWVsaW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRpbWVsaW5lID0gbmV3IHZpcy5UaW1lbGluZShjb250YWluZXIsIGl0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gZ290b05vdGUobm90ZSkge1xuICAgICAgICAgICAgLy9nb3RvIG5vdGUgc2hvdWxkIHJlc2V0IHpvb20gdG8gXCJiYXNlbGluZVwiXG4gICAgICAgICAgICB6b29tY291bnQgPSAzXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgIHZhciBtb250aFN0YXJ0ID0gbW9tZW50KG5vdGUuc3RhcnQpLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KFwiRFwiKVxuICAgICAgICAgICAgdmFyIG1vbnRoRW5kID0gbW9tZW50KG5vdGUuc3RhcnQpLmVuZE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKHllYXIsIG1vbnRoLTEsIGRheSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKG5vdGUueWVhciwgbm90ZS5tb250aCAtIDEsIG1vbnRoU3RhcnQpLFxuICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhFbmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2cobm90ZSwgbW9udGhTdGFydCwgbW9udGhFbmQpXG4gICAgICAgICAgICBub3RlLnN1Ym5vdGVzLmZvckVhY2goZnVuY3Rpb24obm90ZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub3RlcylcbiAgICAgICAgICAgICAgICBub3Rlcy5jb250ZW50ID0gbm90ZXMuTm90ZS5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgICAgICAgICAgLy8gaXRlbXMuY2xlYXIoKVxuICAgICAgICAgICAgICAgIGl0ZW1zLnJlbW92ZShub3RlLmlkKVxuICAgICAgICAgICAgICAgIGl0ZW1zLmFkZChub3RlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aW1lbGluZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aW1lbGluZS5vbignc2VsZWN0JywgZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGxvZ0V2ZW50KCdzZWxlY3QnLCBwcm9wZXJ0aWVzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogWm9vbSB0aGUgdGltZWxpbmUgYSBnaXZlbiBwZXJjZW50YWdlIGluIG9yIG91dFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcGVyY2VudGFnZSAgIEZvciBleGFtcGxlIDAuMSAoem9vbSBvdXQpIG9yIC0wLjEgKHpvb20gaW4pXG4gICAgICAgICAqL1xuICAgICAgICAvLyAgdmFyIHpvb21jb3VudCA9IDNcbiAgICAgICAgZnVuY3Rpb24gem9vbSh6b29tX2luKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFtb3VudHNcIiwgem9vbWNvdW50LCB6b29tX2luKVxuICAgICAgICAgICAgem9vbWNvdW50ID0gem9vbWNvdW50ICsgem9vbV9pblxuICAgICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgICBpZiAoem9vbWNvdW50ID09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyB6b29tY291bnQrK1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWm9vbSBpblwiLCB6b29tY291bnQpXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKDIwMTQsIDUsIDEpLCAvL2Z1cnRoZXN0IGJhY2sgeW91IGNhbiBnb1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoMjAxNCwgNSwgMSksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUoMjAxNCwgNywgMSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8vIHByZXZlbnRzIHpvb20gY291bnQgZnJvbSBnb2luZyBwYXN0IDRcbiAgICAgICAgICAgICAgICB6b29tY291bnQgPSAzO1xuICAgICAgICAgICAgICAgIHpvb21UaW1lbGluZSgpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHpvb21jb3VudCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgLy8gem9vbWNvdW50LS1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlpvb20gb3V0ICdtb250aCB2aWV3JyBcIiwgem9vbWNvdW50KVxuICAgICAgICAgICAgICAgIGNvb2xuZXdTb3J0TWV0aG9kKCk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKDIwMTIsIDcsIDEpLCAvL2Z1cnRoZXN0IGJhY2sgeW91IGNhbiBnb1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoMjAxNCwgMSwgMSksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUoMjAxNCwgNywgMSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHpvb21UaW1lbGluZSgpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHpvb21jb3VudCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldpbGRjYXJkIHpvb20sIHBsYWNlaG9sZGVyLi4uVG9kb1wiLCB6b29tY291bnQpXG4gICAgICAgICAgICAgICAgem9vbVRpbWVsaW5lKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoem9vbWNvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY2FuY2VsIHpvb21cIiwgem9vbWNvdW50KVxuICAgICAgICAgICAgICAgIHpvb21jb3VudCsrXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHpvb21UaW1lbGluZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgICAgICB0aW1lbGluZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGltZWxpbmUgPSBuZXcgdmlzLlRpbWVsaW5lKGNvbnRhaW5lciwgaXRlbXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ0V2ZW50KCdzZWxlY3QnLCBwcm9wZXJ0aWVzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXR0YWNoIGV2ZW50cyB0byB0aGUgbmF2aWdhdGlvbiBidXR0b25zXG4gICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tSW4nKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICB6b29tKDEpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbU91dCcpLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHpvb20oLTEpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAkc2NvcGUuaWNvbnMgPSBbe1xuICAgICAgICAgICAgdmFsdWU6IDEsXG4gICAgICAgICAgICBsYWJlbDogJ093bmVyJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogMixcbiAgICAgICAgICAgIGxhYmVsOiAnUGVyc29uIGluJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogMyxcbiAgICAgICAgICAgIGxhYmVsOiAnQmVzdCBGcmllbmQnXG4gICAgICAgIH1dO1xuXG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIHZhciB0YXJnID0gXy5maW5kV2hlcmUoJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0cywgY29udGFjdClcbiAgICAgICAgICAgIHZhciBkaWZmID0gdGFyZy5vbGRfdnNfbmV3O1xuICAgICAgICAgICAgLy8gbmVlZCB0byBjaGVjayB0aGUgbGVuZ3RoIHRvIHNlZSBpZiBpdCdzIGFuIGFkZCBvciBhIGRlbGV0ZVxuICAgICAgICAgICAgaWYgKGRpZmYub2xkLmxlbmd0aCA+IGRpZmYubmV3Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gXy5kaWZmZXJlbmNlKGRpZmYub2xkLCBkaWZmLm5ldyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWJ0cmFjdGVkXCIsIGNoYW5nZWQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gXy5kaWZmZXJlbmNlKGRpZmYubmV3LCBkaWZmLm9sZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGRlZFwiLCBjaGFuZ2VkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBjb29sbmV3U29ydE1ldGhvZCgpIHtcbiAgICAgICAgICAgIHZhciBtb250aHMgPSAxMlxuICAgICAgICAgICAgdmFyIHllYXJzID0gWzIwMTAsIDIwMTEsIDIwMTIsIDIwMTMsIDIwMTRdXG4gICAgICAgICAgICB2YXIgcmFuZ2VzID0gXy5wbHVjayhBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMsICdtb250aF95ZWFyJyk7XG4gICAgICAgICAgICB2YXIgcmFuZ2VzID0gXy51bmlxKHJhbmdlcylcbiAgICAgICAgICAgIHZhciBtb3RoZXJzaGlwID0gW11cbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlLCBpdCkge1xuICAgICAgICAgICAgICAgIHZhciBncm91cHMgPSBfLndoZXJlKEFjdGl2aXRpZXNfYW5kX0lzc3Vlcywge1xuICAgICAgICAgICAgICAgICAgICAnbW9udGhfeWVhcic6IHJhbmdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbW90aGVyc2hpcFtpdF0gPSBncm91cHM7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpdGVtcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBtb3RoZXJzaGlwLmZvckVhY2goZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGFyclswXS5pZDtcbiAgICAgICAgICAgICAgICBhcnJbMF0uY29udGVudCA9IGFyci5sZW5ndGggKyBcIiBOb3Rlc1wiXG4gICAgICAgICAgICAgICAgYXJyWzBdLndhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFyclswXS5zdWJub3RlcyA9IGFycjtcbiAgICAgICAgICAgICAgICBpdGVtcy5hZGQoYXJyWzBdKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmZhY3RvcnkoJ3Byb3NwZWN0RmFjdG9yeScsXG4gICAgICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICB2YXIgcHJvc3BlY3RJRDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX3JlcXVlc3Q6IGZ1bmN0aW9uKG1ldGhvZCA9ICdnZXQnLCBzdWZmaXggPSAnJywgZGF0YSA9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBgaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvcHJvc3BlY3QvJHtwcm9zcGVjdElEfS8ke3N1ZmZpeH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFByb3NwZWN0X2J5X0lEOiBmdW5jdGlvbihwcm9zcGVjdCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9zcGVjdElEID0gcHJvc3BlY3QuUHJvc3BlY3RJRFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnZ2V0Jyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBZGRFdmVudDogZnVuY3Rpb24obkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuRXZlbnQgPSAkLnBhcmFtKG5FdmVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Bvc3QnLCBgQWN0aXZpdHlgLCBuRXZlbnQpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBFZGl0RXZlbnQ6IGZ1bmN0aW9uKG15RXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGV2ZW50SUQgPSBFdmVudC5FdmVudElEOyBub3QgdXNlZFxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbXlFdmVudC5zdWJub3RlcyAvLyBhcnJheSB0aHJvd3MgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdmFyIG15RXZlbnQgPSAkLnBhcmFtKG15RXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncHV0JywgYEFjdGl2aXR5YCwgbXlFdmVudClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFkZENvbnRhY3Q6IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhY3QgPSAkLnBhcmFtKGNvbnRhY3QpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwb3N0JywgYENvbnRhY3RgLCBjb250YWN0KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgRWRpdENvbnRhY3Q6IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhY3RJRCA9IGNvbnRhY3QuQ29udGFjdElEO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFjdCA9ICQucGFyYW0oY29udGFjdCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdwdXQnLCBgQ29udGFjdC8ke2NvbnRhY3RJRH1gLCBjb250YWN0KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgQWRkSXNzdWU6IGZ1bmN0aW9uKGlzc3VlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc3N1ZSA9ICQucGFyYW0oaXNzdWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncG9zdCcsIGBJc3N1ZWAsIGlzc3VlKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgRWRpdElzc3VlOiBmdW5jdGlvbihpc3N1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImlzc3VlXCIsIGlzc3VlKVxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNzdWVJRCA9IGlzc3VlLklzc3VlSUQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpc3N1ZSA9ICQucGFyYW0oaXNzdWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncHV0JywgYElzc3VlLyR7aXNzdWVJRH1gLCBpc3N1ZSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEVkaXRQcm9zcGVjdDogZnVuY3Rpb24ocHJvc3BlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHByb3NwZWN0SUQgPSBwcm9zcGVjdC5Qcm9zcGVjdElEO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvc3BlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9zcGVjdFtrZXldID09ICcnIHx8IHByb3NwZWN0W2tleV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJCbGFuayB2YWx1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3NwZWN0W2tleV0gPSBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvc3BlY3QgPSAkLnBhcmFtKHByb3NwZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3B1dCcsICcnLCBwcm9zcGVjdClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcigncXVlcnlDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGxvY2F0aW9uLCBxdWVyeUZhY3RvcnksICRxLCAkYWxlcnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJxdWVyeSBDb250cm9sbGVyXCIsICRzdGF0ZVBhcmFtcylcbiAgICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUucmVzdWx0cyA9IHt9O1xuICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSB7XG4gICAgICAgICAgICBpdGVtc1BlclBhZ2U6IDEwLFxuICAgICAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZSxcbiAgICAgICAgICAgIG1heFBhZ2VzOiA1XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLnF1ZXJ5TmFtZSA9IFwiXCI7XG4gICAgICAgICRzY29wZS5wcm9kdWN0TGlzdCA9IFtcbiAgICAgICAgICAgIFwiVHJpTmV0XCIsXG4gICAgICAgICAgICBcIlByb2ZpdEd1YXJkXCJcbiAgICAgICAgXVxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRQcm9kdWN0O1xuICAgICAgICAkc2NvcGUucXVlcnlMaXN0O1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRRdWVyeTtcbiAgICAgICAgJHNjb3BlLkNsaWNraW5nX3RoZV90YWJsZV9ub3dfcGVyZm9ybXNfaHR0cCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuUXVlcnlJRDtcbiAgICAgICAgJHNjb3BlLnBhcmFtcztcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkU3RhdGVzID0gW107XG4gICAgICAgICRzY29wZS5zdGF0ZXMgPSBbe1xuICAgICAgICAgICAgdmFsdWU6ICdLYW5zYXMnLFxuICAgICAgICAgICAgbGFiZWw6ICdLYW5zYXMnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnQUsnLFxuICAgICAgICAgICAgbGFiZWw6ICdBcmthbnNhcydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdNTycsXG4gICAgICAgICAgICBsYWJlbDogJ01pc3NvdXJpJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ1RYJyxcbiAgICAgICAgICAgIGxhYmVsOiAnVGV4YXMnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnTlknLFxuICAgICAgICAgICAgbGFiZWw6ICdOZXcgWW9yaydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdDQScsXG4gICAgICAgICAgICBsYWJlbDogJ0NhbGlmb3JuaWEnXG4gICAgICAgIH0sIF07XG4gICAgICAgICRzY29wZS5xdWVyeVBhcmFtcyA9IHtcbiAgICAgICAgICAgIFN0YXRlOiBbXVxuICAgICAgICB9XG4gICAgICAgIC8vIG5nLW1vZGVsXG4gICAgICAgICRzY29wZS5zYXZlT2JqZWN0ID0ge307XG5cbiAgICAgICAgLy8gcG9wdWxhdGUgcXVlcnkgbGlzdDtcbiAgICAgICAgcXVlcnlGYWN0b3J5LmdldFF1ZXJpZXMoKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5TGlzdCA9IGRhdGEuZGF0YVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgJHNjb3BlLmZpbmRRdWVyeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnBcIiwgJHNjb3BlLnNlbGVjdGVkUXVlcnkpXG4gICAgICAgICAgICBxdWVyeUZhY3Rvcnkuc2luZ2xlUXVlcnkoJHNjb3BlLnNlbGVjdGVkUXVlcnkuUXVlcnlJRCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNvIHRoZSB1c2VyIHdhbnRzIHRvIHNlZS4uLlwiLCBkYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkLmRlcGFyYW0oZGF0YS5kYXRhLlBhcmFtU3RyKVxuICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRzID0gZGF0YS5kYXRhLnJvd3M7XG4gICAgICAgICAgICAgICAgJHNjb3BlLlF1ZXJ5SUQgPSBkYXRhLmRhdGEuUXVlcnlJRDtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSAkc2NvcGUucGFyYW1zLlN0YXRlO1xuICAgICAgICAgICAgICAgICRzY29wZS5DbGlja2luZ190aGVfdGFibGVfbm93X3BlcmZvcm1zX2h0dHAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS5zYXZlT2JqZWN0Lk5hbWUgPSBcIkxPQURFRCBGUk9NIERST1BET1dOIC0tIHF1ZXJ5IG5hbWUgaXMgXCIgKyBkYXRhLmRhdGEuTmFtZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vICRzY29wZS5zZWxlY3RlZFN0YXRlID0gJyc7XG5cbiAgICAgICAgJHNjb3BlLnF1ZXJ5U2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBjbGVhcmluZyBvbGQgcmVzdWx0c1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSB7fTtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzUmV0dXJuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHNlYXJjaC4uLnBsZWFzZSB3YWl0Li4uXCIpXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHNldCBlYWNoIHZhcmlhYmxlIHdoZW4gbG9hZGVkLlxuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5UGFyYW1zLlN0YXRlID0gJHNjb3BlLnNlbGVjdGVkU3RhdGVzXG5cbiAgICAgICAgICAgIC8vIFRPRE8gZ2V0IFByb2R1Y3QgZnJvbSBzZWxlY3RcbiAgICAgICAgICAgICRzY29wZS5xdWVyeVBhcmFtcy5Qcm9kdWN0SUQgPSAxXG5cbiAgICAgICAgICAgIHZhciBzdWJtaXQgPSBxdWVyeUZhY3RvcnkucXVlcnlSZXN1bHRzKCRzY29wZS5xdWVyeVBhcmFtcyk7XG4gICAgICAgICAgICB2YXIgcHJvY2VzcyA9IHN1Ym1pdC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR290IGl0Li4uXCIsIGRhdGEuZGF0YSlcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKCRzY29wZS5xdWVyeVBhcmFtcylcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09IDQwMSlcbiAgICAgICAgICAgICAgICAvLyB1bmF1dGhvcml6ZWRcbiAgICAgICAgICAgICAgICAvLyAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiNDAxIGlzIGhhbmRsZWQgYnkgSW50ZXJjZXB0b3JzXCIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLndob2EgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiV2hvYVwiKVxuICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5TmFtZSgkc2NvcGUuUXVlcnlJRCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNPTVBMRVRFXCIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUuRGVsZXRlUHJvc3BlY3QgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMuZm9yRWFjaCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhLlByb3NwZWN0SUQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYS5TdGF0dXMgPyBhLlN0YXR1cyA9IDAgOiBhLlN0YXR1cyA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUZhY3RvcnkudXBkYXRlUXVlcnlTdGF0dXMoJHNjb3BlLlF1ZXJ5SUQsIGlkLCBhLlN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zYXZlVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGVcIilcbiAgICAgICAgICAgICAgICAkc2NvcGUud2hvYSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNhdmVPYmplY3Qucm93cyA9ICRzY29wZS5yZXN1bHRzO1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSAkbG9jYXRpb24uc2VhcmNoKCk7XG4gICAgICAgICAgICAgICAgdmFyIG1vZCA9ICQucGFyYW0ocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdC5QYXJhbVN0ciA9IG1vZDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdC5Qcm9kdWN0ID0gMTtcbiAgICAgICAgICAgICAgICBxdWVyeUZhY3Rvcnkuc2F2ZVF1ZXJ5KCRzY29wZS5zYXZlT2JqZWN0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZS5jYW1wYWlnbi5uZXcnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW1wYWlnbklEOiByZXMuZGF0YS5RdWVyeUlEXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG15QWxlcnQgPSAkYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVyci5zdGF0dXMudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGVyci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdvSHJlZiA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldilcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrZWQgb24gbG9hZDtcbiAgICAgICAgaWYgKCRzdGF0ZVBhcmFtcy5TdGF0ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHJlYWQgdGhlIFVSTCBhbmQgc2V0IGVhY2ggJHNjb3BlIHZhcmlhYmxlXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSBbJHN0YXRlUGFyYW1zLlN0YXRlXVxuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5U2VhcmNoKCk7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ3F1ZXJ5RmFjdG9yeScsXG4vLyBub3cgUmVzZWFyY2ggRmFjdG9yeVxuIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHF1ZXJ5UmVzdWx0czpmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0dGluZyBxdWVyeSB3aXRoIHBhcmFtcyBcIiwgdXJsKVxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoJywge3BhcmFtczogdXJsIH0gKVxuICAgICAgICB9LFxuICAgICAgICByZW1vdmVRdWVyeTogZnVuY3Rpb24ocm93SUQpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJycpXG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZVByb3NwZWN0OiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9wcm9zcGVjdHMnLCB7cGFyYW1zOiB7J3N0YXJ0JzogJzUnLCAnZW5kJzogJzIwJ30gfSApXG4gICAgICAgIH0sXG4gICAgICAgIHNhdmVRdWVyeTogZnVuY3Rpb24ocHJvc3BlY3RzKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmUgcXVlcnkgUHJvc3BlY3RzIFwiLCBwcm9zcGVjdHMpXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoJywgJC5wYXJhbShwcm9zcGVjdHMpIClcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0UXVlcmllczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC9saXN0JylcbiAgICAgICAgfSxcbiAgICAgICAgc2luZ2xlUXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5SUQpe1xuICAgICAgICAgIC8vIEVTNiBUZW1wbGF0ZSBTdHJpbmdzXG4gICAgICAgICAgLy8gcmV0dXJuICRodHRwLmdldChgL2FwaS9xdWVyeS8ke3F1ZXJ5SUR9YClcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgcXVlcnlJRCk7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVF1ZXJ5TmFtZTogZnVuY3Rpb24ocXVlcnlJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvJyArIHF1ZXJ5SUQsICQucGFyYW0oeydOYW1lJzogJ0FuZ3VsYXInfSkgKVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVRdWVyeVN0YXR1czogZnVuY3Rpb24oUXVlcnlJRCwgUHJvc3BlY3RJRCwgc3RhdHVzKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgUXVlcnlJRCArICcvJyArIFByb3NwZWN0SUQsICQucGFyYW0oeydTdGF0dXMnOiBzdGF0dXN9KSApXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdyb2xlc0ZhY3RvcnknLFxuLy8gbm93IFJlc2VhcmNoIEZhY3RvcnlcbiBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsaXN0Um9sZXM6ZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1JvbGVzJyApXG4gICAgICAgIH0sXG4gICAgICAgIGdldFVzZXJzOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMnKVxuICAgICAgICB9LFxuICAgICAgICBhZGRSb2xlOmZ1bmN0aW9uKHVzZXIsIHJvbGVJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3VzZXJzLycrdXNlcisnL1JvbGVzLycrcm9sZUlEKVxuICAgICAgICB9XG4gICAgfTtcbiAgfVxuKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcigncm9sZXNDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIHJvbGVzRmFjdG9yeSkge1xuICBjb25zb2xlLmxvZyhcIlJvbGVzIGNvbnRyb2xsZXJcIilcblxuICAkc2NvcGUuYXZhaWxhYmxlUm9sZXM7XG4gIHJvbGVzRmFjdG9yeS5saXN0Um9sZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKFwiR290IHJvbGVzLi4uXCIsIGRhdGEuZGF0YSlcbiAgICAkc2NvcGUuYXZhaWxhYmxlUm9sZXMgPSBkYXRhLmRhdGE7XG4gIH0pO1xuXG4gICRzY29wZS5hdmFpbGFibGVVc2VycztcbiAgcm9sZXNGYWN0b3J5LmdldFVzZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCB1c2Vyc1wiLCBkYXRhLmRhdGEpXG4gICAgJHNjb3BlLmF2YWlsYWJsZVVzZXJzID0gZGF0YS5kYXRhLlVzZXJMaXN0XG4gIH0pXG5cblxuICAkc2NvcGUuYWRkUm9sZSA9IGZ1bmN0aW9uKG5hbWUsIHJvbGVJRCl7XG4gICAgY29uc29sZS5sb2cobmFtZSwgcm9sZUlEKVxuICAgIHJvbGVzRmFjdG9yeS5hZGRSb2xlKG5hbWUsIHJvbGVJRCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiKVxuICAgIH0pXG4gIH1cblxufSlcbiIsIlxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcignc2VhcmNoQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQsIHNlYXJjaEZhY3RvcnksICR0aW1lb3V0LCAkbG9jYXRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbyBzZWFyY2hcIilcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hib3hcIikuZm9jdXMoKTtcbiAgICAgICAgJHNjb3BlLnBhcmFtc09iaiA9IHtcbiAgICAgICAgICAgIFByb3NwZWN0SUQ6ICcnXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUucHJvc3BlY3RUeXBlID0gW3tcbiAgICAgICAgICAgIHZhbHVlOiAnUCcsXG4gICAgICAgICAgICBsYWJlbDogJ1Byb3NwZWN0J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ0EnLFxuICAgICAgICAgICAgbGFiZWw6ICdBY3RpdmUnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnRicsXG4gICAgICAgICAgICBsYWJlbDogJ0Zvcm1lcidcbiAgICAgICAgfV07XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFByb3NwZWN0VHlwZSA9ICRzY29wZS5wcm9zcGVjdFR5cGUubWFwKHR5cGUgPT4gdHlwZS52YWx1ZSlcbiAgICAgICAgJHNjb3BlLmN1c3RvbWVyVHlwZSA9IFt7XG4gICAgICAgICAgICB2YWx1ZTogJ1AnLFxuICAgICAgICAgICAgbGFiZWw6ICdQcm9maXRHdWFyZCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdOJyxcbiAgICAgICAgICAgIGxhYmVsOiAnTmVnb3RpYXRvcidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdTJyxcbiAgICAgICAgICAgIGxhYmVsOiAnU2VydmljZXMgT25seSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdHJyxcbiAgICAgICAgICAgIGxhYmVsOiAnR292ZXJubWVudCdcbiAgICAgICAgfV07XG5cbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQ3VzdG9tZXJUeXBlID0gJHNjb3BlLmN1c3RvbWVyVHlwZS5tYXAodHlwZSA9PiB0eXBlLnZhbHVlKVxuXG5cbiAgICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQ3VzdG9tZXJUeXBlID0gW1xuICAgICAgICAvLyAgICAgZm9yICh7XG4gICAgICAgIC8vICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIG9mICRzY29wZS5jdXN0b21lclR5cGUpIHZhbHVlXG4gICAgICAgIC8vIF1cblxuICAgICAgICAkc2NvcGUuQkRNcyA9IFsnQkRNMDEnLCAnQkRNMDInLCAnQkRNMDMnLCAnQkRNMDQnXVxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCRE0gPSBbXG4gICAgICAgICAgICBmb3IgKHggb2YgJHNjb3BlLkJETXMpIHhcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFyYW1zXCIsICRzdGF0ZS5wYXJhbXMpXG5cbiAgICAgICAgdmFyIHN0YXRlUGFyYW1zID0gJHN0YXRlLnBhcmFtc1xuICAgICAgICBPYmplY3Qua2V5cyhzdGF0ZVBhcmFtcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN0YXRlUGFyYW1zW2tleV0pIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RhdGVQYXJhbXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJHb3RcIiwgc3RhdGVQYXJhbXMpXG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHN0YXRlUGFyYW1zKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUncyBwYXJhbXMsIGd1eXMhISFcIilcbiAgICAgICAgICAgIHNlYXJjaEZhY3Rvcnkuc2VhcmNoKHN0YXRlUGFyYW1zKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lbXB0eVJlc3VsdHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlYXJjaFJlc3VsdHMgPSByZXMuZGF0YS5tYXAoc2VhcmNoUmVzdWx0ID0+IG5ldyBQcm9zcGVjdChzZWFyY2hSZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAvLyByZXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHByb3NwZWN0KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICRzY29wZS5zZWFyY2hSZXN1bHRzLnB1c2goIG5ldyBQcm9zcGVjdChwcm9zcGVjdCkgKVxuICAgICAgICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lbXB0eVJlc3VsdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGRhdGFcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnNlYXJjaFJlc3VsdHMpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBzdGF0ZSBwYXJhbXMgcHJlc2VudFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGl0ZW1zUGVyUGFnZTogMTAsXG4gICAgICAgICAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICAkc2NvcGUuZW1wdHlSZXN1bHRzID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5zZWFyY2hTdHJpbmcgPSAnJ1xuXG4gICAgICAgICRzY29wZS5zdGFydFNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdGFydD9cIiwgJHNjb3BlLnBhcmFtc09iailcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCRzY29wZS5wYXJhbXNPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5wYXJhbXNPYmpba2V5XSA9ICRzY29wZS5zZWFyY2hTdHJpbmc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCgkc2NvcGUucGFyYW1zT2JqKVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNlYXJjaE9wdGlvbnMgPSBbXG4gICAgICAgICAgICAnUHJvc3BlY3RJRCcsXG4gICAgICAgICAgICAnQ3VzdElEJyxcbiAgICAgICAgICAgICdOQ1BEUCcsXG4gICAgICAgICAgICAnTlBJJ1xuICAgICAgICBdXG4gICAgICAgIC8vIHNldHMgZGVmYXVsdCB0byAnUHJvc3BlY3RJRCdcbiAgICAgICAgJHNjb3BlLml0ZW0gPSAkc2NvcGUuc2VhcmNoT3B0aW9uc1swXVxuXG4gICAgICAgIC8vIHNldCAkc2NvcGUucGFyYW1zT2JqIGZyb20gZHJvcGRvd25cbiAgICAgICAgJHNjb3BlLnNlYXJjaFNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hib3hcIikuZm9jdXMoKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCRzY29wZS5wYXJhbXNPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUucGFyYW1zT2JqW2tleV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkc2NvcGUucGFyYW1zT2JqWyRzY29wZS5pdGVtXSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdvdG9Qcm9zcGVjdCA9IGZ1bmN0aW9uKHByb3NwZWN0SUQpIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZS5wcm9zcGVjdCcsIHtcbiAgICAgICAgICAgICAgICBQcm9zcGVjdElEOiBwcm9zcGVjdElEXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLkNpdHlTdGF0ZVppcF9zdHJpbmc7XG5cbiAgICAgICAgJHNjb3BlLmZuQ2l0eVN0YXRlWmlwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL3ByaW9yaXRpemVzIHppcCwgdGhlbiBjaXR5LCBhbmQgbGFzdGx5IHN0YXRlXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICAgICAgJHNjb3BlLkNpdHlTdGF0ZVppcF9zdHJpbmcuc3BsaXQoJywnKS5mb3JFYWNoKCh3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCgkLnRyaW0od29yZCkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJyYXkpXG5cblxuICAgICAgICAgICAgLy90dXJucyBcIk1PIDY0MTEwXCIgaW50byB0d28gc3RyaW5nc1xuICAgICAgICAgICAgLy8gb3IgXCJLYW5zYXMgQ2l0eSA2NDExMFwiXG4gICAgICAgICAgICB2YXIgbm9TcGFjZXMgPSBbXTtcbiAgICAgICAgICAgIGFycmF5LmZvckVhY2goKHdvcmQpID0+IHtcbiAgICAgICAgICAgICAgICBub1NwYWNlcy5wdXNoKHdvcmQuc3BsaXQoJyAnKSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB2YXIgemlwID0gXCJcIjtcbiAgICAgICAgICAgIGFycmF5LmZvckVhY2goKHBhcnQpID0+IHtcbiAgICAgICAgICAgICAgICB6aXAgPSBleHRyYWN0WmlwKHBhcnQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJaaXA/XCIsIHppcClcbiAgICAgICAgICAgIGlmICh6aXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICAnWmlwJzogemlwXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29tbWEgc2VwYXJhdGVkXCIsIGFycmF5KVxuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKHppcCk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVtb3ZlZCB6aXAgb2JqZWN0XCIsIGFycmF5KVxuXG4gICAgICAgICAgICAvLyBpZiBzdHJpbmcgaXMgPT0gdGhhbiAyIGl0J3Mgc3RhdGVcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9ICcnXG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKChzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA9PSAyKSBzdGF0ZSA9IHN0cmluZ1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdGF0ZVwiLCBzdGF0ZSlcblxuICAgICAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlbW92ZWQgc3RhdGUgb2JqZWN0XCIsIGFycmF5KVxuXG4gICAgICAgICAgICAvLyBpZiBubyB6aXAsIHNlYXJjaCBieSBjaXR5XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmFsIGNoZWNrXCIsIGFycmF5KVxuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDAgJiYgemlwLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbGwgd2UndmUgZ290IGxlZnQgaXMgQ2l0eVwiKVxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICAnQ2l0eSc6IGFycmF5WzBdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgbm8gemlwIG9yIGNpdHksIHNlYXJjaCBieSBzdGF0ZVxuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PSAwICYmIHppcC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICAnU3RhdGUnOiBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJQcm9zcGVjdFR5cGVcIjogJHNjb3BlLnNlbGVjdGVkUHJvc3BlY3RUeXBlLFxuICAgICAgICAgICAgICAgICAgICBcIkN1c3RvbWVyVHlwZVwiOiAkc2NvcGUuc2VsZWN0ZWRDdXN0b21lclR5cGVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBleHRyYWN0WmlwKHN0cikge1xuICAgICAgICAgICAgICAgIC8vdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBiZWxvdyBpcyBmb3IgNSBkaWdpdCBVUyBaSVAgY29kZSwgNSBkaWdpdCBVUyBaSVAgY29kZSArIDQsXG4gICAgICAgICAgICAgICAgLy9hbmQgNiBkaWdpdCBhbHBoYW51bWVyaWMgQ2FuYWRpYW4gUG9zdGFsIENvZGVcbiAgICAgICAgICAgICAgICB2YXIgcmUgPSAvXFxkezV9LVxcZHs0fXxcXGR7NX18W0EtWl1cXGRbQS1aXSBcXGRbQS1aXVxcZC9cbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBzdHI7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gcmUuZXhlYyhpbnB1dClcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG4iLCIvLyBhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLy8gLmZhY3RvcnkoJ3NlYXJjaEZhY3RvcnknLFxuLy8gIGZ1bmN0aW9uICgkaHR0cCkge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24ocGFyYW1zT2JqKXtcbi8vICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9Qcm9zcGVjdCcsIHtwYXJhbXM6IHBhcmFtc09iaiB9IClcbi8vICAgICAgICAgfVxuLy8gICAgIH07XG4vLyAgIH1cbi8vICk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnc2VhcmNoRmFjdG9yeScsXG4gICAgZnVuY3Rpb24gKCRodHRwLCAkbG9jYXRpb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZWFyY2g6IGZ1bmN0aW9uKHBhcmFtc09iail7XG4gICAgICAgICAgICB2YXIgYm9ycm93ZWRUaW1lID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoXCJzZWFyY2hcIilbMV1cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Byb3NwZWN0JyArIGJvcnJvd2VkVGltZSApXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIiwiLy8gY2xhc3MgVGFzayB7XG4vLyAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4vLyAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbi8vICAgICB9XG4vLyB9XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5zZXJ2aWNlKCdUYXNrU2VydmljZScsIGZ1bmN0aW9uKExvZ2luU2VydmljZSwgdGFza0ZhY3RvcnkpIHtcbiAgICAgICAgY2xhc3MgVGFzayB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICAgICAgdGhpcy5EdWVEYXRlID0gbW9tZW50KG9iai5Db21wbGV0aW9uRGF0ZVRpbWUpLmZvcm1hdChcImxsXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjbGFzcyBUYXNrTGlzdCBleHRlbmRzIEFycmF5IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBzdXBlciguLi5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZChhcnJheSkge1xuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaChuZXcgVGFzayhhcnJheVtpXSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlKGFjdGl2aXR5SUQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGljZSh0aGlzLm1hcCh0YXNrcyA9PiB0YXNrcy5BY3Rpdml0eUlEKS5pbmRleE9mKGFjdGl2aXR5SUQpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVwZGF0ZShBY3Rpdml0eUlEOiBudW1iZXIsIFN0YXR1czogbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t0aGlzLm1hcCh0YXNrcyA9PiB0YXNrcy5BY3Rpdml0eUlEKS5pbmRleE9mKEFjdGl2aXR5SUQpXS5TdGF0dXMgPSBTdGF0dXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwdXNoKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNoaWZ0KG5ldyBUYXNrKGFyZ3NbaV0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2xhc3MgVXNlckxpc3QgZXh0ZW5kcyBBcnJheSB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwdXNoKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAvLyB1bmlxdWUgYXJyYXk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkdXBsaWNhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHRoaXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnc1tpXS5Vc2VySUQgPT0gdGhpc1tpaV0uVXNlcklEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWR1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNoaWZ0KGFyZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlKFVzZXJJRCkge1xuICAgICAgICAgICAgICAgIGlmIChMb2dpblNlcnZpY2UuY29va2llX3VzZXIoKSA9PSBVc2VySUQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuJ3QgcmVtb3ZlIHlvdXJzZWxmXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UodGhpcy5tYXAodXNlciA9PiB1c2VyLlVzZXJJRCkuaW5kZXhPZihVc2VySUQpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNsYXNzIFRhc2tTZXJ2aWNlIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgICAgIHRoaXMuVGFza0xpc3QgPSBuZXcgVGFza0xpc3QoKVxuICAgICAgICAgICAgICAgIHRoaXMuVXNlckxpc3QgPSBuZXcgVXNlckxpc3QoKTtcbiAgICAgICAgICAgICAgICB0aGlzLkRlcGFydG1lbnRzID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5Hcm91cHMgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0YXNrU2VydmljZSA9IG5ldyBUYXNrU2VydmljZSgpO1xuICAgICAgICB0YXNrRmFjdG9yeS5nZXRVc2VycygpLnRoZW4oZnVuY3Rpb24odXNlcnMpIHtcbiAgICAgICAgICAgIHRhc2tTZXJ2aWNlLkRlcGFydG1lbnRzLnB1c2goLi4uXy5jaGFpbih1c2Vycy5kYXRhLlVzZXJMaXN0KVxuICAgICAgICAgICAgICAgIC5wbHVjaygnRGVwYXJ0bWVudCcpXG4gICAgICAgICAgICAgICAgLnVuaXEoKVxuICAgICAgICAgICAgICAgIC52YWx1ZSgpKVxuICAgICAgICAgICAgdmFyIGdyb3VwcyA9IF8uZ3JvdXBCeSh1c2Vycy5kYXRhLlVzZXJMaXN0LCBcIkRlcGFydG1lbnRcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZ3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgdGFza1NlcnZpY2UuR3JvdXBzW2tleV0gPSBncm91cHNba2V5XTtcbiAgICAgICAgICAgICAgICB0YXNrU2VydmljZS5Hcm91cHNba2V5XS5mb3JFYWNoKHggPT4geC5vbmxpbmUgPSBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRhc2tTZXJ2aWNlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCd0YXNrcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsIC8vRSA9IGVsZW1lbnQsIEEgPSBhdHRyaWJ1dGUsIEMgPSBjbGFzcywgTSA9IGNvbW1lbnQgICAgICAgICBcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgLy9AIHJlYWRzIHRoZSBhdHRyaWJ1dGUgdmFsdWUsID0gcHJvdmlkZXMgdHdvLXdheSBiaW5kaW5nLCAmIHdvcmtzIHdpdGggZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlOiAnPGRpdj57eyBteVZhbCB9fTwvZGl2PicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy90YXNrcy90YXNrcy50bXBsLmh0bWwnLFxuICAgICAgICAgICAgLy8gY29udHJvbGxlcjogY29udHJvbGxlckZ1bmN0aW9uLCAvL0VtYmVkIGEgY3VzdG9tIGNvbnRyb2xsZXIgaW4gdGhlIGRpcmVjdGl2ZVxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge30gLy9ET00gbWFuaXB1bGF0aW9uXG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ3Rhc2tDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUYXNrU2VydmljZSwgJHN0YXRlLCBodWJGYWN0b3J5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGFzayBDb250cm9sbGVyIGxvYWRlZFwiKVxuXG4gICAgICAgICRzY29wZS50YXNrcyA9IFRhc2tTZXJ2aWNlLlRhc2tMaXN0O1xuICAgICAgICAkc2NvcGUudXNlcnMgPSBUYXNrU2VydmljZS5Vc2VyTGlzdDtcbiAgICAgICAgJHNjb3BlLmRlcGFydG1lbnRzID0gVGFza1NlcnZpY2UuRGVwYXJ0bWVudHM7XG5cbiAgICAgICAgJHNjb3BlLmRlcENvbGxhcHNlT25saW5lID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLmRlcENvbGxhcHNlID0gdHJ1ZTtcblxuICAgICAgICAkc2NvcGUuZ3JvdXBzID0gVGFza1NlcnZpY2UuR3JvdXBzO1xuXG4gICAgICAgIHZhciBbbWV0aG9kcywgaW5pdF0gPSBodWJGYWN0b3J5O1xuICAgICAgICBpbml0LnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRvdWJsZSBkb25lXCIpXG4gICAgICAgICAgICAvLyByZWdpc3RlciB1c2VybmFtZSB3aXRoIHNlcnZlclxuICAgICAgICAgICAgbWV0aG9kcy5XaG9BbUkoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidG9sZCBzZXJ2ZXIgd2hvIHdlIGFyZVwiKVxuICAgICAgICAgICAgICAgIG1ldGhvZHMuR2V0VGFza3MoKS50aGVuKGZ1bmN0aW9uKHRhc2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IHRhc2tzXCIsIHRhc2tzKVxuICAgICAgICAgICAgICAgICAgICAvLyAkc2NvcGUudGFza3MuYWRkKHJlcylcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRhc2tzLnB1c2goLi4udGFza3MpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGdWRnZVwiKVxuICAgICAgICB9KVxuXG4gICAgICAgICRzY29wZS5zaG93VGFza3MgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnBvcFRhc2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd1Rhc2tzID0gISRzY29wZS5zaG93VGFza3MgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2hvd1VzZXJzID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5wb3BVc2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTaG93IHVzZXJzXCIpXG4gICAgICAgICAgICAkc2NvcGUuc2hvd1VzZXJzID0gISRzY29wZS5zaG93VXNlcnMgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2hvd1Rhc2tPcHRpb25zID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5wcm9zcGVjdElEO1xuICAgICAgICAkc2NvcGUubmF2aWdhdGUgPSBmdW5jdGlvbihwcm9zcGVjdElEOiBudW1iZXIsIFN0YXR1czogbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoU3RhdHVzID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gZ28sIGl0J3MgYmVpbmcgd29ya2VkIGFscmVhZHlcIilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUuc2hvd1Rhc2tPcHRpb25zID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS5wcm9zcGVjdElEID0gcHJvc3BlY3RJRFxuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lLnByb3NwZWN0Jywge1xuICAgICAgICAgICAgICAgIFByb3NwZWN0SUQ6IHByb3NwZWN0SURcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuQ2hhbmdlVGFza1N0YXR1cyA9IGZ1bmN0aW9uKGFjdGl2aXR5SUQsIHN0YXR1cykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpdml0eSBpZFwiLCBhY3Rpdml0eUlELCBcInN0YXR1c1wiLCBzdGF0dXMpXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXRob2RzLkNoYW5nZVRhc2tTdGF0dXMoYWN0aXZpdHlJRCwgc3RhdHVzKVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnVzZXJNZXRob2QgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInVzZXJcIiwgdXNlcilcbiAgICAgICAgfVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5mYWN0b3J5KCd0YXNrRmFjdG9yeScsXG4gICAgICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldFVzZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuIiwidmFyICRodG1sID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF0pO1xuXG5hbmd1bGFyLmVsZW1lbnQoKS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBhbmd1bGFyLnJlc3VtZUJvb3RzdHJhcChbYXBwWyduYW1lJ11dKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9