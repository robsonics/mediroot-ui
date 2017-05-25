(function () {
    'use strict';

    /*global angular */
    angular.module('Statment', ['ngDialog', 'ui.bootstrap', 'ngTouch', 'angucomplete-alt', 'signature'])
        .controller('StatmentController', ['$scope', '$location', '$http', 'ngDialog', '$rootScope', '$routeParams', '$sce', 'ApiAdress', function ($scope, $location, $http, ngDialog, $rootScope, $routeParams, $sce, ApiAdress) {
            var self = this,
                statmentTemplateId = $routeParams.statmentTemplateId,
                patientId = $routeParams.patientId,
                surveyId = $routeParams.surveyId;
            
            $scope.loading = true;

            self.initialize = function () {
                $http.get(ApiAdress + '/statment/' + statmentTemplateId + '/' + patientId + '/' + surveyId).then(function (response) {
                    $scope.statment = $sce.trustAsHtml(response.data);
                    $scope.loading = false;
                }, function () {
                    $scope.errorMessage = 'Wystąpił błąd podczas pobierania oświadczeń.';
                    $scope.loading = false;
                });
            };


            if (!surveyId || surveyId === 'e') {
                $http.get(ApiAdress + '/statment/' + statmentTemplateId + '/details').then(function (response) {
                    if (response.data.surveyId !== null) {
                        //redirect to survey
                        $location.path('/statment/' + statmentTemplateId + '/' + patientId + '/' + response.data.surveyId + '/survey');
                    } else {
                        self.initialize();
                    }
                }, function () {
                    $scope.loading = false;
                    $scope.errorMessage = 'Wystapił błąd podczas pobierania informacji o oświadczeniu.';
                });
            } else {

                self.initialize();
            }


            $scope.post = function () {
                $scope.loading = true;
                $scope.errorMessage = null;
                $scope.signaturePad = this.accept();
                $http.post(ApiAdress + '/patientstatment/singoff', {
                    StatmentTemplateId: statmentTemplateId,
                    SignOffDate: new Date(),
                    SystemUserId: $rootScope.globals.currentUser.systemuserid,
                    Signature: $scope.signaturePad.dataUrl,
                    PatientId: patientId
                }).then(function () {
                    $scope.loading = false;
                    $location.path('/patient/' + patientId + '/visit');
                }, function () {
                    $scope.loading = false;
                    $scope.errorMessage = 'Wystąpił błąd podczas zapisywania oświadczenia.';
                });
            };
        }])
        .controller('PreviewStatmentController', ['$scope', '$location', '$http', 'ngDialog', '$rootScope', '$routeParams', '$sce', 'ApiAdress', function ($scope, $location, $http, ngDialog, $rootScope, $routeParams, $sce, ApiAdress) {
            var statmentTemplateId = $routeParams.statmentTemplateId,
                patientId = $routeParams.patientId,
                surveyId = $routeParams.surveyId;
            
            $scope.templateLoading = true;
            $scope.dataLoading = true;
            
            $http.get(ApiAdress + '/statment/' + statmentTemplateId + '/' + patientId + '/' + surveyId).then(function (response) {
                $scope.statment = $sce.trustAsHtml(response.data);
                $scope.templateLoading = false;
            }, function () {
                $scope.errorTemplateMessage = 'Wystąpił błąd podczas pobierania oświadczeń.';
                $scope.templateLoading = false;
            });

            $http.get(ApiAdress + '/patinetstatmet/' + statmentTemplateId + '/' + patientId + '/details').then(function (response) {
                $scope.dataLoading = false;
                $scope.data = response.data;
            }, function () {
                $scope.erroMessage = 'Wystąpił błąd podczas pobierania danych';
                $scope.dataLoading = false;
            });

            $scope.back = function () {
                $location.path('/patient/' + patientId + '/visit');
            };
            //
        }])
        .controller('SurveyStatmentController', ['$scope', '$location', '$http', 'ngDialog', '$rootScope', '$routeParams', '$sce', 'ApiAdress', function ($scope, $location, $http, ngDialog, $rootScope, $routeParams, $sce, ApiAdress) {
            var statmentTemplateId = $routeParams.statmentTemplateId,
                patientId = $routeParams.patientId,
                surveyId = $routeParams.surveyId;

            $scope.surveyLoading = true;
            $http.get(ApiAdress + '/survey/' + surveyId + '/detail')
                   .success(function (data) {
                    $scope.currentSurveyDetails = data;
                       // create respons table
                    $scope.responses = [];
                    $scope.currentSurveyDetails.questions.forEach(function (entry) {
                        $scope.responses.push(
                            {
                                surveyqueryid: entry.questionid,
                                response: entry.defaultresponse
                            }
                        );
                    });
                    $scope.surveyLoading = false;
                }).error(function () {
                    $scope.error = 'Wystapil blad podczas pobierania danych ankiety';
                    $scope.surveyLoading = false;
                });


            $scope.save = function () {
                $http.post(ApiAdress + '/survey/' + $routeParams.patientId + '/save/response', $scope.responses)
                    .success(function (data) {
                        $location.path('/statmentsignoff/' + statmentTemplateId + '/' + patientId + '/' + data.newEntityId);
                    }).error(function () {
                        $scope.error = 'Wystapil blad podczas zapisywania ankiety';
                    });
            };
        }]);
}());