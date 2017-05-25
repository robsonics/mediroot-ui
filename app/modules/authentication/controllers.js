(function () {
    'use strict';
    
    /*global angular */
    angular.module('Authentication', ['ui.calendar', 'ui.bootstrap', 'Common'])      
        .controller('LoginController', ['$scope', '$rootScope', '$location', 'AuthenticationService', function ($scope, $rootScope, $location, AuthenticationService) {
            // reset login status
            AuthenticationService.ClearCredentials();

            $scope.login = function () {
                $scope.dataLoading = true;
                $scope.error = null;
                AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    if (response.success) {
                        AuthenticationService.SetCredentials(response.systemuser, $scope.rememberme);

                        $location.path('/');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                }, function(r) {
                    $scope.error = r;
                    $scope.dataLoading = false;
                });
            };
        }])
        .controller('UserProfileController', ['uiCalendarConfig', function (uiCalendarConfig) { }])
        .controller('UserProfileScheduleController', ['$scope', '$rootScope', 'LocationService', '$http', 'uiCalendarConfig', 'DateFormatter', '$compile', '$timeout', 'ApiAdress', function ($scope, $rootScope, LocationService, $http, uiCalendarConfig, DateFormatter, $compile, $timeout, ApiAdress) {
            var startDate = new Date();
            var endDate = new Date();

            $scope.newEvent = function () {

            };

            /* event source that calls a function on every view switch */
            $scope.eventsF = function (start, end, timezone, callback) {
                var s = new Date(start);
                var e = new Date(end);
                //$scope.dataLoading = true;
                $scope.errorMessage = null;
                startDate = DateFormatter.format(s);
                endDate = DateFormatter.format(e);

                $http.get(ApiAdress + '/calendar/schedule/' + startDate + '/' + endDate + '/' + $rootScope.globals.currentUser.systemuserid).
                success(function (data) {
                    //pre proccess data
                    data.forEach(function (element) {
                        element.url = '#/scheduleentry/eidt/' + element.calendareventid + '/' + element.subcalendareventid;
                    });
                    callback(data);
                    $scope.doctorLoading = false;
                }).error(function () {
                    $scope.doctorLoading = false;
                    $scope.errorMessage = 'Wyst\B9pi\B3 b\B3\B9d podczas pobierania listy wizyt dla lekarza';
                });
            };

            $scope.newEntry = function () {
                LocationService.newScheduleEntry();
            };

            /* Change View */
            $scope.changeView = function (view) {
                uiCalendarConfig.calendars['myCalendar1'].fullCalendar('changeView', view);
            };


            var startDate = null;
            var endDate = null;

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();
            $scope.events = [];
            /* event source that pulls from google.com */
            $scope.newEvent = function () {
                LocationService.createVisit();
            };

            $scope.eventSource = {
                url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
                className: 'gcal-event',           // an option!
                currentTimezone: 'America/Chicago' // an option!
            };

            $scope.calEventsExt = {
                color: '#f00',
                textColor: 'yellow',
                events: [
                    { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                    { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
                    { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
                ]
            };
            /* alert on eventClick */
            $scope.alertOnEventClick = function (date, jsEvent, view) {
                $scope.alertMessage = (date.title + ' was clicked ');
            };
            /* alert on Drop */
            $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
                $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
            };
            /* alert on Resize */
            $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
                $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
            };
            /* add and removes an event source of choice */
            $scope.addRemoveEventSource = function (sources, source) {
                var canAdd = 0;
                angular.forEach(sources, function (value, key) {
                    if (sources[key] === source) {
                        sources.splice(key, 1);
                        canAdd = 1;
                    }
                });
                if (canAdd === 0) {
                    sources.push(source);
                }
            };
            /* add custom event*/
            $scope.addEvent = function () {
                $scope.events.push({
                    title: 'Open Sesame',
                    start: new Date(y, m, 28),
                    end: new Date(y, m, 29),
                    className: ['openSesame']
                });
            };
            /* remove event */
            $scope.remove = function (index) {
                $scope.events.splice(index, 1);
            };
            /* Change View */
            $scope.changeView = function (view) {
                uiCalendarConfig.calendars['myCalendar1'].fullCalendar('changeView', view);
            };
            /* Change View */
            $scope.renderCalender = function (calendar) {
                $timeout(function () {
                    if (uiCalendarConfig.calendars['myCalendar1']) {
                        uiCalendarConfig.calendars['myCalendar1'].fullCalendar('render');
                    }
                });
            };
            /* Render Tooltip */
            $scope.eventRender = function (event, element, view) {
                element.attr({
                    'tooltip': event.title,
                    'tooltip-append-to-body': true
                });
                $compile(element)($scope);
            };
            /* config object */
            $scope.uiConfig = {
                calendar: {
                    height: '100%',
                    editable: true,
                    header: {
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    },
                    eventClick: $scope.alertOnEventClick,
                    eventDrop: $scope.alertOnDrop,
                    eventResize: $scope.alertOnResize,
                    eventRender: $scope.eventRender
                }
            };


            /* event sources array*/
            $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        }])
        .controller('UserProfilePersonalDataController', ['$scope', '$rootScope', '$location', 'UserAPI', function ($scope, $rootScope, $location, UserAPI) {
            $scope.dataLoading = true;
            $scope.processing = false;
            $scope.errorMessage = null;

            UserAPI.getUserDetails($rootScope.globals.currentUser.systemuserid).success(function (result) {
                $scope.firstname = result.firstname;
                $scope.lastname = result.lastname;
                $scope.PESEL = result.pesel;
                $scope.adress = result.adress,
                    $scope.city = result.city;
                $scope.postal = result.postal;
                $scope.phone = result.phone;
                $scope.email = result.email;
                $scope.dataLoading = false;

            }).error(function (result) {
                $scope.dataLoading = false;
                $scope.errorMessage = 'Wyst\B9pi\B3 b\B3\B9d podczas pobierania danych u\BFytkownika';
            });

            $scope.Update = function () {
                $scope.processing = true;
                var req = {
                    systemuserid: $rootScope.globals.currentUser.systemuserid,
                    person: {
                        lastname: $scope.lastname,
                        firstname: $scope.firstname,
                        pesel: $scope.PESEL,
                        adress: $scope.adress,
                        city: $scope.city,
                        postal: $scope.postal,
                        phonenumber: [$scope.phone],
                        email: $scope.email,
                    }
                };
                console.log(req);
                UserAPI.UpdatePerson(req).success(function (parameters) {
                    console.log('successful updated');
                    $scope.processing = false;
                }).error(function (parameters) {
                    console.log('errror in update');
                    $scope.processing = false;
                });
            };
        }])
        .controller('NewScheduleEntryController', ['$scope', '$rootScope', 'LocationService', '$http', 'DateFormatter', '$log', 'ScheduleStaticDataService', 'ApiAdress', function ($scope, $rootScope, LocationService, $http, DateFormatter, $log, ScheduleStaticDataService, ApiAdress) {
            $scope.isRepeating = true;
            $scope.format = 'dd-MMMM-yyyy';
            $scope.endType = 0;
            $scope.isEdit = false;

            $scope.OnCountryChange = function (item) {
                if (undefined != item && undefined != item.originalObject) {
                    $scope.country = $scope.newtreatment.originalObject.name;
                };
            };

            $scope.status = {
                opened: false
            };

            $scope.startDate = new Date();
            $scope.finishafterdate = new Date();

            $scope.startTime = new Date().setHours(8, 0);
            $scope.endTime = new Date().setHours(16, 0);

            $scope.repeateBys = ScheduleStaticDataService.GetRepeateBys();

            $scope.open = function ($event) {
                $scope.status.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };

            $scope.repeateTypes = ScheduleStaticDataService.GetRepeateType();

            $scope.Save = function () {
                $scope.dataLoading = true;
                var endTime = new Date($scope.endTime);
                var startTime = new Date($scope.startTime);
                var endDate = DateFormatter.format($scope.startDate.setHours(endTime.getHours(), endTime.getMinutes()));
                var startDate = DateFormatter.format($scope.startDate.setHours(startTime.getHours(), startTime.getMinutes()));
                var lastOccurence = $scope.endType == 2 ? DateFormatter.format($scope.finishafterdate) : null;
                var maxOccurence = $scope.endType == 1 ? $scope.finishafterrepeate : null;
                var requrenceRule = {
                    FirstOccurence: startDate,
                    recurenceType: this.repeateType,
                    repeateBy: this.repateBy,
                    repeateAcording: this.repeatAccording,
                    lastOccurence: lastOccurence,
                    maxOccurence: maxOccurence
                };
                var req = {
                    title: $scope.title,
                    start: startDate,
                    end: endDate,
                    isRecurence: $scope.isRepeating,
                    RecurenceRule: $scope.isRepeating ? requrenceRule : null,
                    comment: $scope.comment
                };
                $log.debug(req);
                $http.post(ApiAdress + '/calendar/schedule/' + $rootScope.globals.currentUser.systemuserid + '/item/new', req).
                success(function () {
                    $scope.dataLoading = false;
                    LocationService.userProfile();
                }).error(function () {
                    $scope.dataLoading = false;
                    $scope.errorMessage = 'Wyst\B9pi\B3 b\B3\B9d przy dodawaniu';
                });
            };
        }])
        .controller('EditScheduleEntryController', ['$scope', '$rootScope', 'LocationService', '$http', 'DateFormatter', '$log', 'ScheduleStaticDataService', '$routeParams', 'Interaction', 'ApiAdress', function ($scope, $rootScope, LocationService, $http, DateFormatter, $log, ScheduleStaticDataService, $routeParams, Interaction, ApiAdress) {
            $scope.isRepeating = true;
            $scope.format = 'dd-MMMM-yyyy';
            $scope.endType = 0;
            $scope.isEdit = true;
            $scope.dataLoading = true;

            $scope.status = {
                opened: false
            };

            $scope.startDate = new Date();
            $scope.finishafterdate = new Date();

            $scope.startTime = new Date().setHours(8, 0);
            $scope.endTime = new Date().setHours(16, 0);

            $scope.repeateBys = ScheduleStaticDataService.GetRepeateBys();

            $scope.open = function ($event) {
                $scope.status.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };

            $scope.repeateTypes = ScheduleStaticDataService.GetRepeateType();


            $http.get(ApiAdress + '/calendar/schedule/' + $routeParams.calendarEventId + '/' + $routeParams.subcalendarEventId + '/details').success(function (data) {
                $scope.dataLoading = false;
                $scope.title = data.title;
                $scope.startDate = data.start;
                $scope.comment = data.comment;
                //TODO fill other
            }).error(function() {
                $scope.errorMessage = 'Wyst\B9pi\B3 b\B3\B9d podczas \B3adowania szczeg\F3\B3\F3w wydarzenia.';
                $scope.dataLoading = false;
            });

            $scope.OnCountryChange = function (item) {
                if (undefined != item && undefined != item.originalObject) {
                    $scope.country = $scope.newtreatment.originalObject.name;
                };
            };

            $scope.Save = function () {
                Interaction.ShowConfimation('Czy chcesz wprowadzi\E6 zmiany w tym wydarzeniu czy w ca\B3ej serii?', 'Tylko w tym wydarzeeniu', 'W ca\B3ej serii wydarze\F1',
                                            function (parameters) {

                }, function(parameters) {

                });
                $scope.dataLoading = true;
                var endTime = new Date($scope.endTime);
                var startTime = new Date($scope.startTime);
                var endDate = DateFormatter.format($scope.startDate.setHours(endTime.getHours(), endTime.getMinutes()));
                var startDate = DateFormatter.format($scope.startDate.setHours(startTime.getHours(), startTime.getMinutes()));
                var lastOccurence = $scope.endType == 2 ? DateFormatter.format($scope.finishafterdate) : null;
                var maxOccurence = $scope.endType == 1 ? $scope.finishafterrepeate : null;
                var requrenceRule = {
                    FirstOccurence: startDate,
                    recurenceType: this.repeateType,
                    repeateBy: this.repateBy,
                    repeateAcording: this.repeatAccording,
                    lastOccurence: lastOccurence,
                    maxOccurence: maxOccurence
                };
                var req = {
                    start: startDate,
                    end: endDate,
                    isRecurence: $scope.isRepeating,
                    RecurenceRule: $scope.isRepeating ? requrenceRule : null,
                    comment: $scope.comment
                };
                $log.debug(req);

                $http.post(ApiAdress + '/calendar/schedule/' + $rootScope.globals.currentUser.systemuserid + '/item/new', req).
                success(function () {
                    $scope.dataLoading = false;
                    LocationService.userProfile();
                }).error(function () {
                    $scope.dataLoading = false;
                    $scope.errorMessage = 'Wyst\B9pi\B3 b\B3\B9d przy dodawaniu';
                });
            };

            $scope.Remove = function() {
                //Interaction.ShowConfimation();
            };
        }]);
}());