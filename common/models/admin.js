

let app = require('../../server/server');
module.exports = function (Admin) {

    Admin.validatesUniquenessOf('email');

    Admin.customLogin = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { email, password, mobileNo } = params;
            Admin.login({ email, password }, 'user', (err, res) => {
                if (err) isCallBack(false, 'please try again', {}, err);
                else if (res) isCallBack(true, 'Success', res, {});
                else isCallBack(false, 'please try again', {}, err);
            })
        } else isCallBack(false, "params is required", {});
    }


    Admin.remoteMethod('customLogin', {
        http: { path: '/customLogin', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "Custom login"
    });
};
