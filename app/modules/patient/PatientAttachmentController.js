(function () {
    'use strict';
    
    angular.module('Patient')
        .controller('PatientAttachmentController', ['$scope', '$routeParams', 'AttachmentAPI', function ($scope, $routeParams, AttachmentAPI) {
            var self = this;
            self.dataLoading = true;
            self.attachmentDownload = false;

            AttachmentAPI.getPatientAttachmentList($scope.patientId).success(function (data) {
                self.dataLoading = false;
                self.attachmentList = data;
            }).error(function () {
                self.dataLoading = false;
                self.error = 'Wystąpił błąd podczas pobierania listy załączników';
            });

            self.Download = function (id) {
                if (null === id || '' === id) {
                    return;
                }
                self.attachmentDownload = true;
                self.error = null;
                var filename = self.attachmentList.filter(function (item) {
                    return item.attachmentId === id;
                })[0].name;
                AttachmentAPI.downloadAttachment(id).then(function (response) {
                    self.attachmentDownload = false;
                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
                        target: '_blank',
                        download: filename
                    })[0].click();

                }, function () {
                    self.attachmentDownload = false;
                    self.error = 'Wystąpił błąd podczas pobierania załącznika';
                });
            };
        }]);
}());