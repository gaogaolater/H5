$(function(){
	$("#audio_btn").click(function(){
		var className = $(this).attr("class");
		if(className.indexOf("rotate")!=-1){
			$(this).removeClass("rotate");
			$("#media")[0].pause();
		}
		else{
			$(this).addClass("rotate");
			$("#media")[0].play();
		}
	});
});