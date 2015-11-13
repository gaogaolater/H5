
$(function(){
	$("#animatType").bind("change",function(){
		var type = Number($("#animatType option:selected").val());
		if(type==0||type==1){
			$("#animatDirectionTr").hide();
		}
		else{
			$("#animatDirectionTr").show();
		}
	});
	
	$("#audio_btn").click(function(){
		var className = $(this).attr("class");
		if(className.indexOf("rotate")!=-1){
			$(this).removeClass("rotate");
			$("#media")[0].stop();
		}
		else{
			$(this).addClass("rotate");
		}
	});
	
	$("#animatPanelOK").click(function(){
		var val = Number($("#animatType option:selected").val());
		if(val == 0){
			etouch.editTarget.css("animation","");
			$("#animatPanel").hide();
			return;
		}
		var direct = Number($("#animatDirection option:selected").val());
		var name = '';
		switch(val){
			case 3:
				name="bounceIn";
				break;
			case 2:
				name="fadeIn";
				break;
			case 1:
				name="fadeIn";
				break;
		}
		if(val==2||val==3){
			switch(direct){
				case 3:
					name+="Up";
					break;
				case 2:
					name+="Left";
					break;
				case 1:
					name+="Down";
					break;
				case 0:
					name+="Left";
					break;
			}
		}
		var animatTime = $("#animatTime").val();
		var animatDelay = $("#animatDelay").val();
		var animatTimes = $("#animatTimes").val();
		var animatInfinite = $("#animatInfinite:checked").val();
		var count=animatInfinite=="on"?"infinite":animatTimes;
		var animateVal=name + " " + animatTime+"s linear "+animatDelay+"s "+count;
		etouch.editTarget.css("animation",animateVal);
		$("#animatPanel").hide();
	});
})

