let RPCClient = require('@alicloud/pop-core').RPCClient;
function initVodClient(accessKeyId,accessKeySecret) {
    let regionId = 'cn-shanghai';  // 点播服务接入区域
    return new RPCClient({
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        endpoint: 'http://vod.cn-shanghai.aliyuncs.com',
        apiVersion: '2017-03-21'
    });
}

exports.getvod = async (ctx,next) => {
    console.log(1)
    let client = initVodClient('accessKeyId',
        'accessKeySecret')
    let vodBack = await client.request('CreateUploadVideo', {
        Title: ctx.request.query.title,//视频的名字
        FileName: ctx.request.query.filename//视频本身的名字以及后缀
    },{})
    ctx.body = vodBack
}

const getvodplay = async (vodId) => {
    let client = initVodClient('your_accessKeyId', 'youraccessKeySecret')
    try{
        let response = await client.request('GetPlayInfo', {
            VideoId: vodId,
        })
        return  response
    }catch (response){
        console.log('ErrorCode = '+ response.data.code)
        console.log('ErrorMessage = '+ response.data.message)
        console.log('RequestId = '+ response.data.requestId)
        return response
    }
}

exports.getplayer = async ctx=>{//获取视频播放地址及其封面地址
    let play = await getvodplay(ctx.request.query.vodid)
    ctx.body = play
}
module.exports.getvodplay = getvodplay
