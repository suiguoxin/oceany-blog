module.exports = {
    port: 3000,
    session: {
        secret: 'oceany',
        key: 'oceany',
        maxAge: 2592000000
    },
    //ali private ip
    mongodb: 'mongodb://admin:admin@127.0.0.1:27017/oceany-blog',
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