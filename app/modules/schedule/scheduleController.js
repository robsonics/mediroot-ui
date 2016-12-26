'use strict';

angular.module('Schedule', ['ngDialog', 'ui.calendar', 'ui.bootstrap', 'Common'])
.controller('ScheduleController', ['$scope', 'LocationService', '$http', 'uiCalendarConfig', '$compile', 'DateFormatter', 'ApiAdress', function ($scope, LocationService, $http, uiCalendarConfig, $compile, DateFormatter, ApiAdress) {
    $scope.error = null;
    $scope.dataLoading = true;
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



    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start);
        var e = new Date(end);
        $scope.dataLoading = true;
        $scope.error = null;

        startDate = DateFormatter.format(s);
        endDate = DateFormatter.format(e);
        $http.get(ApiAdress + '/calendar/list/' + startDate + '/' + endDate).success(function (data) {
            callback(data);
            $scope.dataLoading = false;
        }).error(function () {
            $scope.dataLoading = false;
            $scope.error = 'Wystąpił błąd podczas ładowania listy wydarzeń.';
        });
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
            height: 450,
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
.controller('CreateScheduleController', ['$scope', 'LocationService', '$http', 'uiCalendarConfig', 'DateFormatter', 'ApiAdress', 'DoctorAPI', function ($scope, LocationService, $http, uiCalendarConfig, DateFormatter, ApiAdress, DoctorAPI) {
    $scope.error = null;
    $scope.dataLoading = false;
    $scope.doctorLoading = false;
    var startDate = null;
    var endDate = null;
    $scope.doctor = null;
    $scope.patient = null;
    $scope.createPatient = false;
    $scope.valid = false;
    $scope.events = [];
    $scope.events.push({
        title: 'Open Sesame',
        start: new Date(),
    });
    // TODO replace
    DoctorAPI.getDoctorList().success(function(data){
    	$scope.doctors = data;
	$scope.doctorLoading = false;
    }).error(function(){
	$scope.doctorLoading = false;
    });
    $scope.doctors = [
  { name: "Urszula Korzeniowska", description: "Stomatolog", id: 1 },
  { name: "Joanna Dąbrowicz", description: "Stomatolog", id: 2 }
    ];

    $scope.newDoctor = function (doctor) {
        if (undefined == doctor || undefined == doctor.originalObject || null == startDate || null == endDate)
            return;
        $scope.doctor = doctor;
        $scope.doctorLoading = true;
        $scope.error = null;
        $scope.doctor = doctor;

        $http.get(ApiAdress + '/calendar/list/' + DateFormatter.format(startDate) + '/' + DateFormatter.format(endDate) + '/' + doctor.originalObject.id).
        success(function (data) {
            data.forEach(function (element) {
                $scope.events.push({
                    title: element.title,
                    start: new Date(element.start),
                    end: new Date(element.end),
                });
            });
            $scope.events = data;
            $scope.doctorLoading = false;
        }).error(function () {
            $scope.doctorLoading = false;
            $scope.error = 'Wystąpił błąd podczas pobierania listy wizyt dla lekarza';
        });
    };

    $scope.newPatient = function (patient) {
        if (undefined == patient || null == patient) {
            return;
        }
        $scope.phone = null;
        $scope.createPatient = false;

        if (null != patient.originalObject && undefined != patient.originalObject.id) {
            $scope.phone = patient.originalObject.phoneNumber;
            $scope.createPatient = false;

        } else {
            $scope.createPatient = true;
        }
        $scope.patient = patient.originalObject;

    };

    $scope.save = function () {
        $http.post(ApiAdress + '/visit/add', {

        }).success(function (data) {

        }).error(function () {

        });
    };

    $scope.events = [];
    /* event source that pulls from google.com */
    $scope.eventSource = {
        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        startDate = new Date(start);
        endDate = new Date(end);
        
        if (null == $scope.doctor ||undefined == $scope.doctor || undefined == $scope.doctor.originalObject)
            return;
        
        $scope.dataLoading = true;
        $scope.error = null;
        $http.get(ApiAdress + '/calendar/list/' + DateFormatter.format(start) + '/' + DateFormatter.format(end) + '/' + $scope.doctor.originalObject.id).success(function (data) {
            callback(data);
            $scope.dataLoading = false;
        }).error(function () {
            $scope.dataLoading = false;
            $scope.error = 'Wystąpił błąd podczas ładowania listy wydarzeń.';
        });
    };

    /* Change View */
    $scope.changeView = function (view) {
        uiCalendarConfig.calendars['myCalendar1'].fullCalendar('changeView', view);
    };
    /* 
    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: 450,
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
}]);
