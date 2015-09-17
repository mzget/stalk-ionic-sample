﻿interface IRoomMap {
    [key: string]: Room;
}

class DataManager implements Services.IFrontendServerListener {
    public myProfile: User;
    public orgGroups: IRoomMap = {};
    public projectBaseGroups: IRoomMap = {};
    public privateGroups: IRoomMap = {};


    public setMyProfile(data: any) {
        this.myProfile = JSON.parse(JSON.stringify(data));
    }

    public setMembers(data: any) {

    }

    public setCompanyInfo(data: any) {

    }

    public setOrganizeGroups(data: any) {
        this.orgGroups = JSON.parse(JSON.stringify(data));
    }

    public setProjectBaseGroups(data: any) {
        this.projectBaseGroups = JSON.parse(JSON.stringify(data));
    }

    public setPrivateGroups(data: any) {
        this.privateGroups = JSON.parse(JSON.stringify(data));
    }


    public onGetCompanyMemberComplete(dataEvent) {

    };
    public onGetPrivateGroupsComplete(dataEvent) { };
    public onGetOrganizeGroupsComplete(dataEvent) {
        var rooms: Array<Room> = JSON.parse(JSON.stringify(dataEvent));

        rooms.forEach(value => {
            if (!this.orgGroups[value._id]) {
                this.orgGroups[value._id] = value;
            }

            console.log("org_group: ", value);
        });
    };
    public onGetProjectBaseGroupsComplete(dataEvent) { };
}