'use strict';

/* global document, Messages */

// Framework dependencies
import angular from 'angular';
import 'angular-ui-router';
import 'angular-translate';
import 'angular-translate-loader-static-files';

// Application Modules
import AppHubModule from 'hubs/ng-apphub-service';
import OneModule from './modules/one/module';

// Main Application Controller
import AppCtrl from './app-controller';

/**
 * @ngdoc object
 * @name AppModule
 * @description
 * Create our application, inject dependencies, and configure route behavior
 * NOTE: Injected modules will add their own routes
 */
const AppModule = angular.module('app', [
  'ui.router',
  'OneModule',
  'AppHubModule',
  'pascalprecht.translate'
]).controller('AppCtrl', AppCtrl)
  .config(['$locationProvider', '$httpProvider', '$urlRouterProvider', '$stateProvider', '$translateProvider',
    ($locationProvider, $httpProvider, $urlRouterProvider, $stateProvider, $translateProvider) => {
      // Disabling html5 mode until we can sort out the weird replace-last-char-with-'/' issue
      // $locationProvider.html5Mode({
      //   enabled: true, // http://stackoverflow.com/questions/27307914/angular-error-running-karma-tests-html5-mode-requires-a-base-tag
      //   requireBase: true
      // }).hashPrefix('!');

      // Batch multiple $http requests around the same time into one $digest
      $httpProvider.useApplyAsync(true);

      // This is your default route. User will get redirected
      // here if they type a weird route into the location bar.
      $urlRouterProvider.otherwise(($injector) => {
        const $state = $injector.get('$state');
        // document.querySelector('px-app-nav').markSelected('main');
        $state.go('a');
      });

      $translateProvider
        .useStaticFilesLoader({
          prefix: 'locales/locale-',
          suffix: '.json'
        })
        .useSanitizeValueStrategy(null)
        .registerAvailableLanguageKeys(['ar', 'de', 'en', 'es', 'zh', 'hi'], {
          'en_US': 'en',
          'en_UK': 'en',
          'zh_CN': 'zh'
        }).fallbackLanguage('en')
        .determinePreferredLanguage();
    }
  ]);

// Bootstrap our application once all that stuff is loaded
angular.element(document).ready(() => {
  angular.bootstrap(document.querySelector('#content'), [AppModule.name], {
    strictDi: true // https://docs.angularjs.org/guide/di
  });
});

export default AppModule;
