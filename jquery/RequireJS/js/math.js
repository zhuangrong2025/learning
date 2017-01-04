define(['myLib'],function(lib){ //依赖于myLib.js模块，lib是回调函数，对象名
  
	var num = lib.total(3,3);  //调用myLib中的total方法
	
	var add = function(a){
					return a + num;
	    }	
	return {
			add: add
	}
			
})