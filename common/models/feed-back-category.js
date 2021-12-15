

module.exports = function(Feedbackcategory) {

    Feedbackcategory.getFeedBackCategory = (params, cb) => {
       let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        Feedbackcategory.find((err, res) => {
            if (err) isCallBack(false, 'please try again', {}, err);
            else if (res) isCallBack(true, 'Success', res, {});
            else isCallBack(false, 'please try again', {}, err);
        })
    }

    Feedbackcategory.remoteMethod('getFeedBackCategory', {
        http: { path: '/getFeedBackCategory', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getFeedBackCategory"
    });
};
