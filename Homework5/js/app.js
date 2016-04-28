(function () {
    "use strict";
    var contactlist = [];
    var index = 1;
    var usStates = {
        AL: "ALABAMA",AK: "ALASKA",AS: "AMERICAN SAMOA",AZ: "ARIZONA",AR: "ARKANSAS",CA: "CALIFORNIA",CO: "COLORADO",
        CT: "CONNECTICUT",DE: "DELAWARE",DC: "DISTRICT OF COLUMBIA",FM: "FEDERATED STATES OF MICRONESIA",FL: "FLORIDA",
        GA: "GEORGIA",GU: "GUAM",HI: "HAWAII",ID: "IDAHO",IL: "ILLINOIS",IN: "INDIANA",IA: "IOWA",KS: "KANSAS",KY: "KENTUCKY",
        LA: "LOUISIANA",ME: "MAINE",MH: "MARSHALL ISLANDS",MD: "MARYLAND",MA: "MASSACHUSETTS",MI: "MICHIGAN",MN: "MINNESOTA",
        MS: "MISSISSIPPI",MO: "MISSOURI",MT: "MONTANA",NE: "NEBRASKA",NV: "NEVADA",NH: "NEW HAMPSHIRE",NJ: "NEW JERSEY",
        NM: "NEW MEXICO",NY: "NEW YORK",NC: "NORTH CAROLINA",ND: "NORTH DAKOTA",MP: "NORTHERN MARIANA ISLANDS",OH: "OHIO",
        OK: "OKLAHOMA",OR: "OREGON",PW: "PALAU",PA: "PENNSYLVANIA",PR: "PUERTO RICO",RI: "RHODE ISLAND",SC: "SOUTH CAROLINA",
        SD: "SOUTH DAKOTA",TN: "TENNESSEE",TX: "TEXAS",UT: "UTAH",VT: "VERMONT",VI: "VIRGIN ISLANDS",VA: "VIRGINIA",
        WA: "WASHINGTON",WV: "WEST VIRGINIA",WI: "WISCONSIN",WY: "WYOMING"};
    
    angular.module('contactApp', ['file-data-url', 'ngRoute', 'LocalStorageModule', 'ngMap'])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/contactList.html',
                controller: 'contactListController'
            }).when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            }).when('/contact/:id', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            });
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        })
        .config(function (localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('08724.hw5');
        })
        .controller('contactListController', function ($scope, localStorageService, $location) {
            var indexArray = localStorageService.keys();
            console.log(indexArray);
            if (indexArray.length == 0) {
                index = 1;
            } else {
                index = 0;
                //get the last index
                for (var i = 0; i < indexArray.length; i++) {
                    index = Math.max(index, parseInt(indexArray[i]));
                }
                index++;
                //find position to insert new index
            }
            $scope.index = index;
            contactlist = [];
            for (var i = 0; i < index; i++) {
                if (localStorageService.get(i) != null) {
                    contactlist.push(localStorageService.get(i));
                }
            }
            $scope.contacts = contactlist;
            console.log($scope.contacts);
            $scope.remove = function (index, row) {
                localStorageService.remove(index);
                $scope.contacts.splice(row, 1);
            };
            //add new contact
            $scope.add = function (path) {
                $location.path(path);
            }
            //redirect to user accoring to id
            $scope.redirect = function (id) {
                $location.path('/contact/').search({id: id});
            }

        })
        .controller('contactController', function ($scope, localStorageService, $routeParams, $location, NgMap) {
            NgMap.getMap().then(function(map) {
                console.log(map.getCenter());
                console.log('markers', map.markers);
                console.log('shapes', map.shapes);
            });

            $scope.stateOptions = usStates;
            if (isNaN(parseInt($routeParams.id)) || parseInt($routeParams.id) === "undefined") {
                $scope.index = index;
                $scope.address = {};
            } else {
                $scope.index = parseInt($routeParams.id);
                $scope.address = localStorageService.get(parseInt($routeParams.id));
            }
            
            $scope.contacts = [];

            $scope.submit = function (path, address, index) {
                $location.search("id", null).path(path);
                $scope.address.index = index;

                console.log($scope.address);
                contactlist.push($scope.address);
                localStorageService.set(index, address);
            };
        });
})();