﻿var myprofile;
var date = new Date();
var now;
var chatmessage;
var newchatmessage;

angular.module('starter.controllers', [])

// GROUP
.controller('GroupCtrl', function($scope, Chats) {

	console.log( localStorage['55d177c2d20212737c46c685'] );
	
	$scope.myProfile = myprofile;
	$scope.orgGroups = main.getDataManager().orgGroups;
	$scope.pjbGroups = main.getDataManager().projectBaseGroups;
	$scope.pvGroups = main.getDataManager().privateGroups;

	//$scope.chats = Chats.all();
	$scope.chats = main.getDataManager().orgMembers;
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

// GROUP - Type
.controller('GroupProjectbaseCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().projectBaseGroups[$stateParams.chatId];
	
	members = main.getDataManager().projectBaseGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
})
.controller('GroupPrivateCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().privateGroups[$stateParams.chatId];
	
	members = main.getDataManager().privateGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
})
.controller('GroupOrggroupsCtrl', function($scope, $stateParams) {	
	$scope.chat = main.getDataManager().orgGroups[$stateParams.chatId];
	
	members = main.getDataManager().orgGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
	
			
    $scope.toggle = function(chatId) {    
		if( localStorage[chatId] )
			chatmessage = JSON.parse(localStorage[chatId]);
		else
			chatmessage = '';			
		console.log( 'local messages : '+localStorage[chatId] );
    
		server.JoinChatRoomRequest(chatId, function(err, res){
			console.log('----------------------------------------------');
			console.log(res);

			if( res.code == 200 )
			{
				console.log('Code 200');
				access = date.toISOString();
				
				allRoomAccess = myprofile.roomAccess.length;
				for(i=0; i<allRoomAccess; i++)
				{
					if( myprofile.roomAccess[i].roomId == chatId )
						access = myprofile.roomAccess[i].accessTime;
				}				
				
				//now = date.toISOString();
				//access = '2015-09-24T08:00:00.000Z';
				
				chatroom.getChatHistory(chatId, access, function(err, res){
					console.log('new '+res.length);
					members = main.getDataManager().orgMembers;
					console.log(res);
					
					res_length = res.length;
					if( res_length > 0 )
					{
						chatmessage_length = chatmessage.length;
						for(i=0; i<res_length; i++)
						{
							chatmessage[chatmessage_length+i] = res[i];
						}
						//newchatmessage = res;
						localStorage[chatId] = JSON.stringify(chatmessage);
						//console.log(localStorage[chatId]);
					}
					
					location.href = '#/tab/message/'+chatId;
				});
			}
		});
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







.controller('ChatsCtrl', function($scope, Chats) {
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	
	chat = chatmessage;
	for(i=0; i<chat.length; i++)
	{
		chat[i]['sender_displayname'] = members[chat[i]['sender']]['displayname'];
		chat[i]['sender_image'] = members[chat[i]['sender']]['image'];
		
		if( chat[i]['sender'] == myprofile['_id'] )
			chat[i]['msgowner'] = 'owner';
		else
			chat[i]['msgowner'] = 'other';
	}
		
	$scope.chat = chat;
	$('#send_message').css({'display':'inline-block'});
	$('#chatroom_back').css({'display':'inline-block'});
})

.controller('FreecallCtrl', function($scope, $stateParams) {
	
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		logOut: true,
	};
}); // <-- LAST CONTROLLER



function groupMembers(members, size)
{
	var max = members.length;
	if( max > 5 )
		max = 5;
		
	if( size )
		max = size;

	gmember = [];
	//console.log('ALL GROUP MEMBERS : '+members.length);	
	for(i=0; i<max; i++)
	{
		gmember[i] = main.getDataManager().orgMembers[members[i]['id']];
		console.log('GROUP MEMBERS : '+main.getDataManager().orgMembers[members[i]['id']]['displayname']);
	}
	
	return gmember;
}

function back()
{
	javascript:history.back();
	$('#send_message').css({'display':'none'});
	$('#chatroom_back').css({'display':'none'});
}

