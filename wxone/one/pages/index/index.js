//index.js

//require
var logs = require('../logs/sayHello.js')
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp();
var newNum = app.globalData2 + 5
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
			name: 'USA',
			value: '美国',
			checked: true
			},{
			name: 'CHINA',
			alue: '中国'
		}],
		index: 2,
		country:[
			'美国',
			'中国',
			'巴西',
			'日本'
		],
		animationData: {},
		object:{
			text:"init data"
		},
		array: ['a','b','c'],
		newGlobalData: newNum
  },  
	onShow: function(){
		
		
		//创建动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.scale(2,2).rotate(45).step()

    this.setData({
      animationData:animation.export()
    })
		
		setTimeout(function(){
				this.rotateAndScale()
		}.bind(this),1000)

//    setTimeout(function() {
//      animation.translate(130).step()
//      this.setData({
//        animationData:animation.export()
//      })			
//    }.bind(this), 1000)
  },
	changeTextInObj: function(){
		this.setData({
			"object.text": "new data2",
			"array[0]": "aa"
		})
		console.log(this.data.array)
		
	},
	rotateAndScale: function () {		
    // 旋转同时放大
    this.animation.translate(130).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //picker
  bindPickerChange: function(e) {
    this.setData({
			index: e.detail.value
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
  //跳转showActionSheet
  bindOpen: function() {
    wx.showActionSheet({
      itemList: ['a','b','c','d'],
			success:function(res){
				if(res.tapIndex == 0){
					wx.navigateTo({
							url: '../logs/logs'
					})
				}
				console.log(res.tapIndex)
			}
    })
  },
  //模态框
  bindModal: function() {
    wx.showModal({
      title: "提示",
			content: "这是一模态框",
			showCancel: false,
			success: function(res){
				if(res.confirm){
					console.log("点击了确认框")
				}
			}
    })
  },
  //隐藏键盘
  hideKeyboard: function(e) {
		if(e.detail.value == '123'){
			console.log("111")
			wx.hideKeyboard()
		}
  },
  switch1Change: function(e) {
		console.log(e.detail.value)
    
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
		util.sayBye("John")
		logs.sayHello("John")
		
		wx.showNavigationBarLoading()
		var that = this
		
		//调用应用实例的方法获取全局数据--用户信息
		app.getUserInfo(function(userInfo){
			//更新数据
			that.setData({
				userInfo:userInfo
			})
		})
	}
})
