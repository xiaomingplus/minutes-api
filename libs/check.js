var datas = require('../datas.js');
var code = require('../code.js');
var check = {

};

check.isLogin = function(req,res,next){
    var userId,token;
    if(req.method=="POST"){
        userId=req.body.userId;
        token = req.body.token;
    }else if(req.method == 'GET'){
        userId = req.query.userId;
        token= req.query.token;
    }else{
        res.dump('notLogin');
        return;
    }

    if(userId && token){

        if(datas.token[userId].token == token){
            next();
        }else{
            res.dump('notLogin');

        }
    }else{
        res.dump('notLogin');

    }
    
};



check.isServer = function(req,res,next){
    var userId;
    if(req.method=="POST"){
        userId=req.body.userId;
    }else if(req.method == 'GET'){
        userId = req.query.userId;
    }else{
        res.dump('notLogin');
        return;
    }
    if(datas.token[userId] && datas.token[userId].type==2){
        next();
    }else{
        res.dump('mustServer');
    }


};


check.isConsumer = function(req,res,next){
    var userId;
    if(req.method=="POST"){
        userId=req.body.userId;
    }else if(req.method == 'GET'){
        userId = req.query.userId;
    }else{
        res.dump('notLogin');
        return;
    }
    if(datas.token[userId] && datas.token[userId].type==1){
        next();
    }else{
        res.dump('mustConsumer');
    }


};



module.exports = check;