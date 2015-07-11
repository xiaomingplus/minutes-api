var express = require('express');
var router = express.Router();
var api = require('../controller/api.js');
var check = require('../libs/check.js');
var code = require('../code.js');
var order = require('../controller/order.js');
var accounts = require('../controller/accounts.js');
/**
 * api
 */




router.get('/',function(req,res,next){
  res.dump('ok',null,"欢迎使用分分钟api");
});


router.all('/api/*',function(req,res,next){
  api.before(req,res,next);
});

router.get('/api/system',function(req,res){
  api.system(req,res);
});

//test
router.get('/api/test',check.isLogin,function(req,res){
res.dump('ok');
});


/**
 * 用户登录相关
 */
router.post('/api/valid',function(req,res){

accounts.valid(req,res);

});

router.post('/api/complete',function(req,res){
  accounts.complete(req,res);
});

router.post('/api/signin',function(req,res){
  accounts.signin(req,res);
});

router.post('/api/logout',check.isLogin,function(req,res){
  accounts.logout(req,res);
});

router.get('/api/userinfo',check.isLogin,function(req,res){
  accounts.userinfo(req,res);
});

router.post('/api/switch',check.isLogin,function(req,res){
  accounts.switch(req,res);
});

router.post('/api/location',check.isLogin,check.isServer,function(req,res){
accounts.postLocation(req,res);
});


router.get('/api/location',check.isLogin,function(req,res){
accounts.getLocation(req,res);
});

/**
 * 账户余额管理相关
 */

router.post('/api/pay',check.isLogin,function(req,res){
  accounts.pay(req,res);
});

router.get('/api/money',check.isLogin,function(req,res){
accounts.money(req,res);
});


/**
 * 订单相关
 */

router.post('/api/enable',check.isLogin,check.isServer,function(req,res){
order.enable(req,res);
});
router.post('/api/disable',check.isLogin,check.isServer,function(req,res){
  order.disable(req,res);
});

router.post('/api/order',check.isLogin,check.isConsumer,function(req,res){
  order.order(req,res);
});

router.post('/api/order/from/cancel',check.isLogin,function(req,res){
  order.fromCancel(req,res);
});

router.post('/api/order/to/cancel',check.isLogin,function(req,res){
  order.toCancel(req,res);
});


router.post('/api/order/start',check.isLogin,check.isServer,function(req,res){
  order.start(req,res);
});

router.post('/api/order/finish',check.isLogin,check.isServer,function(req,res){
  order.finish(req,res);
});

router.post('/api/score/from',check.isLogin,function(req,res){
order.fromScore(req,res);
});

router.post('/api/score/to',check.isLogin,function(req,res){
order.toScore(req,res);
});

router.get('/api/order/list',check.isLogin,function(req,res){
  order.list(req,res);
});

router.get('/api/order/detail',check.isLogin,function(req,res){
  order.detail(req,res);
});
module.exports = router;
