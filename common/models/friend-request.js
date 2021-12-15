
const app = require('../../server/server');
var moment = require('moment-timezone');

module.exports = function (Friendrequest) {

    Friendrequest.getRequestData = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { requestId, senderId } = params;
            if (requestId) {
                Friendrequest.find({ where: { requestId , isAccepted : false }, include: [{ relation: "request" }, { relation: "accept" }] }, (err, res) => {
                    if (err) isCallBack(false, "Error", {}, err);
                    else isCallBack(true, "Success", res, {});
                })
            } else if (senderId) {
                Friendrequest.find({ where: { acceptId: senderId , isAccepted : false } , include: [{ relation: "request" }, { relation: "accept" }] }, (err, res) => {
                    if (err) isCallBack(false, "Error", {}, err);
                    else isCallBack(true, "Success", res, {});
                })
            } else isCallBack(false, "customerId is required", {}, {});

        } else isCallBack(false, "params is required", {}, {});

    }

    Friendrequest.remoteMethod('getRequestData', {
        http: { path: '/getRequestData', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "get request data"
    });
};
