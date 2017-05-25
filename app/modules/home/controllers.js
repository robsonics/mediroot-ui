'use strict';

/*global angular */
angular.module('Home', ['ngDialog', 'ui.bootstrap', 'Common'])
    .controller('HomeController', ['$scope', '$rootScope', 'PatientAPI', '$location', 'ngDialog',
        function ($scope, $rootScope, PatientAPI, $location, ngDialog) {
            $scope.username = $rootScope.globals.currentUser.username;
            $scope.dataLoading = true;
            
            var columnDefs = [

                {headerName: "Nazwisko", field: "lastname", cellRenderer : function (param) {
                    return '<a href="#/patient/' + param.data.patientid + '/visit" style="text-transform: capitalize">' + param.data.lastname + '</a>';
                }},
                {headerName: "Imię", field: "firstname", cellRenderer : function (param) {
                    return '<a href="#/patient/' + param.data.patientid + '/visit" style="text-transform: capitalize">' + param.data.firstname + '</a>';
                }},
                {headerName: "PESEL", field: "pesel", width: 110},
                {headerName: "Telefon", field: "phone", width: 160},
                {headerName: "", field: "", cellRenderer : function (param) {
                    return '<button type="button" class="btn btn-primary btn-xs" aria-label="Left Align" popover-placement="bottom" popover="Edytuj dane pacjenta"  popover-trigger="mouseenter" ng-click="editPatient(' + param.data.patientid + ')">' +
                                                '<span class="glyphicon glyphicon glyphicon-edit" aria-hidden="true"></span>'+
                                            '</button>';
                }, width: 38, suppressMenu: true
                    },
                {headerName: "", field: "", cellRenderer : function (param) {
                    return '<button type="button" class="btn btn-danger btn-xs" aria-label="Left Align" popover-placement="bottom" popover="Usuń pacjenta"  popover-trigger="mouseenter" ng-click="removePatient(' + param.data.patientid + ')">' +
                                                '<span class="glyphicon glyphicon glyphicon-edit" aria-hidden="true"></span>'+
                                            '</button>';
                }, width: 38, suppressMenu: true
                    }
            ];

            var translation = {

                // for filter panel
                page: 'Strona',
                more: 'Więcej',
                to: 'Od',
                of: 'z',
                next: 'Następne',
                last: 'Ostatnie',
                first: 'Pierwszy',
                previous: 'daPreviousen',
                loadingOoo: 'Ładowanie...',

                // for set filter

                selectAll: 'Zaznacz wszystko',
                searchOoo: 'daSearch...',
                blanks: 'daBlanc',

                // for number filter and text filter

                filterOoo: 'Filtruj...',
                applyFilter: 'Aplikuj filtr...',

                // for number filter

                equals: 'Równy',
                notEquals: 'Nie równy',
                lessThan: 'Mniej niż',
                greaterThan: 'Więcej niż',
                // for text filter
                contains: 'Zawiera',
                startsWith: 'Rozpoczyna się od',
                endsWith: 'Kończy się na',

                // the header of the default group column

                group: 'Grua',

                // tool panel

                columns: 'Kolumna',

                rowGroupColumns: 'laPivot Cols',

                rowGroupColumnsEmptyMessage: 'la please drag cols to group',

                valueColumns: 'laValue Cols',

                pivotMode: 'laPivot-Mode',

                groups: 'laGroups',

                values: 'laValues',

                pivots: 'laPivots',

                valueColumnsEmptyMessage: 'la drag cols to aggregate',

                pivotColumnsEmptyMessage: 'la drag here to pivot',

                // other

                noRowsToShow: 'la no rows',

                // enterprise menu

                pinColumn: 'laPin Column',

                valueAggregation: 'laValue Agg',

                autosizeThiscolumn: 'laAutosize Diz',

                autosizeAllColumns: 'laAutsoie em All',

                groupBy: 'laGroup by',

                ungroupBy: 'laUnGroup by',

                resetColumns: 'laReset Those Cols',

                expandAll: 'laOpen-em-up',

                collapseAll: 'laClose-em-up',

                toolPanel: 'laTool Panelo',

                // enterprise menu pinning

                pinLeft: 'laPin <<',

                pinRight: 'laPin >>',

                noPin: 'laDontPin <>',

                // enterprise menu aggregation and status panel

                sum: 'laSum',

                min: 'laMin',

                max: 'laMax',
                none: 'laNone',
                count: 'laCount',
                average: 'laAverage',
                // standard menu

                copy: 'Kopiuj',
                ctrlC: 'ctrl + C',
                paste: 'Wklej',
                ctrlV: 'ctrl + C'
            };
            
            function isExternalFilterPresent() {
                return $scope.search !== undefined && $scope.search !== null && $scope.search !== "";
            }

            function doesExternalFilterPass(node) {
                if ($scope.search === undefined || $scope.search === null || $scope.search === "") {
                    return false;
                }
                var s = $scope.search.toUpperCase();
                return (node.data.firstname !== undefined && node.data.firstname !== null && node.data.firstname.toUpperCase().startsWith(s)) ||
                        (node.data.lastname !== undefined && node.data.lastname !== null && node.data.lastname.toUpperCase().startsWith(s)) ||
                        (node.data.pesel !== undefined && node.data.pesel !== null && node.data.pesel.toString().startsWith(s)) ||
                        (node.data.phone !== undefined && node.data.phone !== null && node.data.phone.toString().startsWith(s));
            }
            
            $scope.externalFilterChanged = function () {
                $scope.gridOptions.api.onFilterChanged();
            };
            
            $scope.gridOptions = {
                columnDefs: columnDefs,
                enableFilter: true,
                rowHeight: 32,
                angularCompileRows: true,
                localeText: translation,
                isExternalFilterPresent: isExternalFilterPresent,
                doesExternalFilterPass: doesExternalFilterPass,
                rowSelection: 'single',
            };
            
            $scope.removePatient = function (data) {
                var patientId = this.data.patientid;
                ngDialog.openConfirm({
                    template: '\
                    <p>Czy na pewno chcesz usunąć ' + this.data.lastname + ' ' + this.data.firstname + '? </p>\
                    <div class="ngdialog-buttons">\
                        <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Nie</button>\
                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Tak</button>\
                    </div>',
                    plain: true
                }).then(
                    function (value) {
                        $scope.dataLoading = true;
                        PatientAPI.removePatient(patientId).success(function () {
                            //reload grid
                            var selectedNodes = $scope.gridOptions.api.getSelectedNodes();
                            $scope.gridOptions.api.removeItems(selectedNodes);
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

            $scope.addPatient = function () {
                $location.path('/addpatient');
            };

            $scope.editPatient = function (patientId) {
                $location.path('/patient/' + patientId + '/edit/h');
            };

            PatientAPI.getPatients()
                .success(function (data) {
                    $scope.gridOptions.api.setRowData(data);
                    $scope.driversList = data;
                    $scope.dataLoading = false;
                })
                .error(function () {
                    $scope.error = 'Wystapil blad podczas pobierania listy pacjentów';
                    $scope.dataLoading = false;
                });

        }]);
