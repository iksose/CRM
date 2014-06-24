var queries = [
{
  prospectCount: 5313,
  campName: "The Campaign Name",
  demoInfo: "Alaskan Pharmacies",
  searchParams: ["Age", "Sex"],
  customers: [
  {
      "id": 0,
      "guid": "8f6f2df8-354c-4beb-b967-f361583054f4",
      "isActive": false,
      "balance": "$3,767.00",
      "picture": "http://placehold.it/32x32",
      "age": 32,
      "name": "Figueroa Rose",
      "gender": "male",
      "company": "XERONK",
      "email": "figueroarose@xeronk.com",
      "phone": "+1 (844) 579-2086",
      "address": "683 Dorset Street, Echo, Idaho, 7122",
      "state": "Washington",
      "about": "Minim consequat exercitation ea ea sunt. Sint ea veniam mollit commodo aliqua fugiat occaecat aute elit. Minim cupidatat sint velit aute elit nulla excepteur proident ad. Duis esse culpa amet ex. Ullamco sint nostrud elit laborum velit dolor sint dolor exercitation qui fugiat sint.\r\n",
      "registered": "2014-02-16T16:13:59 +06:00",
      "latitude": -10,
      "longitude": 90,
      "tags": [
          "tempor",
          "do",
          "tempor",
          "et",
          "ullamco",
          "ex",
          "tempor"
      ],
      "friends": [
          {
              "id": 0,
              "name": "Liz Shepard"
          },
          {
              "id": 1,
              "name": "Mcmillan Andrews"
          },
          {
              "id": 2,
              "name": "Shaw Best"
          }
      ],
      "greeting": "Hello, Figueroa Rose! You have 3 unread messages.",
      "favoriteFruit": "apple"
  },
  {
      "id": 1,
      "guid": "d600603a-5b98-4c5d-a859-5ed4b95334b6",
      "isActive": false,
      "balance": "$2,808.00",
      "picture": "http://placehold.it/32x32",
      "age": 22,
      "name": "Simon Kelley",
      "gender": "male",
      "company": "ESSENSIA",
      "email": "simonkelley@essensia.com",
      "phone": "+1 (834) 599-3251",
      "address": "236 Porter Avenue, Klondike, Virginia, 7158",
      "state": "Pennsylvania",
      "about": "Amet aliqua officia laboris velit ullamco magna nostrud proident aliqua. Adipisicing nisi quis velit adipisicing mollit fugiat quis. Occaecat amet id amet aliquip Lorem est magna proident laboris nostrud nostrud non. Cillum aliquip velit id ullamco eiusmod occaecat est deserunt reprehenderit nisi amet. Cupidatat ex reprehenderit adipisicing magna exercitation reprehenderit minim ullamco esse non laborum adipisicing.\r\n",
      "registered": "2014-03-04T03:53:29 +06:00",
      "latitude": 3,
      "longitude": -124,
      "tags": [
          "mollit",
          "exercitation",
          "pariatur",
          "irure",
          "do",
          "sunt",
          "non"
      ],
      "friends": [
          {
              "id": 0,
              "name": "Loretta Whitaker"
          },
          {
              "id": 1,
              "name": "Adkins Conner"
          },
          {
              "id": 2,
              "name": "Joan Wolfe"
          }
      ],
      "greeting": "Hello, Simon Kelley! You have 2 unread messages.",
      "favoriteFruit": "apple"
  },
  {
      "id": 2,
      "guid": "40ee6a64-2a68-4762-948d-7d067208d365",
      "isActive": false,
      "balance": "$1,215.00",
      "picture": "http://placehold.it/32x32",
      "age": 22,
      "name": "Hendricks Mckinney",
      "gender": "male",
      "company": "GEEKY",
      "email": "hendricksmckinney@geeky.com",
      "phone": "+1 (970) 505-3691",
      "address": "175 Ford Street, Weeksville, California, 4640",
      "state": "South Carolina",
      "about": "Eiusmod fugiat consequat eiusmod enim mollit eiusmod aute voluptate. Sunt laborum esse eu cillum esse sit elit sint ea id. Nostrud do mollit proident consequat aliquip nisi commodo do sunt.\r\n",
      "registered": "2014-01-07T23:20:35 +06:00",
      "latitude": -40,
      "longitude": 106,
      "tags": [
          "commodo",
          "voluptate",
          "fugiat",
          "qui",
          "velit",
          "amet",
          "nostrud"
      ],
      "friends": [
          {
              "id": 0,
              "name": "Wilder Shields"
          },
          {
              "id": 1,
              "name": "Cobb Stephenson"
          },
          {
              "id": 2,
              "name": "Sharp Vasquez"
          }
      ],
      "greeting": "Hello, Hendricks Mckinney! You have 4 unread messages.",
      "favoriteFruit": "banana"
  }
  ],
  queryID: 1
},
{
  prospectCount: 53132,
  campName: "The Campaign Name2",
  demoInfo: "Alaskan Pharmacies2",
  searchParams: ["Age", "Sex"],
  customers: [1,2,3,4,5,6,7,8,9],
  queryID: 2
}
]

exports.returnQueryResults = function(req, res) {
  console.log("Asked for this query result?", req.body)
  // var match = _.findWhere(tasks, req.body);
  setTimeout((function(){
    return res.send(queries)
  }), 1000)
}

exports.saveQuery = function(req, res){
  console.log("Saving this query...", req.body)
  setTimeout((function(){
    return res.send(200)
  }), 1000)
}


exports.getQueries = function(req, res){
  console.log("getting all available queries...", req.body)
  setTimeout((function(){
    return res.send(queries)
  }), 1000)
}


exports.singleQuery = function(req, res){
  console.log("getting specific query details..", req.params)
  setTimeout((function(){
    return res.send(queries[0])
  }), 1000)
}
