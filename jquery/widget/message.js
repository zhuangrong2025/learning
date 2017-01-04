"use strict";
var Dialog = require("./dialog"),
Messager = (function() {
	var d = {
		alert : function(title, msg, fn, options) {
			var iconCls = options && options.iconCls || 'xy-icon-info';
			var _opts = {
				width: 450,
				title : title || "提示",
				content : "<div class='messager-body'><i class='" + iconCls + "'></i>" + msg + "</div>",
				buttons: [
					{title:'确定', cls: 'primary', handler: function() {
						this.$destroy();
						fn && fn();
					}}
				]
			};
			$.extend(_opts, options);
			new Dialog({
				$data: _opts
			}).show();
		},
		confirm : function(title, msg, fn, options) {
			var iconCls = options && options.iconCls || 'xy-icon-question';
			var _opts = {
				width: 450,
				title : title || "确认框",
				content : "<div class='messager-body'><i class='" + iconCls + "'></i>" + msg + "</div>",
				buttons: [
					{title:'确定', cls: 'primary', handler: function() {
						this.$destroy();
						fn && fn(true);
					}},
					{title:'取消', handler: function() {
						this.$destroy();
						fn && fn(false);
					}}
				]
			};
			$.extend(_opts, options);
			new Dialog({
				$data: _opts
			}).show();
		}
	};
	return d;
})();
module.exports = Messager