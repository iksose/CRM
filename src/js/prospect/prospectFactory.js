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
                }
            };
        }
);
