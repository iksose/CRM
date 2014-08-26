define([], function() {
  "use strict";
  var NewActivity = function NewActivity(obj) {
    Object.assign(this, obj);
    this.StartDateTime = moment(obj.StartDateTime).format("YYYY-MM-DD");
    this.CompletionDateTime = moment(obj.CompletionDateTime).format("YYYY-MM-DD");
  };
  ($traceurRuntime.createClass)(NewActivity, {}, {});
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYWN0aXZpdHkvYWN0aXZpdHlDbGFzcy5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL2FjdGl2aXR5L2FjdGl2aXR5Q2xhc3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZm9yIGFkZGluZyBhbiBhY3Rpdml0eSB0byBhIGNhbXBhaWduXG5jbGFzcyBOZXdBY3Rpdml0eSB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIC8vIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBrZXlzLmZvckVhY2goKGtleSk9PntcbiAgICAgICAgLy8gICAgIHNlbGZba2V5XSA9IG9ialtrZXldXG4gICAgICAgIC8vIH0pXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgdGhpcy5TdGFydERhdGVUaW1lID0gbW9tZW50KG9iai5TdGFydERhdGVUaW1lKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpXG4gICAgICAgIHRoaXMuQ29tcGxldGlvbkRhdGVUaW1lID0gbW9tZW50KG9iai5Db21wbGV0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVktTU0tRERcIilcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=