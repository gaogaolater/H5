$(function () {
    etouch = {
        phoneW: 0,
        phoneH: 0,
        dragTarget: null, //当前拖拽的物体
        currentPageIndex: -1, //-1表示没有页面
        isEdit: false, //是否文字编辑状态
        editTarget: null, //右键目标
        moveTarget: null, //拖拽目标
        resizeTarget: null, //缩放目标
        getCurrentPage: function () {
            if (etouch.currentPageIndex == -1) {
                return null;
            }
            return $("#phonescreen .pageitem").eq(etouch.currentPageIndex);
        },
        init: function () {
            this.phoneW = Math.round($("#phonescreen").width());
            this.phoneH = Math.round($("#phonescreen").height());
            //this.loadData();
            this.bindEvent(); //最后绑定事件不能颠倒
            this.save(); //开启定时保存
        },
        bindEvent: function () {
            $("#menuAddText").click(this.addText);
            $("#menuAddBgPic").click(this.addBackgroundPic);
            $("#menuAddAudio").click(this.addAudio);
            $("#menuAddPic").click(this.addPic);
            $("#menuAddVideo").click(this.addVideo);
            $("#menuAddAnimat").click(this.addAnimat);
            $("#addPage").click(this.addPage);
            $("#bgPicList").click(this.setBgPicEvent);
            $("#picPanel").click(this.setPicEvent);

            $("#phonescreen")
				.bind("mousedown", this.mousedown)
				.bind("mousemove", this.mousemove)
				.bind("mouseup", this.mouseup)
				.bind("contextmenu", this.showContextMenu);

            //注释掉的时间都是 html动态加载的 只能绑定一次 所以就写到标签上了
            //可以优化
            //$("#fonttoolbar").on("click", this.fontbarEvent);
            //            $("#cm_edit").bind('click', this.editFont);
            //            $("#cm_delete").bind('click', this.deleteObj);
            //            $("#cm_animat").bind('click', this.animatEvent);

            $("#contextmenu").click(this.clickContextMenu);
            //删除和选中事件
            $("#pageList").click(this.pageTabEvent);
            $("#menuSave").click(this.saveEvent);
            $("#con_my").click(this.myAppPanelEvent);
        },
        saveEvent: function () {

        },
        myAppPanelEvent: function (e) {
            var tagName = e.target.tagName;
            if (tagName == "SPAN") {
                var index = Number($(e.target).parent().attr("index"));
                etouch.removePage(index);
            }
            else if (tagName == "A") {
                var index = Number($(e.target).parent().attr("index"));
                etouch.showPage(index);
            }
            else if (tagName == "P") {
                var index = Number($(e.target).attr("index"));
                etouch.showPage(index);
            }
        },
        pageTabEvent: function (e) {
            var tagName = e.target.tagName;
            if (tagName == "SPAN") {
                var index = Number($(e.target).parent().attr("index"));
                etouch.removePage(index);
            }
            else if (tagName == "A") {
                var index = Number($(e.target).parent().attr("index"));
                etouch.showPage(index);
            }
            else if (tagName == "P") {
                var index = Number($(e.target).attr("index"));
                etouch.showPage(index);
            }
        },
        animatEvent: function () {
            if (etouch.editTarget) {
                $(".cover").show();
                $("#animatPanel").show();
            }
        },
        deleteObj: function () {
            if (etouch.editTarget) {
                if (etouch.editTarget[0].id == "audio_btn") {
                    etouch.editTarget.hide();
                    $("#media")[0].pause();
                }
                else {
                    etouch.editTarget.remove();
                }
            }
        },
        //字体改变颜色
        changeColor: function (color) {
            etouch.editTarget.css({ "color": color });
        },
        fontbarEvent: function (e) {
            e = e || window.event;
            $("#fontsizelist").hide();
            var target = e.target;
            if (target.tagName == "A") {
                var id = target.id;
                if (id == "size") {
                    $("#fontsizelist").show();
                }
                else if (id == "color") {
                    $("#colorpicker").click();
                }
                else if (id == "bolder") {
                    //粗体
                    etouch.editTarget.css({ "fontWeight": "bolder" });
                }
            }
            else if (target.tagName == "LI") {
                var size = Number($(target).attr("val"));
                etouch.editTarget.css({ "fontSize": size });
            }
        },
        editFont: function () {
            var target = etouch.editTarget;
            if (target.attr("type") == "editdiv") {
                var span = target.find("span");
                span.attr("contenteditable", "true");
                etouch.isEdit = true;
                //选中
                var selection = window.getSelection();
                selection.selectAllChildren(span[0]);
                var x = target.position().left;
                var y = target.position().top;
                $("#fonttoolbar").css({ top: y - 40, left: x + 20 });
                $("#fonttoolbar").show();
            }
        },
        mouseup: function (e) {
            etouch.moveTarget = null;
            etouch.resizeTarget = null;
            $("#contextmenu").find("li").show();
            $("#contextmenu").hide();
        },
        toRem: function (num) {
            return (num / 16) + "rem";
        },
        mousemove: function (e) {
            if (etouch.resizeTarget != null) {//缩放
                var et = etouch;
                var target = $(etouch.resizeTarget);
                //上下左右  左上 左下 右上 右下
                var h = target.parent().height();
                var w = target.parent().width();
                var className = target.attr("class");
                var parentDom = target.parent();
                var top = parentDom.position().top;
                var left = parentDom.position().left;
                e.movementY = e.clientY - target[0].oy;
                e.movementX = e.clientX - target[0].ox;
                target[0].oy = e.clientY;
                target[0].ox = e.clientX;

                if (className.indexOf("bar-ne") != -1) {
                    parentDom.width(et.toRem(w + e.movementX));
                    parentDom.height(et.toRem(h - e.movementY));
                    parentDom.css("top", et.toRem(top + e.movementY));
                }
                else if (className.indexOf("bar-nw") != -1) {
                    parentDom.width(et.toRem(w - e.movementX));
                    parentDom.css("left", et.toRem(left + e.movementX));
                    parentDom.height(et.toRem(h - e.movementY));
                    parentDom.css("top", et.toRem(top + e.movementY));
                }
                else if (className.indexOf("bar-sw") != -1) {
                    parentDom.width(et.toRem(w - e.movementX));
                    parentDom.css("left", et.toRem(left + e.movementX));
                    parentDom.height(et.toRem(h + e.movementY));
                }
                else if (className.indexOf("bar-se") != -1) {
                    parentDom.width(et.toRem(w + e.movementX));
                    parentDom.height(et.toRem(h + e.movementY));
                }
                else if (className.indexOf("bar-s") != -1) {
                    parentDom.height(et.toRem(h + e.movementY));
                }
                else if (className.indexOf("bar-n") != -1) {
                    parentDom.height(et.toRem(h - e.movementY));
                    parentDom.css("top", et.toRem(top + e.movementY));
                }
                else if (className.indexOf("bar-e") != -1) {
                    parentDom.width(et.toRem(w + e.movementX));
                }
                else if (className.indexOf("bar-w") != -1) {
                    parentDom.width(et.toRem(w - e.movementX));
                    parentDom.css("left", et.toRem(left + e.movementX));
                }

            }
            else if (etouch.moveTarget != null) {
                var target = etouch.moveTarget;
                var x = e.clientX - $(this)[0].offsetLeft;
                var y = e.clientY - $(this)[0].offsetTop;
                if (!target.relativeLeft) {
                    target.relativeLeft = x - target.offsetLeft;
                    target.relativeTop = y - target.offsetTop;
                }
                x = x - target.relativeLeft;
                y = y - target.relativeTop;
                var perX = x / 16 + 'rem'; //rem相对位置
                var perY = y / 16 + 'rem';
                $(target).css({ top: perY, left: perX });
            }
            e.preventDefault();
        },
        mousedown: function (e) {
            if (e.button != 0) return; //不处理右键
            var target = e.target;

            var className = target.getAttribute("class");
            var type = $(target).attr("type");
            if (className && className.indexOf("bar") != -1) {
                if (className == "bar-radius") {
                    target = target.parentNode;
                }
                etouch.resizeTarget = target;
                target.ox = target.clientX; //老的x y 用于计算每次移动的距离
                target.oy = target.clientY;
            }
            else if (type && type.indexOf("drag_inner") != -1) {
                target = target.parentNode;
                $(".bar").hide();
                $(target).find(".bar").show();
                etouch.moveTarget = target;
                etouch.moveTarget.relativeLeft = null;
                etouch.moveTarget.relativeTop = null;
            }
            else if (className && className.indexOf("pageitem") != -1) {
                etouch.isEdit = false;
                $("#fonttoolbar").hide();
                $(".bar").hide();
                $("span[contenteditable=true]").removeAttr("contenteditable");
            }
            //e.preventDefault(); //防止粘连现象
        },
        clickContextMenu: function (e) {
            $("#contextmenu").hide();
        },
        showContextMenu: function (e) {
            var target = $(e.target);
            console.log(target);
            if (e.target.id == 'audio_btn') {
                etouch.editTarget = $(target);
                var x = e.clientX - $(this)[0].offsetLeft;
                var y = e.clientY - $(this)[0].offsetTop;
                $("#contextmenu").css({ position: 'absolute', top: y, left: x });
                $("#cm_edit,#cm_animat").hide();
                $("#contextmenu").show();
            }
            else if (etouch.currentPageIndex != -1 && etouch.isPageItem(e.target) == false) {
                var type = target.attr("type");
                //寻找最外层
                if (type === undefined || type.indexOf("edit") == -1) {
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
        isPageItem: function (target) {
            var className = target.getAttribute("class");
            if (className == null
            || className.indexOf("pageitem") == -1)
                return false;
            else
                return true;
        },
        //加载JSON数据
        loadData: function () {
            var html = localStorage.designHTML;
            if (html) {
                $("#phonescreen").html(html);
                $("#media")[0].pause();
                var pageSize = $("#phonescreen .pageitem").size();
                if (pageSize > 0) {
                    //加载页面列表
                    for (var i = 0; i < pageSize; i++) {
                        etouch.addPageTab(i);
                    }
                    etouch.showPage(0);
                }
            }
        },
        //添加右侧页面的tab
        addPageTab: function (index) {
            var currentPageLen = index + 1;
            var pageList = $("#pageList");
            //选中当前页面
            pageList.append("<p name='pageTab' index='" + index + "'><a>第" + currentPageLen + "页</a><span name='deletePage'>╳</span></p>");
            etouch.showPage(index);
            pageList[0].scrollTop = pageList[0].scrollHeight;
        },
        //添加页面 包括 页面tab
        addPage: function (e) {
            if ($("#webappId").val() == "0") {
                alert("请先添加或选择APP，然后再添加页面");
                return;
            }
            var index = $("#pageList p[name='pageTab']").size();
            $("#phonescreen").append("<div class='pageitem'></div>");
            etouch.addPageTab(index);
            window.event.stopPropagation();
            window.event.preventDefault();
        },
        removePage: function (index) {
            var removePageObj = $("#phonescreen .pageitem").eq(index);
            //如果删除当前页 则选择另外的页面显示
            if (removePageObj.css("display") != 'none') {
                if ($("#phonescreen .pageitem").length != 1) {
                    var showIndex = index == 0 ? 1 : index - 1;
                    etouch.showPage(showIndex);
                }
            }
            removePageObj.remove();
            $("#pageList span[name='deletePage']").eq(index).parent().remove();
            if ($("#phonescreen .pageitem").size() == 0) {
                etouch.currentPageIndex = -1;
            }
            else {
                //重新排序
                $("#pageList span[name='deletePage']").each(function (i, obj) {
                    $(obj).parent().attr("index", i);
                    $(obj).parent().find("a").text("第" + (i + 1) + "页");
                    if ($(obj).parent().css("backgroundColor") === "") {
                        etouch.currentPageIndex = i;
                    }
                });
            }
        },
        havePage: function () {
            return etouch.currentPageIndex != -1 ? true : false;
        },
        setBgPic: function (pageIndex, bgUrl) {
            var pageItem = $("#phonescreen .pageitem").eq(pageIndex)[0];
            pageItem.style.backgroundImage = "url('" + bgUrl + "')";
        },
        //设置图片地址
        setBgPicEvent: function (e) {
            if (e.target.tagName == "IMG") {
                if (etouch.havePage()) {
                    var path = $(e.target).attr("path");
                    etouch.setBgPic(etouch.currentPageIndex, path);
                }
                $(".cover").hide();
                $("#bgPanel").hide();
            }
        },
        setPicEvent: function (e) {
            if (e.target.tagName == "IMG") {
                if (etouch.havePage()) {
                    var path = $(e.target).attr("path");
                    var page = etouch.getCurrentPage();
                    var id = "editpic" + new Date().getTime();
                    page.append("<div id='" + id + "' type='editpic' draggable='true' class='comp-resize defaultpicstyle'><img type='drag_inner_img' src='" + path + "'/></div>");
                    $("#" + id).append($("#resizeborder").html());
                    $("#" + id).find(".bar").hide();
                }
                $(".cover").hide();
                $("#picPanel").hide();
            }
            //e.stopPropagation();
            //e.preventDefault();
        },
        showPage: function (index) {
            etouch.currentPageIndex = index;
            $("#phonescreen .pageitem").hide();
            $("#phonescreen .pageitem").eq(index).show();
            $("#pageList p").css("backgroundColor", "#E1E1E1");
            $("#pageList p").eq(index).css("backgroundColor", "");
        },
        addText: function () {
            if (etouch.currentPageIndex == -1) {
                alert("请先添加页面");
                return;
            }
            var id = "editdiv" + new Date().getTime();
            etouch.getCurrentPage().append("<div id='" + id + "' type='editdiv' draggable='true' class='comp-resize defaultfontstyle' name='pagefont'><span type='drag_inner_text'>请在这里编辑</span></div>");
            $("#" + id).append($("#resizeborder").html());
            $("#" + id).find(".bar").hide();
        },
        addPic: function () {
            if (etouch.currentPageIndex == -1) {
                alert("请先添加页面");
                return;
            }
            $(".cover").show();
            $("#picPanel").show();
            //etouch.append("<img id='imgap' src='http://res.eqxiu.com/group1/M00/BB/5F/yq0KA1Ru0-WASRNsAABwW066NG0877.png'/>");
        },
        removePic: function () { },
        addBackgroundPic: function () {
            //添加背景
            if (etouch.currentPageIndex == -1) {
                alert("请先添加页面");
                return;
            }
            $(".cover").show();
            $("#bgPanel").show();
        },
        removeBackgroundPic: function () { },
        addAnimat: function () { },
        removeAnimat: function () { },
        addAudio: function () { },
        removeAudio: function () { },
        addVideo: function () { },
        removeVideo: function () { },
        clear: function () {
            $("#hidArea").html("");
            $("#phonescreen .pageitem").remove();
            localStorage.webAppHTML = "";
            localStorage.designHTML = "";
            $("#pageList p").remove();
            etouch.dragTarget = null; //当前拖拽的物体
            etouch.currentPageIndex = -1; //-1表示没有页面
            etouch.isEdit = false; //是否文字编辑状态
            etouch.editTarget = null; //右键目标
            etouch.moveTarget = null; //拖拽目标
            etouch.resizeTarget = null; //缩放目标
            $("#webappId").val(0);
            $("#webappName").val("");
            $(".scene_title").text("");
        },
        save: function () {
            //持续保存
            if (etouch.havePage()) {
                //删除没用的标签
                var originHtml = $("#phonescreen").html();
                $("#hidArea").html(originHtml);
                $("#hidArea .pageitem")
					.css('display', '')
					.addClass("page")
					.eq(0).addClass("current");
                $("#hidArea").find("#contextmenu").remove();
                $("#hidArea").find("#fonttoolbar").remove();
                $("#hidArea .bar").remove();
                var simpleHtml = $("#hidArea").html();
                $("#hidArea").html("");
                localStorage.webAppHTML = simpleHtml;
                localStorage.designHTML = originHtml;
            }
        }
    }
    etouch.init();
});