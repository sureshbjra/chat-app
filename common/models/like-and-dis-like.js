
const app = require('../../server/server');

module.exports = function (Likeanddislike) {

    Likeanddislike.likeForBlog = (params, cb) => {
        const Blog = app.models.Blog;
        const Customer = app.models.Customer;
        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { blogId, customerId, isLike } = params;

            updateValue = async () => {
                let result = await Likeanddislike.find({ where: { and: [{ blogId, customerId }] } });
                if (result.length) {
                    await Likeanddislike.updateAll({ id: result[0].id }, { isLike, customerId, blogId, "category": "blog" });
                } else {
                    await Likeanddislike.create({ isLike, customerId, blogId, "category": "blog" });
                }
                isCallBack(true, "Success", {}, {});
            }

            if (blogId && customerId) {
                Customer.findOne({ where: { id: customerId } }, (cErr, cRes) => {
                    if (cErr) isCallBack(false, "Enter the vaild customer id", {}, cErr);
                    else if (cRes) {
                        Blog.findOne({ where: { id: blogId } }, (bErr, bRes) => {
                            if (bErr) isCallBack(false, "Enter the vaild blog id", {}, bErr);
                            else if (bRes) {
                                Likeanddislike.find({ where: { blogId, customerId } }, (fErr, fRes) => {
                                    if (fErr) isCallBack(false, "Please try again", {}, LErr);
                                    else {
                                        if (fRes && fRes.length) {
                                            if (fRes[0].isLike && isLike) {
                                                isCallBack(false, "Already like. Please try again", {}, {});
                                            } else if (fRes[0].isLike == false && isLike == false) {
                                                isCallBack(false, "Already dislike. Please try again", {}, {});
                                            } else updateValue();
                                        } else updateValue();
                                    }
                                })
                            } else isCallBack(false, "Enter the vaild blog id");
                        });
                    } else isCallBack(false, "Enter the vaild customer id");
                });
            } else {
                isCallBack(false, "BlogId and customerId  is required!");
            }
        } else isCallBack(false, "params is required!");
    }

    Likeanddislike.likeForForum = (params, cb) => {
        const Forum = app.models.Forum;
        const Customer = app.models.Customer;
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            
            let { forumId , customerId, isLike } = params;

            updateValue = async () => {
                let result = await Likeanddislike.find({ where: { and: [{ forumId, customerId }] } });
                if (result.length) {
                    await Likeanddislike.updateAll({ id: result[0].id }, { isLike, customerId, forumId, "category": "forum" });
                } else {
                    await Likeanddislike.create({ isLike, customerId, forumId, "category": "forum" });
                }
                isCallBack(true, "Success", {}, {});
            }

            if (forumId && customerId) {
                Customer.findOne({ where: { id: customerId } }, (cErr, cRes) => {
                    if (cErr) isCallBack(false, "Enter the vaild customer id", {}, cErr);
                    else if (cRes) {
                        Forum.findOne({ where: { id: forumId } }, (bErr, bRes) => {
                            if (bErr) isCallBack(false, "Enter the vaild forum id", {}, bErr);
                            else if (bRes) {
                                Likeanddislike.find({ where: { forumId , customerId } }, (fErr, fRes) => {
                                    if (fErr) isCallBack(false, "Please try again", {}, LErr);
                                    else {
                                        if (fRes && fRes.length) {
                                            if (fRes[0].isLike && isLike) {
                                                isCallBack(false, "Already like. Please try again", {}, {});
                                            } else if (fRes[0].isLike == false && isLike == false) {
                                                isCallBack(false, "Already dislike. Please try again", {}, {});
                                            } else updateValue();
                                        } else updateValue();
                                    }
                                })
                            } else isCallBack(false, "Enter the vaild forumId");
                        });
                    } else isCallBack(false, "Enter the vaild customer id");
                });
            } else {
                isCallBack(false, "forum and customerId  is required!");
            }
        } else isCallBack(false, "params is required!");
    }

    Likeanddislike.likeForTeenache = (params, cb) => {
        const Teenache = app.models.Teenache;
        const Customer = app.models.Customer;
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            
            let { teenacheId , customerId, isLike } = params;

            updateValue = async () => {
                let result = await Likeanddislike.find({ where: { and: [{ teenacheId, customerId }] } });
                if (result.length) {
                    await Likeanddislike.updateAll({ id: result[0].id }, { isLike, customerId, teenacheId, "category": "teenache" });
                } else {
                    await Likeanddislike.create({ isLike, customerId, teenacheId, "category": "teenache" });
                }
                isCallBack(true, "Success", {}, {});
            }

            if (teenacheId && customerId) {
                Customer.findOne({ where: { id: customerId } }, (cErr, cRes) => {
                    if (cErr) isCallBack(false, "Enter the vaild customer id", {}, cErr);
                    else if (cRes) {
                        Teenache.findOne({ where: { id: teenacheId } }, (bErr, bRes) => {
                            if (bErr) isCallBack(false, "Enter the vaild forum id", {}, bErr);
                            else if (bRes) {
                                Likeanddislike.find({ where: { teenacheId , customerId } }, (fErr, fRes) => {
                                    if (fErr) isCallBack(false, "Please try again", {}, LErr);
                                    else {
                                        if (fRes && fRes.length) {
                                            if (fRes[0].isLike && isLike) {
                                                isCallBack(false, "Already like. Please try again", {}, {});
                                            } else if (fRes[0].isLike == false && isLike == false) {
                                                isCallBack(false, "Already dislike. Please try again", {}, {});
                                            } else updateValue();
                                        } else updateValue();
                                    }
                                })
                            } else isCallBack(false, "Enter the vaild forumId");
                        });
                    } else isCallBack(false, "Enter the vaild customer id");
                });
            } else {
                isCallBack(false, "forum and customerId  is required!");
            }
        } else isCallBack(false, "params is required!");
    }

    Likeanddislike.teenacheLikeAndDisLikeCnt = (params, cb) => {
        let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
         if (params) { 
             let { teenacheId } = params;
             Likeanddislike.find({ where : { teenacheId , category : 'teenache' } }, (err, res)=>{
                 if(err) isCallBack();
                 else {
                     let likeCnt = (res.filter(m=>m.isLike)).length;
                     let disLikeCnt = (res.filter(m=>m.isDislike)).length;
                     isCallBack(true , "Success" , { likeCnt , disLikeCnt } , {});
                 }
             })
            } else isCallBack();
     }

    Likeanddislike.blogLikeAndDisLikeCnt = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) { 
            let { blogId } = params;
            Likeanddislike.find({ where : { blogId , category : 'blog' } }, (err, res)=>{
                if(err) isCallBack();
                else {
                    let likeCnt = (res.filter(m=>m.isLike)).length;
                    let disLikeCnt = (res.filter(m=>m.isDislike)).length;
                    isCallBack(true , "Success" , { likeCnt , disLikeCnt } , {});
                }
            })
        } else isCallBack();
    }

    Likeanddislike.forumLikeAndDisLikeCnt = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) { 
            let { forumId } = params;
            Likeanddislike.find({ where : { forumId , category : 'forum' } }, (err, res)=>{
                if(err) isCallBack();
                else {
                    let likeCnt = (res.filter(m=>m.isLike)).length;
                    let disLikeCnt = (res.filter(m=>m.isDislike)).length;
                    isCallBack(true , "Success" , { likeCnt , disLikeCnt } , {});
                }
            })
        } else isCallBack();
    }

    Likeanddislike.remoteMethod('forumLikeAndDisLikeCnt', {
        http: { path: '/forumLikeAndDisLikeCnt', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "forumLikeAndDisLikeCnt"
    });

    Likeanddislike.remoteMethod('teenacheLikeAndDisLikeCnt', {
        http: { path: '/teenacheLikeAndDisLikeCnt', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "teenacheLikeAndDisLikeCnt"
    });

    Likeanddislike.remoteMethod('blogLikeAndDisLikeCnt', {
        http: { path: '/blogLikeAndDisLikeCnt', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "blogLikeAndDisLikeCnt"
    });

    Likeanddislike.remoteMethod('likeForBlog', {
        http: { path: '/likeForBlog', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "likeForBlog"
    });

    Likeanddislike.remoteMethod('likeForTeenache', {
        http: { path: '/likeForTeenache', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "likeForTeenache"
    });

    Likeanddislike.remoteMethod('likeForForum', {
        http: { path: '/likeForForum', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "likeForForum"
    });
};
