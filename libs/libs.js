var request = require('request');
var code = require('../code.js');
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
)
    console.log(tel+'短信验证码:'+code);
    //cb(null);

};

libs.getCode = function(){
    return Math.floor(Math.random() *777777  + 152718);

    //return 123456;
};



module.exports = libs;