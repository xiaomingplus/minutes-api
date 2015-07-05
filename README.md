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
		"longitude":30.123414,
		"latitude":110.312313
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

		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}


6. 开始订单接口

		{
		url:"/api/order/start",
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
		
		
7. 是否匹配接口

		{
		url:"/api/order/start",
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



7. 完成订单接口

		{
		url:"/api/order/match",
		methods:"POST",
		params:{
		"userId":1,
		"token":"debug",
		"orderId":10000
		},
		return:{
		    "code": 200,
		    "description": "ok",
		    "message": "成功",
		    "data": ""
		}
		}


8. 用户取消订单接口

		{
		url:"/api/order/from/cancel",
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


9. 接单人取消订单接口

		{
		url:"/api/order/to/cancel",
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
		    "data": ""
		}
		}


11. 发送接单人当前位置

		{
		url:"/api/location",
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


12. 给某一订单评分接口

		{
		url:"/api/score",
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
		    "data": ""
		}
		}


13. 获取某订单详情

		{
		url:"/api/order/detail",
		methods:"GET",
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

