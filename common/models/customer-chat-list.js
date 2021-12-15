

const app = require('../../server/server');

module.exports = function (Customerchatlist) {

    Customerchatlist.getCustomerChatList = (params, cb) => {

        const Customer = app.models.Customer;

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {

            let { customerId } = params;

            if (customerId) {
                Customerchatlist.findOne({
                    where: { customerId },
                    include: [{
                        relation: "chatLists",
                        scope: { include: [{ relation: "customer" }, { relation: "privateChats", scope: { order: "time_order desc" } }, { relation: "groups", scope: { include: [{ relation: "groupChats", scope: { include: [{ relation: "readedOfMsgs" }], order: "time_order desc" } }] }, order: "time_order desc" }] }, order: "time_order desc"
                    }, { relation: "customer" }]
                }, (err, res) => {
                    res = JSON.parse(JSON.stringify(res));
                    if (err) isCallBack(false, "Error!", {}, err);
                    else if (res && res.chatLists && res.chatLists.length) {

                        let { isCreate, id, customerId, customer, chatLists } = res;

                        let data = { isCreate, id, customerId, customer, chatLists: [] };

                        data.chatLists = [];

                        chatLists.forEach(m => {
                            m.last_msg = {}; m.unread_msg = false; m.unread_msg_cnt = 0;
                            if (m.privateChats && m.privateChats.length) {
                                m.last_msg = m.privateChats[0];
                                m.isGroup = false;
                                m.time_order = m.privateChats[0].time_order;
                                m.unread_msg = m.privateChats.some(m => m.msg_readed == false);
                                m.unread_msg_cnt = (m.privateChats.filter(m => m.msg_readed == false)).length;
                            }
                            if (m.groups && m.groups.groupChats && m.groups.groupChats.length) {
                                m.isGroup = true;
                                m.unread_msg = true;
                                m.last_msg = m.groups.groupChats[0];
                                m.groups.groupChats.forEach(s => {
                                    if (s.readedOfMsgs && s.readedOfMsgs.length) {
                                        let isRe = s.readedOfMsgs.find(k => k.customerId == customerId);
                                        if (isRe && isRe.isReaded) m.unread_msg = false;
                                        else m.unread_msg = true;
                                    }
                                });
                                m.time_order = m.groups.groupChats[0].time_order;
                                m.unread_msg_cnt = 0;
                            }
                            data.chatLists.push(m);
                        })

                        isCallBack(true, "Success", data, {});
                    } else isCallBack(true, "Success", res, {});
                })
            } else isCallBack(false, "CustomerId is required!", {}, {});
        } else isCallBack(false, "params is required!", {}, {});
    }


    Customerchatlist.remoteMethod('getCustomerChatList', {
        http: { path: '/getCustomerChatList', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getCustomerChatList"
    });
};
