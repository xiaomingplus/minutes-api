var datas = require('../datas.js');
var common = require('../libs/common.js');
var config = require('../config.js');
var notice = require('../libs/notice.js');
var conn = require('../mysql.js');
var libs = require('../libs/libs.js');
var order = {

};


order.enable = function(req,res){

    if(!req.body.x){
        res.dump('noX');
        return;
    }

    if(!req.body.y){
        res.dump('noY');
        return;
    }

    datas.enable(req.body.userId,'free',{
        x:req.body.x,
        y:req.body.y
    });

    res.dump('ok');
    //console.log(datas.location.free);


};


order.disable = function(req,res){

    if(!datas.location.free[req.body.userId]){
        res.dump('noFree');
        return;
    }

    delete datas.location.free[req.body.userId];

    res.dump('ok');
    
    //console.log(datas.location);
};


order.order  = function(req,res){

    if(!req.body.x){
        res.dump('noX');
        return;
    }

    if(!req.body.y){
        res.dump('noY');
        return;
    }

    if(datas.token[req.body.userId].money<0){
        res.dump('moneyDept');
        return;
    }


    conn.query(
        {
            sql:"select * from minutes_order where (fromUserId="+req.body.userId+" or toUserId="+req.body.userId+") and status<=1"
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{
                if(r.length>0){
                    res.dump('mustCompleteCurrentOrder');
                }else{
                    var serversDistance = [],servers=[];
                    for(var i in datas.location.free){
                        var distance = common.getDistance(req.body.x,req.body.y,datas.location.free[i].x,datas.location.free[i].y);
                        if(distance<config.maxDistance){
                            serversDistance.push(distance);
                            servers.push({
                                userId:i
                            })
                        }
                    }

                    if(serversDistance.length==0){
                        res.dump('noServer');
                    }else{
                       var minDistance =  Math.min.apply(null,serversDistance);

                        for (var i=0;i<serversDistance.length;i++){
                            if(serversDistance[i]==minDistance){
                                var toUserId = servers[i].userId;
                            }
                        }
                        conn.query(
                            {
                                sql:"select * from minutes_user where id="+toUserId
                            },function(eee,rrr){
                                if(eee){
                                    res.log(eee);
                                    res.dump('mysqlError');
                                }else{


                                    if(rrr.length>0){

                                        conn.query(
                                            {
                                                sql:"insert into minutes_order (fromUserId,createAt,positionX,positionY,toUserId,status) values (" +
                                                ""+req.body.userId+","+common.time()+","+req.body.x+","+req.body.y+","+toUserId+",0)"
                                            },function(ee,rr){

                                                if(ee){
                                                    res.log(ee);
                                                    res.dump('mysqlError');
                                                }else{

                                                    datas.location.busy[toUserId]={
                                                        x:datas.location.free[toUserId].x,
                                                        y:datas.location.free[toUserId].y
                                                    };
                                                    delete datas.location.free[toUserId];


                                                    res.dump('ok',{
                                                        orderId:rr.insertId,
                                                        toUserId:toUserId,
                                                        toUserNickname:rrr[0].nickname,
                                                        toUserTel:rrr[0].tel,
                                                        toUserGender:rrr[0].gender,
                                                        toUserToScore:rrr[0].toScore
                                                    });

                                                    //todo 推送给服务者

                                                    notice.send(toUserId,"你有一个新单子","点击查看详情",{
                                                        fromUserId:req.body.userId,
                                                        fromUserNickName:datas.token[req.body.userId].nickname,
                                                        fromUserTel:datas.token[req.body.userId].tel,
                                                        fromUserGender:datas.token[req.body.userId].gender
                                                    });


                                                }

                                            }
                                        );
                                    }else{
                                        res.dump('noServer');

                                    }


                                }
                            }
                        )



                    }



                }
            }
        }
    )

};



order.fromCancel = function(req,res){

    if(!req.body.orderId){
        res.dump('noOrderId');
        return;
    }

    conn.query(
        {
            sql:"update minutes_order set status=3 where id="+req.body.orderId+" and fromUserId="+req.body.userId+" and status<=1"
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{
                
                //console.log(r);

                if(r.affectedRows>0){

                    //todo 通知

                    res.dump('ok');
                }else{
                    res.dump('noCurrentOrder');
                }

            }
        }
    )


};


order.toCancel = function(req,res){

    if(!req.body.orderId){
        res.dump('noOrderId');
        return;
    }

    conn.query(
        {
            sql:"update minutes_order set status=4 where id="+req.body.orderId+" and toUserId="+req.body.userId+" and status<=1"
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{

                //console.log(r);

                if(r.affectedRows>0){
                    res.dump('ok');

                    //todo 通知
                }else{
                    res.dump('noCurrentOrder');
                }

            }
        }
    )

};

