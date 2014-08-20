angular.module('uiRouterSample')
    .service('TaskService', function() {
        class TaskList extends Array {
            constructor(array) {
                this.array = array || [];
            }
            get length() {
                return this.array.length;
            }
            set length(value) {
                this.array.length + value
            }
            get dicks() {
                return "dicks";
            }
        }
        var TaskService = {}
        TaskService.name = "Peter"
        TaskService.TaskList = new TaskList([])
        // obj.TaskList = []
        return TaskService;
    });
