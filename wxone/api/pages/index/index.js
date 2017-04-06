//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
		newInfo: ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
		
		//调用getInfo中取到的值
		this.getInfo(function(info){
			that.setData({
				newInfo: info
			})
			console.log(that.data.newInfo)
		})
		
  },
	getInfo:function(cbb){
		var _this = this
		if(this.newData.info){
			console.log("y")
			typeof cbb == "function" && cbb(this.newData.info)
			
		}else{
				console.log("n")
		}
	},
	newData: {
		info: "aaabb"
	}
})
