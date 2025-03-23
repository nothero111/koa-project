const Router = require('@koa/router')
const userController = require('../controller/userController')
const {verifyTokenTrue,verifyTokenFalse} = require('../util/jwt')
const {registerValidate,loginValidate} = require('.' +
    './middleware/userValidate')
const router = new Router({prefix:'/api/v1'})


router
    // .get('/user/:id',userController.index)
    .post('/user/register',registerValidate,userController
        .register)
    .post('/user/login',loginValidate,userController.login)
    .get('/user/getuser/:userid',verifyTokenFalse,userController.getuser)
    .get('/user/subscribe/:subscribeid',verifyTokenTrue,userController.subscribe)
    .get('/user/subscribeList',verifyTokenTrue,userController.getSubscribe)
//video 管理模块
    const vodController = require('../controller/vodController')
    const videoController = require('../controller/videoController')
    router.get('/video/getvod',verifyTokenTrue,
        vodController.getvod)
        .post('/video/createvideo',verifyTokenTrue,videoController.createContrller)
        .get('/video/getvodplay',vodController.getplayer)
        .get('/video/videolist/:userid',videoController.videoList)
        .get('/video/getvideo/:videoid',videoController.getVideo)
//交互模块相关内容
     router.post('/video/comment/:videoid',verifyTokenTrue,videoController.createComment)
module.exports = router