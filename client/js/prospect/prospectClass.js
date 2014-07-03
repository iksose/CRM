class Prospect {
  constructor(obj) {
    this.Name = obj.Name,
    this.PriWholesalerID = obj.PriWholesalerID,
    this.City = obj.City,
    this.ScriptsPerMonth = obj.ScriptsPerMonth;
    this.Issues = (function(){
      var issue_array = [];
      obj.Issues.forEach(function(issues){
        issues.CreationUser = issues.CreationUser;
        issues.start = issues.CreationDateTime;
        issues.startHuman = moment(issues.CreationDateTime).format("ll")
        delete issues.CreationDateTime;
        issues.end = issues.CompletionDateTime
        issues.endHuman = moment(issues.CompletionDateTime).format("ll")
        delete issues.CompletionDateTime;
        issues.content = issues.Description;
        delete issues.Description;
        issues.typeOf = "Closed Issues"
        // empty string issues throw error
        if(issues.end == "1900-01-01T00:00:00"){
          delete issues.end
          issues.endHuman = "Still opened"
          issues.className = "openIssue"
          issues.typeOf = "Open Issues"
        }
        // issues.replyCount = issues.FollowUp.length
        issue_array.push(issues)
      })
      return issue_array;
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
  }

    get latest () {
    return this.Issues;
  }
}
