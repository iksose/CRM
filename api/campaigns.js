var _ = require('underscore-node');
var Campaigns = [{
  cName: "myCampaign1",
  cDate: "Tuesday",
  status: "Pending",
  cID: "1337"
  },{
    cName: "myCampaign2",
    cDate: "Wednesday",
    status: "Template",
    cID: "n00b"
  },{
    cName: "myCampaign2",
    cDate: "Wednesday",
    status: "Approved",
    cID: "dota"
  }
]

exports.allCampaigns = function(req, res) {
  console.log("All campaigns?")
  return res.send(Campaigns);
// res.send(users)
}


exports.singleCampaign = function(req, res){
  console.log("get a single campaign...??", req.body)
  var match = _.findWhere(Campaigns, {cID: req.body.params});

  setTimeout((function(){
    if(match !== undefined){
      return res.send(match)
    }else{
      return res.send(500)
    }
  }), 1000)

}
