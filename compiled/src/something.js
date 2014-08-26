define(["assert"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {'default': $__0};
  var assert = $__0.assert;
  var Something = function Something() {};
  ($traceurRuntime.createClass)(Something, {sum: function(a, b) {
      assert.argumentTypes(a, $traceurRuntime.type.number, b, $traceurRuntime.type.number);
      return assert.returnType((a + b), $traceurRuntime.type.number);
    }}, {});
  Something.prototype.sum.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.number]];
  ;
  return {
    get Something() {
      return Something;
    },
    __esModule: true
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29tZXRoaW5nLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsic29tZXRoaW5nLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNvbWV0aGluZyB7XG4gIHN1bShhOiBudW1iZXIsIGI6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIGEgKyBiO1xuICB9XG59XG5cbmV4cG9ydCB7U29tZXRoaW5nfVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9