order.start  =  function(req,res){


    if(!req.body.orderId){
        res.dump('noOrderId');
        return;
    }

    if(!req.body.x){
        res.dump('noX');
        return;
    }

    if(!req.body.y){
        res.dump('noY');
        return;
    }

    conn.query(
        {
            sql:"update minutes_order set status=1,originX="+req.body.x+",originY="+req.body.y+",startAt="+common.time()+" where id="+req.body.orderId+" and toUserId="+req.body.userId+" and status=0"
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{

                //console.log(r);

                if(r.affectedRows>0){
                    res.dump('ok');
                }else{
                    res.dump('noCurrentOrder');
                }

            }
        }
    )

};

order.finish = function(req,res){
    if(!req.body.orderId){
        res.dump('noOrderId');
        return;
    }

    if(!req.body.x){
        res.dump('noX');
        return;
    }

    if(!req.body.y){
        res.dump('noY');
        return;
    }

    req.body.userId=parseInt(req.body.userId);
    req.body.destinationX = parseFloat(req.body.x);
    req.body.destinationY = parseFloat(req.body.y);


    conn.query(
        {
            sql:"select * from minutes_order where id="+req.body.orderId+" and toUserId="+req.body.userId+" and status=1"
        },function(ee,rr){


            if(ee){
                res.log(ee);
                res.dump('mysqlError');
            }else{

                if(rr.length>0){
                    var distance = common.getDistance(req.body.destinationX,req.body.destinationY,rr[0].originX,rr[0].originY);
                    var time = (common.time()-rr[0].startAt);
                    var price=libs.price(distance,time);

                    conn.query(
                        {
                            sql:"update minutes_order set status=2,destinationX="+req.body.destinationX+",destinationY="+req.body.destinationY+",price="+price+",finishAt="+common.time()+" where id="+req.body.orderId+" and toUserId="+req.body.userId+" and status=1"
                        },function(e,r){
                            if(e){
                                res.log(e);
                                res.dump('mysqlError');
                            }else{

                                //console.log(r);

                                if(r.affectedRows>0){

                                    //删除busy的服务者
                                    //重新放入 free

                                    delete datas.location.busy[req.body.userId];
                                    datas.location.free[req.body.userId]={
                                        x:req.body.destinationX,
                                        y:req.body.destinationY
                                    };

                                    //算钱
                                    datas.token[req.body.userId].money+=price;
                                    datas.token[rr[0].fromUserId].money-=price;
                                    conn.query(
                                        {
                                            sql:"update minutes_user set money=money-"+parseFloat(price)+" where id="+rr[0].fromUserId
                                        },function(eeee,rrrr){
                                            console.log(eeee,rrrr);
                                        }
                                    );
                                    

                                    conn.query(
                                        {
                                            sql:"update minutes_user set money=money+"+parseFloat(price)+" where id="+req.body.userId
                                        },function(eeee,rrrr){
                                            console.log(eeee,rrrr);
                                        }
                                    );
                                    res.dump('ok',{
                                        distance:distance,
                                        time:time,
                                        price:price,
                                        fromUserId:rr[0].fromUserId,
                                        toUserId:req.body.userId,
                                        originX:rr[0].originX,
                                        originY:rr[0].originY,
                                        destinationX:req.body.destinationX,
                                        destinationY:req.body.destinationY,
                                    });

                                }else{
                                    res.dump('noCurrentOrder');
                                }

                            }
                        }
                    );
                }else{
                    res.dump('noCurrentOrder');
                }
            }
        }
    );



};


