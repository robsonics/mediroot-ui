'use strict';

angular.module('Survey', ['ngDialog', 'ui.bootstrap', 'ngTouch', 'angucomplete-alt'])
.controller('SurveyListController', ['$scope', '$rootScope', '$http', '$location', 'ngDialog', function ($scope, $rootScope, $http, $location, ngDialog) {
    $scope.username = $rootScope.globals.currentUser.username;
    $scope.dataLoading = true;

    $scope.removeSurvey = function ($index) {
        console.log('remove survey ' + $index);
        ngDialog.openConfirm({
            template: '\
                        <p>Czy na pewno chcesz usunąć ' + $scope.surveyList[$index].name + '? </p>\
                        <div class="ngdialog-buttons">\
                            <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Nie</button>\
                            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Tak</button>\
                        </div>',
            plain: true
        }).then(
        function (value) {
            $scope.dataLoading = true;
            $http.delete('/survey/' + $scope.surveyList[$index].surveyid + '/remove').success(function () {
                $scope.surveyList.splice($index, 1);
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

    $scope.createSurvey = function () {
        $location.path('/survey/create');
    };

    $http.get('/survey/all').success(function (data, status, headers, config) {
        $scope.surveyList = data;
        $scope.dataLoading = false;
    }).error(function (data, status, headers, config) {
        $scope.error = 'Wystapil blad podczas pobierania listy ankiet';
        $scope.dataLoading = false;

    });
}])
.controller('CreateSurveyController', ['$scope', '$rootScope', '$http', '$location', 'ngDialog', function ($scope, $rootScope, $http, $location, ngDialog) {
            $scope.username = $rootScope.globals.currentUser.username;

            $scope.questionTypes = [
                { id: 1, name: 'Tak/Nie' },
                { id: 2, name: 'Tekst' }];

            $scope.priorityTypes = [
                { id: 1, name: 'Wysoki' },
                { id: 2, name: 'Normalny' },
                { id: 3, name: 'Niski' }];

            $scope.queryList = [];

            $scope.addQuery = function () {
                if ('' == $scope.question) {
                    return;
                }
                $scope.queryList.push({
                    question: $scope.question,
                    type: $scope.questionType,
                    responses: $scope.responses,
                    priority: $scope.priority,
                    defaultresponse: $scope.defaultresponse
                });

                $scope.question = '';
                $scope.questionType = 1;
                $scope.responses = '';
                $scope.priority = 1;
                $scope.defaultresponse = '';
            };

            $scope.CreateSurvey = function () {
                console.log('CreateSurvey');
                $http.post('/survey/add', {
                    name: $scope.name,
                    surveyqueries: $scope.queryList,
                    systemuserid: $rootScope.globals.currentUser.systemuserid
                })
                    .success(function (data, status, headers, config) {
                        $location.path('/survey');
                        console.log('saved successful');
                    }).error(function (data, status, headers, config) {
                        $scope.error = 'Wystapil blad podczas dodawania ankiety.';
                    });
            };
        }]);
