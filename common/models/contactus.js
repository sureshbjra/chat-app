

module.exports = function(Contactus) {

    Contactus.createFeedBack = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if(params) {
            let { attachment , commants , feedBackCategoryId , customerId } = params;
            if(customerId) {
                Contactus.create({ attachment , commants , feedBackCategoryId , customerId },(err, res) => {
                    console.log(err , res);
                    if (err) isCallBack(false, 'please try again', {}, err);
                    else if (res) isCallBack(true, 'Success', res, {});
                    else isCallBack(false, 'please try again', {}, err);
                })
            } else isCallBack(false , "customerId is required. Please try again" , {} , {});
        } else isCallBack(false , "Params is required. Please try again" , {} , {});
    }


    Contactus.remoteMethod('createFeedBack', {
        http: { path: '/createFeedBack', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "createFeedBack"
    });
};
