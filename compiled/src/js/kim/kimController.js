define([], function() {
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
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMva2ltL2tpbUNvbnRyb2xsZXIuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9raW0va2ltQ29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgndWlSb3V0ZXJTYW1wbGUnKVxuLmNvbnRyb2xsZXIoJ2tpbUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGFsZXJ0LCBwcm9zcGVjdEZhY3RvcnksICRtb2RhbCkge1xuICAgIGNvbnNvbGUubG9nKFwiSGVsbG8ga2ltXCIpXG4gICAgJHNjb3BlLnRoZV9Qcm9zcGVjdDtcbiAgICAkc2NvcGUuQ29udGFjdHMgPSBbXTtcbiAgICBwcm9zcGVjdEZhY3RvcnkuZ2V0UHJvc3BlY3RfYnlfSUQoJHN0YXRlLnBhcmFtcykudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJHb3QgcHJvc3BlY3RcIiwgZGF0YSlcbiAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdCA9IG5ldyBQcm9zcGVjdChkYXRhLmRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUudGhlX1Byb3NwZWN0LmxhdGVzdCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50aGVfUHJvc3BlY3QpXG4gICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9ICRzY29wZS50aGVfUHJvc3BlY3QuQ29udGFjdHNbMF1cbiAgICAgICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnJldmVyc2UoKVxuXG4gICAgICAgIC8vICAgJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzID0gJHNjb3BlLnRoZV9Qcm9zcGVjdC5BY3Rpdml0aWVzLnNsaWNlKDAsMylcbiAgICB9KVxuXG4gICAgJHNjb3BlLmNvbnRhY3RzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkc2NvcGUuaXNzdWVzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkc2NvcGUubm90ZXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAvL2NvbnRhY3RzIHRhYnNcbiAgICAkc2NvcGUuY3VycmVudENvbnRhY3RcbiAgICAkc2NvcGUub25DbGlja1RhYiA9IGZ1bmN0aW9uIChjb250YWN0KSB7XG4gICAgICAgICRzY29wZS5jdXJyZW50Q29udGFjdCA9IGNvbnRhY3RcbiAgICB9XG4gICAkc2NvcGUuaXNBY3RpdmVUYWIgPSBmdW5jdGlvbihjb250YWN0KSB7XG4gICAgICAgIHJldHVybiBjb250YWN0ID09ICRzY29wZS5jdXJyZW50Q29udGFjdDtcbiAgICB9XG5cbiAgICAvLyAkc2NvcGUuY3VycmVudENvbnRhY3RzX2lzc3Vlc19vcl9ub3Rlc190YWIgPSAnbm90ZXMtdGFiJ1xuICAgIC8vICRzY29wZS5tYWtlQWN0aXZlID0gZnVuY3Rpb24oc29tZXRoaW5nKXtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJTb21ldGhpbmdcIiwgc29tZXRoaW5nKVxuICAgIC8vICAgICAkc2NvcGUuY3VycmVudENvbnRhY3RzX2lzc3Vlc19vcl9ub3Rlc190YWIgPSBzb21ldGhpbmdcbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLmlzQWN0aXZlVGFiMiA9IGZ1bmN0aW9uKGNvbnRhY3QpIHtcbiAgICAvLyAgICAgcmV0dXJuIGNvbnRhY3QgPT0gJHNjb3BlLmN1cnJlbnRDb250YWN0c19pc3N1ZXNfb3Jfbm90ZXNfdGFiXG4gICAgLy8gfVxuXG4gICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcblxuXG4gICAgJHNjb3BlLmFkZENvbnRhY3QgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbXlNb2RhbCA9ICRtb2RhbCh7c2NvcGU6ICRzY29wZSwgdGVtcGxhdGU6ICd2aWV3cy9hZGRfY29udGFjdC50cGwuaHRtbCcsIHNob3c6IHRydWV9KTtcbiAgICB9XG5cblxufSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==