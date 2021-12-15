

module.exports = function(Friendlist) {


    Friendlist.getFriendList = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = [], error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) { 
            let { customerChatListId } = params;
            Friendlist.find({ where : { customerChatListId } , include : [{ relation : "customer" }, { relation : "friendRequest" }] }, (err , res)=>{
                if(err) isCallBack(false , "Error" , {} , err);
                else {
                    isCallBack(true , "Success" , res , {});
                }
            })
        } else isCallBack();
    }

    Friendlist.remoteMethod('getFriendList', {
        http: { path: '/getFriendList', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "get Friend List"
    });
};
