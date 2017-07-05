module.exports = {
    //ali private ip
    mongodb: 'mongodb://admin:admin@ds117931.mlab.com:17931/oceany-prod',
    // qn
    qn: {
        accessKey: 'IThkAny7wzlPGCR2pcJT8IrWkdes0Ic7PR38OwoQ',
        secretKey: '4lUiAwT3jymK85eFu85PboWTjuv6wLM8wMO8oCEs',
        bucket: 'oceany-prod',
        origin: 'http://oceany-prod.u.qiniudn.com',
        cdn: 'http://orwbxzl93.bkt.clouddn.com/',
        timeout: 3600000, // default rpc timeout: one hour
        uploadURL: 'http://up-z0.qiniu.com/' // the app outside of China
    }
};