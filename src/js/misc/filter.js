angular.module('uiRouterSample')
.filter('selectedTags', function() {
    return function(tasks, tags) {
        return tasks.filter(function(task) {

            for (var i in task.Tags) {
                if (tags.indexOf(task[i]) != -1) {
                    return true;
                }
            }
            return false;

        });
    };
});
