'use strict';

// declare modules
angular.module('Authentication.Services', []);
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Patient', []);
angular.module('Survey', []);
angular.module('Pricing', []);
angular.module('Schedule', []);
angular.module('ProductGroup', []);
angular.module('PatientGroup', []);
angular.module('Invoice', []);
angular.module('Statment', []);


angular.module('BasicHttpAuthExample', [
    'Authentication.Services',
    'Authentication',
    'Home',
    'Patient',
    'Survey',
    'Pricing',
    'Schedule',
    'ProductGroup',
    'PatientGroup',
    'Invoice',
    'ngRoute',
    'ngCookies',
    'Statment'
])

    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers['Access-Control-Allow-Headers'] = "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With";
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        
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
                templateUrl: 'modules/patientgroup/views/editPatientGroup.html',
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
            .when('/statment', {
                controller: 'StatmentList',
                templateUrl: 'modules/statment/views/statmentList.html',
                hideMenus: true
            })
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'modules/home/views/home.html'
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