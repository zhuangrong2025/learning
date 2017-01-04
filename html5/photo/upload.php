<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
</head>

<body>
<?php
//$_SERVER['HTTP_X_FILENAME']用来判断是用ajax上传还是用普通表单上传,xhr方法模拟请求头，只有apache可以接收，nginx不行，所以使用php://input写入
$fn = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);
if ($fn) {
	//file_put_contents函数把一个字符串写入文件中，写入图片文件
	//file_put_contents(图片名称，图片内容)
    file_put_contents(
		//第一个参数写入数据的文件（必选）
        'uploads/' . $fn,
		//第二个参数规定写入文件的数据（可选）
		//php://input接收图片数据流,可读取没有处理过的post数据，减少内存带来的压力，不需要特殊配置php.ini文件
        file_get_contents('php://input')
    );
	//页面中输出上传路径并退出
    echo "http://www.songrongfa.com/uploads/$fn";
    exit();
}
?>
</body>
</html>