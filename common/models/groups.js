const app = require('../../server/server');

module.exports = function (Groups) {

    Groups.getGroups = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { groupId } = params;
            if (groupId) {
                Groups.findOne({ where: { id: groupId }, include: [{ relation: "groupContacts" , scope : { include : [{ relation : "customer" }] } }] }, (err, res) => {
                    if (err) isCallBack(false, "Error", {}, err);
                    else {
                        res = JSON.parse(JSON.stringify(res));
                        isCallBack(true, "Success", res, {});
                    }
                })
            } else isCallBack(false, "GroupId is required", {}, {})
        } else isCallBack(false, "Params is required", {}, {})
    }

    Groups.createAndUpdate = (params, cb) => {


        console.log(JSON.stringify(params))

        const GroupContact = app.models.GroupContact;
        const CustomerChatList = app.models.CustomerChatList;
        const ChatList = app.models.ChatList;

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        try {
            if (params) {
                let { groupName, users } = params;
                
                if (users) {
                    Groups.create({ name: groupName }, (gErr, gRes) => {
                        if (gErr) isCallBack(false, "Error", {}, gErr);
                        else {
                            users.forEach(async (val, i) => {
                                await GroupContact.create({ customerId: val.customerId, groupsId: gRes.id, isAdmin: val.isAdmin });
                                await CustomerChatList.upsertWithWhere({ customerId: val.customerId }, { customerId: val.customerId }, (cErr, cRes) => {
                                    if (cErr && users.length == (i + 1)) isCallBack();
                                    else {
                                        if (cRes && cRes.id) {
                                            ChatList.create({
                                                isGroup: true, name: groupName, customerChatListId: cRes.id,
                                                customerId: val.customerId, groupsId: gRes.id
                                            }, (clErr, clRes) => {
                                                if (clErr) isCallBack();
                                                else if (users.length == (i + 1)) {
                                                    isCallBack(true, "Success", {}, {});
                                                }
                                            });
                                        } else if (users.length == (i + 1)) {
                                            isCallBack();
                                        }
                                    }
                                });
                            })
                        }
                    })
                } else isCallBack(false, "Users array is empty", {}, {})
            } else isCallBack(false, "Params is required", {}, {})
        } catch (e) {
            isCallBack(false, "Error", {}, e)
        }


    }

    Groups.remoteMethod('getGroups', {
        http: { path: '/getGroups', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "get groups Api"
    });

    Groups.remoteMethod('createAndUpdate', {
        http: { path: '/createAndUpdate', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "create And Update the api"
    });

};
