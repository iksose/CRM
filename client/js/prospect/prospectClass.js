class Prospect {
    constructor(obj) {
        var keys = Object.keys(obj);
        var self = this;
        keys.forEach((key)=>{
            self[key] = obj[key]
        })
        this.Issues = [ for(x of obj.Issues) new Issue(x) ]
        this.Activities = [ for(x of obj.Activities) new Activity(x) ]
        this.Contacts = [ for(x of obj.Contacts) new Contact(x) ]
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

class Activity {
    constructor(obj) {
        var keys = Object.keys(obj);
        var self = this;
        keys.forEach((key)=>{
            self[key] = obj[key]
        })
        this.startHuman = moment(obj.CreationDateTime).format("ll")
        this.start = obj.CreationDateTime;
        // delete Activities.CreationDateTime;
        this.content = obj.Note;
        // delete activities.Note;
        this.typeOf = "All Activities";
    }
}
