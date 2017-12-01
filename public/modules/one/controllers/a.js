'use strict';

import angular from 'angular';
import _ from 'lodash';

const APPID_ANALYTICS = 'analytics';
const APPID_BOGUS = 'bogus';

class controller {

  constructor($scope, $stateParams, $state, $http, $interval, AppHubService, $translate) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$interval = $interval;
    this.apphubService = AppHubService;
    this.$state = $state;
    this.$translate = $translate;


    // if user preferred locale is provided
    // switch locale to stick to this locale regardless of accept-language header
    if (this.apphubService.getPreferredLocale()) {
      this.$translate.use(this.apphubService.getPreferredLocale());
    }

    const analyticsTemp = this.apphubService.getPath(APPID_ANALYTICS);
    const bogusTemp = this.apphubService.getPath(APPID_BOGUS);

    // this.url = window.nav.paths['analytics'] +"/#";
    this.analyticsUrl = `${analyticsTemp}/#`;
    this.chromelessAnalyticsUrl = `${analyticsTemp}/?chromeless=true`;
    this.bogusUrl = `${bogusTemp}/#`;

    this.analyticsUnavailable = !this.apphubService.appAvailable(APPID_ANALYTICS);
    this.bogusUnavailable = !this.apphubService.appAvailable(APPID_BOGUS);

    this.thresholds = { ll: 20, l: 35, h: 70, hh: 85 };
    this.dynamicThresholds = { h: 60, hh: 80 };

    // DYNAMICALLY UPDATING CHARTS
    const numCols = 30;
    const numCharts = 1;
    this.interval = 1000;

    // This function generates a value between 0-100 which is a random distance
    // above or below the last value for oldValue. It then updates oldValue with
    // this new value.
    const getNewValue = (oldValue) => {
      let diff;
      if (oldValue < 5) {
        diff = _.sample([2, 4, 6, 8, 10]);
      } else if (oldValue > 95) {
        diff = _.sample([-10, -8, -6, -4, -2]);
      } else {
        diff = _.sample([-10, -8, -6, -4, -2, 2, 4, 6, 8, 10]);
      }
      let v = oldValue + diff;
      if (v < 0) { v = 0; }
      if (v > 100) { v = 100; }
      return v;
    };

    // Update the chart at intervals
    this.setUpdate = (interval) => {
      this.$interval(() => {
        for (let i = 0; i < numCharts; i++) {
          const newValue = getNewValue(this[`dynamic${i}`][numCols].value);
          this[`dynamic${i}`].splice(0, 1);
          this[`dynamic${i}`].push({ name: 'now', value: newValue });
        }
      }, interval);
    };

    // Initialize the charts with zero values;
    for (let i = 0; i < numCharts; i++) {
      const colNames = [];
      for (let j = numCols; j >= 0; j--) { colNames.push(j); }
      const arr = [];
      // Initial values are zero
      for (let k = 0; k < colNames.length - 1; k++) {
        arr.push({
          name: colNames[k],
          value: 0,
        });
      }
      arr.push({ name: 'now', value: 0 });
      this[`dynamic${i}`] = arr;
    }

    this.setUpdate(300);

