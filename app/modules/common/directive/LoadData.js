(function () {
    'use strict';
    
    /*global angular */
    angular.module('Common')
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
        });
}());