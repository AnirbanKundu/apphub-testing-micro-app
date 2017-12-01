import angular from 'angular';
import * as gauge from './gauge-linear';

/**
 * @ngdoc object
 * @name Linear Gauge Module
 * @description
 * This Angular module creates a directive which exposes the functionality
 * in the the accompanying gauge-linear.js file.
 * If the 'value','errorHigh','errorLow', or 'reference' attributes change,
 * the gauge will redraw to reflect the new values.
 * @example
 * ```
    import GaugeLinearModule from './<path to dist>/module.js';
    let AppModule = angular.module('app', ['GaugeLinearModule']);
 * ```
 * In your template:
 * ```
<gauge-linear
  value="85"
  reference="82"
  baseline="50"
  error-high="88"
  error-low="81"
  labels="0,50,100"
  max="100"
  min="0"
  thresholds='{"h":80,"hh":90}'
  colors='{"h":"#b1b1bc"}'
  width="300"
  height="35"></gauge-linear>
 * ```
 */


// =================================================================
// FUNCTIONS
// We do this here so we can use $inject

function controller($scope){
  // Live updates. If the data changes, re-render the gauge.
  $scope.$watchGroup(['value','errorHigh','errorLow','reference','labels'], (newParams, oldParams) => {
    // Value has changed
    if(newParams[0] !== oldParams[0]){
      $scope.updateValue(parseFloat(newParams[0]));
    }
    // Error has changed
    if(newParams[1] !== oldParams[1] || newParams[2] !== oldParams[2]){
      $scope.updateErrorBars(parseFloat(newParams[1]), parseFloat(newParams[2]));
    }
    // Reference has changed
    if(newParams[3] !== oldParams[3]){
      $scope.updateReference(parseFloat(newParams[3]));
    }
    // Labels have changed
    if(newParams[4] !== oldParams[4]){
      $scope.updateLabels(newParams[4].split(','));
    }
  });
}
controller.$inject = ['$scope']; // Strict DI

// =================================================================
// MODULE DEFINITION

let module = angular.module('GaugeLinearModule', [])
  .directive('gaugeLinear', function(){
    return {
      controller: controller,
      scope: {
        value: '@',
        errorHigh: '@',
        errorLow: '@',
        labels: '@',
        thresholds: '@',
        colors: '@',
        reference: '@',
        baseline: '@',
        max: '@',
        min: '@',
        width: '@',
        height: '@'
      },
      link: gauge.link // imported from gauge-linear.js
    };
  })
  .run([function(){}]);

export default module;
