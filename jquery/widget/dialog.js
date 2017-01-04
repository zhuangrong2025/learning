"use strict";
var _tpl = require('fs').readFileSync(__dirname + "/tpl/dialog/tpl.html", 'utf8'),
	componentBase = require("../componentBase"),
	dlgDrag = require("./dialog-drag"),
	utils = componentBase.utils;
/**
 * @class Dialog
 * @extends componentBase
 * 对话框组件.
 */	
var Dialog = componentBase.extend({
	$tpl: _tpl,
	constructor: function() {
		var _this = this, dialogId = "dlg_" + utils.guid();
		this.dialogId = dialogId;
		this.$el = $("<div>").attr("id", dialogId + "_proxy").appendTo($("body")).get(0),
		this._$el = $(this.$el),
		componentBase.apply(this, arguments);
	},
	$beforeInit: function() {
		var _this = this;
		this.dialogId = this.id || this.dialogId;
		this.showButtons && (this.showButtons = this.buttons.length == 0 ? false : true);
		
	},
	$afterInit: function() {
		var _this = this;
		this.$dialog = this._$el.find(".xy-dialog");
		this.$dialog.data("dialogId", this.dialogId);
		this.draggable && this.enableDrag()
	},
	requestContent : function() {
		var _this = this,
			url = this.url;
		url += (url.indexOf('?') == -1 ? "?" : "&") + "t="  + Math.random();
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'html',
			success: function(data, status, xhr){
				_this.$set("content", data);
				_this.$set("loaded", true);
				_this.position("center");
				_this.$emit("afterrender", _this);
			}
		});
	},
	updateContent : function(c) {
		this.$set("content", c);
	},
	setTitle : function(title) {
		this.$set("title", title);
	},
	show: function() {
		var _this = this;
		this.$set("popup", !0)
		this.$set("animateCls", "modal-in");
		!this.url && setTimeout(function() {
			_this.onload && _this.onload.call(_this);
		}, 0);
		this.url && !this.$get("loaded") && this.requestContent(); //: this.$emit("afterrender", this);
		this.position("center");
		this.$emit("open", this);
	},
	hide: function() {
		if ( this.$emit("beforeclose", this) === false ){
			return false;
		}
		this.$set("animateCls", "modal-out");
		var _this = this;
		setTimeout(function() {
			_this.$set("popup", !1)
		}, 100);
		this.$emit("close", this);
	},
	enableDrag : function() {
		dlgDrag.enableDrag(this.dialogId, this);
	},
	find : function(s) {
		return this.$dialog.find(s);
	},
	getBody : function() {
		return this.$dialog.find(".dialog-body");
	},
	getHeader : function() {
		return this.$dialog.find(".dialog-header");
	},
	getFooter : function() {
		return this.$dialog.find(".dialog-footer");
	},
	position : function (p, t) {
		//位置定义
		var pos = {
			top : "auto",
			bottom : "auto",
			left : "auto",
			right : "auto"
		};
		//计算pos位置
		if( "center" === p ){ //居中位置
			this.dialogWidth = this.$dialog.outerWidth(), 
			this.dialogHeight = this.getBody().outerHeight() + this.getHeader().height() + this.getFooter().height(); 
			var h = $(window).height(),
			w = $(window).width();
			pos = $.extend(pos, {
					top : (h - this.dialogHeight) / 2 - 50,
					left : (w - this.dialogWidth) / 2,
					bottom : "auto",
					right : "auto"
				}),
			pos.top < 0 && (pos.top = 0);	
		} else {// 自定义拖动位置
		    pos = $.extend(pos, p);
		}
		this.$dialog.css(pos), void 0 === this.hasInitialPosition && (this.hasInitialPosition = pos); 
	},
	_findBtnConf : function(index) {
		var btnConf = null;
		this.buttons.forEach(function(btn, i) {
			if(i == index) btnConf = btn;
		});
		return btnConf;
	},
	getButton : function(index) {
		return this.$dialog.find(".dialog-footer .xy-btn").eq(index);
	},
	$events: {
		"click .dialog-footer>.xy-btn": function(evt) {
			var $index = $(evt.target).attr("data-order"),
				btn = this._findBtnConf($index),
				_scope = btn.scope || this;
			btn.handler && utils.isFunction(btn.handler) &&  btn.handler.call(_scope);
		},
		"click .dialog-header .close" : function(evt) {
		
			this.hide();
			
		}
	}
},
{
	defaults: {
		popup: !1,	//对话框是否打开
		maxHeight: "auto", //最大高度
		width: "auto",
		theme : "", //默认为灰色，支持黑色样式
		height: "auto",	//高度
		minHeight: "auto", //最小高度
		content: null,
		draggable : true,
		closable: true,
		showButtons : true, //默认显示按扭
		/**
		 *  按扭定义
		 *	{name : "ok", title : "确定", cls : "primary", handler : fn }
		 *	{name : "cancel", title : "取消", handler : this.hide}
		 *
		 */
		buttons : []
	}
});
module.exports = Dialog
