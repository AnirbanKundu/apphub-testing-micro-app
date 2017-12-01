'use strict';

import angular from 'angular';
import io from 'socket.io-client';

class controller {

  constructor($scope, $stateParams, $state, $document, $q, $http, $timeout, $interval, AppHubService, $translate) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$interval = $interval;
    this.apphubService = AppHubService;
    this.$state = $state;
    this.$document = $document;
    this.$q = $q;

    this.socket = null;
    this.isConnected = false;
    this.name = '';
    this.msgList = [];
    this.msg;
    this.$translate = $translate;

    //if user preferred locale is provided
    //switch locale to stick to this locale regardless of accept-language header
    if(this.apphubService.getPreferredLocale()){
      this.$translate.use(this.apphubService.getPreferredLocale());
    }

    this.makeId = () => {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    this.submitFn = () => {
      let from = this.name;
      let message = this.msg;
      if(message != '') {
        this.socket.emit('chatMessage', from, message);
      }

      this.msg = '';
      return false;
    };


    this.init();
  }

  notifyTyping(e) {
    // Ignore Enter key presses.
    if (e.keyCode !== 13) {
      this.userIsTyping = this.name;
      this.socket.emit('notifyUser', this.userIsTyping);
    }
  }

  connectToSocket() {
    const self = this;

    // To make this more protractor friendly lets use a promise so protractor will know to wait until after the promise is resolved.
    var connectionQ = self.$q.defer();

    var currentDomain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    var subPath = window.location.pathname ? window.location.pathname : '';

    self.socket = io(currentDomain,{path: subPath +'demo',transports : ['websocket'],'forceNew':true });

    self.socket.on('connect', function(msg){
      // Once connected set the UI focus on our input box.
      self.$scope.$evalAsync(() => {
        self.name = self.makeId();
        self.isConnected = true;
        self.socket.emit('chatMessage', 'System', self.name + ' has joined the discussion');
        console.log('attributes: ', self.$document[0].getElementById('sio-msg-input-box').attributes);
      });
      // Give ng-disable a chance to calculate then focus on the input box.
      self.$timeout(() => {
        console.log('focus');
        self.$document[0].getElementById('sio-msg-input-box').focus();
        connectionQ.resolve();
      },0);
    });
    // To make this more protractor friendly lets use a promise so protractor will know to wait until after the promise is resolved.
    connectionQ.promise.then( () => {
      console.log('Socket.IO: Connected');
    });

    self.socket.on("disconnect", function(){
      console.log("client disconnected from server");
      self.$scope.$evalAsync(() => {
        self.isConnected = false;
        self.userIsTyping = false;
      });
    });

    self.socket.on('chatMessage', (f, msg) => {
      let color = (f == self.name) ? 'green' : '#009afd';
      let from = (f == self.name) ? 'Me' : f;

      self.$scope.$evalAsync(() => {
        self.msgList.push({color: color, from: from, msg: msg});
        self.userIsTyping = false;
      });
    });

    self.socket.on('notifyTime', function(from, msg){
      var serverMsgcolor = '#009afd';

      self.$scope.$evalAsync(() => {
        self.msgList.push({color: serverMsgcolor, from: from, msg: msg});
      });
    });

    self.socket.on('notifyUser', function(user){
      if(user != self.name) {
        self.userIsTyping = user;
      }
      self.$scope.$evalAsync(() => {
      });
    });

  }

  init() {
    const self = this;
    self.isConnected = false;
  }

  disconnectSocket() {
    const self = this;

    self.socket.emit('chatMessage', 'System', self.name + ' has left the discussion');
    self.socket.disconnect();
  }

  connectBtnClick() {
    const self = this;
    if ( self.isConnected ) {
      self.disconnectSocket();
    } else {
      self.connectToSocket();
    }
  }
} // End Controller {}

// Strict DI for minification (order is important)
controller.$inject = ['$scope', '$stateParams', '$state', '$document', '$q', '$http', '$timeout', '$interval', 'AppHubService','$translate'];

export default controller;