order.toScore = function(req,res){

    if(!req.body.orderId){
        res.dump('noOrderId');
        return;
    }

    if(!req.body.score){
        res.dump('noScore');
        return;
    }else if(req.body.score<=0){
        res.dump('scoreMustGt0');
        return;
    }

    conn.query(
        {
            sql:"select * from minutes_order where id="+req.body.orderId
        },function(eee,rrr){
            if(eee){
                res.log(eee);
                res.dump('mysqlError');
                return;
            }
            if(rrr.length>0){

                if(rrr[0].toScore>0){
                    res.dump('orderHasScore');
                }else if(rrr[0].fromUserId!=req.body.userId){
                    res.dump('notYourOrder');

                } else if(rrr[0].status==2){
                    conn.query(
                        {
                            sql:"update minutes_order set toScore="+req.body.score+" where id="+req.body.orderId+" and toUserId="+rrr[0].toUserId
                        },function(e,r){

                            if(e){
                                res.log(e);
                                res.dump('mysqlError');
                            }else{

                                conn.query(
                                    {
                                        sql:"select count(id) from minutes_order where toUserId="+rrr[0].toUserId+" and status=2 and toScore!=0"
                                    },function(ee,rr){
                                        //console.log(ee,rr);

                                        if(ee){
                                            res.log(e);
                                            res.dump('mysqlError');
                                        }else{

                                            conn.query(
                                                {
                                                    sql:"select toScore from minutes_user where id="+rrr[0].toUserId
                                                },function(eeeee,rrrrr){

                                                    if(eeeee){
                                                        res.log(eeeee);
                                                        res.dump('mysqlError');
                                                        return;
                                                    }else {

                                                        var toUserScore = ((rr[0]['count(id)']*rrrrr[0].toScore+parseFloat(req.body.score))/(rr[0]['count(id)']+1));
                                                        conn.query(
                                                            {
                                                                sql: "update minutes_user set toScore=" + toUserScore + " where id=" + rrr[0].toUserId
                                                            }, function (eeee, rrrr) {
                                                                if (eeee) {
                                                                    res.log(eeee);
                                                                    res.dump('mysqlError')
                                                                } else {
                                                                    res.dump('ok');
                                                                }
                                                            }
                                                        )
                                                    }

                                                }
                                            )
                                        }
                                    }
                                )

                            }
                        }
                    )

                }else{
                    res.dump('orderNotComplete');
                }



            }else{
                res.dump('noOrder');

            }
        }
    );
};

/**
 * 对下单人进行评价
 * @param req
 * @param res
 */

order.fromScore = function(req,res){
    if(!req.body.orderId){
        res.dump('noOrderId');
        return;
    }

    if(!req.body.score){
        res.dump('noScore');
        return;
    }else if(req.body.score<=0){
        res.dump('scoreMustGt0');
        return;
    }

    conn.query(
        {
            sql:"select * from minutes_order where id="+req.body.orderId
        },function(eee,rrr){
            if(eee){
                res.log(eee);
                res.dump('mysqlError');
                return;
            }
            if(rrr.length>0){

                if(rrr[0].fromScore>0){
                    res.dump('orderHasScore');
                }else if(rrr[0].toUserId!=req.body.userId){
                    res.dump('notYourOrder');

                } else if(rrr[0].status==2){
                    conn.query(
                        {
                            sql:"update minutes_order set fromScore="+req.body.score+" where id="+req.body.orderId+" and fromUserId="+rrr[0].fromUserId
                        },function(e,r){

                            if(e){
                                res.log(e);
                                res.dump('mysqlError');
                            }else{

                                conn.query(
                                    {
                                        sql:"select count(id) from minutes_order where fromUserId="+rrr[0].fromUserId+" and status=2 and fromScore!=0"
                                    },function(ee,rr){
                                        //console.log(ee,rr);

                                        if(ee){
                                            res.log(e);
                                            res.dump('mysqlError');
                                        }else{

                                            conn.query(
                                                {
                                                    sql:"select fromScore from minutes_user where id="+rrr[0].fromUserId
                                                },function(eeeee,rrrrr){

                                                    if(eeeee){
                                                        res.log(eeeee);
                                                        res.dump('mysqlError');
                                                        return;
                                                    }else {

                                                        var fromUserScore = ((rr[0]['count(id)']*rrrrr[0].fromScore+parseFloat(req.body.score))/(rr[0]['count(id)']+1));
                                                        conn.query(
                                                            {
                                                                sql: "update minutes_user set fromScore=" + fromUserScore + " where id=" + rrr[0].fromUserId
                                                            }, function (eeee, rrrr) {
                                                                if (eeee) {
                                                                    res.log(eeee);
                                                                    res.dump('mysqlError')
                                                                } else {
                                                                    res.dump('ok');
                                                                }
                                                            }
                                                        )
                                                    }

                                                }
                                            )
                                        }
                                    }
                                )

                            }
                        }
                    )

                }else{
                    res.dump('orderNotComplete');
                }



            }else{
                res.dump('noOrder');

            }
        }
    );
};

