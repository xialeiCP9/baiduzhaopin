/** 组件 **/
//dictionary 传入的数据JSON格式数据字典，callback：可以根据需要，对字典数据进行部分处理
function Job(dictionary,callback){
	//将要被渲染的父元素
	this.$listBody = $(".list-body");
	//字典
	this.dictionary = callback && callback(dictionary) || dictionary;
	//模板数据绑定
	this.compileFunction = _.template($("#row_template").html());
	//生成模板dom数据
	this.$domString = $(this.compileFunction(this.dictionary));


	//执行渲染，并添加事件监听
	this.render();
	this.bindEvent();

}
//渲染模板
Job.prototype.render = function(){
	this.$listBody.append(this.$domString);
}
//添加事件
Job.prototype.bindEvent = function(){
	//添加事件的按钮
	this.$downIcon = this.$domString.find(".down-arrow-icon");
	this.$downIcon.on("click",function(){
		$(this).toggleClass("down-arrow-icon").toggleClass("up-arrow-icon");
		$(this).parent().parent().next(".job-detail").toggleClass("hide");
	});
}

/** 管理job **/
function JobManager(){
	this.jobList = {};
	this.$listBody = $(".list-body");
	//持久化导航条
	this.page = new Page();
	if(window.location.hash == ""){
		window.location.hash = 1;
	}
	var pageNum =parseInt(window.location.hash.substr(1));
	this.gotoPage(pageNum);
}
JobManager.prototype.gotoPage = function(pageNum){
	var self = this;
	this.$listBody.html("");
	if(this.jobList[pageNum]){
		_.each(this.jobList[pageNum],function(item){
			item.render();
			item.bindEvent();
		})
		return;
	}
	$.get("./JSON/getPostList" + pageNum,function(data){

		var dataJSON = JSON.parse(data);
		self.jobList[pageNum] = [];
		console.log(dataJSON.totalPage);
		self.page.update(pageNum,parseInt(dataJSON.totalPage));
		_.each(dataJSON.postList,function(dictionary){
			var job = new Job(dictionary,function(dictionary){
				dictionary.serviceCondition = "<p>" + dictionary.serviceCondition.replace(/\<br\>/g,"</p><p>") + "</p>";
				dictionary.workContent = "<p>" + dictionary.workContent.replace(/\<br\>/g,"</p><p>") + "</p>";
			});
			self.jobList[pageNum].push(job);
		});
	})
}

function Page(totalPage,curPage){
	this.totalPage = totalPage;
	this.curPage = curPage;
	//分页条所在的区域
	this.$pagination = $(".pagination");
	this.$lis = this.$pagination.find("li");
	this.$prev = this.$pagination.find(".pre");
	this.$next = this.$pagination.find(".next");
	this.bindEvent();
	
}
Page.prototype.render = function(){
	//根据最大页数，生成对应的分页条
	console.log(this.totalPage)
	if(this.totalPage <= 7){
		for(var i = 1 ; i <= this.totalPage ; i++){
			this.$lis.eq(i - 1).html("<a>" + i + "</a>");
			this.$lis.eq(i - 1).addClass("page");
		}
		this.$lis.eq(this.curPage - 1).addClass("active").siblings().removeClass("active");
		return;
	} 
	if(this.curPage >= 1 && this.curPage <= 3){
		this.$lis.eq(0).html("<a>" + 1 + "</a>");
		this.$lis.eq(1).html("<a>" + 2 + "</a>");
		this.$lis.eq(2).html("<a>" + 3 + "</a>");
		this.$lis.eq(3).html("<a>" + 4 + "</a>");
		this.$lis.eq(4).html("...");
		this.$lis.eq(5).html("<a>" + (this.totalPage - 1) + "</a>");
		this.$lis.eq(6).html("<a>" + this.totalPage + "</a>");
		this.$lis.eq(this.curPage - 1).addClass("active").siblings().removeClass("active");
		for(var i = 0 ; i < 7 ; i ++){
			this.$lis.eq(i).addClass("page").removeClass("ellipsis");
		}
		this.$lis.eq(4).addClass("ellipsis").removeClass("page");
	} else if(this.curPage >= this.totalPage - 2 && this.curPage <= this.totalPage){
		this.$lis.eq(0).html("<a>" + 1 + "</a>");
		this.$lis.eq(1).html("<a>" + 2 + "</a>");
		this.$lis.eq(2).html("...");
		this.$lis.eq(3).html("<a>" + (this.totalPage - 3) + "</a>");
		this.$lis.eq(4).html("<a>" + (this.totalPage - 2) + "</a>");
		this.$lis.eq(5).html("<a>" + (this.totalPage - 1) + "</a>");
		this.$lis.eq(6).html("<a>" + this.totalPage + "</a>");
		this.$lis.eq(this.curPage - this.totalPage + 6).addClass("active").siblings().removeClass("active");
		for(var i = 0 ; i < 7 ; i ++){
			this.$lis.eq(i).addClass("page").removeClass("ellipsis");
		}
		this.$lis.eq(2).addClass("ellipsis").removeClass("page");
	} else {
		this.$lis.eq(0).html("<a>" + 1 + "</a>");
		this.$lis.eq(1).html("...");
		this.$lis.eq(2).html("<a>" + (this.curPage - 1) + "</a>");
		this.$lis.eq(3).html("<a>" + (this.curPage) + "</a>");
		this.$lis.eq(4).html("<a>" + (this.curPage + 1) + "</a>");
		this.$lis.eq(5).html("...");
		this.$lis.eq(6).html("<a>" + this.totalPage + "</a>");
		this.$lis.eq(3).addClass("active").siblings().removeClass("active");
		for(var i = 0 ; i < 7 ; i ++){
			this.$lis.eq(i).addClass("page").removeClass("ellipsis");
		}
		this.$lis.eq(1).addClass("ellipsis").removeClass("page");
		this.$lis.eq(5).addClass("ellipsis").removeClass("page");
	}
}
Page.prototype.update = function(curPage,totalPage) {
	this.curPage = curPage;
	this.totalPage = totalPage;
	if(this.curPage > this.totalPage){
		return;
	}
	jobManager.gotoPage(this.curPage);
	window.location.hash = "#" + this.curPage;
	this.render();
};
Page.prototype.next = function(){
	if(this.curPage >= this.totalPage){
		return;
	}
	this.curPage++;
	this.update(this.curPage,this.totalPage);
}
Page.prototype.prev = function(){
	if(this.curPage <= 1){
		return;
	}
	this.curPage --;
	this.update(this.curPage,this.totalPage);
}
Page.prototype.bindEvent = function(){
	var self = this;
	this.$prev.on("click",function(){
		self.prev();
	});
	this.$next.on("click",function(){
		self.next();
	});
	this.$lis.on("click",function(){
		if($(this).hasClass("page")){
			self.update(parseInt($(this).text()),self.totalPage)
		}
	})
}
