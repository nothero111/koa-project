const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const tojwt = promisify(jwt.sign)//把生成token的方法做转换
const toverify = promisify(jwt.verify)//把验证token的方法做转换
//生成token
module.exports.createToken = async userinfo=>{
    let token = await tojwt({userinfo},'koa-video',{
        expiresIn:60*60*24
    })
    return token
}
//验证token（需要传入token）
module.exports.verifyTokenTrue = async (ctx,next)=>{
        let token = ctx.header.authorization
        token = token?token.split('Bearer ')[1]:null
        if(token){
            try{
                ctx.user = await toverify(token,'koa-video')

                await next()
            }catch (error){
                ctx.throw(402,'token验证失败',error)
            }
        }else {
            ctx.throw(402, '无效的token')
        }

    }
    //验证token（不需要传入token）
module.exports.verifyTokenFalse = async (ctx,next)=>{
    let token = ctx.header.authorization
    token = token?token.split('Bearer ')[1]:null
    if(token){
        try{
            ctx.user = await toverify(token,'koa-video')
            await next()
        }catch (error){
            console.log(error)
            ctx.throw(402,'token验证失败')
        }
    }else {
        await next()
    }

}


