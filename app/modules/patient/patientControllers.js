(function () {
    'use strict';

    /*global angular */
    angular.module('Patient', ['ngDialog', 'ui.bootstrap', 'ngTouch', 'angucomplete-alt', 'angularFileUpload', 'Common', 'agGrid'])
         .factory('AttachmentAPI', ['$http', 'ApiAdress', function ($http, ApiAdress) {
            return {
                getPatientAttachmentList: function (patientId) {
                    return $http.get(ApiAdress + '/attachment/patient/' + patientId);
                },
                downloadAttachment: function (attachmentId) {
                    return $http.get(ApiAdress + '/attachment/' + attachmentId + '/preview');
                }
            };
        }])
        .controller('AddPatientController', ['$scope', '$location', '$http', 'ngDialog', '$rootScope', 'OnPeselChanged', 'Interaction', 'PatientAPI', 'LocationService', function ($scope, $location, $http, ngDialog, $rootScope, OnPeselChanged, Interaction, PatientAPI, LocationService) {
            $scope.error = null;
            $scope.surveyQuestionLoading = true;
            $scope.isEdit = false;
            $scope.validationError = false;
            $scope.$broadcast('angucomplete-alt:changeInput', 'country', 'POLSKA');
            $scope.$broadcast('angucomplete-alt:changeInput', 'city', 'WĄGROWIEC');
            $scope.$broadcast('angucomplete-alt:changeInput', 'postal', '62-100');
            
            $scope.cityPostalLoading = true;
            $scope.countryLoading = true;
            PatientAPI.getCountryAdress().success(function (data) {
                $scope.countryList = data;
                $scope.countryLoading = false;
            }).error(function () {
                $scope.countryLoading = false;
            });
            
            PatientAPI.getCityPostal().success(function (data) {
                $scope.cityPostal = data;
                $scope.cityPostalLoading = false;
            }).error(function () {
                $scope.cityPostalLoading = true;
            });
                
            $scope.peselChange = function () {
                OnPeselChanged($scope);
            };

            $scope.OnCountryChange = function (item) {
                if (undefined !== item && undefined !== item.originalObject) {
                    if (undefined !== item.originalObject.name) {
                        $scope.country = item.originalObject.name;
                    } else {
                        $scope.country = item.originalObject;
                    }
                }
            };
            
            $scope.OnCityChange = function (item) {
                if (undefined !== item && undefined !== item.originalObject) {
                    if (undefined !== item.originalObject.city) {
                        $scope.city = item.originalObject.city;
                        $scope.$broadcast('angucomplete-alt:changeInput', 'postal', item.originalObject.postal);
                        $scope.postal = item.originalObject.postal;
                    } else {
                        $scope.city = item.originalObject;
                    }
                }
            };
            
            $scope.OnPostalChange = function (item) {
                if (undefined !== item && undefined !== item.originalObject) {
                    if (undefined !== item.originalObject.postal) {
                        $scope.city = item.originalObject.city;
                        $scope.$broadcast('angucomplete-alt:changeInput', 'city', item.originalObject.city);
                        $scope.postal = item.originalObject.postal;
                    } else {
                        $scope.postal = item.originalObject;
                    }
                }
            };


        // on save action
            $scope.Add = function () {
                $scope.validationError = false;

                if ($scope.form.$invalid) {
                    $scope.validationError = true;

                    return;
                }
                $scope.dataLoading = true;

                PatientAPI.addPatient({
                    person: {
                        lastname: $scope.lastname,
                        firstname: $scope.firstname,
                        pesel: $scope.PESEL,
                        adress: $scope.adress,
                        city: $scope.city,
                        postal: $scope.postal,
                        phonenumbers: $scope.phone,
                        email: $scope.email,
                        country: $scope.country,
                        taxnumber: $scope.taxnumber
                    }
                }).success(function (data, status, headers, config) {
                    $location.path('/patient/' + data.patientId + '/newsurvey/h');
                }).error(function (data, status, headers, config) {
                    $scope.error = 'Wystapil blad podczas dodawania pacjenta.';
                    $scope.dataLoading = false;
                });
            };

            $scope.back = function () {
                if ($scope.form.$dirty) {
                    Interaction.ShowConfimation('Czy na pewno chcesz zakończyć bez zapisywania zmian?', 'Tak', 'Nie', function () {
                        LocationService.home();
                    }, function () {
                    });
                } else {
                    LocationService.home();
                }
            };
        }])
        .controller('PatientEditController', ['$scope', '$location', '$http', 'ngDialog', '$routeParams', 'OnPeselChanged', 'ApiAdress', 'Interaction', 'PatientAPI', 'LocationService', function ($scope, $location, $http, ngDialog, $routeParams, OnPeselChanged, ApiAdress, Interaction, PatientAPI, LocationService) {
            $scope.error = null;
            $scope.isEdit = true;
            $scope.validationError = false;
            $scope.country = 'POLSKA';
            $scope.dataLoading = true;
                
            $scope.cityPostalLoading = true;
            $scope.countryLoading = true;
            PatientAPI.getCountryAdress().success(function (data) {
                $scope.countryList = data;
                $scope.countryLoading = false;
            }).error(function () {
                $scope.countryLoading = false;
            });
            
            PatientAPI.getCityPostal().success(function (data) {
                $scope.cityPostal = data;
                $scope.cityPostalLoading = false;
            }).error(function () {
                $scope.cityPostalLoading = true;
            });
            
            $scope.$watch('PESEL', function (newVal, oldVal) {
                if (undefined !== $scope.PESEL) {
                    OnPeselChanged($scope);
                }
            });

            $scope.OnCountryChange = function (item) {
                if (undefined !== item && undefined !== item.originalObject) {
                    if (undefined !== item.originalObject.name) {
                        $scope.country = item.originalObject.name;
                    } else {
                        $scope.country = item.originalObject;
                    }
                }
            };
            
            $scope.OnCityChange = function (item) {
                if (undefined !== item && undefined !== item.originalObject) {
                    if (undefined !== item.originalObject.city) {
                        $scope.city = item.originalObject.city;
                        $scope.$broadcast('angucomplete-alt:changeInput', 'postal', item.originalObject.postal);
                        $scope.postal = item.originalObject.postal;
                    } else {
                        $scope.city = item.originalObject;
                    }
                }
            };
            
            $scope.OnPostalChange = function (item) {
                if (undefined !== item && undefined !== item.originalObject) {
                    if (undefined !== item.originalObject.postal) {
                        $scope.city = item.originalObject.city;
                        $scope.$broadcast('angucomplete-alt:changeInput', 'city', item.originalObject.city);
                        $scope.postal = item.originalObject.postal;
                    } else {
                        $scope.postal = item.originalObject;
                    }
                }
            };


            PatientAPI.patientDetails($routeParams.patientId).success(function (data, status, headers, config) {
                $scope.$broadcast('angucomplete-alt:changeInput', 'country', data.country);
                $scope.$broadcast('angucomplete-alt:changeInput', 'city', data.city);
                $scope.$broadcast('angucomplete-alt:changeInput', 'postal', data.postal);
                $scope.personId = data.personId;
                $scope.lastname = data.lastname;
                $scope.firstname = data.firstname;
                $scope.PESEL = data.pesel.toString();
                $scope.adress = data.adress;
                $scope.city = data.city;
                $scope.postal = data.postal;
                $scope.phone = data.phone;
                $scope.email = data.email;
                $scope.country = data.country;
                $scope.dataLoading = false;
            }).error(function (data, status, headers, config) {
                $scope.error = 'Wystąpił błąd ładowania danych pacjenta.';
                $scope.dataLoading = false;
            });

            // on save action
            $scope.Add = function () {
                $scope.validationError = false;

                if (form.$invalid) {
                    $scope.validationError = true;

                    return;
                }
                $scope.dataLoading = true;

                $http.post(ApiAdress + '/patient/' + $routeParams.patientId + '/update', {
                    person: {
                        personId: $scope.personId,
                        lastname: $scope.lastname,
                        firstname: $scope.firstname,
                        pesel: $scope.PESEL,
                        adress: $scope.adress,
                        city: $scope.city,
                        postal: $scope.postal,
                        phonenumbers: $scope.phone,
                        email: $scope.email,
                        country: $scope.country,
                        taxnumber: $scope.taxnumber
                    }
                }).success(function (data, status, headers, config) {
                    if ('h' === $routeParams.invokeView || '' === $routeParams.invokeView || null === $routeParams.invokeView) {
                        LocationService.home();
                    } else {
                        $location.path('/patient/' + $routeParams.patientId + '/visit');

                    }
                }).error(function (data, status, headers, config) {
                    $scope.error = 'Wystapil blad podczas dodawania pacjenta.';
                    $scope.dataLoading = false;
                });
            };

            $scope.back = function () {
                if ($scope.form.$dirty) {
                    Interaction.ShowConfimation('Czy na pewno chcesz zakończyć bez zapisywania zmian?', 'Tak', 'Nie', function () {
                        if ('h' === $routeParams.invokeView || '' === $routeParams.invokeView || null === $routeParams.invokeView) {
                            LocationService.home();
                        } else {
                            $location.path('/patient/' + $routeParams.patientId + '/visit');

                        }
                    }, function () {
                    });
                } else {
                    if ('h' === $routeParams.invokeView || '' === $routeParams.invokeView || null === $routeParams.invokeView) {
                        LocationService.home();
                    } else {
                        $location.path('/patient/' + $routeParams.patientId + '/visit');
                    }
                }

            };
        }])
        .controller('VisitHistoryController', ['$scope', '$routeParams', '$http', 'ApiAdress', 'PayerList', function ($scope, $routeParams, $http, ApiAdress, PayerList) {
            
            var self = this;
            self.visitHistoryLoading = true;
            self.currentVisit = null;
            self.isReadonly = true;

            self.transformPayer = function (id) {
                if (id === undefined) {
                    return;
                }
                var payer = PayerList.filter(function (v) {
                    return v.id === id;
                })[0];
                if (payer) {
                    return payer.name;
                } else {
                    return '-';
                }
            };

            $http.get(ApiAdress + '/visit/' + $scope.patientId + '/patient').success(function (data, status, headers, config) {
                self.visitHistoryLoading = false;
                self.visits = data;
                if (undefined !== data[0]) {
                    self.currentVisit = data[0];
                    self.state = self.currentVisit.teethGraph;
                }
            }).error(function (data, status, headers, config) {
                self.error = 'Wystapil blad podczas pobierania historii wizyt' + data;
                self.visitHistoryLoading = false;
            });

            self.selectVisit = function (index) {
                self.currentVisit = self.visits[index];
                self.state = self.currentVisit.teethGraph;
            };
        }])
        .controller('NewSurveyController', ['$scope', '$routeParams', '$http', '$location', 'ApiAdress', 'Interaction', function ($scope, $routeParams, $http, $location, ApiAdress, Interaction) {
            $scope.patientLoading = true;
            $scope.surveyLoading = true;

            $http.get(ApiAdress + '/patient/' + $routeParams.patientId + '/details')
                .success(function (data, status, headers, config) {
                    $scope.patient = data;
                    $scope.patientLoading = false;
                }).error(function (data, status, headers, config) {
                    $scope.error = 'Wystapil blad podczas pobierania danych pacjenta';
                    $scope.patientLoading = false;
                });

            $scope.changeSelectedSurvey = function () {
                $scope.surveyLoading = true;
                $http.get(ApiAdress + '/survey/' + $scope.currentSurveyId + '/detail')
                       .success(function (data, status, headers, config) {
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
                    }).error(function (data, status, headers, config) {
                        $scope.error = 'Wystapil blad podczas pobierania danych ankiety';
                        $scope.surveyLoading = false;
                    });
            };

            $http.get(ApiAdress + '/survey/all')
                .success(function (data, status, headers, config) {
                    $scope.surveyList = data;
                    $scope.surveyLoading = false;
                    if ($scope.surveyList === 0) {
                        return;
                    }
                    $scope.currentSurveyId = $scope.surveyList[0].surveyid;
                    $scope.changeSelectedSurvey();

                }).error(function (data, status, headers, config) {
                    $scope.error = 'Wystapil blad podczas pobierania listy ankiet';
                });



            $scope.save = function () {
                $http.post(ApiAdress + '/survey/' + $routeParams.patientId + '/save/response', $scope.responses)
                    .success(function () {
                        if (null === $routeParams.invokView || '' === $routeParams.invokeView || 'h' === $routeParams.invokeView) {
                            $location.path('/');
                        } else {
                            //TODO
                            $location.path('/');
                        }
                    }).error(function () {
                        $scope.error = 'Wystapil blad podczas pobierania listy ankiet';
                    });
            };

            $scope.cancel = function () {
                Interaction.ShowConfimation('Czy na pewno chcesz zakończyć bez zapisywania zmian?', 'Tak', 'Nie', function () {
                    $location.path('/');
                }, function () {
                });
            };

        }])
        .controller('VisitResponseSurveyController', ['$scope', '$routeParams', '$http', '$location', 'ApiAdress', function ($scope, $routeParams, $http, $location, ApiAdress) {
            $scope.patientId = $routeParams.patientId;
            $scope.dataLoading = true;

            $scope.createSurvey = function () {
                $location.path('/patient/' + $scope.patientId + '/newsurvey');
            };

            $http.get(ApiAdress + '/survey/' + $routeParams.patientId + '/responses').success(function (data) {
                $scope.responsecollection = data.forEach(function (item) {
                    if (item.response === null || item.response === undefined || item.response === '') {
                        item.response = '-';
                    }
                });
                $scope.dataLoading = false;
            }).error(function () {
                $scope.error = 'Wystąpiłpil błąd ładowania odpowiedzi pacjenta';
                $scope.dataLoading = false;
            });


        }])
        .controller('PatientVisitController', ['$scope',
                                            '$routeParams',
                                            '$http',
                                            '$location',
                                            '$rootScope',
                                            'Interaction',
                                            'DiagnoseTemplateAPI',
                                            'TreatmentProductAPI',
                                            'TreatmentAPI', 'ApiAdress',
                                            function ($scope, $routeParams,
                                                        $http, $location,
                                                        $rootScope, Interaction,
                                                        DiagnoseTemplateAPI, TreatmentProductAPI, TreatmentAPI, ApiAdress) {
                
                $scope.dataLoading = true;
                $scope.visitHistoryLoading = true;
                $scope.surveyResponsesLoading = true;
                $scope.visitRecords = [];
                $scope.patientId = $routeParams.patientId;
                $scope.currentVisit = null;
                $scope.dirty = false;
                $scope.createSurvey = function () {
                    $location.path('/patient/' + $scope.patientId + '/newsurvey/v');
                };
                //TODO 
                $scope.back = function () {
                    /*if ($scope.vm.diagnoses.length > 0) {*/
                    Interaction.ShowConfimation('Czy na pewno chcesz zakończyć bez zapisywania zmian?', 'Tak', 'Nie', function () {
                        $location.path('/');
                    }, function () {
                    });
                                                   /* } else {
                                                        $location.path('/');
                                                    }*/
                };

                $http.get(ApiAdress + '/survey/' + $routeParams.patientId + '/responses').success(function (data, status, headers, config) {
                    $scope.responsecollection = data;
                    $scope.surveyResponsesLoading = false;
                }).error(function (data, status, headers, config) {
                    $scope.error = 'Wystapil blad ladowaniadanych odpowiedzi pacjenta';
                    $scope.surveyResponsesLoading = false;
                });

                $http.get(ApiAdress + '/visit/' + $routeParams.patientId + '/patient').success(function (data, status, headers, config) {
                    $scope.visits = data;
                    $scope.currentVisit = data[0];
                    $scope.visitHistoryLoading = false;
                }).error(function (data, status, headers, config) {
                    $scope.error = 'Wystapil blad podczas pobierania listy wizyt pacjenta';
                    $scope.visitHistoryLoading = false;
                });

                $scope.selectVisit = function (index) {
                    $scope.currentVisit = $scope.visits[index];
                };

                $scope.editPatient = function (patientId) {
                    $location.path('/patient/' + patientId + '/edit/v');
                };

                $http.get(ApiAdress + '/patient/' + $routeParams.patientId + '/details').success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    $scope.patient = data;
                    $scope.dataLoading = false;
                }).error(function (data, status, headers, config) {
                    $scope.error = 'Wystapil blad ladowaniadanych pacjenta';
                    $scope.dataLoading = false;
                });

            }]);
}());