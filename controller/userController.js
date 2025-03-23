const {User} = require('../model/index')
const {createToken} = require('../util/jwt')
const {Subscribe} = require("../model");
//关于用户注册
module.exports.register = async (ctx,next)=>{
    const userModel = new User(ctx.request.body)
    ctx.body = await userModel.save()
}
//关于用户登录
module.exports.login = async (ctx,next)=>{
   let dbBack = await User.findOne(ctx.request.body)
   if(!dbBack){
       return ctx.throw(402,'邮箱或密码错误')
   }
     let token = await createToken(dbBack)
    ctx.body = {dbBack,token}
}
//获取用户信息
module.exports.getuser = async (ctx,next)=>{
    const{ userid }= ctx.request.params//获取的是一个对象，对象里面包含userid
    const registerUserId = ctx.user?ctx.user._id:null
    let isSubscribe = false
    if (registerUserId){
       let subscribe = await Subscribe.findOne({user:registerUserId,channel:userid})
        if (subscribe){
            isSubscribe = true
        }

    }
    let userInfoDb = await User.findById(userid,['username','channeldes',
        'image','cover'])
    let userInfo = userInfoDb._doc
    userInfo.isSubscribe = isSubscribe
    ctx.body = userInfo

}
//关注用户
module.exports.subscribe = async (ctx,next)=>{
    const{ subscribeid }= ctx.request.params//获取的是一个对象，对象里面包含
    // userid
    const userid = ctx.user.userinfo._id
    if (subscribeid === userid){
        return ctx.throw(403,'不能关注自己')
    }
    let subinfo = await Subscribe.findOne({user:userid,
        channel:subscribeid})
    if (subinfo){
        return ctx.throw(403,'不能重复关注')
    }
    let sub = new Subscribe({user:userid,channel:subscribeid})
    let subDb = await  sub.save()
    if (subDb){
        let subscribeUser = await User.findById(subscribeid,['username',
            'image','cover',
            'channeldes','subscribeCount'])
        subscribeUser.subscribeCount++
        await subscribeUser.save()
        ctx.body = subscribeUser
    }else{
        ctx.throw(501,'关注失败')
    }
}
//index获取用户信息
module.exports.index = async (ctx,next)=>{
    let user = await User.findById(ctx.params.id)
    ctx.body = user
}
//关注列表
module.exports.getSubscribe = async (ctx,next)=>{
    const userid = ctx.user.userinfo._id
    let subList = await Subscribe.find({user:userid})
        .populate('channel',['username','image','channeldes',
            'subscribeCount'])
    ctx.body = subList
}