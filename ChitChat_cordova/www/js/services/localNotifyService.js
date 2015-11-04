﻿(function () {
    'use strict';

    angular
        .module('spartan.notify', [])
        .factory('localNotifyService', localNotifyService);

    // localNotifyService.$inject = ['$http', '$cordovaLocalNotification'];

    function localNotifyService($http, $cordovaLocalNotification, $cordovaToast) {
        var dataListener = main.getDataListener();
        var dataManager = main.getDataManager();
        var onChatListenerImp = new HomeComponent();
        dataListener.addListenerImp(onChatListenerImp);
        onChatListenerImp.onChat = function(chatMessageImp) {
            console.warn(chatMessageImp.type);
            if(chatMessageImp.type === ContentType[ContentType.Text]) {
                var contact = dataManager.getContactProfile(chatMessageImp.sender);
                var secure = new SecureService();
                secure.decryptWithSecureRandom(chatMessageImp.body,  function done(err, res) {
                     if (!err) {
                        chatMessageImp.body = res;
                        scheduleSingleNotification(contact.displayname, chatMessageImp.body);
                        makeToastOnCenter(chatMessageImp.body);
                    }
                    else {
                        console.warn(err, res);
                    }
                });
            }
            else if(chatMessageImp.type === ContentType[ContentType.Sticker]) {
                var contact = dataManager.getContactProfile(chatMessageImp.sender);
                var message = contact.displayname + " sent a sticker."
                makeToastOnCenter(message);
                scheduleSingleNotification(contact.displayname, message);
            }
            else if (chatMessageImp.type === ContentType[ContentType.Voice]) {
                var contact = dataManager.getContactProfile(chatMessageImp.sender);
                var message = contact.displayname + " sent a voice message."
                makeToastOnCenter(message);
                scheduleSingleNotification(contact.displayname, message);
            }
            else if (chatMessageImp.type === ContentType[ContentType.Image]) {
                var contact = dataManager.getContactProfile(chatMessageImp.sender);
                var message = contact.displayname + " sent a image."
                makeToastOnCenter(message);
                scheduleSingleNotification(contact.displayname, message);
            }
            else if (chatMessageImp.type === ContentType[ContentType.Video]) {
                var contact = dataManager.getContactProfile(chatMessageImp.sender);
                var message = contact.displayname + " sent a video."
                makeToastOnCenter(message);
                scheduleSingleNotification(contact.displayname, message);
            }
            else if (chatMessageImp.type === ContentType[ContentType.Location]) {
                var contact = dataManager.getContactProfile(chatMessageImp.sender);
                var message = contact.displayname + " sent a location."
                makeToastOnCenter(message);
                scheduleSingleNotification(contact.displayname, message);
            }
        }
        
        var service = {
            getData: getData,
            scheduleSingleNotification: scheduleSingleNotification,
            updateSingleNotification: updateSingleNotification,
            cancelSingleNotification: cancelSingleNotification,
            registerPermission: registerPermission
        };

        return service;

        function getData() { }

        function registerPermission() {
            cordova.plugins.notification.local.registerPermission(function (granted) {
                console.warn('Permission has been granted: ' + granted);
            });
        }
        
        function makeToastOnCenter(message) {
             $cordovaToast.showLongCenter(message).then(function(success) {
                // success
                console.debug('success', success);
                navigator.notification.beep(1);
            }, function (error) {
                // error
                console.error('error', error);
            });
        }

        function scheduleSingleNotification(title, text) {
            // ========== Scheduling
            console.warn("schedule: ", text);
            $cordovaLocalNotification.schedule({
                id: 1,
                title: title,
                text: text,
                data: {
                    customProperty: 'custom value'
                }
            }).then(function (result) {
                console.info('scheduleSingleNotification', result);
            });
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