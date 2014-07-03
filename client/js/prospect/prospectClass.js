class Prospect {
  constructor(obj) {
    this.Name = obj.Name,
    this.Age = obj.Age,
    this.Issues = (function(){
      var issue_array = [];
      obj.Issues.forEach(function(issues){
        issues.start = issues.Opened;
        issues.startHuman = moment(issues.Opened).format("ll")
        delete issues.Opened;
        issues.end = issues.Closed
        issues.endHuman = moment(issues.Closed).format("ll")
        delete issues.Closed;
        issues.content = issues.Description;
        delete issues.Description;
        issues.typeOf = "Closed Issues"
        // empty string issues throw error
        if(issues.end == ""){
          delete issues.end
          issues.endHuman = "Still opened haha"
          issues.className = "openIssue"
          issues.typeOf = "Open Issues"
        }
        issues.replyCount = issues.FollowUp.length
        issue_array.push(issues)
      })
      return issue_array;
    })()
    this.Activities = (function(){
      var Activities = [];
      obj.Activities.forEach(function(activities){
        activities.start = activities.Start;
        delete Activities.Start;
        activities.content = activities.Notes;
        delete activities.Notes;
        activities.typeOf = "All Activities";
        Activities.push(activities)
      })
      return Activities;
    })()
  }

    get latest () {
    return this.Issues;
  }
}
