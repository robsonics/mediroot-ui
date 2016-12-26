'use strict';
angular.module('Medicine', ['ngRoute', 'ui.bootstrap', 'Common'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/medicinelist', {
            controller: 'MedicineListController',
            templateUrl: 'modules/medicine/views/medicineList.html'
        }).when('/addmedicine', {
            controller: 'AddMedicineController',
            templateUrl: 'modules/medicine/views/addMedicine.html'
        }).when('/medicine/:medicineId/edit', {
            controller: 'EditMedicineController',
            templateUrl: 'modules/medicine/views/addMedicine.html'
        });

    }])
    .factory('MedicineAPI', ['$http', '$timeout', 'ApiAdress', function ($http, $timeout, ApiAdress) {
        var service = {};
        var responseDelay = 1500;
        service.GetAll = function (successfulCallback, errorCallback) {

            $http.get(ApiAdress + '/medicine/all').success(function (resutl) {
                successfulCallback(resutl);
            }).error(function (response) {
                errorCallback(response);
            });
            //$timeout(function () {
            //    //errorCallback();
            //    var result = [
            //        { medicineId: 1, symbol: '1/2015/NFZ', saledate: new Date() },
            //        { medicineId: 2, symbol: '2/2015/NFZ', saledate: new Date() },
            //        { medicineId: 3, symbol: '3/2015/NFZ', saledate: new Date() }
            //    ];
            //    successfulCallback(result);
            //}, responseDelay);
        };

        service.AddMedicine = function (objectToAdd, successfulCallback, errorCallback) {
            $http.post(ApiAdress + '/medicine/new', objectToAdd).success(function (result) {
                successfulCallback(result);
            }).error(function (result) {
                errorCallback(result);
            });
            //$timeout(function () {
            //    successfulCallback();
            //}, responseDelay);
        };

        service.removeMedicine = function (medicineId, successfulCallback, errorCallback) {

            $http.delete(ApiAdress + '/medicine/' + medicineId + '/remove').success(function (response) {
                successfulCallback(response);
            }).error(function (response) {
                errorCallback(response);
            });
            //$timeout(function () {
            //    successfulCallback();
            //}, responseDelay);
        };

        service.editMedicine = function (medicineId, objectToEdit, successfulCallback, errorCallback) {
            $http.post(ApiAdress + '/medicine/' + medicineId + '/edit').success(function (response) {
                successfulCallback(response);
            }).error(function (response) {
                errorCallback(response);
            });
        };

        service.medicineDetalis = function (medicineId, successfulCallback, errorCallback) {
            $http.get(ApiAdress + '/medicine/' + medicineId + '/detail').success(function (response) {
                successfulCallback(response);
            }).error(function (response) {
                errorCallback(response);
            });
        };

        
        return service;
    }]) 
    .factory('AddEditMedicineService', ['$log', function ($log) {
        var service = {};

        service.Create = function($scope) {
            this.$scope = $scope;
            
            this.OnAddItem = function(parameters) {

            };
            this.OnTreatmentChange = function(element) {
                this.$scope.name = element;
                this.$scope.customProduct = null;
                if (undefined != this.$scope.name && undefined != this.$scope.name.originalObject) {
                    this.$scope.price = this.$scope.name.originalObject.defaultPrice;
                }
            };
            
            this.AddItem = function () {
                var netprice = this.$scope.rebate != undefined || this.$scope.rebate != null ? (100 - this.$scope.rebate) / 100 * this.$scope.price : this.$scope.price;
                var grossprice = this.$scope.taxrate == 0 || this.$scope.taxrate == null || this.$scope.taxrate == undefined ? netprice : netprice * this.$scope.taxrate / 100;
                var obj = {
                    treatmentId: this.$scope.customProduct == null ? this.$scope.name.originalObject.id : null,
                    name: $scope.customProduct == null ? this.$scope.name.originalObject.name : this.$scope.customProduct,
                    //TODO copy to edit controller
                    quantity: this.$scope.quantity,
                    taxrate: this.$scope.taxrate,
                    units: this.$scope.unit,
                    rebate: this.$scope.rebate,
                    netpricebeforerebate: this.$scope.price,
                    netprice: netprice,
                    grossprice: grossprice,
                    total: grossprice * this.$scope.quantity
                };
                this.$scope.totalPrice = this.$scope.totalPrice + netprice * this.$scope.quantity;
                $log.debug(obj);
                this.$scope.itemName.push(obj);
                this.$scope.name = null;
                this.$scope.quantity = 1;
                this.$scope.rebate = 0;
                this.$scope.price = null;
                this.$scope.$broadcast('angucomplete-alt:clearInput', 'productName');
                this.$scope.customProduct = null;
            };

            this.RemoveItem = function (index) {
                this.$scope.totalPrice = this.$scope.totalPrice - this.$scope.itemName[index].total;
                this.$scope.itemName.splice(index, 1);
            };
        };
        
        return service;
    }])
    .controller('MedicineListController', ['$scope', '$rootScope', 'LocationService', 'MedicineAPI', 'Interaction', function ($scope, $rootScope, LocationService, MedicineAPI, Interaction) {
        $scope.errorMessage = null;
        $scope.dataLoading = true;

        MedicineAPI.GetAll(function (result) {
            $scope.dataLoading = false;
            $scope.medicineList = result;
        }, function () {
            $scope.dataLoading = false;
            $scope.errorMessage = 'Wystąpił błąd pobierania listy faktur';
        });

        $scope.AddMedicine = function () {
            LocationService.addMedicine();
        };

        $scope.removeMedicine = function (index) {
            Interaction.ShowConfimation('Czy na pewno chcesz usunąć fakturę o symbolu ' + $scope.medicineList[index].symbol, 'Tak', 'Nie', function () {
                $scope.dataLoading = true;
                MedicineAPI.removeMedicine($scope.medicineList[index].medicineid, function () {
                    $scope.dataLoading = false;
                    $scope.medicineList.splice(index, 1);
                }, function () {
                    $scope.dataLoading = true;
                    $scope.errorMessage = 'Wystąpił bład podczas usuwania faktury ' + $scope.medicineList[index].symbol;
                });
            }, function () {
                //no action close popup;
            });
        };
    }])
    .controller('AddMedicineController', ['$scope', '$rootScope', 'LocationService', 'MedicineAPI', 'Interaction', '$log', function ($scope, $rootScope, LocationService, MedicineAPI, Interaction, $log) {
        $scope.errorMessage = null;
        $scope.dataLoading = false;
        $scope.isEdit = false;
        $scope.itemName = [];
        $scope.totalPrice = 0;
        $scope.rebate = 0;
        $scope.quantity = 1;
        $scope.taxrate = 0;//TODO
        $scope.submitted = false;
        $scope.saleDate = new Date();
        $scope.createDate = new Date();
        $scope.customProduct = null;

        $scope.format = 'dd-MMMM-yyyy';

        $scope.salestatus = {
            opened: false
        };
        $scope.createstatus = {
            opened: false
        };

        $scope.OnCustomProduct = function(parameters) {
            $scope.customProduct = parameters;
        };

        $scope.saleopen = function ($event) {
            $scope.salestatus.opened = true;
        };
        $scope.createopen = function ($event) {
            $scope.createstatus.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };



        $scope.OnTreatmentChange = function (element) {
            $scope.name = element;
            $scope.customProduct = null;
            if (undefined != $scope.name && undefined != $scope.name.originalObject) {
                $scope.price = $scope.name.originalObject.defaultPrice;
            }
        };

        $scope.AddItem = function () {
            var netprice = $scope.rebate != undefined || $scope.rebate != null ? (100 - $scope.rebate) / 100 * $scope.price : $scope.price;
            var grossprice = $scope.taxrate == 0 || $scope.taxrate == null || $scope.taxrate == undefined ? netprice : netprice * $scope.taxrate / 100;
            var obj = {
                treatmentId: $scope.customProduct == null ?  $scope.name.originalObject.id:null,
                name: $scope.customProduct == null ? $scope.name.originalObject.name : $scope.customProduct,
                //TODO copy to edit controller
                quantity: $scope.quantity,
                taxrate: $scope.taxrate,
                units: $scope.unit,
                rebate: $scope.rebate,
                netpricebeforerebate: $scope.price,
                netprice: netprice,
                grossprice: grossprice,
                total: grossprice * $scope.quantity
            };
            $scope.totalPrice = $scope.totalPrice + netprice * $scope.quantity;
            $log.debug(obj);
            $scope.itemName.push(obj);
            $scope.name = null;
            $scope.quantity = 1;
            $scope.rebate = 0;
            $scope.price = null;
            $scope.$broadcast('angucomplete-alt:clearInput', 'productName');
            $scope.customProduct = null;
        };

        $scope.removeItem = function (index) {
            $scope.totalPrice = $scope.totalPrice - $scope.itemName[index].total;
            $scope.itemName.splice(index, 1);
        };

        $scope.back = function () {
            //when dirty ask for confirmation
            //if ($scope.form.$dirty) {
            //    Interaction.ShowConfimation('Czy chcesz opuścić forumlarz bez zapisywania zmian?', 'Tak', 'Nie',
            //        function () {
            //            LocationService.medicineList();
            //        },
            //        function () {
            //            // do nothing
            //        });
            //} else {
                LocationService.medicineList();
            //}
        };

        $scope.Save = function () {
            $scope.dataLoading = true;
            var req = {
                symbol: $scope.symbol,
                CustomerName: $scope.clientname,
                taxnumber: $scope.taxnumber,
                CustomerAdress: $scope.adress,
                createdate: $scope.createDate,
                saleDate: $scope.saleDate,
                city: $scope.city,
                postal: $scope.postal,
                    
                MedicineItems: $scope.itemName.map(function (t) {
                    return {
                        name: t.name,
                        price: t.grossprice,
                        quantity:t.quantity,
                    };
                })
            };
            console.log(req);
            MedicineAPI.AddMedicine(req, function () {
                LocationService.medicineList();
                $scope.dataLoading = false;
            }, function () {
                $scope.dataLoading = false;
                $scope.errorMessage = 'Wysąpił błąd podczas dodawania nowej faktury';
            });
        };

        $scope.Print = function () {

        };

    }])
    .controller('EditMedicineController', ['$scope', '$rootScope', 'LocationService', '$routeParams', 'MedicineAPI', 'Interaction', '$log', function ($scope, $rootScope, LocationService, $routeParams, MedicineAPI,Interaction, $log) {
        $scope.errorMessage = null;
        $scope.dataLoading = false;
        $scope.isEdit = true;
        $scope.itemName = [];
        $scope.totalPrice = 0;
        $scope.rebate = 0;
        $scope.quantity = 1;
        $scope.taxrate = 0;//TODO
        $scope.submitted = false;
        $scope.saleDate = new Date();
        $scope.createDate = new Date();

        $scope.format = 'dd-MMMM-yyyy';

        $scope.salestatus = {
            opened: false
        };
        $scope.createstatus = {
            opened: false
        };

        $scope.saleopen = function ($event) {
            $scope.salestatus.opened = true;
        };
        $scope.createopen = function ($event) {
            $scope.createstatus.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        MedicineAPI.getNextMedicineSymbol(function (response) {
            $scope.symbol = response.symbol;
        }, function (parameters) {
            $scope.errorMessage = parameters;
        });

        MedicineAPI.medicineDetalis($routeParams.medicineId,
            function(result) {
                $scope.dataLoading = false;
            }, function(result) {
                $scope.dataLoading = false;
                $scope.errorMessage = 'Wystąpił bład podczas ładowania szczegółów faktury';
            });

        $scope.checkIsUniqueSymbol = function (symbol) {
            MedicineAPI.checkIsMedicineSymbolUnique(symbol,
                function (parameters) {

                }, function (parameters) {

                });
        };

        $scope.OnTreatmentChange = function (element) {
            $scope.name = element;
            if (undefined != $scope.name.originalObject) {
                $scope.price = $scope.name.originalObject.defaultPrice;
            }
        };

        $scope.AddItem = function () {
            var netprice = $scope.rebate != undefined || $scope.rebate != null ? (100 - $scope.rebate) / 100 * $scope.price : $scope.price;
            var grossprice = $scope.taxrate == 0 || $scope.taxrate == null || $scope.taxrate == undefined ? netprice : netprice * $scope.taxrate / 100;
            var obj = {
                treatmentId: $scope.name.originalObject.id,
                name: $scope.name.originalObject.name,
                quantity: $scope.quantity,
                taxrate: $scope.taxrate,
                units: $scope.unit,
                rebate: $scope.rebate,
                netpricebeforerebate: $scope.price,
                netprice: netprice,
                grossprice: grossprice,
                total: grossprice * $scope.quantity
            };
            $scope.totalPrice = $scope.totalPrice + netprice * $scope.quantity;
            $log.debug(obj);
            $scope.itemName.push(obj);
            $scope.name = null;
            $scope.quantity = 1;
            $scope.rebate = 0;
            $scope.price = null;
            $scope.$broadcast('angucomplete-alt:clearInput', 'productName');
        };

        $scope.removeItem = function (index) {
            $scope.totalPrice = $scope.totalPrice - $scope.itemName[index].total;
            $scope.itemName.splice(index, 1);
        };

        $scope.back = function () {
            //when dirty ask for confirmation
            if ($scope.form.$dirty) {
                Interaction.ShowConfimation('Czy chcesz opuścić forumlarz bez zapisywania zmian?', 'Tak', 'Nie',
                    function () {
                        LocationService.medicineList();
                    },
                    function () {
                        // do nothing
                    });
            } else {
                LocationService.medicineList();
            }
        };

        $scope.Save = function () {
            $scope.dataLoading = true;
            var req = {
                symbol: $scope.symbol,
                CustomerName: $scope.clientname,
                taxnumber: $scope.taxnumber,
                CustomerAdress: $scope.adress,
                createdate: $scope.createDate,
                saleDate: $scope.saleDate,
                MedicineItems: $scope.itemName.map(function (t) {
                    return {
                        name: t.name,
                        price: t.grossprice,

                    };
                })
            };
            console.log(req);
            MedicineAPI.AddMedicine(req, function () {
                LocationService.medicineList();
                $scope.dataLoading = false;
            }, function () {
                $scope.dataLoading = false;
                $scope.errorMessage = 'Wysąpił błąd podczas dodawania nowej faktury';
            });
        };

    }]);