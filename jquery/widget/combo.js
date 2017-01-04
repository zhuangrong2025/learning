"use strict";
/**
 * 功能：下拉控件模块，具体功能说明请查看模块详细设计说明书
 * 作者：陈国龙
 * 日期：2016/08/12
 */
var _utils = require("../../ecore/utils"),
	_tpl = require('fs').readFileSync(__dirname + "/tpl/combo/tpl.html", 'utf8'),
	_dropdownlist = require("./dropdownlist"),
	_componentBase = require("../componentBase");
var Combo = _componentBase.extend({
	$tpl: _tpl,
	_MODE : {		//控件模式常量(获取数据方式)
		local : 0,	//本地模式
		remote : 1	//远程模式/服务端模式 
	},
	_ERROR : {		//错误常量
		localLoadParamError : {
			code : 400,
			info : "从本地获取数据，调用load方法无效"
		},
		loadDataError : {
			code : 500,
			info : "服务端数据有错"
		}
	},
	constructor: function() {
		var _this = this;
		_componentBase.apply(this, arguments);
		_this._initDropdownlist();
		if(this._mode == this._MODE.remote){
			if(this.$get("autoLoad")){
				setTimeout(function(){
					_this._loadData(_this._params, function(){
						_this.layer.setData(_this.list);
						_this.setValue(_this.value);
					});
				}, 0);
			}
		}else{
			_this.setValue(_this.value);
		}
	},
	$beforeInit: function() {
		if(null == this.url || "" == this.url){
			this._mode = this._MODE.local;
		}else{
			this._mode = this._MODE.remote;
			this.list = []; //初始化数据
		}
		this._popup = !1;
		this._params = $.extend({}, this.params);
		this._selected = null;
	},
	$afterInit: function() {
		var comboJdom = $(this.$el);
		var attr = comboJdom.find(">div>input[input-handler]").attr("el-ref");
		attr = attr.replace(/(^\[)|(\]$)/g, "");
		comboJdom.attr(attr, "");
	},
	//组件销毁时需要同时销毁下拉列表
	$beforeDestroy: function() {
		this.layer && this.layer.$destroy();
	},
	//初始化下拉列表
	_initDropdownlist: function() {
		if(!this.layer) {
			this.layer = new _dropdownlist({
				$data: {
					list: this.list,
					displayField: this.displayField,
					valueField: this.valueField,
					width: this.width,
					listHeight: this.listHeight,
					listMinHeight: this.listMinHeight,
					listMaxHeight: this.listMaxHeight
				}
			});
			var _this = this;
			this.layer.on("show", function(){
				_this.$set("_popup", true)
			});
			this.layer.on("hide", function(){
				_this.$set("_popup", false)
			});
			this.layer.on("beforeselect", function(list, data, index){
				return _this.$emit("beforeselect", list, data, index)
			});
			this.layer.on("select", function(data){
				_this.$replace("_selected", data),
				_this.$emit("select", data)
			});
		}
	},
	_setAttr: function(role) {
		var attrs = {};
		this.name && ""!=this.name?attrs["name"]=this.name:0;
		true===this.required?(
			attrs["required"] = true,
			attrs["data-validator"] = true
		):0;
		return attrs;
	},
	_setStyle: function(role) {
		var style = {};
		this.width && ""!=this.width?style["width"]=this.width:0;
		return style;
	},
	_loadData: function(params, callback){
		if(!this.$emit("beforeload", params)) return;
		var _this = this;
		this.getData.call(null, this.url, params, function(){
			if(arguments && arguments[0] && _utils.isArray(arguments[0])){
				var data = [].slice.call(arguments[0], 0);
				if(!_this.$emit("load", data)) return;
				_this.list = data;
				_this._dataloaded = true;
				callback && _utils.isFunction(callback) && callback();
			}else{
				throw _this._ERROR.loadDataError.code + ":" + _this._ERROR.loadDataError.info
			}
		});
	},
	//控制内部事件
	$events: {
		"click [input-handler]": function(e){
			var _this = this, $target = $(e.target);
				_this._tmpIndex = -1,		//仅用于上下移动
				_this._tmpLastIndex = -1,	//仅用于上下移动
				_this._tmpLastItem = null;	//仅用于上下移动
			var fn = function(){
				if(!_this._popup){
					var listData = _this.layer.getData();
					if(listData && null != _this._selected){
						//查找选中项在 listData 中的下标,优化向上/向下的性能
						setTimeout(function(){
							var res = _this.layer.getItem(listData, _this._selected);
							_this._tmpIndex = res.itemIndex;
							_this.layer.adjustScrollBar(_this._tmpIndex);
						}, 0);
					}
				}
				_this._popup ? _this.layer.hide() : _this.layer.show({
					top : $target.offset().top,
					left : $target.offset().left,
					width : $target.get(0).offsetWidth
				});
			};
			if(this._mode == this._MODE.remote && !this._dataloaded){
				this._loadData(this._params, function(){
					_this.layer.setData(_this.list);
					fn();
				});
			}else{
				fn();
			}
		},
		"click .dropdown-list-mask": function(){
			this.layer.hide()
		},
		"keydown [input-handler]": function(e){
			var targetJdom = $(e.target),
				v = targetJdom.val(),
				_this = this;
			//退格键/删除键：删除选中项
			if(e.keyCode == 8 || e.keyCode == 46){
				this._selected && this.select(null);
				this._tmpIndex = -1;
				this._tmpLastIndex = -1;
				this._tmpLastItem = null;
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
			// 向上 || 向下
			if(e.keyCode == 38 || e.keyCode == 40){
				var x = this._tmpIndex + (e.keyCode == 40 ? 1 : -1),
					listData = this.layer.getData(),
					len =listData.length;
				this._tmpIndex = (0 == len || x >= len) ? -1 : x < -1 ? len-1 : x;
				this._tmpItem = -1==x?null:listData[this._tmpIndex];
				this.$replace("_selected", this._tmpItem);	//临时选择
				this.layer.setSelected(this._tmpItem);		//临时选择
				if(!this._popup){
					this.layer.show({
						top : targetJdom.offset().top,
						left : targetJdom.offset().left,
						width : targetJdom.get(0).offsetWidth
					});
					setTimeout(function(){
						//打开下拉框时模型的响应时间没那么快，需要给模型生成点时间
						_this.layer.adjustScrollBar(_this._tmpIndex);
					}, 50);
				}else{
					this.layer.adjustScrollBar(this._tmpIndex);
				}
				this._timer && clearTimeout(this._timer);
				this._timer = setTimeout(function(){
					//最终选择
					if(false === _this.select(_this._tmpItem)){
						_this._tmpIndex = _this._tmpLastIndex;
						_this.$replace("_selected", _this._tmpLastItem);
						_this.layer.setSelected(_this._tmpLastItem);
						_this.layer.adjustScrollBar(_this._tmpLastIndex);
					} else {
						_this._tmpLastIndex = _this._tmpIndex;
						_this._tmpLastItem = _this._tmpItem;
					}
				}, 300);
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		},
		"keyup [input-handler]": function(e){
			//回车
			if(e.keyCode == 13 || e.keyCode == 108){
				this.layer.hide();
				return;
			}
		}
	},

	// ----------- 公共方法 start -----------
	//根据设置的控件获取数据的方式，从本地或者远程加载数据
	load: function(options){
		var _options = $.extend({}, options);
		var _params = $.extend({}, _options["params"]);
		var _callback = _options["callback"];
		if(this._mode == this._MODE.local){
			throw this._ERROR.localLoadParamError.code + ":" + this._ERROR.localLoadParamError.info
			return;
		}
		var _this = this;
		this._loadData(_params, function(){
			if(!_this._popup){
				_this.layer.setData(_this.list);
			}
			_this._params = _params;
			_utils.isFunction(_callback) && _callback();
		});
	},
	//设置下拉列表数据
	setData: function(data) {
		this.list = data;
		this.layer.setData(data);
	},
	//取值，返回选中行的值（valueField值）
	getValue: function() {
		return this.layer.getValue();
	},
	//取值，返回选中行的值（displayField 和valueField值）
	getSelected: function() {
		return this.layer.getSelected();
	},
	//设值
	setValue: function(v) {
		this.layer.setValue(v);
		this.$replace("_selected", this.getSelected());
	},
	//选中数据
	select: function(param) {
		return this.layer.select(param);
	},
	//启用控件
	enable: function() {
		this.$set("disabled", false);
	},
	//禁用控件
	disable: function() {
		this.$set("disabled", true);
	},
	//下拉组件校验
	validate: function() {
		if(this.$get("required")){
			if(null != this._selected) return true;
			else return false;
		}else return true;
	},
	// ----------- 公共方法 end -----------

	// ----------- 可扩展方法 start -----------
	//数据查询接口实现方法(需要由子类实现该方法)
	getData: function(url, param, callback) {
		//  param：JSON对象，查询参数
		//  callback: 数据查询完后需要调用该回调方法，需传入下拉组件的数据（JSON数组，同list）
	}
	// ----------- 可扩展方法 end -----------
},
{
	// ----------- 默认配置项 start -----------
	defaults: {
		list: [],				//下拉组件初始本地数据，JSON数组
		url: null,				//数据访问地址(当从服务端获取数据时请求该URL)
		params: {},				//查询参数，初始时设置该属性做为查询条件
		displayField: null,		//下拉组件加载JSON数据中，用于显示文本的字段
		valueField: null,		//下拉组件加载JSON数据中，用于获取实际值的字段
		name: null,				//表单元素名称
		value: null,			//下拉组件初始化时的默认值
		placeholder: null,		//默认显示文本，下拉组件未选择时显示的提示文本
		autoLoad: !0,			//是否自动加载(默认自动加载): true(默认)：自动, false：手动
		disabled: !1,			//启用禁用默认值：true：禁用; false(默认)：启用
		required: !1,			//控件校检条件，是否必须选择下拉项：true：必须选中；false(默认)：允许未选中
		width: null,			//下拉列表宽度, 默认为空，宽度为默认宽度，与元件的输入框默认宽度一致
		listHeight: "auto",		//下拉列表高度
		listMinHeight: "auto",	//下拉列表最小高度
		listMaxHeight: "auto"	//下拉列表最大高度
	}
	// ----------- 默认配置项 end -----------
});
module.exports = Combo