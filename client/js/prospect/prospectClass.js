class Prospect {
  constructor(obj) {
    // console.log(Object.keys(obj))
    var keys = Object.keys(obj);
    var self = this;
    keys.forEach((key)=>{
        self[key] = obj[key]
    })
    this.Issues = (function(){
        var issue_array = []
        obj.Issues.forEach(function(issue){
            issue_array.push(new Issue(issue))
            // console.log(new_contacts)
        })
        return issue_array
    })()
    this.Activities = (function(){
      var Activities = [];
      obj.Activities.forEach(function(activities){
        activities.startHuman = moment(activities.CreationDateTime).format("ll")
        activities.start = activities.CreationDateTime;
        delete Activities.CreationDateTime;
        activities.content = activities.Note;
        delete activities.Note;
        activities.typeOf = "All Activities";
        Activities.push(activities)
      })
      return Activities;
    })()
    this.Contacts = (function(){
        var new_contacts = []
        obj.Contacts.forEach(function(contacts){
            new_contacts.push(new Contact(contacts))
        })
        return new_contacts
    })()
  }
}

class Contact {
    constructor(obj) {
        var keys = Object.keys(obj);
        var self = this;
        keys.forEach((key)=>{
            self[key] = obj[key]
        })
        this.HumanTypes_ = _.pluck(obj.Types, 'Type')
        this.OldTypes = []
    }
    set HumanTypes(value) {
        this.OldTypes = this.HumanTypes_;
        this.HumanTypes_ = value;
    }
    get HumanTypes() {
        return this.HumanTypes_
    }
    get old_vs_new(){
        return {'old': this.OldTypes, 'new': this.HumanTypes_}
    }
}

class Issue {
    constructor(obj) {
        var keys = Object.keys(obj);
        var self = this;
        keys.forEach((key)=>{
            self[key] = obj[key]
        })
        this.start = obj.CreationDateTime;
        this.end = obj.CompletionDateTime
        this.startHuman = moment(obj.CreationDateTime).format("ll")
        this.endHuman = moment(obj.CompletionDateTime).format("ll")
        this.content = obj.Description;
        this.typeOf = "Closed Issues"
        if(this.end == "1900-01-01T00:00:00"){
            delete this.end
            this.endHuman = "Still opened"
            this.className = "openIssue"
            this.typeOf = "Open Issues"
        }
    }
}
