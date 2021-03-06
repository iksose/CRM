angular.module('uiRouterSample')
    .controller('kimController', function($scope, $rootScope, $state, $alert, prospectFactory, $modal) {
        console.log("Hello kim")
        $scope.the_Prospect;
        $scope.Contacts = [];
        prospectFactory.getProspect_by_ID($state.params).then(function(data) {
            console.log("Got prospect", data)
            $scope.the_Prospect = new Prospect(data.data);
            // console.log($scope.the_Prospect.latest);
            console.log($scope.the_Prospect)
            $scope.currentContact = $scope.the_Prospect.Contacts[0]
            $scope.the_Prospect.Activities.reverse()
        })

        $scope.contactsCollapsed = true;
        $scope.issuesCollapsed = true;
        $scope.notesCollapsed = false;
        //contacts tabs
        $scope.currentContact
        $scope.onClickTab = function(contact) {
            $scope.currentContact = contact
        }
        $scope.isActiveTab = function(contact) {
            return contact == $scope.currentContact;
        }

        $scope.currentPage = 1;


        $scope.addContact = function() {
            var myModal = $modal({
                scope: $scope,
                template: 'views/add_contact.tpl.html',
                show: true
            });
        }


    })
