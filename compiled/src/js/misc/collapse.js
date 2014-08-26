define([], function() {
  "use strict";
  angular.module('uiRouterSample').directive('collapse', ['$transition', function($transition) {
    return {link: function(scope, element, attrs) {
        var initialAnimSkip = true;
        var currentTransition;
        function doTransition(change) {
          var newTransition = $transition(element, change);
          if (currentTransition) {
            currentTransition.cancel();
          }
          currentTransition = newTransition;
          newTransition.then(newTransitionDone, newTransitionDone);
          return newTransition;
          function newTransitionDone() {
            if (currentTransition === newTransition) {
              currentTransition = undefined;
            }
          }
        }
        function expand() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            expandDone();
          } else {
            element.removeClass('collapse').addClass('collapsing');
            doTransition({height: element[0].scrollHeight + 'px'}).then(expandDone);
          }
        }
        function expandDone() {
          element.removeClass('collapsing');
          element.addClass('collapse in');
          element.css({height: 'auto'});
        }
        function collapse() {
          if (initialAnimSkip) {
            initialAnimSkip = false;
            collapseDone();
            element.css({height: 0});
          } else {
            element.css({height: element[0].scrollHeight + 'px'});
            var x = element[0].offsetWidth;
            element.removeClass('collapse in').addClass('collapsing');
            doTransition({height: 0}).then(collapseDone);
          }
        }
        function collapseDone() {
          element.removeClass('collapsing');
          element.addClass('collapse');
        }
        scope.$watch(attrs.collapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }};
  }]).factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {
    var $transition = function(element, trigger, options) {
      options = options || {};
      var deferred = $q.defer();
      var endEventName = $transition[$traceurRuntime.toProperty(options.animation ? 'animationEndEventName' : 'transitionEndEventName')];
      var transitionEndHandler = function(event) {
        $rootScope.$apply(function() {
          element.unbind(endEventName, transitionEndHandler);
          deferred.resolve(element);
        });
      };
      if (endEventName) {
        element.bind(endEventName, transitionEndHandler);
      }
      $timeout(function() {
        if (angular.isString(trigger)) {
          element.addClass(trigger);
        } else if (angular.isFunction(trigger)) {
          trigger(element);
        } else if (angular.isObject(trigger)) {
          element.css(trigger);
        }
        if (!endEventName) {
          deferred.resolve(element);
        }
      });
      deferred.promise.cancel = function() {
        if (endEventName) {
          element.unbind(endEventName, transitionEndHandler);
        }
        deferred.reject('Transition cancelled');
      };
      return deferred.promise;
    };
    var transElement = document.createElement('trans');
    var transitionEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'transition': 'transitionend'
    };
    var animationEndEventNames = {
      'WebkitTransition': 'webkitAnimationEnd',
      'MozTransition': 'animationend',
      'OTransition': 'oAnimationEnd',
      'transition': 'animationend'
    };
    function findEndEventName(endEventNames) {
      for (var name in endEventNames) {
        if (transElement.style[$traceurRuntime.toProperty(name)] !== undefined) {
          return endEventNames[$traceurRuntime.toProperty(name)];
        }
      }
    }
    $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
    $transition.animationEndEventName = findEndEventName(animationEndEventNames);
    return $transition;
  }]);
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWlzYy9jb2xsYXBzZS5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL21pc2MvY29sbGFwc2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ3VpUm91dGVyU2FtcGxlJylcbiAgLmRpcmVjdGl2ZSgnY29sbGFwc2UnLCBbJyR0cmFuc2l0aW9uJywgZnVuY3Rpb24gKCR0cmFuc2l0aW9uKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICAgIHZhciBpbml0aWFsQW5pbVNraXAgPSB0cnVlO1xuICAgICAgICB2YXIgY3VycmVudFRyYW5zaXRpb247XG5cbiAgICAgICAgZnVuY3Rpb24gZG9UcmFuc2l0aW9uKGNoYW5nZSkge1xuICAgICAgICAgIHZhciBuZXdUcmFuc2l0aW9uID0gJHRyYW5zaXRpb24oZWxlbWVudCwgY2hhbmdlKTtcbiAgICAgICAgICBpZiAoY3VycmVudFRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgIGN1cnJlbnRUcmFuc2l0aW9uLmNhbmNlbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50VHJhbnNpdGlvbiA9IG5ld1RyYW5zaXRpb247XG4gICAgICAgICAgbmV3VHJhbnNpdGlvbi50aGVuKG5ld1RyYW5zaXRpb25Eb25lLCBuZXdUcmFuc2l0aW9uRG9uZSk7XG4gICAgICAgICAgcmV0dXJuIG5ld1RyYW5zaXRpb247XG5cbiAgICAgICAgICBmdW5jdGlvbiBuZXdUcmFuc2l0aW9uRG9uZSgpIHtcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBpdCdzIHRoaXMgdHJhbnNpdGlvbiwgb3RoZXJ3aXNlLCBsZWF2ZSBpdCBhbG9uZS5cbiAgICAgICAgICAgIGlmIChjdXJyZW50VHJhbnNpdGlvbiA9PT0gbmV3VHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICBjdXJyZW50VHJhbnNpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBleHBhbmQoKSB7XG4gICAgICAgICAgaWYgKGluaXRpYWxBbmltU2tpcCkge1xuICAgICAgICAgICAgaW5pdGlhbEFuaW1Ta2lwID0gZmFsc2U7XG4gICAgICAgICAgICBleHBhbmREb25lKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJykuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKTtcbiAgICAgICAgICAgIGRvVHJhbnNpdGlvbih7IGhlaWdodDogZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgKyAncHgnIH0pLnRoZW4oZXhwYW5kRG9uZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwYW5kRG9uZSgpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJyk7XG4gICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnY29sbGFwc2UgaW4nKTtcbiAgICAgICAgICBlbGVtZW50LmNzcyh7aGVpZ2h0OiAnYXV0byd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbGxhcHNlKCkge1xuICAgICAgICAgIGlmIChpbml0aWFsQW5pbVNraXApIHtcbiAgICAgICAgICAgIGluaXRpYWxBbmltU2tpcCA9IGZhbHNlO1xuICAgICAgICAgICAgY29sbGFwc2VEb25lKCk7XG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7aGVpZ2h0OiAwfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIENTUyB0cmFuc2l0aW9ucyBkb24ndCB3b3JrIHdpdGggaGVpZ2h0OiBhdXRvLCBzbyB3ZSBoYXZlIHRvIG1hbnVhbGx5IGNoYW5nZSB0aGUgaGVpZ2h0IHRvIGEgc3BlY2lmaWMgdmFsdWVcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgaGVpZ2h0OiBlbGVtZW50WzBdLnNjcm9sbEhlaWdodCArICdweCcgfSk7XG4gICAgICAgICAgICAvL3RyaWdnZXIgcmVmbG93IHNvIGEgYnJvd3NlciByZWFsaXplcyB0aGF0IGhlaWdodCB3YXMgdXBkYXRlZCBmcm9tIGF1dG8gdG8gYSBzcGVjaWZpYyB2YWx1ZVxuICAgICAgICAgICAgdmFyIHggPSBlbGVtZW50WzBdLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZSBpbicpLmFkZENsYXNzKCdjb2xsYXBzaW5nJyk7XG5cbiAgICAgICAgICAgIGRvVHJhbnNpdGlvbih7IGhlaWdodDogMCB9KS50aGVuKGNvbGxhcHNlRG9uZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29sbGFwc2VEb25lKCkge1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKTtcbiAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdjb2xsYXBzZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLmNvbGxhcHNlLCBmdW5jdGlvbiAoc2hvdWxkQ29sbGFwc2UpIHtcbiAgICAgICAgICBpZiAoc2hvdWxkQ29sbGFwc2UpIHtcbiAgICAgICAgICAgIGNvbGxhcHNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cGFuZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pXG4gIC5mYWN0b3J5KCckdHJhbnNpdGlvbicsIFsnJHEnLCAnJHRpbWVvdXQnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgJHJvb3RTY29wZSkge1xuXG4gIHZhciAkdHJhbnNpdGlvbiA9IGZ1bmN0aW9uKGVsZW1lbnQsIHRyaWdnZXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgIHZhciBlbmRFdmVudE5hbWUgPSAkdHJhbnNpdGlvbltvcHRpb25zLmFuaW1hdGlvbiA/ICdhbmltYXRpb25FbmRFdmVudE5hbWUnIDogJ3RyYW5zaXRpb25FbmRFdmVudE5hbWUnXTtcblxuICAgIHZhciB0cmFuc2l0aW9uRW5kSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbWVudC51bmJpbmQoZW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kSGFuZGxlcik7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoZWxlbWVudCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGVuZEV2ZW50TmFtZSkge1xuICAgICAgZWxlbWVudC5iaW5kKGVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZEhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8vIFdyYXAgaW4gYSB0aW1lb3V0IHRvIGFsbG93IHRoZSBicm93c2VyIHRpbWUgdG8gdXBkYXRlIHRoZSBET00gYmVmb3JlIHRoZSB0cmFuc2l0aW9uIGlzIHRvIG9jY3VyXG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIGFuZ3VsYXIuaXNTdHJpbmcodHJpZ2dlcikgKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3ModHJpZ2dlcik7XG4gICAgICB9IGVsc2UgaWYgKCBhbmd1bGFyLmlzRnVuY3Rpb24odHJpZ2dlcikgKSB7XG4gICAgICAgIHRyaWdnZXIoZWxlbWVudCk7XG4gICAgICB9IGVsc2UgaWYgKCBhbmd1bGFyLmlzT2JqZWN0KHRyaWdnZXIpICkge1xuICAgICAgICBlbGVtZW50LmNzcyh0cmlnZ2VyKTtcbiAgICAgIH1cbiAgICAgIC8vSWYgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRyYW5zaXRpb25zLCBpbnN0YW50bHkgcmVzb2x2ZVxuICAgICAgaWYgKCAhZW5kRXZlbnROYW1lICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIG91ciBjdXN0b20gY2FuY2VsIGZ1bmN0aW9uIHRvIHRoZSBwcm9taXNlIHRoYXQgaXMgcmV0dXJuZWRcbiAgICAvLyBXZSBjYW4gY2FsbCB0aGlzIGlmIHdlIGFyZSBhYm91dCB0byBydW4gYSBuZXcgdHJhbnNpdGlvbiwgd2hpY2ggd2Uga25vdyB3aWxsIHByZXZlbnQgdGhpcyB0cmFuc2l0aW9uIGZyb20gZW5kaW5nLFxuICAgIC8vIGkuZS4gaXQgd2lsbCB0aGVyZWZvcmUgbmV2ZXIgcmFpc2UgYSB0cmFuc2l0aW9uRW5kIGV2ZW50IGZvciB0aGF0IHRyYW5zaXRpb25cbiAgICBkZWZlcnJlZC5wcm9taXNlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCBlbmRFdmVudE5hbWUgKSB7XG4gICAgICAgIGVsZW1lbnQudW5iaW5kKGVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZEhhbmRsZXIpO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQucmVqZWN0KCdUcmFuc2l0aW9uIGNhbmNlbGxlZCcpO1xuICAgIH07XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICAvLyBXb3JrIG91dCB0aGUgbmFtZSBvZiB0aGUgdHJhbnNpdGlvbkVuZCBldmVudFxuICB2YXIgdHJhbnNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHJhbnMnKTtcbiAgdmFyIHRyYW5zaXRpb25FbmRFdmVudE5hbWVzID0ge1xuICAgICdXZWJraXRUcmFuc2l0aW9uJzogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICdNb3pUcmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnLFxuICAgICdPVHJhbnNpdGlvbic6ICdvVHJhbnNpdGlvbkVuZCcsXG4gICAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCdcbiAgfTtcbiAgdmFyIGFuaW1hdGlvbkVuZEV2ZW50TmFtZXMgPSB7XG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAnTW96VHJhbnNpdGlvbic6ICdhbmltYXRpb25lbmQnLFxuICAgICdPVHJhbnNpdGlvbic6ICdvQW5pbWF0aW9uRW5kJyxcbiAgICAndHJhbnNpdGlvbic6ICdhbmltYXRpb25lbmQnXG4gIH07XG4gIGZ1bmN0aW9uIGZpbmRFbmRFdmVudE5hbWUoZW5kRXZlbnROYW1lcykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gZW5kRXZlbnROYW1lcyl7XG4gICAgICBpZiAodHJhbnNFbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGVuZEV2ZW50TmFtZXNbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gICR0cmFuc2l0aW9uLnRyYW5zaXRpb25FbmRFdmVudE5hbWUgPSBmaW5kRW5kRXZlbnROYW1lKHRyYW5zaXRpb25FbmRFdmVudE5hbWVzKTtcbiAgJHRyYW5zaXRpb24uYW5pbWF0aW9uRW5kRXZlbnROYW1lID0gZmluZEVuZEV2ZW50TmFtZShhbmltYXRpb25FbmRFdmVudE5hbWVzKTtcbiAgcmV0dXJuICR0cmFuc2l0aW9uO1xufV0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9