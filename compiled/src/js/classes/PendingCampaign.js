define([], function() {
  "use strict";
  var PendingCampaign = function PendingCampaign(obj) {
    var $__0 = this;
    Object.assign(this, obj);
    this.ParamStrUnpacked = '';
    var paramObj = $.deparam(obj.ParamStr);
    Object.keys(paramObj).forEach((function(key) {
      $__0.ParamStrUnpacked += key + " = " + paramObj[$traceurRuntime.toProperty(key)] + "; ";
    }));
  };
  ($traceurRuntime.createClass)(PendingCampaign, {}, {});
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY2xhc3Nlcy9QZW5kaW5nQ2FtcGFpZ24uanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcy9jbGFzc2VzL1BlbmRpbmdDYW1wYWlnbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQZW5kaW5nQ2FtcGFpZ24ge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIC8vIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBrZXlzLmZvckVhY2goKGtleSk9PntcbiAgICAgICAgLy8gICAgIHNlbGZba2V5XSA9IG9ialtrZXldXG4gICAgICAgIC8vIH0pXG4gICAgICAgIHRoaXMuUGFyYW1TdHJVbnBhY2tlZCA9ICcnO1xuICAgICAgICB2YXIgcGFyYW1PYmogPSAkLmRlcGFyYW0ob2JqLlBhcmFtU3RyKVxuICAgICAgICBPYmplY3Qua2V5cyggcGFyYW1PYmogKS5mb3JFYWNoKChrZXkgKT0+e1xuICAgICAgICAgICAgdGhpcy5QYXJhbVN0clVucGFja2VkICs9IGtleSArIFwiID0gXCIgKyBwYXJhbU9ialtrZXldICsgXCI7IFwiO1xuICAgICAgICB9KVxuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==