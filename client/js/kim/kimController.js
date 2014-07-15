angular.module('uiRouterSample')
.controller('kimController', function($scope, $rootScope, $state, $alert, prospectFactory) {
    console.log("Hello kim")
    $scope.the_Prospect;
    $scope.Contacts = [];
    prospectFactory.getProspect_by_ID($state.params).then(function(data){
        console.log("Got prospect", data)
        $scope.the_Prospect = new Prospect(data.data);
        // console.log($scope.the_Prospect.latest);
        console.log($scope.the_Prospect)
        $scope.currentContact = $scope.the_Prospect.Contacts[0]
        $scope.the_Prospect.Activities.reverse()

        //   $scope.the_Prospect.Activities = $scope.the_Prospect.Activities.slice(0,3)
    })

    $scope.contactsCollapsed = true;
    $scope.issuesCollapsed = true;
    $scope.notesCollapsed = false;
    //contacts tabs
    $scope.currentContact
    $scope.onClickTab = function (contact) {
        $scope.currentContact = contact
    }
   $scope.isActiveTab = function(contact) {
        return contact == $scope.currentContact;
    }

    // $scope.currentContacts_issues_or_notes_tab = 'notes-tab'
    // $scope.makeActive = function(something){
    //     console.log("Something", something)
    //     $scope.currentContacts_issues_or_notes_tab = something
    // }
    // $scope.isActiveTab2 = function(contact) {
    //     return contact == $scope.currentContacts_issues_or_notes_tab
    // }

    $scope.currentPage = 1;


})
