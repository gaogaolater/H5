$(function () {
    //设置图片 背景图
    getResource(1);
    getResource(2);
    getResource(3);
    loadAppList();
    var audio = $("#media")[0];
    playPause = function (obj) {
        var control = $(obj);
        var path = control.attr("path");
        if (control.attr("class") == "pause") {
            control.removeClass("pause");
            audio.pause();
        }
        else {
            audio.pause();
            $("#audioList").find(".pause").removeClass("pause");
            control.addClass("pause");
            if (audio.src.endsWith(path) == false) {
                audio.src = path;
            }
            audio.play();
        }
    }
    setBgAudio = function (obj) {
        var path = $(obj).attr("path");
        $("#audioPanel").hide();
        $("#audio_btn").show();
        $("#media").attr("src", path);
        audio.pause();
        $(".cover").hide();
    }
    preview = function () {
        var id = Number($("#webappId").val());
        if (id <= 0) {
            alert("请选择要预览的APP");
            return;
        }
        else {
            window.open("/home/preview?id=" + id);
        }
    }
    //显示左侧con_my的tab
    showAppTab = function (id) {
        var selectedId = getSelectedAppId();
        //        if (selectedId == id) {
        //            window.event.stopPropagation();
        //            return;
        //        }
        if (id != selectedId && selectedId != -1) {
            //            if (confirm("您还未保存，需要保存么？")) {
            //                $("#menuSave").click();
            //            }
            //            else {
            //                return;
            //            }
        }
        $("#con_my .current").removeClass("current");
        $("#appTab" + id).addClass("current");
        $.post('/homeajax/getappbyid', { id: id }, function (obj) {
            etouch.clear();
            localStorage.designHTML = decodeURIComponent(obj.DesignHTML);
            $(".scene_title").text(obj.Name);
            $("#webappId").val(obj.AppId);
            $("#webappName").val(obj.Name);
            etouch.loadData();
        });
    }

    function getSelectedAppId() {
        if ($("#con_my .current").size() <= 0) {
            return -1;
        }
        var selectedId = $("#con_my .current").attr("id").replace("appTab", "");
        selectedId = Number(selectedId);
        return selectedId;
    }

    deleteApp = function (id) {
        if (confirm("确定要删除么？")) {
            var selectedId = getSelectedAppId();
            $.post('/homeajax/deleteappbyid', { id: id }, function (obj) {
                etouch.clear();
                if (id == selectedId) {
                    loadAppList();
                }
                else {
                    //loadAppList(selectedId);
                }
            });
        }
    }

    function saveWebApp() {
        etouch.save();
        var name = $("#webappName").val();
        var webappId = $("#webappId").val();
        if (name == '' || name == null) {
            name = prompt("请输入应用的名称", "")
            if (!name) {
                return;
            }
        }
        var data = {
            webAppHTML: encodeURIComponent(localStorage.webAppHTML),
            designHTML: encodeURIComponent(localStorage.designHTML),
            id: webappId,
            name: name,
            state: 1
        };
        $.post('/homeajax/saveapp', data, function (obj) {
            console.log(obj);
            if (obj.success) {
                //加载app列表
                loadAppList(obj.data);
                $("#webappId").val(obj.data);
            }
            else {
                alert("保存失败");
            }
        });
    }

    //保存
    $("#menuSave").click(saveWebApp);

    function loadAppList(selectedIndex) {
        localStorage.designHTML = "";
        $.post('/homeajax/getapplist', function (obj) {
            $("#con_my").html("");
            if (obj instanceof Array && obj.length > 0) {
                for (var i = 0; i < obj.length; i++) {
                    var app = obj[i];
                    if (i == 0 && selectedIndex == undefined) {
                        selectedIndex = app.AppId;
                    }
                    $("#con_my").append("<p onclick='showAppTab(" + app.AppId + ")' id='appTab" + app.AppId + "'><a>" + app.Name + "</a><span onclick='deleteApp(" + app.AppId + ")'>╳</span></p>");
                }
                showAppTab(selectedIndex);
            }
            else {
                etouch.clear();
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
                else if (type == 3) { $("#audioList").html(""); }
                if (obj instanceof Array) {
                    if (type == 3) {
                        audio.pause();
                        var html = template('audioTmp', obj);
                        document.getElementById('audioList').innerHTML = html;
                        return;
                    }
                    for (var i = 0; i < obj.length; i++) {
                        var id = obj[i].id;
                        var path = obj[i].path;
                        if (type == 1) {
                            $("#bgPicList").append("<img rid='" + id + "' path='" + path + "' src='" + path + "'/>");
                        }
                        else if (type == 2) {
                            $("#picList").append("<img rid='" + id + "' path='" + path + "' src='" + path + "'/>");
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

    //添加app
    $("#addApp").click(function (e) {
        var name = prompt("请输入应用的名称", "")
        if (name) {
            etouch.clear();
            $(".scene_title").text(name);
            $("#webappId").val(0);
            $("#webappName").val(name);
            saveWebApp();
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

    $("#menuAddAudio").click(function () {
        //添加背景
        if (etouch.currentPageIndex == -1) {
            alert("请先添加页面");
            return;
        }
        $(".cover").show();
        $("#audioPanel").show();
    });

    $("#audioPanelClose").click(function () {
        $("#audioPanel").hide();
        $(".cover").hide();
    });

    $("#audioPanelUpload").click(function () {
        $("#type").val(3);
        $("#file").click();
    });
})