angular.module('uiRouterSample')
.controller('searchController', function($scope, $rootScope, $state, $alert, searchFactory, $timeout, $location) {
    console.log("Hello search")

    console.log($state.params)


    var cow_dicks = $state.params
    Object.keys(cow_dicks).forEach(function(k) {
        if (!cow_dicks[k]) {
            delete cow_dicks[k];
        }
    });

    console.log("Got", cow_dicks)

    if(cow_dicks){
        console.log("There's params, guys!!!")
        searchFactory.search(cow_dicks).then(function(res){
            console.log(res.data)
            $scope.searchResults = [];
            if(res.data.length > 0){
                $scope.emptyResults = false;
                res.data.forEach(function(prospect){
                    $scope.searchResults.push( new Prospect(prospect) )
                })
            }else{
                $scope.emptyResults = true;
                console.log("No data")
            }
            console.log($scope.searchResults)
        })
    }



    $scope.paramsObj = {
        ProspectID: ''
    }

    //
    $scope.config = {
        itemsPerPage: 10,
        fillLastPage: false
    }

    $scope.searchResults = [];
    $scope.emptyResults = false;
    $scope.searchString = ''

    $scope.startSearch = function(){
        // $state.go('home.search.results')
        Object.keys($scope.paramsObj).forEach(function(key){
            $scope.paramsObj[key] = $scope.searchString;
        })
        $location.search($scope.paramsObj)
        // searchFactory.search($scope.paramsObj).then(function(res){
        //     console.log(res.data)
        //     $scope.searchResults = [];
        //     if(res.data.length > 0){
        //         $scope.emptyResults = false;
        //         res.data.forEach(function(prospect){
        //             $scope.searchResults.push( new Prospect(prospect) )
        //         })
        //     }else{
        //         $scope.emptyResults = true;
        //         console.log("No data")
        //     }
        //     console.log($scope.searchResults)
        // })
    }



    $scope.searchOptions = [
        'ProspectID',
        'CustID',
        'NCPDP',
        'NPI'
    ]
    // sets default to 'ProspectID'
    $scope.item = $scope.searchOptions[0]

    // set $scope.paramsObj from dropdown
    $scope.searchSet = function(){
        Object.keys($scope.paramsObj).forEach(function(key){
            delete $scope.paramsObj[key]
        })
        $scope.paramsObj[$scope.item] = '';
    }

    $scope.gotoProspect = function(prospectID){
        console.log("Okay")
        $state.go('home.prospect', {ProspectID: prospectID})
    }
})
