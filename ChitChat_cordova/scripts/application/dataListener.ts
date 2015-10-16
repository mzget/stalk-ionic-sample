﻿class DataListener implements Services.IServerListener, Services.IChatServerListener {
    private dataManager: DataManager;
    private listenerImp;

    constructor(dataManager: DataManager) {
        this.dataManager = dataManager;
    }

    public addListenerImp(listener) {
        this.listenerImp = listener;
    }
    public removeListener(listener) {
        this.listenerImp = null;
    }

    onAccessRoom(dataEvent) {
        this.dataManager.setRoomAccessForUser(dataEvent);
    }
    onUpdatedLastAccessTime(dataEvent) {
        this.dataManager.updateRoomAccessForUser(dataEvent);
    }
    onAddRoomAccess(dataEvent) {

    }

    onCreateGroupSuccess(dataEvent) {

    }
    onEditedGroupMember(dataEvent) {

    }
    onEditedGroupName(dataEvent) {

    }
    onEditedGroupImage(dataEvent) {

    }
    onNewGroupCreated(dataEvent) {

    }

    onUpdateMemberInfoInProjectBase(dataEvent) {

    }

    onUserUpdateImageProfile(dataEvent) {

    }
    onUserUpdateProfile(dataEvent) {

    }

    /*******************************************************************************/
    //<!-- chat room data listener.

    onChatData(data) {
        var chatMessageImp: Message = JSON.parse(JSON.stringify(data));

        if (!!this.listenerImp)
            this.listenerImp.onChat(chatMessageImp);
    };
    onLeaveRoom(data) {
        if (!!this.listenerImp)
            this.listenerImp.onLeaveRoom(data);
    };
    onRoomJoin(data) {

    };

    onMessageRead(dataEvent) {
        if (!!this.listenerImp)
            this.listenerImp.onMessageRead(dataEvent);
    };

    onGetMessagesReaders(dataEvent) {
        if (!!this.listenerImp)
            this.listenerImp.onGetMessagesReaders(dataEvent);
    };
}