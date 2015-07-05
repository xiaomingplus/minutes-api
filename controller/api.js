var datas = require('../datas.js');
var common = require('../libs/common.js');
var api = {

};



api.before = function(req,res,next){
    res.setHeader('content-type','application/json; charset=UTF-8');
    next();
};

api.system = function(req,res){
  res.dump('ok',datas.system);
};


module.exports = api;