var myprofile;
var date = new Date();
var now;
var newchatmessage;
var currentRoom;
var allMembers;

angular.module('starter.controllers', [])

.controller("LoginCtrl", function ($scope) {
    console.warn('LoginCtrl');

    $scope.confirmDialog = function () {
        navigator.notification.confirm("Checkout this confirmation dialog", function (buttonIndex) {
            switch (buttonIndex) {
                case 1:
                    console.log("Decline Pressed");
                    break;
                case 2:
                    console.log("Dont Care Pressed");
                    break;
                case 3:
                    console.log("Accept Pressed");
                    break;
            }
        }, "Our Title", ["Decline", "Dont Care", "Accept"]);
    }
})

// GROUP
.controller('GroupCtrl', function($scope, $timeout) {
	
    myprofile = main.getDataManager().myProfile;
    $scope.myProfile = myprofile;
	$scope.orgGroups = main.getDataManager().orgGroups;
	$scope.pjbGroups = main.getDataManager().projectBaseGroups;
	$scope.pvGroups = main.getDataManager().privateGroups;
	
    var reload = function () {		
		if( currentRoom != '' )
		{	
			myprofile = main.getDataManager().myProfile;
			$scope.myProfile = myprofile;
			$scope.orgGroups = main.getDataManager().orgGroups;
			$scope.pjbGroups = main.getDataManager().projectBaseGroups;
			$scope.pvGroups = main.getDataManager().privateGroups;

			$timeout(reload, 1000);
		}
    }
    $timeout(reload, 1000);

	//$scope.chats = Chats.all();
	allMembers = main.getDataManager().orgMembers;
	$scope.chats = allMembers;
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};		
	
	$scope.viewlist = function(list) {
		var listHeight = $('#list-'+list+' .list').height();		
		if( parseInt(listHeight) != 0 ){
			$('#nav-'+list+' .button i').attr('class','icon ion-chevron-down');
			$('#list-'+list+' .list').animate({'height':'0'});
		}else{
			$('#nav-'+list+' .button i').attr('class','icon ion-chevron-up');
			$('#list-'+list+' .list').css({'height':'auto'});
		}
	};
})

// GROUP - Profile
.controller('GroupMyprofileCtrl', function($scope) {
	$scope.chat = main.getDataManager().myProfile;
})

// Group - View Profile
.controller('GroupViewprofileCtrl', function($scope, $stateParams, $state, $cordovaProgress) {
	if($stateParams.chatId==main.getDataManager().myProfile._id){
		$scope.chat = main.getDataManager().myProfile;
		$scope.model = {
		    displayname: $scope.chat.displayname,
		    status: $scope.chat.status
		};
		$scope.title = "My Profile";
		$('#viewprofile-input-display').removeAttr('disabled');
		$('#viewprofile-input-status').removeAttr('disabled');
		$scope.edit = 'true';

		$scope.$on('imgUrl', function(event, url) { 
			if(url!=null){
				server.ProfileImageChanged($stateParams.chatId,url,function(err,res){
					main.getDataManager().myProfile.image = url;
					if(main.getDataManager().myProfile.displayname != $scope.model.displayname ||
						main.getDataManager().myProfile.status != $scope.model.status){
						saveProfile();
					}else saveSuccess();
				});
			}else{
				if(main.getDataManager().myProfile.displayname != $scope.model.displayname ||
						main.getDataManager().myProfile.status != $scope.model.status){
					saveProfile();
				}
			}
		});

		function saveProfile(){
			server.UpdateUserProfile($stateParams.chatId,$scope.model,function(err,res){
				console.log(JSON.stringify(res));
				main.getDataManager().myProfile.displayname = $scope.model.displayname;
				main.getDataManager().myProfile.status = $scope.model.status;
				saveSuccess();
			});
		}

		function saveSuccess(){
			$cordovaProgress.showSuccess(false, "Success!");
	    	setTimeout(function(){ $cordovaProgress.hide(); }, 1500);
		}

	}else{
    	var member = main.getDataManager().orgMembers[$stateParams.chatId];
		if(	member.firstname == null || member.firstname == "" &&
			member.lastname == null || member.lastname == "" &&
			member.mail == null || member.mail == "" && 
			member.role == null || member.role == "" &&
			member.tel == null || member.tel == ""){
			server.getMemberProfile($stateParams.chatId, function(err, res) {
				if (!err) {
					console.log(JSON.stringify(res));
					console.log(res["data"]);
					member.firstname = res["data"].firstname;
					member.lastname = res["data"].lastname;
					member.mail = res["data"].mail;
					member.role = res["data"].role;
					member.tel = res["data"].tel;
					$state.go($state.current, {}, {reload: true});
				}
				else {
					console.warn(err, res);
				}
			});
		}
		$scope.chat = main.getDataManager().orgMembers[$stateParams.chatId];
		$scope.model = {
		    displayname: $scope.chat.displayname,
		    status: $scope.chat.status
		};
		$scope.title = $scope.chat.displayname+"'s Profile";
		$('#viewprofile-input-display').attr('disabled','disabled');
		$('#viewprofile-input-status').attr('disabled','disabled');
		$scope.edit = 'false';
	}
})

