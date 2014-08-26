    class Prospect {
        constructor(obj) {
            Object.assign(this, obj);
            this.Issues = [
                for (x of obj.Issues) new Issue(x || {})
            ]
            this.Activities = obj.Activities.map(C => new Activity(C || {}))
            this.Contacts = obj.Contacts.map(C => new Contact(C || {}))
            this.Customer = new Customer(obj.Customer || {});
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
            this.Addr1 = this.Addr1 || ''
            this.Addr2 = this.Addr2 || ''
            this.City = this.City || ''
            this.ContactID = this.ContactID || ''
            this.Email = this.Email || ''
            this.Fax = this.Fax || ''
            this.Mobile = this.Mobile || ''
            this.Name = this.Name || ''
            this.Phone = this.Phone || ''
            this.State = this.State || ''
            this.Zip = this.Zip || ''
            this.Types = this.Types || [];
            // fin
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
        get old_vs_new() {
            return {
                'old': this.OldTypes,
                'new': this.HumanTypes_
            }
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
            if (this.end == "1900-01-01T00:00:00") {
                delete this.end
                this.endHuman = "Still opened"
                this.className = "openIssue"
                this.typeOf = "Open Issues"
            }
            this.year = parseInt(moment(obj.CreationDateTime).format("YYYY"));
            this.month = parseInt(moment(obj.CreationDateTime).format("MM"));
            this.day = parseInt(moment(obj.CreationDateTime).format("DDD"));
            this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY")
            this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY")
            this.replyCount = obj.Followups.length;
            this.Followups = [
                for (x of obj.Followups) new Followups(x || {})
            ]
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
            this.year = parseInt(moment(obj.CreationDateTime).format("YYYY"));
            this.month = parseInt(moment(obj.CreationDateTime).format("MM"));
            this.day = parseInt(moment(obj.CreationDateTime).format("DDD"));
            this.smallDay = parseInt(moment(obj.CreationDateTime).format("DD"));
            this.month_year = moment(obj.CreationDateTime).format("MM") + moment(obj.CreationDateTime).format("YYYY");
            this.year_day = moment(obj.CreationDateTime).format("DDD") + moment(obj.CreationDateTime).format("YYYY");
            this.Type_Human = (function() {
                var spread = Math.floor(Math.random() * (3 - 1)) + 1;
                if (spread == 1) {
                    return "Phone"
                } else {
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

    class AddEvent {
        constructor(obj, info) {
            Object.assign(this, obj);
            this.Date = moment(this.Date).format("YYYY-MM-DD");
            // this.ProspectID = '2'
            // this.CampaignID = info.CampaignID;
            // this.CreationUser = info.CreationUser;
            // this.ProductID = info.ProductID;
        }
    }

    class AddIssue {
        constructor(obj, info) {
            Object.assign(this, obj);
            this.CompletionDateTime = '1900-01-01'
            this.Status = 0;
            this.ProductID = 1;
        }
    }
