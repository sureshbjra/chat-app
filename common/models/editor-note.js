

module.exports = function (Editornote) {

    Editornote.observe('before save', function (ctx, next) {
        if (ctx.isNewInstance && ctx.instance) {
            Editornote.find({ where: { status: "new" } }, (err, res) => {
                if (err) next();
                else {
                    if (res.length) {
                        res.forEach((val, i) => {
                            if (val.id) Editornote.upsertWithWhere({ id: val.id }, { status: 'rejected' })
                            if ((i + 1) == res.length) next();
                        });
                    } else next();
                }
            })
        } else next();
    });

    Editornote.getFindAll = (params, cb) => {
       let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        Editornote.find({ where : { status : 'new' } },(err, res) => {
            if (err) isCallBack(false, 'please try again', {}, err);
            else if (res) isCallBack(true, 'Success', res, {});
            else isCallBack(false, 'please try again', {}, err);
        })
    }

    Editornote.getFindOne = (params, cb) => {
       let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        if (params) {
            let { editorId } = params;
            if (editorId) {
                Editornote.find({ where: { id: editorId } }, (err, res) => {
                    if (err) isCallBack(false, 'please try again', {}, err);
                    else if (res && res.length) isCallBack(true, 'Success', res[0], {});
                    else isCallBack(false, 'please try again', {}, err);
                });
            } else isCallBack(false, 'Blog id is requierd', {}, {});
        } else isCallBack(false, 'Params is requierd', {}, {});
    }


    Editornote.remoteMethod('getFindAll', {
        http: { path: '/getFindAll', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getFindAll"
    });

    Editornote.remoteMethod('getFindOne', {
        http: { path: '/getFindOne', verb: 'get' },
        accepts: { arg: 'params', type: 'object' },
        returns: { arg: 'data', type: 'object' },
        description: "getFindOne"
    });
};
