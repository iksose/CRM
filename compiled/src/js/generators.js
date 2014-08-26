define([], function() {
  "use strict";
  'use strict';
  var $__2 = $traceurRuntime.initGeneratorFunction(entries),
      $__3 = $traceurRuntime.initGeneratorFunction(keys),
      $__4 = $traceurRuntime.initGeneratorFunction(take),
      $__5 = $traceurRuntime.initGeneratorFunction(values);
  function entries(obj) {
    var $__0,
        $__1,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__0 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__1 = $__0.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__1.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return [key, obj[$traceurRuntime.toProperty(key)]];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__2, this);
  }
  function keys(obj) {
    var $__0,
        $__1,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__0 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__1 = $__0.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__1.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return key;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__3, this);
  }
  function take(iterator, n) {
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (n > 0) ? 1 : -2;
            break;
          case 1:
            $ctx.state = 2;
            return iterator.next();
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            n--;
            $ctx.state = 0;
            break;
          default:
            return $ctx.end();
        }
    }, $__4, this);
  }
  function values(obj) {
    var $__0,
        $__1,
        key;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__0 = Object.keys(obj)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = (!($__1 = $__0.next()).done) ? 9 : -2;
            break;
          case 9:
            $ctx.pushTry(7, null);
            $ctx.state = 10;
            break;
          case 10:
            throw undefined;
            $ctx.state = 12;
            break;
          case 12:
            $ctx.popTry();
            $ctx.state = 14;
            break;
          case 7:
            $ctx.popTry();
            key = $ctx.storedException;
            $ctx.state = 5;
            break;
          case 5:
            key = $__1.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return obj[$traceurRuntime.toProperty(key)];
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 14;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    },
    __esModule: true
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvZ2VuZXJhdG9ycy5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL2dlbmVyYXRvcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbi8vIFRoaXMgbW9kdWxlIGRlZmluZXMgc2V2ZXJhbCB1c2VmdWwgZ2VuZXJhdG9ycyxcbi8vIG5vdCBhbGwgb2Ygd2hpY2ggYXJlIHVzZWQgaW4gdGhlIFRvZG8gYXBwLlxuXG4vLyBBIGdlbmVyYXRvciBmb3IgaXRlcmF0aW5nIG92ZXIgdGhlIGtleS92YWx1ZSBwYWlycyBpbiBhbiBvYmplY3QuXG5leHBvcnQgZnVuY3Rpb24qIGVudHJpZXMob2JqKSB7XG4gIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgeWllbGQgW2tleSwgb2JqW2tleV1dO1xuICB9XG59XG5cbi8vIEEgZ2VuZXJhdG9yIGZvciBpdGVyYXRpbmcgb3ZlciB0aGUga2V5cyBpbiBhbiBvYmplY3QuXG5leHBvcnQgZnVuY3Rpb24qIGtleXMob2JqKSB7XG4gIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgeWllbGQga2V5O1xuICB9XG59XG5cbi8vIEEgZ2VuZXJhdG9yIHRoYXQgeWllbGRzIHRoZSBmaXJzdCBuIHZhbHVlcyBvZiBhbiBpdGVyYXRvci5cbmZ1bmN0aW9uKiB0YWtlKGl0ZXJhdG9yLCBuKSB7XG4gIHdoaWxlIChuID4gMCkge1xuICAgIHlpZWxkIGl0ZXJhdG9yLm5leHQoKTtcbiAgICBuLS07XG4gIH1cbn1cblxuLy8gQSBnZW5lcmF0b3IgZm9yIGl0ZXJhdGluZyBvdmVyIHRoZSB2YWx1ZXMgaW4gYW4gb2JqZWN0LlxuZXhwb3J0IGZ1bmN0aW9uKiB2YWx1ZXMob2JqKSB7XG4gIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgeWllbGQgb2JqW2tleV07XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==