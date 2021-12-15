

const app = require('../../server/server');

module.exports = function (Groupchat) {

    Groupchat.getGroupMsg = (params, cb) => {

        const Groups = app.models.Groups;

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        try {
            if (params) {
                let { groupId } = params;
                if (groupId) {
                    Groupchat.find({ where: { groupsId: groupId }, include: [{ relation: "customer" }], order: "time_order desc" }, (err, res) => {
                        if (err) isCallBack(false, "Error", {}, err);
                        else {
                            res = JSON.parse(JSON.stringify(res));
                            Groups.findOne({ where: { id: groupId }, include: [{ relation: "groupContacts", 
                            scope: { include: [{ relation: "customer" }] } }] }, (cErr, cRes)=>{
                                if (res) {
                                    let data = { groupchat : res , groups : cRes };
                                    isCallBack(true, "Success", data, {});
                                }
                                else isCallBack(true, "Success", {}, {});
                            })
                           
                        }
                    })
                } else isCallBack(false, "GroupId is required!", {}, {});
            } else isCallBack(false, "Params is required!", {}, {});
        } catch (e) {
            isCallBack(false, "Error", {}, e);
        }
    }

    Groupchat.remoteMethod('getGroupMsg', {
        http: { path: '/getGroupMsg', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "Get group message"
    });
};
