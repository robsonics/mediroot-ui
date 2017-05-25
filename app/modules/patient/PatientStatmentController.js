(function () {
    'use strict';
    angular.module('Patient')
        .controller('PatientStatmentController', ['$routeParams', '$http', '$location', 'ApiAdress', function ($routeParams, $http, $location, ApiAdress) {
            var self = this;
            self.loading = true;
            self.error = null;
            $http.get(ApiAdress + '/patientstatment/' + $routeParams.patientId + '/list').then(function (response) {
                self.loading = false;
                self.error = null;
                self.statmentList = response.data;
            }, function () {
                self.loading = false;
                self.error = null;
            });

            self.Download = function (id) {
                ///TODO download
                $location.path('/previewstatmentsignoff/' + id + '/' + $routeParams.patientId + '/e');
            };

            self.SignOff = function (id) {
                $location.path('/statmentsignoff/' + id + '/' + $routeParams.patientId + '/e');
            };

        }]);
}());