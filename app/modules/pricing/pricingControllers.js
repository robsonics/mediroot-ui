'use strict';

angular.module('Pricing', ['ngDialog', 'ui.bootstrap', 'Patient'])
.controller('PricingController', ['$scope', '$location', '$http', 'Interaction', function ($scope, $location, $http, Interaction) {
    $scope.error = null;
    $scope.pricingListLoading = true;
    $scope.productListCount = 0;
    $scope.page = 1;
    $scope.pageSize = 20;
    $scope.showPaging = true;

    $http.get('/diagnose/all/count')
        .success(function (data, status, headers, config) {
            $scope.productListCount = data;
            $scope.showPaging = $scope.productListCount > $scope.pageSize;
            $scope.pricingListLoading = false;

        }).error(function (data, status, headers, config) {
            $scope.error = 'Wystapil blad podczas liczenia listy produktów.';
            $scope.pricingListLoading = false;

        });

    $scope.pageChanged = function () {
        if ('' == $scope.nameFilter || null == $scope.nameFilter) {
            $http.get('/diagnose/all/' + $scope.page + '/' + $scope.pageSize)
               .success(function (data, status, headers, config) {
                   $scope.productList = data;
                   $scope.pricingListLoading = false;
               }).error(function (data, status, headers, config) {
                   $scope.error = 'Wystapil blad podczas pobierania listy produktów.';
                   $scope.pricingListLoading = false;
               });
        } else {
            $http.get('/diagnose/list/' + $scope.nameFilter + '/' + $scope.page + '/' + $scope.pageSize)
              .success(function (data, status, headers, config) {
                  $scope.productList = data;
                  $scope.pricingListLoading = false;
              }).error(function (data, status, headers, config) {
                  $scope.error = 'Wystapil blad podczas pobierania listy produktów.';
                  $scope.pricingListLoading = false;
              });
        }

    };

    $scope.pageChanged();

    $scope.search = function () {
        if ($scope.nameFilter.length <= 2) {
            return;
        }
        $scope.page = 1;
        $http.get('/diagnose/list/' + $scope.nameFilter + '/' + $scope.page + '/' + $scope.pageSize)
              .success(function (data) {
                  $scope.productList = data.list;
                  $scope.productListCount = data.total;
                  $scope.showPaging = $scope.productListCount > $scope.pageSize;
                  $scope.pricingListLoading = false;
              }).error(function () {
                  $scope.error = 'Wystapil blad podczas pobierania listy produktów.';
                  $scope.pricingListLoading = false;
              });
    };

    $scope.addProduct = function () {
        $location.path('/product/new');
    };

    $scope.editProduct = function (index) {
        $location.path('/product/details/' + $scope.productList[index].id);
    };

    $scope.removeProduct = function (index) {
        Interaction.ShowConfimation('Czy na pewno chcesz usun¹æ ' + $scope.productList[index].name + ' ?', 'Tak', 'Nie',
            function () {
                console.log('Usuwanie pacjenta');
                $http.delete('/diagnose/remove/' + $scope.productList[index].id)
                .success(function (data) {
                    //remove from ui
                    $scope.productList.splice(index, 1);
                    console.log('usunieto' + $scope.productList[index].id);
                })
                .error(function () {
                    //show error
                    $scope.error = 'Wyst¹pi³ b³¹d podczas usuwania produktu';
                });
            }, function () {
                //do nothing 
                console.log('Blad podczas Usuwania pacjenta');

            });

    };

}])
.controller('EditPricingController', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) {
    $scope.isEdit = true;
    $scope.error = null;
    $scope.id = $routeParams.productId;
    $scope.dataLoading = true;
    $scope.Taxed = 1;
    console.log($routeParams.productId);

    $http.get('/diagnose/detail/' + $scope.id)
        .success(function (data) {
            $scope.product = data;
            $scope.dataLoading = false;
            $scope.Taxed = $scope.product.taxRateDiscountRuel == undefined || $scope.product.taxRateDiscountRuel == null || $scope.product.taxRateDiscountRuel == ''?1:0;
        })
        .error(function () {
            $scope.error = 'Wyst¹pi³ b³¹d podczas pobierania danych produktu' + $scope.id;
            $scope.dataLoading = false;
        });

    $scope.Save = function () {
        $scope.dataLoading = true;

        console.log('save command invoked');
        $http.post('/diagnose/edit/' + $scope.id, {
            name: $scope.product.name,
            icd9code: $scope.product.icd9Code,
            defaultPrice: $scope.product.defaultPrice,
            lowerPrice: $scope.product.lowerPrice,
            upperPrice: $scope.product.upperPrice,
            taxRate: $scope.product.taxRate,
            taxDiscountRule: $scope.product.taxDiscountRule,
        }).success(function (data) {
            $scope.dataLoading = false;
            $location.path('/pricing');
        }).error(function () {
            $scope.error = '';
        });
    };

}])
.controller('NewPricingController', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    $scope.isEdit = false;
    $scope.error = null;
    $scope.Taxed = 1;

    $scope.Save = function () {
        console.log('save command invoked');
        $scope.error = null;
        $scope.dataLoading = true;
        $http.post('/diagnose/new', {
            name: $scope.product.name,
            icd9Code: $scope.product.icd9Code,
            defaultPrice: $scope.product.defaultPrice,
            lowerprice: $scope.product.lowerPrice,
            upperprice: $scope.product.upperPrice,
            taxRate: $scope.product.taxRate,
            taxDiscountRule:$scope.product.taxDiscountRule,
        }).success(function (data) {
            console.log('New produt with id:' + data);
            $location.path('pricing');
            $scope.dataLoading = false;
        }).error(function () {
            $scope.error = 'Wyst¹pi³ b³¹d podczas zapisywania produktu.';
            $scope.dataLoading = false;
        });
    };

}]);
