(function () {
    'use strict';

    angular
        .module('spartan.notify', [])
        .factory('localNotifyService', localNotifyService);

    function localNotifyService($http, $cordovaLocalNotification, $cordovaToast, $ionicPopup, $timeout, $mdToast, blockNotifications) {
        var service = {
            getData: getData,
            scheduleSingleNotification: scheduleSingleNotification,
            updateSingleNotification: updateSingleNotification,
            cancelSingleNotification: cancelSingleNotification,
            registerPermission: registerPermission,
            
            makeToast: makeToast,
            makeToastOnCenter: makeToastOnCenter
        };

        return service;

        function getData() { }

        function registerPermission() {
            if (ionic.Platform.platform() === "ios" || ionic.Platform.platform() === 'android') {
                try {
                    $cordovaLocalNotification.registerPermission(function (granted) {
                        console.warn('Permission has been granted: ' + granted);
                    });   
                }
                catch(ex) {
                    console.warn(ex);
                }
            }
        }
        
        function makeToast(message) {
            if (ionic.Platform.platform() === "ios" || ionic.Platform.platform() == 'android') {
                $cordovaToast.showLongCenter(message).then(function (success) {
                    // success
                }, function (error) {
                    // error
                    console.error('error', error);
                });
            }
            else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Simple Toast!')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
                
                // var myPopup = $ionicPopup.show({
                //     title: message
                // });

                // myPopup.then(function (res) {
                // });

                // $timeout(function () {
                //     myPopup.close(); //close the popup after 2 seconds for some reason
                // }, 2000);
            }
        }
        
        function makeToastOnCenter(contactId,message) {
            if (!blockNotifications.isBlockNoti(contactId)) {
                if (ionic.Platform.platform() === "ios") {
                    $cordovaToast.showLongCenter(message).then(function (success) {
                        // success
                        navigator.notification.beep(1);
                    }, function (error) {
                        // error
                        console.error('error', error);
                    });
                }
                else {
                    var myPopup = $ionicPopup.show({
                        title: 'New message!',
                        subTitle: message
                    });

                    myPopup.then(function(res) {
                        console.log('Tapped!', res);
                    });

                    $timeout(function() {
                        myPopup.close(); //close the popup after 2 seconds for some reason
                    }, 2000);
                }
            }
        }

        function scheduleSingleNotification(contactId,title, text) {
            if(!blockNotifications.isBlockNoti(contactId)) {
                console.log("schedule: ", text);
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: title,
                    text: text,
                    data: {
                        customProperty: 'custom value'
                    }
                }).then(function (result) {
                    console.log('scheduleSingleNotification', result);
                });
            }
        }

        function updateSingleNotification() {
            // ========== Update
            $cordovaLocalNotification.update({
                id: 1,
                title: 'Title - UPDATED',
                text: 'Text - UPDATED'
            }).then(function (result) {
                // ...
            });
        }

        function cancelSingleNotification() {
            $cordovaLocalNotification.cancel(1).then(function (result) {
                // ...
            });
        }
    }
})();