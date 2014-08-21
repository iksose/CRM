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
            remove(ActivityID) {
                var indx = this.indexOf(ActivityID)
                this.splice(indx, 1)
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
