var common ={

};


common.time = function(){
    return parseInt(new Date().getTime()/1000)
};

/**
 * 获取当天的星期数
 */
common.getWeek = function()
{
    return new Date().getDay();
};



common.date = function (time) {
    if(time){
        return new Date(time).getFullYear().toString()+"-"+(new Date(time).getMonth()+1).toString()+"-"+new Date(time).getDate(time).toString()+" "+new Date(time).getHours().toString()+":"+new Date(time).getMinutes().toString()

    }
    return new Date().getFullYear().toString()+"-"+(new Date().getMonth()+1).toString()+"-"+new Date().getDate().toString()+" "+new Date().getHours().toString()+":"+new Date().getMinutes().toString()
};


common.getDistance = function(x1,y1,x2,y2){

    return Math.sqrt((Math.abs(parseInt(x1)-parseInt(x2)))*(Math.abs(parseInt(x1)-parseInt(x2)))+(Math.abs(parseInt(y1)-parseInt(y2)))*(Math.abs(parseInt(y1)-parseInt(y2))))
};

module.exports = common;