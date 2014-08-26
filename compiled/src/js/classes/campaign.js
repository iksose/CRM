define([], function() {
  "use strict";
  var Campaign = function Campaign(obj) {
    Object.assign(this, obj);
    this.Activities = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__3 = obj.Activities[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__4; !($__4 = $__3.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          {
            x = $__4.value;
            $traceurRuntime.setProperty($__2, $__1++, new NewActivity(x));
          }
        }
      }
      return $__2;
    }());
    this.ProspectCount = obj.Prospects.length;
  };
  ($traceurRuntime.createClass)(Campaign, {}, {});
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY2xhc3Nlcy9jYW1wYWlnbi5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL2NsYXNzZXMvY2FtcGFpZ24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ2FtcGFpZ24ge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICAvLyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIC8vIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8ga2V5cy5mb3JFYWNoKChrZXkpPT57XG4gICAgICAgIC8vICAgICBzZWxmW2tleV0gPSBvYmpba2V5XVxuICAgICAgICAvLyB9KVxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuQWN0aXZpdGllcyA9IFsgZm9yKHggb2Ygb2JqLkFjdGl2aXRpZXMpIG5ldyBOZXdBY3Rpdml0eSh4KSBdXG4gICAgICAgIHRoaXMuUHJvc3BlY3RDb3VudCA9IG9iai5Qcm9zcGVjdHMubGVuZ3RoXG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9