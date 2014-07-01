var prospect = {
    'Name': "Karl",
    'Age': "90",
    'Products': "Trinet",
    'Pharmacy': "Lincoln Pharmacy",
    'Issues': [
      {
        'IssueID': 0,
        'ProductID': 0,
        'Opened': '2014-01-01',
        'OpenedBy': 'pbajoj',
        'ClosedBy': 'pbajoj',
        'Closed': '2014-01-02',
        'Description': "issue 01, Note that the tests are actually run in browser two different ways: once for humans with a nice ui, and there is another HTML page running with output to the JS console used for automated testing with testling (although we don't particularly love testling; any other automated browser test runner would be as good).",
        "FollowUp" :[
          {}
        ]
      },
      {
        'IssueID': 0,
        'ProductID': 0,
        'Opened': '2014-01-05',
        'OpenedBy': 'pbajoj',
        'ClosedBy': '',
        'Closed': '',
        'Description': "issue 02, newest and still opened",
        "FollowUp" :[
          {},
          {},
          {}
        ]
      },
      {
        'IssueID': 0,
        'ProductID': 0,
        'Opened': '2012-01-10',
        'OpenedBy': 'pbajoj',
        'ClosedBy': 'pbajoj',
        'Closed': '2012-06-02',
        'Description': "issue 03, this is the oldest issue. opened for 5 months!",
        "FollowUp" :[
          {}
        ]
      }
    ],
    'Activities': [
      {
          'ActivityID': 0,
          'ProductID': 0,
          'CampaignID': 0,
          'Start': '2014-07-05',
          'Duration': '5',
          'Type': 'Phone',
          'Notes': 'notes notes notes',
          'User': "pbajoj"
      }
    ],
    'Contacts': []
  }

exports.one = function(req, res) {
  console.log("one prospect?")
  return res.send(prospect);
// res.send(users)
}
