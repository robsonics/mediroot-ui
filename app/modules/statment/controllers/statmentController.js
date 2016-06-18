'use strict';

angular.module('Statment', ['ngDialog', 'ui.calendar', 'ui.bootstrap', 'Common'])
    .factory('StatmentBackend', ['$http', 'serverAdress', function ($http, serverAdress) {
        return {
            getAllStatment: function () {
                return $http.get(serverAdress + '/statment/all');
            },
            addStatment: function (data) {
                return $http.post(serverAdress + '/statment/add', data);
            },
            removeStatment: function (statmentId) {
                return $http.delete(serverAdress + '/statment/' + statmentId + '/remove');
            }
        };
    }])
    .controller('StatmentList', ['$scope', 'StatmentBackend', function ($scope, StatmentBackend) {
        $scope.dataLoading = true;
        $scope.errorMessage = '';

        $scope.remove = function (statmentId) {
            StatmentBackend.removeStatment(statmentId)
                .success(function () {
                    $scope.dataLoading = false;
                })
                .error(function () {
                    $scope.dataLoading = false;
                    $scope.errorMessage = 'Wystapił błąd podczas usuwania.';
                });
        };
        
        StatmentBackend.getAllStatment()
            .success(function (data) {
                $scope.dataLoading = false;
                $scope.statmentList = data;
            })
            .error(function () {
                $scope.dataLoading = false;
                $scope.errorMessage = 'Wystapił błąd podczas pobierania listy oświadczeń.';
            });
    }])
    .controller('CreateStatment', ['$scope', 'StatmentBackend', 'LocationService', function ($scope, StatmentBackend, LocationService) {
        $scope.dataLoading = false;
        $scope.errorMessage = '';
        
        $scope.addStatment = function () {
            $scope.dataLoading = true;
            $scope.errorMessage = '';
            let req = {
                
            };
            console.log(req);
            StatmentBackend.addStatment(req).success(function (data) {
                //LocationService.
            }).error(function () {
                $scope.dataLoading = false;
                $scope.errorMessage = 'Wystąpił błąd podczas tworzenia nowego oświadczenia.';
            });
        };
    }]);