    this.init();
  }

  openMymodal() {
    // This is ugly. Is there another way to handle polymer dom stuff?
    Polymer.dom(document).querySelector('#mymodal').modalButtonClicked();
  }

  init() {
    const self = this;
    // // Populate the gauges
    // this.$http.get('service/api/').then((response) => {
    //   console.log('headers received by stub service:', response.data.headers);
    //   this.data = response.data;
    // });

    // // TEST GET
    // this.$http.get('querytest/', {
    //   params: {
    //     baz: 'wibble',
    //   },
    // }).then((response) => {
    //   console.log('querytest response', response);
    // });

    // // TEST POST
    // this.$http({
    //   method: 'POST',
    //   url: 'posttest',
    //   data: {
    //     baz: 'wibble',
    //   },
    //   headers: { 'Content-Type': 'application/json' },
    // }).then((response) => {
    //   console.log('posttest response', response);
    // });

    // // Timeout test
    // this.$http.get('service/delay/10', {
    //   headers: {
    //     timeout: 2000,
    //   },
    // }).then((response) => {
    //   console.log(`data received by delay service: "${response.data}"`);
    //   this.timeoutdata = response.data;
    // }).catch(() => {
    //   console.log('delay service request timed out:');
    //   this.timeoutdata = 'timed out';
    // });

    this.$http.get('general-data/get/').then((response) => {
      console.log('Anirban Testing', response);
      //this.data = response.data;
    });


    console.log('a controller initialized with stateParams', this.$stateParams);

    const currentState = this.$state.current.name;

    // === Notification ==

    // Example #1
    const messageObj = {
      type: 'blue',
      isPersistent: false,
      icon: 'info-circle',
      text: `You have chosen to view ${currentState} section`,
    };

    // Example #2
    // These examples use ng-click to trigger notification

    this.$scope.click2Notify = () => {
      const messageObj2 = {
        type: 'red',
        isPersistent: false,
        icon: 'compass',
        text: 'Alert! system needs attention',
      };
      self.apphubService.notify(messageObj2);
    };

    this.notifierCallback = () => {
      console.log('Hey, notifierCallback called');
    };


    this.$scope.click2Notify1 = () => {
      const messageObj3 = {
        type: 'green',
        isPersistent: true,
        icon: 'leaf',
        text: 'We kind of discourage this much content but knock yourself out! Just keep talking' +
          ' and talking and talking and this area will keep expanding and expanding.',
        actionLabel: 'Accept',
        actionCallback: self.notifierCallback,
      };
      self.apphubService.notify(messageObj3);
    };

    this.notifierCallback2 = () => {
      console.log('Hey, notifierCallback 2 called');
    };


    this.$scope.click2Notify2 = () => {
      const messageObj4 = {
        type: 'red',
        isPersistent: true,
        icon: 'exclamation-circle',
        text: 'Red Alert! Your system needs maintenance!',
        actionLabel: 'OK',
        timestamp: '9:55 AM',
        actionCallback: self.notifierCallback2,
      };
      self.apphubService.notify(messageObj4);
    };

    this.$scope.click2Notify3 = () => {
      const messageObj5 = {
        type: 'orange',
        isPersistent: true,
        icon: 'compass',
        text: 'It can be this long or longer if you want. In fact, it can be really, really long' +
          ' if you have a lot you want to say. We kind of discourage this much content but knock' +
          ' yourself out! Just keep talking and talking and talking and this area will keep' +
          ' expanding and expanding.',
        actionLabel: 'Go to Google',
        actionLink: 'http://www.google.com',
        timestamp: '9:36 AM',
      };
      self.apphubService.notify(messageObj5);
    };

    // Example #3 use Custom Event to pass the notification message
    this.$scope.click2Notify4 = () => {
      const messageObj6 = {
        type: 'orange',
        isPersistent: true,
        icon: 'compass',
        text: 'Just keep talking and talking and talking and this area will keep expanding and' +
          ' expanding.',
        actionLabel: 'Go to Google',
        actionLink: 'http://www.google.com',
        timestamp: '9:36 AM',
      };
      const event = new CustomEvent('apphub.notify', { detail: { message: messageObj6 } });
      window.dispatchEvent(event);
    };

    this.$scope.removeAll = () => {
      self.apphubService.removeAllNotification();
    };

    this.$scope.isCookieSet = false;
    this.$scope.setCookie = () => {
      this.$http.get(`setCookie/ ${this.$scope.cName}/${this.$scope.cValue}`, {}).then((resp) => {
        this.$scope.isCookieSet = true;
      }).catch(() => {
        console.log('error setting the cookie');
      });
    };

    this.$scope.getCookie = () => {
      this.$http.get('getCookies/', {}).then((resp) => {
        this.$scope.cookieResponse = JSON.parse(resp.data);
      }).catch(() => {
        console.log('error getting the cookies');
      });
    };
  }

}

// Strict DI for minification (order is important)
controller.$inject = ['$scope', '$stateParams', '$state', '$http', '$interval', 'AppHubService', '$translate'];

export default controller;
