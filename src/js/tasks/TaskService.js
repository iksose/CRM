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
                    // this.unshift(new Task(args[i]));
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
                        this.unshift(args[i]);
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

        class TaskService {
            constructor(obj) {
                this.TaskList = new TaskList()
                this.UserList = new UserList();
                this.Departments = [];
                this.Groups = {};
            }
        }

        var taskService = new TaskService();
        taskFactory.getUsers().then(function(users) {
            taskService.Departments.push(..._.chain(users.data.UserList)
                .pluck('Department')
                .uniq()
                .value())
            var groups = _.groupBy(users.data.UserList, "Department");
            for (var key in groups) {
                taskService.Groups[key] = groups[key];
                taskService.Groups[key].forEach(x => x.online = false);
                taskService.Groups[key].forEach(x => x.img = Math.floor(Math.random() * (4 - 1) + 1));
            }
        })
        return taskService;
    });
