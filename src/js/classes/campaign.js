class Campaign {
    constructor(obj) {
        Object.assign(this, obj);
        this.Activities = [ for(x of obj.Activities) new NewActivity(x) ]
        this.ProspectCount = obj.Prospects.length
        this.ActivityCount = obj.Activities.length
    }
}