$(function () {
	etouch = {
		phoneW:0,
		phoneH:0,
		webApp:{page:[],transition:'',audio:{}},//整个页面对象
		dragTarget:null,//当前拖拽的物体
		currentPageIndex:-1,//-1表示没有页面
		isEdit:false,//是否文字编辑状态
		editTarget:null,//右键目标
		moveTarget:null,//拖拽目标
		resizeTarget:null,//缩放目标
		editDivTarget:null,//编辑div目标
		getCurrentPage:function(){
			if(etouch.currentPageIndex==-1){
				return null;
			}
			return $(".pageitem").eq(etouch.currentPageIndex);
		},
		init:function(){
			this.phoneW = Math.round($("#phonescreen").width());
			this.phoneH = Math.round($("#phonescreen").height());
			this.save();
			var phoneDom = $("#phonescreen");
			$("#menuAddText").click(this.addText);
			$("#menuAddBgPic").click(this.addBackgroundPic);
			$("#menuAddAudio").click(this.addAudio);
			$("#menuAddPic").click(this.addPic);
			$("#menuAddVideo").click(this.addVideo);
			$("#menuAddAnimat").click(this.addAnimat);
			$("#addpage").click(this.addPage);
			$("#bgPicList").click(this.setBgPicEvent);
			$("#picPanel").click(this.setPicEvent);
			$("#bgPanelClose").click(function(){$("#bgPanel").hide()});
			$("#picPanelClose").click(function(){$("#picPanel").hide()});
			$("#phonescreen").bind("mousedown",this.mousedown);
			$("#phonescreen").bind("mousemove",this.mousemove);
			$("#phonescreen").bind("mouseup",this.mouseup);
			$("#phonescreen").bind("keydown",this.keydown);
			$("#cm_edit").click(this.editFont);
			$("#fonttoolbar").click(this.fontbarEvent);
			$("#cm_delete").click(this.deleteObj);
			$("#cm_animat").click(this.animatEvent);
			$("#animatPanelClose").click(function(){$("#animatPanel").hide()});
			phoneDom.bind("contextmenu",this.showContextMenu);
			//删除和选中事件
			$("#pageList").click(function(e){
				var tagName = e.target.tagName;
				if(tagName=="SPAN"){
					var index = Number($(e.target).parent().attr("index"));
					etouch.removePage(index);
				}
				else if(tagName=="A"){
					var index = Number($(e.target).parent().attr("index"));
					etouch.showPage(index);
				}
				else if(tagName=="P"){
					var index = Number($(e.target).attr("index"));
					etouch.showPage(index);
				}
			});
			this.loadBgPic();
			this.loadPic();
			this.loadJsonData();
			$("#contextmenu").click(this.clickContextMenu);
		},
		keydown:function(e){
			//避免删除文字后 再次输入文字位置错误
			if(etouch.editTarget){
				/*
				if(etouch.editTarget.find("span").size()==0){
					etouch.editTarget.append("<span></span>");
				}
				*/
			}
		},
		animatEvent:function(){
			if(etouch.editTarget){
				$("#animatPanel").show();
			}
		},
		deleteObj:function(){
			if(etouch.editTarget){
				etouch.editTarget.remove();
			}
		},
		//字体改变颜色
		changeColor:function(color){
			etouch.editTarget.css({"color":color});
		},
		fontbarEvent:function(e){
			$("#fontsizelist").hide();
			var target = e.target;
			if(target.tagName=="A"){
				var id = target.id;
				if(id=="size"){
					$("#fontsizelist").show();
				}
				else if(id=="color"){
					$("#colorpicker").click();
				}
				else if(id=="bolder"){
					//粗体
					etouch.editTarget.css({"fontWeight":"bolder"});
				}
			}
			else if(target.tagName=="LI"){
				var size= Number($(target).attr("val"));
				etouch.editTarget.css({"fontSize":size});
			}
		},
		editFont:function(){
			var target= etouch.editTarget;
			if(target.attr("type")=="editdiv"){
				var span = target.find("span");
				span.attr("contenteditable","true");
				etouch.isEdit = true;
				//选中
				var selection = window.getSelection();
				selection.selectAllChildren(span[0]);
				var x = target.position().left;
				var y = target.position().top;
				$("#fonttoolbar").css({top:y-40,left:x+20});
				$("#fonttoolbar").show();
			}
		},
		mouseup:function(e){
			etouch.moveTarget = null;
			etouch.resizeTarget = null;
			$("#contextmenu").hide();
			if(etouch.editDivTarget!=null){
				
			}
		},
		mousemove:function(e){
			if(etouch.resizeTarget!=null){//缩放
				var target = $(etouch.resizeTarget);
				//上下左右  左上 左下 右上 右下
				var h = target.parent().height();
				var w = target.parent().width();
				var className = target.attr("class");
				var parentDom = target.parent();
				var top = parentDom.position().top;
				var left = parentDom.position().left;
				e.movementY = e.clientY-target[0].oy;
				e.movementX = e.clientX-target[0].ox;
				target[0].oy = e.clientY;
				target[0].ox = e.clientX;
				
				if(className.indexOf("bar-ne")!=-1){
					parentDom.width(w+e.movementX);
					parentDom.height(h-e.movementY);
					parentDom.css("top",top+e.movementY);
				}
				else if(className.indexOf("bar-nw")!=-1){
					parentDom.width(w-e.movementX);
					parentDom.css("left",left+e.movementX);
					parentDom.height(h-e.movementY);
					parentDom.css("top",top+e.movementY);
				}
				else if(className.indexOf("bar-sw")!=-1){
					parentDom.width(w-e.movementX);
					parentDom.css("left",left+e.movementX);
					parentDom.height(h+e.movementY);
				}
				else if(className.indexOf("bar-se")!=-1){
					parentDom.width(w+e.movementX);
					parentDom.height(h+e.movementY);
				}
				else if(className.indexOf("bar-s")!=-1){
					parentDom.height(h+e.movementY);
				}
				else if(className.indexOf("bar-n")!=-1){
					parentDom.height(h-e.movementY);
					parentDom.css("top",top+e.movementY);
				}
				else if(className.indexOf("bar-e")!=-1){
					parentDom.width(w+e.movementX);
				}
				else if(className.indexOf("bar-w")!=-1){
					parentDom.width(w-e.movementX);
					parentDom.css("left",left+e.movementX);
				}
				
			}
			else if(etouch.moveTarget != null) {
				var target = etouch.moveTarget;
				var x = e.clientX - $(this)[0].offsetLeft;
				var y = e.clientY - $(this)[0].offsetTop;
				if (!target.relativeLeft) {
					target.relativeLeft = x - target.offsetLeft;
					target.relativeTop = y - target.offsetTop;
				}
				x = x - target.relativeLeft;
				y = y - target.relativeTop;
				var perX = x * 100 / etouch.phoneW + "%";
				var perY = y * 100 / etouch.phoneH + "%";
				$(target).css({ top: perY, left: perX });
			}
			e.preventDefault();
		},
		mousedown:function(e){
			if (e.button != 0) return;//不处理右键
			var target = e.target;
			
			var className = target.getAttribute("class");
			var type = $(target).attr("type");
			if(className&&className.indexOf("bar")!=-1){
				if(className == "bar-radius"){
					target=target.parentNode;
				}
				etouch.resizeTarget = target;
				target.ox=target.clientX;//老的x y 用于计算每次移动的距离
				target.oy=target.clientY;
			}
			else if (type&&type.indexOf("drag_inner")!=-1) {
				target = target.parentNode;
				$(".bar").hide();
				$(target).find(".bar").show();
				etouch.moveTarget = target;
				etouch.moveTarget.relativeLeft = null;
				etouch.moveTarget.relativeTop = null;
			}
			else if(className && className.indexOf("pageitem")!=-1){
				etouch.isEdit = false;
				$("#fonttoolbar").hide();
				$(".bar").hide();
				$("span[contenteditable=true]").removeAttr("contenteditable");
			}
			//e.preventDefault(); //防止粘连现象
		},
		clickContextMenu:function(e){
			$("#contextmenu").hide();
		},
		showContextMenu:function(e){
			if(etouch.isPageItem(e.target)==false){
				var target = $(e.target);
				var type = target.attr("type");
				//寻找最外层
				if(type === undefined || type.indexOf("edit")==-1){
					target = target.parent();
				}
				etouch.editTarget = $(target);
				var x = e.clientX - $(this)[0].offsetLeft;
				var y = e.clientY - $(this)[0].offsetTop;
				$("#contextmenu").css({ position: 'absolute', top: y, left: x });
				$("#contextmenu").show();
			}
			e.preventDefault();
		},
		isPageItem:function(target){
			var className = target.getAttribute("class");
			if(className == null || className.indexOf("pageitem")==-1)
				return false;
			else
				return true;
		},
		loadPic:function(){
			var picPanel = $("#picList");
			var pics = panelPicData.list;
			for(var i=0;i<30;i++){
				picPanel.append("<img path='http://res.eqxiu.com/"+pics[i].path+"' src='http://res.eqxiu.com/"+pics[i].tmbPath+"'/>");
			}
		},
		//加载JSON数据
		loadJsonData:function(){
			if(localStorage.webApp == null)return;
			var jsonData=JSON.parse(localStorage.webApp);
			if(jsonData.page.length==0)return;
			var pageList = jsonData.page;
			//etouch.webApp = localStorage.webApp;
			for(var i=0;i<pageList.length;i++){
				etouch.addPage();
				etouch.loadPage(i,pageList[i]);
			}
		},
		loadPage:function(pageIndex,pageObj){
			etouch.setBgPic(pageIndex,pageObj.background.url);
		},
		setBgPic:function(pageIndex,bgUrl){
			$("#phonescreen .pageitem")
				.eq(pageIndex)
				.css("backgroundImage","url('"+bgUrl+"')");
			etouch.webApp.page[pageIndex].background.url = bgUrl;
		},
		//设置图片地址
		setBgPicEvent:function(e){
			if(e.target.tagName=="IMG"){
				if(etouch.webApp.page.length>0){
					var path = $(e.target).attr("path");
					etouch.setBgPic(etouch.currentPageIndex,path);
				}
				$("#bgPanel").hide();
			}
		},
		setPicEvent:function(e){
			if(e.target.tagName=="IMG"){
				if(etouch.webApp.page.length>0){
					var path = $(e.target).attr("path");
					var page = etouch.getCurrentPage();
					var id = "editpic" + new Date().getTime();
					page.append("<div id='"+id+"' type='editpic' draggable='true' class='comp-resize defaultpicstyle'><img type='drag_inner_img' src='"+path+"'/></div>");
					$("#"+id).append($("#resizeborder").html());
					$("#"+id).find(".bar").hide();
				}
				$("#picPanel").hide();
			}
		},
		loadBgPic:function(){
			var bgPicPanel = $("#bgPicList");
			var picList = panelBgPicData.list;
			for(var i=0;i<30;i++){
				bgPicPanel.append("<img path='http://res.eqxiu.com/"+picList[i].path+"' src='http://res.eqxiu.com/"+picList[i].tmbPath+"'/>");
			}
		},
		addPage:function(){
			var page = etouch.webApp.page;
			page.push(new pageObj());
			var index=page.length-1;
			var pageList=$("#pageList");
			//选中当前页面
			pageList.append("<p index='"+index+"'><a>第"+page.length+"页</a><span name='deletePage'>╳</span></p>");
			$("#phonescreen").append("<div class='pageitem'></div>");
			etouch.showPage(index);
			pageList[0].scrollTop = pageList[0].scrollHeight;
			etouch.currentPageIndex = page.length-1;
		},
		removePage:function(index){
			etouch.webApp.page.splice(index,1);
			var removePage=$(".pageitem").eq(index);
			//如果删除当前页 则选择另外的页面显示
			if(removePage.css("display")!='none'){
				if($(".pageitem").length!=1){
					var showIndex=index==0?1:index-1;
					etouch.showPage(showIndex);
				}
			}
			removePage.remove();
			$("span[name='deletePage']").eq(index).parent().remove();
			if($(".pageitem").size()==0){
				etouch.currentPageIndex = -1;
			}
			else{
				//重新排序
				$("span[name='deletePage']").each(function(i,obj){
					$(obj).parent().attr("index",i);
					$(obj).parent().find("a").text("第"+(i+1)+"页");
					
					if($(obj).parent().css("backgroundColor")===""){
						etouch.currentPageIndex = i;
					}
				});
			}
		},
		showPage:function(index){
			etouch.currentPageIndex = index;
			$("#phonescreen .pageitem").hide();
			$("#phonescreen .pageitem").eq(index).show();
			$("#pageList p").css("backgroundColor","#E1E1E1");
			$("#pageList p").eq(index).css("backgroundColor","");
		},
		addText:function(){
			if(etouch.currentPageIndex==-1){
				alert("请先添加页面");
				return;
			}
			var id = "editdiv"+new Date().getTime();
			etouch.getCurrentPage().append("<div id='"+id+"' type='editdiv' draggable='true' class='comp-resize defaultfontstyle' name='pagefont'><span type='drag_inner_text'>请在这里编辑</span></div>");
			$("#"+id).append($("#resizeborder").html());
			$("#"+id).find(".bar").hide();
		},
		removeText:function(){
			
		},
		addPic:function(){
			if(etouch.currentPageIndex==-1){
				alert("请先添加页面");
				return;
			}
			$("#picPanel").show();
			//etouch.append("<img id='imgap' src='http://res.eqxiu.com/group1/M00/BB/5F/yq0KA1Ru0-WASRNsAABwW066NG0877.png'/>");
		},
		removePic:function(){},
		addBackgroundPic:function(){
			//添加背景
			if(etouch.currentPageIndex==-1){
				alert("请先添加页面");
				return;
			}
			$("#bgPanel").show();
		},
		removeBackgroundPic:function(){},
		addAnimat:function(){},
		removeAnimat:function(){},
		addAudio:function(){},
		removeAudio:function(){},
		addVideo:function(){},
		removeVideo:function(){},
		save:function(){
			var _this=this;
			//持续保存
			setInterval(function(){
				var jsonData=_this.webApp;
				if(jsonData.page.length>0){
					localStorage.webApp = JSON.stringify(jsonData);
					var html = $("#phonescreen").html();
					
					
					localStorage.webAppHTML = html;
				}
			},3000);
		}
	}
	etouch.init();
	
	//整个app对象
	var webapp = function(){
		this.page=[];
		this.transition='';
		this.audio={};
	}
	
	/*
	//webapp对象 是一个json
	{
		page:[{
			background:{url:'',animat:[]},
			image:[{url:'',class:'',width:0,height:0,top:0,left:0,animat:[]}],
			text:[{val:'',class:'',width:0,height:0,top:0,left:0,animat:[]}],
			effect:[],//特效
			video:[{url:'',class:'',width:0,height:0,top:0,left:0,autoPlay:false}]
		}],
		transition:'',//转场效果
		audio:{url:'',autoplay:true,class:'',top:0,left:0}
	}
	*/
});

//页面对象
var pageObj = function(){
	this.background={};
	this.image=[];
	this.text=[];
	this.effect=[];
	this.video=[];
}