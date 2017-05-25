(function () {
    'use strict';

    /*global angular */
    angular.module('Radio', ['Common', 'ui.bootstrap'])
        .factory('RadioAPI', ['$http', 'ApiAdress', function ($http, ApiAdress) {
            return {
                playStation: function (id) {
                    return $http.get(ApiAdress + '/radio/start/' + id);
                },
                stopRadio: function () {
                    return $http.get(ApiAdress + '/radio/stop');
                },
                getPlaylist: function () {
                    return $http.get(ApiAdress + '/radio/playlist');
                },
                addPlaylist: function (title) {
                    return $http.post(ApiAdress + '/radio/playlist/add', { name: title });
                },
                removePlaylist: function (title) {
                    return $http.delete(ApiAdress + '/radio/playlist/remove/' + title);
                },
                playPlaylist: function () {
                    return $http.get(ApiAdress + '/radio/playlist/start');
                },
                radioList: function () {
                    return $http.get(ApiAdress + '/radio/list');
                }
            };
        }])
        .controller('RadioController', ['$scope', 'RadioAPI', '$timeout', function ($scope, RadioAPI, $timeout) {
            $scope.dataLoading = true;

            RadioAPI.radioList().then(function (response) {
                $scope.radioList = response.data;
                $scope.dataLoading = false;

            }, function () {
                $scope.dataLoading = false;
                $scope.error = 'Wystąpił błąd podczas pobiernia listy radio stacji.';
            });

            RadioAPI.getPlaylist().then(function (response) {
                $scope.tracks = response.data;
                $scope.dataLoading = false;
            }, function (parameters) {
                $scope.dataLoading = false;
            });

            $scope.playPlaylist = function () {
                $scope.dataLoading = true;
                RadioAPI.playPlaylist().then(function () {
                    $scope.dataLoading = false;
                }, function (parameters) {
                    $scope.dataLoading = false;
                });
            };

            $scope.addPlaylist = function (title) {
                RadioAPI.addPlaylist(title).then(function () {
                    $scope.tracks.filter(function (item) {
                        if (item.name === title) {
                            item.present = true;
                        }
                    });
                });
            };

            $scope.removePlaylist = function (title) {
                RadioAPI.removePlaylist(title).then(function () {
                    $scope.tracks.filter(function (item) {
                        if (item.name === title) {
                            item.present = false;
                        }
                    });
                });
            };

            $scope.play = function (id) {
                $scope.dataLoading = true;
                RadioAPI.playStation(id).then(function () {
                    $timeout(function () {
                        $scope.dataLoading = false;
                    }, 2500);
                }, function () {
                    $scope.dataLoading = false;
                });
            };

            $scope.stop = function () {
                $scope.dataLoading = true;

                RadioAPI.stopRadio().then(function () {
                    $scope.dataLoading = false;
                }, function () {
                    $scope.dataLoading = false;
                });
            };
        }]);
}());