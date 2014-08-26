"use strict";
var app = angular.module('uiRouterSample', ['ui.router', 'ngAnimate', 'ngResource', 'ngCookies', 'mgcrea.ngStrap', 'ngSanitize', 'chieffancypants.loadingBar', 'angular-table', 'ngTagsInput', 'xeditable', 'ui.calendar', 'angularFileUpload', 'SignalR']).run(['$rootScope', '$state', '$stateParams', '$cookies', "$http", function($rootScope, $state, $stateParams, $cookies, $http) {
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
angular.module('uiRouterSample').controller('aboutController', function($scope, $rootScope, hubFactory) {
  console.log("About controller");
  var $__0 = $traceurRuntime.assertObject(hubFactory),
      methods = $__0[0],
      promise = $__0[1];
  promise.then(function() {
    console.log("Double done");
    methods.map().then(function(data) {
      console.log("Cranked", data);
    });
  });
});

"use strict";
angular.module('uiRouterSample').factory('hubFactory', function($rootScope, Hub, $q) {
  var hub = new Hub('activityQueueHub', {
    listeners: {'taskWorking': function(info) {
        console.log("a task was changed....", info);
      }},
    rootPath: "http://10.1.1.118:8000/signalr",
    methods: ['lock', 'unlock', 'hello_Im_Connected', 'GetTasks', 'changeTaskStatusD', 'WhoAmI']
  });
  var deferred = $q.defer();
  hub.init().then(function(res) {
    if (res._subscribedToHubs) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  });
  var shapeModel = {
    left: 0,
    top: 0
  };
  var edit = function(employee) {
    hub.lock(employee.Id);
  };
  var done = function(employee) {
    hub.unlock(employee.Id);
  };
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
    hub.WhoAmI("pbajoj").then(function(data) {
      def.resolve();
    });
    return def.promise;
  };
  var richardsmethod = function() {
    console.log("Start");
    var counter = 0;
    var start = new Date().getTime();
    for (var i = 0; i < 1000; i++) {
      hub.changeTaskStatusD('4', '1').then(function(data) {
        hub.getTasks('pbamrb').then(function(data) {
          counter++;
          if (counter == 1000) {
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time from inside: ' + time);
          }
        });
      });
    }
    var end = new Date().getTime();
    var time = end - start;
    console.log('Execution time outside: ' + time);
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
    editEmployee: edit,
    doneWithEmployee: done,
    map: getCurrent,
    map2: richardsmethod,
    WhoAmI: getUser,
    GetTasks: GetTasks
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
    Privilege.SetSession(user.key, this.user.user);
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
    SetSession: function(xkey, user) {
      assert.argumentTypes(xkey, $traceurRuntime.type.string, user, $traceurRuntime.type.string);
      $cookies.xkey = xkey;
      $cookies.userid = user;
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
  $scope.editEvent = function(evt) {
    console.log("herp", evt);
  };
  $scope.modalSaveActivity = function(evt, modal) {
    var activity = new AddEvent(evt, $scope.details);
    prospectFactory.AddEvent(activity).then(function() {
      modal.$hide();
      $scope.the_Prospect.Activities.unshift(new Activity(evt));
    });
  };
  $scope.modalSaveIssue = function(issue, modal) {
    var issue = new AddIssue(issue);
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
angular.module('uiRouterSample').service('TaskService', function() {
  var Task = function Task(obj) {
    Object.assign(this, obj);
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
    }
  }, {}, Array);
  var TaskService = function TaskService(obj) {
    this.TaskList = new TaskList();
  };
  ($traceurRuntime.createClass)(TaskService, {}, {});
  var taskService = new TaskService();
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
var assert = require("assert").assert;
angular.module('uiRouterSample').controller('taskController', function($scope, TaskService, $state) {
  console.log("Task Controller loaded");
  $scope.tasks = TaskService.TaskList;
  var task = {};
  task.Descr = "Sample descr";
  $scope.tasks.push(task);
  $scope.showTasks = false;
  $scope.popTasks = function() {
    $scope.showTasks = !$scope.showTasks ? true : false;
  };
  $scope.navigate = function(prospectID) {
    assert.argumentTypes(prospectID, $traceurRuntime.type.number);
    $state.go('home.prospect', {ProspectID: prospectID});
  };
  $scope.ChangeTaskStatus = function(activityID, status) {
    console.log("activity id", activityID);
  };
});

"use strict";
angular.module('uiRouterSample').factory('taskFactory', function($http) {
  return {queryResults: function(url, callback) {
      console.log("Getting query with params ", url);
      return $http.get('http://10.1.1.118:8000/api/Research?State=MO&ProductID=1');
    }};
});

"use strict";
var $html = angular.element(document.getElementsByTagName('html')[0]);
angular.element().ready(function() {
  angular.resumeBootstrap([app[$traceurRuntime.toProperty('name')]]);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2FwcC5qcyIsImpzL2VzNi5qcyIsImpzL2Fib3V0L2NvbnRyb2xsZXIuanMiLCJqcy9hYm91dC9mYWN0b3J5LmpzIiwianMvYWN0aXZpdHkvYWN0aXZpdHlDbGFzcy5qcyIsImpzL2FjdGl2aXR5L2FjdGl2aXR5Q29udHJvbGxlci5qcyIsImpzL2FjdGl2aXR5L2ZhY3RvcnkuanMiLCJqcy9hZG1pbi9hZG1pbkNvbnRyb2xsZXIuanMiLCJqcy9jYW1wYWlnbi9jYW1wYWlnbkNvbnRyb2xsZXIuanMiLCJqcy9jYW1wYWlnbi9jYW1wYWlnbkRldGFpbHNDb250cm9sbGVyLmpzIiwianMvY2FtcGFpZ24vY2FtcGFpZ25GYWN0b3J5LmpzIiwianMvY2FtcGFpZ24vbmV3Q2FtcGFpZ25Db250cm9sbGVyLmpzIiwianMvY2xhc3Nlcy9QZW5kaW5nQ2FtcGFpZ24uanMiLCJqcy9jbGFzc2VzL2FjdGl2aXRpZXMuanMiLCJqcy9jbGFzc2VzL2NhbXBhaWduLmpzIiwianMvY2xhc3Nlcy9jdXN0b21lci5qcyIsImpzL2tpbS9raW1Db250cm9sbGVyLmpzIiwianMvbGFuZGluZy9sYW5kaW5nQ29udHJvbGxlci5qcyIsImpzL2xhbmRpbmcvbGFuZGluZ0ZhY3RvcnkuanMiLCJqcy9sb2dpbi9Mb2dpblNlcnZpY2UuanMiLCJqcy9sb2dpbi9sb2dpbkNvbnRyb2xsZXIuanMiLCJqcy9sb2dpbi9sb2dpbkZhY3RvcnkuanMiLCJqcy9taXNjL2FsZXJ0Q29udHJvbGxlci5qcyIsImpzL21pc2MvY29sbGFwc2UuanMiLCJqcy9taXNjL2ZpbHRlci5qcyIsImpzL21pc2MvbmF2YmFyX3NlYXJjaC5qcyIsImpzL21pc2MvcGFnaW5hdGUuanMiLCJqcy9taXNjL3NpZ25hbHIuanMiLCJqcy9wcm9zcGVjdC9wcm9zcGVjdENsYXNzLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RDb250cm9sbGVyLmpzIiwianMvcHJvc3BlY3QvcHJvc3BlY3RGYWN0b3J5LmpzIiwianMvcXVlcnkvcXVlcnlDb250cm9sbGVyLmpzIiwianMvcXVlcnkvcXVlcnlGYWN0b3J5LmpzIiwianMvcm9sZXMvcm9sZUZhY3RvcnkuanMiLCJqcy9yb2xlcy9yb2xlc0NvbnRyb2xsZXIuanMiLCJqcy9zYW1wbGVzb2NrZXQvb25lLmpzIiwianMvc2VhcmNoL3NlYXJjaENvbnRyb2xsZXIuanMiLCJqcy9zZWFyY2gvc2VhcmNoRmFjdG9yeS5qcyIsImpzL3Rhc2tzL1Rhc2tDbGFzcy5qcyIsImpzL3Rhc2tzL1Rhc2tTZXJ2aWNlLmpzIiwianMvdGFza3MvZGlyZWN0aXZlcy5qcyIsImpzL3Rhc2tzL3Rhc2tDb250cm9sbGVyLmpzIiwianMvdGFza3MvdGFza0ZhY3RvcnkuanMiLCJqcy94L3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnbmdBbmltYXRlJyxcbiAgICAvLyAnbmdNb2NrRTJFJyxcbiAgICAnbmdSZXNvdXJjZScsXG4gICAgJ25nQ29va2llcycsXG4gICAgJ21nY3JlYS5uZ1N0cmFwJyxcbiAgICAnbmdTYW5pdGl6ZScsXG4gICAgJ2NoaWVmZmFuY3lwYW50cy5sb2FkaW5nQmFyJyxcbiAgICAnYW5ndWxhci10YWJsZScsXG4gICAgJ25nVGFnc0lucHV0JyxcbiAgICAneGVkaXRhYmxlJyxcbiAgICAndWkuY2FsZW5kYXInLFxuICAgICdhbmd1bGFyRmlsZVVwbG9hZCcsXG4gICAgJ1NpZ25hbFInXG5dKVxuXG4ucnVuKFxuICAgIFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJyRjb29raWVzJywgXCIkaHR0cFwiLFxuICAgICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZXMsICRodHRwKSB7XG5cblxuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXSA9ICRjb29raWVzLnhrZXk7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnB1dCA9IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnBvc3QgPSB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMudGltZW91dCA9IDEwO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcyA9ICRzdGF0ZVBhcmFtcztcbiAgICAgICAgICAgICRyb290U2NvcGUubG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgICAgJHJvb3RTY29wZS5jcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgICAgICBncm91cDogXCJVbmRlZmluZWRcIixcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogJGNvb2tpZXMudXNlcmlkXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBwZXJmb3JtIGFuIEFQSSBjYWxsIHRvIHNlZSBpZiB4a2V5IGlzIHN0aWxsIHZhbGlkIG9yIG5lZWRzIHRvIGJlIHJlLWF1dGhlZDtcbiAgICAgICAgICAgIC8vIHZhciB0ZXN0S2V5ID0gJGh0dHAoe1xuICAgICAgICAgICAgLy8gICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAvLyAgICAgdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvbGlzdCcsXG4gICAgICAgICAgICAvLyAgICAgLy8gdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24nLFxuICAgICAgICAgICAgLy8gICAgIGhlYWRlcnMgOiB7ICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsICdYS2V5JzogJGNvb2tpZXMueGtleX1cbiAgICAgICAgICAgIC8vICAgfSlcblxuICAgICAgICB9XG4gICAgXVxuKVxuXG5cbi5jb25maWcoXG4gICAgWyckc3RhdGVQcm92aWRlcicsICckcHJvdmlkZScsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsXG4gICAgICAgIGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkcHJvdmlkZSwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG5cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICAvLyAgICBBdXRoIEludGVyY2VwdG9yICAgICAvL1xuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgJHByb3ZpZGUuZmFjdG9yeSgnbXlIdHRwSW50ZXJjZXB0b3InLCBmdW5jdGlvbigkcSwgJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgb24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nIG9uIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc3BvbnNlIGludGVyY2VwdFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGluamVjdG9yLmdldCgnJHN0YXRlJykudHJhbnNpdGlvblRvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5qZWN0b3IuZ2V0KCdhbGVydEZhY3RvcnknKS5hbGVydHMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRwcm92aWRlLmZhY3RvcnkoJ3RpbWVvdXRIdHRwSW50ZXJjZXB0JywgZnVuY3Rpb24oJHEsICRyb290U2NvcGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAncmVxdWVzdCc6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLnRpbWVvdXQgPSAzMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnbXlIdHRwSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIC8vICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ3RpbWVvdXRIdHRwSW50ZXJjZXB0Jyk7XG5cblxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIFJlZGlyZWN0cyBhbmQgT3RoZXJ3aXNlIC8vXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAvLyBVc2UgJHVybFJvdXRlclByb3ZpZGVyIHRvIGNvbmZpZ3VyZSBhbnkgcmVkaXJlY3RzICh3aGVuKSBhbmQgaW52YWxpZCB1cmxzIChvdGhlcndpc2UpLlxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG5cbiAgICAgICAgICAgIC8vIFRoZSBgd2hlbmAgbWV0aG9kIHNheXMgaWYgdGhlIHVybCBpcyBldmVyIHRoZSAxc3QgcGFyYW0sIHRoZW4gcmVkaXJlY3QgdG8gdGhlIDJuZCBwYXJhbVxuICAgICAgICAgICAgLy8gSGVyZSB3ZSBhcmUganVzdCBzZXR0aW5nIHVwIHNvbWUgY29udmVuaWVuY2UgdXJscy5cbiAgICAgICAgICAgIC53aGVuKCcvYz9pZCcsICcvY29udGFjdHMvOmlkJylcbiAgICAgICAgICAgICAgICAud2hlbignL3VzZXIvOmlkJywgJy9jb250YWN0cy86aWQnKVxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgdXJsIGlzIGV2ZXIgaW52YWxpZCwgZS5nLiAnL2FzZGYnLCB0aGVuIHJlZGlyZWN0IHRvICcvJyBha2EgdGhlIGhvbWUgc3RhdGVcbiAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuXG4gICAgICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gU3RhdGUgQ29uZmlndXJhdGlvbnMgLy9cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC8vIFVzZSAkc3RhdGVQcm92aWRlciB0byBjb25maWd1cmUgeW91ciBzdGF0ZXMuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxuXG4gICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9Mb2dpbi5odG1sJ1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gSG9tZSAvL1xuICAgICAgICAgICAgLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAuc3RhdGUoXCJob21lXCIsIHtcblxuICAgICAgICAgICAgICAgIC8vIFVzZSBhIHVybCBvZiBcIi9cIiB0byBzZXQgYSBzdGF0ZXMgYXMgdGhlIFwiaW5kZXhcIi5cbiAgICAgICAgICAgICAgICB1cmw6IFwiL1wiLFxuXG4gICAgICAgICAgICAgICAgLy8gY29udHJvbGxlcjogJ2xhbmRpbmdDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAvLyB0ZW1wbGF0ZVVybDogJ3ZpZXdzL25vdHN1cmUuaHRtbCdcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHRoaXMgb25lIGlzIHRhcmdldGluZyB0aGUgdW5uYW1lZCB2aWV3IHdpdGhpbiB0aGUgcGFyZW50IHN0YXRlJ3MgdGVtcGxhdGUuXG4gICAgICAgICAgICAgICAgICAgICcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL25vdHN1cmUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbGFuZGluZ0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBvbmUgaXMgdGFyZ2V0aW5nIHRoZSB1aS12aWV3PVwiaGludFwiIHdpdGhpbiB0aGUgdW5uYW1lZCByb290LCBha2EgaW5kZXguaHRtbC5cbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBzaG93cyBvZmYgaG93IHlvdSBjb3VsZCBwb3B1bGF0ZSAqYW55KiB2aWV3IHdpdGhpbiAqYW55KiBhbmNlc3RvciBzdGF0ZS5cbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAaG9tZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbGFuZGluZy5odG1sJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAndGFza2JhckBob21lJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90YXNrYmFyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Rhc2tDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLy8vLy8vLy8vL1xuICAgICAgICAgICAgLy8gQWJvdXQgLy9cbiAgICAgICAgICAgIC8vLy8vLy8vLy8vXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5hYm91dCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICdhYm91dCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2Fib3V0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJhYm91dENvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gU2hvd2luZyBvZmYgaG93IHlvdSBjb3VsZCByZXR1cm4gYSBwcm9taXNlIGZyb20gdGVtcGxhdGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC8vIHRlbXBsYXRlUHJvdmlkZXI6IFsnJHRpbWVvdXQnLFxuICAgICAgICAgICAgICAgIC8vICAgZnVuY3Rpb24gKCAgICAgICAgJHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICByZXR1cm4gJzxwIGNsYXNzPVwibGVhZFwiPlVJLVJvdXRlciBSZXNvdXJjZXM8L3A+PHVsPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlci90cmVlL21hc3Rlci9zYW1wbGVcIj5Tb3VyY2UgZm9yIHRoaXMgU2FtcGxlPC9hPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgJzxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXCI+R2l0aHViIE1haW4gUGFnZTwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlciNxdWljay1zdGFydFwiPlF1aWNrIFN0YXJ0PC9hPjwvbGk+JyArXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgJzxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyL3dpa2lcIj5Jbi1EZXB0aCBHdWlkZTwvYT48L2xpPicgK1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICc8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlci93aWtpL1F1aWNrLVJlZmVyZW5jZVwiPkFQSSBSZWZlcmVuY2U8L2E+PC9saT4nICtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgJzwvdWw+JztcbiAgICAgICAgICAgICAgICAvLyAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAvLyAgIH1dXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUucXVlcnknLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAncXVlcnkvbmV3Lz9TdGF0ZSZBZ2UmUHJvZHVjdCZEaXN0YW5jZScsXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9SZXNlYXJjaC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicXVlcnlDb250cm9sbGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyAuc3RhdGUoJ2hvbWUucXVlcnkucmVzdWx0cycsIHtcbiAgICAgICAgICAgIC8vICAgdXJsOiAnL3Jlc3VsdHMvP215UGFyYW0xJm15UGFyYW0yJ1xuICAgICAgICAgICAgLy8gfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLmNhbXBhaWduJywge1xuICAgICAgICAgICAgICAgIHVybDogJ0NhbXBhaWducycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NhbXBhaWducy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiY2FtcGFpZ25Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5jYW1wYWlnbi5uZXcnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL25ldy86Y2FtcGFpZ25JRCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnRAaG9tZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2FtcGFpZ24tY29udmVydC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibmV3Q2FtcGFpZ25Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5jYW1wYWlnbi5kZXRhaWxzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9kZXRhaWxzLzpjYW1wYWlnbklEJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNhbXBhaWduRmFjdG9yeTogJ2NhbXBhaWduRmFjdG9yeScsXG4gICAgICAgICAgICAgICAgICAgIGNhbXBhaWduOiBmdW5jdGlvbihjYW1wYWlnbkZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbXBhaWduRmFjdG9yeS5zaW5nbGVDYW1wYWlnbigkc3RhdGVQYXJhbXMuY2FtcGFpZ25JRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50QGhvbWUnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NhbXBhaWduLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImNhbXBhaWduQ29udHJvbGxlckRldGFpbHNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLnN0YXRlKCdob21lLnRhc2tzJywge1xuICAgICAgICAgICAgICAgIHVybDogJ1Rhc2tzLzp0YXNrSUQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy90YXNrcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidGFza0NvbnRyb2xsZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vICd0YXNrcyc6e1xuICAgICAgICAgICAgICAgICAgICAvLyAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGFza3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgY29udHJvbGxlcjogXCJ0YXNrQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuYWRtaW4nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnYWRtaW4vJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvYWRtaW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImFkbWluQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUudGltZWxpbmUnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAndGltZWxpbmUvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvdGltZWxpbmUuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInRpbWVsaW5lQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUucm9sZXMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAncm9sZXMvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvcm9sZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInJvbGVzQ29udHJvbGxlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUucHJvc3BlY3QnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnUHJvc3BlY3QvOlByb3NwZWN0SUQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9Qcm9zcGVjdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicHJvc3BlY3RDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZS5raW0nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnS2ltLzpQcm9zcGVjdElEJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvS2ltLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJraW1Db250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVsb2FkT25TZWFyY2g6IGZhbHNlXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUuc2VhcmNoJywge1xuICAgICAgICAgICAgICAgIHVybDogJ3NlYXJjaD9Qcm9zcGVjdElEJkN1c3RJRCZOQ1BEUCZOUEkmWmlwJkNpdHkmU3RhdGUmUHJvc3BlY3RUeXBlJkN1c3RvbWVyVHlwZScsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL1Byb3NwZWN0LXF1ZXJ5Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIC5zdGF0ZSgnaG9tZS5zZWFyY2gucmVzdWx0cycsIHtcbiAgICAgICAgICAgIC8vICAgdXJsOiAnL3ByaW9yaXR5JyxcbiAgICAgICAgICAgIC8vICAgdmlld3M6IHtcbiAgICAgICAgICAgIC8vICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgIC8vICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3Mvc2VhcmNoLmh0bWwnLFxuICAgICAgICAgICAgLy8gICAgICAgY29udHJvbGxlcjogXCJzZWFyY2hDb250cm9sbGVyXCJcbiAgICAgICAgICAgIC8vICAgfSxcbiAgICAgICAgICAgIC8vICAgJ3NlYXJjaFZpZXcnOiB7XG4gICAgICAgICAgICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NlYXJjaC5odG1sJyxcbiAgICAgICAgICAgIC8vICAgICAgIGNvbnRyb2xsZXI6IFwic2VhcmNoQ29udHJvbGxlclwiXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy8gfSlcblxuXG4gICAgICAgIH1cbiAgICBdXG4pO1xuIiwiZnVuY3Rpb24gY2hlY2tUZXN0KGFnZTogbnVtYmVyKSB7XG4gICAgY29uc29sZS5sb2coXCJQYXNzZWQ/IFwiLCBhZ2UpXG59XG5jaGVja1Rlc3QoMjApXG5cbi8vIHZhciBjdXN0b21lcnMgPSBbXTtcbi8vIHZhciBjdXN0b21lciA9IHt9XG4vLyBjdXN0b21lci5jaXR5ID0gXCJTZWF0dGxlXCJcbi8vIHZhciBjdXN0b21lcjIgPSB7fVxuLy8gY3VzdG9tZXIyLmNpdHkgPSBcIkthbnNhcyBDaXR5XCJcbi8vIGN1c3RvbWVycy5wdXNoKGN1c3RvbWVyKTtcbi8vIGN1c3RvbWVycy5wdXNoKGN1c3RvbWVyKTtcbi8vIGN1c3RvbWVycy5wdXNoKGN1c3RvbWVyMik7XG5cbi8vIHZhciByZXN1bHRzID0gW1xuLy8gICAgIGZvciAoYyBvZiBjdXN0b21lcnMpXG4vLyAgICAgICAgIGlmIChjLmNpdHkgPT0gXCJTZWF0dGxlXCIpIHtcbi8vICAgICAgICAgICAgIG5hbWU6IGMubmFtZSxcbi8vICAgICAgICAgICAgIGFnZTogYy5hZ2Vcbi8vICAgICAgICAgfVxuLy8gXVxuXG5cblxuLy8gdmFyIGV2ZW5zID0gWzIsIDQsIDZdO1xuXG4vLyB2YXIgb2RkcyA9IGV2ZW5zLm1hcCh2ID0+IHYgKyAxKS5maWx0ZXIodiA9PiB2ID4gMClcblxuLy8gY29uc29sZS5sb2coXCJvZGRzXCIsIG9kZHMpXG5cbi8vIHZhciBoZWxsbyA9IHtcbi8vICAgICBoZWxsbzogJ3dvcmxkJyxcbi8vICAgICBmb286ICdiYXInXG4vLyB9O1xuLy8gdmFyIHFheiA9IHtcbi8vICAgICBoZWxsbzogJ3N0ZXZpZScsXG4vLyAgICAgZm9vOiAnYmF6J1xuLy8gfVxuXG4vLyB2YXIgbXlBcnJheSA9IFtdO1xuLy8gbXlBcnJheS5wdXNoKGhlbGxvLCBoZWxsbywgcWF6KTtcblxuLy8gdmFyIHBvcyA9IG15QXJyYXkubWFwKHYgPT4gdi5oZWxsbykuaW5kZXhPZignc3RldmllJyk7XG5cbi8vIGNvbnNvbGUubG9nKFwicG9zaXRpb25cIiwgcG9zKVxuXG4vLyBteUFycmF5LnNwbGljZShteUFycmF5Lm1hcCh2ID0+IHYuaGVsbG8pLmluZGV4T2YoJ3N0ZXZpZScpLCAxKTtcbi8vIGNvbnNvbGUubG9nKFwibXlBcnJheVwiLCBteUFycmF5KVxuXG5cbi8vIHZhciB0ZXN0QXJyYXkgPSBbMSwgMiwgMywgNF1cblxuLy8gY29uc29sZS5sb2coXCJ1aGhoXCIpXG5cbi8vIC8vIGZ1bmN0aW9uIGFzc3J0KGFycjpBcnJheSl7XG4vLyAvLyAgICAgY29uc29sZS5sb2coXCJBcnJheVwiLCBhcnIpXG4vLyAvLyB9XG5cbi8vIC8vIGFzc3J0KFsxLDIsM10pXG5cbi8vIGZ1bmN0aW9uIHRpbWVvdXQoKSB7XG4vLyAgICAgdmFyIG1zID0gTWF0aC5yYW5kb20oKSAqICg1MDAwIC0gMTAwMCkgKyAxMDAwO1xuLy8gICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcbi8vIH1cblxuXG4vLyBhc3luY1xuXG4vLyBmdW5jdGlvbiBhc3luY1ZhbHVlKHZhbHVlKSB7XG4vLyAgICAgYXdhaXQgdGltZW91dCgpO1xuLy8gICAgIHJldHVybiB2YWx1ZSAqIHZhbHVlO1xuLy8gfVxuXG4vLyBhc3luY1ZhbHVlKDIpLnRoZW4oKHJlcykgPT4ge1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKFwicmVzXCIsIHJlcylcbi8vICAgICAvLyB2YXIgZGlja3MgPSByZXNcbi8vICAgICByZXR1cm4gcmVzXG4vLyB9KS50aGVuKGFzeW5jKHgpID0+IHtcbi8vICAgICAvLyBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIG5leHQgcmVzXCIsIHgpIC8vIHggPSA0XG4vLyAgICAgdmFyIHkgPSBhd2FpdCBhc3luY1ZhbHVlKHgpIC8vIElPIG9yIGRiIHRyYW5zYWN0aW9uO1xuLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRvbmUgYWZ0ZXIgcmVzXCIsIHkpIC8vIHkgPSAxNlxuLy8gICAgIHZhciB6ID0gYXdhaXQgYXN5bmNWYWx1ZSh5KSAvLyBJTyBvciBkYiB0cmFuc2FjdGlvbjtcbi8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEb25lIGFmdGVyIHJlcyAyXCIsIHopIC8vIHogPSAyNTZcbi8vICAgICAgICAgLy8gcmV0dXJuIHggKiB4O1xuLy8gfSk7XG5cbi8vIGFzeW5jXG5cbi8vIGZ1bmN0aW9uIGxvb3AodmFsKSB7XG4vLyAgICAgd2hpbGUgKHZhbCA8IDkwMDApIHtcbi8vICAgICAgICAgdmFsID0gYXdhaXQgYXN5bmNWYWx1ZSh2YWwpXG4vLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXRlcmF0aW9uXCIsIHZhbClcbi8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJUZXN0IGFycmF5XCIsIHRlc3RBcnJheTIpXG4vLyAgICAgfVxuLy8gfVxuXG4vLyBsb29wKDIpXG5cbi8vIHZhciB0ZXN0QXJyYXkyID0gW11cbi8vIHRlc3RBcnJheS5mb3JFYWNoKGFzeW5jKHgpID0+IHtcbi8vICAgICB2YXIgZG91YmxlID0gYXdhaXQgYXN5bmNWYWx1ZSh4KVxuLy8gICAgIHRlc3RBcnJheTIucHVzaChkb3VibGUpXG4vLyB9KTtcblxuXG4vLyBjbGFzcyBTdGFjayBleHRlbmRzIEFycmF5IHtcbi8vICAgICBjb25zdHJ1Y3RvcigpIHtcbi8vICAgICAgICAgLy8gc3VwZXIoKVxuLy8gICAgIH1cbi8vICAgICB0b3AoKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV07XG4vLyAgICAgfVxuLy8gICAgIGJvdHRvbSgpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXNbMF1cbi8vICAgICB9XG4vLyAgICAgYXN5bmMgcXVldWUodGFzaykge1xuLy8gICAgICAgICB0aGlzLnB1c2godGFzaylcbi8vICAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoID4gMCkge1xuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGRpbmdcIiwgdGFzaylcbi8vICAgICAgICAgICAgIGF3YWl0IHRoaXMuc29tZXRoaW5nKHRhc2spXG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgLy8gYXdhaXQgdGhpcy5zb21ldGhpbmcodGFzayk7XG4vLyAgICAgfVxuLy8gICAgIGFzeW5jIHdvcmsodGFzaykge1xuLy8gICAgICAgICBhd2FpdCB0aW1lb3V0KCkgLy9ha2EgZ28gdG8gdGhlIERCXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZSB3aXRoIHRhc2tcIiwgdGFzaylcbi8vICAgICAgICAgcmV0dXJuXG4vLyAgICAgfVxuLy8gICAgIGFzeW5jIHNvbWV0aGluZyh0YXNrKSB7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU29tZXRoaW5nXCIsIHRhc2spXG4vLyAgICAgICAgIGF3YWl0IHRpbWVvdXQoKVxuLy8gICAgICAgICB0aGlzLnNoaWZ0KCk7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiLCB0YXNrKVxuLy8gICAgICAgICByZXR1cm5cbi8vICAgICB9XG4vLyB9XG5cbi8vIHZhciBzID0gbmV3IFN0YWNrKCk7XG4vLyAvLyBzLnB1c2goXCJ3b3JsZFwiKTtcbi8vIC8vIHMucHVzaChcImhlbGxvXCIpO1xuLy8gLy8gY29uc29sZS5sb2cocy50b3AoKSk7ICAvLyBcImhlbGxvXCJcbi8vIC8vIGNvbnNvbGUubG9nKHMubGVuZ3RoKTsgLy8gMlxuLy8gLy8gY29uc29sZS5sb2cocy5ib3R0b20oKSk7IC8vIHdvcmxkXG5cblxuLy8gdmFyIG1hcCA9IG5ldyBNYXAoKVxuLy8gbWFwLnNldCgnSm9obicsIDI1KVxuLy8gbWFwLnNldCgnQWxpY2UnLCA0MDApXG5cbi8vIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbi8vICAgICBjb25zb2xlLmxvZyhrZXksIHZhbHVlKVxuLy8gfSlcblxuLy8gZm9yICh2YXIgW2tleSwgdmFsdWVdIG9mIG1hcCkge1xuLy8gICAgIGNvbnNvbGUubG9nKFwiZHVkZVwiLCBrZXksIHZhbHVlKVxuLy8gfVxuXG4vLyB2YXIgYXJyID0gWzEsIDIsIDMsIDRdXG4vLyAgICAgLy8gaWYgKCFhcnIuY29udGFpbnMoNSkpe1xuLy8gICAgIC8vICAgICBhcnIucHVzaChvYmopO1xuLy8gICAgIC8vIH1cbi8vICAgICAvLyBjb25zb2xlLmxvZyhcIkFyclwiLCBhcnIpXG5cbi8vIHZhciBibyA9IF8uY29udGFpbnMoWzEsIDIsIDNdLCA1KTtcbi8vIGNvbnNvbGUubG9nKGJvKVxuLy8gLy8gY29uc29sZS5sb2coIF8uY29udGFpbnMoWzEsIDIsIDNdLCAxKTsgKVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdhYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsIGh1YkZhY3RvcnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIkFib3V0IGNvbnRyb2xsZXJcIilcblxuICAgIHZhciBbbWV0aG9kcywgcHJvbWlzZV0gPSBodWJGYWN0b3J5O1xuICAgIHByb21pc2UudGhlbihmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRvdWJsZSBkb25lXCIpXG4gICAgICAgIC8vIGdldCBhbGwgZXZlbnRzXG4gICAgICAgIG1ldGhvZHMubWFwKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JhbmtlZFwiLCBkYXRhKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAvLyAvLyBmb3IodmFyIGkgPSAwOyBpIDwgMTAwMDsgaSsrKXtcbiAgICAgICAgLy8gICAgIG1ldGhvZHMud3RmMigpO1xuICAgICAgICAvLyAvLyB9XG4gICAgICAgIC8vIHZhciBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgLy8gdmFyIHRpbWUgPSBlbmQgLSBzdGFydDtcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignRXhlY3V0aW9uIHRpbWU6ICcgKyB0aW1lKTtcbiAgICB9KVxuXG59KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgnaHViRmFjdG9yeScsIGZ1bmN0aW9uKCRyb290U2NvcGUsIEh1YiwgJHEpIHtcblxuICAgICAgICAvL2RlY2xhcmluZyB0aGUgaHViIGNvbm5lY3Rpb25cbiAgICAgICAgdmFyIGh1YiA9IG5ldyBIdWIoJ2FjdGl2aXR5UXVldWVIdWInLCB7XG4gICAgICAgICAgICAvLyB2YXIgaHViID0gbmV3IEh1YignbW92ZVNoYXBlSHViJywge1xuXG4gICAgICAgICAgICAvL2NsaWVudCBzaWRlIG1ldGhvZHNcbiAgICAgICAgICAgIGxpc3RlbmVyczoge1xuICAgICAgICAgICAgICAgIC8vICd1cGRhdGVTaGFwZSc6IGZ1bmN0aW9uKG1vZGVsKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiQ2hhbmdlZFwiLCBtb2RlbClcbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgIC8vICd1bmxvY2tFbXBsb3llZSc6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHZhciBlbXBsb3llZSA9IGZpbmQoaWQpO1xuICAgICAgICAgICAgICAgIC8vICAgICBlbXBsb3llZS5Mb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgICd0YXNrV29ya2luZyc6IGZ1bmN0aW9uKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhIHRhc2sgd2FzIGNoYW5nZWQuLi4uXCIsIGluZm8pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gcm9vdFBhdGg6IFwiaHR0cDovLzEwLjEuMS4yMjYvc2lnbmFsclwiLFxuICAgICAgICAgICAgcm9vdFBhdGg6IFwiaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9zaWduYWxyXCIsXG5cbiAgICAgICAgICAgIC8vc2VydmVyIHNpZGUgbWV0aG9kc1xuICAgICAgICAgICAgbWV0aG9kczogWydsb2NrJywgJ3VubG9jaycsICdoZWxsb19JbV9Db25uZWN0ZWQnLCAnR2V0VGFza3MnLCAnY2hhbmdlVGFza1N0YXR1c0QnLCAnV2hvQW1JJ10sXG5cbiAgICAgICAgICAgIC8vcXVlcnkgcGFyYW1zIHNlbnQgb24gaW5pdGlhbCBjb25uZWN0aW9uXG4gICAgICAgICAgICAvLyBxdWVyeVBhcmFtczp7XG4gICAgICAgICAgICAvLyAgICAgJ3Rva2VuJzogJ2V4YW1wbGV0b2tlbidcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICB9KVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIGh1Yi5pbml0KCkudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgIGlmIChyZXMuX3N1YnNjcmliZWRUb0h1YnMpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy9tb3ZlU2hhcGVIdWIuaW52b2tlKCd1cGRhdGVNb2RlbCcsIHNoYXBlTW9kZWwpXG5cbiAgICAgICAgdmFyIHNoYXBlTW9kZWwgPSB7XG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWRpdCA9IGZ1bmN0aW9uKGVtcGxveWVlKSB7XG4gICAgICAgICAgICBodWIubG9jayhlbXBsb3llZS5JZCk7IC8vQ2FsbGluZyBhIHNlcnZlciBtZXRob2RcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGRvbmUgPSBmdW5jdGlvbihlbXBsb3llZSkge1xuICAgICAgICAgICAgaHViLnVubG9jayhlbXBsb3llZS5JZCk7IC8vQ2FsbGluZyBhIHNlcnZlciBtZXRob2RcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXRDdXJyZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IGN1cnJlbnRcIilcbiAgICAgICAgICAgIGh1Yi5oZWxsb19JbV9Db25uZWN0ZWQoc2hhcGVNb2RlbCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZGVmID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IFdob0FtSVwiKVxuICAgICAgICAgICAgaHViLldob0FtSShcInBiYWpvalwiKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIGRlZi5wcm9taXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJpY2hhcmRzbWV0aG9kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN0YXJ0XCIpXG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDBcbiAgICAgICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDYWxsaW5nIHJpY2hhcmQnc1wiKVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDAwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBodWIuY2hhbmdlVGFza1N0YXR1c0QoJzQnLCAnMScpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3IodmFyIGkgPSAwOyBpIDwgMTsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgaHViLmdldFRhc2tzKCdwYmFtcmInKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZXIrK1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPT0gMTAwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZSA9IGVuZCAtIHN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFeGVjdXRpb24gdGltZSBmcm9tIGluc2lkZTogJyArIHRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHZhciB0aW1lID0gZW5kIC0gc3RhcnQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXhlY3V0aW9uIHRpbWUgb3V0c2lkZTogJyArIHRpbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIEdldFRhc2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdldHRpbmcgdGFza3NcIilcbiAgICAgICAgICAgIHZhciBkZWYgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgaHViLkdldFRhc2tzKCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICBlZGl0RW1wbG95ZWU6IGVkaXQsXG4gICAgICAgICAgICAgICAgZG9uZVdpdGhFbXBsb3llZTogZG9uZSxcbiAgICAgICAgICAgICAgICBtYXA6IGdldEN1cnJlbnQsXG4gICAgICAgICAgICAgICAgbWFwMjogcmljaGFyZHNtZXRob2QsXG4gICAgICAgICAgICAgICAgV2hvQW1JOiBnZXRVc2VyLFxuICAgICAgICAgICAgICAgIEdldFRhc2tzOiBHZXRUYXNrc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlZmVycmVkLnByb21pc2VcbiAgICAgICAgXVxuXG5cbiAgICB9KTtcbiIsIi8vIGZvciBhZGRpbmcgYW4gYWN0aXZpdHkgdG8gYSBjYW1wYWlnblxuY2xhc3MgTmV3QWN0aXZpdHkge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuU3RhcnREYXRlVGltZSA9IG1vbWVudChvYmouU3RhcnREYXRlVGltZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKVxuICAgICAgICB0aGlzLkNvbXBsZXRpb25EYXRlVGltZSA9IG1vbWVudChvYmouQ29tcGxldGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG4gICAgfVxufVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCdhY3Rpdml0eUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRodHRwLCBhY3Rpdml0eUZhY3RvcnksICR1cGxvYWQpIHtcbiAgICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gYWN0aXZpdHkgY29udHJvbGxlclwiKVxuXG4gICAgJHNjb3BlLnVzZXJMaXN0ID0gW107XG4gICAgdmFyIGdldFVzZXJzID0gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS91c2VycycpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IHVzZXJzXCIsIGRhdGEuZGF0YS5Vc2VyTGlzdClcbiAgICAgICAgJHNjb3BlLnVzZXJMaXN0ID0gZGF0YS5kYXRhLlVzZXJMaXN0XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgIC8vIGRvIHNvbWV0aGluZ1xuICAgIH0pXG5cbiAgICAkc2NvcGUubW9kZWwgPSBhY3Rpdml0eUZhY3RvcnlbMF07XG5cbiAgICAkc2NvcGUuc2V0RmlsZSA9IGZ1bmN0aW9uKCRmaWxlcyl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc2VkXCIsICRmaWxlcylcbiAgICAgICAgYWN0aXZpdHlGYWN0b3J5WzJdLmZpbGUgPSAkZmlsZXNbMF07XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTW9kZWxcIiwgYWN0aXZpdHlGYWN0b3J5WzJdIClcbiAgICB9XG5cblxufSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnYWN0aXZpdHlGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsICR1cGxvYWQsICRhbGVydCwgJHEpIHtcbiAgICB2YXIgYWN0aXZpdHlGYWN0b3J5ID0ge307XG4gICAgdmFyIG15VXBsb2FkID0ge307XG4gICAgdmFyIGFjdGl2aXR5TWV0aG9kcyA9IHtcbiAgICAgICAgc2VsZjogdGhpcyxcbiAgICAgICAgX2NhbXBhaWduSUQ6IFwiXCIsXG4gICAgICAgIF9hY3Rpdml0eTogXCJcIixcbiAgICAgICAgc2F2ZUFjdGl2aXR5X2FuZF90aGVuX2RvX0F0dGFjaG1lbnRzOiBmdW5jdGlvbihjYW1wYWlnbklELCBhY3Rpdml0eSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmUgYWN0aXZpdHkgYW5kIHRoZW4gZG8gYXR0YWNobWVudHNcIiwgY2FtcGFpZ25JRCwgYWN0aXZpdHkpO1xuICAgICAgICAgICAgLy8gc28gd2UgY2FuIHVzZSB0aGVtIGZvciB0aGUgbmV4dCBmdW5jdGlvblxuICAgICAgICAgICAgc2VsZi5fY2FtcGFpZ25JRCA9IGNhbXBhaWduSURcbiAgICAgICAgICAgIHNlbGYuYWN0aXZpdHkgPSBhY3Rpdml0eVxuICAgICAgICAgICAgLy8gJHFcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCAgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgLy8gZGVmZXJyZWQgb25seSByZXNvbHZlcyBpZiB0aGV5IGJvdGggcmVzb2x2ZSFcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduLycrY2FtcGFpZ25JRCsnL0FjdGl2aXR5JywgJC5wYXJhbShhY3Rpdml0eSkgKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VDQ0VTUyFcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdyB0byB1cGxvYWQuLi5cIiwgbXlVcGxvYWQpXG4gICAgICAgICAgICAgICAgaWYoT2JqZWN0LmtleXMobXlVcGxvYWQpLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV2ZXJtaW5kLi4uLm15VXBsb2FkIGlzIGVtcHR5XCIpXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3Rpdml0eUlEID0gZGF0YS5BY3Rpdml0eUlEO1xuICAgICAgICAgICAgICAgICAgICAkdXBsb2FkLmh0dHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24vJytjYW1wYWlnbklEKycvQWN0aXZpdHkvJythY3Rpdml0eUlEKycvQXR0YWNobWVudC8nICsgIG15VXBsb2FkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IG15VXBsb2FkLnR5cGV9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbXlVcGxvYWRcbiAgICAgICAgICAgICAgICAgICAgfSkucHJvZ3Jlc3MoZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncGVyY2VudDogJyArIHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xuICAgICAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3NcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmblNob3dBbGVydChlcnIuY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBmblNob3dBbGVydChlcnIuY29uZmlnKVxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZuU2hvd0FsZXJ0KCB7bWV0aG9kLCB1cmx9ICl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyXCIsIG1ldGhvZCwgdXJsKVxuICAgICAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IFwiRXJyb3JcIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IG1ldGhvZCArXCIgXCIrIHVybCxcbiAgICAgICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFthY3Rpdml0eUZhY3RvcnksIGFjdGl2aXR5TWV0aG9kcywgbXlVcGxvYWRdXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCkge1xuICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gdGhlIEFkbWluIENvbnRyb2xsZXJcIilcbiAgaWYoISRyb290U2NvcGUuY3JlZGVudGlhbHMuYWRtaW4pe1xuICAgICRzdGF0ZS5nbyhcImhvbWVcIilcbiAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IFwiRm9yYmlkZGVuIC0gXCIsXG4gICAgICAgIGNvbnRlbnQ6IFwiV2UncmUgY2FsbGluZyB0aGUgY29wc1wiLFxuICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICAgIGR1cmF0aW9uOiAzXG4gICAgICAgIC8vIGNvbnRhaW5lcjogXCJib2R5XCJcbiAgICAgIH0pO1xuICB9XG5cbn0pXG4iLCIvLyBEaXNwbGF5cyB3aG9sZSBsaXN0IG9mIHNhdmVkIGNhbXBhaWduc1xuYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcignY2FtcGFpZ25Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGNhbXBhaWduRmFjdG9yeSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIldlbGNvbWUgZnJvbSBjYW1wYWlnbiBjb250cm9sbGVyXCIpXG4gICAgICAgICRzY29wZS5hdmFpbGFibGVDYW1wYWlnbnMgPSBbXVxuICAgICAgICB2YXIgZmV0Y2hBbGwgPSBjYW1wYWlnbkZhY3RvcnkuZ2V0Q2FtcGFpZ25zKCk7XG4gICAgICAgIHZhciBkaXNwbGF5UmVzdWx0cyA9IGZldGNoQWxsLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QuLi5cIiwgZGF0YS5kYXRhKVxuICAgICAgICAgICAgJHNjb3BlLmF2YWlsYWJsZUNhbXBhaWducyA9IGRhdGEuZGF0YVxuICAgICAgICB9KVxuXG4gICAgfSlcbiIsIi8vIC8jL0NhbXBhaWducy9kZXRhaWxzL3tjYW1wYWlnbklEfVxuYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcignY2FtcGFpZ25Db250cm9sbGVyRGV0YWlscycsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBjYW1wYWlnbkZhY3RvcnksICRhbGVydCwgcXVlcnlGYWN0b3J5LCAkbW9kYWwsIGFjdGl2aXR5RmFjdG9yeSwgY2FtcGFpZ24pIHtcbiAgICAgICAgLy8gY2FtcGFpZ24gaXMgcGFzc2VkIGluIGZyb20gdGhlIHJvdXRlciByZXNvbHZlXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZ290IGNhbXBhaWduXCIsIGNhbXBhaWduKTtcbiAgICAgICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscyA9IG5ldyBDYW1wYWlnbihjYW1wYWlnbi5kYXRhKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDbGFzc1wiLCAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzKVxuICAgICAgICAkc2NvcGUuZXZlbnRzID0gJHNjb3BlLmNhbXBhaWduRGV0YWlscy5ldmVudHNcblxuICAgICAgICAvLyAkc2NvcGUuZXZlbnRzID0gJHNjb3BlLmNhbXBhaWduRGV0YWlscy5BY3Rpdml0aWVzLm1hcChFdmVudCA9PiBFdmVudCk7XG4gICAgICAgICRzY29wZS5ldmVudFNvdXJjZXMgPSBbXTtcblxuICAgICAgICAkc2NvcGUuUHJpbnQgPSAoKCkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETyAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmNhbXBhaWduRGV0YWlscyk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgdmFyIGVkaXRDYW1wYWlnbiA9ICRtb2RhbCh7XG4gICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9lZGl0Q2FtcGFpZ24ubW9kYWwuaHRtbCcsXG4gICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gb3BlbiBtb2RhbCBmb3IgZWRpdGluZyBjYW1wYWlnbiBkZXRhaWxzXG4gICAgICAgIC8vIG1vZGFsIHBhc3NlcyAndHJ1ZSdcbiAgICAgICAgJHNjb3BlLmVkaXRDYW1wYWlnbiA9IGZ1bmN0aW9uKGVkaXQgPSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKGVkaXQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBjSUQgPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkNhbXBhaWduSURcbiAgICAgICAgICAgICAgICBjYW1wYWlnbkZhY3RvcnkuZWRpdENhbXBhaWducyhjSUQsICRzY29wZS5jYW1wYWlnbkRldGFpbHMpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3M/XCIsIGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIGVkaXRDYW1wYWlnbi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJEdWRlLi4uLlwiLCBlcnIpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlXG4gICAgICAgICAgICBlZGl0Q2FtcGFpZ24uc2hvdygpO1xuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUubW9kYWxTYXZlQWN0aXZpdHkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBbYWN0aXZpdHlNb2RlbCwgYWN0aXZpdHlNZXRob2RzXSA9IGFjdGl2aXR5RmFjdG9yeVxuICAgICAgICAgICAgLy8gY2xhc3MgTmV3QWN0aXZpdHkgcGFyc2VzIHRoZSBkYXRlc1xuICAgICAgICAgICAgdmFyIGFjdGl2aXR5TW9kZWwgPSBuZXcgTmV3QWN0aXZpdHkoYWN0aXZpdHlNb2RlbCk7XG4gICAgICAgICAgICB2YXIgY0lEID0gJHNjb3BlLmNhbXBhaWduRGV0YWlscy5DYW1wYWlnbklEXG4gICAgICAgICAgICBhY3Rpdml0eU1ldGhvZHMuc2F2ZUFjdGl2aXR5X2FuZF90aGVuX2RvX0F0dGFjaG1lbnRzKGNJRCwgYWN0aXZpdHlNb2RlbCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzP1wiLCBkYXRhKVxuICAgICAgICAgICAgICAgIGFkZEV2ZW50cyhhY3Rpdml0eU1vZGVsKTtcbiAgICAgICAgICAgICAgICBhY3Rpdml0eU1vZGFsLmhpZGUoKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJEdWRlLi4uLlwiLCBlcnIpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vd2hlbiB5b3UgY2xpY2sgYSBjYWxlbmRhciBvYmplY3QsIHBvcHVsYXRlIGRlZXRzXG4gICAgICAgICRzY29wZS5kZWV0cztcblxuICAgICAgICAkc2NvcGUucHJvc3BlY3RzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmFjdGl2aXRpZXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLm9uQ2xpY2tUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudENvbnRhY3QgPSBjb250YWN0XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLmlzQWN0aXZlVGFiID0gZnVuY3Rpb24oY29udGFjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRhY3QgPT0gJHNjb3BlLmN1cnJlbnRDb250YWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnRhYmxlQ29uZmlnID0ge1xuICAgICAgICAgICAgaXRlbXNQZXJQYWdlOiAxMCxcbiAgICAgICAgICAgIGZpbGxMYXN0UGFnZTogZmFsc2UsXG4gICAgICAgICAgICBtYXhQYWdlczogNVxuICAgICAgICB9XG5cbiAgICAgICAgLy9jYW1wYWlnbiBpcyBhdCBwZW5kaW5nIEAgVGVtcGxhdGUgQCBCZWdpbm5pbmcsIG5vdCBwZW5kaW5nXG4gICAgICAgIC8vSXMgdGhpcyBhbHdheXMgdHJ1ZSB0aG91Z2g/IFdoYXQgaWYgaXQncyBhdCBQZW5kaW5nIHRvIGJlZ2luXG4gICAgICAgICRzY29wZS5jYW1wYWlnblBlbmRpbmcgPSBmYWxzZTtcblxuICAgICAgICAkc2NvcGUuRGVsZXRlUHJvc3BlY3QgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgICAgLy8gZG9lc24ndCBoYXZlIGEgcXVlcnkgSUQgdG8gc2VuZCBkZWxldGVzIHRvXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBpbXBsZW1lbnRlZFwiKVxuICAgICAgICAgICAgLy8gICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLlByb3NwZWN0cy5mb3JFYWNoKChhLGIpID0+IHtcbiAgICAgICAgICAgIC8vICAgICBpZihhLlByb3NwZWN0SUQgPT0gaWQpe1xuICAgICAgICAgICAgLy8gICAgICAgYS5TdGF0dXMgPyBhLlN0YXR1cyA9IDAgOiBhLlN0YXR1cyA9IDE7XG4gICAgICAgICAgICAvLyAgICAgICAgIHF1ZXJ5RmFjdG9yeS51cGRhdGVRdWVyeVN0YXR1cygkc2NvcGUuc2VsZWN0ZWRRdWVyeS5RdWVyeUlELCBpZCwgYS5TdGF0dXMpO1xuICAgICAgICAgICAgLy8gICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBDQUxFTkRBUiBGVU5DVElPTlNcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgZCA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICB2YXIgbSA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICAgICAgdmFyIHkgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkRXZlbnRzKHtcbiAgICAgICAgICAgIERlc2NyLCBTdGFydERhdGVUaW1lLCBDb21wbGV0aW9uRGF0ZVRpbWVcbiAgICAgICAgfSkge1xuICAgICAgICAgICAgJHNjb3BlLmV2ZW50cy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogRGVzY3IsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IFN0YXJ0RGF0ZVRpbWUsXG4gICAgICAgICAgICAgICAgZW5kOiBDb21wbGV0aW9uRGF0ZVRpbWUsXG4gICAgICAgICAgICAgICAgYWxsRGF5OiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLyogYWxlcnQgb24gZXZlbnRDbGljayAqL1xuICAgICAgICAkc2NvcGUuYWxlcnRPbkV2ZW50Q2xpY2sgPSBmdW5jdGlvbihldmVudCwgYWxsRGF5LCBqc0V2ZW50LCB2aWV3KSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLkFjdGl2aXRpZXMuZmluZCh4ID0+IHguRGVzY3IgPT0gZXZlbnQudGl0bGUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtYXRjaClcbiAgICAgICAgICAgICRzY29wZS5kZWV0cyA9IG1hdGNoO1xuICAgICAgICB9O1xuICAgICAgICAvKiBhbGVydCBvbiBEcm9wICovXG4gICAgICAgIC8vICRzY29wZS5hbGVydE9uRHJvcCA9IGZ1bmN0aW9uKGV2ZW50LCBkYXlEZWx0YSwgbWludXRlRGVsdGEsIGFsbERheSwgcmV2ZXJ0RnVuYywganNFdmVudCwgdWksIHZpZXcpIHtcbiAgICAgICAgLy8gICAgICRzY29wZS5hbGVydE1lc3NhZ2UgPSAoJ0V2ZW50IERyb3BlZCB0byBtYWtlIGRheURlbHRhICcgKyBkYXlEZWx0YSk7XG4gICAgICAgIC8vIH07XG5cbiAgICAgICAgLy8gJHNjb3BlLm9uRGF5Q2xpY2sgPSBmdW5jdGlvbihkYXRlLCBqc0V2ZW50KSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIldob2FcIiwganNFdmVudClcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyAvKiBhbGVydCBvbiBSZXNpemUgKi9cbiAgICAgICAgLy8gJHNjb3BlLmFsZXJ0T25SZXNpemUgPSBmdW5jdGlvbihldmVudCwgZGF5RGVsdGEsIG1pbnV0ZURlbHRhLCByZXZlcnRGdW5jLCBqc0V2ZW50LCB1aSwgdmlldykge1xuICAgICAgICAvLyAgICAgJHNjb3BlLmFsZXJ0TWVzc2FnZSA9ICgnRXZlbnQgUmVzaXplZCB0byBtYWtlIGRheURlbHRhICcgKyBtaW51dGVEZWx0YSk7XG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIC8qIGFkZCBhbmQgcmVtb3ZlcyBhbiBldmVudCBzb3VyY2Ugb2YgY2hvaWNlICovXG4gICAgICAgIC8vICRzY29wZS5hZGRSZW1vdmVFdmVudFNvdXJjZSA9IGZ1bmN0aW9uKHNvdXJjZXMsIHNvdXJjZSkge1xuICAgICAgICAvLyAgICAgdmFyIGNhbkFkZCA9IDA7XG4gICAgICAgIC8vICAgICBhbmd1bGFyLmZvckVhY2goc291cmNlcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAvLyAgICAgICAgIGlmIChzb3VyY2VzW2tleV0gPT09IHNvdXJjZSkge1xuICAgICAgICAvLyAgICAgICAgICAgICBzb3VyY2VzLnNwbGljZShrZXksIDEpO1xuICAgICAgICAvLyAgICAgICAgICAgICBjYW5BZGQgPSAxO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyAgICAgaWYgKGNhbkFkZCA9PT0gMCkge1xuICAgICAgICAvLyAgICAgICAgIHNvdXJjZXMucHVzaChzb3VyY2UpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9O1xuICAgICAgICAvLyAvKiBhZGQgY3VzdG9tIGV2ZW50Ki9cbiAgICAgICAgLy8gJHNjb3BlLmFkZEV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAkc2NvcGUuZXZlbnRzLnB1c2goe1xuICAgICAgICAvLyAgICAgICAgIHRpdGxlOiAnT3BlbiBTZXNhbWUnLFxuICAgICAgICAvLyAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCAyOCksXG4gICAgICAgIC8vICAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCAyOSksXG4gICAgICAgIC8vICAgICAgICAgY2xhc3NOYW1lOiBbJ29wZW5TZXNhbWUnXVxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIC8qIHJlbW92ZSBldmVudCAqL1xuICAgICAgICAvLyAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgLy8gICAgICRzY29wZS5ldmVudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gLyogQ2hhbmdlIFZpZXcgKi9cbiAgICAgICAgLy8gJHNjb3BlLmNoYW5nZVZpZXcgPSBmdW5jdGlvbih2aWV3LCBjYWxlbmRhcikge1xuICAgICAgICAvLyAgICAgY2FsZW5kYXIuZnVsbENhbGVuZGFyKCdjaGFuZ2VWaWV3Jywgdmlldyk7XG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIC8qIENoYW5nZSBWaWV3ICovXG4gICAgICAgIC8vICRzY29wZS5yZW5kZXJDYWxlbmRlciA9IGZ1bmN0aW9uKGNhbGVuZGFyKSB7XG4gICAgICAgIC8vICAgICBjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ3JlbmRlcicpO1xuICAgICAgICAvLyB9O1xuXG4gICAgICAgIHZhciBkYXlDbGlja2VkO1xuICAgICAgICAkc2NvcGUuZGF5Q2xpY2sgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG4gICAgICAgICAgICBkYXlDbGlja2VkID0gbW9tZW50KGEpLmZvcm1hdChcIkxMXCIpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0aXZpdHlNb2RhbCA9ICRtb2RhbCh7XG4gICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICd2aWV3cy9hZGRfYWN0aXZpdHkubW9kYWwuaHRtbCcsXG4gICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLmRheURibENsaWNrID0gZnVuY3Rpb24oYSwgYiwgYywgZCkge1xuICAgICAgICAgICAgdmFyIFthY3Rpdml0eU1vZGVsLCBhY3Rpdml0eU1ldGhvZHNdID0gYWN0aXZpdHlGYWN0b3J5XG4gICAgICAgICAgICBhY3Rpdml0eU1vZGVsLlN0YXJ0RGF0ZVRpbWUgPSBkYXlDbGlja2VkXG4gICAgICAgICAgICBhY3Rpdml0eU1vZGFsLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGNvbmZpZyBvYmplY3QgKi9cbiAgICAgICAgJHNjb3BlLnVpQ29uZmlnID0ge1xuICAgICAgICAgICAgY2FsZW5kYXI6IHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ1MCxcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogJ3RpdGxlJyxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICd0b2RheSBwcmV2LG5leHQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBldmVudENsaWNrOiAkc2NvcGUuYWxlcnRPbkV2ZW50Q2xpY2ssXG4gICAgICAgICAgICAgICAgZXZlbnREYmxDbGljazogJHNjb3BlLm9uRGF5Q2xpY2ssXG4gICAgICAgICAgICAgICAgZGF5Q2xpY2s6ICRzY29wZS5kYXlDbGljayxcbiAgICAgICAgICAgICAgICBkYXlEYmxDbGljazogJHNjb3BlLmRheURibENsaWNrLFxuICAgICAgICAgICAgICAgIC8vIGV2ZW50RHJvcDogJHNjb3BlLmFsZXJ0T25Ecm9wLFxuICAgICAgICAgICAgICAgIC8vIGV2ZW50UmVzaXplOiAkc2NvcGUuYWxlcnRPblJlc2l6ZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBldmVudCBzb3VyY2VzIGFycmF5Ki9cbiAgICAgICAgJHNjb3BlLmV2ZW50U291cmNlcyA9IFskc2NvcGUuZXZlbnRzXTtcblxuICAgICAgICAkc2NvcGUubmV4dFN0YXR1cyA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICB2YXIgY0lEID0gJHNjb3BlLmNhbXBhaWduRGV0YWlscy5DYW1wYWlnbklEXG4gICAgICAgICAgICBjYW1wYWlnbkZhY3RvcnkuZWRpdFN0YXR1cyhjSUQsIDMpXG4gICAgICAgIH1cblxuXG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5mYWN0b3J5KCdjYW1wYWlnbkZhY3RvcnknLFxuICAgICAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBxdWVyeVJlc3VsdHM6IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9jYW1wYWlnbnMnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2luZ2xlQ2FtcGFpZ246IGZ1bmN0aW9uKHBhcmFtSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHZXQgY2FtcGFpZ24uLi4uI1wiLCBwYXJhbUlEKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9jYW1wYWlnbi8nICsgcGFyYW1JRClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRoaXNTYXZlZFF1ZXJ5OiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vd2lsbCBoYXZlIHRvIHBhc3Mgd2hpY2ggc2F2ZWQgcXVlcnkgaW4gdGhlIGZ1dHVyZVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvdGhpc1F1ZXJ5JylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFF1ZXJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC9saXN0JylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNpbmdsZVF1ZXJ5OiBmdW5jdGlvbihxdWVyeUlEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoLycgKyBxdWVyeUlEKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnZlcnQ6IGZ1bmN0aW9uKHF1ZXJ5SUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduJywgJC5wYXJhbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBRdWVyeUlEOiBxdWVyeUlEXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNhdmVBY3Rpdml0eTogZnVuY3Rpb24oY2FtcGFpZ25JRCwgYWN0aXZpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL0NhbXBhaWduLycgKyBjYW1wYWlnbklEICsgJy9BY3Rpdml0eScsICQucGFyYW0oYWN0aXZpdHkpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFVzZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMnKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0Q2FtcGFpZ25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvY2FtcGFpZ24nKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZWRpdENhbXBhaWduczogZnVuY3Rpb24oY0lELCBvcmlnaW5hbEZvcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFZGl0IGNhbXBhaWduc1wiLCBvcmlnaW5hbEZvcm0pXG4gICAgICAgICAgICAgICAgICAgIHZhciBmb3JtID0ge31cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvcHlpbmcgb2JqZWN0IGFmZmVjdHMgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihmb3JtLCBvcmlnaW5hbEZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGVzZSBhcnJheXMgdGhyb3cgYW4gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZvcm0uQWN0aXZpdGllc1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybS5Qcm9zcGVjdHNcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZvcm0uQXR0YWNobWVudHNcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZvcm0uQnVzaW5lc3NPd25lcnNcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQ2FtcGFpZ24vJyArIGNJRCwgJC5wYXJhbShmb3JtKSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVkaXRTdGF0dXM6IGZ1bmN0aW9uKGNJRCwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNJRCwgc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9jYW1wYWlnbi8nICsgY0lEICsgJy9zdGF0dXMnLCAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IHN0YXR1c1xuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCduZXdDYW1wYWlnbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0LCBjYW1wYWlnbkZhY3RvcnksIHF1ZXJ5RmFjdG9yeSwgYWN0aXZpdHlGYWN0b3J5KSB7XG4gICAgY29uc29sZS5sb2coXCJXZWxjb21lIHRvIE5FVyBjYW1wYWlnbiBjb250cm9sbGVyXCIpXG5cbiAgICAkc2NvcGUudGFibGVDb25maWcgPSB7XG4gICAgICAgIGl0ZW1zUGVyUGFnZTogMTAsXG4gICAgICAgIGZpbGxMYXN0UGFnZTogZmFsc2UsXG4gICAgICAgIG1heFBhZ2VzOiA1XG4gICAgfVxuXG4gICAgJHNjb3BlLkRlbGV0ZVByb3NwZWN0ID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkc2NvcGUuY2FtcGFpZ25EZXRhaWxzLnJvd3MuZm9yRWFjaCgoYSxiKSA9PiB7XG4gICAgICAgICAgICBpZihhLlByb3NwZWN0SUQgPT0gaWQpe1xuICAgICAgICAgICAgICAgIGEuU3RhdHVzID8gYS5TdGF0dXMgPSAwIDogYS5TdGF0dXMgPSAxO1xuICAgICAgICAgICAgICAgIHF1ZXJ5RmFjdG9yeS51cGRhdGVRdWVyeVN0YXR1cygkc2NvcGUuc2VsZWN0ZWRRdWVyeS5RdWVyeUlELCBpZCwgYS5TdGF0dXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgJHNjb3BlLmNhbXBhaWduSUQ7XG4gICAgJHNjb3BlLmNhbXBhaWduQ29udmVydGVkID0gZmFsc2U7XG4gICAgJHNjb3BlLmNvbnZlcnQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29udmVydGluZy4uLlwiKTtcbiAgICAgICAgdmFyIHF1ZXJ5SUQgID0gJHNjb3BlLmNhbXBhaWduRGV0YWlscy5RdWVyeUlEO1xuICAgICAgICBjb25zb2xlLmVycm9yKHF1ZXJ5SUQpXG4gICAgICAgIGNhbXBhaWduRmFjdG9yeS5jb252ZXJ0KHF1ZXJ5SUQpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRE9ORSwgY2FtcGFpZ24gSUQgXCIsIGRhdGEuZGF0YS5DYW1wYWlnbklEKVxuICAgICAgICAgICAgJHNjb3BlLmNhbXBhaWduSUQgPSBkYXRhLmRhdGEuQ2FtcGFpZ25JRDtcbiAgICAgICAgICAgICRzY29wZS5jYW1wYWlnbkNvbnZlcnRlZCA9IHRydWU7XG4gICAgICAgIH0pXG4gICAgfTtcblxuICAgICRzY29wZS51c2VyTGlzdCA9IFtdO1xuICAgIGNhbXBhaWduRmFjdG9yeS5nZXRVc2VycygpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgYWxsIHVzZXJzLi4uLlwiLCBkYXRhKVxuICAgICAgICAkc2NvcGUudXNlckxpc3QgPSBkYXRhLmRhdGEuVXNlckxpc3Q7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICB9KVxuXG4gICAgJHNjb3BlLnNhdmVkUXVlcmllcyA9IFtdO1xuICAgICRzY29wZS5zZWxlY3RlZFF1ZXJ5O1xuICAgIGNhbXBhaWduRmFjdG9yeS5nZXRRdWVyaWVzKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdC4uLlwiLCBkYXRhKVxuICAgICAgICAkc2NvcGUuc2F2ZWRRdWVyaWVzID0gZGF0YS5kYXRhXG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAvLyBkbyBzb21ldGhpbmdcbiAgICB9KVxuXG4gICAgJHNjb3BlLmNhbXBhaWduRGV0YWlscyA9IHt9O1xuICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMucm93cyA9IFtdO1xuICAgICRzY29wZS5zZXRCaWxsR3JvdXAgPSAoZGF0YSkgPT4ge1xuICAgICAgICAvLyBGSVhNRSB0aGlzIGlzIGJlaW5nIGZpcmVkIG9uIHBhZ2UgaW5pdCBiZWNhdXNlIGl0IHRoaW5rcyB0aGUgdmFsdWVcbiAgICAgICAgLy8gaXMgY2hhbmdpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ0hBTkdFRFwiLCAkc2NvcGUuc2VsZWN0ZWRRdWVyeSlcbiAgICAgICAgY2FtcGFpZ25GYWN0b3J5LnNpbmdsZVF1ZXJ5KCRzY29wZS5zZWxlY3RlZFF1ZXJ5LlF1ZXJ5SUQpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICRzY29wZS5jYW1wYWlnbkRldGFpbHMgPSBuZXcgUGVuZGluZ0NhbXBhaWduKGRhdGEuZGF0YSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jYW1wYWlnbkRldGFpbHMpXG4gICAgICAgICAgICAkc2NvcGUuZmV0Y2hlZCA9IHRydWU7XG4gICAgICAgIH0pXG4gICAgfTtcbiAgICBpZigkc3RhdGUucGFyYW1zLmNhbXBhaWduSUQgIT1cIlwiKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJZZXMgdGhlcmUncyBwYXJhbXNcIik7XG4gICAgICAgIC8vIFRPRE8gYWx3YXlzIGZpcmVzIHNldEJpbGxHcm91cFxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRRdWVyeSA9IHtQcm9kdWN0SUQ6IDEsIFF1ZXJ5SUQ6ICRzdGF0ZS5wYXJhbXMuY2FtcGFpZ25JRCB8fCAxLCBOYW1lOiBcIm1vIHRlc3RcIn1cbiAgICAgICAgJHNjb3BlLnNldEJpbGxHcm91cCgpO1xuICAgIH1cblxuICAgICRzY29wZS5jaGFuZ2VTdGF0ZSA9IChibGVoKSA9PiB7XG4gICAgICAgICRzdGF0ZS5nbygnaG9tZS5jYW1wYWlnbi5kZXRhaWxzJywge3BhcmFtczonMTMzNyd9KVxuICAgIH07XG5cbiAgICAkc2NvcGUubmV3QWN0aXZpdHkgPSB7fTtcbiAgICAkc2NvcGUuc2F2ZWRBY3Rpdml0aWVzID0gW107XG4gICAgJHNjb3BlLmFjdGl2aXR5Tm8gPSAwO1xuICAgICRzY29wZS5zZWxlY3RlZFVzZXI7XG4gICAgdmFyIGFjdGl2aXR5X29yZGVyID0gMTtcbiAgICAkc2NvcGUuc2F2ZUFjdGl2aXR5ID0gKCkgPT4ge1xuICAgICAgICB2YXIgW2FjdGl2aXR5TW9kZWwsIGFjdGl2aXR5TWV0aG9kc10gPSBhY3Rpdml0eUZhY3RvcnlcbiAgICAgICAgLy8gY2xhc3MgTmV3QWN0aXZpdHkgcGFyc2VzIHRoZSBkYXRlc1xuICAgICAgICB2YXIgYWN0aXZpdHlNb2RlbCA9IG5ldyBOZXdBY3Rpdml0eShhY3Rpdml0eU1vZGVsKTtcbiAgICAgICAgdmFyIGNJRCA9ICRzY29wZS5jYW1wYWlnbklEXG4gICAgICAgIGFjdGl2aXR5TWV0aG9kcy5zYXZlQWN0aXZpdHlfYW5kX3RoZW5fZG9fQXR0YWNobWVudHMoY0lELCBhY3Rpdml0eU1vZGVsKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBkYXRhLk9yZGVyID0gYWN0aXZpdHlfb3JkZXJcbiAgICAgICAgICAgIGFjdGl2aXR5X29yZGVyKytcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzcz9cIiwgZGF0YSlcbiAgICAgICAgICAgICRzY29wZS5zYXZlZEFjdGl2aXRpZXMucHVzaChkYXRhKTtcbiAgICAgICAgICAgICRzY29wZS5zYXZlZEFjdGl2aXRpZXMuc29ydChjb21wYXJlRGF0ZXMpXG4gICAgICAgICAgICAvL2lmIHRoZSBsYXN0IG9uZSwgYWZ0ZXIgc29ydGluZywgaXMgbm90IHRoZSBvbmUgd2UganVzdCBhZGRlZFxuICAgICAgICAgICAgaWYoJHNjb3BlLnNhdmVkQWN0aXZpdGllc1skc2NvcGUuc2F2ZWRBY3Rpdml0aWVzLmxlbmd0aCAtIDFdICE9IGRhdGEpe1xuICAgICAgICAgICAgICAgIC8vIHRoZW4gZ2l2ZSB0aGVtIGFsbCBuZXcgJ29yZGVyJyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgLy8gYW5kIHJlc2VuZCB0byB0aGUgc2VydmVyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJXaG9hIHdob2EsIHRpbWUgbWl4dXAuLi5cIilcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5zYXZlZEFjdGl2aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNhdmVkQWN0aXZpdGllc1tpXS5PcmRlciA9IGkrMTtcbiAgICAgICAgICAgICAgICAgICAgLy9zZW5kIHRob3NlIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLmFjdGl2aXR5Tm8rKztcbiAgICAgICAgICAgICRzY29wZS5uZXdBY3Rpdml0eSA9IHt9O1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiRHVkZS4uLi5cIiwgZXJyKVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY29tcGFyZURhdGVzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChhLlN0YXJ0RGF0ZVRpbWUpLmlzQWZ0ZXIoYi5TdGFydERhdGVUaW1lKTsgXG4gICAgfVxuXG59KVxuIiwiY2xhc3MgUGVuZGluZ0NhbXBhaWduIHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICB0aGlzLlBhcmFtU3RyVW5wYWNrZWQgPSAnJztcbiAgICAgICAgdmFyIHBhcmFtT2JqID0gJC5kZXBhcmFtKG9iai5QYXJhbVN0cilcbiAgICAgICAgT2JqZWN0LmtleXMoIHBhcmFtT2JqICkuZm9yRWFjaCgoa2V5ICk9PntcbiAgICAgICAgICAgIHRoaXMuUGFyYW1TdHJVbnBhY2tlZCArPSBrZXkgKyBcIiA9IFwiICsgcGFyYW1PYmpba2V5XSArIFwiOyBcIjtcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJjbGFzcyBBY3Rpdml0eTIge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgfVxufVxuIiwiY2xhc3MgQ2FtcGFpZ24ge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuQWN0aXZpdGllcyA9IFtcbiAgICAgICAgICAgIGZvciAoeCBvZiBvYmouQWN0aXZpdGllcykgbmV3IE5ld0FjdGl2aXR5KHgpXG4gICAgICAgIF1cbiAgICAgICAgdGhpcy5Qcm9zcGVjdENvdW50ID0gb2JqLlByb3NwZWN0cy5sZW5ndGhcbiAgICAgICAgdGhpcy5BY3Rpdml0eUNvdW50ID0gb2JqLkFjdGl2aXRpZXMubGVuZ3RoXG4gICAgfVxuICAgIC8vIHJldHVybnMge0Rlc2NyLCBTdGFydERhdGVUaW1lLCBDb21wbGV0aW9uRGF0ZVRpbWV9IGZyb20gdGhpcy5BY3Rpdml0ZXNcbiAgICBnZXQgZXZlbnRzKCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgZm9yICh7XG4gICAgICAgICAgICAgICAgICAgIERlc2NyLCBTdGFydERhdGVUaW1lLCBDb21wbGV0aW9uRGF0ZVRpbWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2YgdGhpcy5BY3Rpdml0aWVzKSB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IERlc2NyLFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBTdGFydERhdGVUaW1lLFxuICAgICAgICAgICAgICAgIGVuZDogQ29tcGxldGlvbkRhdGVUaW1lXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9XG59XG4iLCJjbGFzcyBDdXN0b21lciB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgLy8gdGhpcy5fQWxwaGEgPSB7QXZhaWxhYmxlQ3JlZGl0IDogb2JqLkF2YWlsYWJsZUNyZWRpdH1cbiAgICAgICAgdGhpcy5PcmRlcmluZ01ldGhvZHMgPSBbIGZvcih4IG9mIE9iamVjdC5rZXlzKHtDcnhTZXR1cDogb2JqLkNyeFNldHVwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NPU1NldHVwOiBvYmouQ1NPU1NldHVwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRVdPTVNldHVwOiBvYmouRVdPTVNldHVwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUEJBT1NldHVwOiBvYmouUEJBT1NldHVwfSkgKWlmIChvYmpbeF0gPT0gMCkgeF0udG9TdHJpbmcoKTtcbiAgICB9XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5jb250cm9sbGVyKCdraW1Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCwgcHJvc3BlY3RGYWN0b3J5LCAkbW9kYWwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbyBraW1cIilcbiAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdDtcbiAgICAgICAgJHNjb3BlLkNvbnRhY3RzID0gW107XG4gICAgICAgIHByb3NwZWN0RmFjdG9yeS5nZXRQcm9zcGVjdF9ieV9JRCgkc3RhdGUucGFyYW1zKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IHByb3NwZWN0XCIsIGRhdGEpXG4gICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0ID0gbmV3IFByb3NwZWN0KGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUudGhlX1Byb3NwZWN0LmxhdGVzdCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGhlX1Byb3NwZWN0KVxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0ID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0c1swXVxuICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnJldmVyc2UoKVxuICAgICAgICB9KVxuXG4gICAgICAgICRzY29wZS5jb250YWN0c0NvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICRzY29wZS5pc3N1ZXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUubm90ZXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgLy9jb250YWN0cyB0YWJzXG4gICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdFxuICAgICAgICAkc2NvcGUub25DbGlja1RhYiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9IGNvbnRhY3RcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaXNBY3RpdmVUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSAxO1xuXG5cbiAgICAgICAgJHNjb3BlLmFkZENvbnRhY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBteU1vZGFsID0gJG1vZGFsKHtcbiAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndmlld3MvYWRkX2NvbnRhY3QudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIHNob3c6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ2xhbmRpbmdDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIFRhc2tzKSB7XG4gIGNvbnNvbGUubG9nKFwiTGFuZGluZyBDb250cm9sbGVyXCIpXG4gIC8vIFBhc3NlZCBpbiBUYXNrcyBmYWN0b3J5Li4ud2UnbGwgaGFuZGxlIGl0IGFsbCBoZXJlIGZvciBub3dcblxuICBpZighJHJvb3RTY29wZS5sb2dnZWRJbil7XG4gICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIGluLCByZWRpcmVjdFwiKVxuICAgICRzdGF0ZS5nbyhcImxvZ2luXCIpO1xuICB9XG5cbiAgJHNjb3BlLmRyb3Bkb3duID0gW1xuICB7XG4gICAgXCJ0ZXh0XCI6IFwiTmV3IENhbXBhaWduXCIsXG4gICAgXCJjbGlja1wiOiAnJHN0YXRlLmdvKFwiaG9tZS5jYW1wYWlnbi5uZXdcIiknXG4gIH0sXG4gIHtcbiAgICBcInRleHRcIjogXCJTYXZlZCBDYW1wYWlnbnNcIixcbiAgICBcImNsaWNrXCI6ICckc3RhdGUuZ28oXCJob21lLmNhbXBhaWduXCIpJ1xuICB9XG4gIC8vIHtcbiAgLy8gICBcImRpdmlkZXJcIjogdHJ1ZVxuICAvLyB9LFxuICAvLyB7XG4gIC8vICAgXCJ0ZXh0XCI6IFwiTmV3IFF1ZXJ5XCIsXG4gIC8vICAgXCJjbGlja1wiOiAnJHN0YXRlLmdvKFwiaG9tZS5xdWVyeVwiKSdcbiAgLy8gfVxuXG5dO1xuXG5cbiRzY29wZS5pbk1hcmtldGluZyA9IGZhbHNlXG5cblxuaWYoJHJvb3RTY29wZS5jcmVkZW50aWFscy5ncm91cCA9PSBcIk1hcmtldGluZ1wiKXtcbiAgJHNjb3BlLmluTWFya2V0aW5nID0gdHJ1ZTtcblxuICAvLyBkZXRlcm1pbmVkIHRoZWlyIGdyb3VwLCByZW5kZXJlZCB2aWV3LCBub3cgdG8gZmV0Y2ggdGFza3MuXG4gIC8vIGRvIHdlIHdhbnQgdG8gZG8gdGhpcyBpbiB0aGUgbGFuZGluZyBjb250cm9sbGVyP1xuICAvLyBvciBhIFRhc2tzIGNvbnRyb2xsZXI/IFdpdGggYSB0YXNrcyB2aWV3P1xuICB2YXIgdGhpc1VzZXJzR3JvdXAgPSAkcm9vdFNjb3BlLmNyZWRlbnRpYWxzXG5cbiAgJHNjb3BlLmFsbFRhc2tzID0gW11cbiAgdmFyIGZldGNoID0gVGFza3MubXlUYXNrcyh0aGlzVXNlcnNHcm91cCk7XG4gIHZhciBzaG93VGFza3MgPSBmZXRjaC50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKFwiU2hvdyB0YXNrcy4uLi5cIiwgZGF0YSlcbiAgICAkc2NvcGUuYWxsVGFza3MgPSBkYXRhLmRhdGFcbiAgfSlcblxufVxuXG5cbndpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICB2YXIgZW50cmllcyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzKCk7XG5cbiAgICAgICAgZW50cmllcyA9IGVudHJpZXMuc29ydCggZnVuY3Rpb24oIGEsIGIgKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5kdXJhdGlvbiAtIGEuZHVyYXRpb247XG4gICAgICAgIH0gKTtcblxuICAgICAgICAkcm9vdFNjb3BlLm1ldHJpY3MgPSBlbnRyaWVzO1xufSwgNTAwKTtcblxuXG5cblxufSkiLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ1Rhc2tzJyxcbiBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBxdWVyeVJlc3VsdHM6ZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvY2FtcGFpZ25zJylcbiAgICAgICAgfSxcbiAgICAgICAgbXlUYXNrczpmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGYWN0b3J5IFRBU0tTIGdldHRpbmcgbXlUYXNrcy4uXCIsIGRhdGEpXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS91c2VydGFza3MnLCBkYXRhKVxuICAgICAgICB9LFxuICAgICAgICB0YXNrRGV0YWlsczpmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGYWN0b3J5IFRBU0tTIGdldHRpbmcgZGV0YWlscy4uXCIsIGRhdGEpXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS90YXNrZGV0YWlscycsIGRhdGEpXG4gICAgICAgIH0sXG4gICAgICAgIGFsbFRhc2tzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmFjdG9yeSB0YXNrcyByZXR1cm5pbmcgZXZlcnkgdGFzay4uLlwiKVxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWxsdGFza3MnKVxuICAgICAgICB9LFxuICAgICAgICB0YXNrUHJvc3BlY3Q6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgLy8gdGhpcyB3b3VsZCBiZSBhIHBvc3Qgd2l0aCBsaWtlLCB0YXNrSUQgPT0gcHJvc3BlY3QudGFza0lEXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9yYW5kb21Qcm9zcGVjdCcpXG4gICAgICAgIH1cbiAgICB9O1xuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLnNlcnZpY2UoJ0xvZ2luU2VydmljZScsIGZ1bmN0aW9uKCRjb29raWVzLCAkaHR0cCwgUHJpdmlsZWdlKSB7XG4gICAgICAgIGNsYXNzIFVzZXIge1xuICAgICAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ2V0IHVzZXIoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBMb2dpblNlcnZpY2UgPSB7fVxuICAgICAgICBMb2dpblNlcnZpY2Uuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgIExvZ2luU2VydmljZS51c2VyID0gbmV3IFVzZXIodXNlcik7XG4gICAgICAgICAgICBQcml2aWxlZ2UuU2V0U2Vzc2lvbih1c2VyLmtleSwgdGhpcy51c2VyLnVzZXIpXG4gICAgICAgIH1cbiAgICAgICAgTG9naW5TZXJ2aWNlLmNvb2tpZV91c2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGNvb2tpZXMudXNlcmlkO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvZ2luU2VydmljZS51c2VyID0gbmV3IFVzZXIoe30pO1xuICAgICAgICByZXR1cm4gTG9naW5TZXJ2aWNlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFByaXZpbGVnZSwgTG9naW5TZXJ2aWNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29udHJvbGxlciBsb2FkZWRcIilcbiAgICAgICAgJHNjb3BlLmNyZWRzID0ge307XG4gICAgICAgICRzY29wZS5jcmVkcy51c2VyaWQgPSBMb2dpblNlcnZpY2UuY29va2llX3VzZXJcbiAgICAgICAgJHNjb3BlLmxvZ2luU3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBQcml2aWxlZ2UuTG9naW4oJHNjb3BlLmNyZWRzKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgTG9naW5TZXJ2aWNlLnNldFVzZXIoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImhvbWVcIik7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmZhY3RvcnkoJ1ByaXZpbGVnZScsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJGh0dHAsICRxLCAkY29va2llcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZhY3RvcnkgbG9hZGVkXCIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBMb2dpbjogZnVuY3Rpb24oY3JlZHMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBPU1QgRFVERVwiLCBjcmVkcylcbiAgICAgICAgICAgICAgICBkZWxldGUgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1hLZXknXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvQXV0aCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oY3JlZHMpLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTG9nb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG9cIilcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXRTZXNzaW9uOiBmdW5jdGlvbih4a2V5OiBzdHJpbmcsIHVzZXI6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICRjb29raWVzLnhrZXkgPSB4a2V5XG4gICAgICAgICAgICAgICAgJGNvb2tpZXMudXNlcmlkID0gdXNlclxuICAgICAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYS2V5J10gPSB4a2V5XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnYWxlcnRGYWN0b3J5Jyxcbi8vIG5vdyBSZXNlYXJjaCBGYWN0b3J5XG4gZnVuY3Rpb24gKCRhbGVydCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFsZXJ0czogZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBbGVydFwiLCBtZXNzYWdlKVxuICAgICAgICAgIHZhciBteUFsZXJ0ID0gJGFsZXJ0KHt0aXRsZTogbWVzc2FnZS5jb25maWcudXJsLFxuICAgICAgICAgIGNvbnRlbnQ6IG1lc3NhZ2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICAgICAgZHVyYXRpb246IDNcbiAgICAgICAgICAvLyBjb250YWluZXI6IFwiYm9keVwiXG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgfVxuKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gIC5kaXJlY3RpdmUoJ2NvbGxhcHNlJywgWyckdHJhbnNpdGlvbicsIGZ1bmN0aW9uICgkdHJhbnNpdGlvbikge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgICB2YXIgaW5pdGlhbEFuaW1Ta2lwID0gdHJ1ZTtcbiAgICAgICAgdmFyIGN1cnJlbnRUcmFuc2l0aW9uO1xuXG4gICAgICAgIGZ1bmN0aW9uIGRvVHJhbnNpdGlvbihjaGFuZ2UpIHtcbiAgICAgICAgICB2YXIgbmV3VHJhbnNpdGlvbiA9ICR0cmFuc2l0aW9uKGVsZW1lbnQsIGNoYW5nZSk7XG4gICAgICAgICAgaWYgKGN1cnJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICAgICAgICBjdXJyZW50VHJhbnNpdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudFRyYW5zaXRpb24gPSBuZXdUcmFuc2l0aW9uO1xuICAgICAgICAgIG5ld1RyYW5zaXRpb24udGhlbihuZXdUcmFuc2l0aW9uRG9uZSwgbmV3VHJhbnNpdGlvbkRvbmUpO1xuICAgICAgICAgIHJldHVybiBuZXdUcmFuc2l0aW9uO1xuXG4gICAgICAgICAgZnVuY3Rpb24gbmV3VHJhbnNpdGlvbkRvbmUoKSB7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgaXQncyB0aGlzIHRyYW5zaXRpb24sIG90aGVyd2lzZSwgbGVhdmUgaXQgYWxvbmUuXG4gICAgICAgICAgICBpZiAoY3VycmVudFRyYW5zaXRpb24gPT09IG5ld1RyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICAgY3VycmVudFRyYW5zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwYW5kKCkge1xuICAgICAgICAgIGlmIChpbml0aWFsQW5pbVNraXApIHtcbiAgICAgICAgICAgIGluaXRpYWxBbmltU2tpcCA9IGZhbHNlO1xuICAgICAgICAgICAgZXhwYW5kRG9uZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpLmFkZENsYXNzKCdjb2xsYXBzaW5nJyk7XG4gICAgICAgICAgICBkb1RyYW5zaXRpb24oeyBoZWlnaHQ6IGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ICsgJ3B4JyB9KS50aGVuKGV4cGFuZERvbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4cGFuZERvbmUoKSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpO1xuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlIGluJyk7XG4gICAgICAgICAgZWxlbWVudC5jc3Moe2hlaWdodDogJ2F1dG8nfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb2xsYXBzZSgpIHtcbiAgICAgICAgICBpZiAoaW5pdGlhbEFuaW1Ta2lwKSB7XG4gICAgICAgICAgICBpbml0aWFsQW5pbVNraXAgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbGxhcHNlRG9uZSgpO1xuICAgICAgICAgICAgZWxlbWVudC5jc3Moe2hlaWdodDogMH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBDU1MgdHJhbnNpdGlvbnMgZG9uJ3Qgd29yayB3aXRoIGhlaWdodDogYXV0bywgc28gd2UgaGF2ZSB0byBtYW51YWxseSBjaGFuZ2UgdGhlIGhlaWdodCB0byBhIHNwZWNpZmljIHZhbHVlXG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7IGhlaWdodDogZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgKyAncHgnIH0pO1xuICAgICAgICAgICAgLy90cmlnZ2VyIHJlZmxvdyBzbyBhIGJyb3dzZXIgcmVhbGl6ZXMgdGhhdCBoZWlnaHQgd2FzIHVwZGF0ZWQgZnJvbSBhdXRvIHRvIGEgc3BlY2lmaWMgdmFsdWVcbiAgICAgICAgICAgIHZhciB4ID0gZWxlbWVudFswXS5vZmZzZXRXaWR0aDtcblxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnY29sbGFwc2UgaW4nKS5hZGRDbGFzcygnY29sbGFwc2luZycpO1xuXG4gICAgICAgICAgICBkb1RyYW5zaXRpb24oeyBoZWlnaHQ6IDAgfSkudGhlbihjb2xsYXBzZURvbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbGxhcHNlRG9uZSgpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJyk7XG4gICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnY29sbGFwc2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLiR3YXRjaChhdHRycy5jb2xsYXBzZSwgZnVuY3Rpb24gKHNob3VsZENvbGxhcHNlKSB7XG4gICAgICAgICAgaWYgKHNob3VsZENvbGxhcHNlKSB7XG4gICAgICAgICAgICBjb2xsYXBzZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBhbmQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKVxuICAuZmFjdG9yeSgnJHRyYW5zaXRpb24nLCBbJyRxJywgJyR0aW1lb3V0JywgJyRyb290U2NvcGUnLCBmdW5jdGlvbigkcSwgJHRpbWVvdXQsICRyb290U2NvcGUpIHtcblxuICB2YXIgJHRyYW5zaXRpb24gPSBmdW5jdGlvbihlbGVtZW50LCB0cmlnZ2VyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICB2YXIgZW5kRXZlbnROYW1lID0gJHRyYW5zaXRpb25bb3B0aW9ucy5hbmltYXRpb24gPyAnYW5pbWF0aW9uRW5kRXZlbnROYW1lJyA6ICd0cmFuc2l0aW9uRW5kRXZlbnROYW1lJ107XG5cbiAgICB2YXIgdHJhbnNpdGlvbkVuZEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW1lbnQudW5iaW5kKGVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZEhhbmRsZXIpO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChlbmRFdmVudE5hbWUpIHtcbiAgICAgIGVsZW1lbnQuYmluZChlbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmRIYW5kbGVyKTtcbiAgICB9XG5cbiAgICAvLyBXcmFwIGluIGEgdGltZW91dCB0byBhbGxvdyB0aGUgYnJvd3NlciB0aW1lIHRvIHVwZGF0ZSB0aGUgRE9NIGJlZm9yZSB0aGUgdHJhbnNpdGlvbiBpcyB0byBvY2N1clxuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCBhbmd1bGFyLmlzU3RyaW5nKHRyaWdnZXIpICkge1xuICAgICAgICBlbGVtZW50LmFkZENsYXNzKHRyaWdnZXIpO1xuICAgICAgfSBlbHNlIGlmICggYW5ndWxhci5pc0Z1bmN0aW9uKHRyaWdnZXIpICkge1xuICAgICAgICB0cmlnZ2VyKGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmICggYW5ndWxhci5pc09iamVjdCh0cmlnZ2VyKSApIHtcbiAgICAgICAgZWxlbWVudC5jc3ModHJpZ2dlcik7XG4gICAgICB9XG4gICAgICAvL0lmIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0cmFuc2l0aW9ucywgaW5zdGFudGx5IHJlc29sdmVcbiAgICAgIGlmICggIWVuZEV2ZW50TmFtZSApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFkZCBvdXIgY3VzdG9tIGNhbmNlbCBmdW5jdGlvbiB0byB0aGUgcHJvbWlzZSB0aGF0IGlzIHJldHVybmVkXG4gICAgLy8gV2UgY2FuIGNhbGwgdGhpcyBpZiB3ZSBhcmUgYWJvdXQgdG8gcnVuIGEgbmV3IHRyYW5zaXRpb24sIHdoaWNoIHdlIGtub3cgd2lsbCBwcmV2ZW50IHRoaXMgdHJhbnNpdGlvbiBmcm9tIGVuZGluZyxcbiAgICAvLyBpLmUuIGl0IHdpbGwgdGhlcmVmb3JlIG5ldmVyIHJhaXNlIGEgdHJhbnNpdGlvbkVuZCBldmVudCBmb3IgdGhhdCB0cmFuc2l0aW9uXG4gICAgZGVmZXJyZWQucHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICggZW5kRXZlbnROYW1lICkge1xuICAgICAgICBlbGVtZW50LnVuYmluZChlbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmRIYW5kbGVyKTtcbiAgICAgIH1cbiAgICAgIGRlZmVycmVkLnJlamVjdCgnVHJhbnNpdGlvbiBjYW5jZWxsZWQnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG5cbiAgLy8gV29yayBvdXQgdGhlIG5hbWUgb2YgdGhlIHRyYW5zaXRpb25FbmQgZXZlbnRcbiAgdmFyIHRyYW5zRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyYW5zJyk7XG4gIHZhciB0cmFuc2l0aW9uRW5kRXZlbnROYW1lcyA9IHtcbiAgICAnV2Via2l0VHJhbnNpdGlvbic6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAnTW96VHJhbnNpdGlvbic6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAnT1RyYW5zaXRpb24nOiAnb1RyYW5zaXRpb25FbmQnLFxuICAgICd0cmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnXG4gIH07XG4gIHZhciBhbmltYXRpb25FbmRFdmVudE5hbWVzID0ge1xuICAgICdXZWJraXRUcmFuc2l0aW9uJzogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgJ01velRyYW5zaXRpb24nOiAnYW5pbWF0aW9uZW5kJyxcbiAgICAnT1RyYW5zaXRpb24nOiAnb0FuaW1hdGlvbkVuZCcsXG4gICAgJ3RyYW5zaXRpb24nOiAnYW5pbWF0aW9uZW5kJ1xuICB9O1xuICBmdW5jdGlvbiBmaW5kRW5kRXZlbnROYW1lKGVuZEV2ZW50TmFtZXMpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIGVuZEV2ZW50TmFtZXMpe1xuICAgICAgaWYgKHRyYW5zRWxlbWVudC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBlbmRFdmVudE5hbWVzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAkdHJhbnNpdGlvbi50cmFuc2l0aW9uRW5kRXZlbnROYW1lID0gZmluZEVuZEV2ZW50TmFtZSh0cmFuc2l0aW9uRW5kRXZlbnROYW1lcyk7XG4gICR0cmFuc2l0aW9uLmFuaW1hdGlvbkVuZEV2ZW50TmFtZSA9IGZpbmRFbmRFdmVudE5hbWUoYW5pbWF0aW9uRW5kRXZlbnROYW1lcyk7XG4gIHJldHVybiAkdHJhbnNpdGlvbjtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmlsdGVyKCdzZWxlY3RlZFRhZ3MnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFza3MsIHRhZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRhc2tzLmZpbHRlcihmdW5jdGlvbih0YXNrKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdGFzay5UYWdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ3MuaW5kZXhPZih0YXNrW2ldKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5jb250cm9sbGVyKCduYXZiYXJTZWFyY2hlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQsIHByb3NwZWN0RmFjdG9yeSkge1xuICAgIGNvbnNvbGUubG9nKFwiSGVsbG8gbmF2YmFyXCIpXG4gICAgJHNjb3BlLnBvcG92ZXIgPSB7XG4gICAgICBcInRpdGxlXCI6IFwiVGl0bGVcIixcbiAgICAgIFwiY29udGVudFwiOiBcIkhlbGxvIFBvcG92ZXI8YnIgLz5UaGlzIGlzIGEgbXVsdGlsaW5lIG1lc3NhZ2UhXCJcbiAgICB9O1xuXG4gICAgJHNjb3BlLmRvb2RvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJEb29cIilcbiAgICB9XG5cbiAgICAkc2NvcGUuYnV0dG9uID0ge1xuICBcInRvZ2dsZVwiOiBmYWxzZSxcbiAgXCJjaGVja2JveFwiOiB7XG4gICAgXCJsZWZ0XCI6IGZhbHNlLFxuICAgIFwibWlkZGxlXCI6IHRydWUsXG4gICAgXCJyaWdodFwiOiBmYWxzZVxuICB9LFxuICBcInJhZGlvXCI6IDJcbn07XG5cblxuJHNjb3BlLmNvbG9yID0gJ2JsdWUnO1xuICAgICAgJHNjb3BlLnNwZWNpYWxWYWx1ZSA9IHtcbiAgICAgICAgXCJpZFwiOiBcIjEyMzQ1XCIsXG4gICAgICAgIFwidmFsdWVcIjogXCJncmVlblwiXG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUucG9wb3ZlciA9IHtcbiAgXCJ0aXRsZVwiOiBcIkNvY2tzXCIsXG4gIFwiY29udGVudFwiOiBcIkhlbGxvIFBvcG92ZXI8YnIgLz5UaGlzIGlzIGEgbXVsdGlsaW5lIG1lc3NhZ2UhXCJcbn07XG5cbn0pXG4iLCIvKipcbiAqIGRpclBhZ2luYXRpb24gLSBBbmd1bGFySlMgbW9kdWxlIGZvciBwYWdpbmF0aW5nIChhbG1vc3QpIGFueXRoaW5nLlxuICpcbiAqXG4gKiBDcmVkaXRzXG4gKiA9PT09PT09XG4gKlxuICogRGFuaWVsIFRhYnVlbmNhOiBodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2QvbXNnL2FuZ3VsYXIvYW45UXB6cUlZaU0vcjh2LTNXMVg1dmNKXG4gKiBmb3IgdGhlIGlkZWEgb24gaG93IHRvIGR5bmFtaWNhbGx5IGludm9rZSB0aGUgbmctcmVwZWF0IGRpcmVjdGl2ZS5cbiAqXG4gKiBJIGJvcnJvd2VkIGEgY291cGxlIG9mIGxpbmVzIGFuZCBhIGZldyBhdHRyaWJ1dGUgbmFtZXMgZnJvbSB0aGUgQW5ndWxhclVJIEJvb3RzdHJhcCBwcm9qZWN0OlxuICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL3NyYy9wYWdpbmF0aW9uL3BhZ2luYXRpb24uanNcbiAqXG4gKiBDcmVhdGVkIGJ5IE1pY2hhZWwgb24gMDQvMDUvMTQuXG4gKi9cblxuYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdkaXJQYWdpbmF0ZScsIFsnJGNvbXBpbGUnLCAnJHBhcnNlJywgJyR0aW1lb3V0JywgJ3BhZ2luYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24oJGNvbXBpbGUsICRwYXJzZSwgJHRpbWVvdXQsIHBhZ2luYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiAge1xuICAgICAgICAgICAgcHJpb3JpdHk6IDUwMDAsIC8vSGlnaCBwcmlvcml0eSBtZWFucyBpdCB3aWxsIGV4ZWN1dGUgZmlyc3RcbiAgICAgICAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgICAgIGF0dHJzLiRzZXQoJ25nUmVwZWF0JywgYXR0cnMuZGlyUGFnaW5hdGUpOyAvL0FkZCBuZy1yZXBlYXQgdG8gdGhlIGRvbVxuXG4gICAgICAgICAgICAgICAgdmFyIGV4cHJlc3Npb24gPSBhdHRycy5kaXJQYWdpbmF0ZTtcbiAgICAgICAgICAgICAgICAvLyByZWdleCB0YWtlbiBkaXJlY3RseSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvYmxvYi9tYXN0ZXIvc3JjL25nL2RpcmVjdGl2ZS9uZ1JlcGVhdC5qcyNMMjExXG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gZXhwcmVzc2lvbi5tYXRjaCgvXlxccyooW1xcc1xcU10rPylcXHMraW5cXHMrKFtcXHNcXFNdKz8pKD86XFxzK3RyYWNrXFxzK2J5XFxzKyhbXFxzXFxTXSs/KSk/XFxzKiQvKTtcblxuICAgICAgICAgICAgICAgIHZhciBmaWx0ZXJQYXR0ZXJuID0gL1xcfFxccyppdGVtc1BlclBhZ2U6W158XSovO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFsyXS5tYXRjaChmaWx0ZXJQYXR0ZXJuKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcInBhZ2luYXRpb24gZGlyZWN0aXZlOiB0aGUgJ2l0ZW1zUGVyUGFnZScgZmlsdGVyIG11c3QgYmUgc2V0LlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgaXRlbXNQZXJQYWdlRmlsdGVyUmVtb3ZlZCA9IG1hdGNoWzJdLnJlcGxhY2UoZmlsdGVyUGF0dGVybiwgJycpO1xuICAgICAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uR2V0dGVyID0gJHBhcnNlKGl0ZW1zUGVyUGFnZUZpbHRlclJlbW92ZWQpO1xuXG4gICAgICAgICAgICAgICAgLy9Ob3cgdGhhdCB3ZSBhZGRlZCBuZy1yZXBlYXQgdG8gdGhlIGVsZW1lbnQsIHByb2NlZWQgd2l0aCBjb21waWxhdGlvblxuICAgICAgICAgICAgICAgIC8vYnV0IHNraXAgZGlyZWN0aXZlcyB3aXRoIHByaW9yaXR5IDUwMDAgb3IgYWJvdmUgdG8gYXZvaWQgaW5maW5pdGVcbiAgICAgICAgICAgICAgICAvL3JlY3Vyc2lvbiAod2UgZG9uJ3Qgd2FudCB0byBjb21waWxlIG91cnNlbHZlcyBhZ2FpbilcbiAgICAgICAgICAgICAgICB2YXIgY29tcGlsZWQgPSAgJGNvbXBpbGUoZWxlbWVudCwgbnVsbCwgNTAwMCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhZ2luYXRpb25JZDtcbiAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbklkID0gYXR0cnMucGFnaW5hdGlvbklkIHx8IFwiX19kZWZhdWx0XCI7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnJlZ2lzdGVySW5zdGFuY2UocGFnaW5hdGlvbklkKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFBhZ2VHZXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRycy5jdXJyZW50UGFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhZ2VHZXR0ZXIgPSAkcGFyc2UoYXR0cnMuY3VycmVudFBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQtcGFnZSBhdHRyaWJ1dGUgd2FzIG5vdCBzZXQsIHdlJ2xsIG1ha2Ugb3VyIG93blxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuX19jdXJyZW50UGFnZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UGFnZUdldHRlciA9ICRwYXJzZSgnX19jdXJyZW50UGFnZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb25TZXJ2aWNlLnNldEN1cnJlbnRQYWdlUGFyc2VyKHBhZ2luYXRpb25JZCwgY3VycmVudFBhZ2VHZXR0ZXIsIHNjb3BlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJzLnRvdGFsSXRlbXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRBc3luY01vZGVUcnVlKHBhZ2luYXRpb25JZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy50b3RhbEl0ZW1zKShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvblNlcnZpY2Uuc2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uR2V0dGVyKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCwgY29sbGVjdGlvbi5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vV2hlbiBsaW5raW5nIGp1c3QgZGVsZWdhdGUgdG8gdGhlIGxpbmsgZnVuY3Rpb24gcmV0dXJuZWQgYnkgdGhlIG5ldyBjb21waWxlXG4gICAgICAgICAgICAgICAgICAgIGNvbXBpbGVkKHNjb3BlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKVxuXG4gICAgLmRpcmVjdGl2ZSgnZGlyUGFnaW5hdGlvbkNvbnRyb2xzJywgWydwYWdpbmF0aW9uU2VydmljZScsIGZ1bmN0aW9uKHBhZ2luYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZSBhbiBhcnJheSBvZiBwYWdlIG51bWJlcnMgKG9yIHRoZSAnLi4uJyBzdHJpbmcpIHdoaWNoIGlzIHVzZWQgaW4gYW4gbmctcmVwZWF0IHRvIGdlbmVyYXRlIHRoZVxuICAgICAgICAgKiBsaW5rcyB1c2VkIGluIHBhZ2luYXRpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGN1cnJlbnRQYWdlXG4gICAgICAgICAqIEBwYXJhbSByb3dzUGVyUGFnZVxuICAgICAgICAgKiBAcGFyYW0gcGFnaW5hdGlvblJhbmdlXG4gICAgICAgICAqIEBwYXJhbSBjb2xsZWN0aW9uTGVuZ3RoXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUGFnZXNBcnJheShjdXJyZW50UGFnZSwgY29sbGVjdGlvbkxlbmd0aCwgcm93c1BlclBhZ2UsIHBhZ2luYXRpb25SYW5nZSkge1xuICAgICAgICAgICAgdmFyIHBhZ2VzID0gW107XG4gICAgICAgICAgICB2YXIgdG90YWxQYWdlcyA9IE1hdGguY2VpbChjb2xsZWN0aW9uTGVuZ3RoIC8gcm93c1BlclBhZ2UpO1xuICAgICAgICAgICAgdmFyIGhhbGZXYXkgPSBNYXRoLmNlaWwocGFnaW5hdGlvblJhbmdlIC8gMik7XG4gICAgICAgICAgICB2YXIgcG9zaXRpb247XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50UGFnZSA8PSBoYWxmV2F5KSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAnc3RhcnQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b3RhbFBhZ2VzIC0gaGFsZldheSA8IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAnZW5kJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSAnbWlkZGxlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVsbGlwc2VzTmVlZGVkID0gcGFnaW5hdGlvblJhbmdlIDwgdG90YWxQYWdlcztcbiAgICAgICAgICAgIHZhciBpID0gMTtcbiAgICAgICAgICAgIHdoaWxlIChpIDw9IHRvdGFsUGFnZXMgJiYgaSA8PSBwYWdpbmF0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnZU51bWJlciA9IGNhbGN1bGF0ZVBhZ2VOdW1iZXIoaSwgY3VycmVudFBhZ2UsIHBhZ2luYXRpb25SYW5nZSwgdG90YWxQYWdlcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3BlbmluZ0VsbGlwc2VzTmVlZGVkID0gKGkgPT09IDIgJiYgKHBvc2l0aW9uID09PSAnbWlkZGxlJyB8fCBwb3NpdGlvbiA9PT0gJ2VuZCcpKTtcbiAgICAgICAgICAgICAgICB2YXIgY2xvc2luZ0VsbGlwc2VzTmVlZGVkID0gKGkgPT09IHBhZ2luYXRpb25SYW5nZSAtIDEgJiYgKHBvc2l0aW9uID09PSAnbWlkZGxlJyB8fCBwb3NpdGlvbiA9PT0gJ3N0YXJ0JykpO1xuICAgICAgICAgICAgICAgIGlmIChlbGxpcHNlc05lZWRlZCAmJiAob3BlbmluZ0VsbGlwc2VzTmVlZGVkIHx8IGNsb3NpbmdFbGxpcHNlc05lZWRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZXMucHVzaCgnLi4uJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZXMucHVzaChwYWdlTnVtYmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaSArKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYWdlcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiB0aGUgcG9zaXRpb24gaW4gdGhlIHNlcXVlbmNlIG9mIHBhZ2luYXRpb24gbGlua3MgW2ldLCBmaWd1cmUgb3V0IHdoYXQgcGFnZSBudW1iZXIgY29ycmVzcG9uZHMgdG8gdGhhdCBwb3NpdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGlcbiAgICAgICAgICogQHBhcmFtIGN1cnJlbnRQYWdlXG4gICAgICAgICAqIEBwYXJhbSBwYWdpbmF0aW9uUmFuZ2VcbiAgICAgICAgICogQHBhcmFtIHRvdGFsUGFnZXNcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVQYWdlTnVtYmVyKGksIGN1cnJlbnRQYWdlLCBwYWdpbmF0aW9uUmFuZ2UsIHRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIHZhciBoYWxmV2F5ID0gTWF0aC5jZWlsKHBhZ2luYXRpb25SYW5nZS8yKTtcbiAgICAgICAgICAgIGlmIChpID09PSBwYWdpbmF0aW9uUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG90YWxQYWdlcztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwYWdpbmF0aW9uUmFuZ2UgPCB0b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvdGFsUGFnZXMgLSBoYWxmV2F5IDwgY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvdGFsUGFnZXMgLSBwYWdpbmF0aW9uUmFuZ2UgKyBpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFsZldheSA8IGN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50UGFnZSAtIGhhbGZXYXkgKyBpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogICd2aWV3cy9kaXJQYWdpbmF0aW9uLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgbWF4U2l6ZTogJz0/JyxcbiAgICAgICAgICAgICAgICBvblBhZ2VDaGFuZ2U6ICcmPydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFnaW5hdGlvbklkO1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25JZCA9IGF0dHJzLnBhZ2luYXRpb25JZCB8fCBcIl9fZGVmYXVsdFwiO1xuICAgICAgICAgICAgICAgIGlmICghc2NvcGUubWF4U2l6ZSkgeyBzY29wZS5tYXhTaXplID0gOTsgfVxuICAgICAgICAgICAgICAgIHNjb3BlLmRpcmVjdGlvbkxpbmtzID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMuZGlyZWN0aW9uTGlua3MpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5kaXJlY3Rpb25MaW5rcykgOiB0cnVlO1xuICAgICAgICAgICAgICAgIHNjb3BlLmJvdW5kYXJ5TGlua3MgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5ib3VuZGFyeUxpbmtzKSA/IHNjb3BlLiRwYXJlbnQuJGV2YWwoYXR0cnMuYm91bmRhcnlMaW5rcykgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICghcGFnaW5hdGlvblNlcnZpY2UuaXNSZWdpc3RlcmVkKHBhZ2luYXRpb25JZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkTWVzc2FnZSA9IChwYWdpbmF0aW9uSWQgIT09ICdfX2RlZmF1bHQnKSA/IFwiIChpZDogXCIgKyBwYWdpbmF0aW9uSWQgKyBcIikgXCIgOiBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJwYWdpbmF0aW9uIGRpcmVjdGl2ZTogdGhlIHBhZ2luYXRpb24gY29udHJvbHNcIiArIGlkTWVzc2FnZSArIFwiY2Fubm90IGJlIHVzZWQgd2l0aG91dCB0aGUgY29ycmVzcG9uZGluZyBwYWdpbmF0aW9uIGRpcmVjdGl2ZS5cIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcGFnaW5hdGlvblJhbmdlID0gTWF0aC5tYXgoc2NvcGUubWF4U2l6ZSwgNSk7XG4gICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBzY29wZS5wYWdpbmF0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBsYXN0OiAxLFxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50OiAxXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChwYWdpbmF0aW9uU2VydmljZS5nZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCkgKyAxKSAqIHBhZ2luYXRpb25TZXJ2aWNlLmdldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2luYXRpb25TZXJ2aWNlLmdldEN1cnJlbnRQYWdlKHBhZ2luYXRpb25JZCk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBnZW5lcmF0ZVBhZ2VzQXJyYXkoY3VycmVudFBhZ2UsIHBhZ2luYXRpb25TZXJ2aWNlLmdldENvbGxlY3Rpb25MZW5ndGgocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0SXRlbXNQZXJQYWdlKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25SYW5nZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5zZXRDdXJyZW50ID0gZnVuY3Rpb24obnVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgvXlxcZCskLy50ZXN0KG51bSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwIDwgbnVtICYmIG51bSA8PSBzY29wZS5wYWdpbmF0aW9uLmxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRDdXJyZW50UGFnZShwYWdpbmF0aW9uSWQsIG51bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBnZW5lcmF0ZVBhZ2VzQXJyYXkobnVtLCBwYWdpbmF0aW9uU2VydmljZS5nZXRDb2xsZWN0aW9uTGVuZ3RoKHBhZ2luYXRpb25JZCksIHBhZ2luYXRpb25TZXJ2aWNlLmdldEl0ZW1zUGVyUGFnZShwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uUmFuZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2luYXRpb24uY3VycmVudCA9IG51bTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgY2FsbGJhY2sgaGFzIGJlZW4gc2V0LCB0aGVuIGNhbGwgaXQgd2l0aCB0aGUgcGFnZSBudW1iZXIgYXMgYW4gYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUub25QYWdlQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm9uUGFnZUNoYW5nZSh7IG5ld1BhZ2VOdW1iZXIgOiBudW0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlUGFnaW5hdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnZXMgPSBnZW5lcmF0ZVBhZ2VzQXJyYXkoMSwgcGFnaW5hdGlvblNlcnZpY2UuZ2V0Q29sbGVjdGlvbkxlbmd0aChwYWdpbmF0aW9uSWQpLCBwYWdpbmF0aW9uU2VydmljZS5nZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkKSwgcGFnaW5hdGlvblJhbmdlKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucGFnaW5hdGlvbi5jdXJyZW50ID0gcGFyc2VJbnQocGFnaW5hdGlvblNlcnZpY2UuZ2V0Q3VycmVudFBhZ2UocGFnaW5hdGlvbklkKSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnBhZ2luYXRpb24ubGFzdCA9IHNjb3BlLnBhZ2VzW3Njb3BlLnBhZ2VzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUucGFnaW5hdGlvbi5sYXN0IDwgc2NvcGUucGFnaW5hdGlvbi5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zZXRDdXJyZW50KHNjb3BlLnBhZ2luYXRpb24ubGFzdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pXG5cbiAgICAuZmlsdGVyKCdpdGVtc1BlclBhZ2UnLCBbJ3BhZ2luYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24ocGFnaW5hdGlvblNlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZW1zUGVyUGFnZSwgcGFnaW5hdGlvbklkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIChwYWdpbmF0aW9uSWQpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25JZCA9IFwiX19kZWZhdWx0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXBhZ2luYXRpb25TZXJ2aWNlLmlzUmVnaXN0ZXJlZChwYWdpbmF0aW9uSWQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJwYWdpbmF0aW9uIGRpcmVjdGl2ZTogdGhlIGl0ZW1zUGVyUGFnZSBpZCBhcmd1bWVudCAoaWQ6IFwiICsgcGFnaW5hdGlvbklkICsgXCIpIGRvZXMgbm90IG1hdGNoIGEgcmVnaXN0ZXJlZCBwYWdpbmF0aW9uLWlkLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGVuZDtcbiAgICAgICAgICAgIHZhciBzdGFydDtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpdGVtc1BlclBhZ2UgPSBpdGVtc1BlclBhZ2UgfHwgOTk5OTk5OTk5OTtcbiAgICAgICAgICAgICAgICBpZiAocGFnaW5hdGlvblNlcnZpY2UuaXNBc3luY01vZGUocGFnaW5hdGlvbklkKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSAocGFnaW5hdGlvblNlcnZpY2UuZ2V0Q3VycmVudFBhZ2UocGFnaW5hdGlvbklkKSAtIDEpICogaXRlbXNQZXJQYWdlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbmQgPSBzdGFydCArIGl0ZW1zUGVyUGFnZTtcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uU2VydmljZS5zZXRJdGVtc1BlclBhZ2UocGFnaW5hdGlvbklkLCBpdGVtc1BlclBhZ2UpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKVxuXG4gICAgLnNlcnZpY2UoJ3BhZ2luYXRpb25TZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZXMgPSB7fTtcbiAgICAgICAgdmFyIGxhc3RSZWdpc3RlcmVkSW5zdGFuY2U7XG4gICAgICAgIHRoaXMucGFnaW5hdGlvbkRpcmVjdGl2ZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdID0ge1xuICAgICAgICAgICAgICAgICAgICBhc3luY01vZGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsYXN0UmVnaXN0ZXJlZEluc3RhbmNlID0gaW5zdGFuY2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmlzUmVnaXN0ZXJlZCA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgaW5zdGFuY2VzW2luc3RhbmNlSWRdICE9PSAndW5kZWZpbmVkJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMYXN0SW5zdGFuY2VJZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGxhc3RSZWdpc3RlcmVkSW5zdGFuY2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50UGFnZVBhcnNlciA9IGZ1bmN0aW9uKGluc3RhbmNlSWQsIHZhbCwgc2NvcGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jdXJyZW50UGFnZVBhcnNlciA9IHZhbDtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb250ZXh0ID0gc2NvcGU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jdXJyZW50UGFnZVBhcnNlci5hc3NpZ24oaW5zdGFuY2VzW2luc3RhbmNlSWRdLmNvbnRleHQsIHZhbCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLmN1cnJlbnRQYWdlUGFyc2VyKGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb250ZXh0KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldEl0ZW1zUGVyUGFnZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQsIHZhbCkge1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLml0ZW1zUGVyUGFnZSA9IHZhbDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRJdGVtc1BlclBhZ2UgPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLml0ZW1zUGVyUGFnZTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNldENvbGxlY3Rpb25MZW5ndGggPSBmdW5jdGlvbihpbnN0YW5jZUlkLCB2YWwpIHtcbiAgICAgICAgICAgIGluc3RhbmNlc1tpbnN0YW5jZUlkXS5jb2xsZWN0aW9uTGVuZ3RoID0gdmFsO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldENvbGxlY3Rpb25MZW5ndGggPSBmdW5jdGlvbihpbnN0YW5jZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VzW2luc3RhbmNlSWRdLmNvbGxlY3Rpb25MZW5ndGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zZXRBc3luY01vZGVUcnVlID0gZnVuY3Rpb24oaW5zdGFuY2VJZCkge1xuICAgICAgICAgICAgaW5zdGFuY2VzW2luc3RhbmNlSWRdLmFzeW5jTW9kZSA9IHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc0FzeW5jTW9kZSA9IGZ1bmN0aW9uKGluc3RhbmNlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZXNbaW5zdGFuY2VJZF0uYXN5bmNNb2RlO1xuICAgICAgICB9O1xuICAgIH0pXG47XG4iLCJhbmd1bGFyLm1vZHVsZSgnU2lnbmFsUicsIFtdKVxuICAgIC5jb25zdGFudCgnJCcsICQpXG4gICAgLmZhY3RvcnkoJ0h1YicsIFsnJCcsICckcScsXG4gICAgICAgIGZ1bmN0aW9uKCQsICRxKSB7XG4gICAgICAgICAgICAvL1RoaXMgd2lsbCBhbGxvdyBzYW1lIGNvbm5lY3Rpb24gdG8gYmUgdXNlZCBmb3IgYWxsIEh1YnNcbiAgICAgICAgICAgIC8vSXQgYWxzbyBrZWVwcyBjb25uZWN0aW9uIGFzIHNpbmdsZXRvbi5cbiAgICAgICAgICAgIHZhciBnbG9iYWxDb25uZWN0aW9uID0gbnVsbDtcblxuICAgICAgICAgICAgdmFyIGluaXRHbG9iYWxDb25uZWN0aW9uID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucm9vdFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsQ29ubmVjdGlvbiA9ICQuaHViQ29ubmVjdGlvbihvcHRpb25zLnJvb3RQYXRoLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyRGVmYXVsdFBhdGg6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbENvbm5lY3Rpb24gPSAkLmh1YkNvbm5lY3Rpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oaHViTmFtZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHZhciBIdWIgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxDb25uZWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXRHbG9iYWxDb25uZWN0aW9uKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbiA9IGdsb2JhbENvbm5lY3Rpb247XG4gICAgICAgICAgICAgICAgSHViLnByb3h5ID0gSHViLmNvbm5lY3Rpb24uY3JlYXRlSHViUHJveHkoaHViTmFtZSk7XG5cbiAgICAgICAgICAgICAgICBIdWIub24gPSBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLnByb3h5Lm9uKGV2ZW50LCBmbik7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBIdWIuaW52b2tlID0gZnVuY3Rpb24obWV0aG9kLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBIdWIucHJveHkuaW52b2tlLmFwcGx5KEh1Yi5wcm94eSwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgSHViLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24uc3RvcCgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgSHViLmNvbm5lY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24uc3RhcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0OiAnbG9uZ1BvbGxpbmcnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucy5saXN0ZW5lcnMsIGZ1bmN0aW9uKGZuLCBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSHViLm9uKGV2ZW50LCBmbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm1ldGhvZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMubWV0aG9kcywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBIdWJbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gJC5tYWtlQXJyYXkoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQobWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSHViLmludm9rZS5hcHBseShIdWIsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucXVlcnlQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgSHViLmNvbm5lY3Rpb24ucXMgPSBvcHRpb25zLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL0FkZGluZyBhZGRpdGlvbmFsIHByb3BlcnR5IG9mIHByb21pc2UgYWxsb3dzIHRvIGFjY2VzcyBpdCBpbiByZXN0IG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICAgICAgICAgICAgICAvLyAgIEh1Yi5wcm9taXNlID0gSHViLmNvbm5lY3Rpb24uc3RhcnQoKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIEh1Yi5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLnN0YXJ0KCkuZG9uZShmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiLCByZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBjb25uZWN0JywgSHViLmNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEh1Yi5jb25uZWN0aW9uLnN0YXJ0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVqZWN0KHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBIdWIuY29ubmVjdGlvbi5kaXNjb25uZWN0ZWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2Nvbm5lY3RlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSHViLmNvbm5lY3Rpb24uc3RhcnQoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBkb25lLCBidXQgbm90IGZhaWxlZFwiLCBIdWIuY29ubmVjdGlvbilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIEh1YjtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICBdKTtcbiIsIiAgICBjbGFzcyBQcm9zcGVjdCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5Jc3N1ZXMgPSBbXG4gICAgICAgICAgICAgICAgZm9yICh4IG9mIG9iai5Jc3N1ZXMpIG5ldyBJc3N1ZSh4IHx8IHt9KVxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgdGhpcy5BY3Rpdml0aWVzID0gb2JqLkFjdGl2aXRpZXMubWFwKEMgPT4gbmV3IEFjdGl2aXR5KEMgfHwge30pKVxuICAgICAgICAgICAgdGhpcy5Db250YWN0cyA9IG9iai5Db250YWN0cy5tYXAoQyA9PiBuZXcgQ29udGFjdChDIHx8IHt9KSlcbiAgICAgICAgICAgIHRoaXMuQ3VzdG9tZXIgPSBuZXcgQ3VzdG9tZXIob2JqLkN1c3RvbWVyIHx8IHt9KTtcbiAgICAgICAgICAgIHRoaXMuSXNzdWVDb3VudCA9IG9iai5Jc3N1ZXMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5BY3Rpdml0eUNvdW50ID0gb2JqLkFjdGl2aXRpZXMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5Db250YWN0Q291bnQgPSBvYmouQ29udGFjdHMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5DdXN0b21lclR5cGUgPSBcIkFcIlxuICAgICAgICAgICAgLy8gdGhpcy5Qcm9zcGVjdFR5cGUgPSBcIlBcIlxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQ29udGFjdCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICAgICAgdGhpcy5BZGRyMSA9IHRoaXMuQWRkcjEgfHwgJydcbiAgICAgICAgICAgIHRoaXMuQWRkcjIgPSB0aGlzLkFkZHIyIHx8ICcnXG4gICAgICAgICAgICB0aGlzLkNpdHkgPSB0aGlzLkNpdHkgfHwgJydcbiAgICAgICAgICAgIHRoaXMuQ29udGFjdElEID0gdGhpcy5Db250YWN0SUQgfHwgJydcbiAgICAgICAgICAgIHRoaXMuRW1haWwgPSB0aGlzLkVtYWlsIHx8ICcnXG4gICAgICAgICAgICB0aGlzLkZheCA9IHRoaXMuRmF4IHx8ICcnXG4gICAgICAgICAgICB0aGlzLk1vYmlsZSA9IHRoaXMuTW9iaWxlIHx8ICcnXG4gICAgICAgICAgICB0aGlzLk5hbWUgPSB0aGlzLk5hbWUgfHwgJydcbiAgICAgICAgICAgIHRoaXMuUGhvbmUgPSB0aGlzLlBob25lIHx8ICcnXG4gICAgICAgICAgICB0aGlzLlN0YXRlID0gdGhpcy5TdGF0ZSB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5aaXAgPSB0aGlzLlppcCB8fCAnJ1xuICAgICAgICAgICAgdGhpcy5UeXBlcyA9IHRoaXMuVHlwZXMgfHwgW107XG4gICAgICAgICAgICAvLyBmaW5cbiAgICAgICAgICAgIHRoaXMuSHVtYW5UeXBlc18gPSBfLnBsdWNrKG9iai5UeXBlcywgJ1R5cGUnKVxuICAgICAgICAgICAgdGhpcy5PbGRUeXBlcyA9IFtdXG4gICAgICAgIH1cbiAgICAgICAgc2V0IEh1bWFuVHlwZXModmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuT2xkVHlwZXMgPSB0aGlzLkh1bWFuVHlwZXNfO1xuICAgICAgICAgICAgdGhpcy5IdW1hblR5cGVzXyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGdldCBIdW1hblR5cGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuSHVtYW5UeXBlc19cbiAgICAgICAgfVxuICAgICAgICBnZXQgb2xkX3ZzX25ldygpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ29sZCc6IHRoaXMuT2xkVHlwZXMsXG4gICAgICAgICAgICAgICAgJ25ldyc6IHRoaXMuSHVtYW5UeXBlc19cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIElzc3VlIHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLmlzc3VlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBvYmouQ3JlYXRpb25EYXRlVGltZTtcbiAgICAgICAgICAgIHRoaXMuZW5kID0gb2JqLkNvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICAgICAgdGhpcy5zdGFydEh1bWFuID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJMTFwiKVxuICAgICAgICAgICAgdGhpcy5lbmRIdW1hbiA9IG1vbWVudChvYmouQ29tcGxldGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJsbFwiKVxuICAgICAgICAgICAgdGhpcy5jb250ZW50ID0gb2JqLkRlc2NyaXB0aW9uLnN1YnN0cmluZygwLCA1KTtcbiAgICAgICAgICAgIHRoaXMudHlwZU9mID0gXCJDbG9zZWQgSXNzdWVzXCJcbiAgICAgICAgICAgIGlmICh0aGlzLmVuZCA9PSBcIjE5MDAtMDEtMDFUMDA6MDA6MDBcIikge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmVuZFxuICAgICAgICAgICAgICAgIHRoaXMuZW5kSHVtYW4gPSBcIlN0aWxsIG9wZW5lZFwiXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBcIm9wZW5Jc3N1ZVwiXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlT2YgPSBcIk9wZW4gSXNzdWVzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMueWVhciA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKSk7XG4gICAgICAgICAgICB0aGlzLm1vbnRoID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJNTVwiKSk7XG4gICAgICAgICAgICB0aGlzLmRheSA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiREREXCIpKTtcbiAgICAgICAgICAgIHRoaXMubW9udGhfeWVhciA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikgKyBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIilcbiAgICAgICAgICAgIHRoaXMueWVhcl9kYXkgPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkRERFwiKSArIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKVxuICAgICAgICAgICAgdGhpcy5yZXBseUNvdW50ID0gb2JqLkZvbGxvd3Vwcy5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLkZvbGxvd3VwcyA9IFtcbiAgICAgICAgICAgICAgICBmb3IgKHggb2Ygb2JqLkZvbGxvd3VwcykgbmV3IEZvbGxvd3Vwcyh4IHx8IHt9KVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xhc3MgQWN0aXZpdHkge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuaXNzdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRIdW1hbiA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTExcIilcbiAgICAgICAgICAgIHRoaXMuc3RhcnQgPSBvYmouQ3JlYXRpb25EYXRlVGltZTtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSBBY3Rpdml0aWVzLkNyZWF0aW9uRGF0ZVRpbWU7XG4gICAgICAgICAgICAvLyB0aGlzLmNvbnRlbnQgPSBvYmouTm90ZS5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQgPSBcIjEgbm90ZVwiXG4gICAgICAgICAgICAvLyBkZWxldGUgYWN0aXZpdGllcy5Ob3RlO1xuICAgICAgICAgICAgdGhpcy50eXBlT2YgPSBcIkFsbCBBY3Rpdml0aWVzXCI7XG4gICAgICAgICAgICB0aGlzLnllYXIgPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIikpO1xuICAgICAgICAgICAgdGhpcy5tb250aCA9IHBhcnNlSW50KG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikpO1xuICAgICAgICAgICAgdGhpcy5kYXkgPSBwYXJzZUludChtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkRERFwiKSk7XG4gICAgICAgICAgICB0aGlzLnNtYWxsRGF5ID0gcGFyc2VJbnQobW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERFwiKSk7XG4gICAgICAgICAgICB0aGlzLm1vbnRoX3llYXIgPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIk1NXCIpICsgbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpO1xuICAgICAgICAgICAgdGhpcy55ZWFyX2RheSA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiREREXCIpICsgbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJZWVlZXCIpO1xuICAgICAgICAgICAgdGhpcy5UeXBlX0h1bWFuID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzcHJlYWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMyAtIDEpKSArIDE7XG4gICAgICAgICAgICAgICAgaWYgKHNwcmVhZCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlBob25lXCJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJWaXNpdFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgdGhpcy50aW1lYmV0d2VlbiA9IFwiMiB3ZWVrc1wiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGFzcyBGb2xsb3d1cHMge1xuICAgICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIHRoaXMuaXNzdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRIdW1hbiA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwibGxcIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIEFkZEV2ZW50IHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqLCBpbmZvKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLkRhdGUgPSBtb21lbnQodGhpcy5EYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpO1xuICAgICAgICAgICAgLy8gdGhpcy5Qcm9zcGVjdElEID0gJzInXG4gICAgICAgICAgICAvLyB0aGlzLkNhbXBhaWduSUQgPSBpbmZvLkNhbXBhaWduSUQ7XG4gICAgICAgICAgICAvLyB0aGlzLkNyZWF0aW9uVXNlciA9IGluZm8uQ3JlYXRpb25Vc2VyO1xuICAgICAgICAgICAgLy8gdGhpcy5Qcm9kdWN0SUQgPSBpbmZvLlByb2R1Y3RJRDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsYXNzIEFkZElzc3VlIHtcbiAgICAgICAgY29uc3RydWN0b3Iob2JqLCBpbmZvKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgICAgICB0aGlzLkNvbXBsZXRpb25EYXRlVGltZSA9ICcxOTAwLTAxLTAxJ1xuICAgICAgICAgICAgdGhpcy5TdGF0dXMgPSAwO1xuICAgICAgICAgICAgdGhpcy5Qcm9kdWN0SUQgPSAxO1xuICAgICAgICB9XG4gICAgfVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcigncHJvc3BlY3RDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIHByb3NwZWN0RmFjdG9yeSwgJGxvY2F0aW9uLCBMb2dpblNlcnZpY2UsICRtb2RhbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkhlbGxvIHByb3NwZWN0XCIpXG4gICAgICAgICRzY29wZS5kZXRhaWxzID0ge1xuICAgICAgICAgICAgdXNlcjogTG9naW5TZXJ2aWNlLnVzZXJcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuY29udGFjdENvbGxhcHNlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmlzc3VlQ29sbGFwc2UgPSB0cnVlO1xuXG4gICAgICAgICRzY29wZS5BZGRFdmVudCA9IHt9O1xuICAgICAgICAkc2NvcGUuQWRkQ29udGFjdCA9IHt9O1xuICAgICAgICAkc2NvcGUuQ29udGFjdEtleXMgPSBbXVxuXG4gICAgICAgICRzY29wZS50aGVfUHJvc3BlY3Q7XG4gICAgICAgIC8vICRzY29wZS5Db250YWN0cyA9IFtdO1xuICAgICAgICBjb25zb2xlLmxvZygkc3RhdGUucGFyYW1zKVxuICAgICAgICAkc2NvcGUuY29udGFjdFR5cGUgPSBbe1xuICAgICAgICAgICAgdmFsdWU6ICcxJyxcbiAgICAgICAgICAgIGxhYmVsOiAnT3duZXInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnMicsXG4gICAgICAgICAgICBsYWJlbDogJ0luIENoYXJnZSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICczJyxcbiAgICAgICAgICAgIGxhYmVsOiAnR2FtYmxlcidcbiAgICAgICAgfV07XG4gICAgICAgICRzY29wZS5zZWxlY3RlZENvbnRhY3RUeXBlID0gW107XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuZ2V0UHJvc3BlY3RfYnlfSUQoJHN0YXRlLnBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgcHJvc3BlY3RcIiwgZGF0YSlcbiAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0ID0gbmV3IFByb3NwZWN0KGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGhlX1Byb3NwZWN0KVxuICAgICAgICAgICAgICAgIHRpbWVCZXR3ZWVuKCk7XG4gICAgICAgICAgICAgICAgbWFrZVRpbWVsaW5lKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRDb250YWN0ID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0c1swXVxuICAgICAgICAgICAgICAgICRzY29wZS5kZXRhaWxzLkNhbXBhaWduSUQgPSAwO1xuICAgICAgICAgICAgICAgICRzY29wZS5kZXRhaWxzLkNyZWF0aW9uVXNlciA9IFwibWVcIjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGV0YWlscy5Qcm9kdWN0SUQgPSAwO1xuICAgICAgICAgICAgICAgIC8vIGNhc3QgdG8gbmV3IENvbnRhY3Qgc28gb24gc2F2ZSBpdCBoYXMgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICRzY29wZS5BZGRDb250YWN0ID0gbmV3IENvbnRhY3Qoe30pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuQWRkQ29udGFjdC5IdW1hblR5cGVzXztcbiAgICAgICAgICAgICAgICBkZWxldGUgJHNjb3BlLkFkZENvbnRhY3QuT2xkVHlwZXM7XG4gICAgICAgICAgICAgICAgJHNjb3BlLkNvbnRhY3RLZXlzID0gT2JqZWN0LmtleXMoJHNjb3BlLkFkZENvbnRhY3QpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2hlbiBsb2FkaW5nIG1vZGFsLCBjbGVhciB0aGUgbW9kZWwuIEVsc2Ugc2V0IFwiZWRpdFwiIHRvIGZhbHNlXG4gICAgICAgICRzY29wZS5jbGVhck1vZGVsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuQWRkQ29udGFjdCA9IG5ldyBDb250YWN0KHt9KTtcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuQWRkQ29udGFjdC5IdW1hblR5cGVzXztcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuQWRkQ29udGFjdC5PbGRUeXBlcztcbiAgICAgICAgICAgICRzY29wZS5lZGl0Q29udGFjdEJvb2wgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5lZGl0Q29udGFjdEJvb2wgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLm1vZGFsU2F2ZUNvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0LCBtb2RhbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJIZXJwIGRlcnBcIiwgY29udGFjdClcbiAgICAgICAgICAgIGlmICghY29udGFjdC5UeXBlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk11c3Qgc2VsZWN0IGEgdHlwZVwiKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHdlJ3JlIGVkaXRpbmcgYW5kIG5vdCBzYXZpbmdcbiAgICAgICAgICAgIGlmICgkc2NvcGUuZWRpdENvbnRhY3RCb29sKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEbyBzb21lIGVkaXQgaHR0cFwiKVxuICAgICAgICAgICAgICAgIHByb3NwZWN0RmFjdG9yeS5FZGl0Q29udGFjdChjb250YWN0KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtb2RhbC4kaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuQWRkQ29udGFjdChjb250YWN0KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0cy5wdXNoKG5ldyBDb250YWN0KGNvbnRhY3QpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5lZGl0Q29udGFjdCA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZWRpdFwiLCBjb250YWN0KVxuICAgICAgICAgICAgJHNjb3BlLkFkZENvbnRhY3QgPSBjb250YWN0O1xuICAgICAgICAgICAgJHNjb3BlLmVkaXRDb250YWN0Qm9vbCA9IHRydWU7XG4gICAgICAgICAgICAvLyBwcm9zcGVjdEZhY3RvcnkuRWRpdENvbnRhY3QoY29udGFjdClcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5lZGl0RXZlbnQgPSBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVycFwiLCBldnQpXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tb2RhbFNhdmVBY3Rpdml0eSA9IGZ1bmN0aW9uKGV2dCwgbW9kYWwpIHtcbiAgICAgICAgICAgIHZhciBhY3Rpdml0eSA9IG5ldyBBZGRFdmVudChldnQsICRzY29wZS5kZXRhaWxzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTXkgYWN0aXZpdHkgXCIsIGFjdGl2aXR5KVxuICAgICAgICAgICAgcHJvc3BlY3RGYWN0b3J5LkFkZEV2ZW50KGFjdGl2aXR5KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLiRoaWRlKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnVuc2hpZnQobmV3IEFjdGl2aXR5KGV2dCkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1vZGFsU2F2ZUlzc3VlID0gZnVuY3Rpb24oaXNzdWUsIG1vZGFsKSB7XG4gICAgICAgICAgICB2YXIgaXNzdWUgPSBuZXcgQWRkSXNzdWUoaXNzdWUpXG4gICAgICAgICAgICBwcm9zcGVjdEZhY3RvcnkuQWRkSXNzdWUoaXNzdWUpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuJGhpZGUoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGhlX1Byb3NwZWN0Lklzc3Vlcy5wdXNoKG5ldyBJc3N1ZShpc3N1ZSkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1ha2VBY3RpdmUgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1ha2UgYWN0aXZlXCIsIGNvbnRhY3QpXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2Nyb2xsdG9IcmVmID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkKVxuICAgICAgICAgICAgaWYgKGlkID09ICdEZXRhaWxzJykge1xuICAgICAgICAgICAgICAgIC8vICRsb2NhdGlvbi5oYXNoKGlkKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgLTUwMDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIGxvY2F0aW9uLmhhc2ggdG8gdGhlIGlkIG9mXG4gICAgICAgICAgICAgICAgLy8gdGhlIGVsZW1lbnQgeW91IHdpc2ggdG8gc2Nyb2xsIHRvLlxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5oYXNoKGlkKTtcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2Nyb2xsQnkoMCwtMTAwKTtcbiAgICAgICAgICAgICAgICAvLyBjYWxsICRhbmNob3JTY3JvbGwoKVxuICAgICAgICAgICAgICAgIC8vICRhbmNob3JTY3JvbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSAxO1xuICAgICAgICB2YXIgem9vbWNvdW50ID0gM1xuXG4gICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdFxuXG4gICAgICAgICRzY29wZS5jbGlja1RhYiA9IDE7XG5cbiAgICAgICAgJHNjb3BlLm9uQ2xpY2tUYWIgPSBmdW5jdGlvbihib29sKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhib29sKVxuICAgICAgICAgICAgJHNjb3BlLmNsaWNrVGFiID0gYm9vbDtcbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuaXNBY3RpdmVUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGFjdCA9PSAkc2NvcGUuY3VycmVudENvbnRhY3Q7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vZm9yIHRoZSBwcm9zcGVjdCBkZXRhaWxzIGxpc3RcbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAvL3Nob3cgZGV0YWlscyBpcyB3aGVuIHRoZXkgY2xpY2sgYSB0aW1lbGluZSBldmVudFxuICAgICAgICAkc2NvcGUuc2hvd0RldGFpbHMgPSBmYWxzZTtcblxuICAgICAgICAkc2NvcGUuc2F2ZUNvbnRhY3QgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmluZyBjb250YWN0Li4uXCIsIGNvbnRhY3QpXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIGZpbHRlcnNcbiAgICAgICAgJHNjb3BlLmZpbHRlcnMgPSBbJ0FsbCBBY3Rpdml0aWVzJywgJ09ubHkgTXkgQWN0aXZpdGllcycsICdDbG9zZWQgSXNzdWVzJywgJ09wZW4gSXNzdWVzJywgJ1RyaW5ldCcsICdQcm9maXRHdWFyZCddO1xuICAgICAgICAvLyBzZWxlY3RlZCBmaWx0ZXJzXG4gICAgICAgICRzY29wZS5zZWxlY3Rpb24gPSBbJ0FsbCBBY3Rpdml0aWVzJywgJ0Nsb3NlZCBJc3N1ZXMnLCAnT3BlbiBJc3N1ZXMnLCAnVHJpbmV0JywgJ1Byb2ZpdEd1YXJkJ107XG4gICAgICAgIC8vIHRvZ2dsZSBzZWxlY3Rpb24gZm9yIGEgZ2l2ZW4gZmlsdGVyIGJ5IG5hbWVcbiAgICAgICAgJHNjb3BlLnRvZ2dsZVNlbGVjdGlvbiA9IGZ1bmN0aW9uIHRvZ2dsZVNlbGVjdGlvbihmaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gJHNjb3BlLnNlbGVjdGlvbi5pbmRleE9mKGZpbHRlck5hbWUpO1xuICAgICAgICAgICAgLy8gaXMgY3VycmVudGx5IHNlbGVjdGVkXG4gICAgICAgICAgICBpZiAoaWR4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0aW9uLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZUZpbHRlcihmaWx0ZXJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlzIG5ld2x5IHNlbGVjdGVkXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhZGRGaWx0ZXIoZmlsdGVyTmFtZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGlvbi5wdXNoKGZpbHRlck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGFubm90YXRlICdub3Rlcycgd2l0aCB0aW1lIGRpZmYsIGllLiAndHdvIGRheXMgc2luY2UgbGFzdCdcbiAgICAgICAgZnVuY3Rpb24gdGltZUJldHdlZW4oKSB7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXNcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpXS55ZWFyKVxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpXS5tb250aClcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaV0uc21hbGxEYXkpXG4gICAgICAgICAgICAgICAgICAgIHZhciBhID0gbW9tZW50KGFycik7XG4gICAgICAgICAgICAgICAgICAgIGFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpICsgMV0ueWVhcilcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlbaSArIDFdLm1vbnRoKVxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChhcnJheVtpICsgMV0uc21hbGxEYXkpXG4gICAgICAgICAgICAgICAgICAgIHZhciBiID0gbW9tZW50KGFycik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaWZmID0gYS5kaWZmKGIsICdkYXlzJylcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzW2kgKyAxXS50aW1lYmV0d2VlbiA9IGRpZmYgKyBcIiBkYXlzLi4uXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZmYgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzW2kgKyAxXS50aW1lYmV0d2VlbiA9IFwiU2FtZSBkYXlcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllc1swXS50aW1lYmV0d2VlbiA9IFwiXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRG9uZVwiLCAkc2NvcGUudGhlX1Byb3NwZWN0LkFjdGl2aXRpZXNbMF0udGltZWJldHdlZW4pXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWxldGVGaWx0ZXIoZmlsdGVyTmFtZSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1zR2V0ID0gaXRlbXMuZ2V0KCk7XG4gICAgICAgICAgICB2YXIgcmVtb3ZlID0gXy5maWx0ZXIoaXRlbXNHZXQsIGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudW0udHlwZU9mID09IGZpbHRlck5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaXRlbXMucmVtb3ZlKHJlbW92ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZEZpbHRlcihmaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXNHZXQgPSBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXM7XG4gICAgICAgICAgICB2YXIgYWRkcyA9IF8uZmlsdGVyKGl0ZW1zR2V0LCBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtLnR5cGVPZiA9PSBmaWx0ZXJOYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGl0ZW1zLmFkZChhZGRzKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRpbWVsaW5lO1xuICAgICAgICB2YXIgaXRlbXM7XG4gICAgICAgIHZhciBBY3Rpdml0aWVzX2FuZF9Jc3N1ZXM7XG5cbiAgICAgICAgZnVuY3Rpb24gbWFrZVRpbWVsaW5lKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNYWtpbmcgdGltZWxpbmUuLi50aGlzIGNvbmNhdHMgYWxsIGV2ZW50cyBvbiB0aGUgc2FtZSBkYXlcIilcblxuICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5Jc3N1ZXMuY29uY2F0KCRzY29wZS50aGVfUHJvc3BlY3QuQWN0aXZpdGllcylcblxuICAgICAgICAgICAgZnVuY3Rpb24gY29tcGFyZU51bWJlcnMoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmRheSAtIGIuZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzLnNvcnQoY29tcGFyZU51bWJlcnMpXG5cbiAgICAgICAgICAgIHZhciBkdXBlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHJhbmdlcyA9IF8ucGx1Y2soQWN0aXZpdGllc19hbmRfSXNzdWVzLCAneWVhcl9kYXknKTtcbiAgICAgICAgICAgIHZhciByYW5nZXMgPSBfLnVuaXEocmFuZ2VzKVxuICAgICAgICAgICAgdmFyIG1vdGhlcnNoaXAgPSBbXVxuICAgICAgICAgICAgcmFuZ2VzLmZvckVhY2goZnVuY3Rpb24ocmFuZ2UsIGl0KSB7XG4gICAgICAgICAgICAgICAgdmFyIGdyb3VwcyA9IF8ud2hlcmUoQWN0aXZpdGllc19hbmRfSXNzdWVzLCB7XG4gICAgICAgICAgICAgICAgICAgICd5ZWFyX2RheSc6IHJhbmdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gcHVsbCBvdXQgaXNzdWVzXG4gICAgICAgICAgICAgICAgdmFyIGlzc3VlcyA9IFtdXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZ3JvdXBzLmZvckVhY2goZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS5pc3N1ZSAmJiBncm91cHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZ3JvdXBzLmluZGV4T2YodHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXMgPSBncm91cHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdGhlcnNoaXAucHVzaChpc3N1ZXMpXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vdGhlcnNoaXAucHVzaChncm91cHMpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzID0gW107XG4gICAgICAgICAgICBtb3RoZXJzaGlwLmZvckVhY2goZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyclswXS5pc3N1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklzc3VlIGluIG1vdGhlcnNoaXBcIilcbiAgICAgICAgICAgICAgICAgICAgYXJyWzBdLmNvbnRlbnQgPSBcIklzc3VlXCJcbiAgICAgICAgICAgICAgICAgICAgQWN0aXZpdGllc19hbmRfSXNzdWVzLnB1c2goYXJyWzBdKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyclswXS5jb250ZW50ID0gYXJyLmxlbmd0aCArIFwiIE5vdGVzXCJcbiAgICAgICAgICAgICAgICAgICAgYXJyWzBdLndhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBhcnJbMF0uc3Vibm90ZXMgPSBhcnI7XG4gICAgICAgICAgICAgICAgICAgIEFjdGl2aXRpZXNfYW5kX0lzc3Vlcy5wdXNoKGFyclswXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpdGVtcyA9IG5ldyB2aXMuRGF0YVNldChBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMpO1xuXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICAvLyBoZWlnaHQ6ICcyMDBweCcsXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vICAgbWluOiBuZXcgRGF0ZSgyMDE0LCBtb21lbnQoKS5zdWJ0cmFjdCgnbW9udGgnLCAyKS5mb3JtYXQoXCJNXCIpLCAxKSwgLy9mdXJ0aGVzdCBiYWNrIHlvdSBjYW4gZ29cbiAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoMjAxNCwgbW9tZW50KCkuc3VidHJhY3QoJ21vbnRoJywgMikuZm9ybWF0KFwiTVwiKSwgMSksXG4gICAgICAgICAgICAgICAgbWF4OiBuZXcgRGF0ZSgyMDE0LCA3LCAxKVxuICAgICAgICAgICAgICAgIC8vICAgem9vbU1pbjogMTAwMCAqIDYwICogNjAgKiAyNCAgICAgICAgICAgIC8vIG9uZSBkYXkgaW4gbWlsbGlzZWNvbmRzLCBmdXJ0aGVzdCBcImluXCJcbiAgICAgICAgICAgICAgICAvLyB6b29tTWF4OiAxMDAwICogNjAgKiA2MCAqIDI0ICogMzEgKiAzICAgLy8gYWJvdXQgdGhyZWUgbW9udGhzIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRpbWVsaW5lID0gbmV3IHZpcy5UaW1lbGluZShjb250YWluZXIsIGl0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdyYW5nZWNoYW5nZWQnLCBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gdmFyIHN0YXJ0ID0gbmV3IERhdGUodGltZS5zdGFydClcbiAgICAgICAgICAgICAgICAvLyBzdGFydCA9IHN0YXJ0LnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsMTUpXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVuZCA9IG5ldyBEYXRlKHRpbWUuZW5kKVxuICAgICAgICAgICAgICAgIC8vIGVuZCA9IGVuZC50b1N0cmluZygpLnN1YnN0cmluZygwLDE1KVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0YXJ0LCBlbmQpXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coIG1vbWVudChlbmQpLmlzQWZ0ZXIoc3RhcnQpICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBcIlNlbGVjdCBhbiBldmVudFwiO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ0V2ZW50KGV2ZW50LCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtc1sgcHJvcGVydGllcy5pdGVtc1swXSBdKVxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBpdGVtcy5fZGF0YVtwcm9wZXJ0aWVzLml0ZW1zWzBdXVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNvbnRlbnQuY29udGVudClcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gY29udGVudC5Ob3RlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29udGVudClcbiAgICAgICAgICAgIGlmIChjb250ZW50Lndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNwZWNpYWwgbWVzc2FnZSAtPiBnb3RvIG5vdGVcIilcbiAgICAgICAgICAgICAgICBnb3RvTm90ZShjb250ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGVudC5pc3N1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3BlY2lhbCBpc3N1ZSAtPiBnb3RvIGlzc3VlXCIpXG4gICAgICAgICAgICAgICAgZ290b0lzc3VlKGNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLm1zZ0luZm8gPSBjb250ZW50O1xuICAgICAgICAgICAgJHNjb3BlLnNob3dEZXRhaWxzID0gdHJ1ZTtcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnb3RvSXNzdWUobm90ZSkge1xuICAgICAgICAgICAgLy9nb3RvIG5vdGUgc2hvdWxkIHJlc2V0IHpvb20gdG8gXCJiYXNlbGluZVwiXG4gICAgICAgICAgICB6b29tY291bnQgPSAzXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgIHZhciBtb250aFN0YXJ0ID0gbW9tZW50KG5vdGUuc3RhcnQpLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KFwiRFwiKVxuICAgICAgICAgICAgdmFyIG1vbnRoRW5kID0gbW9tZW50KG5vdGUuc3RhcnQpLmVuZE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKHllYXIsIG1vbnRoLTEsIGRheSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKG5vdGUueWVhciwgbm90ZS5tb250aCAtIDEsIG1vbnRoU3RhcnQpLFxuICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhFbmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm90ZSwgbW9udGhTdGFydCwgbW9udGhFbmQpXG4gICAgICAgICAgICBub3RlLmNvbnRlbnQgPSBub3RlLkRlc2NyaXB0aW9uLnN1YnN0cmluZygwLCAyMClcbiAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gbm90ZS5EZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIHRpbWVsaW5lLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRpbWVsaW5lID0gbmV3IHZpcy5UaW1lbGluZShjb250YWluZXIsIGl0ZW1zLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgbG9nRXZlbnQoJ3NlbGVjdCcsIHByb3BlcnRpZXMpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gZ290b05vdGUobm90ZSkge1xuICAgICAgICAgICAgLy9nb3RvIG5vdGUgc2hvdWxkIHJlc2V0IHpvb20gdG8gXCJiYXNlbGluZVwiXG4gICAgICAgICAgICB6b29tY291bnQgPSAzXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgIHZhciBtb250aFN0YXJ0ID0gbW9tZW50KG5vdGUuc3RhcnQpLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KFwiRFwiKVxuICAgICAgICAgICAgdmFyIG1vbnRoRW5kID0gbW9tZW50KG5vdGUuc3RhcnQpLmVuZE9mKCdtb250aCcpLmZvcm1hdChcIkRcIilcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHpvb21hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogJzE1MHB4JyxcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKHllYXIsIG1vbnRoLTEsIGRheSksIC8vZnVydGhlc3QgYmFjayB5b3UgY2FuIGdvXG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKG5vdGUueWVhciwgbm90ZS5tb250aCAtIDEsIG1vbnRoU3RhcnQpLFxuICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUobm90ZS55ZWFyLCBub3RlLm1vbnRoIC0gMSwgbW9udGhFbmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2cobm90ZSwgbW9udGhTdGFydCwgbW9udGhFbmQpXG4gICAgICAgICAgICBub3RlLnN1Ym5vdGVzLmZvckVhY2goZnVuY3Rpb24obm90ZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub3RlcylcbiAgICAgICAgICAgICAgICBub3Rlcy5jb250ZW50ID0gbm90ZXMuTm90ZS5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgICAgICAgICAgLy8gaXRlbXMuY2xlYXIoKVxuICAgICAgICAgICAgICAgIGl0ZW1zLnJlbW92ZShub3RlLmlkKVxuICAgICAgICAgICAgICAgIGl0ZW1zLmFkZChub3RlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aW1lbGluZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aW1lbGluZSA9IG5ldyB2aXMuVGltZWxpbmUoY29udGFpbmVyLCBpdGVtcywgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aW1lbGluZS5vbignc2VsZWN0JywgZnVuY3Rpb24ocHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGxvZ0V2ZW50KCdzZWxlY3QnLCBwcm9wZXJ0aWVzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogWm9vbSB0aGUgdGltZWxpbmUgYSBnaXZlbiBwZXJjZW50YWdlIGluIG9yIG91dFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcGVyY2VudGFnZSAgIEZvciBleGFtcGxlIDAuMSAoem9vbSBvdXQpIG9yIC0wLjEgKHpvb20gaW4pXG4gICAgICAgICAqL1xuICAgICAgICAvLyAgdmFyIHpvb21jb3VudCA9IDNcbiAgICAgICAgZnVuY3Rpb24gem9vbSh6b29tX2luKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFtb3VudHNcIiwgem9vbWNvdW50LCB6b29tX2luKVxuICAgICAgICAgICAgem9vbWNvdW50ID0gem9vbWNvdW50ICsgem9vbV9pblxuICAgICAgICAgICAgdmFyIG9wdGlvbnM7XG4gICAgICAgICAgICBpZiAoem9vbWNvdW50ID09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyB6b29tY291bnQrK1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWm9vbSBpblwiLCB6b29tY291bnQpXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKDIwMTQsIDUsIDEpLCAvL2Z1cnRoZXN0IGJhY2sgeW91IGNhbiBnb1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoMjAxNCwgNSwgMSksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUoMjAxNCwgNywgMSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIC8vIHByZXZlbnRzIHpvb20gY291bnQgZnJvbSBnb2luZyBwYXN0IDRcbiAgICAgICAgICAgICAgICB6b29tY291bnQgPSAzO1xuICAgICAgICAgICAgICAgIHpvb21UaW1lbGluZSgpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHpvb21jb3VudCA9PSAyKSB7XG4gICAgICAgICAgICAgICAgLy8gem9vbWNvdW50LS1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlpvb20gb3V0ICdtb250aCB2aWV3JyBcIiwgem9vbWNvdW50KVxuICAgICAgICAgICAgICAgIGNvb2xuZXdTb3J0TWV0aG9kKCk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgem9vbWFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gICBtaW46IG5ldyBEYXRlKDIwMTIsIDcsIDEpLCAvL2Z1cnRoZXN0IGJhY2sgeW91IGNhbiBnb1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogbmV3IERhdGUoMjAxNCwgMSwgMSksXG4gICAgICAgICAgICAgICAgICAgIG1heDogbmV3IERhdGUoMjAxNCwgNywgMSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHpvb21UaW1lbGluZSgpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHpvb21jb3VudCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldpbGRjYXJkIHpvb20sIHBsYWNlaG9sZGVyLi4uVG9kb1wiLCB6b29tY291bnQpXG4gICAgICAgICAgICAgICAgem9vbVRpbWVsaW5lKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoem9vbWNvdW50ID09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY2FuY2VsIHpvb21cIiwgem9vbWNvdW50KVxuICAgICAgICAgICAgICAgIHpvb21jb3VudCsrXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHpvb21UaW1lbGluZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Zpc3VhbGl6YXRpb24nKTtcbiAgICAgICAgICAgICAgICB0aW1lbGluZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGltZWxpbmUgPSBuZXcgdmlzLlRpbWVsaW5lKGNvbnRhaW5lciwgaXRlbXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHRpbWVsaW5lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ0V2ZW50KCdzZWxlY3QnLCBwcm9wZXJ0aWVzKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXR0YWNoIGV2ZW50cyB0byB0aGUgbmF2aWdhdGlvbiBidXR0b25zXG4gICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd6b29tSW4nKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICB6b29tKDEpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnem9vbU91dCcpLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIHpvb20oLTEpO1xuICAgICAgICAvLyB9O1xuICAgICAgICAkc2NvcGUuaWNvbnMgPSBbe1xuICAgICAgICAgICAgdmFsdWU6IDEsXG4gICAgICAgICAgICBsYWJlbDogJ093bmVyJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogMixcbiAgICAgICAgICAgIGxhYmVsOiAnUGVyc29uIGluJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogMyxcbiAgICAgICAgICAgIGxhYmVsOiAnQmVzdCBGcmllbmQnXG4gICAgICAgIH1dO1xuXG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAgICAgICAgIHZhciB0YXJnID0gXy5maW5kV2hlcmUoJHNjb3BlLnRoZV9Qcm9zcGVjdC5Db250YWN0cywgY29udGFjdClcbiAgICAgICAgICAgIHZhciBkaWZmID0gdGFyZy5vbGRfdnNfbmV3O1xuICAgICAgICAgICAgLy8gbmVlZCB0byBjaGVjayB0aGUgbGVuZ3RoIHRvIHNlZSBpZiBpdCdzIGFuIGFkZCBvciBhIGRlbGV0ZVxuICAgICAgICAgICAgaWYgKGRpZmYub2xkLmxlbmd0aCA+IGRpZmYubmV3Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gXy5kaWZmZXJlbmNlKGRpZmYub2xkLCBkaWZmLm5ldyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWJ0cmFjdGVkXCIsIGNoYW5nZWQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkID0gXy5kaWZmZXJlbmNlKGRpZmYubmV3LCBkaWZmLm9sZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGRlZFwiLCBjaGFuZ2VkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBjb29sbmV3U29ydE1ldGhvZCgpIHtcbiAgICAgICAgICAgIHZhciBtb250aHMgPSAxMlxuICAgICAgICAgICAgdmFyIHllYXJzID0gWzIwMTAsIDIwMTEsIDIwMTIsIDIwMTMsIDIwMTRdXG4gICAgICAgICAgICB2YXIgcmFuZ2VzID0gXy5wbHVjayhBY3Rpdml0aWVzX2FuZF9Jc3N1ZXMsICdtb250aF95ZWFyJyk7XG4gICAgICAgICAgICB2YXIgcmFuZ2VzID0gXy51bmlxKHJhbmdlcylcbiAgICAgICAgICAgIHZhciBtb3RoZXJzaGlwID0gW11cbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKGZ1bmN0aW9uKHJhbmdlLCBpdCkge1xuICAgICAgICAgICAgICAgIHZhciBncm91cHMgPSBfLndoZXJlKEFjdGl2aXRpZXNfYW5kX0lzc3Vlcywge1xuICAgICAgICAgICAgICAgICAgICAnbW9udGhfeWVhcic6IHJhbmdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbW90aGVyc2hpcFtpdF0gPSBncm91cHM7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpdGVtcy5jbGVhcigpO1xuXG4gICAgICAgICAgICBtb3RoZXJzaGlwLmZvckVhY2goZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGFyclswXS5pZDtcbiAgICAgICAgICAgICAgICBhcnJbMF0uY29udGVudCA9IGFyci5sZW5ndGggKyBcIiBOb3Rlc1wiXG4gICAgICAgICAgICAgICAgYXJyWzBdLndhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFyclswXS5zdWJub3RlcyA9IGFycjtcbiAgICAgICAgICAgICAgICBpdGVtcy5hZGQoYXJyWzBdKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmZhY3RvcnkoJ3Byb3NwZWN0RmFjdG9yeScsXG4gICAgICAgIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICB2YXIgcHJvc3BlY3RJRDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX3JlcXVlc3Q6IGZ1bmN0aW9uKG1ldGhvZCA9ICdnZXQnLCBzdWZmaXggPSAnJywgZGF0YSA9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBgaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvcHJvc3BlY3QvJHtwcm9zcGVjdElEfS8ke3N1ZmZpeH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFByb3NwZWN0X2J5X0lEOiBmdW5jdGlvbihwcm9zcGVjdCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9zcGVjdElEID0gcHJvc3BlY3QuUHJvc3BlY3RJRFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnZ2V0Jyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBZGRFdmVudDogZnVuY3Rpb24obkV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuRXZlbnQgPSAkLnBhcmFtKG5FdmVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Bvc3QnLCBgQWN0aXZpdHlgLCBuRXZlbnQpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBZGRDb250YWN0OiBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250YWN0ID0gJC5wYXJhbShjb250YWN0KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncG9zdCcsIGBDb250YWN0YCwgY29udGFjdClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEVkaXRDb250YWN0OiBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250YWN0SUQgPSBjb250YWN0LkNvbnRhY3RJRDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhY3QgPSAkLnBhcmFtKGNvbnRhY3QpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgncHV0JywgYENvbnRhY3QvJHtjb250YWN0SUR9YCwgY29udGFjdClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFkZElzc3VlOiBmdW5jdGlvbihpc3N1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNzdWUgPSAkLnBhcmFtKGlzc3VlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ3Bvc3QnLCBgSXNzdWVgLCBpc3N1ZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcigncXVlcnlDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGxvY2F0aW9uLCBxdWVyeUZhY3RvcnksICRxLCAkYWxlcnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJxdWVyeSBDb250cm9sbGVyXCIsICRzdGF0ZVBhcmFtcylcbiAgICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUucmVzdWx0cyA9IHt9O1xuICAgICAgICAkc2NvcGUudGFibGVDb25maWcgPSB7XG4gICAgICAgICAgICBpdGVtc1BlclBhZ2U6IDEwLFxuICAgICAgICAgICAgZmlsbExhc3RQYWdlOiBmYWxzZSxcbiAgICAgICAgICAgIG1heFBhZ2VzOiA1XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLnF1ZXJ5TmFtZSA9IFwiXCI7XG4gICAgICAgICRzY29wZS5wcm9kdWN0TGlzdCA9IFtcbiAgICAgICAgICAgIFwiVHJpTmV0XCIsXG4gICAgICAgICAgICBcIlByb2ZpdEd1YXJkXCJcbiAgICAgICAgXVxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRQcm9kdWN0O1xuICAgICAgICAkc2NvcGUucXVlcnlMaXN0O1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRRdWVyeTtcbiAgICAgICAgJHNjb3BlLkNsaWNraW5nX3RoZV90YWJsZV9ub3dfcGVyZm9ybXNfaHR0cCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuUXVlcnlJRDtcbiAgICAgICAgJHNjb3BlLnBhcmFtcztcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkU3RhdGVzID0gW107XG4gICAgICAgICRzY29wZS5zdGF0ZXMgPSBbe1xuICAgICAgICAgICAgdmFsdWU6ICdLYW5zYXMnLFxuICAgICAgICAgICAgbGFiZWw6ICdLYW5zYXMnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnQUsnLFxuICAgICAgICAgICAgbGFiZWw6ICdBcmthbnNhcydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdNTycsXG4gICAgICAgICAgICBsYWJlbDogJ01pc3NvdXJpJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ1RYJyxcbiAgICAgICAgICAgIGxhYmVsOiAnVGV4YXMnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnTlknLFxuICAgICAgICAgICAgbGFiZWw6ICdOZXcgWW9yaydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdDQScsXG4gICAgICAgICAgICBsYWJlbDogJ0NhbGlmb3JuaWEnXG4gICAgICAgIH0sIF07XG4gICAgICAgICRzY29wZS5xdWVyeVBhcmFtcyA9IHtcbiAgICAgICAgICAgIFN0YXRlOiBbXVxuICAgICAgICB9XG4gICAgICAgIC8vIG5nLW1vZGVsXG4gICAgICAgICRzY29wZS5zYXZlT2JqZWN0ID0ge307XG5cbiAgICAgICAgLy8gcG9wdWxhdGUgcXVlcnkgbGlzdDtcbiAgICAgICAgcXVlcnlGYWN0b3J5LmdldFF1ZXJpZXMoKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5TGlzdCA9IGRhdGEuZGF0YVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgJHNjb3BlLmZpbmRRdWVyeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHNSZXR1cm5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFcnBcIiwgJHNjb3BlLnNlbGVjdGVkUXVlcnkpXG4gICAgICAgICAgICBxdWVyeUZhY3Rvcnkuc2luZ2xlUXVlcnkoJHNjb3BlLnNlbGVjdGVkUXVlcnkuUXVlcnlJRCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNvIHRoZSB1c2VyIHdhbnRzIHRvIHNlZS4uLlwiLCBkYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkLmRlcGFyYW0oZGF0YS5kYXRhLlBhcmFtU3RyKVxuICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRzID0gZGF0YS5kYXRhLnJvd3M7XG4gICAgICAgICAgICAgICAgJHNjb3BlLlF1ZXJ5SUQgPSBkYXRhLmRhdGEuUXVlcnlJRDtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSAkc2NvcGUucGFyYW1zLlN0YXRlO1xuICAgICAgICAgICAgICAgICRzY29wZS5DbGlja2luZ190aGVfdGFibGVfbm93X3BlcmZvcm1zX2h0dHAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS5zYXZlT2JqZWN0Lk5hbWUgPSBcIkxPQURFRCBGUk9NIERST1BET1dOIC0tIHF1ZXJ5IG5hbWUgaXMgXCIgKyBkYXRhLmRhdGEuTmFtZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vICRzY29wZS5zZWxlY3RlZFN0YXRlID0gJyc7XG5cbiAgICAgICAgJHNjb3BlLnF1ZXJ5U2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBjbGVhcmluZyBvbGQgcmVzdWx0c1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSB7fTtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzUmV0dXJuZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHNlYXJjaC4uLnBsZWFzZSB3YWl0Li4uXCIpXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHNldCBlYWNoIHZhcmlhYmxlIHdoZW4gbG9hZGVkLlxuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5UGFyYW1zLlN0YXRlID0gJHNjb3BlLnNlbGVjdGVkU3RhdGVzXG5cbiAgICAgICAgICAgIC8vIFRPRE8gZ2V0IFByb2R1Y3QgZnJvbSBzZWxlY3RcbiAgICAgICAgICAgICRzY29wZS5xdWVyeVBhcmFtcy5Qcm9kdWN0SUQgPSAxXG5cbiAgICAgICAgICAgIHZhciBzdWJtaXQgPSBxdWVyeUZhY3RvcnkucXVlcnlSZXN1bHRzKCRzY29wZS5xdWVyeVBhcmFtcyk7XG4gICAgICAgICAgICB2YXIgcHJvY2VzcyA9IHN1Ym1pdC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiR290IGl0Li4uXCIsIGRhdGEuZGF0YSlcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0cyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0c1JldHVybmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKCRzY29wZS5xdWVyeVBhcmFtcylcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09IDQwMSlcbiAgICAgICAgICAgICAgICAvLyB1bmF1dGhvcml6ZWRcbiAgICAgICAgICAgICAgICAvLyAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiNDAxIGlzIGhhbmRsZWQgYnkgSW50ZXJjZXB0b3JzXCIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLndob2EgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiV2hvYVwiKVxuICAgICAgICAgICAgcXVlcnlGYWN0b3J5LnVwZGF0ZVF1ZXJ5TmFtZSgkc2NvcGUuUXVlcnlJRCkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkNPTVBMRVRFXCIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUuRGVsZXRlUHJvc3BlY3QgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdHMuZm9yRWFjaCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhLlByb3NwZWN0SUQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYS5TdGF0dXMgPyBhLlN0YXR1cyA9IDAgOiBhLlN0YXR1cyA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUZhY3RvcnkudXBkYXRlUXVlcnlTdGF0dXMoJHNjb3BlLlF1ZXJ5SUQsIGlkLCBhLlN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5zYXZlVGVtcGxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkc2NvcGUuQ2xpY2tpbmdfdGhlX3RhYmxlX25vd19wZXJmb3Jtc19odHRwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVcGRhdGVcIilcbiAgICAgICAgICAgICAgICAkc2NvcGUud2hvYSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNhdmVPYmplY3Qucm93cyA9ICRzY29wZS5yZXN1bHRzO1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSAkbG9jYXRpb24uc2VhcmNoKCk7XG4gICAgICAgICAgICAgICAgdmFyIG1vZCA9ICQucGFyYW0ocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdC5QYXJhbVN0ciA9IG1vZDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2F2ZU9iamVjdC5Qcm9kdWN0ID0gMTtcbiAgICAgICAgICAgICAgICBxdWVyeUZhY3Rvcnkuc2F2ZVF1ZXJ5KCRzY29wZS5zYXZlT2JqZWN0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZS5jYW1wYWlnbi5uZXcnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW1wYWlnbklEOiByZXMuZGF0YS5RdWVyeUlEXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG15QWxlcnQgPSAkYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVyci5zdGF0dXMudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGVyci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdvSHJlZiA9IGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldilcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrZWQgb24gbG9hZDtcbiAgICAgICAgaWYgKCRzdGF0ZVBhcmFtcy5TdGF0ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHJlYWQgdGhlIFVSTCBhbmQgc2V0IGVhY2ggJHNjb3BlIHZhcmlhYmxlXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRTdGF0ZXMgPSBbJHN0YXRlUGFyYW1zLlN0YXRlXVxuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5U2VhcmNoKCk7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmZhY3RvcnkoJ3F1ZXJ5RmFjdG9yeScsXG4vLyBub3cgUmVzZWFyY2ggRmFjdG9yeVxuIGZ1bmN0aW9uICgkaHR0cCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHF1ZXJ5UmVzdWx0czpmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0dGluZyBxdWVyeSB3aXRoIHBhcmFtcyBcIiwgdXJsKVxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoJywge3BhcmFtczogdXJsIH0gKVxuICAgICAgICB9LFxuICAgICAgICByZW1vdmVRdWVyeTogZnVuY3Rpb24ocm93SUQpe1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoJycpXG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZVByb3NwZWN0OiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS9wcm9zcGVjdHMnLCB7cGFyYW1zOiB7J3N0YXJ0JzogJzUnLCAnZW5kJzogJzIwJ30gfSApXG4gICAgICAgIH0sXG4gICAgICAgIHNhdmVRdWVyeTogZnVuY3Rpb24ocHJvc3BlY3RzKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlNhdmUgcXVlcnkgUHJvc3BlY3RzIFwiLCBwcm9zcGVjdHMpXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoJywgJC5wYXJhbShwcm9zcGVjdHMpIClcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0UXVlcmllczogZnVuY3Rpb24oKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC9saXN0JylcbiAgICAgICAgfSxcbiAgICAgICAgc2luZ2xlUXVlcnk6IGZ1bmN0aW9uKHF1ZXJ5SUQpe1xuICAgICAgICAgIC8vIEVTNiBUZW1wbGF0ZSBTdHJpbmdzXG4gICAgICAgICAgLy8gcmV0dXJuICRodHRwLmdldChgL2FwaS9xdWVyeS8ke3F1ZXJ5SUR9YClcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgcXVlcnlJRCk7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZVF1ZXJ5TmFtZTogZnVuY3Rpb24ocXVlcnlJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnB1dCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvUmVzZWFyY2gvJyArIHF1ZXJ5SUQsICQucGFyYW0oeydOYW1lJzogJ0FuZ3VsYXInfSkgKVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVRdWVyeVN0YXR1czogZnVuY3Rpb24oUXVlcnlJRCwgUHJvc3BlY3RJRCwgc3RhdHVzKXtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9SZXNlYXJjaC8nICsgUXVlcnlJRCArICcvJyArIFByb3NwZWN0SUQsICQucGFyYW0oeydTdGF0dXMnOiBzdGF0dXN9KSApXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbi5mYWN0b3J5KCdyb2xlc0ZhY3RvcnknLFxuLy8gbm93IFJlc2VhcmNoIEZhY3RvcnlcbiBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsaXN0Um9sZXM6ZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1JvbGVzJyApXG4gICAgICAgIH0sXG4gICAgICAgIGdldFVzZXJzOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovLzEwLjEuMS4xMTg6ODAwMC9hcGkvdXNlcnMnKVxuICAgICAgICB9LFxuICAgICAgICBhZGRSb2xlOmZ1bmN0aW9uKHVzZXIsIHJvbGVJRCl7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL3VzZXJzLycrdXNlcisnL1JvbGVzLycrcm9sZUlEKVxuICAgICAgICB9XG4gICAgfTtcbiAgfVxuKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcigncm9sZXNDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIHJvbGVzRmFjdG9yeSkge1xuICBjb25zb2xlLmxvZyhcIlJvbGVzIGNvbnRyb2xsZXJcIilcblxuICAkc2NvcGUuYXZhaWxhYmxlUm9sZXM7XG4gIHJvbGVzRmFjdG9yeS5saXN0Um9sZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKFwiR290IHJvbGVzLi4uXCIsIGRhdGEuZGF0YSlcbiAgICAkc2NvcGUuYXZhaWxhYmxlUm9sZXMgPSBkYXRhLmRhdGE7XG4gIH0pO1xuXG4gICRzY29wZS5hdmFpbGFibGVVc2VycztcbiAgcm9sZXNGYWN0b3J5LmdldFVzZXJzKCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCB1c2Vyc1wiLCBkYXRhLmRhdGEpXG4gICAgJHNjb3BlLmF2YWlsYWJsZVVzZXJzID0gZGF0YS5kYXRhLlVzZXJMaXN0XG4gIH0pXG5cblxuICAkc2NvcGUuYWRkUm9sZSA9IGZ1bmN0aW9uKG5hbWUsIHJvbGVJRCl7XG4gICAgY29uc29sZS5sb2cobmFtZSwgcm9sZUlEKVxuICAgIHJvbGVzRmFjdG9yeS5hZGRSb2xlKG5hbWUsIHJvbGVJRCkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiRG9uZVwiKVxuICAgIH0pXG4gIH1cblxufSlcbiIsIlxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuY29udHJvbGxlcignc2VhcmNoQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYWxlcnQsIHNlYXJjaEZhY3RvcnksICR0aW1lb3V0LCAkbG9jYXRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJIZWxsbyBzZWFyY2hcIilcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hib3hcIikuZm9jdXMoKTtcbiAgICAgICAgJHNjb3BlLnBhcmFtc09iaiA9IHtcbiAgICAgICAgICAgIFByb3NwZWN0SUQ6ICcnXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUucHJvc3BlY3RUeXBlID0gW3tcbiAgICAgICAgICAgIHZhbHVlOiAnUCcsXG4gICAgICAgICAgICBsYWJlbDogJ1Byb3NwZWN0J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ0EnLFxuICAgICAgICAgICAgbGFiZWw6ICdBY3RpdmUnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnRicsXG4gICAgICAgICAgICBsYWJlbDogJ0Zvcm1lcidcbiAgICAgICAgfV07XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFByb3NwZWN0VHlwZSA9ICRzY29wZS5wcm9zcGVjdFR5cGUubWFwKHR5cGUgPT4gdHlwZS52YWx1ZSlcbiAgICAgICAgJHNjb3BlLmN1c3RvbWVyVHlwZSA9IFt7XG4gICAgICAgICAgICB2YWx1ZTogJ1AnLFxuICAgICAgICAgICAgbGFiZWw6ICdQcm9maXRHdWFyZCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdOJyxcbiAgICAgICAgICAgIGxhYmVsOiAnTmVnb3RpYXRvcidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdTJyxcbiAgICAgICAgICAgIGxhYmVsOiAnU2VydmljZXMgT25seSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdHJyxcbiAgICAgICAgICAgIGxhYmVsOiAnR292ZXJubWVudCdcbiAgICAgICAgfV07XG5cbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQ3VzdG9tZXJUeXBlID0gJHNjb3BlLmN1c3RvbWVyVHlwZS5tYXAodHlwZSA9PiB0eXBlLnZhbHVlKVxuXG5cbiAgICAgICAgLy8gJHNjb3BlLnNlbGVjdGVkQ3VzdG9tZXJUeXBlID0gW1xuICAgICAgICAvLyAgICAgZm9yICh7XG4gICAgICAgIC8vICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIG9mICRzY29wZS5jdXN0b21lclR5cGUpIHZhbHVlXG4gICAgICAgIC8vIF1cblxuICAgICAgICAkc2NvcGUuQkRNcyA9IFsnQkRNMDEnLCAnQkRNMDInLCAnQkRNMDMnLCAnQkRNMDQnXVxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCRE0gPSBbXG4gICAgICAgICAgICBmb3IgKHggb2YgJHNjb3BlLkJETXMpIHhcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicGFyYW1zXCIsICRzdGF0ZS5wYXJhbXMpXG5cbiAgICAgICAgdmFyIHN0YXRlUGFyYW1zID0gJHN0YXRlLnBhcmFtc1xuICAgICAgICBPYmplY3Qua2V5cyhzdGF0ZVBhcmFtcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN0YXRlUGFyYW1zW2tleV0pIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RhdGVQYXJhbXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJHb3RcIiwgc3RhdGVQYXJhbXMpXG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHN0YXRlUGFyYW1zKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUncyBwYXJhbXMsIGd1eXMhISFcIilcbiAgICAgICAgICAgIHNlYXJjaEZhY3Rvcnkuc2VhcmNoKHN0YXRlUGFyYW1zKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSlcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lbXB0eVJlc3VsdHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlYXJjaFJlc3VsdHMgPSByZXMuZGF0YS5tYXAoc2VhcmNoUmVzdWx0ID0+IG5ldyBQcm9zcGVjdChzZWFyY2hSZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAvLyByZXMuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHByb3NwZWN0KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICRzY29wZS5zZWFyY2hSZXN1bHRzLnB1c2goIG5ldyBQcm9zcGVjdChwcm9zcGVjdCkgKVxuICAgICAgICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lbXB0eVJlc3VsdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGRhdGFcIilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnNlYXJjaFJlc3VsdHMpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBzdGF0ZSBwYXJhbXMgcHJlc2VudFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIGl0ZW1zUGVyUGFnZTogMTAsXG4gICAgICAgICAgICBmaWxsTGFzdFBhZ2U6IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICAkc2NvcGUuZW1wdHlSZXN1bHRzID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5zZWFyY2hTdHJpbmcgPSAnJ1xuXG4gICAgICAgICRzY29wZS5zdGFydFNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdGFydD9cIiwgJHNjb3BlLnBhcmFtc09iailcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCRzY29wZS5wYXJhbXNPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS5wYXJhbXNPYmpba2V5XSA9ICRzY29wZS5zZWFyY2hTdHJpbmc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCgkc2NvcGUucGFyYW1zT2JqKVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnNlYXJjaE9wdGlvbnMgPSBbXG4gICAgICAgICAgICAnUHJvc3BlY3RJRCcsXG4gICAgICAgICAgICAnQ3VzdElEJyxcbiAgICAgICAgICAgICdOQ1BEUCcsXG4gICAgICAgICAgICAnTlBJJ1xuICAgICAgICBdXG4gICAgICAgIC8vIHNldHMgZGVmYXVsdCB0byAnUHJvc3BlY3RJRCdcbiAgICAgICAgJHNjb3BlLml0ZW0gPSAkc2NvcGUuc2VhcmNoT3B0aW9uc1swXVxuXG4gICAgICAgIC8vIHNldCAkc2NvcGUucGFyYW1zT2JqIGZyb20gZHJvcGRvd25cbiAgICAgICAgJHNjb3BlLnNlYXJjaFNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hib3hcIikuZm9jdXMoKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKCRzY29wZS5wYXJhbXNPYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUucGFyYW1zT2JqW2tleV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkc2NvcGUucGFyYW1zT2JqWyRzY29wZS5pdGVtXSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmdvdG9Qcm9zcGVjdCA9IGZ1bmN0aW9uKHByb3NwZWN0SUQpIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZS5wcm9zcGVjdCcsIHtcbiAgICAgICAgICAgICAgICBQcm9zcGVjdElEOiBwcm9zcGVjdElEXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLkNpdHlTdGF0ZVppcF9zdHJpbmc7XG5cbiAgICAgICAgJHNjb3BlLmZuQ2l0eVN0YXRlWmlwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL3ByaW9yaXRpemVzIHppcCwgdGhlbiBjaXR5LCBhbmQgbGFzdGx5IHN0YXRlXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXVxuICAgICAgICAgICAgJHNjb3BlLkNpdHlTdGF0ZVppcF9zdHJpbmcuc3BsaXQoJywnKS5mb3JFYWNoKCh3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCgkLnRyaW0od29yZCkpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc29sZS5sb2coYXJyYXkpXG5cblxuICAgICAgICAgICAgLy90dXJucyBcIk1PIDY0MTEwXCIgaW50byB0d28gc3RyaW5nc1xuICAgICAgICAgICAgLy8gb3IgXCJLYW5zYXMgQ2l0eSA2NDExMFwiXG4gICAgICAgICAgICB2YXIgbm9TcGFjZXMgPSBbXTtcbiAgICAgICAgICAgIGFycmF5LmZvckVhY2goKHdvcmQpID0+IHtcbiAgICAgICAgICAgICAgICBub1NwYWNlcy5wdXNoKHdvcmQuc3BsaXQoJyAnKSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB2YXIgemlwID0gXCJcIjtcbiAgICAgICAgICAgIGFycmF5LmZvckVhY2goKHBhcnQpID0+IHtcbiAgICAgICAgICAgICAgICB6aXAgPSBleHRyYWN0WmlwKHBhcnQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJaaXA/XCIsIHppcClcbiAgICAgICAgICAgIGlmICh6aXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICAnWmlwJzogemlwXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29tbWEgc2VwYXJhdGVkXCIsIGFycmF5KVxuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKHppcCk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVtb3ZlZCB6aXAgb2JqZWN0XCIsIGFycmF5KVxuXG4gICAgICAgICAgICAvLyBpZiBzdHJpbmcgaXMgPT0gdGhhbiAyIGl0J3Mgc3RhdGVcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9ICcnXG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKChzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA9PSAyKSBzdGF0ZSA9IHN0cmluZ1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdGF0ZVwiLCBzdGF0ZSlcblxuICAgICAgICAgICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZihzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlbW92ZWQgc3RhdGUgb2JqZWN0XCIsIGFycmF5KVxuXG4gICAgICAgICAgICAvLyBpZiBubyB6aXAsIHNlYXJjaCBieSBjaXR5XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmFsIGNoZWNrXCIsIGFycmF5KVxuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDAgJiYgemlwLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBbGwgd2UndmUgZ290IGxlZnQgaXMgQ2l0eVwiKVxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICAnQ2l0eSc6IGFycmF5WzBdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgbm8gemlwIG9yIGNpdHksIHNlYXJjaCBieSBzdGF0ZVxuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PSAwICYmIHppcC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICAnU3RhdGUnOiBzdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJQcm9zcGVjdFR5cGVcIjogJHNjb3BlLnNlbGVjdGVkUHJvc3BlY3RUeXBlLFxuICAgICAgICAgICAgICAgICAgICBcIkN1c3RvbWVyVHlwZVwiOiAkc2NvcGUuc2VsZWN0ZWRDdXN0b21lclR5cGVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBleHRyYWN0WmlwKHN0cikge1xuICAgICAgICAgICAgICAgIC8vdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBiZWxvdyBpcyBmb3IgNSBkaWdpdCBVUyBaSVAgY29kZSwgNSBkaWdpdCBVUyBaSVAgY29kZSArIDQsXG4gICAgICAgICAgICAgICAgLy9hbmQgNiBkaWdpdCBhbHBoYW51bWVyaWMgQ2FuYWRpYW4gUG9zdGFsIENvZGVcbiAgICAgICAgICAgICAgICB2YXIgcmUgPSAvXFxkezV9LVxcZHs0fXxcXGR7NX18W0EtWl1cXGRbQS1aXSBcXGRbQS1aXVxcZC9cbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBzdHI7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoID0gcmUuZXhlYyhpbnB1dClcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG4iLCIvLyBhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLy8gLmZhY3RvcnkoJ3NlYXJjaEZhY3RvcnknLFxuLy8gIGZ1bmN0aW9uICgkaHR0cCkge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24ocGFyYW1zT2JqKXtcbi8vICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vMTAuMS4xLjExODo4MDAwL2FwaS9Qcm9zcGVjdCcsIHtwYXJhbXM6IHBhcmFtc09iaiB9IClcbi8vICAgICAgICAgfVxuLy8gICAgIH07XG4vLyAgIH1cbi8vICk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uZmFjdG9yeSgnc2VhcmNoRmFjdG9yeScsXG4gICAgZnVuY3Rpb24gKCRodHRwLCAkbG9jYXRpb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZWFyY2g6IGZ1bmN0aW9uKHBhcmFtc09iail7XG4gICAgICAgICAgICB2YXIgYm9ycm93ZWRUaW1lID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3BsaXQoXCJzZWFyY2hcIilbMV1cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Byb3NwZWN0JyArIGJvcnJvd2VkVGltZSApXG4gICAgICAgIH1cbiAgICB9O1xuICB9XG4pO1xuIiwiLy8gY2xhc3MgVGFzayB7XG4vLyAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4vLyAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbi8vICAgICB9XG4vLyB9XG4iLCJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuICAgIC5zZXJ2aWNlKCdUYXNrU2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGFzcyBUYXNrIHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNsYXNzIFRhc2tMaXN0IGV4dGVuZHMgQXJyYXkge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkKGFycmF5KSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXNoKG5ldyBUYXNrKGFycmF5W2ldKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZW1vdmUoYWN0aXZpdHlJRCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaWNlKHRoaXMubWFwKHRhc2tzID0+IHRhc2tzLkFjdGl2aXR5SUQpLmluZGV4T2YoYWN0aXZpdHlJRCksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2xhc3MgVGFza1NlcnZpY2Uge1xuICAgICAgICAgICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5UYXNrTGlzdCA9IG5ldyBUYXNrTGlzdCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGFza1NlcnZpY2UgPSBuZXcgVGFza1NlcnZpY2UoKTtcbiAgICAgICAgcmV0dXJuIHRhc2tTZXJ2aWNlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCd0YXNrcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsIC8vRSA9IGVsZW1lbnQsIEEgPSBhdHRyaWJ1dGUsIEMgPSBjbGFzcywgTSA9IGNvbW1lbnQgICAgICAgICBcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgLy9AIHJlYWRzIHRoZSBhdHRyaWJ1dGUgdmFsdWUsID0gcHJvdmlkZXMgdHdvLXdheSBiaW5kaW5nLCAmIHdvcmtzIHdpdGggZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlOiAnPGRpdj57eyBteVZhbCB9fTwvZGl2PicsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy90YXNrcy90YXNrcy50bXBsLmh0bWwnLFxuICAgICAgICAgICAgLy8gY29udHJvbGxlcjogY29udHJvbGxlckZ1bmN0aW9uLCAvL0VtYmVkIGEgY3VzdG9tIGNvbnRyb2xsZXIgaW4gdGhlIGRpcmVjdGl2ZVxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge30gLy9ET00gbWFuaXB1bGF0aW9uXG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4gICAgLmNvbnRyb2xsZXIoJ3Rhc2tDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCBUYXNrU2VydmljZSwgJHN0YXRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGFzayBDb250cm9sbGVyIGxvYWRlZFwiKVxuXG4gICAgICAgIC8vICRzY29wZS50YXNrcyA9IG5ldyBUYXNrTGlzdChbXSk7XG4gICAgICAgICRzY29wZS50YXNrcyA9IFRhc2tTZXJ2aWNlLlRhc2tMaXN0XG4gICAgICAgIC8vICRzY29wZS50YXNrc01hcCA9IFRhc2tTZXJ2aWNlLlRhc2tNYXA7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnRhc2tzKVxuXG4gICAgICAgIC8vICRzY29wZS50YXNrcy5wdXNoKDEpXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnRhc2tzKVxuXG4gICAgICAgIC8vIC8vICRzY29wZS50YXNrcy5wb29wKCk7XG5cbiAgICAgICAgLy8gLy8gJHNjb3BlLnRhc2tzLnB1c2goMilcblxuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZygkc2NvcGUudGFza3MubGVuZ3RoKVxuXG4gICAgICAgIC8vIC8vICRzY29wZS50YXNrcy5mb3JFYWNoKGZ1bmN0aW9uKG51bSkge1xuICAgICAgICAvLyAvLyAgICAgY29uc29sZS5sb2coXCJIYVwiLCBudW0pXG4gICAgICAgIC8vIC8vIH0pXG5cbiAgICAgICAgLy8gLy8gLy8gJHNjb3BlLnRhc2tzID0gVGFza1NlcnZpY2UuVGFza0xpc3QoXCJ1bm9cIiwgXCJkb3NcIilcblxuICAgICAgICAvLyAkc2NvcGUudGFza3MuYWRkKFtcIlVub1wiLCBcIkRvc1wiXSlcblxuICAgICAgICB2YXIgdGFzayA9IHt9XG4gICAgICAgIHRhc2suRGVzY3IgPSBcIlNhbXBsZSBkZXNjclwiXG4gICAgICAgICRzY29wZS50YXNrcy5wdXNoKHRhc2spXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnRhc2tzKVxuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUudGFza3MubGVuZ3RoKVxuXG5cbiAgICAgICAgLy8gdmFyIFttZXRob2RzLCBpbml0XSA9IGh1YkZhY3Rvcnk7XG4gICAgICAgIC8vIGluaXQudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwiRG91YmxlIGRvbmVcIilcbiAgICAgICAgLy8gICAgIC8vIHJlZ2lzdGVyIHVzZXJuYW1lIHdpdGggc2VydmVyXG4gICAgICAgIC8vICAgICBtZXRob2RzLldob0FtSSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJ0b2xkIHNlcnZlciB3aG8gd2UgYXJlXCIpXG4gICAgICAgIC8vICAgICAgICAgbWV0aG9kcy5HZXRUYXNrcygpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR290IHRhc2tzXCIsIHJlcylcbiAgICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLnRhc2tzLmFkZChyZXMpXG4gICAgICAgIC8vICAgICAgICAgfSlcbiAgICAgICAgLy8gICAgIH0pXG4gICAgICAgIC8vIH0pLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJGdWRnZVwiKVxuICAgICAgICAvLyB9KVxuXG4gICAgICAgICRzY29wZS5zaG93VGFza3MgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnBvcFRhc2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd1Rhc2tzID0gISRzY29wZS5zaG93VGFza3MgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUubmF2aWdhdGUgPSBmdW5jdGlvbihwcm9zcGVjdElEOiBudW1iZXIpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWN0aXZpdHkgSURcIiwgYWN0aXZpdHlJRClcbiAgICAgICAgICAgIC8vICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy8gJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLnRhc2tzLnJlbW92ZShhY3Rpdml0eUlEKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnRhc2tzKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJQYXNzZWRcIiwgcHJvc3BlY3RJRClcbiAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZS5wcm9zcGVjdCcsIHtcbiAgICAgICAgICAgICAgICBQcm9zcGVjdElEOiBwcm9zcGVjdElEXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLkNoYW5nZVRhc2tTdGF0dXMgPSBmdW5jdGlvbihhY3Rpdml0eUlELCBzdGF0dXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aXZpdHkgaWRcIiwgYWN0aXZpdHlJRClcbiAgICAgICAgICAgIC8vIG1ldGhvZHMuQ2hhbmdlVGFza1N0YXR1cyhhY3Rpdml0eUlELCBzdGF0dXMpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBmdW5jdGlvbiBtYXJrQ29tcGxldGUoKSB7XG5cbiAgICAgICAgLy8gfVxuXG5cblxuXG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgICAuZmFjdG9yeSgndGFza0ZhY3RvcnknLFxuICAgICAgICAvLyBub3cgUmVzZWFyY2ggRmFjdG9yeVxuICAgICAgICBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBxdWVyeVJlc3VsdHM6IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHZXR0aW5nIHF1ZXJ5IHdpdGggcGFyYW1zIFwiLCB1cmwpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly8xMC4xLjEuMTE4OjgwMDAvYXBpL1Jlc2VhcmNoP1N0YXRlPU1PJlByb2R1Y3RJRD0xJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4pO1xuIiwidmFyICRodG1sID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF0pO1xuXG5hbmd1bGFyLmVsZW1lbnQoKS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBhbmd1bGFyLnJlc3VtZUJvb3RzdHJhcChbYXBwWyduYW1lJ11dKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9