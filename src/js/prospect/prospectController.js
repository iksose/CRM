angular.module('uiRouterSample')
    .controller('prospectController', function($scope, $rootScope, $state, $alert, prospectFactory, $location) {
        console.log("Hello prospect")

        $scope.scrolltoHref = function(id) {
            console.log(id)
            if (id == 'Details') {
                // $location.hash(id);
                window.scrollBy(0, -5000);
            } else {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash(id);
                // window.scrollBy(0,-100);
                // call $anchorScroll()
                // $anchorScroll();
            }
        };

        $scope.currentPage = 1;
        var zoomcount = 3

        $scope.currentContact

        $scope.clickTab = 1;

        $scope.onClickTab = function(bool) {
            console.log(bool)
            $scope.clickTab = bool;
        }
        $scope.isActiveTab = function(contact) {
            return contact == $scope.currentContact;
        }


        //for the prospect details list
        $scope.isCollapsed = true;

        //show details is when they click a timeline event
        $scope.showDetails = false;

        $scope.saveContact = function(contact) {
            console.log("Saving contact...", contact)
        }


        // filters
        $scope.filters = ['All Activities', 'Only My Activities', 'Closed Issues', 'Open Issues', 'Trinet', 'ProfitGuard'];
        // selected filters
        $scope.selection = ['All Activities', 'Closed Issues', 'Open Issues', 'Trinet', 'ProfitGuard'];
        // toggle selection for a given filter by name
        $scope.toggleSelection = function toggleSelection(filterName) {
            var idx = $scope.selection.indexOf(filterName);
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
                deleteFilter(filterName);
            }
            // is newly selected
            else {
                addFilter(filterName);
                $scope.selection.push(filterName);
            }
        };

        function timeBetween() {
            var array = $scope.the_Prospect.Activities
            if (array.length > 0) {
                for (var i = 0; i < array.length - 1; i++) {
                    var arr = [];
                    arr.push(array[i].year)
                    arr.push(array[i].month)
                    arr.push(array[i].smallDay)
                    var a = moment(arr);
                    arr = [];
                    arr.push(array[i + 1].year)
                    arr.push(array[i + 1].month)
                    arr.push(array[i + 1].smallDay)
                    var b = moment(arr);
                    var diff = a.diff(b, 'days')
                    $scope.the_Prospect.Activities[i + 1].timebetween = diff + " days..."
                    if (diff == 0) {
                        $scope.the_Prospect.Activities[i + 1].timebetween = "Same day"
                    }
                }
                $scope.the_Prospect.Activities[0].timebetween = ""
            }
            // console.log("Done", $scope.the_Prospect.Activities[0].timebetween)
        }

        function deleteFilter(filterName) {
            var itemsGet = items.get();
            var remove = _.filter(itemsGet, function(num) {
                return num.typeOf == filterName
            });
            items.remove(remove)
        }

        function addFilter(filterName) {
            var itemsGet = Activities_and_Issues;
            var adds = _.filter(itemsGet, function(num) {
                return num.typeOf == filterName
            });
            items.add(adds)
        }

        $scope.the_Prospect;
        $scope.Contacts = [];
        console.log($state.params)
        prospectFactory.getProspect_by_ID($state.params).then(function(data) {
            console.log("Got prospect", data)
            $scope.the_Prospect = new Prospect(data.data);
            $scope.the_Prospect.Activities.reverse();
            // console.log($scope.the_Prospect.latest);
            console.log($scope.the_Prospect)
            timeBetween();
            // makeTimeline();
            // cloneProspect();
            $scope.currentContact = $scope.the_Prospect.Contacts[0]
        })

        var timeline;
        var items;
        var Activities_and_Issues;

        function makeTimeline() {
            console.log("Making timeline...this concats all events on the same day")

            Activities_and_Issues = $scope.the_Prospect.Issues.concat($scope.the_Prospect.Activities)

            function compareNumbers(a, b) {
                return a.day - b.day;
            }
            Activities_and_Issues.sort(compareNumbers)

            var dupes = [];
            var ranges = _.pluck(Activities_and_Issues, 'year_day');
            var ranges = _.uniq(ranges)
            var mothership = []
            ranges.forEach(function(range, it) {
                var groups = _.where(Activities_and_Issues, {
                    'year_day': range
                });
                // pull out issues
                var issues = []
                var found = false;
                groups.forEach(function(type) {
                    if (type.issue && groups.length > 1) {
                        var index = groups.indexOf(type);
                        issues = groups.splice(index, 1);
                        found = true;
                    }
                })
                if (found) {
                    mothership.push(issues)
                    found = false;
                }
                mothership.push(groups);
            })

            Activities_and_Issues = [];
            mothership.forEach(function(arr) {
                if (arr[0].issue) {
                    console.log("Issue in mothership")
                    arr[0].content = "Issue"
                    Activities_and_Issues.push(arr[0])
                } else {
                    arr[0].content = arr.length + " Notes"
                    arr[0].warning = true;
                    arr[0].subnotes = arr;
                    Activities_and_Issues.push(arr[0])
                }
            })

            items = new vis.DataSet(Activities_and_Issues);

            var container = document.getElementById('visualization');
            var options = {
                zoomable: false,
                width: '100%',
                minHeight: '150px',
                // height: '200px',
                editable: false,
                //   min: new Date(2014, moment().subtract('month', 2).format("M"), 1), //furthest back you can go
                start: new Date(2014, moment().subtract('month', 2).format("M"), 1),
                max: new Date(2014, 7, 1)
                //   zoomMin: 1000 * 60 * 60 * 24            // one day in milliseconds, furthest "in"
                // zoomMax: 1000 * 60 * 60 * 24 * 31 * 3   // about three months in milliseconds
            };
            timeline = new vis.Timeline(container, items, options);
            timeline.on('select', function(properties) {
                logEvent('select', properties)
            });
            timeline.on('rangechanged', function(time) {
                // var start = new Date(time.start)
                // start = start.toString().substring(0,15)
                // var end = new Date(time.end)
                // end = end.toString().substring(0,15)
                // console.log(start, end)
                // console.log( moment(end).isAfter(start) );
            });
        }


        $scope.message = "Select an event";

        function logEvent(event, properties) {
            // console.log(items[ properties.items[0] ])
            var content = items._data[properties.items[0]]
                // console.log(content.content)
            $scope.message = content.Note;
            console.log(content)
            if (content.warning) {
                console.log("Special message -> goto note")
                gotoNote(content);
            } else if (content.issue) {
                console.log("Special issue -> goto issue")
                gotoIssue(content);
            }
            $scope.msgInfo = content;
            $scope.showDetails = true;
            $scope.$digest();
        }

        function gotoIssue(note) {
            //goto note should reset zoom to "baseline"
            zoomcount = 3
            var container = document.getElementById('visualization');
            var monthStart = moment(note.start).startOf('month').format("D")
            var monthEnd = moment(note.start).endOf('month').format("D")
            var options = {
                zoomable: false,
                width: '100%',
                minHeight: '150px',
                editable: false,
                //   min: new Date(year, month-1, day), //furthest back you can go
                start: new Date(note.year, note.month - 1, monthStart),
                max: new Date(note.year, note.month - 1, monthEnd)
            };
            // console.log(note, monthStart, monthEnd)
            note.content = note.Description.substring(0, 20)
            $scope.message = note.Description;
            timeline.destroy();
            timeline = new vis.Timeline(container, items, options);
            timeline.on('select', function(properties) {
                logEvent('select', properties)
            });
        }


        function gotoNote(note) {
            //goto note should reset zoom to "baseline"
            zoomcount = 3
            var container = document.getElementById('visualization');
            var monthStart = moment(note.start).startOf('month').format("D")
            var monthEnd = moment(note.start).endOf('month').format("D")
            var options = {
                zoomable: false,
                width: '100%',
                minHeight: '150px',
                editable: false,
                //   min: new Date(year, month-1, day), //furthest back you can go
                start: new Date(note.year, note.month - 1, monthStart),
                max: new Date(note.year, note.month - 1, monthEnd)
            };
            console.log(note, monthStart, monthEnd)
            note.subnotes.forEach(function(notes) {
                // console.log(notes)
                notes.content = notes.Note.substring(0, 20)
                // items.clear()
                items.remove(note.id)
                items.add(notes)
            })
            timeline.destroy();
            timeline = new vis.Timeline(container, items, options);
            timeline.on('select', function(properties) {
                logEvent('select', properties)
            });
        }

        /**
         * Zoom the timeline a given percentage in or out
         * @param {Number} percentage   For example 0.1 (zoom out) or -0.1 (zoom in)
         */
        //  var zoomcount = 3
        function zoom(zoom_in) {
            console.log("Amounts", zoomcount, zoom_in)
            zoomcount = zoomcount + zoom_in
            var options;
            if (zoomcount == 4) {
                // zoomcount++
                console.log("Zoom in", zoomcount)
                options = {
                    zoomable: false,
                    width: '100%',
                    minHeight: '150px',
                    editable: false,
                    //   min: new Date(2014, 5, 1), //furthest back you can go
                    start: new Date(2014, 5, 1),
                    max: new Date(2014, 7, 1)
                };
                // prevents zoom count from going past 4
                zoomcount = 3;
                zoomTimeline()
            } else if (zoomcount == 2) {
                // zoomcount--
                console.log("Zoom out 'month view' ", zoomcount)
                coolnewSortMethod();
                options = {
                    zoomable: false,
                    width: '100%',
                    minHeight: '150px',
                    editable: false,
                    //   min: new Date(2012, 7, 1), //furthest back you can go
                    start: new Date(2014, 1, 1),
                    max: new Date(2014, 7, 1)
                };
                zoomTimeline()
            } else if (zoomcount == 1) {
                console.error("Wildcard zoom, placeholder...Todo", zoomcount)
                zoomTimeline()
            } else if (zoomcount == 0) {
                console.error("cancel zoom", zoomcount)
                zoomcount++
                return
            }

            function zoomTimeline() {
                var container = document.getElementById('visualization');
                timeline.destroy();
                timeline = new vis.Timeline(container, items, options);
                timeline.on('select', function(properties) {
                    logEvent('select', properties)
                });
            }
        }

        // attach events to the navigation buttons
        document.getElementById('zoomIn').onclick = function() {
            zoom(1);
        };
        document.getElementById('zoomOut').onclick = function() {
            zoom(-1);
        };
        $scope.icons = [{
            value: 1,
            label: 'Owner'
        }, {
            value: 2,
            label: 'Person in'
        }, {
            value: 3,
            label: 'Best Friend'
        }];


        $scope.update = function(contact) {
            var targ = _.findWhere($scope.the_Prospect.Contacts, contact)
            var diff = targ.old_vs_new;
            // need to check the length to see if it's an add or a delete
            if (diff.old.length > diff.new.length) {
                var changed = _.difference(diff.old, diff.new);
                console.log("Subtracted", changed)
            } else {
                var changed = _.difference(diff.new, diff.old);
                console.log("Added", changed)
            }
        }


        function coolnewSortMethod() {
            var months = 12
            var years = [2010, 2011, 2012, 2013, 2014]
            var ranges = _.pluck(Activities_and_Issues, 'month_year');
            var ranges = _.uniq(ranges)
            var mothership = []
            ranges.forEach(function(range, it) {
                var groups = _.where(Activities_and_Issues, {
                    'month_year': range
                });
                mothership[it] = groups;
            })

            items.clear();

            mothership.forEach(function(arr) {
                delete arr[0].id;
                arr[0].content = arr.length + " Notes"
                arr[0].warning = true;
                arr[0].subnotes = arr;
                items.add(arr[0])
            })
        }

    })
