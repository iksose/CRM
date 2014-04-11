var _ = require('underscore-node');
var tasks = [
  {
    // assignedUser: "kellie",
    assignedGroup: "marketing",
    taskName: "Single Activity",
    taskStartDate: "Monday",
    taskDueDate: "Tuesday",
    taskID: "001"
  },{
    // assignedUser: "jon",
    assignedGroup: "marketing",
    taskName: "Bulk Activity",
    taskStartDate: "Monday",
    taskDueDate: "Tuesday",
    taskID: "002"
  },{
    assignedUser: "",
    assignedGroup: "marketing",
    taskName: "Bulk Activity",
    taskStartDate: "Monday",
    taskDueDate: "Tuesday",
    taskID: "003"
  },{
    // assignedUser: "isaac",
    assignedGroup: "marketing",
    taskName: "Single Activity",
    taskStartDate: "Monday",
    taskDueDate: "Tuesday",
    taskID: "004"
  },{
    // assignedUser: "richard",
    assignedGroup: "it",
    taskName: "Single Activity",
    taskStartDate: "Monday",
    taskDueDate: "Tuesday",
    taskID: "005"
  }
]

exports.singleTask = function(req, res) {
  console.log("Single task?", req.body)
  var match = _.findWhere(tasks, req.body);
  setTimeout((function(){
    return res.send(match)
  }), 1000)
}


exports.userTasks = function(req, res){
  console.log("get tasks for a single user...??", req.body)
  var group = req.body.group.toLowerCase();
  var username = req.body.username.toLowerCase();

  var matchedGroup = _.where(tasks, {assignedGroup: group})
  var matchedUser = _.where(tasks, {assignedUser: username})
  var both = matchedGroup.concat(matchedUser);
  var uniqueBoth = _.uniq(both);

  setTimeout((function(){
    if(uniqueBoth !== undefined){
      return res.send(uniqueBoth)
    }else{
      return res.send(500)
    }
  }), 1000)

}

  exports.alltasks =  function(req, res) {
    console.log("every single task?")
    setTimeout((function(){
      return res.send(tasks)
    }), 1000)
  }
