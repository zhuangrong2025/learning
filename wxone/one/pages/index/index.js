//index.js
//获取应用实例
var app = getApp();
var initData = 'this is first line'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
		icons: [{
			size: 30,
			color: 'blue'
		},{
			size: 50,
			color: 'red'
		}],
		iconType: ['success', 'info', 'warn', 'waiting', 'safe_success'],
		iconSize: [20, 30, 50, 70, 90],
		iconColor: ['red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple', '#666'],
		text: initData,
		extraline: [],
		inputVal: '',
		items: [{
			name: 'USA', value: '美国', checked: true
			},{
			name: 'CHINA', value: '中国'
		}]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //输入并显示
  getvalue: function(e) {
    this.setData({
			inputVal: e.detail.value
		})
  },
  //跳转
  navTo: function(e) {
    var agrs ='我是参数';
    wx.navigateTo({
        url: '../logs/logs?order=' + agrs
    })
  },
  //隐藏键盘
  hideKeyboard: function(e) {
		if(e.detail.value == '123'){
			console.log("111")
			wx.hideKeyboard()
		}
    
  },
  add: function() {
	  this.data.extraline.push("other line")
		console.log(this.data.extraline)
    this.setData({
      text: initData + '\n' + this.data.extraline.join('\n')
    })
		console.log(this.data.text)
  },
  checkboxChange: function(e) {
		console.log(e.detail.value)
  },
	bindReplaceInput:function(e){
			var value = e.detail.value;
			var pos = e.detail.cursor;
			if(pos != -1){
				//光标在中间
				var left = e.detail.value.slice(0,pos);
				//计算光标的位置
				pos = left.replace(/11/g,'2').length;
			}

			//直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
			return {
				value:value.replace(/11/g,'2'),
				cursor:pos
			}
	 	},
  	onLoad: function () {
			console.log('onLoad')
			var that = this
			//调用应用实例的方法获取全局数据
			app.getUserInfo(function(userInfo){
				//更新数据
				that.setData({
					userInfo:userInfo
				})
			})
		}
})
