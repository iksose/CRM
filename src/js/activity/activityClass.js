// for adding an activity to a campaign
class NewActivity {
    constructor(obj) {
        Object.assign(this, obj);
        this.StartDateTime = moment(obj.StartDateTime).format("YYYY-MM-DD")
        this.CompletionDateTime = moment(obj.CompletionDateTime).format("YYYY-MM-DD")
    }
}
