angular.module('uiRouterSample')
    .service('TaskService', function() {
        class Task {
            constructor(obj) {
                Object.assign(this, obj);
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
        }

        class TaskService {
            constructor(obj) {
                this.TaskList = new TaskList()
            }
        }

        var taskService = new TaskService();
        return taskService;
    });
