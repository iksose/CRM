define([], function() {
  "use strict";
  var Prospect = function Prospect(obj) {
    Object.assign(this, obj);
    this.Issues = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__3 = obj.Issues[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__4; !($__4 = $__3.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          {
            x = $__4.value;
            $traceurRuntime.setProperty($__2, $__1++, new Issue(x));
          }
        }
      }
      return $__2;
    }());
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
            $traceurRuntime.setProperty($__2, $__1++, new Activity(x));
          }
        }
      }
      return $__2;
    }());
    this.Contacts = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__3 = obj.Contacts[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__4; !($__4 = $__3.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          {
            x = $__4.value;
            $traceurRuntime.setProperty($__2, $__1++, new Contact(x));
          }
        }
      }
      return $__2;
    }());
    this.IssueCount = obj.Issues.length;
    this.ActivityCount = obj.Activities.length;
    this.ContactCount = obj.Contacts.length;
  };
  ($traceurRuntime.createClass)(Prospect, {}, {});
  var Contact = function Contact(obj) {
    Object.assign(this, obj);
    this.HumanTypes_ = _.pluck(obj.Types, 'Type');
    this.OldTypes = [];
  };
  ($traceurRuntime.createClass)(Contact, {
    set HumanTypes(value) {
      this.OldTypes = this.HumanTypes_;
      this.HumanTypes_ = value;
    },
    get HumanTypes() {
      return this.HumanTypes_;
    },
    get old_vs_new() {
      return {
        'old': this.OldTypes,
        'new': this.HumanTypes_
      };
    }
  }, {});
  var Issue = function Issue(obj) {
    Object.assign(this, obj);
    this.issue = true;
    this.start = obj.CreationDateTime;
    this.end = obj.CompletionDateTime;
    this.startHuman = moment(obj.CreationDateTime).format("LL");
    this.endHuman = moment(obj.CompletionDateTime).format("ll");
    this.content = obj.Description.substring(0, 5);
    this.typeOf = "Closed Issues";
    if (this.end == "1900-01-01T00:00:00") {
      delete this.end;
      this.endHuman = "Still opened";
      this.className = "openIssue";
      this.typeOf = "Open Issues";
    }
    this.year = parseInt(moment(obj.CreationDateTime).format("YYYY"));
    this.month = parseInt(moment(obj.CreationDateTime).format("MM"));
    this.day = parseInt(moment(obj.CreationDateTime).format("DDD"));
    this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY");
    this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY");
    this.replyCount = obj.Followups.length;
    this.Followups = (function() {
      var $__1 = 0,
          $__2 = [];
      for (var $__3 = obj.Followups[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__4; !($__4 = $__3.next()).done; ) {
        try {
          throw undefined;
        } catch (x) {
          {
            x = $__4.value;
            $traceurRuntime.setProperty($__2, $__1++, new Followups(x));
          }
        }
      }
      return $__2;
    }());
  };
  ($traceurRuntime.createClass)(Issue, {}, {});
  var Activity = function Activity(obj) {
    Object.assign(this, obj);
    this.issue = false;
    this.startHuman = moment(obj.CreationDateTime).format("LL");
    this.start = obj.CreationDateTime;
    this.content = "1 note";
    this.typeOf = "All Activities";
    this.year = parseInt(moment(obj.CreationDateTime).format("YYYY"));
    this.month = parseInt(moment(obj.CreationDateTime).format("MM"));
    this.day = parseInt(moment(obj.CreationDateTime).format("DDD"));
    this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY");
    this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY");
    this.Type_Human = (function() {
      var spread = Math.floor(Math.random() * (3 - 1)) + 1;
      if (spread == 1) {
        return "Phone";
      } else {
        return "Visit";
      }
    })();
  };
  ($traceurRuntime.createClass)(Activity, {}, {});
  var Followups = function Followups(obj) {
    Object.assign(this, obj);
    this.issue = false;
    this.startHuman = moment(obj.CreationDateTime).format("ll");
  };
  ($traceurRuntime.createClass)(Followups, {}, {});
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvcHJvc3BlY3QvcHJvc3BlY3RDbGFzcy5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImpzL3Byb3NwZWN0L3Byb3NwZWN0Q2xhc3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiICAgIGNsYXNzIFByb3NwZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICB0aGlzLklzc3VlcyA9IFsgZm9yKHggb2Ygb2JqLklzc3VlcykgbmV3IElzc3VlKHgpIF1cbiAgICAgICAgdGhpcy5BY3Rpdml0aWVzID0gWyBmb3IoeCBvZiBvYmouQWN0aXZpdGllcykgbmV3IEFjdGl2aXR5KHgpIF1cbiAgICAgICAgdGhpcy5Db250YWN0cyA9IFsgZm9yKHggb2Ygb2JqLkNvbnRhY3RzKSBuZXcgQ29udGFjdCh4KSBdXG4gICAgICAgIHRoaXMuSXNzdWVDb3VudCA9IG9iai5Jc3N1ZXMubGVuZ3RoO1xuICAgICAgICB0aGlzLkFjdGl2aXR5Q291bnQgPSBvYmouQWN0aXZpdGllcy5sZW5ndGg7XG4gICAgICAgIHRoaXMuQ29udGFjdENvdW50ID0gb2JqLkNvbnRhY3RzLmxlbmd0aDtcbiAgICB9XG59XG5cbmNsYXNzIENvbnRhY3Qge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuSHVtYW5UeXBlc18gPSBfLnBsdWNrKG9iai5UeXBlcywgJ1R5cGUnKVxuICAgICAgICB0aGlzLk9sZFR5cGVzID0gW11cbiAgICB9XG4gICAgc2V0IEh1bWFuVHlwZXModmFsdWUpIHtcbiAgICAgICAgdGhpcy5PbGRUeXBlcyA9IHRoaXMuSHVtYW5UeXBlc187XG4gICAgICAgIHRoaXMuSHVtYW5UeXBlc18gPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0IEh1bWFuVHlwZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkh1bWFuVHlwZXNfXG4gICAgfVxuICAgIGdldCBvbGRfdnNfbmV3KCl7XG4gICAgICAgIHJldHVybiB7J29sZCc6IHRoaXMuT2xkVHlwZXMsICduZXcnOiB0aGlzLkh1bWFuVHlwZXNffVxuICAgIH1cbn1cblxuY2xhc3MgSXNzdWUge1xuICAgIGNvbnN0cnVjdG9yKG9iaikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICAgIHRoaXMuaXNzdWUgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gb2JqLkNyZWF0aW9uRGF0ZVRpbWU7XG4gICAgICAgIHRoaXMuZW5kID0gb2JqLkNvbXBsZXRpb25EYXRlVGltZVxuICAgICAgICB0aGlzLnN0YXJ0SHVtYW4gPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkxMXCIpXG4gICAgICAgIHRoaXMuZW5kSHVtYW4gPSBtb21lbnQob2JqLkNvbXBsZXRpb25EYXRlVGltZSkuZm9ybWF0KFwibGxcIilcbiAgICAgICAgdGhpcy5jb250ZW50ID0gb2JqLkRlc2NyaXB0aW9uLnN1YnN0cmluZygwLCA1KTtcbiAgICAgICAgdGhpcy50eXBlT2YgPSBcIkNsb3NlZCBJc3N1ZXNcIlxuICAgICAgICBpZih0aGlzLmVuZCA9PSBcIjE5MDAtMDEtMDFUMDA6MDA6MDBcIil7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5lbmRcbiAgICAgICAgICAgIHRoaXMuZW5kSHVtYW4gPSBcIlN0aWxsIG9wZW5lZFwiXG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IFwib3Blbklzc3VlXCJcbiAgICAgICAgICAgIHRoaXMudHlwZU9mID0gXCJPcGVuIElzc3Vlc1wiXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy55ZWFyID0gcGFyc2VJbnQoIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKSApO1xuICAgICAgICB0aGlzLm1vbnRoID0gcGFyc2VJbnQoIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikgKTtcbiAgICAgICAgdGhpcy5kYXkgPSBwYXJzZUludCggbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERERcIikgKTtcbiAgICAgICAgdGhpcy5tb250aF95ZWFyID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJNTVwiKSArIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKVxuICAgICAgICB0aGlzLnllYXJfZGF5ID0gbW9tZW50KG9iai5DcmVhdGlvbkRhdGVUaW1lKS5mb3JtYXQoXCJERERcIikgKyBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIilcbiAgICAgICAgdGhpcy5yZXBseUNvdW50ID0gb2JqLkZvbGxvd3Vwcy5sZW5ndGg7XG4gICAgICAgIHRoaXMuRm9sbG93dXBzID0gWyBmb3IoeCBvZiBvYmouRm9sbG93dXBzKSBuZXcgRm9sbG93dXBzKHgpIF1cbiAgICB9XG59XG5cbmNsYXNzIEFjdGl2aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAgICB0aGlzLmlzc3VlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhcnRIdW1hbiA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTExcIilcbiAgICAgICAgdGhpcy5zdGFydCA9IG9iai5DcmVhdGlvbkRhdGVUaW1lO1xuICAgICAgICAvLyBkZWxldGUgQWN0aXZpdGllcy5DcmVhdGlvbkRhdGVUaW1lO1xuICAgICAgICAvLyB0aGlzLmNvbnRlbnQgPSBvYmouTm90ZS5zdWJzdHJpbmcoMCwgMjApXG4gICAgICAgIHRoaXMuY29udGVudCA9IFwiMSBub3RlXCJcbiAgICAgICAgLy8gZGVsZXRlIGFjdGl2aXRpZXMuTm90ZTtcbiAgICAgICAgdGhpcy50eXBlT2YgPSBcIkFsbCBBY3Rpdml0aWVzXCI7XG4gICAgICAgIHRoaXMueWVhciA9IHBhcnNlSW50KCBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIikgKTtcbiAgICAgICAgdGhpcy5tb250aCA9IHBhcnNlSW50KCBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIk1NXCIpICk7XG4gICAgICAgIHRoaXMuZGF5ID0gcGFyc2VJbnQoIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiREREXCIpICk7XG4gICAgICAgIHRoaXMubW9udGhfeWVhciA9IG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiTU1cIikgKyBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIllZWVlcIik7XG4gICAgICAgIHRoaXMueWVhcl9kYXkgPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcIkRERFwiKSArIG1vbWVudChvYmouQ3JlYXRpb25EYXRlVGltZSkuZm9ybWF0KFwiWVlZWVwiKTtcbiAgICAgICAgdGhpcy5UeXBlX0h1bWFuID0gKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc3ByZWFkID0gIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgzIC0gMSkpICsgMTtcbiAgICAgICAgICAgIGlmKHNwcmVhZCA9PSAxKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJQaG9uZVwiXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJWaXNpdFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKClcbiAgICB9XG59XG5cbmNsYXNzIEZvbGxvd3VwcyB7XG4gICAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgb2JqKTtcbiAgICAgICAgdGhpcy5pc3N1ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXJ0SHVtYW4gPSBtb21lbnQob2JqLkNyZWF0aW9uRGF0ZVRpbWUpLmZvcm1hdChcImxsXCIpXG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9