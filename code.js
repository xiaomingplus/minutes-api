var code  = {

    'ok':{
        code:200,
        message:"成功"
    },
    'notLogin':{
        code:1001,
        message:"没有登录"
    },
    'mysqlError':{
        code:1002,
        message:"数据库错误"
    },
    'hasLogin':{
        code:1003,
        message:"已登录"
    },
    'requestError':{
        code:1004,
        message:"请求错误"
    },
    'noTel':{
        code:1005,
        message:"缺少参数 tel"
    },
    'sendSmsError':{
        code:1006,
        message:"发送短信失败"
    },
    'noCode':{
        code:1007,
        message:"请填写验证码"
    },
    'validError':{
        code:1008,
        message:"验证码错误"
    },
    'noNickname':{
        code:1009,
        message:"缺少参数 nickname"
    },
    'noGender':{
        code:1010,
        message:"缺少参数 gender"
    },
    'tokenError':{
        code:1011,
        message:"token无效"
    },
    'noUser':{
        code:1012,
        message:"没有该用户"
    },
    'noType':{
        code:1013,
        message:"缺少参数 type"
    },
    'noMoney':{
        code:1014,
        message:"缺少参数 money"
    },
    'mustServer':{
        code:1015,
        message:"请将身份切换为接单人"
    },
    'noLatitude':{
        code:1016,
        message:"缺少参数 latitude"
    },
    'noLongitude':{
        code:1017,
        message:"缺少参数 longitude"
    },
    'noFree':{
        code:1018,
        message:"该接单人不在空闲状态"
    },
    'mustConsumer':{
        code:1019,
        message:"请将身份切换为下单人"
    },
    'mustCompleteCurrentOrder':{
        code:1020,
        message:"请先完成当前的订单"
    },
    'noServer':{
        code:1021,
        message:"附近没有空闲的接单人"
    },
    'noX':{
        code:1022,
        message:"缺少参数 x"
    },
    'noY':{
        code:1023,
        message:"缺少参数 y"
    },
    'noOriginX':{
        code:1023,
        message:"缺少参数 originX"
    },
    'noOriginY':{
        code:1024,
        message:"缺少参数 originY"
    },
    'noOrderId':{
        code:1025,
        message:"缺少参数 orderId"
    },
    'noCurrentOrder':{
        code:1026,
        message:"没有正在进行的订单"
    },
    'noDestinationX':{
        code:1027,
        message:"缺少参数 destinationX"
    },
    'noDestinationY':{
        code:1028,
        message:"缺少参数 destinationY"
    },
    'noPositionX':{
        code:1029,
        message:"缺少参数 positionX"
    },
    'noPositionY':{
        code:1030,
        message:"缺少参数 positionY"
    },
    'WalletError':{
        code:1031,
        message:"钱包异常"
    },
    'moneyDept':{
        code:1032,
        message:"您有欠款未还请,请先充值"
    },
    'serverHasOffline':{
        code:1033,
        message:"接单人已下线"
    },
    'noScore':{
        code:1034,
        message:"缺少参数 score"
    },
    'noOrder':{
        code:1035,
        message:"没有此订单"
    },
    'orderNotComplete':{
        code:1036,
        message:"该订单没有完成或已被取消"
    },
    'orderHasScore':{
        code:1037,
        message:"您已经评价过该订单了"
    },
    'scoreMustGt0':{
        code:1038,
        message:"评分必须大于0"
    },
    'notYourOrder':{
        code:1039,
        message:"不是你的订单"
    }


};


module.exports = code;