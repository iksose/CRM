var _ = require('underscore-node');

exports.findOne = function(req, res) {
  console.log(req.body)
  var users = [{
    username: "jon",
    password: "123456",
    admin: true,
    group: "IT"
  },{
    username: "kellie",
    password: "123456",
    admin: false,
    group: "Marketing"
  },{
    username: "isaac",
    password: "123456",
    admin: false,
    group: "ISR"
  }
  ]

  var match = _.findWhere(users, {username: req.body.username});

  if(match !== undefined){
    return res.send(match)
  }else{
    return res.send(401)
  }



// res.send(users)
}
