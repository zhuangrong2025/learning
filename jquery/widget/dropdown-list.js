"use strict";
/**
 * 下拉层组件
 * @class DropDownList
 * @extends ComponentBase
 */
var _utils = require("../../ecore/utils"),
	_tpl = require('fs').readFileSync(__dirname + "/tpl/combo/list_tpl.html", 'utf8'),
	_componentBase = require("../componentBase");
var DropDownList = _componentBase.extend({
	$tpl: _tpl,
	_ERROR : {	//错误常量
		liHeightStyleError : {
			code : 900,
			info : "下拉选项高度设置有误，需大于2"
		}
	},
	$beforeInit: function() {
		this.setData(this.list);
	},
	$afterDestroy: function() {
		this._jqDom & this._jqDom.remove();
	},
	constructor: function(){
		this.$el = $("<div>").addClass("dropdown-list-wrap").appendTo($("body")).get(0),
		this._jqDom = $(this.$el),
		this._jqDom.css({position: "absolute", zIndex: "10000", display: "none"});
		this._selected = null;
		_componentBase.apply(this, arguments);
	},
	getJqueryDom: function(){
		return this._jqDom;
	},
	show: function(options){
		var pos = $.extend({
			top : 0,
			left : 0,
			width : 'auto'
		}, options);
		this._jqDom.css({top: pos.top, left: pos.left}).width(pos.width).show();
		this.$emit("show");
	},
	hide: function(){
		this._jqDom.hide(),
		this.$emit("hide");
	},
	//查找对应项
	getItem: function(list, param){
		// list:	要查找的list
		// param:	选项键值对{} 或 选项对应的索引(-1, 0 <-> list.length-1)
		var type = 0;
		if(null == param || _utils.isPlainObject(param)) type = 1;
		else if(!isNaN(parseInt(param))) type = 2;
		else return;
		var selected = null,
			selectedIndex = -1,
			found;
		(null == param || (2 === type && !(param >=0 && param < list.length)))
				? found = true : false;
		// 查找事件相关参数
		if(list && !found){
			for(var i=0; i<list.length; i++){
				var item = list[i];
				if((1 === type && (param == item || (param
						&& param[this.valueField] === item[this.valueField]
						&& param[this.displayField] === item[this.displayField])))
						|| (2 === type && i === param)){
					selected = item;
					selectedIndex = i;
					break;
				}
			}
		}
		return {
			item : selected,
			itemIndex : selectedIndex
		};
	},
	//调整滚动条的位置
	adjustScrollBar : function(index){
		var ulJdom = $(this.$el).find(">ul"),
			ulHeight = ulJdom.height(),
			liHeight = 0,
			liSize = 0,		//li总个数
			halfLiSizeInUl = 0;	//ul可视区存放li个数的一半
		if(ulJdom.has(">li")){
			liHeight = ulJdom.find(">li").first().height();
			liSize = ulJdom.find(">li").size();
			if(liHeight < 3){
				throw this._ERROR.liHeightStyleError.code + ":" + this._ERROR.liHeightStyleError.info
				return;
			}else{
				halfLiSizeInUl = Math.round(ulHeight / liHeight / 2);
			}
		}else{
			return;
		}
		if(0 == ulHeight || 0 == liHeight || 0 == liSize){
			ulJdom.scrollTop(0);
		}else{
			if(liHeight * liSize > ulHeight){
				var top = (1 + index) * liHeight;
				if(-1 == index || 0 == index){
					ulJdom.scrollTop(0);
				}else if((1 + index) >= liSize){
					ulJdom.scrollTop(liHeight * liSize - ulHeight);
				}else{
					ulJdom.scrollTop((1 + index - halfLiSizeInUl) * liHeight);
				}
			}
		}
	},
	//获取下拉列表数据
	getData: function(t){
		return this.list;
	},
	//设置下拉列表数据
	setData: function(list){
		var data = [];
		list && _utils.isArray(list) && $.each(list, function(i, item){
			data.push(item);
		});
		this.$replace("list", data);
	},
	//取值，返回选中行的值（valueField值）
	getValue: function(){
		var o = this._selected;
		return !o ? "" : o[this.$get("valueField")];
	},
	//设值
	setValue: function(param){
		// param：选项对应的值
		var found = null, index = -1;
		for(var i=0; i<this.list.length; i++){
			var item = this.list[i];
			if(param === item[this.valueField]){
				found = item;
				index = i;
				break;
			}
		}
		return this.$set("_selected", found);
	},
	//取值，返回选中行的值（displayField 和valueField值）
	getSelected: function(){
		return this._selected;
	},
	//设置
	setSelected: function(_selected) {
		this.$replace("_selected", _selected)
	},
	//选中数据
	select: function(param){
		// param：选项键值对{} 或 选项对应的索引(-1, 0 <-> this.list.length-1)
		var res = this.getItem(this.list, param);
		if(-1 != res.itemIndex
				&& !this.$emit("beforeselect", this.list, res.item, res.itemIndex))
			return false;
		this.$replace("_selected", res.item);
		this.$emit("select", res.item);
	},
	//控制内部事件
	$events: {
		"click [data-item]": function(data){
			var e = this.list && this.list[data.currentTarget.$index];
			this.select(e);
			this.hide();
		}
	}
	// ----------- 可扩展方法 end -----------
},
{
	// ----------- 默认配置项 start -----------
	defaults: {
		list: [],				//下拉组件初始本地数据，JSON数组
		displayField: null,		//下拉组件加载JSON数据中，用于显示文本的字段
		valueField: null,		//下拉组件加载JSON数据中，用于获取实际值的字段
		width: null,			//下拉列表宽度, 默认为空，宽度为默认宽度，与元件的输入框默认宽度一致
		listHeight: "auto",		//下拉列表高度
		listMinHeight: "auto",	//下拉列表最小高度
		listMaxHeight: "auto"	//下拉列表最大高度
	}
	// ----------- 默认配置项 end -----------
});
module.exports = DropDownList