"use strict";
var a = {
	dialogs : {},
	getDialogById : function (e) {
		return this.dialogs[e]
	},
	hasBind : !1,
	events : function () {
		var _dialog,
		_offsetLeft,
		_offsetTop,
		_winHeight,
		_winWidth,
		_this = this,
		s = !1,
		l = !1,
		f = function (i) {
			if (_dialog) {
				var _sumWidth = (_dialog.dialogHeight + i.pageY - _offsetTop, _dialog.dialogWidth + i.pageX - _offsetLeft),
                _scrollTop = $(document).scrollTop(),
				_top = i.pageY - _offsetTop < 0 ? 0 : i.pageY - _offsetTop, 
				_left = i.pageX - _offsetLeft < 0 ? 0 : i.pageX - _offsetLeft;
				_sumWidth > _winWidth && (_left = _winWidth - _dialog.dialogWidth),
                _top > 0 && (_top = i.pageY - _scrollTop - 15),
				//_top > _winHeight - 15 && (_top = _top - _scrollTop),
                _top > _winHeight - _dialog.dialogHeight - 15 && (_top = _winHeight - _dialog.dialogHeight - 15),
				_dialog.position({
					top : _top,
					left : _left
				}),
				l || (l = !0, _offsetLeft = i.pageX - _dialog.$ele.find(".dialog-drag").offset().left, _offsetTop = i.pageY - _dialog.$ele.find(".dialog-drag").offset().top)
			}
		};
		$(document).on("mousedown", ".dialog-drag", function (evt) {
			$(evt.target).hasClass("text") || (_winHeight = $(window).height(), _winWidth = $(window).width(), _dialog = _this.getDialogById($(this).parent().data("dialogId")), l = !0, $(document).on("mousemove", f), _offsetLeft = evt.pageX - $(this).offset().left + 3, _offsetTop = evt.pageY - $(this).offset().top + 3)
		}),
		$(document).on("mouseup", function () {
			s || (_dialog = null, $(document).off("mousemove", f)),
			s = !1,
			l = !1
		}),
		$(document).on("mousedown", ".xy-dialog", function () {
			$(this).data("dialogId")
		}),
		a.hasBind = !0
	}
},
d = {
	enableDrag : function (e, o) {
		a.dialogs[e] = o,
		o.$dialog.find(".dialog-header").addClass("dialog-drag"),
		o.$dialog.find(".dialog-header").bind("contextmenu", function (e) {
			e.preventDefault()
		}).find(".text").bind("contextmenu", function (e) {
			e.stopPropagation()
		}),
		a.hasBind === !1 && a.events()
	}
};
module.exports = d
