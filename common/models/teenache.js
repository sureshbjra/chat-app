const app = require('../../server/server');

module.exports = function (Teenache) {


    Teenache.getTeenache = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {

            let filter = {};

            if (params.isForum) {
                filter = { where: { isForum: params.isForum, category: params.category }, include: [{ relation: "likeAndDisLikes", scope: { fields: ["isLike", "isDislike"] } }, { relation : "teenacheCommands" }] };
            } else if (params.isArticle) {
                filter = { where: { isArticle: params.isArticle, category: params.category, include: [{ relation: "likeAndDisLikes", scope: { fields: ["isLike", "isDislike"] } }, { relation : "teenacheCommands" }] } }
            }

            Teenache.find(filter, (err, res) => {
                if (err) isCallBack(false, "No Data!", {}, {})
                else if (res) {
                    res = JSON.parse(JSON.stringify(res));
                    let data = [];
                    res.forEach((val, i)=>{
                        val.likeCnt = (val.likeAndDisLikes.filter(m => m.isLike)).length || 0;
                        val.disLikeCnt = (val.likeAndDisLikes.filter(m => m.isDislike)).length || 0;
                        val.commandsCnt = val.teenacheCommands.length || 0;
                        delete val.likeAndDisLikes;
                        delete val.teenacheCommands;
                        data.push(val);
                    })
                    isCallBack(true, "Success", data, {})
                }
                else isCallBack();
            })

        } else isCallBack();
    }

    Teenache.getById = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { teenacheId, customerId } = params;
            Teenache.find({ where: { id: teenacheId }, include: [{ relation: "likeAndDisLikes", scope: { include: [{ relation: "customer" }] } }] }, async (err, res) => {
                if (err) await isCallBack(false, "No Data!", {}, {})
                else if (res) {
                    res = JSON.parse(JSON.stringify(res));
                    if (res && res.length && res[0].likeAndDisLikes && res[0].likeAndDisLikes.length) {
                        let likes = res[0].likeAndDisLikes.filter(m => m.isLike == true), likeCnt = 0;
                        if (likes && likes.length) likeCnt = likes.length;
                        let dislikes = res[0].likeAndDisLikes.filter(m => m.isLike == false), disLikeCnt = 0;
                        if (dislikes && dislikes.length) disLikeCnt = dislikes.length;
                        let likeAndDisLikes = [];
                        likeAndDisLikes.push(res[0].likeAndDisLikes.find(m => m.customerId == customerId));
                        delete res.likeAndDisLikes;
                        let { isForum, isArticle, title, category, fullDesc, img, isCreate, id } = res[0];
                        await isCallBack(true, 'Success', { isForum, isArticle, title, category, fullDesc, img, isCreate, id, likeCnt, disLikeCnt, likeAndDisLikes }, {});
                    } else {
                        let { isForum, isArticle, title, category, fullDesc, img, isCreate, id } = res[0];
                        await isCallBack(true, 'Success', { isForum, isArticle, title, category, fullDesc, img, isCreate, id, likeCnt: 0, disLikeCnt: 0, likeAndDisLikes: [] }, {});
                    }
                }
                else isCallBack();
            })

        } else isCallBack();
    }

    Teenache.remoteMethod('getById', {
        http: { path: '/getById', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getTeenache"
    });

    Teenache.remoteMethod('getTeenache', {
        http: { path: '/getTeenache', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getTeenache"
    });
};
