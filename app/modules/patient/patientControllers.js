'use strict';

angular.module('Patient', ['ngDialog', 'ui.bootstrap', 'ngTouch', 'angucomplete-alt', 'angularFileUpload', 'Common'])
.controller('AddPatientController', ['$scope', '$location', 'BackendServices', 'ngDialog', '$rootScope', 'OnPeselChanged', function ($scope, $location, BackendServices, ngDialog, $rootScope, OnPeselChanged) {
    $scope.error = null;
    $scope.surveyQuestionLoading = true;
    $scope.isEdit = false;
    $scope.validationError = false;
    $scope.country = 'POLSKA';

    $scope.peselChange = function () {
        OnPeselChanged($scope);
    };

    $scope.OnCountryChange = function(item) {
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

        BackendServices.addPatient( {
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
.controller('PatientEditController', ['$scope', '$location', 'BackendServices', 'ngDialog', '$routeParams', 'OnPeselChanged', function ($scope, $location, BackendServices, ngDialog, $routeParams, OnPeselChanged) {
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

    BackendServices.getPatientDetails($routeParams.patientId).success(function (data, status, headers, config) {
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

        BackendServices.editPatient($routeParams.patientId, {
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
.controller('VisitHistoryController', ['$scope', '$routeParams', 'BackendServices', function ($scope, $routeParams, BackendServices) {
    console.log($routeParams);
    $scope.visitHistoryLoading = true;
    $scope.currentVisit = null;
    $scope.isReadonly = true;
    BackendServices.getVisitHistory($scope.patientId).success(function (data, status, headers, config) {
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
.controller('NewSurveyController', ['$scope', '$routeParams', 'BackendServices', '$location', function ($scope, $routeParams, BackendServices, $location) {
    console.log($routeParams);
    $scope.patientLoading = true;
    $scope.surveyLoading = true;

    BackendServices.getPatientDetails($routeParams.patientId)
        .success(function (data, status, headers, config) {
            $scope.patient = data;
            $scope.patientLoading = false;
        }).error(function (data, status, headers, config) {
            $scope.error = 'Wystapil blad podczas pobierania danych pacjenta';
            $scope.patientLoading = false;
        });

    $scope.changeSelectedSurvey = function () {
        $scope.surveyLoading = true;
        BackendServices.getSurveyDetails($scope.currentSurveyId)
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

    BackendServices.getAllSurvey()
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
        BackendServices.savePatientResponse( $routeParams.patientId , $scope.responses)
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
                <p>Czy na pewno zako�czy� edycj� bez zapisywania ? </p>\
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
.controller('VisitResponseSurveyController', ['$scope', '$routeParams', 'BackendServices', '$location', function ($scope, $routeParams, BackendServices, $location) {
    $scope.patientId = $routeParams.patientId;
    $scope.dataLoading = true;

    $scope.createSurvey = function () {
        $location.path('/patient/' + $scope.patientId + '/newsurvey');
    };

    BackendServices.getPatientResponse($routeParams.patientId).success(function (data, status, headers, config) {
        $scope.responsecollection = data;
        $scope.dataLoading = false;
    }).error(function (data, status, headers, config) {
        $scope.error = 'Wystąpiłpil błąd ładowania odpowiedzi pacjenta';
        $scope.false = false;
    });


}])
.controller('PatientVisitController', ['$scope', '$routeParams', 'BackendServices', '$location', '$rootScope', 'Interaction', function ($scope, $routeParams, BackendServices, $location, $rootScope, Interaction) {
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

    BackendServices.getPatientResponse($routeParams.patientId).success(function (data, status, headers, config) {
        $scope.responsecollection = data;
        $scope.surveyResponsesLoading = false;
    }).error(function (data, status, headers, config) {
        $scope.error = 'Wystapil blad ladowaniadanych odpowiedzi pacjenta';
        $scope.surveyResponsesLoading = false;
    });

    BackendServices.getVisitHistory($routeParams.patientId).success(function (data, status, headers, config) {
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

    BackendServices.getPatientDetails($routeParams.patientId).success(function (data, status, headers, config) {
        // this callback will be called asynchronously
        $scope.patient = data;
        $scope.dataLoading = false;
    }).error(function (data, status, headers, config) {
        $scope.error = 'Wystapil blad ladowaniadanych pacjenta';
        $scope.false = false;
    });

}])
.controller('CreateNewVisitController', ['$scope', '$routeParams', 'BackendServices', '$location', '$rootScope', 'ToothElement', 'FileUploader', function ($scope, $routeParams, BackendServices, $location, $rootScope, ToothElement, FileUploader) {
    $scope.newdiagnoze = '';
    $scope.state = [];
    $scope.totalPrice = 0;
    $scope.newtreatment = '';
    
    $scope.OnTreatmentChange = function (newItem) {
        $scope.newtreatment = newItem;
        if (undefined != $scope.newtreatment && undefined != $scope.newtreatment.originalObject) {
            $scope.newPrice = $scope.newtreatment.originalObject.defaultPrice;
        };
    };
    
    $scope.$parent.$watch('patient', function (newVal, oldVal) {
        if (undefined == $scope.$parent || null == $scope.$parent ||
            undefined == $scope.$parent.patient || null == $scope.$parent.patient ||
            undefined == $scope.$parent.patient.teethGraph || null == $scope.$parent.patient.teethGraph) {
            return;
        }
        $scope.state = $scope.$parent.patient.teethGraph;
    });

    $scope.visitRecords = [];
    $scope.attachemntId = [];

    $scope.element = ToothElement;

    var uploader = $scope.uploader = new FileUploader({
        url: '/attachment/add/' + $scope.patientId
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

    $scope.addNewDiagnoze = function () {
        if (null == $scope.newtreatment || '' == $scope.newtreatment) {
            return;
        }
        var newObject = {
            description: $scope.newdiagnoze,
            treatmentProduct: $scope.newtreatment.originalObject,
            tooth: $scope.selectedTooth == '' || $scope.selectedTooth == null ? '' : $scope.selectedTooth.originalObject,
            price: $scope.newPrice
        };
        $scope.visitRecords.push(newObject);
        $scope.newdiagnoze = null;

        $scope.$broadcast('angucomplete-alt:clearInput', 'treatment');
        $scope.$broadcast('angucomplete-alt:clearInput', 'tooth');

        //refresh
        $scope.totalPrice = $scope.totalPrice + $scope.newPrice;
        $scope.newPrice = null;

    };

    $scope.removeVisitItem = function (index) {
        $scope.totalPrice = $scope.totalPrice - $scope.visitRecords[index].price;
        $scope.visitRecords.splice(index, 1);
    };



    $scope.save = function () {
        $scope.dataLoading = true;
        $scope.error = null;
        BackendServices.addVisit(
        {
            patientId: $routeParams.patientId,
            doctorId: $rootScope.globals.currentUser.doctorid,
            diagnoses: $scope.visitRecords.map(function (v) {
                return {
                    treatmentProductId: v.treatmentProduct.id,
                    description: v.description,
                    tooth: v.tooth.id
                };
            }),
            attachments: $scope.attachemntId.map(function (v) {
                return {
                    attachmentId: v,
                    insertDate: new Date(),
                };
            }),
            CalendarEvent: {
                start:new Date(),
            },
            teethgraph: JSON.stringify($scope.state),
            comment: $scope.comment,
            totalprice: $scope.totalPrice
        }).success(function (data, status, headers, config) {
            $location.path('/');
            console.log('saved successful');
        }).error(function (data, status, headers, config) {
            $scope.error = 'Wystapil blad podczas zapisywania wizyty';
            $scope.dataLoading = false;
        });
    };
}])
.controller('CommunicationController', ['$scope', '$routeParams', 'BackendServices', function ($scope, $routeParams, BackendServices) {
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
        BackendServices.sendMessage(
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
.controller('PatientAttachmentController', ['$scope', '$routeParams', 'BackendServices', function ($scope, $routeParams, BackendServices) {
    $scope.dataLoading = true;
    $scope.attachmentDownload = false;

    BackendServices.getPatientAttachment( $scope.patientId).success(function (data) {
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
        BackendServices.downloadAttachment( id).success(function (data) {
            $scope.attachmentDownload = false;
            var anchor = angular.element('<a/>');
            anchor.attr({
                href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                target: '_blank',
                download: 'filename.csv'
            })[0].click();

        }).error(function () {
            $scope.attachmentDownload = false;
            $scope.error = 'Wystąpił błąd podczas pobierania załącznika';
        });
    };
}]);