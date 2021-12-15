
const app = require("../../server/server");


module.exports = function (Forumcategory) {

    Forumcategory.getCategories = (params, cb) => {
        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        Forumcategory.find({ order: 'order asc' }, (err, res) => {
            if (err) isCallBack(false, 'please try again', {}, err);
            else if (res) isCallBack(true, 'Success', res, {});
            else isCallBack(false, 'please try again', {}, err);
        })
    }

    Forumcategory.getForumFromCategory = (params, cb) => {

        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });

        if (params) {
            let { categoryId, isPrivate, isForum = false, isArticle = false } = params;
            if (categoryId) {
                let filter = {};
                if (isForum) {
                    filter = { where: { id: categoryId }, include: [{ relation: "forums", scope: { where: { isPrivate, isForum }, include: [{ relation: "likeAndDisLikes", scope: { fields: ["isLike", "isDislike"] } }, { relation: "forumCommands" }] } }] };
                } else if (isArticle) {
                    filter = { where: { id: categoryId }, include: [{ relation: "forums", scope: { where: { isPrivate, isArticle }, include: [{ relation: "likeAndDisLikes", scope: { fields: ["isLike", "isDislike"] } }, { relation: "forumCommands" }] } }] };
                }
                Forumcategory.find(filter, (err, res) => {
                    if (err) isCallBack(false, 'please try again', {}, err);
                    else if (res) {
                        res = JSON.parse(JSON.stringify(res))
                        console.log(JSON.stringify(res));
                        if (res[0] && res[0].forums && res[0].forums.length) {
                            let forum = [];
                            let forumData = res[0].forums;
                            delete res[0].forums;
                            forumData.forEach((val) => {
                                val.likeCnt = (val.likeAndDisLikes.filter(m => m.isLike)).length || 0;
                                val.disLikeCnt = (val.likeAndDisLikes.filter(m => m.isDislike)).length || 0;
                                val.commandsCnt = val.forumCommands.length || 0;
                                delete val.likeAndDisLikes;
                                delete val.forumCommands;
                                forum.push(val);
                            });
                            res[0].forum = forum;
                            isCallBack(true, 'Success', res[0], {});
                        } else isCallBack(true, "No data", res[0], {})
                    }
                    else isCallBack(false, 'please try again', {}, err);
                })
            } else isCallBack(false, 'CategoryId is required', {}, {});
        } else isCallBack(false, 'Params is required', {}, {});
    }


    Forumcategory.remoteMethod('getForumFromCategory', {
        http: { path: '/getForumFromCategory', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getForumFromCategory"
    });

    Forumcategory.remoteMethod('getCategories', {
        http: { path: '/getCategories', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getCategories"
    });
};
