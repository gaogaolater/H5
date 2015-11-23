$(function () {
    //自动缩放
    var wrapW = $("#phonescreen").width();
    var percent = Math.round(wrapW / 322 * 100) + "%";
    $("html").css("font-size", percent);
    var audioDiv = $("#audio_btn");
    var audioDivHtml = audioDiv.prop("outerHTML");
    $(document.body).append(audioDivHtml);
    audioDiv.remove();
    //滑屏效果
    runSection = new FullPage({
        id: 'phonescreen',                            // id of contain
        slideTime: 800,                               // time of slide
        effect: {                                     // slide effect
            transform: {
                translate: 'Y', 				   // 'X'|'Y'|'XY'|'none'
                scale: [0, 1], 				   // [scalefrom, scaleto]
                rotate: [0, 0]					   // [rotatefrom, rotateto]
            },
            opacity: [0, 1]                           // [opacityfrom, opacityto]
        },
        mode: 'touch,wheel',               // mode of fullpage
        easing: [0, .93, .39, .98],
        callback: function (index, thisPage) {     // callback when pageChange
            if (index === 0) {
                //autoPlay(runPage.thisPage() + 1);
            } else {
                //clearTimeout(interval);
            }
        }
    });

    //音乐按钮
    $("#audio_btn").click(function () {
        var className = $(this).attr("class");
        if (className.indexOf("rotate") != -1) {
            $(this).removeClass("rotate");
            $("#media")[0].pause();
        }
        else {
            $(this).addClass("rotate");
            $("#media")[0].play();
        }
    });
});