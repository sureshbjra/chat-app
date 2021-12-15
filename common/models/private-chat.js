
const app = require('../../server/server');

module.exports = function(Privatechat) {

    Privatechat.getMsgForCustomer = (params, cb) => {

        const ChatList = app.models.ChatList;

        let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if(params) {    

            let { customerId , customerChatListId } = params;
            if(customerId && customerChatListId) {
                ChatList.find({ where : { customerChatListId , customerId } , include : [{ relation : "privateChats" }] }, (err , res)=>{
                    if(err) isCallBack(false , "Error", err , {});
                    else isCallBack(true , "Success", res , {});
                })
            } else isCallBack(false , "customerId is required", {} , {});

        } else isCallBack(false , "Params is required" , {} , {});

    }

    Privatechat.getCustomer = (params, cb) => { 

        const Customer = app.models.Customer;

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error }); 

        Customer.find((err, res) => { 
            if(err) isCallBack(false , "Error" , {} , err);
            else isCallBack(true , "Success" , res , {});
        });
    };


    Privatechat.remoteMethod('getCustomer', {
        http: { path: '/getCustomer', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "get customer"
    });


    Privatechat.remoteMethod('getMsgForCustomer', {
        http: { path: '/getMsgForCustomer', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getMsgForCustomer"
    });
};
