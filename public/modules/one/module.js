'use strict';

import angular from 'angular';
import 'angular-ui-router';

// TODO load these modules with jspm
import GaugeLinearModule from '../../bower_components/gauge-linear/dist/module';
import ChartColumnModule from '../../bower_components/chart-column/dist/module';

// Controllers
import ACtrl from './controllers/a';
import ExampleSocketioCtrl from './controllers/example-socket-io-controller';

// Directives
import ScrollDown from './directives/scrolldown';

// Views
import TemplateA from './views/a.html!text';
import SubNavTemplate1 from './views/subnav1.html!text';
import SubNavTemplate2 from './views/subnav2.html!text';
import SocketIOTemplate from './views/socketio.html!text';

/**
 * @ngdoc object
 * @name OneModule
 * @description
 * A module skeleton.
 * @example
 * ```
    import OneModule from './<path to here>/module.js';
    let AppModule = angular.module('app', ['OneModule']);
 * ```
 */
const OneModule = angular.module('OneModule', [
  'GaugeLinearModule',
  'ChartColumnModule',
  'ui.router',
  'scrollDown'
])

  // Controllers
  .controller('ACtrl', ACtrl)
  .controller('ExampleSocketioCtrl', ExampleSocketioCtrl)

  // Routes
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider
      .state('a', {
        url: '/',
        controller: 'ACtrl',
        template: TemplateA,
        controllerAs: 'vm'
      })
      .state('subnav1', {
        url: '/subnav1',
        controller: 'ACtrl',
        template: SubNavTemplate1,
        controllerAs: 'vm'
      })
      .state('subnav2', {
        url: '/subnav2',
        controller: 'ACtrl',
        template: SubNavTemplate2,
        controllerAs: 'vm'
      })
      .state('socketio', {
        url: '/socketio',
        controller: 'ExampleSocketioCtrl',
        template: SocketIOTemplate,
        controllerAs: 'vm'
      })
      .state('detail', {
        url: '/detail/3',
        controller: 'ACtrl',
        template: SubNavTemplate1,
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        controller: 'ACtrl',
        template: SubNavTemplate1,
        controllerAs: 'vm'
      })
      .state('profile', {
        url: '/profile',
        controller: 'ACtrl',
        template: SubNavTemplate2,
        controllerAs: 'vm'
      })
      .state('detail-4th', {
        url: '/detail/4',
        controller: 'ACtrl',
        template: SubNavTemplate2,
        controllerAs: 'vm'
      });
  }]);

export default OneModule;
