var $menu = $(".menu-wrap .menu");

//获取蓝色条块
var $blueblock = $(".header-blue-block");
//蓝色条块默认处在li.active 下面
setblueblock($menu.find(".active"));
function setblueblock($li){
	var width = $li.width();
	var padding = 20;
	var left = $li.position().left + padding;
	$blueblock.css({
		"left": left,
		"width": width
	})
}
//设置导航栏点击事件
$menu.find("li").on("click",function(){
	$(this).addClass("active").siblings().removeClass("active");
	setblueblock($(this));
});
//设置导航栏鼠标进入事件
$menu.find("li").on("mouseenter",function(){
	setblueblock($(this));
})
$menu.find("li").on("mouseleave",function(){
	setblueblock($menu.find(".active"));
})
//设置微信图标鼠标进入事件
var $weixin = $(".header-share-box .weixin-icon");
$weixin.on("mouseenter",function(){
	$("#weixin-code").removeClass("hide");
})
$weixin.on("mouseleave",function(){
	$("#weixin-code").addClass("hide");
})
//根据图片张数，生成switch-icon;
//获取图片张数
var $imgs = $(".img-box").find("a");
//获取switch-box
var $switchBox = $(".banner-container .switch-box");
//生成icon
for(var i = 0 ; i < $imgs.length ; i++){
	var $icon = $("<li><a class='switch-icon'></a></li>");
	$icon.attr("data-index",i);
	$imgs.eq(i).attr("data-index",i);
	if(i == 0){
		$icon.addClass("active");
	}
	$icon.on("click",function(){
		//改变背景图片
		$(this).addClass("active").siblings().removeClass("active");
		var index = parseInt($(this).attr("data-index"));
		//修改图片的轮播
		$imgs.eq(index).addClass("showing").siblings().removeClass("showing");
		//清除定时器，并在5s后再执行定时器,防止动画积累
		clearInterval(intervalTimer);
		clearTimeout(timeoutTimer);
		timeoutTimer = setTimeout(function(){
			idx = index + 1;
			intervalTimer = setInterval(interval,2000);
		},5000);
	});

	$icon.appendTo($switchBox);
}
var idx = 0;
var $icons = $switchBox.find("li");
//设置banner动画
var intervalTimer = setInterval(interval,2000);
var timeoutTimer = null;
function interval(){
	if(idx >= $imgs.length){
		idx = 0;
	}
	$icons.eq(idx).addClass("active").siblings().removeClass("active");
	//修改图片的轮播
	$imgs.eq(idx).addClass("showing").siblings().removeClass("showing");
	idx++;
}

//工作类型栏，鼠标进入事件
var $jobMenu = $(".filter-container");
var $lis = $jobMenu.find(".item");
$lis.on("mouseenter",function(){
	$(this).find(".downmenu").removeClass("hide");
})
$lis.on("mouseleave",function(){
	$(this).find(".downmenu").addClass("hide");
})

var jobManager = new JobManager();



