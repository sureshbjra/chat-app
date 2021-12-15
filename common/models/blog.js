

module.exports = function (Blog) {

    Blog.getAllBlog = (params, cb) => {
        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if(params) {
            let { isPrivate } = params;
            Blog.find({ where : { isPrivate } , include : [{ relation : "likeAndDisLikes" }] },(err, res) => {
                if (err) isCallBack(false, 'please try again', {}, err);
                else if (res) {
                    res = JSON.parse(JSON.stringify(res));
                    let blogList = [];
                    res.forEach(val=>{
                        val.likeCnt = (val.likeAndDisLikes.filter(m => m.isLike)).length;
                        val.disLikeCnt = (val.likeAndDisLikes.filter(m => m.isDislike)).length;
                        delete val.likeAndDisLikes;
                        blogList.push(val);
                    })
                    isCallBack(true, 'Success', blogList, {});
                }
                else isCallBack(false, 'please try again', {}, err);
            })
        } else isCallBack(false , "Params is required. Please try again" , {} , {});
    }


    Blog.getFindOne = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { blogId, customerId } = params;
            if (blogId && customerId) {
                Blog.find({ where: { id: blogId }, include: [{ relation: "likeAndDisLikes", scope: { include: [{ relation: "customer" }] } }] }, (err, res) => {
                    if (err) isCallBack(false, 'please try again', {}, err);
                    else if (res && res.length) {
                        res = JSON.parse(JSON.stringify(res));
                        if (res && res.length && res[0].likeAndDisLikes && res[0].likeAndDisLikes.length) {
                            let likes = res[0].likeAndDisLikes.filter(m => m.isLike == true), likeCnt = 0;
                            if (likes && likes.length) likeCnt = likes.length;
                            let dislikes = res[0].likeAndDisLikes.filter(m => m.isLike == false), disLikeCnt = 0;
                            if (dislikes && dislikes.length) disLikeCnt = dislikes.length;
                            let likeAndDisLikes = [];
                            likeAndDisLikes.push(res[0].likeAndDisLikes.find(m => m.customerId == customerId));
                            delete res.likeAndDisLikes;
                            let { title, contact, fullDesc, img, isCreate, id } = res[0];
                            isCallBack(true, 'Success', { title, contact, fullDesc, img, isCreate, id, likeCnt , disLikeCnt, likeAndDisLikes }, {});
                        } else {
                            let { title, contact, fullDesc, img, isCreate, id } = res[0];
                            isCallBack(true, 'Success', { title, contact, fullDesc, img, isCreate, id, likeCnt: 0, disLikeCnt : 0,  likeAndDisLikes: [] }, {});
                        }
                    }
                    else isCallBack(false, 'please try again', {}, err);
                });
            } else isCallBack(false, 'Blog id or customerId is requierd', {}, {});
        } else isCallBack(false, 'Params is requierd', {}, {});
    }
  

    Blog.remoteMethod('getAllBlog', {
        http: { path: '/getAllBlog', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getAllBlog"
    });

    Blog.remoteMethod('getFindOne', {
        http: { path: '/getFindOne', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getFindOne"
    });

};
