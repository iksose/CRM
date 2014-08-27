angular.module('uiRouterSample')
    .factory('prospectFactory',
        function($http) {
            var prospectID;
            return {
                _request: function(method = 'get', suffix = '', data = null) {
                    return $http({
                        method: method,
                        url: `http://10.1.1.118:8000/api/prospect/${prospectID}/${suffix}`,
                        data: data
                    });
                },
                getProspect_by_ID: function(prospect) {
                    prospectID = prospect.ProspectID
                    return this._request('get');
                },
                AddEvent: function(nEvent) {
                    var nEvent = $.param(nEvent)
                    return this._request('post', `Activity`, nEvent)
                },
                EditEvent: function(myEvent) {
                    // var eventID = Event.EventID; not used
                    delete myEvent.subnotes // array throws error
                    var myEvent = $.param(myEvent);
                    return this._request('put', `Activity`, myEvent)
                },
                AddContact: function(contact) {
                    var contact = $.param(contact)
                    return this._request('post', `Contact`, contact)
                },
                EditContact: function(contact) {
                    var contactID = contact.ContactID;
                    var contact = $.param(contact);
                    return this._request('put', `Contact/${contactID}`, contact)
                },
                AddIssue: function(issue) {
                    var issue = $.param(issue);
                    return this._request('post', `Issue`, issue)
                },
                EditIssue: function(issue) {
                    console.log("issue", issue)
                    var issueID = issue.IssueID;
                    var issue = $.param(issue);
                    return this._request('put', `Issue/${issueID}`, issue)
                },
                EditProspect: function(prospect) {
                    // var prospectID = prospect.ProspectID;
                    for (var key in prospect) {
                        // console.log(key)
                        if (prospect[key] == '' || prospect[key] == undefined) {
                            // console.log("Blank value")
                            prospect[key] = " ";
                        }
                    }
                    var prospect = $.param(prospect);
                    return this._request('put', '', prospect)
                }
            };
        }
);
