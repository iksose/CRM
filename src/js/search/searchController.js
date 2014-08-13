angular.module('uiRouterSample')
.controller('searchController', function($scope, $rootScope, $state, $alert, searchFactory, $timeout, $location) {
    console.log("Hello search")
    document.getElementById("searchbox").focus();
    $scope.paramsObj = {
        ProspectID: ''
    }

    $scope.prospectType = [
        {value: 'P', label: 'Prospect'},
        {value: 'A', label: 'Active'},
        {value: 'F', label: 'Former'}
    ];
    $scope.selectedProspectType = [ for ({value} of $scope.prospectType ) value]
    $scope.customerType = [
        {value: 'P', label: 'ProfitGuard'},
        {value: 'N', label: 'Negotiator'},
        {value: 'S', label: 'Services Only'},
        {value: 'G', label: 'Government'}
    ];
    $scope.selectedCustomerType = [ for ({value} of $scope.customerType ) value]

    $scope.BDMs = ['BDM01', 'BDM02', 'BDM03', 'BDM04']
    $scope.selectedBDM = [ for (x of $scope.BDMs ) x]

    // console.log("params", $state.params)

    var stateParams = $state.params
    Object.keys(stateParams).forEach((key) => {
        if (!stateParams[key]) {
            delete stateParams[key];
        }
    });

    console.log("Got", stateParams)

    if(Object.keys(stateParams).length){
        console.log("There's params, guys!!!")
        searchFactory.search(stateParams).then((res) => {
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
    }else{
        console.log("No state params present")
    }

    $scope.config = {
        itemsPerPage: 10,
        fillLastPage: false
    }

    $scope.searchResults = [];
    $scope.emptyResults = false;
    $scope.searchString = ''

    $scope.startSearch = function(){
        console.log("Start?",$scope.paramsObj)
        Object.keys($scope.paramsObj).forEach((key) => {
            $scope.paramsObj[key] = $scope.searchString;
        })
        $location.search($scope.paramsObj)
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
        document.getElementById("searchbox").focus();
        Object.keys($scope.paramsObj).forEach((key) => {
            delete $scope.paramsObj[key]
        })
        $scope.paramsObj[$scope.item] = '';
    }

    $scope.gotoProspect = function(prospectID){
        $state.go('home.prospect', {ProspectID: prospectID})
    }

    $scope.CityStateZip_string;

    $scope.fnCityStateZip = function(){
        //prioritizes zip, then city, and lastly state
        var array = []
        $scope.CityStateZip_string.split(',').forEach((word) => {
            array.push($.trim(word))
        })
        console.log(array)


        //turns "MO 64110" into two strings
        // or "Kansas City 64110"
        var noSpaces = [];
        array.forEach((word) => {
            noSpaces.push( word.split(' ') );
        })

        var zip = "";
        array.forEach((part) => {
            zip = extractZip(part)
        })
        console.log("Zip?", zip)
        if(zip.length > 0){
            $location.search({'Zip': zip})
        }
        console.log("comma separated", array)

        var index = array.indexOf(zip);
        if (index > -1) {
            array.splice(index, 1);
        }

        console.log("Removed zip object", array)

        // if string is == than 2 it's state
        var state = ''
        array.forEach((string) => {
            if(string.length == 2) state = string
        })

        console.log("State", state)

        var index = array.indexOf(state);
        if (index > -1) {
            array.splice(index, 1);
        }
        console.log("Removed state object", array)

        // if no zip, search by city
        console.log("Final check", array)
        if(array.length > 0 && zip.length == 0){
            console.log("All we've got left is City")
            $location.search({'City': array[0]})
        }

        // if no zip or city, search by state
        if(array.length == 0 && zip.length == 0){
            $location.search({'State': state,
                "ProspectType": $scope.selectedProspectType,
                "CustomerType": $scope.selectedCustomerType
                })
        }

        function extractZip(str) {
            //the regular expression below is for 5 digit US ZIP code, 5 digit US ZIP code + 4,
            //and 6 digit alphanumeric Canadian Postal Code
            var re = /\d{5}-\d{4}|\d{5}|[A-Z]\d[A-Z] \d[A-Z]\d/
            var input = str;
            var match = re.exec(input)
            if (match) {
                return match[0];
            } else {
                return "";
            }
        }
    }
})
