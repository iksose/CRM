"use strict";
var __moduleName = "scripts";
var app = angular.module('uiRouterSample', ['ui.router', 'ngAnimate', 'ngResource', 'ngCookies', 'mgcrea.ngStrap']).run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}]).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
    url: 'query/new',
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
  }).state('home.campaign.details', {
    url: '/details/:params',
    views: {'content@home': {
        templateUrl: 'views/campaign-details.html',
        controller: "campaignControllerDetails"
      }}
  });
}]);
console.log("hmm");
var evens = [2, 4, 6, 8];
var odds = evens.map((function(v) {
  return v + 1;
}));
var nums = evens.map((function(v, i) {
  return v + i;
}));
console.log("Nums", nums);
var melter = function(obj) {
  var temp = obj;
  temp.melted = "melted";
  return temp;
};
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
angular.module('uiRouterSample').controller('loginController', function($scope, $rootScope, Privilege, $cookies, $alert) {
  console.log("Controller loaded");
  $rootScope.loggedIn = $rootScope.loggedIn || false;
  $scope.creds = {};
  $rootScope.credentials = {};
  $scope.loginSubmit = function() {
    $cookies.myFavorite = "WOW";
    console.log("Cookies", $cookies);
    console.log("CREDS, ", $scope.creds);
    var test = Privilege.Login.query($scope.creds).$promise;
    var test2 = test.then(function(data) {
      console.log("Then....", data);
      $rootScope.loggedIn = true;
      $rootScope.$state.go("home");
      $rootScope.credentials.username = data.username;
      $rootScope.credentials.admin = data.admin;
      $rootScope.credentials.group = data.group;
    });
    var catchError = test.catch(function(err) {
      var myAlert = $alert({
        title: err.statusText,
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
    Login: $resource('api/login/:userID', {userId: '@id'}, {'query': {
        method: 'POST',
        isArray: false
      }}),
    Example: $resource('api/users/:userId/privileges', {userId: '@id'}, {'query': {
        method: 'GET',
        isArray: false
      }}),
    Cocks: function(alpha, beta) {
      var local = "blargh gargh";
      console.log("POST DUDE", local);
      $http({
        method: 'POST',
        url: '/dmz/login',
        params: local,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }
  };
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
});
angular.module('uiRouterSample').factory('campaignFactory', function($http) {
  return {
    queryResults: function(url, callback) {
      return $http.get('/api/campaigns');
    },
    singleCampaign: function(data) {
      return $http.post('/api/singlecampaign', data);
    }
  };
});
angular.module('uiRouterSample').controller('landingController', function($scope, $rootScope, $state) {
  console.log("Landing Controller");
  if (!$rootScope.loggedIn) {
    console.log("Not logged in, redirect");
    $state.go("login");
  }
  $scope.dropdown = [{
    "text": "New Campaign",
    "click": '$state.go("home.query")'
  }, {"divider": true}, {
    "text": "Other Campaigns",
    "click": '$state.go("home.campaign")'
  }];
});
angular.module('uiRouterSample').controller('queryController', function($scope, $rootScope, $state, queryFactory) {
  console.log("query Controller");
  $scope.resultsReturned = false;
  $scope.results = [];
  $scope.querySearch = function() {
    console.log("New search...please wait...");
    var submit = queryFactory.queryResults();
    var process = submit.then(function(data) {
      console.log("Got it...", data);
      $scope.results = data.data;
      $scope.resultsReturned = true;
    });
  };
});
angular.module('uiRouterSample').factory('queryFactory', function($http) {
  return {queryResults: function(url, callback) {
      return $http.get('/api/prospects');
    }};
});
