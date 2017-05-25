(function () {
    'use strict';
    
    /*global angular */
    angular.module('Patient')
         .controller('CreateNewVisitController', ['$scope',
                                                '$routeParams',
                                                '$http',
                                                'LocationService',
                                                '$rootScope',
                                                'ToothElement',
                                                'FileUploader',
                                                'DiagnoseTemplateAPI',
                                                'TreatmentProductAPI',
                                                'TreatmentAPI', 'DateFormatter', 'PayerList', 'ApiAdress',
                                                function ($scope, $routeParams,
                                                            $http, LocationService,
                                                            $rootScope, ToothElement,
                                                            FileUploader, DiagnoseTemplateAPI,
                                                            TreatmentProductAPI, TreatmentAPI, DateFormatter, PayerList, ApiAdress) {
                var self = this;
                self.vm = {
                    diagnoses: [{
                        treatments: [],
                        treatmentProducts: []
                    }],
                    visitDate: new Date(),
                    visitStartTime: new Date(),
                    visitPayer: null,
                    patientId: $routeParams.patientId,
                    doctorId: $rootScope.globals.currentUser.doctorid,
                    comment: null,
                    totalPrice: 0
                };
                self.dataLoading = false;
                self.error = null;

                self.saveLoading = false;
                self.saveError = null;

                $scope.newdiagnoze = '';
                self.state = [];
                self.visitRecords = [];

                $scope.newtreatment = '';

                self.Template = {
                    diagnoseTemplate: [],
                    treatments: [],
                    treatmentProducts: [],
                    elements: ToothElement
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
                        self.vm.diagnoses.splice(index, 1);
                    },
                    AddDiagnose: function () {
                        self.vm.diagnoses.push({ treatments: [], treatmentProducts: [] });
                    },
                    AddTreatment: function (diagnoseIndex) {
                        if (self.vm.diagnoses[diagnoseIndex].treatments) {
                            self.vm.diagnoses[diagnoseIndex].treatments.push({});
                        } else {
                            self.vm.diagnoses[diagnoseIndex].treatments = [{}];
                        }

                    },
                    RemoveTreatment: function (diagnoseIndex, treatmentIndex) {
                        self.vm.diagnoses[diagnoseIndex].treatments.splice(treatmentIndex, 1);
                    },
                    AddTreatmentProduct: function (diagnoseIndex) {
                        if (self.vm.diagnoses[diagnoseIndex].treatmentProducts) {
                            self.vm.diagnoses[diagnoseIndex].treatmentProducts.push({});
                        } else {
                            self.vm.diagnoses[diagnoseIndex].treatmentProducts = [{}];
                        }
                    },
                    RemoveTreatmentProduct: function (diagnoseIndex, treatmentIndex) {
                        self.vm.diagnoses[diagnoseIndex].treatmentProducts.splice(treatmentIndex, 1);
                    }
                };

                self.OnSelectedElement = function (selected) {
                    if (selected) {
                        if (selected.originalObject) {
                            var id = this.id.substring(12, this.id.length);
                            self.vm.diagnoses[id].element = selected.originalObject;
                        }
                    }
                };

                self.OnDiagnoseTemplateChange = function (selected) {
                    if (selected) {
                        if (selected.originalObject) {
                            var elementId = '', i = 0, j = 0, treatmentProducts, elem, elementId2;
                            var id = this.id.substring(13, this.id.length);
                            self.vm.diagnoses[id].description = selected.originalObject.diagnose;
                            self.vm.diagnoses[id].isElementRequired = selected.originalObject.isElementRequired;
                            self.vm.diagnoses[id].element = null;
                            elementId = 'element-alt-' + id;
                            $scope.$broadcast('angucomplete-alt:changeInput', elementId, selected.originalObject.defaultElement);
                            self.vm.diagnoses[id].treatments = [];
                            self.vm.diagnoses[id].treatmentProducts = [];
                            for (i = 0; i < selected.originalObject.treatments.length; i++) {
                                self.vm.diagnoses[id].treatments.push(selected.originalObject.treatments[i]);
                            }
                            for (j = 0; j < selected.originalObject.treatmentProducts.length; j++) {

                                treatmentProducts = selected.originalObject.treatmentProducts[j];
                                elem = self.Template.treatmentProducts.find(function (element) {
                                    return element.id === treatmentProducts.treatmentProductId;
                                });
                                    //treatmentProducts.price = elem.defaultPrice;
                                self.vm.diagnoses[id].treatmentProducts.push(treatmentProducts);
                                elementId2 = 'treatmentProduct-' + id + '-' + j;
                                $scope.$broadcast('angucomplete-alt:changeInput', elementId2, selected.originalObject.treatmentProducts[j].name);
                            }
                        }
                    }
                };

                self.OnTreatmentProductChange = function (selected) {
                    if (selected) {
                        var $index =  this.id.split("-")[1],
                            subindex = this.id.split("-")[2],
                            elem,
                            i,
                            j;
                        if (!self.vm.diagnoses[$index].treatmentProducts[subindex].price) {
                            elem = self.Template.treatmentProducts.find(function (element) {
                                return element.name === selected.originalObject.name;
                            });
                            self.vm.diagnoses[$index].treatmentProducts[subindex].price = elem.defaultPrice;
                            self.vm.totalPrice = 0;
                            for (i = 0; i < self.vm.diagnoses.length; i++) {
                                for (j = 0; j < self.vm.diagnoses[i].treatmentProducts.length; j++) {
                                    self.vm.totalPrice = self.vm.totalPrice + self.vm.diagnoses[i].treatmentProducts[j].price;
                                }
                            }
                        }
                    }
                };


                TreatmentAPI.GetTreatmentList().success(function (data) {
                    self.Template.treatments = data;
                }).error(function () {
                });

                DiagnoseTemplateAPI.GetDiagnoseTemplate().success(function (data) {
                    self.Template.diagnoseTemplate = data;
                }).error(function () {
                    
                });

                TreatmentProductAPI.GetTreatmentProductList().success(function (data) {
                    self.Template.treatmentProducts = data;
                }).error(function () {
                });


                $scope.$parent.$watch('patient', function (newVal, oldVal) {
                    if (undefined === $scope.$parent || null === $scope.$parent ||
                            undefined === $scope.$parent.patient || null === $scope.$parent.patient ||
                            undefined === $scope.$parent.patient.teethGraph || null === $scope.$parent.patient.teethGraph) {
                        return;
                    }
                    self.state = $scope.$parent.patient.teethGraph;
                });

                $scope.attachemntId = [];

                var uploader = $scope.uploader = new FileUploader({
                    url: ApiAdress + '/attachment/add/' + self.vm.patientId
                });

                                                    // FILTERS

                uploader.filters.push({
                    name: 'customFilter',
                    fn: function (item/*{File|FileLikeObject}*/, options) {
                        return this.queue.length < 10;
                    }
                });

                uploader.onAfterAddingAll = function (addedFileItems) {
                    addedFileItems.forEach(function (file) {
                        file.upload();
                    });
                };

                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    if (undefined === response || undefined === response.attachemntId) {
                        return;
                    }
                    $scope.attachemntId.push(response.attachemntId);
                };
                
                self.save = function () {
                    self.saveError = null;
                    if(self.vm.visitPayer === null) {
                        self.saveError = 'Nie określono płatnika wizyty';
                        return;
                    }
                    if (self.vm.visitStartTime === null) {
                        self.saveError = 'Brak czasu rozpoczęcia wizyty';
                        return;
                    }
                    if (self.vm.visitDate === null) {
                        //show error
                        self.saveError = 'Brak daty wizyty';
                        return;
                    }
                    self.saveLoading = true;
                    var visitStartTime = new Date(self.vm.visitStartTime),
                        visitDate = self.vm.visitDate,
                        startDateTime = DateFormatter.format(visitDate.setHours(visitStartTime.getHours(), visitStartTime.getMinutes()));
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
                                    tooth: (v.element) ? v.element.id : null
                                };
                            }),
                            attachments: $scope.attachemntId.map(function (v) {
                                return {
                                    attachmentId: v,
                                    insertDate: new Date()
                                };
                            }),
                            CalendarEvent: {
                                start: startDateTime,
                                end: new Date(),
                                eventType: 4,
                                IsRecurence: false,
                                RecurenceRule: {}
                            },
                            teethgraph: JSON.stringify(self.state),
                            comment: self.vm.comment,
                            totalprice: self.vm.totalPrice
                        }).success(function (data, status, headers, config) {
                        LocationService.home();
                    }).error(function (data, status, headers, config) {
                        self.saveError = 'Wystapil blad podczas zapisywania wizyty';
                        self.saveLoading = false;
                    });
                };
            }]);
}());