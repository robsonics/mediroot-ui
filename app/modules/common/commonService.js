angular.module('Common', ['ngDialog'])
    //.constant('ApiAdress','http://192.168.1.120:8081')
    /.constant('ApiAdress','http://localhost:8081')
    .constant('ApiAdress','http://192.168.1.104:8081')
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
    .factory('LocationService', ['$location', function ($location) {
        var service = {};

        service.patientVisit = function (patientId) {
            $location.path('/patient/' + patientId + '/visit');
        };

        service.login = function () {
            $location.path('/login');
        };

        service.addPatient = function () {
            $location.path('/addpatient');
        };

        service.patientEdit = function (patientId, invokeView) {
            $location.path('/patient/' + patientId + '/edit/' + invokeView);
        };

        service.newPatientSurvey = function (patientId, invokeView) {
            $location.path('/patient/' + patientId + '/newsurvey/' + invokeView);
        };

        service.surveyList = function () {
            $location.path('/survey');
        };

        service.createSurvey = function () {
            $location.path('/survey/create');
        };

        service.productList = function () {
            $location.path('/pricing');
        };

        service.newProduct = function () {
            $location.path('/product/new');
        };

        service.calenar = function () {
            $location.path('/schedule');
        };

        service.createVisit = function () {
            $location.path('/schedule/new');
        };

        service.productGroup = function () {
            $location.path('/productgroup');
        };

        service.createProductGroup = function () {
            $location.path('/productgroup/create');
        };

        service.editProductGroup = function (productGroup) {
            $location.path('/productgroup/' + productGroup + '/edit');
        };

        service.patientGroup = function () {
            $location.path('/patientgroup');
        };

        service.createPatientGroup = function () {
            $location.path('/patientgroup/create');
        };

        service.editPatinetGroup = function (patientGroup) {
            $location.path('/patientgroup/' + patientGroup + '/edit');
        };

        service.dashboard = function () {
            $location.path('/dashboard');
        };

        service.home = function () {
            $location.path('/');
        };

        service.invoiceList = function() {
            $location.path('/invoicelist');
        };

        service.newScheduleEntry = function() {
            $location.path('/newscheduleentry');
        };

        service.addInvoice = function() {
            $location.path('/addinvoice');
        };

        service.userProfile = function() {
            $location.path('/userprofile');
        };

        service.EditScheduleItem = function(calendarEventId, subCalendarEventId) {
            $location.path('/scheduleentry/eidt/' + calendarEventId + '/' + subCalendarEventId);
        };
        
        service.EditScheduleItemUrl = function(calendarEventId, subCalendarEventId) {
            $location.url('/scheduleentry/eidt/' + calendarEventId + '/' + subCalendarEventId);
        };

        service.statmentSignOff = function(statmentTemplateId, patientId, surveyId) {
            $location.path('/statmentsignoff/' + statmentTemplateId + '/' + patientId + '/' + surveyId);
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
    .factory('DateFormatter',[function() {
        var service = {};
        service.format = function (input) {
            if (null == input)
                return null;
            var date = new Date(input);
            
            function addZero(number) {
                if (number < 10) {
                    return '0' + number;
                } else {
                    return number;
                }
            }
            // getMonth() return from 0..11
            return date.getFullYear() + '-' + addZero(date.getMonth()+1) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes());
        };
        return service;
    }])
    .directive('loadData', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                dataLoading: '=loading',
                errorMessage: '=error'
            },
            templateUrl: 'modules/common/loadData.tpl.html'
        };
    })
    .factory('PayerList', [function () {
        return [{ id: 0, name: 'Prywatna' },
                { id: 1, name: 'NFZ' },
                { id: 2, name: 'PZU' },
                { id: 3, name: 'Medpolonia' }];
    }]);
