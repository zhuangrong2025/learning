;(function($){
	
	var Dialog = function(config){
		var _this_ = this;
		
		this.config = {
					width: 'auto',
					height: 'auto',
					message: null,
					button:null,
					dalay:null
		}
		
		//默认参数扩展，如果没有参数时，isConfig为true
		
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config)
		}else{
			this.isConfig = true	
		}
		
		this.create(config);
		
	}
	Dialog.prototype = {
		//创建弹窗口
		create:function(config){
			var _this_ = this;
					body = $("body");
			    mask = $("<div class='mask'>");
			    dialog = $("<div class='dialog'>");
			    header = $("<div class='header'>");
			    content = $("<div class='content'>");
			    footer = $("<div class='footer'>");
					
					
					if(this.isConfig){
						
						 //没参数时
						 dialog.append(header.addClass("error"));
						 mask.append(dialog)
						 body.append(mask);
						 
					}else{
						header.addClass(config.type)
						content.html(config.message);
						dialog.append(header);
						dialog.append(content);
						dialog.append(footer);
						mask.append(dialog.css({"width":config.width}));
						body.append(mask.css({"background":"rgba(0,0,0," + config.maskopacity + ")"}));
						
						this.createButton(footer,config.buttons);
						
						//打开2秒后关闭
						if(config.delay){
							setTimeout(function(){
									_this_.close()
							},config.delay)
						}
					}
		},
		
		//创建按钮
		createButton:function(footer,buttons){
			  //_this_必须是指向createbutton方法（对象）
				var		_this_ = this;			
				$(buttons).each(function(){
						var txt = this.txt,
								type = this.type,
								callback = this.callback?this.callback:null;
								
            var button = $("<button class="+ type +">" + txt + "</button>");
						//绑定按钮事件
						if(callback){
							button.click(function(){
									var isClose = callback(); //把callback返回值赋值与isClose，顺便也执行了callback方法
									
									if(isClose != false ){  //在都有callback的情况下，callback返回值不等于false时关闭
										_this_.close()
									}
							});
						}else{
							button.click(function(){
									_this_.close()
							});
						}
						footer.append(button);
        });
		},
		//关闭弹出层
		close:function(){
				dialog.css({"-webkit-animation-name":"fadeout","-webkit-animation-duration":"0.5s"});
				setTimeout(function(){
					this.mask.remove()
				},300);
				
		}
			
	}
	window.Dialog = Dialog;
	
	$.Dialog = function(config){
			return new Dialog(config)
	}
	
})(jQuery) 