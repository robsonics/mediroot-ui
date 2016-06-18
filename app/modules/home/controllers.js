'use strict';

angular.module('Home', ['ngDialog', 'ui.bootstrap', 'Common'])
    .factory('HomeBackend', ['$http', 'serverAdress', function ($http, serverAdress) {
        return {
            getAll: function () {
                return $http.get(serverAdress + '/patient/all');
            },
            removePatient: function (patientId) {
                return $http.delete(serverAdress + '/patient/' + patientId + '/remove')
            }
        }
    }])
    .controller('HomeController', ['$scope', '$rootScope', '$http', '$location', 'ngDialog', 'HomeBackend',
        function ($scope, $rootScope, $http, $location, ngDialog, HomeBackend) {
            $scope.username = $rootScope.globals.currentUser.username;
            $scope.dataLoading = true;

            $scope.removePatient = function ($index) {
                console.log('remove patient ' + $index);
                ngDialog.openConfirm({
                    template: '\
                    <p>Czy na pewno chcesz usunąć ' + $scope.driversList[$index].lastname + ' ' + $scope.driversList[$index].firstname + '? </p>\
                    <div class="ngdialog-buttons">\
                        <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Nie</button>\
                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Tak</button>\
                    </div>',
                    plain: true
                }).then(
                function (value) {
                    $scope.dataLoading = true;
                    HomeBackend.removePatient($scope.driversList[$index].patientid).success(function () {
                        $scope.driversList.splice($index, 1);
                        $scope.dataLoading = false;
                    }).error(function () {
                        $scope.error = 'Wystapil blad podczas usuwania pacjenta.';
                        $scope.dataLoading = false;
                    });
                },
                function (value) {
                    //Cancel or do nothing
                }
            );

            };

            $scope.addPatient = function () {
                $location.path('/addpatient');
            };

            $scope.editPatient = function(index) {
                $location.path('/patient/' + $scope.driversList[index].patientid + '/edit/h');
            };

            HomeBackend.getAll()
                .success(function (data) {
                    $scope.driversList = data;
                    $scope.dataLoading = false;
                })
                .error(function () {
                    $scope.error = 'Wystapil blad podczas pobierania listy pacjentów';
                    $scope.dataLoading = false;
                });

    }]);