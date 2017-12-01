// This is a simple directive to scroll our chat window down when any new content is added.
import angular from 'angular';


angular.module('scrollDown', [])
  .directive('scrollDown', function () {
    return {
      scope: {
        scrollDown: "="
      },
      link: function (scope, el) {
        scope.$watchCollection('scrollDown', function (newValue) {
          if (newValue) {
            el[0].scrollTop = el[0].scrollHeight;
          }
        });
      }
    }
  });