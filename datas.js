var conn = require('./mysql.js');
var common = require('./libs/common.js');
var crypto = require('crypto');

//console.log(crypto);
var datas = {

};


/**
 * 登录用户token维护
 * @type {{}}
 */
datas.token = {



   // '1':{
   // type:0,
   // token:"xxxxx3333xxxx4444",
      //createAt:1023142134
    //}



};


/**
 * 接单人实时位置维护
 * @type {{}}
 */
datas.location = {


    'free':{

     //'10':{
     //    x:11570079.107299600,
     //    y:3582868.663399490
     //}

    },
    'busy':{

    }

    //'free':{
        //'1':{
        //    x:110.321121,
        //    y:32.231233
        //}


    //},
    //'busy':{
        //'2':{
        //    x:110.321121,
        //    y:32.231233
        //}

    //}



};


/**
 * 验证码维护
 * @type {{}}
 */
datas.code = {
    //'18613227075':{
    // code:128212,
    // createAt:1032121231
    //
    // }
};


datas.system = {
  // version:"1.0.0",
    //distance:2,
    //time:0.2,
    //weight:0.3,
    //data:{},
};

/**
 * 载入数据库中的token
 */
datas.loadToken = function(){
    conn.query(
        {
            sql:"select * from minutes_user where token !=''"
        },function(e,r){
            if(e){
                console.log(e);
                console.log(new Date());
            }else{
//console.log(r);
                if(r.length>0){
                    for(var i =0 ;i< r.length;i++){
                        datas.token[r[i].id]={
                            type:r[i].type,
                            token:r[i].token,
                            tel:r[i].tel,
                            nickname:r[i].nickname,
                            gender:r[i].gender,
                            money:r[i].money
                        };
                    }
                    console.log(datas.token);
                    console.log('token载入完成');
                }else{
                    console.log('数据库中无token');
                }
                
            }
        }
    )
};


/**
 * 载入基本设置
 */
datas.loadSetting = function(){
    conn.query(
        {
            sql:"select * from minutes_setting"
        },function(e,r){
            if(e){
                console.log(e);
                console.log(new Date());
            }else{
                try{
                    var data =JSON.parse(r[0].data);

                }catch(e){
                    var data={};
                }

                datas.system ={

                    "version":r[0].version,
                    "speedMax":r[0].speedMax,
                    "distanceFast":r[0].distanceFast,
                    "distanceSlow":r[0].distanceSlow,
                    "distanceMin":r[0].distanceMin,
                    "speedMin":r[0].speedMin,
                    "data":data,
                    "updateAt":r[0].updateAt
                };
                console.log('基础设置载入完成');
            }
        }
    )
};


/**
 * 生成登录用户的token
 * @param userId
 */
datas.genToken = function(userId,userinfo){
   var hash = crypto.createHash('md5');
    
    var md5=hash.update((""+userId+"dsgygb"+common.time()));
   var token = md5.digest('hex');

    datas.token[userId]={

        token:token,
        type:0,
        createAt:common.time(),
        nickname:userinfo.nickname,
        gender:userinfo.gender,
        tel:userinfo.tel,
        money:userinfo.money
    };

    return token;

};


/**
 * 接单人上线
 * @type {{}}
 */


datas.enable = function(userId,status,location){

    if(status=='free'){
        datas.location.free[userId]={
            x:location.x,
            y:location.y,
            createAt:common.time()
        }
    }else if(status == 'busy'){
        datas.location.busy[userId]={
            x:location.x,
            y:location.y,
            createAt:common.time()
        }
    }
}






module.exports = datas;