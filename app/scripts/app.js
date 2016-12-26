'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Patient', []);
angular.module('Survey', []);
angular.module('Pricing', []);
angular.module('Schedule', []);
angular.module('ProductGroup', []);
angular.module('PatientGroup', []);
angular.module('Invoice', []);
angular.module('Radio', []);
angular.module('Statment', []);
angular.module('Report', []);


angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'Patient',
    'Survey',
    'Pricing',
    'Schedule',
    'ProductGroup',
    'PatientGroup',
    'Invoice',
    'Radio',
    'Statment',
    'Report',
    'ngRoute',
    'ngCookies'
])

.config(['$routeProvider','$logProvider', function ($routeProvider, $logProvider) {

    //todo depend on config
    $logProvider.debugEnabled(true);
    
    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
	    .when('/addpatient', {
	        controller: 'AddPatientController',
	        templateUrl: 'modules/patient/views/addpatient.html',
	        hideMenus: true
	    })
         .when('/patient/:patientId/visit', {
             controller: 'PatientVisitController',
             templateUrl: 'modules/patient/views/visit.html',
             hideMenus: true
         })
        .when('/patient/:patientId/edit/:invokeView', {
            controller: 'PatientEditController',
            templateUrl: 'modules/patient/views/addpatient.html',
            hideMenus: true
        })
        .when('/patient/:patientId/newsurvey/:invokeView', {
            controller: 'NewSurveyController',
            templateUrl: 'modules/patient/views/addsurvey.html',
            hideMenus: true
        })
        .when('/survey', {
            controller: 'SurveyListController',
            templateUrl: 'modules/survey/views/surveylist.html',
            hideMenus: true
        })
         .when('/survey/create', {
             controller: 'CreateSurveyController',
             templateUrl: 'modules/survey/views/createsurvey.html',
             hideMenus: true
         })
        .when('/product/details/:productId', {
            controller: 'EditPricingController',
            templateUrl: 'modules/pricing/views/addpricingitem.html',
            hideMenus: true
        })
        .when('/product/new', {
            controller: 'NewPricingController',
            templateUrl: 'modules/pricing/views/addpricingitem.html',
            hideMenus: true
        })
        .when('/pricing', {
            controller: 'PricingController',
            templateUrl: 'modules/pricing/views/pricingitem.html',
            hideMenus: true
        })
        .when('/schedule', {
            controller: 'ScheduleController',
            templateUrl: 'modules/schedule/views/schedule.html',
            hideMenus: true
        })
        .when('/schedule/new', {
            controller: 'CreateScheduleController',
            templateUrl: 'modules/schedule/views/createVisit.html',
            hideMenus: true
        })
        .when('/productgroup', {
            controller: 'ProductGroupList',
            templateUrl: 'modules/productgroup/views/productGroupList.html',
            hideMenus: true
        })
        .when('/productgroup/create', {
            controller: 'AddProductGroupList',
            templateUrl: 'modules/productgroup/views/addProductGroup.html',
            hideMenus: true
        })
        .when('/productgroup/:productGroupId/edit', {
            controller: 'EditProductGroupList',
            templateUrl: 'modules/productgroup/views/addProductGroup.html',
            hideMenus: true
        })
        .when('/patientgroup', {
            controller: 'PatientGroupList',
            templateUrl: 'modules/patientgroup/views/patientGroupList.html',
            hideMenus: true
        })
        .when('/patientgroup/create', {
            controller: 'AddPatientGroupList',
            templateUrl: 'modules/patientgroup/views/addPatientGroup.html',
            hideMenus: true
        })
        .when('/patientgroup/:patientGroupId/edit', {
            controller: 'EditPatientGroupList',
            templateUrl: 'modules/patientgroup/views/addPatientGroup.html',
            hideMenus: true
        })
        .when('/userprofile', {
            controller: 'UserProfileController',
            templateUrl: 'modules/authentication/views/userProfile.html',
            hideMenus: true
        })
        .when('/newscheduleentry', {
            controller: 'NewScheduleEntryController',
            templateUrl: 'modules/authentication/views/newScheduleEntry.html',
            hideMenus: true
        })
        .when('/scheduleentry/eidt/:calendarEventId/:subcalendarEventId', {
            controller: 'EditScheduleEntryController',
            templateUrl: 'modules/authentication/views/newScheduleEntry.html',
            hideMenus: true
        })
        .when('/radio', {
            controller: 'RadioController',
            templateUrl: 'modules/radio/views/radio.html',
            hideMenus: true
        })
        .when('/statmentsignoff/:statmentTemplateId/:patientId/:surveyId', {
            controller: 'StatmentController',
            templateUrl: 'modules/statment/views/signoff.html',
            hideMenus: true
        })
        .when('/previewstatmentsignoff/:statmentTemplateId/:patientId/', {
            controller: 'PreviewStatmentController',
            templateUrl: 'modules/statment/views/previewsignoff.html',
            hideMenus: true
        })
        .when('/statment/:statmentTemplateId/:patientId/:surveyId/survey', {
            controller: 'SurveyStatmentController',
            templateUrl: 'modules/statment/views/survey.html',
            hideMenus: true
        })
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .when('/mainvisitlist', {
            controller: 'MainVisitListController',
            templateUrl: 'modules/report/views/mainVisitList.html'
        })
        .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);
