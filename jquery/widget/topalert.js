"use strict";
var MsgPanel = require("./msgpanel"), //引用消息提示面板
/**
 * 消息提示组件.
 * @class TopAlert
 * @author zhuxiaojuan
 * <pre>
 *  	var topAlert = new xy.widget.TopAlert();
 *		topAlert.show("warning", "警告提示！", 5e3);  //自定义消息提示，time可为空；time为空，默认为4e3
 *		topAlert.success("保存成功！", 5e3);  //成功消息提示
 *		topAlert.error("保存失败！", 5e3);   //错误消息提示
 *		topalert.showLoading("正在加载");   //显示进度消息提示
 *		topAlert.stopLoading();   //关闭进度消息提示
 * </pre>
 */
TopAlert = (function() {
	var panel = null, //消息提示面板对象
		timer = null, //消息提示计时器
		peiod = 4e3;  //默认时间间隔, 多久消息自动提示消失
	return {
		/**
		 * 初始化消息提示面板.
		 * @method initPanel
		 */
		initPanel : function() {
			panel = new MsgPanel();
		},
		/**
		 * 自定义消息提示.
		 * @method show
		 * @param {String} iconCls  图标样式名
		 * @param {String} text  消息提示文本
		 * @param {int} time  消息提示时长,默认为4秒
		 */
		show: function(iconCls, text, time) {
			!panel && this.initPanel(),
			!time && (time = peiod);
			//清除消息提示计时器
			clearTimeout(timer), 
			panel.show(iconCls, text), 
			timer = setTimeout(function() {panel.hide()}, time)
		},
		/**
		 * 成功消息提示.
		 * @method success
		 * @param {String} text 消息提示文本
		 * @param {int} time 消息提示时长，可为空；
		 */
		success: function(text, time) {
			this.show("success", text, time)
		},
		/**
		 * 错误消息提示.
		 * @method error
		 * @param {String} text 消息提示文本
		 * @param {int} time 消息提示时长，可为空；
		 */
		error: function(text, time){
			this.show("error", text, time)
		},
		/**
		 * 显示进度消息提示.
		 * @method showLoading
		 * @param {String} text 消息提示文本
		 */
		showLoading : function(text) {
			!panel && this.initPanel(),
			panel.show("loading", text)
		},
		/**
		 * 关闭进度消息提示.
		 * @method stopLoading
		 */
		stopLoading : function() {
			panel && panel.hide()
		}
	};
})();
module.exports = TopAlert
