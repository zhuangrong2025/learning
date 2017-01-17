//detail.js

Page({
  data: {
    hideText: true,
		switchClass: true
  },
  onLoad: function (params) {
    var _this = this,
				id = params.id,
		    url = 'https://m.maoyan.com/movie/' + id + '.json'
		
		//加载中
		wx.showToast({
			title: "加载中...",
			icon: "loading",
			duration: 10000
		})
		
		//获取数据
		wx.request({
			url: url,
			success:function(res){
					//console.log(res.data)
				wx.hideToast()
				var detail = res.data.data.MovieDetailModel,
						comment = res.data.data.CommentResponseModel.hcmts.splice(0,3)
				//替换所有的p标签
				detail.dra = detail.dra.replace(/(<p>)|(<\/p>)/g,'');
				
				_this.setData({
					detail: detail,
					comment: comment
				})
			}
		})
  },
	//展开详情
	bindExpand: function(){
		var hideText = this.data.hideText,
				switchClass = this.data.switchClass
		this.setData({
			hideText: !hideText,
			switchClass: !switchClass
		})
	}
})
