
const express = require('express');
var moment = require('moment-timezone');
const app = require('../../server/server');

module.exports = function (Forumcommand) {


    Forumcommand.createCommand = (params, cb) => {
        const Customer = app.models.Customer;
        const Forum = app.models.Forum;
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { customerId, forumId, command } = params;
            if (customerId && forumId && command) {
                Customer.findOne({ where: { id: customerId } }, (err, res) => {
                    if (err) isCallBack(false, 'Please give the vaild customerId', {}, err);
                    else if (res) {
                        Forum.findOne({ where: { id: forumId } }, (fErr, fRes) => {
                            if (fErr) isCallBack(false, 'Please give the vaild forumId', {}, fErr);
                            else if (fRes) {
                                let timeZone = 'Asia/Kolkata';
                                let dateTxt = moment.tz(new Date(), timeZone).format('DD-MM-YYYY'),
                                    time = moment.tz(new Date(), timeZone).format('hh:mm a'),
                                    date = moment.tz(new Date(), timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS') + "Z",
                                    dateNo = moment.tz(new Date(), timeZone).format('DD'),
                                    month = moment.tz(new Date(), timeZone).format('MM'),
                                    year = moment.tz(new Date(), timeZone).format('YYYY');
                                Forumcommand.create({ forumId, customerId, command, date, time, dateTxt, dateNo, month, year }, (fcErr, fcRes) => {
                                    if (fcErr) isCallBack(false, 'Command not created. Please try again.', {}, fcRes);
                                    else {
                                        isCallBack(true, 'Success', fcRes, {});
                                    }
                                });
                            } else isCallBack(false, 'please try again', {}, {});
                        })
                    } else isCallBack(false, 'please try again', {}, {});
                })
            } else {
                if (!customerId) isCallBack(false, "CustomerId is required", {}, {});
                else if (!forumId) isCallBack(false, "ForumId is required", {}, {});
                else if (!command) isCallBack(false, "command is required", {}, {});
                else isCallBack();
            }
        } else isCallBack();
    }

    Forumcommand.findCommands = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { forumId } = params;
            if (forumId) {
                Forumcommand.find({ where: { forumId } , include : [{ relation : "customer" }] }, (err, res) => {
                    if (err) isCallBack(false, 'please try again', {}, err);
                    else if (res) isCallBack(true, 'Success', res, {});
                    else isCallBack(false, 'please try again', {}, {});
                });
            } else isCallBack(false, "forumId is required!");
        } else isCallBack(false, "Params is required!");
    }

    Forumcommand.remoteMethod('findCommands', {
        http: { path: '/findCommands', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "findCommands"
    });

    Forumcommand.remoteMethod('createCommand', {
        http: { path: '/createCommand', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "createCommand"
    });
};
