//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
		films:[],
		scrollHeight: 0,
		
		// 控制分页（展示数量）
		offset: 3,
		limit: 3
  },
  onLoad: function () {
    var _this = this
		
		//加载电影
		this.loadFilms()
		
		//获取滚动的高度
		wx.getSystemInfo({
			 success(res){
				 _this.setData({
					 scrollHeight: res.windowHeight
				 })
				 //console.log(res.windowHeight)
			 }
		})
		
  },
	//获取电影数据json
	loadFilms: function(){
		var _this = this
		wx.request({
			url: "http://192.168.95.1/learning/wxone/movie/pages/index/movies.json",
			data: {
				type: "movies",
				offset: this.data.offset,
				limit: 3
			},
			method: "GET",
			header: {
					'content-type': 'application/json'
			},
			success: function(res) {
				var films = _this.data.films
				films = films.concat(res.data.movies);
				_this.setData({
					films: films,
					offset: _this.data.offset + 3
				})
			}
		})
	},
	//调整到搜索
	bindLogs: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
	//滑动到底部
	lower(e){
		console.log("a")
   	//this.loadFilms()
  },
	//查看详情
	bindDetail:function(e){
		var uid = e.currentTarget.dataset.id
    wx.navigateTo({
			url: "../detail/detail?id=" + uid
		})
  }
	
	
})
