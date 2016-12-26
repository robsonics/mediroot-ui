'use strict';

angular.module('Patient', ['ngDialog', 'ui.bootstrap', 'ngTouch', 'angucomplete-alt', 'angularFileUpload','Common'])
.controller('AddPatientController', ['$scope', '$location', '$http', 'ngDialog', '$rootScope', 'OnPeselChanged', 'ApiAdress', function ($scope, $location, $http, ngDialog, $rootScope, OnPeselChanged, ApiAdress) {
    $scope.error = null;
    $scope.surveyQuestionLoading = true;
    $scope.isEdit = false;
    $scope.validationError = false;
    $scope.country = 'POLSKA';

    $scope.peselChange = function () {
        OnPeselChanged($scope);
    };

    $scope.OnCountryChange = function (item) {
        if (undefined != item && undefined != item.originalObject) {
            $scope.country = $scope.newtreatment.originalObject.name;
        };
    };


    // on save action
    $scope.Add = function () {
        $scope.validationError = false;

        if ($scope.form.$invalid) {
            $scope.validationError = true;

            return;
        }
        $scope.dataLoading = true;

        $http.post(ApiAdress + '/patient/add', {
            person: {
                lastname: $scope.lastname,
                firstname: $scope.firstname,
                pesel: $scope.PESEL,
                adress: $scope.adress,
                city: $scope.city,
                postal: $scope.postal,
                phonenumber: [$scope.phone],
                email: $scope.email,
                country: $scope.country,
                taxnumber: $scope.taxnumber
            }
        }).success(function (data, status, headers, config) {
            $location.path('/patient/' + data.patientId + '/newsurvey/h');
            console.log('saved successful');
        }).error(function (data, status, headers, config) {
            $scope.error = 'Wystapil blad podczas dodawania pacjenta.';
            $scope.dataLoading = false;
        });
    };

    $scope.back = function () {
        if ($scope.form.$dirty) {
            ngDialog.openConfirm({
                template: '\
                <p>Czy na pewno zakończyć edycję bez zapisywania ? </p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Nie</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Tak</button>\
                </div>',
                plain: true
            }).then(
                function (value) {
                    $location.path('/');
                },
                function (value) {
                    //Cancel or do nothing
                }
            );
        } else {
            $location.path('/');
        }
    };
}])
.controller('PatientEditController', ['$scope', '$location', '$http', 'ngDialog', '$routeParams', 'OnPeselChanged', 'ApiAdress', function ($scope, $location, $http, ngDialog, $routeParams, OnPeselChanged, ApiAdress) {
    $scope.error = null;
    $scope.isEdit = true;
    $scope.validationError = false;
    $scope.country = 'POLSKA';
    $scope.dataLoading = true;

    $scope.$watch('PESEL', function (newVal, oldVal) {
        if (undefined != $scope.PESEL) {
            OnPeselChanged($scope);
        }
    });

    $scope.OnCountryChange = function (item) {
        if (undefined != item && undefined != item.originalObject) {
            $scope.country = $scope.newtreatment.originalObject.name;
        };
    };

    $http.get(ApiAdress + '/patient/' + $routeParams.patientId + '/details').success(function (data, status, headers, config) {
        // this callback will be called asynchronously
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
        $scope.error = 'Wystapil blad ladowaniadanych pacjenta';
        $scope.false = false;
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
                lastname: $scope.lastname,
                firstname: $scope.firstname,
                pesel: $scope.PESEL,
                adress: $scope.adress,
                city: $scope.city,
                postal: $scope.postal,
                phonenumber: $scope.phone,
                email: $scope.email,
                country: $scope.country,
                taxnumber: $scope.taxnumber
            }
        }).success(function (data, status, headers, config) {
            if ('h' == $routeParams.invokeView || '' == $routeParams.invokeView || null == $routeParams.invokeView) {
                $location.path('/');
            } else {
                $location.path('/patient/' + $routeParams.patientId + '/visit');

            }

            console.log('saved successful');
        }).error(function (data, status, headers, config) {
            $scope.error = 'Wystapil blad podczas dodawania pacjenta.';
            $scope.dataLoading = false;
        });
    };

    $scope.back = function () {
        if ($scope.form.$dirty) {
            ngDialog.openConfirm({
                template: '\
                <p>Czy na pewno zakończyć edycję bez zapisywania ? </p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Nie</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Tak</button>\
                </div>',
                plain: true
            }).then(
        function (value) {
            if ('h' == $routeParams.invokeView || '' == $routeParams.invokeView || null == $routeParams.invokeView) {
                $location.path('/');
            } else {
                $location.path('/patient/' + $routeParams.patientId + '/visit');

            }
        },
        function (value) {
            //Cancel or do nothing
        });
        } else {
            if ('h' == $routeParams.invokeView || '' == $routeParams.invokeView || null == $routeParams.invokeView) {
                $location.path('/');
            } else {
                $location.path('/patient/' + $routeParams.patientId + '/visit');

            }
        }

    };
}])
.controller('VisitHistoryController', ['$scope', '$routeParams', '$http', 'ApiAdress', function ($scope, $routeParams, $http, ApiAdress) {
    console.log($routeParams);
    $scope.visitHistoryLoading = true;
    $scope.currentVisit = null;
    $scope.isReadonly = true;
    $http.get(ApiAdress + '/visit/' + $scope.patientId + '/patient').success(function (data, status, headers, config) {
        $scope.visitHistoryLoading = false;
        $scope.visits = data;
        if (undefined != data[0]) {
            $scope.currentVisit = data[0];
            $scope.state = $scope.currentVisit.teethGraph;
        }
    }).error(function (data, status, headers, config) {
        $scope.error = 'Wystapil blad podczas pobierania historii wizyt' + data;
        $scope.visitHistoryLoading = false;
    });

    $scope.selectVisit = function (index) {
        $scope.currentVisit = $scope.visits[index];
        $scope.state = $scope.currentVisit.teethGraph;
    };
}])
.controller('NewSurveyController', ['$scope', '$routeParams', '$http', '$location', 'ApiAdress', function ($scope, $routeParams, $http, $location, ApiAdress) {
    console.log($routeParams);
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
                           });
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
            if ($scope.surveyList == 0) {
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
            if (null == $routeParams.invokView || '' == $routeParams.invokeView || 'h' == $routeParams.invokeView) {
                $location.path('/');
            } else {
                $location.path('/patient/' + $scope.driversList[index].patientid + '/visit');
            }
        }).error(function () {
            $scope.error = 'Wystapil blad podczas pobierania listy ankiet';
        });
    };

    $scope.cancel = function () {
        ngDialog.openConfirm({
            template: '\
                <p>Czy na pewno zakończyć edycję bez zapisywania ? </p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Nie</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Tak</button>\
                </div>',
            plain: true
        }).then(
     function (value) {
         $location.path('/');
     },
     function (value) {
         //Cancel or do nothing
     });
    };

}])
.controller('VisitResponseSurveyController', ['$scope', '$routeParams', '$http', '$location', 'ApiAdress', function ($scope, $routeParams, $http, $location, ApiAdress) {
    $scope.patientId = $routeParams.patientId;
    $scope.dataLoading = true;

    $scope.createSurvey = function () {
        $location.path('/patient/' + $scope.patientId + '/newsurvey');
    };

    $http.get(ApiAdress + '/survey/' + $routeParams.patientId + '/responses').success(function (data, status, headers, config) {
        $scope.responsecollection = data;
        $scope.dataLoading = false;
    }).error(function (data, status, headers, config) {
        $scope.error = 'Wystąpiłpil błąd ładowania odpowiedzi pacjenta';
        $scope.false = false;
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
                                        'TreatmentAPI','ApiAdress',
                                        function ($scope, $routeParams,
                                                    $http, $location,
                                                    $rootScope, Interaction,
                                                    DiagnoseTemplateAPI, TreatmentProductAPI, TreatmentAPI, ApiAdress) {
                                            console.log($routeParams);
                                            $scope.dataLoading = true;
                                            $scope.visitHistoryLoading = true;
                                            $scope.surveyResponsesLoading = true;
                                            $scope.visitRecords = [];
                                            $scope.patientId = $routeParams.patientId;
                                            $scope.newdiagnoze = '';
                                            $scope.currentVisit = null;

                                            $scope.createSurvey = function () {
                                                $location.path('/patient/' + $scope.patientId + '/newsurvey/v');
                                            };

                                            $scope.back = function () {
                                                if ($scope.visitRecords.length > 0) {
                                                    Interaction.ShowConfimation('Czy na pewno chcesz zakończyć bez zapisywania zmian?', 'Tak', 'Nie', function () {
                                                        $location.path('/');
                                                    }, function () {
                                                    });
                                                } else {
                                                    $location.path('/');
                                                }
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
                                                $scope.false = false;
                                            });

                                        }])
.controller('CreateNewVisitController', ['$scope',
                                            '$routeParams',
                                            '$http',
                                            '$location',
                                            '$rootScope',
                                            'ToothElement',
                                            'FileUploader',
                                            'DiagnoseTemplateAPI',
                                            'TreatmentProductAPI',
                                            'TreatmentAPI', 'DateFormatter','PayerList','ApiAdress',
                                            function ($scope, $routeParams,
                                                        $http, $location,
                                                        $rootScope, ToothElement,
                                                        FileUploader, DiagnoseTemplateAPI,
                                                        TreatmentProductAPI, TreatmentAPI, DateFormatter, PayerList, ApiAdress) {
                                                var self = this;
                                                self.vm = {
                                                    diagnoses: [{
                                                        treatments: [],
                                                        treatmentProducts: [],
                                                    }],
                                                    visitDate: new Date(),
                                                    visitStartTime: new Date(),
                                                    visitPayer: 0,
                                                    patientId: $routeParams.patientId,
                                                    doctorId: $rootScope.globals.currentUser.doctorid,
                                                    comment: null,
                                                    totalPrice: 0,
                                                };
                                                self.dataLoading = false;
                                                self.error = null;

                                                $scope.newdiagnoze = '';
                                                self.state = [];
                                                self.visitRecords = [];

                                                $scope.newtreatment = '';

                                                self.Template = {
                                                    diagnoseTemplate: [],
                                                    treatments: [],
                                                    treatmentProducts: [],
                                                    elements: ToothElement,
                                                };

                                                self.payerList = PayerList;

                                                self.status = {
                                                    opened: false
                                                };

                                                self.dateOptions = {
                                                    formatYear: 'yyyy',
                                                    startingDay: 1
                                                };

                                                self.open = function ($event) {
                                                    self.status.opened = true;
                                                };

                                                self.Actions = {
                                                    RemoveDiagnose: function (index) {
                                                        console.log('remove diagnose');

                                                        self.vm.diagnoses.splice(index, 1);
                                                    },
                                                    AddDiagnose: function () {
                                                        console.log('add new diagnose');
                                                        self.vm.diagnoses.push({ treatments: [], treatmentProducts: [] });
                                                    },
                                                    AddTreatment: function (diagnoseIndex) {
                                                        console.log('add new treatment');
                                                        if (self.vm.diagnoses[diagnoseIndex].treatments) {
                                                            self.vm.diagnoses[diagnoseIndex].treatments.push({});
                                                        } else {
                                                            self.vm.diagnoses[diagnoseIndex].treatments = [{}];
                                                        }

                                                    },
                                                    RemoveTreatment: function (diagnoseIndex, treatmentIndex) {
                                                        console.log('remove treatment');
                                                        self.vm.diagnoses[diagnoseIndex].treatments.splice(treatmentIndex, 1);
                                                    },
                                                    AddTreatmentProduct: function (diagnoseIndex) {
                                                        console.log('add new treatment');
                                                        if (self.vm.diagnoses[diagnoseIndex].treatmentProducts) {
                                                            self.vm.diagnoses[diagnoseIndex].treatmentProducts.push({});
                                                        } else {
                                                            self.vm.diagnoses[diagnoseIndex].treatmentProducts = [{}];
                                                        }
                                                    },
                                                    RemoveTreatmentProduct: function (diagnoseIndex, treatmentIndex) {
                                                        console.log('remove treatment');
                                                        self.vm.diagnoses[diagnoseIndex].treatmentProducts.splice(treatmentIndex, 1);
                                                    },
                                                };

                                                self.OnSelectedElement = function (selected) {
                                                    if (selected) {
                                                        if (selected.originalObject) {
                                                            console.log(selected.originalObject);
                                                            var id = this.id.substring(12, this.id.length);
                                                            self.vm.diagnoses[id].element = selected.originalObject;
                                                        }
                                                    } else {

                                                    }
                                                };

                                                self.OnDiagnoseTemplateChange = function (selected) {
                                                    if (selected) {
                                                        if (selected.originalObject) {
                                                            console.log(selected.originalObject);
                                                            var id = this.id.substring(13, this.id.length);
                                                            self.vm.diagnoses[id].description = selected.originalObject.diagnose;
                                                            self.vm.diagnoses[id].isElementRequired = selected.originalObject.isElementRequired;
                                                            self.vm.diagnoses[id].element = null;
                                                            var elementId = 'element-alt-' + id;
                                                            $scope.$broadcast('angucomplete-alt:changeInput', elementId, selected.originalObject.defaultElement);
                                                            self.vm.diagnoses[id].treatments = [];
                                                            self.vm.diagnoses[id].treatmentProducts = [];
                                                            for (var i = 0; i < selected.originalObject.treatments.length; i++) {
                                                                self.vm.diagnoses[id].treatments.push(selected.originalObject.treatments[i]);
                                                                //var elementId = 'treatment-' + id + '-' + i;
                                                                //$scope.$broadcast('angucomplete-alt:changeInput', elementId, selected.originalObject.treatments[i]);
                                                            }
                                                            for (var j = 0; j < selected.originalObject.treatmentProducts.length; j++) {
                                                                var treatmentProducts = selected.originalObject.treatmentProducts[j];
                                                                treatmentProducts.price = self.Template.treatmentProducts.find(function(element) {
                                                                    return element.id === treatmentProducts.treatmentProductId;
                                                                });
                                                                self.vm.diagnoses[id].treatmentProducts.push(treatmentProducts);
                                                            }
                                                        }
                                                    } else {

                                                    }
                                                };

                                                self.OnTreatmentProductChange = function (selected) {
                                                    if (selected) {
                                                        self.vm.diagnoses[$index].treatmentProducts.price = selected.originalObject.defaultPrice;
                                                        self.vm.totalPrice = 0;
                                                        for (var i = 0; i < self.vm.diagnoses.length; i++) {
                                                            for (var j = 0; j < self.vm.diagnoses[$index].treatmentProducts.length; j++) {
                                                                self.vm.totalPrice = self.vm.totalPrice + self.vm.diagnoses[$index].treatmentProducts.price;
                                                            }
                                                        }
                                                    } else {

                                                    }
                                                };


                                                TreatmentAPI.GetTreatmentList().success(function (data) {
                                                    self.Template.treatments = data;
                                                }).error(function () {
                                                    console.log('Wystąpił błąd podczas pobierania listy leczeń');
                                                });

                                                DiagnoseTemplateAPI.GetDiagnoseTemplate().success(function (data) {
                                                    self.Template.diagnoseTemplate = data;
                                                }).error(function () {
                                                    console.log('Cant get diagnose template list');
                                                });

                                                TreatmentProductAPI.GetTreatmentProductList().success(function (data) {
                                                    self.Template.treatmentProducts = data;
                                                }).error(function () {
                                                    console.log('cant load treatment product');
                                                });


                                                $scope.$parent.$watch('patient', function (newVal, oldVal) {
                                                    if (undefined == $scope.$parent || null == $scope.$parent ||
                                                        undefined == $scope.$parent.patient || null == $scope.$parent.patient ||
                                                        undefined == $scope.$parent.patient.teethGraph || null == $scope.$parent.patient.teethGraph) {
                                                        return;
                                                    }
                                                    self.state = $scope.$parent.patient.teethGraph;
                                                });

                                                $scope.attachemntId = [];

                                                var uploader = $scope.uploader = new FileUploader({
                                                    url: '/attachment/add/' + self.vm.patientId
                                                });

                                                // FILTERS

                                                uploader.filters.push({
                                                    name: 'customFilter',
                                                    fn: function (item /*{File|FileLikeObject}*/, options) {
                                                        return this.queue.length < 10;
                                                    }
                                                });

                                                uploader.onAfterAddingAll = function (addedFileItems) {
                                                    console.info('onAfterAddingAll', addedFileItems);
                                                    addedFileItems.forEach(function (file) {
                                                        file.upload();
                                                    });
                                                };

                                                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                                                    console.info('onCompleteItem', fileItem, response, status, headers);
                                                    if (undefined == response || undefined == response.attachemntId) {
                                                        return;
                                                    }
                                                    $scope.attachemntId.push(response.attachemntId);
                                                };
                                                
                                                self.save = function () {
                                                    self.dataLoading = true;
                                                    self.error = null;
                                                    var visitStartTime = new Date(self.vm.visitStartTime);
                                                    var visitDate = self.vm.visitDate;
                                                    var startDateTime = DateFormatter.format(visitDate.setHours(visitStartTime.getHours(), visitStartTime.getMinutes()));
                                                    $http.post(ApiAdress + '/visit/add',
                                                    {
                                                        patientId: self.vm.patientId,
                                                        doctorId: self.vm.doctorId,
                                                        visitPayer: self.vm.visitPayer,
                                                        diagnoses: self.vm.diagnoses.map(function (v) {
                                                            return {
                                                                treatmentProductId: (v.treatmentProducts) ? v.treatmentProducts.id : null,
                                                                treatments: v.treatments,
                                                                description: v.description,
                                                                tooth: (v.element) ? v.element.id : null,
                                                            };
                                                        }),
                                                        attachments: $scope.attachemntId.map(function (v) {
                                                            return {
                                                                attachmentId: v,
                                                                insertDate: new Date(),
                                                            };
                                                        }),
                                                        CalendarEvent: {
                                                            start: startDateTime,
                                                            end: new Date(),
                                                            IsRecurence: false,
                                                            RecurenceRule: {}
                                                        },
                                                        teethgraph: JSON.stringify(self.state),
                                                        comment: self.vm.comment,
                                                        totalprice: self.vm.totalPrice
                                                    }).success(function (data, status, headers, config) {
                                                        $location.path('/');
                                                        console.log('saved successful');
                                                    }).error(function (data, status, headers, config) {
                                                        self.error = 'Wystapil blad podczas zapisywania wizyty';
                                                        self.dataLoading = false;
                                                    });
                                                };

                                            }])
.controller('CommunicationController', ['$scope', '$routeParams', '$http', 'ApiAdress', function ($scope, $routeParams, $http, ApiAdress) {
    $scope.dataLoading = true;

    $scope.$parent.$watch('patient', function (newVal, oldVal) {
        if (undefined == $scope.$parent || null == $scope.$parent ||
            undefined == $scope.$parent.patient || null == $scope.$parent.patient) {
            return;
        }
        $scope.messageTypes = [];

        if ('' != $scope.$parent.patient.email && null != $scope.$parent.patient.email) {
            $scope.messageTypes.push({
                name: 'Email: ' + $scope.$parent.patient.email,
                id: 1
            });
        }
        if ('' != $scope.$parent.patient.phone && null != $scope.$parent.patient.phone) {
            $scope.messageTypes.push({
                name: 'Sms: ' + $scope.$parent.patient.phone,
                id: 2
            });
        }

        $scope.dataLoading = false;
        $scope.messageType = $scope.messageTypes[0];
        $scope.$apply();
    });



    $scope.Send = function () {
        $scope.dataLoading = true;
        $scope.error = null;
        $http.post(ApiAdress + '/message/send',
            {
                messageType: $scope.messageType.id,
                header: $scope.header,
                body: $scope.body,
                isAutoGenerated: false,
            }).success(function (data) {
                console.log('Send successfull' + data);
                $scope.header = null;
                $scope.body = null;
                $scope.dataLoading = false;
            }).error(function () {
                $scope.error = 'Wystąpił błąd podczas wysyłania wiadomości';
                $scope.dataLoading = false;
            });
    };
}])
.controller('PatientAttachmentController', ['$scope', '$routeParams', '$http', 'ApiAdress', function ($scope, $routeParams, $http, ApiAdress) {
    $scope.dataLoading = true;
    $scope.attachmentDownload = false;

    $http.get(ApiAdress + '/attachment/patient/' + $scope.patientId).success(function (data) {
        $scope.dataLoading = false;
        $scope.attachmentList = data;
    }).error(function () {
        $scope.dataLoading = false;
        $scope.error = 'Wystąpił błąd podczas pobierania listy załączników';
    });

    $scope.Download = function (id) {
        console.log('download Id' + id);
        if (null == id || '' == id) {
            return;
        }
        $scope.attachmentDownload = true;
        $scope.error = null;
        var filename = $scope.attachmentList.filter(function (item) {
            return item.id === id;
        })[0].name;
        $http.get(ApiAdress + '/attachment/' + id + '/preview').then(function (response) {
            $scope.attachmentDownload = false;
            var anchor = angular.element('<a/>');
            anchor.attr({
                href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                target: '_blank',
                download: filename
            })[0].click();

        }, function () {
            $scope.attachmentDownload = false;
            $scope.error = 'Wystąpił błąd podczas pobierania załącznika';
        });
    };
}])
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
            console.log(id);
            $location.path('/previewstatmentsignoff/' + id + '/' + $routeParams.patientId + '/e');
        };

        self.SignOff = function (id) {
            console.log(id);
            $location.path('/statmentsignoff/' + id + '/' + $routeParams.patientId + '/e');
        };

    }]);