
module.exports = function(Forum) {


    Forum.getFindOne = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        try {
            if(params) {
                let { forumId , customerId } = params;
                if(forumId){
                    Forum.find({ where : { id : forumId } , include : [{ relation : "likeAndDisLikes" , scope: { include:  [{ relation : "customer" }] } }] },async (err, res) => {
                        if (err) await isCallBack(false, 'please try again', {}, err);
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
                                await isCallBack(true, 'Success', { title, contact, fullDesc, img, isCreate, id, likeCnt , disLikeCnt, likeAndDisLikes }, {});
                            } else {
                                let { title, contact, fullDesc, img, isCreate, id } = res[0];
                                await isCallBack(true, 'Success', { title, contact, fullDesc, img, isCreate, id, likeCnt: 0, disLikeCnt : 0,  likeAndDisLikes: [] }, {});
                            }
                        }
                        else isCallBack(false, 'please try again', {}, err);
                    })
                } else isCallBack(false, 'forumId id is requierd', {}, {});
            } else isCallBack(false, 'Params is requierd', {}, {});
        } catch(e) {
            isCallBack(false, 'Params is requierd', {}, e);
        }
    }

    Forum.remoteMethod('getFindOne', {
        http: { path: '/getFindOne', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getFindOne"
    });

};
