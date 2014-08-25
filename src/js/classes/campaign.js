class Campaign {
    constructor(obj) {
        Object.assign(this, obj);
        this.Activities = [
            for (x of obj.Activities) new NewActivity(x)
        ]
        this.ProspectCount = obj.Prospects.length
        this.ActivityCount = obj.Activities.length
    }
    // returns {Descr, StartDateTime, CompletionDateTime} from this.Activites
    get events() {
        return [
            for ({
                    Descr, StartDateTime, CompletionDateTime
                }
                of this.Activities) {
                title: Descr,
                start: StartDateTime,
                end: CompletionDateTime
            }
        ]
    }
}
