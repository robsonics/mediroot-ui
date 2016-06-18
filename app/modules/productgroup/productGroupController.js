'use strict';

angular.module('ProductGroup', ['Common', 'ui.bootstrap'])
.controller('ProductGroupList', ['$scope', 'LocationService','Interaction', '$http', function ($scope, LocationService,Interaction, $http) {
    $scope.dataLoading = true;
    $scope.loadingMessage = 'Trwa pobierania listy produktów';

    $scope.addProductGroup = function() {
        LocationService.createProductGroup();
    };

    $scope.editProductGroup = function (index) {
        if (null == index) {
            return;
        }
        LocationService.editProductGroup($scope.productGroupList[$index].productGroupId);
    };
    
    $scope.removeProductGroup = function (index) {
        if (null == index) {
            return;
        }

        Interaction.ShowConfimation('Czy na pewno chcesz usunąć ' + $scope.productGroupList[index].name + '?', 'Tak', 'Nie', function () {
            $scope.errorMessage = null;
            $scope.dataLoading = true;
            $scope.loadingMessage = 'Trwa usuwanie grupy produktów';
            $http.delete('/productgroup/remove/' + $scope.productGroupList[index].productGroupId)
                .success(function (data) {
                    $scope.dataLoading = false;
                    $scope.productGroupList.splice(index, 1);
                }).error(function () {
                    $scope.dataLoading = false;
                    $scope.errorMessage = 'Wystąpił błąd podczas pobiernia grup produktów.';
                });
        },function (){});
       
    };

    $http.get('/productgroup/all').success(function (data) {
        $scope.productGroupList = data;
        $scope.dataLoading = false;
    }).error(function () {
        $scope.dataLoading = false;
        $scope.errorMessage = 'Wystąpił błąd podczas pobiernia grup produktów.';
    });

}])
.controller('AddProductGroupList', ['$scope', 'LocationService', 'Interaction', '$http', function ($scope, LocationService, Interaction, $http) {
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
        var req = {
            name: $scope.name,
            comment: $scope.comment,
            treatmentProducts: $scope.products.map(function(k) {
                return { treatmentProductId: k.id };
            })
        };
        $http.post('/productgroup/new',req
           ).success(function(data) {
                $scope.dataLoading = false;
                LocationService.productGroup();
            }).error(function() {
                $scope.dataLoading = true;

            });
    };
}])
.controller('EditProductGroupList', ['$scope', 'LocationService', 'Interaction', '$http', function ($scope, LocationService, Interaction, $http) {
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

    $scope.Save = function() {
    };

}]);