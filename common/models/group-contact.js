
const app = require('../../server/server');


module.exports = function (Groupcontact) {

    Groupcontact.removeGroupUser = (params, cb) => {
        const ChatList = app.models.ChatList;
        let isCallBack = (isSuccess = false, message = "Please try again", result = [], error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            
            let { customers } = params;
            console.log(customers);
            if (customers && customers.length) {
                customers.forEach((v, i) => {
                    let { groupsId, customerId } = v;
                    if (groupsId && customerId) {
                        Groupcontact.findOne({ where: { customerId, groupsId } }, (dErr, dRes) => {
                            if (dErr && (i + 1) == customers.length) isCallBack(false, "Error", {}, dErr);
                            else {
                                Groupcontact.deleteById(dRes.id);
                                ChatList.findOne({ where : {  customerId , groupsId } }, (clErr , clRes)=>{
                                    console.log(clRes)
                                    if(clRes && clRes.id) ChatList.deleteById(clRes.id);
                                    if (dRes && (i + 1) == customers.length) {
                                        isCallBack(true, "Success", {}, {});
                                    }
                                })
                                
                            }
                        })
                    } else if ((i + 1) == customers.length) isCallBack(false, "customerId and groupsId is required", {}, {});
                })
            } else isCallBack(false, "customers is required", {}, {});
        } else isCallBack(false, "Params is required", {}, {});
    }

    Groupcontact.addNewCustomer = (params, cb) => {

        const Customer = app.models.Customer;
        const Groups = app.models.Groups;
        const CustomerChatList = app.models.CustomerChatList;
        const ChatList = app.models.ChatList;

        let isCallBack = (isSuccess = false, message = "Please try again", result = [], error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { customers } = params;

             console.log(customers);

            if (customers && customers.length) {
                customers.forEach((v, i) => {
                    let { customerId, groupsId } = v;
                    if (customerId && groupsId) {
                        Customer.find({ where: { id: customerId } }, (cErr, cRes) => {
                            if (cErr && (i + 1) == customers.length) {
                                isCallBack(false, "Error", {}, cErr);
                            } else {
                                if (cRes && cRes.length) {
                                    Groups.find({ where: { id: groupsId } }, (gcErr, gcRes) => {
                                        if (gcErr && (i + 1) == customers.length) {
                                            isCallBack(false, "Error", {}, gcErr);
                                        } else {
                                            if (gcRes && gcRes.length) {
                                                CustomerChatList.upsertWithWhere({ customerId }, { customerId  }, (crErr , crRes)=>{ 
                                                    if(crRes && crRes.id) ChatList.upsertWithWhere({ customerChatListId : crRes.id , customerId , groupsId } , { customerChatListId : crRes.id , customerId , groupsId , isGroup : true })
                                                });
                                                Groupcontact.upsertWithWhere({ customerId, groupsId } , { customerId, groupsId }, (err, res) => {
                                                    if (err && (i + 1) == customers.length) isCallBack(false, "Error", {}, err);
                                                    else if ((i + 1) == customers.length) isCallBack(true, "Success", {}, {});
                                                })
                                            } else if ((i + 1) == customers.length) isCallBack(false, "No groups", {}, {});
                                        }
                                    })

                                } else if ((i + 1) == customers.length) isCallBack(false, "No customer data", {}, {});
                            }
                        })

                    } else if ((i + 1) == customers.length) isCallBack(false, "customerId and groupsId is required", {}, {});
                })
            } else {
                isCallBack(false, "customers is required", {}, {});
            }



        } else isCallBack(false, "Params is required", {}, {});
    }

    Groupcontact.remoteMethod('removeGroupUser', {
        http: { path: '/removeGroupUser', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "remove group user"
    });

    Groupcontact.remoteMethod('addNewCustomer', {
        http: { path: '/addNewCustomer', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "Add new customer"
    });
};
