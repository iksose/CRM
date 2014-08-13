angular.module('uiRouterSample')
.factory('activityFactory', function($http, $upload, $alert, $q) {
    var activityFactory = {};
    var myUpload = {};
    var activityMethods = {
        self: this,
        _campaignID: "",
        _activity: "",
        saveActivity_and_then_do_Attachments: function(campaignID, activity){
            console.log("Save activity and then do attachments", campaignID, activity);
            // so we can use them for the next function
            self._campaignID = campaignID
            self.activity = activity
            // $q
            var deferred  = $q.defer();
            // deferred only resolves if they both resolve!
            $http.post('http://10.1.1.118:8000/api/Campaign/'+campaignID+'/Activity', $.param(activity) ).success(function(data){
                console.log("SUCCESS!", data)
                console.log("Now to upload...", myUpload)
                if(Object.keys(myUpload).length === 0){
                    console.log("Nevermind....myUpload is empty")
                    deferred.resolve(data);
                }else{
                    var activityID = data.ActivityID;
                    $upload.http({
                        url: 'http://10.1.1.118:8000/api/Campaign/'+campaignID+'/Activity/'+activityID+'/Attachment/' +  myUpload.name,
                        headers: {'Content-Type': myUpload.type},
                        data: myUpload
                    }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data) {
                        deferred.resolve(data);
                        console.log("Success", data)
                    }).catch(function(err) {
                        fnShowAlert(err.config)
                        deferred.reject();
                    })
                }
            }).catch(function(err){
                fnShowAlert(err.config)
                deferred.reject();
            });
            return deferred.promise;
        }
    }

    function fnShowAlert( {method, url} ){
        console.log("Err", method, url)
        var myAlert = $alert({title: "Error",
            content: method +" "+ url,
            placement: 'top',
            type: 'danger',
            show: true
          });
    }
    return [activityFactory, activityMethods, myUpload]
});
