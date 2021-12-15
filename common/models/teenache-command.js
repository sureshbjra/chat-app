const express = require('express');
var moment = require('moment-timezone');
const app = require('../../server/server');

module.exports = function(Teenachecommand) {


    Teenachecommand.createCommand = (params, cb) => {
        const Customer = app.models.Customer;
        const Teenache = app.models.Teenache;
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { customerId, teenacheId, command } = params;
            if (customerId && teenacheId && command) {
                Customer.findOne({ where: { id: customerId } }, (err, res) => {
                    if (err) isCallBack(false, 'Please give the vaild customerId', {}, err);
                    else if (res) {
                        Teenache.findOne({ where: { id: teenacheId } }, (fErr, fRes) => {
                            if (fErr) isCallBack(false, 'Please give the vaild teenacheId', {}, fErr);
                            else if (fRes) {
                                let timeZone = 'Asia/Kolkata';
                                let dateTxt = moment.tz(new Date(), timeZone).format('DD-MM-YYYY'),
                                    time = moment.tz(new Date(), timeZone).format('hh:mm a'),
                                    date = moment.tz(new Date(), timeZone).format('YYYY-MM-DDTHH:mm:ss.SSS') + "Z",
                                    dateNo = moment.tz(new Date(), timeZone).format('DD'),
                                    month = moment.tz(new Date(), timeZone).format('MM'),
                                    year = moment.tz(new Date(), timeZone).format('YYYY');
                                    Teenachecommand.create({ teenacheId, customerId, command, date, time, dateTxt, dateNo, month, year }, (fcErr, fcRes) => {
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
                else if (!teenacheId) isCallBack(false, "teenacheId is required", {}, {});
                else if (!command) isCallBack(false, "command is required", {}, {});
                else isCallBack();
            }
        } else isCallBack();
    }

    Teenachecommand.findCommands = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { teenacheId } = params;
            if (teenacheId) {
                Teenachecommand.find({ where: { teenacheId } , include : [{ relation : "customer" }] }, (err, res) => {
                    if (err) isCallBack(false, 'please try again', {}, err);
                    else if (res) isCallBack(true, 'Success', res, {});
                    else isCallBack(false, 'please try again', {}, {});
                });
            } else isCallBack(false, "teenacheId is required!");
        } else isCallBack(false, "Params is required!");
    }

    Teenachecommand.remoteMethod('findCommands', {
        http: { path: '/findCommands', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "findCommands"
    });

    Teenachecommand.remoteMethod('createCommand', {
        http: { path: '/createCommand', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "createCommand"
    });

};
