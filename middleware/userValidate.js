const {User} = require('../model/index')
const Joi = require('joi')
//关于注册的验证
module.exports.registerValidate = async(ctx,next)=>{
    const schema = Joi.object({
        username:Joi.string().required(),
        password:Joi.string().min(6).required(),
        email:Joi.string().email().required(),
        phone:Joi.string().required()
    }).validate(ctx.request.body)
    if (schema.error){
        ctx.throw(400,schema.error)
    }
    const emailValidate = await User.findOne({
        email: ctx.request.body.email
    })
    if (emailValidate){
        ctx.throw(400,'邮箱已存在')
    }
    await next()
}
//关于登陆的验证
module.exports.loginValidate = async(ctx,next)=>{
    const schema = Joi.object({
        password:Joi.string().min(6).required(),
        email:Joi.string().email().required(),
    }).validate(ctx.request.body)
    if (schema.error){
        ctx.throw(400,schema.error)
    }
    const emailValidate = await User.findOne({
        email: ctx.request.body.email
    })
    if (!emailValidate){
        ctx.throw(400,'邮箱不存在')
    }
    await next()
}
