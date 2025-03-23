const mongoose = require('mongoose')
const {mongoPath} = require('../config/config.default')

async function main(){
    await mongoose.connect(mongoPath)
}

main().then(()=>{
    console.log('mongoDB数据库连接成功')
})
.catch((err)=>{
    console.log(err)
})

module.exports = {
    //创建一个叫User的模型
    User:mongoose.model('User',require('./userModel')),
    Video:mongoose.model('Video',require('./videoModel')),
    Subscribe:mongoose.model('Subscribe',require('./subscribeModel')),
    Videocomment:mongoose.model('Videocomment',require('' +
        './videocommentModel')),
    Videolike:mongoose.model('Videolike',require('./videolikeModel')),
    CollectModel:mongoose.model('Collect',require('./collectModule')),
}