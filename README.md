# 分分钟项目后端API


## 提供最后3公里的跑腿服务

### API接口说明

接口规范：

1.返回的数据格式统一为json格式
2.返回的数据格式统一为
	
	{
	code:200,  //数字代码,200为成功,其他为错误情况
	description:"ok", //英文描述 ok 为成功
	message:"成功", //中文描述
	data:{} //返回的数据,有的时候为数组
	}
	
3.调用需要登录验证接口均需传入参数```{userId:1,token:"xxxxxxxxxx"}```




具体接口列表：

> 用户管理模块

1. 获取验证码接口
	
		{
		url:"/api/valid",
		methods:"POST",
		params:{
		tel:18613227075 //电话号码
		},
		return:{
		{
	    "code": 200,
	    "description": "ok",
	    "message": "成功",
	    "data": {
	        "isUser": true //是否已完善资料(是否注册,已注册为true,未注册为false)
	    }
		}
		}
		}

2. 登录接口


		{
		url:"/api/signin",
		methods:"POST",
		params:{
		tel:18613227075, //电话号码
		code:123456  //验证码
		},
		return:{
			{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "tel": "18613227075", //电话
		        "nickname": "小明", //昵称
		        "gender": 1,  //0为未知,1为男性,2为女性
		        "fromScore": 0,  //作为下单人的身份的平均评分
		        "toScore": 0,    //作为接单人的身份的评价评分
		        "createAt": 1436095947,  //注册时间
		        "token": "860ad56085813a9c914123c66cf61a9a", //验证是否登录的token,永久有效,请妥善保存,手动退出后无效
		        "type": 0  //用户当前身份,0为未选择，1为下单人，2为接单人
		    }
		}
		}

		}


4. 退出接口

		{
		url:"/api/logout",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}

		}


5. 获取个人信息接口

		{
		url:"/api/userinfo",
		methods:"GET",
		params:{
		"userId":1,
		"token":"debug",

		},
		return:{
		{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "id": 1,
		        "tel": "18613227075",
		        "nickname": "小明plus",
		        "gender": 1,
		        "createAt": 1436089167, //注册时间
		        "fromScore": 0,
		        "toScore": 0
		    }
		}		}

		}


6. 修改个人信息接口

		{
		url:"/api/complete",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"nickname":"小明",
		"gender":1 //1为男性，2为女性
		},
		return:{
		{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}
		}


7. 选择身份接口

		{
		url:"/api/switch",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"type":1 //1为下单人，2为接单人

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}


> 用户钱包管理模块

8. 充值接口

		{
		url:"/api/pay",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"money":21  //要充值的钱数

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}


9. 余额查询接口

		{
		url:"/api/money",
		methods:"GET",
		params:{
		"userId":1,
		"token":"debug",

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "money": 2222  //剩余的钱数
		    }
		}		
		}


> 接单人状态管理模块

1. 接单人上线

		{
		url:"/api/enable",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"x":3022222.22, //接单人的实时位置,需转为摩卡托坐标的x
		"y":11022222.22 //接单人的实时位置,需转为摩卡托坐标的y
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}


2. 接单人下线

		{
		url:"/api/disable",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}



> 订单处理模块

5. 下单接口（订单处理）

		{
		url:"/api/order",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
        "x":100,
        "y":100
		},
		return:
			{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "orderId": 13,
		        "toUserId": "4",
		        "toUserNickname": "小花",
		        "toUserTel": "18613227074",
		        "toUserGender": 2,
		        "toUserToScore": 5
		    }
		}
		}


6. 开始订单接口

		{
		url:"/api/order/start",
		methods:"POST",
		params:{
		"userId":4,
		"token":"debug",
		"orderId":13,  //订单id
		"x":100 //开始行程的墨卡托坐标x
		"y":100 //开始行程的摩卡托坐标y

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}
		
		


7. 完成订单接口

		{
		url:"/api/order/finish",
		methods:"POST",
		params:{
		"userId":4,
		"token":"debug",
		"orderId":13,
		"x":400,
		"y":500
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "distance": 500,  //本次行程距离，单位m
		        "time": 64,		//本次行程所花时间，单位s
		        "price": 1.5, //本次行程的所花费用，单位元
		        "fromUserId": 1,  //下单人id
		        "toUserId": 4,    //接单人id	
		        "originX": 100,  //出发地点x
		        "originY": 100,		//出发地点y
		        "destinationX": 400, //目的地点x
		        "destinationY": 500,	//目的地点y
       			 	}
        		}		
        }


