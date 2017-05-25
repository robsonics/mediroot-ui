'use strict';

angular.module('Patient')
.factory('ToothElement', function () {
    return [
        { id: '00', name: 'Całość' },
        { id: '01', name: 'Żuchwa' },
        { id: '10', name: 'Szczęka' },
        { id: '18', name: 'Górna Lewa Ósemka' },
        { id: '17', name: 'Górna Lewa Siódemka' },
        { id: '16', name: 'Górna Lewa Szóstka' },
        { id: '15', name: 'Górna Lewa Piątka' },
        { id: '14', name: 'Górna Lewa Czwórka' },
        { id: '13', name: 'Górna Lewa Trójka' },
        { id: '12', name: 'Górna Lewa Dwójka' },
        { id: '11', name: 'Górna Lewa Jedynka' },
        { id: '21', name: 'Górna Prawa Jedynka' },
        { id: '22', name: 'Górna Prawa Dwójka' },
        { id: '23', name: 'Górna Prawa Trójka' },
        { id: '24', name: 'Górna Prawa Czwórka' },
        { id: '25', name: 'Górna Prawa Piątka' },
        { id: '26', name: 'Górna Prawa Szóstka' },
        { id: '27', name: 'Górna Prawa Siódemka' },
        { id: '28', name: 'Górna Prawa Ósemka' },
        { id: '38', name: 'Dolna Lewa Ósemka' },
        { id: '37', name: 'Dolna Lewa Siódemka' },
        { id: '36', name: 'Dolna Lewa Szóstka' },
        { id: '35', name: 'Dolna Lewa Piątka' },
        { id: '34', name: 'Dolna Lewa Czwórka' },
        { id: '33', name: 'Dolna Lewa Trójka' },
        { id: '32', name: 'Dolna Lewa Dwójka' },
        { id: '31', name: 'Dolna Lewa Jedynka' },
        { id: '41', name: 'Dolna Prawa Jedynka' },
        { id: '42', name: 'Dolna Prawa Dwójka' },
        { id: '43', name: 'Dolna Prawa Trója' },
        { id: '44', name: 'Dolna Prawa Czwórka' },
        { id: '45', name: 'Dolna Prawa Piątka' },
        { id: '46', name: 'Dolna Prawa Szóstka' },
        { id: '47', name: 'Dolna Prawa Siódemka' },
        { id: '48', name: 'Dolna Prawa Ósemka' }
    ];
})
.factory('OnPeselChanged', function () {
    return function ($scope) {
        var year = $scope.PESEL.substring(0, 2);
        var month = $scope.PESEL.substring(2, 4);
        var day = $scope.PESEL.substring(4, 6);
        if (month > 12) {
            $scope.birthdate = '20' + year + '-' + month + '-' + day;
        } else {
            $scope.birthdate = '19' + year + '-' + month + '-' + day;
        }
        if ($scope.PESEL.substring(9, 10) % 2 == 0) {
            $scope.sex = "Kobieta";
        } else {
            $scope.sex = "Mężczyzna";
        }
    };
})
.factory('Interaction', ['ngDialog', function (ngDialog) {
    var service = {};

    service.ShowConfimation = function (question, confirmResponse, negateResponse, successCallabck, negativeCallback) {
        ngDialog.openConfirm({
            template: '\
                        <p>' + question + ' </p>\
                        <div class="ngdialog-buttons">\
                            <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">' + negateResponse + '</button>\
                            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">' + confirmResponse + '</button>\
                        </div>',
            plain: true
        }).then(
            function (value) {
                successCallabck();
            },
            function (value) {
                negativeCallback();
            });

    };
    return service;
}])
.factory('CircularBuffer', ['$rootScope', function ($rootScope) {
    var service = {

    };
    service.SetSize = function (newSize) {
        this.size = newSize;
        $rootScope.buffer = [];
    };

    serivce.GetSize = function () {
        return this.size;
    };

    service.Add = function (item) {
        if ($rootScope.buffer.length == this.size) {
            $rootScope.buffer[$rootScope.buffer % this.size] = item;
        } else {
            $rootScope.buffer.push(item);
        }
    };

    return service;
}])
.factory('DiagnoseTemplateAPI', ['$http', 'ApiAdress', function ($http, ApiAdress) {
    return {
        GetDiagnoseTemplate: function () {
            return $http.get(ApiAdress + '/diagnose/template/list', { cache: true });
        }
    };
}])
.factory('TreatmentProductAPI', ['$http', 'ApiAdress', function ($http, ApiAdress) {
    return {
        GetTreatmentProductList: function () {
            return $http.get(ApiAdress + '/treatment/product/list', { cache: true });
        }
    };
}]).factory('TreatmentAPI', ['$http', 'ApiAdress', function ($http, ApiAdress) {
    return {        
      GetTreatmentList: function() {
          return $http.get(ApiAdress + '/treatment/list', { cache: true });
      }  
    };
}]);