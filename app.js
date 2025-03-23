const Koa = require('koa')
const {koaBody} = require('koa-body')
const router = require('./router')
const cors = require('@koa/cors')
const app = new Koa()


app.use(cors())//解决跨域问题
app.use(koaBody())//解决请求体的解析问题
app.use(router.routes())

app.on('error', (err, ctx) => {//全局错误处理
    console.log(err)
    ctx.body = 'Sever Err' + err
})
app.listen(3000,() => {
    console.log('Server is running on port ' +
        '3000')
})