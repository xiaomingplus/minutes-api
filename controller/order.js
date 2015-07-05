var datas = require('../datas.js');
var common = require('../libs/common.js');
var config = require('../config.js');
var order = {

};


order.enable = function(req,res){

    if(!req.body.longitude){
        res.dump('noLongitude');
        return;
    }

    if(!req.body.latitude){
        res.dump('noLatitude');
        return;
    }

    datas.enable(req.body.userId,'free',{
        longitude:req.body.longitude,
        latitude:req.body.latitude
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


order.start  = function(req,res){

    conn.query(
        {
            sql:"select * from minutes_order where userId="+userId+" and status<=1"
        },function(e,r){
            if(e){
                res.log(e);
                res.dump('mysqlError');
            }else{
                if(r.length>0){
                    res.dump('mustCompleteCurrentOrder');
                }else{
                    var servers = [];
                    for(var i in datas.location.free){
                        var distance = common.getDistance(req.body.originX,req.body.originY,datas.location.free[i].x,datas.location.free[i].y);
                        if(distance<config.maxDistance){
                            servers.push(distance);
                        }
                    }

                    if(servers.length==0){
                        res.dump('noServer');
                    }else{
                       var minDistance =  Math.min.apply(null,servers);

                        conn.query(
                            {
                                sql:"insert into minutes_order (fromUserId,createAt,originLongitude,originLatitude) values (" +
                                ""+req.body.userId+","+common.time()+","+req.body.originX+","+req.body.originY+")"
                            },function(ee,rr){

                                if(ee){
                                    res.log(ee);
                                    res.dump('mysqlError');
                                }

                            }
                        );

                    }



                }
            }
        }
    )

};

module.exports = order;