angular.module('uiRouterSample')
    .service('TaskService', function(LoginService, taskFactory) {
        class Task {
            constructor(obj) {
                Object.assign(this, obj);
                this.DueDate = moment(obj.CompletionDateTime).format("ll")
            }
        }

        class TaskList extends Array {
            constructor(...args) {
                super(...args);
            }
            add(array) {
                while (this.length) {
                    this.pop();
                }
                for (var i = 0; i < array.length; i++) {
                    this.push(new Task(array[i]))
                }
            }
            remove(activityID) {
                this.splice(this.map(tasks => tasks.ActivityID).indexOf(activityID), 1);
            }
            update(ActivityID: number, Status: number) {
                this[this.map(tasks => tasks.ActivityID).indexOf(ActivityID)].Status = Status;
            }
            push(...args) {
                for (var i = 0; i < args.length; i++) {
                    var duplicate = false;
                    for (var ii = 0; ii < this.length; ii++) {
                        if (args[i].ActivityID == this[ii].ActivityID) {
                            duplicate = true;
                        }
                    }
                    if (!duplicate) {
                        this.unshift(new Task(args[i]));
                    }
                }
            }
        }
        class UserList extends Array {
            constructor(...args) {
                super(...args);
            }
            push(...args) {
                // unique array;
                for (var i = 0; i < args.length; i++) {
                    var duplicate = false;
                    for (var ii = 0; ii < this.length; ii++) {
                        if (args[i].UserID == this[ii].UserID) {
                            duplicate = true;
                        }
                    }
                    if (!duplicate) {
                        this.unshift(new User(args[i]));
                    }
                }
            }
            remove(UserID) {
                if (LoginService.cookie_user() == UserID) {
                    // can't remove yourself
                    return;
                }
                this.splice(this.map(user => user.UserID).indexOf(UserID), 1);
            }
        }
        class User {
            constructor(obj) {
                Object.assign(this, obj);
                this.Task = "blank"
            }
            // update(user) {
            //     console.log("Update this user...?", user)
            // }
        }

        class TaskService {
            constructor(obj) {
                this.TaskList = new TaskList()
                this.UserList = new UserList();
                this.Departments = [];
                this.Groups = {};
            }
            FindUser(UserID: number): Object {
                // console.log("Find user by user ID")
                var match = {};
                for (var key in this.Groups) {
                    var self = this;
                    this.Groups[key].forEach(function(role) {
                        var idx = self.Groups[key].map(user => user.UserID).indexOf(UserID)
                        if (idx != -1) {
                            match = self.Groups[key][idx]
                        }
                    })
                }
                return match
            }
        }

        var taskService = new TaskService();
        // todo -> this is a completely different array/scope/model
        taskFactory.getUsers().then(function(users) {
            taskService.Departments.push(..._.chain(users.data.UserList)
                .pluck('Department')
                .uniq()
                .value())
            var groups = _.groupBy(users.data.UserList, "Department");
            for (var key in groups) {
                taskService.Groups[key] = groups[key];
                taskService.Groups[key].forEach(x => x.online = false);
                taskService.Groups[key].forEach(x => x.img = psuedoRandom());
            }
        })

        function psuedoRandom() {
            var lastResult = 1;
            var count = 1;
            var result = 1
            if (count < 3) {
                result = Math.floor(Math.random() * (4 - lastResult) + count)
                lastResult = result;
                count++
            } else {
                count = 0
                var result = Math.floor(Math.random() * (4 - lastResult) + lastResult)
                lastResult = result;
            }
            return result
        }
        return taskService;
    });
