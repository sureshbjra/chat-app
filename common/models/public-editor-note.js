

module.exports = function(Publiceditornote) {

    Publiceditornote.observe('before save', function (ctx, next) {
        if (ctx.isNewInstance && ctx.instance) {
            Publiceditornote.find({ where: { status: "new" } }, (err, res) => {
                if (err) next();
                else {
                    if (res.length) {
                        res.forEach((val, i) => {
                            if (val.id) Publiceditornote.upsertWithWhere({ id: val.id }, { status: 'rejected' })
                            if ((i + 1) == res.length) next();
                        });
                    } else next();
                }
            })
        } else next();
    });

    Publiceditornote.getFindAll = (params, cb) => {
        let  isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
        Publiceditornote.find({ where : { status : 'new' } },(err, res) => {
             if (err) isCallBack(false, 'please try again', {}, err);
             else if (res) isCallBack(true, 'Success', res, {});
             else isCallBack(false, 'please try again', {}, err);
         })
     }
 
     Publiceditornote.getFindOne = (params, cb) => {
        let isCallBack = (isSuccess = false, message = "Please try again", result = {}, error = {}) => cb(null, { isSuccess, message, result, error });
         if (params) {
             let { editorId } = params;
             if (editorId) {
                Publiceditornote.find({ where: { id: editorId } }, (err, res) => {
                     if (err) isCallBack(false, 'please try again', {}, err);
                     else if (res && res.length) isCallBack(true, 'Success', res[0], {});
                     else isCallBack(false, 'please try again', {}, err);
                 });
             } else isCallBack(false, 'Blog id is requierd', {}, {});
         } else isCallBack(false, 'Params is requierd', {}, {});
     }
 
 
     Publiceditornote.remoteMethod('getFindAll', {
         http: { path: '/getFindAll', verb: 'get' },
         accepts: { arg: 'params', type: 'object' },
         returns: { arg: 'data', type: 'object' },
         description: "getFindAll"
     });
 
     Publiceditornote.remoteMethod('getFindOne', {
         http: { path: '/getFindOne', verb: 'get' },
         accepts: { arg: 'params', type: 'object' },
         returns: { arg: 'data', type: 'object' },
         description: "getFindOne"
     });

};
