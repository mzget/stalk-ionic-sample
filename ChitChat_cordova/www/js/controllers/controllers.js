var date = new Date();
var now;
var newchatmessage;

angular.module('spartan.controllers', [])

// Group - View Profile
.controller('GroupViewprofileCtrl', function ($scope, $stateParams, $state, $cordovaProgress) {
    if ($stateParams.chatId == main.getDataManager().myProfile._id) {
        $scope.chat = main.getDataManager().myProfile;
        $scope.model = {
            displayname: $scope.chat.displayname,
            status: $scope.chat.status
        };
        $scope.title = "My Profile";
        $('#viewprofile-input-display').removeAttr('disabled');
        $('#viewprofile-input-status').removeAttr('disabled');
        $scope.edit = 'true';
        //<!-- edit profile image.
        $scope.$on('fileUrl', function (event, url) {
            if (url != null) {
                server.ProfileImageChanged($stateParams.chatId, url[0], function (err, res) {
                    main.getDataManager().myProfile.image = url[0];
                    if (main.getDataManager().myProfile.displayname != $scope.model.displayname ||
						main.getDataManager().myProfile.status != $scope.model.status) {
                        saveProfile();
                    } else saveSuccess();
                });
            } else {
                if (main.getDataManager().myProfile.displayname != $scope.model.displayname ||
						main.getDataManager().myProfile.status != $scope.model.status) {
                    saveProfile();
                }
            }
        });

        function saveProfile() {
            server.UpdateUserProfile($stateParams.chatId, $scope.model, function (err, res) {
                console.log(JSON.stringify(res));
                main.getDataManager().myProfile.displayname = $scope.model.displayname;
                main.getDataManager().myProfile.status = $scope.model.status;
                saveSuccess();
            });
        }

        function saveSuccess() {
            $cordovaProgress.showSuccess(false, "Success!");
            setTimeout(function () { $cordovaProgress.hide(); }, 1500);
        }

    } else {
        var member = main.getDataManager().orgMembers[$stateParams.chatId];
        if (member.firstname == null || member.firstname == "" &&
			member.lastname == null || member.lastname == "" &&
			member.mail == null || member.mail == "" &&
			member.role == null || member.role == "" &&
			member.tel == null || member.tel == "") {
            server.getMemberProfile($stateParams.chatId, function (err, res) {
                if (!err) {
                    console.log(JSON.stringify(res));
                    console.log(res["data"]);
                    member.firstname = res["data"].firstname;
                    member.lastname = res["data"].lastname;
                    member.mail = res["data"].mail;
                    member.role = res["data"].role;
                    member.tel = res["data"].tel;
                    $state.go($state.current, {}, { reload: true });
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
        $scope.title = $scope.chat.displayname + "'s Profile";
        $('#viewprofile-input-display').attr('disabled', 'disabled');
        $('#viewprofile-input-status').attr('disabled', 'disabled');
        $scope.edit = 'false';
    }
})

.factory('getProfileMember',function(){
	var result;
	function _all(){

	}
})

.controller('FreecallCtrl', function($scope, $stateParams) {
	
})

.controller('AccountCtrl', function($scope,$ionicModal,$timeout,CreateGroup) {
	$scope.settings = {
		logOut: true,
	};

	$scope.createType = function(type){
		CreateGroup.createType = type;
		location.href = '#/tab/account/create'
		console.log(CreateGroup.createType);
	}
    
    $ionicModal.fromTemplateUrl('templates/modal-theme.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.thememodal = modal
  })  

  $scope.openThemeModal = function() {
    $scope.thememodal.show()
  }

  $scope.closeThemeModal = function() {
    $scope.thememodal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.thememodal.remove();
  });


})

.controller('AccountCreate',function($scope,$rootScope,$state,$ionicHistory,CreateGroup,FileService) {
	console.log('AccountCreate',CreateGroup.createType);
	var myProfile = main.getDataManager().myProfile;
	$rootScope.members = CreateGroup.getSelectedMember();
	$scope.model = { groupname: "" };
	var roomId = "";
	$scope.submit = function(){
		createGroup();
	}
	function createGroup(){
		if(CreateGroup.createType=="PrivateGroup"){
			server.UserRequestCreateGroupChat($scope.model.groupname,CreateGroup.getSelectedIdWithMe(), function(err, res) {
				if (!err) {
					console.log(JSON.stringify(res));
					roomId = res.data._id;
					uploadImageGroup();
				}
				else {
					console.warn(err, res);
				}
			});
		}else{
			console.log("CreateGroup")
			server.requestCreateProjectBaseGroup($scope.model.groupname,CreateGroup.getSelectedMemberProjectBaseWithMe(), function(err, res) {
				if (!err) {
					console.log(JSON.stringify(res));
					roomId = res.data._id;
					uploadImageGroup();
				}
				else {
					console.warn(err, res);
				}
			});
		}
	}
	function uploadImageGroup(){
		if(FileService.getImages() != '') {
			$scope.$broadcast('uploadImg','uploadImg');
		}else{
			$state.go('tab.group');
		}
	}
	$scope.$on('fileUrl', function(event, args) {
        server.UpdatedGroupImage(roomId,args[0], function(err, res){
            if(!err){
                console.log(JSON.stringify(res));
                $state.go('tab.group');
            }else{
                console.warn(err, res);
            }
        });
    });

	$rootScope.$ionicGoBack = function() {
		if($state.current.name=='tab.account-create'){
			CreateGroup.clear();
		}
    	$ionicHistory.goBack(-1);
	};
})

.controller('AccountInvite',function($scope,$rootScope,CreateGroup) {
	$scope.createType = CreateGroup.createType;
	$scope.myProfile = main.getDataManager().myProfile;
	$scope.allmembers = CreateGroup.getAllMember();

	$scope.checked = function(id,selected){
		CreateGroup.setMemberSelected(id,selected);
	}

	$scope.$on('$ionicView.beforeLeave', function(){
		//console.log('Back to Previously');
		$rootScope.members = CreateGroup.getSelectedMember();
    });
})

.controller('CreateProjectBase',function($scope,$ionicModal,$rootScope,CreateGroup,ProjectBase, roomSelected) {
	if(CreateGroup.createType!='ProjectBase'){ return; }
		$scope.jobPosition=[];
		$scope.rolePosition = [
			{"role": MemberRole[MemberRole.member]},
			{"role": MemberRole[MemberRole.admin]}];
		for(x=0; x<main.getDataManager().companyInfo.jobPosition.length; x++){
			$scope.jobPosition.push({"job":main.getDataManager().companyInfo.jobPosition[x]});
		}
		$scope.targetId = "";
	
		$scope.savePosition = function(role,job){
			ProjectBase.setRolePosition($scope.targetId,role,job);
			if($rootScope.status=='edit'){
				var room = roomSelected.getRoom();
				var member = new function(){
			        this.id = $scope.targetId;
			        this.role = MemberRole[ ProjectBase.getRolePositionIndex($scope.targetId)[0] ];
			        this.jobPosition = job;
			    }
				server.editMemberInfoInProjectBase(room._id,RoomType[room.type],member, function(err, res) {
					if (!err) {
						console.log(JSON.stringify(res));
						$.each(room.members, function(index, result) {
		                    if(result._id == $scope.targetId){
		                        result.role = role;
		                        result.jobPosition = job;
		                    }
		                });
					}
					else {
						console.warn(err, res);
					}
				});
			}
			$scope.closeSelectRole();
		}
		
		$scope.openSelectRole = function(id){
			$scope.targetId = id;
			var index = ProjectBase.getRolePositionIndex(id);
			$scope.job = $scope.jobPosition[index[1]];
			$scope.role = $scope.rolePosition[index[0]];
			if($rootScope.status=='edit'){ $scope.isAdmin = isAdminInProjectBase(roomSelected.getRoom(),id); }
			$scope.modal.show();
		};
		$scope.closeSelectRole = function() {
		    $scope.modal.remove();
		    createModalSlectPosition();
		};
	
		createModalSlectPosition();
		function createModalSlectPosition(){
			$ionicModal.fromTemplateUrl('templates/modal-select-role-projectbase.html', {
			    scope: $scope,
			    animation: 'slide-in-up'
			}).then(function(modal) {
			    $scope.modal = modal;
			});
		};

}); // <-- LAST CONTROLLER

function isAdminInProjectBase(room,memberId){
    var admin = false;
    $.each(room.members, function(index, result) {
        if(result._id == memberId){
            if(result.role == MemberRole[MemberRole.admin]) { admin = true; }
        }
    });
    return admin;
}

function groupMembers(members, size, callback)
{
	var max = members.length;
	if( max > 5 )
		max = 5;
		
	if( size )
	    max = size;

    var counter = 0;
	var gmember = [];
	var getGroupMembers = function() {
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
		
		if(gmember.length === 0 && !dataManager.isOrgMemberReady) {
			waitForOrgMembers();
		}
		else {
			callback(gmember);
		}
	}
	var waitForOrgMembers = function() {
		setTimeout(function() {
			getGroupMembers();
		}, 500);
	}
	
	if(dataManager.isOrgMemberReady) {
		getGroupMembers();
	}
	else {
		waitForOrgMembers();
	}
}

function back()
{
	//$('#send_message').css({'display':'none'});
	//$('#chatroom_back').css({'display':'none'});
}


function testfunc()
{
	return 'tabs-item-hide';
}

function navHide()
{
	$('.tab-nav.tabs').css({'display':'none'});
	$('[name="tab-group"] .has-tabs').css({'bottom':'0px'})
}

function navShow()
{
	$('.tab-nav.tabs').css({'display':'flex'});
	$('[name="tab-group"] .has-tabs').css({'bottom':'44px'})
}

var initOrgModal = function ($scope, groupId, roomSelected, done) {
    var group = main.getDataManager().orgGroups[groupId];
    roomSelected.setRoom(group);
    $scope.chat = group;

    var members = group.members;
    $scope.members_length = members.length;
    groupMembers(members, null, function done(members) {
        $scope.members = members;
        $scope.$apply();
    });

    //<!-- Join chat room.
    $scope.toggle = function (chatId) {
        $scope.closeOrgModal();
        location.href = '#/tab/group/chat/' + chatId;
    };

    done();
}

var initPjbModal = function ($scope, groupId, roomSelected, done) {
    var group = main.getDataManager().projectBaseGroups[groupId];
    roomSelected.setRoom(group);
    $scope.chat = group;

    var members = group.members;
    $scope.members_length = members.length;
    groupMembers(members, null, function done(members) {
        $scope.members = members;
        $scope.$apply();
    });

    $scope.toggle = function (chatId) {
        $scope.closePjbModal();
        location.href = '#/tab/group/chat/' + chatId;
    };

    done();
}

var initPvgModal = function ($scope, groupId, roomSelected, done) {
    var group = main.getDataManager().privateGroups[groupId];
    roomSelected.setRoom(group);
    $scope.group = group;

    var members = group.members;
    $scope.members_length = members.length;
    groupMembers(members, null, function done(members) {
        $scope.members = members;
        $scope.$apply();
    });

    $scope.chat = function (chatId) {
        $scope.closePvgModal();
        location.href = '#/tab/group/chat/' + chatId;
    };

    done();
}

var initContactModal = function ($scope, contactId, roomSelected, done) {
	var contact = main.getDataManager().orgMembers[contactId];
	console.debug(contact);
    $scope.contact = contact;

    server.getPrivateChatRoomId(dataManager.myProfile._id, contactId, function result(err, res) {
        console.log(JSON.stringify(res));
        var room = JSON.parse(JSON.stringify(res.data));

        $scope.chat = function () {
            roomSelected.setRoom(room);
            location.href = '#/tab/group/chat/' + room._id;
        };
		
		$scope.openViewContactProfile = function(id) {
		    location.href = '#/tab/group/member/' + id;
		    //$state.go("tab.group-members", { chatId: id}, { inherit: false });
		}
		
		$scope.$apply();
    });
	
	done();
}

var initMyProfileModal = function($scope, done) {
	$scope.chat = main.getDataManager().myProfile;
	
	done();
}