.factory('getProfileMember',function(){
	var result;
	function _all(){

	}
})


// GROUP - Type
.controller('GroupProjectbaseCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().projectBaseGroups[$stateParams.chatId];
	
	members = main.getDataManager().projectBaseGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
			
	$scope.toggle = function (chatId) {
	    currentRoom = chatId;
	    location.href = '#/tab/group/chat/' + chatId;
	};
})
.controller('GroupPrivateCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().privateGroups[$stateParams.chatId];
	
	members = main.getDataManager().privateGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
			
	$scope.toggle = function (chatId) {
	    currentRoom = chatId;
	    location.href = '#/tab/group/chat/' + chatId;
	};
})
.controller('GroupOrggroupsCtrl', function($scope, $stateParams) {	
	$scope.chat = main.getDataManager().orgGroups[$stateParams.chatId];
	
	members = main.getDataManager().orgGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
			
	$scope.toggle = function (chatId) {
	    currentRoom = chatId;
	    location.href = '#/tab/group/chat/' + chatId;
	};
})
.controller('GroupDetailCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().orgMembers[$stateParams.chatId];
})

// GROUP - Type
.controller('GroupMembersCtrl', function($scope, $stateParams) {	
	$scope.chat = main.getDataManager().orgGroups[$stateParams.chatId];
	
	members = main.getDataManager().orgGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members, members.length);
	$scope.members_length = members.length;
})

.controller('ChatsCtrl', function($scope) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $timeout, $stateParams, Chats) 
{    	
	$scope.chat = [];

    console.log(main.dataManager.getMyProfile())

	var chatRoomControl = new ChatRoomController(main);
	main.dataListener.addListenerImp(chatRoomControl);
	var chatRoomApi = main.getChatRoomApi();
	chatRoomControl.serviceListener = function (event, newMsg) {
	    if (event === "onChat") {
	        Chats.set(chatRoomControl.chatMessages);

	        if (newMsg.sender !== main.dataManager.myProfile._id) {
	            chatRoomApi.updateMessageReader(newMsg._id, currentRoom);
	        }
	    }
	    else if (event === "onMessageRead") {
	        console.warn(newMsg);
	        Chats.set(chatRoomControl.chatMessages);
	    }
    }
    chatRoomControl.getMessage(currentRoom, Chats, function () {
        Chats.set(chatRoomControl.chatMessages);
    });
     
    var countUp = function () {		
		if( currentRoom != '' )
		{
			// localStorage.removeItem(myprofile._id+'_'+currentRoom);
			// localStorage.setItem(myprofile._id+'_'+currentRoom, JSON.stringify(chatRoomControl.chatMessages));
			// console.log('update with timeout fired');
			$scope.chat = Chats.all();
			console.log( 'Refresh! by timeout fired...');

			$timeout(countUp, 1000);
		}
    }
    $timeout(countUp, 1000);
	
    var chats = Chats.all();
    /*chats.forEach(chat => {
        console.log(chat);
    });*/


	$scope.allMembers = allMembers;
	$scope.myprofile = myprofile;
    $scope.chat = Chats.all();
    $('#send_message').css({ 'display': 'inline-block' });
    //$('#chatroom_back').css({ 'display': 'inline-block' });
	
	// Send Message btn
	$('#send_message button').click(function(){
	    var content = $('#send_message input').val();
		if( content != '' )
		{
			main.encodeService(content, function(err, result) {
				if (err) {
					console.error(err);
				}
				else {
					//var myId = myprofile._id;
					chatRoomApi.chat(currentRoom, "*", myprofile._id, result, ContentType[ContentType.Text], function(err, res) {
						if (err || res === null) {
							console.warn("send message fail.");
						}
						else {
							console.log("send message:", res);
						}
					});
				}
			});
			// Clear
			$('#send_message input').val('')
		}
	});
	$scope.viewReader = function (readers) {
	    readers.forEach(function iterator(member) {
	        console.log(JSON.stringify(dataManager.orgMembers[member]));
	    });
	}
	
    $scope.$on('$ionicView.enter', function(){ //This is fired twice in a row
        console.log("App view (menu) entered.");
        console.log(arguments); 
    });

    $scope.$on('$ionicView.leave', function(){ //This just one when leaving, which happens when I logout
        console.log("App view (menu) leaved.");
        console.log(arguments);
				
		$('#send_message').css({ 'display': 'none' });

		console.error("this back function is call many time.")

		chatRoomControl.leaveRoom(currentRoom, function callback(err, res) {
			localStorage.removeItem(myprofile.displayname_id + '_' + currentRoom);
			localStorage.setItem(myprofile.displayname_id + '_' + currentRoom, JSON.stringify(chatRoomControl.chatMessages));
			console.warn("save", currentRoom, JSON.stringify(chatRoomControl.chatMessages));

			currentRoom = "";
			chatRoomControl.chatMessages = [];
		});
    });
	
})

