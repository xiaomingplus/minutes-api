var libs = require('../libs/libs.js');
var datas = require('../datas.js');
var conn = require('../mysql.js');
var common = require('../libs/common.js')
var accounts = {


};


/**
 * 写入数据库token
 */

accounts.mysqlToken = function(userId,type,token){
    conn.query(
        {
            sql:"select id from minutes_user where id="+userId
        },function(e,r){
            //console.log(e,r);
            if(r && r.length>0){
                    var sql = "update minutes_user set token='" + token + "',type=" + type + " where id="+userId;
                conn.query(
                    {
                        sql:sql
                    },function(ee,rr){
                        //console.log(ee,rr);
                    }
                );
            }else{
               console.log('找不到这个用户');
            }
        }
    )

};

/**
 * 完善信息
 */
accounts.complete = function(req,res){

    if(!req.body.nickname){
        res.dump('noNickname');
        return;
    }

    if(!req.body.gender){
        res.dump('noGender');
        return;
    }

    conn.query(
        {
            sql:"update minutes_user set nickname ='"+req.body.nickname+"',gender="+req.body.gender+" where id="+req.body.userId,
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{
                res.dump('ok');
            }
        }
    )
};


/**
 * 退出
 */


accounts.logout = function(req,res){

    delete datas.token[req.body.userId];

    conn.query(
        {
            sql:"update minutes_user set token='',type=0 where id="+req.body.userId
        },function(e,r){
            if(e){
                res.dump('mysqlError');
            }else{
                res.dump('ok');
            }
        }
    )

};

/**
 * 登录
 * @type {{}}
 */

accounts.signin = function(req,res){
    
    //console.log(req.body);

    if(!req.body.tel){
        res.dump('noTel');
        return;
    }

    if(!req.body.code){
        res.dump('noCode');
        return;
    }

    if(datas.code[req.body.tel] && datas.code[req.body.tel].code == req.body.code){


        conn.query(
            {
                sql:"select * from minutes_user where tel = '"+req.body.tel+"'"
            },function(e,r){
                if(e){
                    console.log(e);
                    res.dump('mysqlError');

                }else{

                    if(r.length>0){
                         var token = datas.genToken(r[0].id,{
                                            nickname:r[0].nickname,
                                            gender:r[0].gender,
                                            tel:r[0].tel,
                                            money:r[0].money
                                        });
                                        res.dump('ok', {
                                            userId:r[0].id,
                                            tel: req.body.tel,
                                            nickname:r[0].nickname,
                                            gender:r[0].gender,
                                            fromScore:r[0].fromScore,
                                            toScore:r[0].toScore,
                                            createAt: common.time(),
                                            token: token,
                                            type:0
                                        });
                                        accounts.mysqlToken(r[0].id,0,token);

                    }else{
                        conn.query(
                            {
                                sql:"insert into minutes_user (tel,createAt) values ('"+req.body.tel+"',"+common.time()+")"
                            },function(ee,rr){
                                if(ee){
                                    console.log(ee);
                                    res.dump('mysqlError');
                                }

                                if(rr.insertId) {

                                                var token = datas.genToken(rr.insertId,{
                                                    nickname:"",
                                                    gender:0,
                                                    tel:req.body.tel,
                                                    money:0
                                                });

                                                res.dump('ok', {
                                                    userId:rr.insertId,
                                                    tel: req.body.tel,
                                                    createAt: common.time(),
                                                    token: token,
                                                    type:0
                                                });
                                                accounts.mysqlToken(rr.insertId,0,token);




                                }else{
                                    res.dump('mysqlError');

                                }
                            }
                        );



                    }
                }
            }
        );

        delete datas.code[req.body.tel];

    }else{
        res.dump('validError');
    }

};


/**
 * 获取验证码
 * @type {{}}
 */

