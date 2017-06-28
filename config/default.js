module.exports = {
    port: 3000,
    session: {
        secret: 'oceany',
        key: 'oceany',
        maxAge: 2592000000
    },
    //mlab
    mongodb: 'mongodb://admin:admin@ds145009.mlab.com:45009/oceany',
    // qn
    qn: {
        accessKey: 'IThkAny7wzlPGCR2pcJT8IrWkdes0Ic7PR38OwoQ',
        secretKey: '4lUiAwT3jymK85eFu85PboWTjuv6wLM8wMO8oCEs',
        bucket: 'oceany-dev',
        origin: 'http://oceany-dev.u.qiniudn.com',
        cdn: 'http://orwbmwhlv.bkt.clouddn.com/',
        timeout: 3600000, // default rpc timeout: one hour
        uploadURL: 'http://up-z0.qiniu.com/' // the app outside of China
    }
};