8. 下单人取消订单接口

		{
		url:"/api/order/from/cancel",
	    methods:"POST",
	    params:{
		"userId":1,
		"token":"debug",
		"orderId":1 //订单编号
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}

8. 接单人取消订单接口

		{
		url:"/api/order/to/cancel",
	    methods:"POST",
	    params:{
		"userId":1,
		"token":"debug",
		"orderId":1
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}

10. 获取接单人当前位置

		{
		url:"/api/location",
		methods:"GET",
		params:{
		"userId":1,
		"token":"debug",
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "x": "102",
		        "y": "101"
		    }
		}
		}


11. 发送接单人当前位置

		{
		url:"/api/location",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"x":100,
		"y":100

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}


12. 下单人给某一订单评分接口

		{
		url:"/api/score/to",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"orderId":10,
		"score":5 //必须大于0，小于5
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}

12. 接单人给某一订单评分接口

		{
		url:"/api/score/from",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"orderId":10,
		"score":5 //必须大于0，小于5
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}


12. 获取历史订单列表

		{
		url:"/api/order/list",
		methods:"GET",
		params:{
		"userId":1,
		"token":"debug",

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data":  [
		        {
		            "orderId": 22,
		            "fromUserId": 1,  //下单人id
		            "fromNickName": "小明",  //下单人昵称
		            "fromTel": "18613227075",
		            "fromGender": 1,
		            "toUserId": 4,
		            "toNickName": "小花",
		            "toTel": "18613227074",
		            "toGender": 2,
		            "price": 1.5,
		            "createAt": 1436169590,
		            "startAt": 1436169997,
		            "finishAt": 1436170006,
		            "originX": 100,
		            "originY": 100,
		            "destinationX": 400,
		            "destinationY": 500,
		            "status": "已完成"
		        },
		        {
		            "orderId": 21,
		            "fromUserId": 1,
		            "fromNickName": "小明",
		            "fromTel": "18613227075",
		            "fromGender": 1,
		            "toUserId": 4,
		            "toNickName": "小花",
		            "toTel": "18613227074",
		            "toGender": 2,
		            "price": 1.5,
		            "createAt": 1436168629,
		            "startAt": 1436168641,
		            "finishAt": 1436168644,
		            "originX": 100,
		            "originY": 100,
		            "destinationX": 400,
		            "destinationY": 500,
		            "status": "已完成"
		        },
		        {
		            "orderId": 20,
		            "fromUserId": 1,
		            "fromNickName": "小明",
		            "fromTel": "18613227075",
		            "fromGender": 1,
		            "toUserId": 4,
		            "toNickName": "小花",
		            "toTel": "18613227074",
		            "toGender": 2,
		            "price": 1.5,
		            "createAt": 1436167779,
		            "startAt": 1436167787,
		            "finishAt": 1436167792,
		            "originX": 100,
		            "originY": 100,
		            "destinationX": 400,
		            "destinationY": 500,
		            "status": "已完成"
		        }
		    ]
		}
		}


13. 获取某订单详情

		{
		url:"/api/order/detail",
		methods:"GET",
		params:{
		"userId":1,
		"token":"debug",
		"orderId":2
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "orderId": 5,
		        "fromUserId": 1,
		        "fromNickName": "小明",
		        "fromTel": "18613227075",
		        "fromGender": 1,
		        "toUserId": 4,
		        "toNickName": "小花",
		        "toTel": "18613227074",
		        "toGender": 2,
		        "price": 0.0743333,
		        "createAt": 1436159908,
		        "startAt": 0,
		        "finishAt": 1436159949,
		        "originX": 100,
		        "originY": 100,
		        "destinationX": 103,
		        "destinationY": 104,
		        "status": "已完成"
		    }
		}		}



> APP管理模块

14. 获取系统基本信息

		{
		url:"/api/system",
		methods:"GET",
		return:{
	 		{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": {
		        "version": "0.0.1",
		        "weight": 0.7,
		        "distance": 1.2,
		        "time": 0.1,
		        "data": {},
		        "updateAt": 1436097999
		    }
	    }
		}
		}