order.list = function(req,res){
    var page,pageSize,sql,start,end;

    if(!req.query.page){
        page = 1;
    }else{
        page = req.query.page;
    }

    if(!req.query.pageSize){
        pageSize = 15;
    }else{
        pageSize=req.query.pageSize;
    }

    start = (page-1)*pageSize;

    end = pageSize;

    if(!req.query.type){
         sql="select * from minutes_order where fromUserId="+req.query.userId +" or toUserId="+req.query.userId+" order by id desc limit "+start+","+end;
    }else if(req.query.type=='server'){
        sql="select * from minutes_order where  toUserId="+req.query.userId+" order by id desc limit "+start+","+end;

    }else{
        sql="select * from minutes_order where fromUserId="+req.query.userId+" order by id desc limit "+start+","+end;

    }



    conn.query(
        {
            sql:sql
        },function(e,r){


            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{

                if(r.length>0){

                    var users =  [];
                    for(var i=0;i< r.length;i++){
                        users.push(r[i].fromUserId);
                        users.push(r[i].toUserId);
                    }

                    var user = users.join(',');

                    conn.query(
                        {
                            sql:"select * from minutes_user where id in ("+user+")"
                        },function(ee,rr){
                            if(ee){
                                res.log(ee);
                                res.dump(ee);
                            }else{


                                var userinfo={};

                                for(var i=0;i<rr.length;i++){
                                    userinfo[rr[i].id]={
                                        nickname:rr[i].nickname,
                                        tel:rr[i].tel,
                                        gender:rr[i].gender
                                    }
                                }

                                var data =[];

                                var status ={
                                    '0':"已匹配",
                                    '1':"已开始服务",
                                    "2":"已完成",
                                    "3":"用户已取消",
                                    "4":"接单人已取消"
                                };
                                for(var i=0;i< r.length;i++){

                                    data.push(
                                        {
                                            orderId:r[i].id,
                                            fromUserId:r[i].fromUserId,
                                            fromNickName:userinfo[r[i].fromUserId].nickname,
                                            fromTel:userinfo[r[i].fromUserId].tel,
                                            fromGender:userinfo[r[i].fromUserId].gender,
                                            toUserId:r[i].toUserId,
                                            toNickName:userinfo[r[i].toUserId].nickname,
                                            toTel:userinfo[r[i].toUserId].tel,
                                            toGender:userinfo[r[i].toUserId].gender,
                                            price:r[i].price,
                                            createAt:r[i].createAt,
                                            startAt:r[i].startAt,
                                            finishAt:r[i].finishAt,
                                            originX:r[i].originX,
                                            originY:r[i].originY,
                                            destinationX:r[i].destinationX,
                                            destinationY:r[i].destinationY,
                                            status:status[r[i].status]

                                        }
                                    )

                                }


                                res.dump('ok',data);
                            }
                        }
                    )




                }else{

                    res.dump('ok',[]);
                }
            }
        }
    )
};

order.detail = function(req,res){


    if(!req.query.orderId){
        res.dump('noOrderId');
        return;
    }


    conn.query(
        {
            sql:"select * from minutes_order where id="+req.query.orderId
        },function(e,r){

            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{
                if(r.length>0){


                    if(r[0].fromUserId==req.query.userId || r[0].toUserId == req.query.userId){


                        conn.query(
                            {
                                sql:"select * from minutes_user where id in ("+r[0].fromUserId+","+r[0].toUserId+")"
                            },function(ee,rr){
                                if(ee){
                                    res.log(ee);
                                    res.dump(ee);
                                }else{


                                    var userinfo={};

                                    for(var i=0;i<rr.length;i++){
                                        userinfo[rr[i].id]={
                                            nickname:rr[i].nickname,
                                            tel:rr[i].tel,
                                            gender:rr[i].gender
                                        }
                                    }

                                    var data =[];

                                    var status ={
                                        '0':"已匹配",
                                        '1':"已开始服务",
                                        "2":"已完成",
                                        "3":"用户已取消",
                                        "4":"接单人已取消"
                                    };






                                    res.dump('ok',{
                                        orderId:r[0].id,
                                        fromUserId:r[0].fromUserId,
                                        fromNickName:userinfo[r[0].fromUserId].nickname,
                                        fromTel:userinfo[r[0].fromUserId].tel,
                                        fromGender:userinfo[r[0].fromUserId].gender,
                                        toUserId:r[0].toUserId,
                                        toNickName:userinfo[r[0].toUserId].nickname,
                                        toTel:userinfo[r[0].toUserId].tel,
                                        toGender:userinfo[r[0].toUserId].gender,
                                        price:r[0].price,
                                        createAt:r[0].createAt,
                                        startAt:r[0].startAt,
                                        finishAt:r[0].finishAt,
                                        originX:r[0].originX,
                                        originY:r[0].originY,
                                        destinationX:r[0].destinationX,
                                        destinationY:r[0].destinationY,
                                        status:status[r[0].status]
                                    });
                                }
                            }
                        )


                    }else{
                        res.dump('notYourOrder');
                    }


                }else{

                    res.dump('noOrder');
                }
            }
        }
    )

};



module.exports = order;