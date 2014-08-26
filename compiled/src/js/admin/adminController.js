define([], function() {
  "use strict";
  angular.module('uiRouterSample').controller('adminController', function($scope, $rootScope, $state, $alert) {
    console.log("Welcome to the Admin Controller");
    if (!$rootScope.credentials.admin) {
      $state.go("home");
      var myAlert = $alert({
        title: "Forbidden - ",
        content: "We're calling the cops",
        placement: 'top',
        type: 'danger',
        show: true,
        keyboard: true,
        duration: 3
      });
    }
  });
  return {};
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvYWRtaW4vYWRtaW5Db250cm9sbGVyLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsianMvYWRtaW4vYWRtaW5Db250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd1aVJvdXRlclNhbXBsZScpXG4uY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRhbGVydCkge1xuICBjb25zb2xlLmxvZyhcIldlbGNvbWUgdG8gdGhlIEFkbWluIENvbnRyb2xsZXJcIilcbiAgaWYoISRyb290U2NvcGUuY3JlZGVudGlhbHMuYWRtaW4pe1xuICAgICRzdGF0ZS5nbyhcImhvbWVcIilcbiAgICB2YXIgbXlBbGVydCA9ICRhbGVydCh7dGl0bGU6IFwiRm9yYmlkZGVuIC0gXCIsXG4gICAgICAgIGNvbnRlbnQ6IFwiV2UncmUgY2FsbGluZyB0aGUgY29wc1wiLFxuICAgICAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgICAgIGR1cmF0aW9uOiAzXG4gICAgICAgIC8vIGNvbnRhaW5lcjogXCJib2R5XCJcbiAgICAgIH0pO1xuICB9XG5cbn0pXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=