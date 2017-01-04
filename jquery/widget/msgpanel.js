"use strict";
var _tpl = require("fs").readFileSync(__dirname + "/tpl/topalert/tpl.html", "utf-8"), 
	componentBase = require("../componentBase.js"),
	utils = componentBase.utils,
	panelId = "alert_" + utils.guid(); //面板ID
/**
 * 消息提示面板.
 * @class MsgPanel
 * @extend componentBase
 * @author zhuxiaojuan
 * 使用实例如下：
 * <pre>
 * 		var panel = new xy.widget.MsgPanel();  //创建MsgPanel消息面板实例
 *	 	panel.show('success', '保存成功！');  //显示消息面板
 *	 	panel.hide();  //隐藏消息面板
 * </pre>
 */
var MsgPanel = componentBase.extend({
	$tpl: _tpl,    //消息面板模板
	_iconCls: "",  //图标样式名 
	_content: "",  //消息文本内容
	_popup: !1,    //消息是否显示，!1：不显示；!0：显示
	constructor: function() {
		var _this = this;
		//动态创建面板的渲染元素，MsgPanel不依赖于任何Element渲染
		this.$el = $("<div>").attr("id", panelId).appendTo($("body")).get(0); 
		this._$el = $(this.$el);
		componentBase.apply(this, arguments);
	},
	/**
	 * 显示消息提示面板.
	 * @method show
	 * @param {String} iconCls 图标样式名
	 * @param {String} text 消息提示文本
	 */
	show: function(iconCls, text) {
		//设置消息提示面板属性
		this.$set("_content", text), 
		this.$set("_iconCls", iconCls),  
		this.$set("_popup", !0)   
	},
	/**
	 * 隐藏消息提示面板.
	 * @method hide
	 */
	hide: function() {
		this.$set("_popup", !1) 
	}
},
{
	defaults: {}
});
module.exports = MsgPanel
