const app = require('../../server/server');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, //true --> will use ssl
    auth: {
      "user": "Yourz.truly516@gmail.com",
      "pass": "Qwerty!123"
    }
  });

module.exports = function (Customer) {

    Customer.validatesUniquenessOf('email');

    Customer.loginFromGoogle = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if(params) {
            let { email , id , name , serverAuthCode , imageUrl } = params;
            if(email){
                Customer.find({ where : { email } }, (err, res)=>{
                    if(err) isCallBack(false , "Error", {} , err);
                    else if(res && res.length){
                        Customer.findOne({ where : { email } }, (cErr, cRes)=>{
                            if(err) isCallBack(false , "Error", {} , err);
                            else {
                                isCallBack(true , "Success" , cRes , {});
                            } 
                        })
                    } else {
                       try {
                        Customer.create({ email , password : email || 'User@123', imageUrl , googleId : id  , name , username : email } , (crErr , crRes)=>{
                            if(crErr) isCallBack(false , "Error", {} , crErr);
                            else {
                                isCallBack(true , "Success" , crRes , {});
                            }
                        })
                       } catch(error) {
                        isCallBack(false, 'please try again', {}, error);
                       }
                    }
                })
            } else isCallBack(false , "Email is required", {} , {});
        } else isCallBack();
    }

    Customer.vaildOtp = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { email, otp } = params;
            if (email && otp) {
                let { email, otp } = params;
                Customer.findOne({ where: { email } }, (err, res) => {
                    if (err) isCallBack(false, "Error", {}, err);
                    else if (res && res.email) {
                        if (res.otp == otp) {
                            isCallBack(true, "otp is vaild", {}, {});
                        } else isCallBack(false, "Invaild otp", {}, {});
                    } else isCallBack(false, "Invaild email", {}, {});
                })
            } else isCallBack(false, "Email, password or otp is required", {}, {});
        } else isCallBack(false, "Params is required", {}, {});

    }

    Customer.resetPwd = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { email, password, otp } = params;
            if (email && password && otp) {
                Customer.findOne({ where: { email, otp } }, (err, res) => {
                    if (err) isCallBack(false, "Error", {}, err);
                    else if (res && res.email) {
                        Customer.upsertWithWhere({ email },
                            { password: Customer.hashPassword(password) }, (cerr, cRes) => {
                                if (cerr) isCallBack(false, "Not updated. Please try again!", {}, {});
                                else {
                                    Customer.upsertWithWhere({ email }, { otp: '' })
                                    isCallBack(true, "Successfully updated", cRes, {});
                                }
                            })

                    } else isCallBack(false, "Invaild email or otp", {}, {});
                })
            } else isCallBack(false, "Email, password or otp is required", {}, {});
        } else isCallBack(false, "Params is required", {}, {});

    }

    Customer.forgotPwdAndVaild = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { email } = params;
            if (email) {
                Customer.findOne({ where: { email } }, (err, res) => {
                    if (err) isCallBack(false, "Error", {}, err);
                    else if(res && res.email){

                        function generateOTP() {

                            let otp = '';

                            for (let i = 1; i <= 4; i++) {
                                var index = Math.floor(Math.random() * ('0123456789'.length));
                                otp = otp + '0123456789'[index];
                            }

                            return otp;

                        }

                        let otp = generateOTP();

                        transporter.sendMail({
                            from: 'Yourz.truly516@gmail.com',
                            to: `${email}`,
                            bcc: 'sureshmcangl@gmail.com',
                            subject: 'Forgot password',
                            text: ` Your OTP : ${otp}`,
                        }, (error, info) => {
                            if (error) {
                                isCallBack(false, "Email is required", {}, error);
                            } else {
                                Customer.upsertWithWhere({ email }, { otp })
                                isCallBack(true, "OTP is sent your email.", info, {});
                                transporter.close();
                            }
                        });
                    } else isCallBack(false, "Email is not valid", {}, {});
                })
            } else isCallBack(false, "Email is required", {}, {});
        } else isCallBack(false, "Params is required", {}, {});
    }

    Customer.customCreate = (params, cb) => {

       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { email, password, isOlder = false, male = false, female = false , username } = params;
            if (email && password) {
                try{
                    if(!password) password= 'User@123';
                    if(female && isOlder) {

                        Customer.create({ email, password , isOlder, male, female , username }, (err, res) => {
                            if (err) isCallBack(false, 'please try again', {}, err);
                            else if (res) {
                                transporter.sendMail({
                                    from: 'Yourz.truly516@gmail.com',
                                    to: `${email}`,
                                    bcc: 'sureshmcangl@gmail.com',
                                    subject: 'Your account is created',
                                    text: `Your account is created.`,
                                }, (error, info) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        transporter.close();
                                    }
                                });
                                function generateOTP() {
                                    let otp = '';
                                    for (let i = 1; i <= 4; i++) {
                                        var index = Math.floor(Math.random() * ('0123456789'.length));
                                        otp = otp + '0123456789'[index];
                                    }
                                    return otp;
                                }
        
                                let otp = generateOTP();

                                transporter.sendMail({
                                    from: 'Yourz.truly516@gmail.com',
                                    to: `${email}`,
                                    bcc: 'sureshmcangl@gmail.com',
                                    subject: 'OTP',
                                    text: `Your OTP is ${otp}`,
                                }, (error, info) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        transporter.close();
                                    }
                                });
                                isCallBack(true, 'Success', res, {});
                            }
                            else isCallBack(false, 'please try again', {}, err);
                        })

                    } else isCallBack(false, 'Only allow for female and above 18+. please try again', {}, err);
                   
                }catch(error){
                    isCallBack(false, 'please try again', {}, error);
                }
                
            } else {
                if (!email) isCallBack(false, "Email is required", {});
                else if (!password) isCallBack(false, "Password is required", {});
                else isCallBack(false, "Email or password is required", {}, {});
            }
        } else isCallBack();
    }

    Customer.customLogin = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { email, password } = params;
            if (email && password) {
                Customer.find({ where: { email } }, (cErr, cRes) => {
                    if (cErr) isCallBack(false, 'please try again', {}, cErr);
                    else if (cRes) {
                        if (cRes && cRes.length && !cRes[0].isBlock && cRes[0].isActive) {
                            Customer.login({ email, password }, 'user', (err, res) => {
                                if (err) isCallBack(false, 'please try again', {}, err);
                                else if (res) {
                                    if (res.user && res.user.isBlock) isCallBack(false, 'Success', {}, {
                                        "message": `${email} this customer is blocked.`, isBlock: true
                                    });
                                    else if (res.user && res.user.isActive == false) isCallBack(false, 'Success', {}, {
                                        "message": `${email} this customer is inActive.`, isActive : false
                                    });
                                    else isCallBack(true, 'Success', res, {});
                                }
                                else isCallBack(false, 'please try again', {}, err);
                            })
                        } else {
                            if (cRes.length == 0) {
                                isCallBack(false, 'Success', {}, {
                                    "message": `This ${email} customer is not in database. Create a new account please.`
                                });
                            }
                            else if (cRes && cRes[0].isBlock) {
                                isCallBack(false, 'Success', {}, {
                                    "message": `This ${email} customer is blocked.`, isBlock: true
                                });
                            } else if (cRes && cRes[0].isActive == false) {

                                function generateOTP() {
                                    let otp = '';
                                    for (let i = 1; i <= 4; i++) {
                                        var index = Math.floor(Math.random() * ('0123456789'.length));
                                        otp = otp + '0123456789'[index];
                                    }
                                    return otp;
                                }
        
                                let otp = generateOTP();

                                transporter.sendMail({
                                    from: 'Yourz.truly516@gmail.com',
                                    to: `${email}`,
                                    bcc: 'sureshmcangl@gmail.com',
                                    subject: 'OTP',
                                    text: ` Your OTP : ${otp}`,
                                }, (error, info) => {
                                    if (error) {
                                        isCallBack(false, "Email is required", {}, error);
                                    } else {
                                        Customer.upsertWithWhere({ email }, { otp })
                                        isCallBack(false, "User is inactive", {}, {
                                            "message": `This ${email} customer is inactive  and OTP is sent your email.`, isActive: false , isInActive : true
                                        });
                                        transporter.close();
                                    }
                                });
                            } else {
                                isCallBack(false, "User is inactive", {}, { isInActive : true });
                            }
                        }
                    } else isCallBack(false, 'please try again', {}, {});
                })
            } else {
                if (!email) isCallBack(false, "Email is required", {});
                else if (!password) isCallBack(false, "Password is required", {});
                else isCallBack(false, "Email or password is required", {}, {});
            }

        } else isCallBack(false, "params is required", {}, {});
    }

    Customer.offline = (cb) => {
        Customer.find((error, result)=>{
            result.forEach(val=>{
                Customer.upsertWithWhere({ id : val.id } , { isOffline : true , isOnline : false })
            })
            cb(null, { isSuccess : true, message : "success" });
        })
    }

    Customer.getOnLineUser = (cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        Customer.find({ where: { isOnline: true }, include: [{ relation: "customerChatLists" }] }, (error , result) => {
            result = JSON.parse(JSON.stringify(result));
            if (error) isCallBack(false, "Error", {}, error);
            else  isCallBack(true, "Success", result, {});
        })
    }

    Customer.getOffLineUser =  (cb) => {
        Customer.find({ where: { isOffline : false  } } , (error, result)=>{
            if(error)  cb(null, { isSuccess : false, message : "Error",  error });
            else cb(null, { isSuccess : true, message : "success",  result });
        })
    }

    Customer.setOnline = (params, cb) => {

       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { isOnline , customerId } = params;
            if (customerId) {
                Customer.upsertWithWhere({ id: customerId }, { isOnline, isOffline: false }, (err, res) => {
                    if (res) isCallBack(true, "Success", res, {});
                    else isCallBack(false, "Error", {}, err);
                });
            } else isCallBack(false, "customerId is required", {}, {});
        } else isCallBack(false, "params is required", {} , {});
    }


    Customer.setOffline = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error }); 

        if (params) {
            let { isOffline, customerId } = params;
            if(customerId) {
                Customer.upsertWithWhere({ id: customerId }, { isOffline , isOnline : false }, (err, res) => {
                    if (res) isCallBack(true, "Success", res, {});
                    else isCallBack(false, "Error", {}, err);
                });
            } else isCallBack(false, "customerId is required", {} , {});
           
        } else isCallBack(false, "params is required", {} , {});
    }

    Customer.vaildOtpAndActiveUser = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error }); 

        if (params) {
            let { email, otp } = params;
            if (email && otp) {
                let { email, otp } = params;
                Customer.findOne({ where: { email } }, (err, res) => {
                    if (err) isCallBack(false, "Error", {}, err);
                    else if (res && res.email) {
                        if (res.otp == otp) {
                            Customer.upsertWithWhere({ email }, { isActive : true })
                            isCallBack(true, "otp is vaild", {}, {});
                        } else isCallBack(false, "Invaild otp", {}, {});
                    } else isCallBack(false, "Invaild email", {}, {});
                })
            } else isCallBack(false, "Email, password or otp is required", {}, {});
        } else isCallBack(false, "Params is required", {}, {});
    }

    Customer.remoteMethod('vaildOtpAndActiveUser', {
        http: { path: '/vaildOtpAndActiveUser', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "vaildOtp"
    });

    Customer.remoteMethod('vaildOtp', {
        http: { path: '/vaildOtp', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "vaildOtp"
    });

    Customer.remoteMethod('resetPwd', {
        http: { path: '/resetPwd', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "reset password"
    });

    Customer.remoteMethod('forgotPwdAndVaild', {
        http: { path: '/forgotPwdAndVaild', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "Forgot Password And Vaild"
    });

    Customer.remoteMethod('setOffline', {
        http: { path: '/setOffline', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "get customer update offline"
    });

    Customer.remoteMethod('setOnline', {
        http: { path: '/setOnline', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "get customer update online"
    });

    Customer.remoteMethod('offline', {
        http: { path: '/offline', verb: 'get' },
        returns: { arg: 'data', type: 'object' },
        description: "get customer offline"
    });

    Customer.remoteMethod('getOffLineUser', {
        http: { path: '/getOffLineUser', verb: 'get' },
        returns: { arg: 'data', type: 'object' },
        description: "get customer offline"
    });

    Customer.remoteMethod('getOnLineUser', {
        http: { path: '/getOnLineUser', verb: 'get' },
        returns: { arg: 'data', type: 'object' },
        description: "get customer online"
    });

    Customer.remoteMethod('loginFromGoogle', {
        http: { path: '/loginFromGoogle', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "loginFromGoogle"
    });

    Customer.remoteMethod('customCreate', {
        http: { path: '/customCreate', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "Create customer"
    });

    Customer.remoteMethod('customLogin', {
        http: { path: '/customLogin', verb: 'post' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "Custom login"
    });
};
