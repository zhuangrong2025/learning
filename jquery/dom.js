(function(){
	var list = document.getElementById("list");
	var btn = document.getElementById("btn");
	btn.onclick = function(){
		var li = document.createElement("li")
		li.innerHTML = "list" + list.length + 1
		list.appendChild(li)
	}
})()