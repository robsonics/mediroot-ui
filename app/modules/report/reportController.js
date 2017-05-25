(function () {
    'use strict';

    /*global angular */
    angular.module('Report', ['Common', 'ui.bootstrap'])
        .factory('ReportAPI', ['$http', 'ApiAdress', function ($http, ApiAdress) {
            return {
                mainVisitList: function (start, end, doctor, payer, page, pageSize) {
                    return $http.post(ApiAdress + '/report/visit/', {
                        start: start,
                        end: end,
                        doctor: doctor,
                        visitPayers: payer,
                        page: page,
                        pageSize: pageSize
                    });
                }
            };
        }])
        .controller('MainVisitListController', ['PayerList', 'ReportAPI', function (PayerList, ReportAPI) {
            var self = this;
            self.payerList = PayerList;
            self.dataLoading = false;
            self.vm = {
                visitPayers: null,
                startDate: null,
                endDate: null,
                doctors: null
            };

            self.togglePayerSelection = function (payerId) {

            };
            self.show = function () {
                self.dataLoading = true;
                ReportAPI.mainVisitList(self.vm.startDate,
                                        self.vm.endDate,
                                        self.vm.doctors,
                                        self.vm.visitPayers,
                                        self.vm.page,
                                        self.vm.pageSize).success(function (data) {
                    self.data = data;
                    self.dataLoading = false;
                }).error(function () {
                    self.dataLoading = false;
                });
            };
        }]);
}());