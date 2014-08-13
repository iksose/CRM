    class Prospect {
    constructor(obj) {
        Object.assign(this, obj);
        this.Issues = [ for(x of obj.Issues) new Issue(x) ]
        this.Activities = [ for(x of obj.Activities) new Activity(x) ]
        this.Contacts = [ for(x of obj.Contacts) new Contact(x) ]
        this.Customer = new Customer(obj.Customer);
        this.IssueCount = obj.Issues.length;
        this.ActivityCount = obj.Activities.length;
        this.ContactCount = obj.Contacts.length;
        this.CustomerType = "A"
        // this.ProspectType = "P"
    }
}

class Contact {
    constructor(obj) {
        Object.assign(this, obj);
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
        Object.assign(this, obj);
        this.issue = true;
        this.start = obj.CreationDateTime;
        this.end = obj.CompletionDateTime
        this.startHuman = moment(obj.CreationDateTime).format("LL")
        this.endHuman = moment(obj.CompletionDateTime).format("ll")
        this.content = obj.Description.substring(0, 5);
        this.typeOf = "Closed Issues"
        if(this.end == "1900-01-01T00:00:00"){
            delete this.end
            this.endHuman = "Still opened"
            this.className = "openIssue"
            this.typeOf = "Open Issues"
        }
        this.year = parseInt( moment(obj.CreationDateTime).format("YYYY") );
        this.month = parseInt( moment(obj.CreationDateTime).format("MM") );
        this.day = parseInt( moment(obj.CreationDateTime).format("DDD") );
        this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY")
        this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY")
        this.replyCount = obj.Followups.length;
        this.Followups = [ for(x of obj.Followups) new Followups(x) ]
    }
}

class Activity {
    constructor(obj) {
        Object.assign(this, obj);
        this.issue = false;
        this.startHuman = moment(obj.CreationDateTime).format("LL")
        this.start = obj.CreationDateTime;
        // delete Activities.CreationDateTime;
        // this.content = obj.Note.substring(0, 20)
        this.content = "1 note"
        // delete activities.Note;
        this.typeOf = "All Activities";
        this.year = parseInt( moment(obj.CreationDateTime).format("YYYY") );
        this.month = parseInt( moment(obj.CreationDateTime).format("MM") );
        this.day = parseInt( moment(obj.CreationDateTime).format("DDD") );
        this.smallDay = parseInt( moment(obj.CreationDateTime).format("DD") );
        this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY");
        this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY");
        this.Type_Human = (function(){
            var spread =  Math.floor(Math.random() * (3 - 1)) + 1;
            if(spread == 1){
                return "Phone"
            }else{
                return "Visit"
            }
        })()
        this.timebetween = "2 weeks"
    }
}

class Followups {
    constructor(obj) {
        Object.assign(this, obj);
        this.issue = false;
        this.startHuman = moment(obj.CreationDateTime).format("ll")
    }
}
