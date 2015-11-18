$(function () {
    //设置图片 背景图
    getResource(1);
    getResource(2);
    loadAppList();
    //显示左侧con_my的tab
    showAppTab = function (id) {
        $("#con_my .current").removeClass("current");
        $("#appTab" + id).addClass("current");
        $.post('/homeajax/getappbyid', { id: id }, function (obj) {
            etouch.clear();
            localStorage.designHTML = decodeURI(obj.DesignHTML);
            etouch.init();
        });
    }

    deleteApp = function (id) {
        $.post('/homeajax/deleteappbyid', { id: id }, function (obj) {
            etouch.clear();
            loadAppList();
        });
    }

    //保存
    $("#menuSave").click(function () {
        var name = $("#webappName").val();
        var webappId = $("#webappId").val();
        if (name == '' || name == null) {
            name = prompt("请输入应用的名称", "")
            if (!name) {
                return;
            }
        }
        var data = {
            webAppHTML: encodeURI(localStorage.webAppHTML),
            designHTML: encodeURI(localStorage.designHTML),
            id: webappId,
            name: name,
            state: 1
        };
        console.log(data);
        $.post('/homeajax/saveapp', data, function (obj) {
            console.log(obj);
            //加载app列表
            loadAppList();
        });
    });

    function loadAppList() {
        $.post('/homeajax/getapplist', function (obj) {
            $("#con_my").html("");
            if (obj instanceof Array) {
                for (var i = 0; i < obj.length; i++) {
                    var app = obj[i];
                    $("#con_my").append("<p onclick='showAppTab(" + app.AppId + ")' id='appTab" + app.AppId + "'><a>" + app.Name + "</a><span onclick='deleteApp(" + app.AppId + ")'>╳</span></p>");
                }
            }
        });
    }

    //上传回调
    uploadCallBack = function (obj) {
        console.log(obj);
        if (obj.success == true) {
            getResource(obj.type);
        }
        else {
            alert(obj.message);
        }
    }

    function getResource(type) {
        $.ajax({
            url: '/homeajax/getresource?type=' + type + '&v=' + new Date().getTime(),
            type: 'POST',
            success: function (obj) {
                if (type == 1) { $("#bgPicList").html(""); }
                else if (type == 2) { $("#picList").html(""); }
                if (obj instanceof Array) {
                    for (var i = 0; i < obj.length; i++) {
                        var id = obj[i].id;
                        var path = obj[i].path;
                        if (type == 1) {
                            $("#bgPicList").append("<img rid='" + id + "' path='" + path + "' src='" + path + "'/>");
                        }
                        else if (type == 2) {
                            $("#picList").append("<img rid='" + id + "' path='" + path + "' src='" + path + "'/>");
                        }
                        else if (type == 3) {

                        }
                        else if (type == 4) {

                        }
                    }
                }
            }
        });
    }

    $("#file").bind("change", function (e) {
        if (e.target.value) {
            $("#formUpload").submit();
        }
    });

    $("#bgPanelUpload").click(function () {
        $("#type").val(1);
        $("#file").click();
    });

    $("#picPanelUpload").click(function () {
        $("#type").val(2);
        $("#file").click();
    });

    $("#addApp").click(function () {
        var name = prompt("请输入应用的名称", "")
        if (name) {
            $(".scene_title").text(name);
            $("#webappId").val(0);
            $("#webappName").val(name);
            etouch.clear();
        }
    });

    //用click 样式可能会有问题
    $("#leftTab").bind("mousedown", function (e) {
        var target = $(e.target);
        var className = target.attr("class");
        if (className == "current") {
            return;
        }
        target.parent().find("span").removeAttr("class");
        target.parent().parent().find(".content").hide();
        target.attr("class", "current");
        var contentId = target.attr("target");
        $("#" + contentId).show();
        e.preventDefault();
    });

    $("#bgPanelClose").click(function () {
        $("#bgPanel").hide();
        $(".cover").hide();
    });
    $("#picPanelClose").click(function () {
        $("#picPanel").hide();
        $(".cover").hide();
    });
    $("#animatPanelClose").click(function () {
        $("#animatPanel").hide();
        $(".cover").hide();
    });
    //动画选择方式
    $("#animatType").bind("change", function () {
        var type = Number($("#animatType option:selected").val());
        if (type == 0 || type == 1) {
            $("#animatDirectionTr").hide();
        }
        else {
            $("#animatDirectionTr").show();
        }
    });

    //动画面板 点击确定
    $("#animatPanelOK").click(function () {
        var val = Number($("#animatType option:selected").val());
        if (val == 0) {
            etouch.editTarget.css("animation", "");
            $("#animatPanel").hide();
            return;
        }
        var direct = Number($("#animatDirection option:selected").val());
        var name = '';
        switch (val) {
            case 3:
                name = "bounceIn";
                break;
            case 2:
                name = "fadeIn";
                break;
            case 1:
                name = "fadeIn";
                break;
        }
        if (val == 2 || val == 3) {
            switch (direct) {
                case 3:
                    name += "Up";
                    break;
                case 2:
                    name += "Right";
                    break;
                case 1:
                    name += "Down";
                    break;
                case 0:
                    name += "Left";
                    break;
            }
        }
        var animatTime = $("#animatTime").val();
        var animatDelay = $("#animatDelay").val();
        var animatTimes = $("#animatTimes").val();
        var animatInfinite = $("#animatInfinite:checked").val();
        var count = animatInfinite == "on" ? "infinite" : animatTimes;
        var animateVal = name + " " + animatTime + "s linear " + animatDelay + "s " + count;
        etouch.editTarget.css("animation", animateVal);
        $("#animatPanel").hide();
        $(".cover").hide();
    });
})