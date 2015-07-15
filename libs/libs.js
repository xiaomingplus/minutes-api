var request = require('request');
var code = require('../code.js');
var datas = require('../datas.js');
var libs = {

};

libs.send = function(tel,code,cb){
    var url = 'http://utf8.sms.webchinese.cn/?Uid=lanhao&Key=2ca5025bb8fddc86a072&smsMob=' + tel +'&smsText='+encodeURIComponent('【分分钟】验证码 ' + code + ',5分钟内有效。特别鸣谢');
console.log(url);
    request.get(
    url,function(e,r){

        if(e){
            console.log(e);
            cb(code.requestError);
        }else{
           //console.log(r.body);
            if(r.body) {
                cb(null);
            }else{
                cb(code.sendSmsError);
            }
        }
    }
);
    console.log(tel+'短信验证码:'+code);
    //cb(null);

};

libs.getCode = function(){
    return Math.floor(Math.random() *777777  + 152718);

    //return 123456;
};

libs.price = function(distance,time){


    var speed = distance/time;

    var moneyMeter;

    if(speed>datas.system.speedMax){
        moneyMeter = datas.system.distanceFast;
    }else if(speed<datas.system.speedMin){
        moneyMeter= datas.system.distanceMin;
    }else{
        moneyMeter= datas.system.distanceSlow;

    }

  return (distance*moneyMeter);
};




module.exports = libs;