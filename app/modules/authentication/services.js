(function () {
    'use strict';

    /*global angular */
    angular.module('Authentication')
        .factory('AuthenticationService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', 'ApiAdress', function (Base64, $http, $cookieStore, $rootScope, $timeout, ApiAdress) {
            var service = {};

            service.Login = function (username, password, callback, errorCallback) {

                $http.post(ApiAdress + '/user/current', { username: username, password: password })
                    .success(function (response) {
                        callback(response);
                    }).error(function (r) {
                        errorCallback(r);
                    });

            };

            service.SetCredentials = function (systemuser, rememberme) {
                var authdata = Base64.encode(systemuser.username + ':' + systemuser.password);

                $rootScope.globals = {
                    currentUser: {
                        username: systemuser.username,
                        systemuserid: systemuser.userid,
                        doctorid: systemuser.doctorid,
                        usertype: systemuser.usertype,
                        authdata: authdata
                    }
                };

                $http.defaults.headers.common.Authorization = 'Basic ' + authdata; // jshint ignore:line
                if (rememberme === true) {
                    $cookieStore.put('globals', $rootScope.globals);
                }
            };

            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                $http.defaults.headers.common.Authorization = 'Basic ';
            };

            return service;
        }])
        .factory('Base64', function () {
        /* jshint ignore:start */

            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            return {
                encode: function (input) {
                    var output = "",
                        chr1,
                        chr2,
                        chr3 = "",
                        enc1,
                        enc2,
                        enc3,
                        enc4 = "",
                        i = 0;

                    do {
                        chr1 = input.charCodeAt(i += 1);
                        chr2 = input.charCodeAt(i += 1);
                        chr3 = input.charCodeAt(i += 1);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }

                        output = output +
                            keyStr.charAt(enc1) +
                            keyStr.charAt(enc2) +
                            keyStr.charAt(enc3) +
                            keyStr.charAt(enc4);
                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";
                    } while (i < input.length);

                    return output;
                },

                decode: function (input) {
                    var output = "",
                        chr1,
                        chr2,
                        chr3 = "",
                        enc1,
                        enc2,
                        enc3,
                        enc4 = "",
                        i = 0;

                    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                    var base64test = /[^A-Za-z0-9\+\/\=]/g;
                    if (base64test.exec(input)) {
                        window.alert("There were invalid base64 characters in the input text.\n" +
                                     "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                                     "Expect errors in decoding.");
                    }
                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                    do {
                        enc1 = keyStr.indexOf(input.charAt(i++));
                        enc2 = keyStr.indexOf(input.charAt(i++));
                        enc3 = keyStr.indexOf(input.charAt(i++));
                        enc4 = keyStr.indexOf(input.charAt(i++));

                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;

                        output = output + String.fromCharCode(chr1);

                        if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                        }

                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";

                    } while (i < input.length);

                    return output;
                }
            };

        /* jshint ignore:end */
    })
        .factory('ScheduleStaticDataService', [function () {
            var service = {};

            service.GetRepeateBys = function () {
                return [
                    { id: 1, name: 1 },
                    { id: 2, name: 2 },
                    { id: 3, name: 3 },
                    { id: 4, name: 4 },
                    { id: 5, name: 5 },
                    { id: 6, name: 6 },
                    { id: 7, name: 7 },
                    { id: 8, name: 8 },
                    { id: 9, name: 9 },
                    { id: 10, name: 10 },
                    { id: 11, name: 11 },
                    { id: 12, name: 12 },
                    { id: 13, name: 13 },
                    { id: 14, name: 14 },
                    { id: 15, name: 15 },
                    { id: 16, name: 16 },
                    { id: 17, name: 17 },
                    { id: 18, name: 18 },
                    { id: 19, name: 19 },
                    { id: 20, name: 20 },
                    { id: 21, name: 21 },
                    { id: 22, name: 22 },
                    { id: 23, name: 23 },
                    { id: 24, name: 24 },
                    { id: 25, name: 25 },
                    { id: 26, name: 26 },
                    { id: 27, name: 27 },
                    { id: 28, name: 28 },
                    { id: 29, name: 29 },
                    { id: 30, name: 20 },
                ];
            };

            service.GetRepeateType = function () {
                return [
                    { id: 1, name: 'Codziennie' },
                    { id: 2, name: 'W dni powszednie (od poniedzia\B3ku do pi\B9tku)' },
                    { id: 3, name: 'Co tydzie\F1' },
                    { id: 4, name: 'Co miesi\B9c' },
                    { id: 5, name: 'Co roku' }
                ];
            };

            return service;

        }])
        .factory('CalendarAPI', ['$http', function ($http) {
            var service = {};

            service.GetScheduleForDoctor = function () {

            };

            return service;
        }]);
}());
