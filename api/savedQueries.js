var queries = [
{
  prospectCount: 5313,
  campName: "The Campaign Name",
  demoInfo: "Alaskan Pharmacies"
}
]

exports.returnQueryResults = function(req, res) {
  console.log("Asked for this query result?", req.body)
  // var match = _.findWhere(tasks, req.body);
  setTimeout((function(){
    return res.send(queries)
  }), 1000)
}