accounts.valid = function(req,res){

    if(!req.body.tel){
        res.dump('noTel');
        return;
    }
    //todo 检测是否是tel

var code = libs.getCode();
datas.code[req.body.tel]={
    code:code,
    createAt:common.time()
};
    libs.send(req.body.tel,code,function(e,r){
        if(e){

            res.log(e);
            res.dump(e);

        }else{

            conn.query(
                {
                    sql:"select nickname from minutes_user where tel = '"+req.body.tel+"'"
                },function(ee,rr){
                    if(ee){
                        res.log(ee);
                        res.dump('mysqlError');
                    }else{

                        if(rr.length>0 && rr[0].nickname){
                            res.dump('ok',{
                                isUser:true
                            });
                        }else{
                            res.dump('ok',{
                                isUser:false
                            });
                        }


                    }
                }
            );



        }
    });

};


accounts.userinfo = function(req,res){
    conn.query(
        {
            sql:"select * from minutes_user where id="+req.query.userId
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{

                if(r.length>0){
                    res.dump('ok',{
                        "userId": r[0].id,
                        "tel": r[0].tel,
                        "nickname": r[0].nickname,
                        "gender": r[0].gender,
                        "createAt": r[0].createAt, //注册时间
                        "fromScore": r[0].fromScore?r[0].fromScore:0,
                        "toScore":r[0].toScore?r[0].toScore:0
                        "type":r[0].type,
                        "token":r[0].token
                    });
                }else{
                    res.dump('noUser');
                }
            }
        }
    )
};


accounts.switch = function (req,res) {

    if(!req.body.type){
        res.dump('noType');
        return;
    }

    datas.token[req.body.userId].type=req.body.type;
    accounts.mysqlToken(req.body.userId,req.body.type,req.body.token);
    res.dump('ok');

};


accounts.pay = function(req,res){

    if(!req.body.money){
        res.dump('noMoney');
        return;
    }

    conn.query(
        {
            sql:"update minutes_user set money=money+"+parseInt(req.body.money)+" where id="+req.body.userId
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{
                res.dump('ok');
            }
        }
    )
};


accounts.money = function(req,res){

    conn.query(
        {
            sql:"select * from minutes_user where id="+req.query.userId
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{

                if(r.length>0) {
                    res.dump('ok', {
                        money:r[0].money
                    });
                }else{
                    res.dump('noUser');
                }
            }
        }
    )
};

accounts.getLocation = function(req,res){
    if(!req.query.toUserId){
        res.dump("noToUserId");
        return;
    }

    if(datas.location.free[req.query.toUserId]){
        res.dump('ok',datas.location.free[req.query.toUserId]);
        return;
    }else if(datas.location.busy[req.query.toUserId]){
        res.dump('ok',datas.location.busy[req.query.toUserId]);
        return;
    }else{
        res.dump('serverHasOffline');
    }
};

accounts.postLocation = function(req,res){
if(!req.body.x){
    res.dump('noX');
    return;
}

    if(!req.body.y){
        res.dump('noY');
        return;
    }

    if(datas.location.free[req.body.userId]){

        datas.location.free[req.body.userId]={
            x:req.body.x,
            y:req.body.y
        };
        res.dump('ok');
        return;
    }else if(datas.location.busy[req.body.userId]){
        datas.location.busy[req.body.userId]={
            x:req.body.x,
            y:req.body.y
        };
        res.dump('ok');
        return;
    }else{
        conn.query(
            {
                sql:"select id from minutes_order where toUserId="+req.body.userId+" and status <=1"
            },function(e,r){
                if(e){
                    res.log(e);
                    res.dump('mysqlError');
                    return;
                }

                if(r.length>0){
                    datas.location.busy[req.body.userId]={
                        x:req.body.x,
                        y:req.body.y
                    };
                    res.dump('ok');
                    return;
                }else{
                    datas.location.free[req.body.userId]={
                        x:req.body.x,
                        y:req.body.y
                    };
                    res.dump('ok');
                    return;
                }
            }
        )
    }





};

module.exports= accounts;