.controller('FreecallCtrl', function($scope, $stateParams) {
	
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		logOut: true,
	};
})

.controller('AccountCreate',function($scope) {
    $scope.images = "http://placehold.it/50x50";
})

.controller('ImageController', function($scope, $ionicPlatform, $ionicActionSheet, $ionicLoading, $cordovaProgress, ImageService, FileService) {
 
  	$ionicPlatform.ready(function() {
    	$scope.images = FileService.images();
    	if (!$scope.$$phase) { $scope.$apply(); }
  	});

  	$scope.urlForImage = function(imageName) {
    	var trueOrigin = cordova.file.dataDirectory + imageName;
    	return trueOrigin;
  	}
 
	$scope.addImg = function() {
	    $scope.hideSheet = $ionicActionSheet.show({
	      buttons: [
	        { text: 'Take photo' },
	        { text: 'Photo from library' }
	      ],
	      titleText: 'Add images',
	      cancelText: 'Cancel',
	      buttonClicked: function(index) {
	        $scope.addImage(index);
	      }
	    });
	}
 
  	$scope.addImage = function(type) {
    	$scope.hideSheet();
    	ImageService.handleMediaDialog(type).then(function() {
      		$scope.$apply();
    	});
  	}

  	$scope.uploadImg = function() {
  		if(FileService.getImages().length==0) { $scope.$emit('imgUrl',null); return; }
	    var imageURI = cordova.file.dataDirectory + FileService.getImages();
	    var options = new FileUploadOptions();
	    options.fileKey = "fileToUpload";
	    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	    options.mimeType = "image/jpeg";
	    var params = new Object();
	    options.params = params;
	    options.chunkedMode = false;
	    var ft = new FileTransfer();
	    ft.onprogress = function(progressEvent){
	    	if (progressEvent.lengthComputable) {
		      $ionicLoading.show({
			      template: 'Uploading ' + (Math.round(progressEvent.loaded / progressEvent.total * 100)).toFixed(0) + '%'
			  });
		    } else {
		      //loadingStatus.increment();
		    }
	    };
	    ft.upload(imageURI, "http://stalk.animation-genius.com/?r=api/upload", win, fail,
	        options);
	}

	function win(r) {
	    console.log("Code = " + r.responseCode);
	    console.log("Response = " + r.response);
	    console.log("Sent = " + r.bytesSent);
	    $ionicLoading.hide();
	    $scope.$emit('imgUrl', r.response);
	    FileService.clearImages();
	}

	function fail(error) {
	    alert("An error has occurred: Code = " + error.code);
	    console.log("upload error source " + error.source);
	    console.log("upload error target " + error.target);
	    $cordovaProgress.showText(false, "Fail!", 'center');
	    setTimeout(function(){ $cordovaProgress.hide(); }, 1500);
	}
}); // <-- LAST CONTROLLER

function groupMembers(members, size)
{
	var max = members.length;
	if( max > 5 )
		max = 5;
		
	if( size )
		max = size;

    var counter = 0;
	var gmember = [];
    for(var i = 0; i <= members.length; i++) {
        if(!!members[i]) {
            var mem_id = members[i].id;
            var member = main.getDataManager().orgMembers[mem_id];
             if(!!member) {
                gmember.push(member);
                counter += 1;

                if(counter >= max) { break; }
            }
        }
    }
    return gmember;
}

function back()
{
	//$('#send_message').css({'display':'none'});
	//$('#chatroom_back').css({'display':'none'});
}
