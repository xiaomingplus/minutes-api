var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var code = require('./code.js');
var routes = require('./routes/index');
var datas = require('./datas.js');
var common = require('./libs/common.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    function(req,res,next){
        res.log = function(o){
            console.log(o);
            console.log(new Date());
        };
        next();
    }
);

app.use(function (req,res,next) {
    res.dump = function (name,obj,message) {
        res.setHeader('content-type','application/json; charset=UTF-8');
        res.end(JSON.stringify({
            'code':code[name].code,
            'description':name,
            'message':message?message:code[name].message,
            'data':obj?obj:""
        }));
        return;
    };
    next();
});
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(9871,function(){
    console.log('9871已监听');
});


//setInterval(function(){
//    console.log('删除之前');
//    console.log(datas.location);
//
//    for(var i in datas.code){
//        if((common.time() - datas.code[i].createAt)>300){
//            delete datas.code[i];
//        }
//    }
//
//    console.log('删除之后');
//    console.log(datas.location);
//
//
//
//},10*1000);

datas.loadToken();
datas.loadSetting();

module.exports = app;
