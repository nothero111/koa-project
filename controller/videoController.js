const {Video,Videocomment} = require('../model/index')
module.exports.createContrller = async (ctx, next) => {
    let body = ctx.request.body
    body.user = ctx.user.userinfo._id
    const videoModel = new Video(body)
    try{
        let dbBack = await videoModel.save()
        ctx.body = dbBack
    }catch (error){
        ctx.throw(502, error)
    }

}
//频道视频列表
module.exports.videoList = async (ctx, next) => {
    let userid = ctx.request.params.userid
    let{pageNum = 1,pageSize = 10} = ctx.request.query
    let videoList = await Video.find({user:userid}).skip((pageNum - 1) * pageSize).limit(pageSize).sort({createAt:-1})
        .populate('user',['cover','username','image','channeldes','subscribeCount'])
    ctx.body = videoList
}
//获取视频详情
module.exports.getVideo = async (ctx, next) => {
    let videoId = ctx.request.params.videoid
    let dbBack = await Video.findById(videoId).populate('user',['cover',
        'username','image','channeldes','subscribeCount'])
    let videoinfo = dbBack._doc
    if (videoinfo){
        const {getvodplay} = require('./vodController')
        let vodinfo = await getvodplay(videoinfo.vodvideoId)
        videoinfo.vodinfo = vodinfo
        ctx.body = videoinfo
    }else{
        ctx.throw(501,'没有找到该视频')
    }
    ctx.body = dbBack

}
//评论
module.exports.createComment = async (ctx, next) => {
    let {videoid} = ctx.request.params
    const {content} = ctx.request.body
    const userId = ctx.user.userinfo._id
    let videoInfo = await Video.findById(videoid)
    if (videoInfo){
            const commentModel = new Videocomment({
                content,
                user:userId,
                video:videoid
            })
        let dbBack = await commentModel.save()
        if (dbBack){
            videoInfo.commentCount++
            await videoInfo.save()
            ctx.body = dbBack
            //redis hot + 2
            ctx.body = {msg:"评论成功"}
        }else {
            ctx.throw(501,'评论失败')
        }
        }else {
        ctx.throw(404,'没有找到该视频')
    }
    }