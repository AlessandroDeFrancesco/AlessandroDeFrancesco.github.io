$(window).load(function () {
	// fade in animations delayed at the page load
    var animations = $(".animated");
	for(i=0; i<animations.length-1; i++){
		$(animations[i]).addClass("animated").addClass("fadeInDown").css("animation-delay", (0.5*i)+"s");
	}
	$("#button-start").addClass("bounceInDown").css("animation-delay", (0.5*animations.length-1)+"s");
	// button hanging for the first click
	$("#button-start").click(function() {
		$("#button-start").off();
		$("#button-start").removeClass();
		$("#button-start").addClass("animated").addClass("hinge").css("animation-delay", "0s");
		$("#text").html("[OOOPS! Something went wrong, i'll fix it right away..]");
		
		setTimeout(function(){
			$("#text").html("[Done, you can safely click it now.]");
			$("#button-start").removeClass().addClass("animated").addClass("bounceInDown");
			$("#button-start").click(function() {
				document.location = "projects.html";
			});
		}, 2500);
	});
	// if the javascript is loaded, remove the fallback link to projects_simple
	$("#fallback-link").remove();
})