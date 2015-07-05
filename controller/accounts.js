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
            sql:"select id from minutes_token where userId="+userId
        },function(e,r){
            //console.log(e,r);
            if(r && r.length>0){
                conn.query(
                    {
                        sql:"update minutes_token set token='"+token+"',type="+type
                    },function(ee,rr){
                        //console.log(ee,rr);
                    }
                )
            }else{
                conn.query(
                    {
                        sql:"insert into minutes_token (userId,token,type) values ("+userId+",'"+token+"',"+type+")"
                    },function(ee,rr){
                        //console.log(ee,rr);
                    }
                )
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
            sql:"delete from minutes_token where userId="+req.body.userId
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

                        var token = datas.genToken(r[0].id);
                        res.dump('ok', {
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

                                    conn.query(
                                        {
                                            sql:"insert into minutes_wallet (userId) values ("+rr.insertId+")"
                                        },function(eee,rrr){
                                            if(eee){
                                                res.log(eee);
                                                res.dump('mysqlError');
                                            }else{

                                                var token = datas.genToken(rr.insertId);
                                                res.dump('ok', {
                                                    tel: req.body.tel,
                                                    createAt: common.time(),
                                                    token: token,
                                                    type:0
                                                });
                                                accounts.mysqlToken(rr.insertId,0,token);

                                            }


                                        }
                                    )



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
                    res.dump('ok',r[0]);
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
            sql:"update minutes_wallet set money=money+"+parseInt(req.body.money)+" where userId="+req.body.userId
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
            sql:"select * from minutes_wallet where userId="+req.query.userId
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

module.exports= accounts;