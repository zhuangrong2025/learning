//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
		films:[]
  },
  onLoad: function () {
    var _this = this
		
		_this.loadFilms()
		
  },
	//获取电影数据json
	loadFilms: function(){
		var _this = this
		//console.log("request")
		wx.request({
			url: "http://192.168.95.1/learning/wxone/movie/pages/index/index.json",
			success: function(res) {
				//console.log(res.data.movies)
				_this.setData({
					films: res.data.movies
				})
			}
		})
	},
	//调整到logs
	bindLogs: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
	
})
