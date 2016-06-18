'use strict';

angular.module('PatientGroup', ['Common', 'ui.bootstrap'])
.controller('PatientGroupList', ['$scope', 'LocationService', 'Interaction', '$http', function ($scope, LocationService, Interaction, $http) {
    $scope.dataLoading = true;
    $scope.loadingMessage = 'Trwa pobierania listy grup pacjentów';

    $scope.addPatientGroup = function () {
        LocationService.createPatientGroup();
    };

    $scope.editPatientGroup = function (index) {
        if (null == index) {
            return;
        }
        LocationService.editPatientGroup($scope.productGroupList[$index].patientGroupId);
    };

    $scope.removeProductGroup = function (index) {
        if (null == index) {
            return;
        }

        Interaction.ShowConfimation('Czy na pewno chcesz usunąć ' + $scope.productGroupList[index].name + '?', 'Tak', 'Nie', function () {
            $scope.errorMessage = null;
            $scope.dataLoading = true;
            $scope.loadingMessage = 'Trwa usuwanie grupy pacjentów';
            $http.delete('/productgroup/remove/' + $scope.productGroupList[index].productGroupId)
                .success(function (data) {
                    $scope.dataLoading = false;
                    $scope.productGroupList.splice(index, 1);
                }).error(function () {
                    $scope.dataLoading = false;
                    $scope.errorMessage = 'Wystąpił błąd podczas pobiernia grup produktów.';
                });
        }, function () { });

    };

    $http.get('/productgroup/all').success(function (data) {
        $scope.productGroupList = data;
        $scope.dataLoading = false;
    }).error(function () {
        $scope.dataLoading = false;
        $scope.errorMessage = 'Wystąpił błąd podczas pobiernia grup produktów.';
    });

}])
.controller('AddPatientGroupList', ['$scope', 'LocationService', 'Interaction', '$http', function ($scope, LocationService, Interaction, $http) {
    $scope.isEdit = false;
    $scope.products = [];
    $scope.OnTreatmentChange = function (newItem) {
        if (undefined == newItem) {
            return;
        }
        $scope.products.push(newItem.originalObject);
    };

    $scope.removeProduct = function (index) {
        $scope.products.splice(index, 1);
    };

    $scope.Save = function () {
        $scope.dataLoading = true;

        $http.post('/productgroup/new',
            {
                name: $scope.name,
                comment: $scope.comment,
                treatmentProducts: $scope.products.map(function (k) {
                    return { treatmentProductId: k.id };
                })
            }).success(function (data) {
                $scope.dataLoading = false;
                LocationService.productGroup();
            }).error(function () {
                $scope.dataLoading = true;

            });
    };
}])
.controller('EditPatientGroupList', ['$scope', 'LocationService', 'Interaction', '$http', function ($scope, LocationService, Interaction, $http) {
    $scope.dataLoading = true;
    $scope.isEdit = true;
    $scope.products = [];
    $scope.OnTreatmentChange = function (newItem) {
        if (undefined == newItem) {
            return;
        }
        $scope.products.push(newItem.originalObject);
    };
    $scope.OnTreatmentChange = function (newItem) {
        if (undefined == newItem) {
            return;
        }
        $scope.products.push(newItem.originalObject);
    };

    $scope.removeProduct = function (index) {
        $scope.products.splice(index, 1);
    };

    $scope.Save = function () {
    };

}]);