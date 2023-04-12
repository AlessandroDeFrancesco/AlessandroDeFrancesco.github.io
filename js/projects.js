/* CHARACTER MOVEMENTS */
var upIsPressed = false;
var downIsPressed = false;

var heightRatio = 1; // to scale some distances

var minWindowWidth = 1500;
var minWindowHeight = 1200;
var distanceToShowElements = 700;
var distancePerIteration = 10; // when the user press the buttons to move, move the world for 10 pixels because 1 pixel of the images is 10 times bigger
var pitBottom = 18380; // the pixels needed to reach the bottom

var characterStatus = 0; // 0 beginning, 1 descending
var initialAnimationRunning = false;
var pixelMe = $('#pixelme');
var world = $('#world');
var divsToShow = $('.showing');
var manaMakerBaloon = $("#baloon");
var imageModalDiv = $("#imageModalDiv");

var linkSimpleProjectTimeout;

function keyDown(isUpKey){
	if(isUpKey){
		upIsPressed = true;
	} else {
		downIsPressed = true;
	}
}

function keyUp(isUpKey){
	if(isUpKey){
		upIsPressed = false;
	} else {
		downIsPressed = false;
	}
}

$(document).ready(function(){
	// set the pit length
	$("#pit").css("height", (pitBottom - 240)+"px");
	$("#pit-treasure").css("top", (pitBottom - 390)+"px");
	
	// initial animations
	$('#pixelme').addClass("fadeInDownBig");
	$("#instructions").addClass("bounceInRight").css("animation-delay", "1s").css("visibility", "visible");
	
	// link to simpleprojects.html
	$('#icon-simple-projects').click(function(){
		$('#link-to-simple-projects').css('display', 'block');
		addAnimation($('#link-to-simple-projects'), 'slideInLeft');
		clearTimeout(linkSimpleProjectTimeout);
		// make disappear the link after 3 sec
		linkSimpleProjectTimeout = setTimeout(function(){
			$('#link-to-simple-projects').css('display', 'none');
		}, 3000);
	});
	
	// move the world with the arrow keys or click or touch
	$(document).bind("mousedown touchstart", function(e) {
		var clickPosition = pointerEventToXY(e);
		var windowHeight = window.innerHeight;
		var elem = document.elementFromPoint(clickPosition.x, clickPosition.y);
		if(elem.className.indexOf('clickable') < 0 && $(elem).parents('.clickable').length == 0){ // no ancestor has the showing class
			if(clickPosition.y < windowHeight * 0.35){ // not exactly 50% of screen height to give go down movement priority
				upIsPressed = true;
			} else {
				downIsPressed = true;
			}
		}
	});
	$(document).bind("mouseup touchend", function(e) {
		upIsPressed = false;
		downIsPressed = false;
	});

	$(window).keydown(function(event) { if(event.which == 38 || event.which == 40)keyDown(event.which == 38) });
	$(window).keyup(function(event) { if(event.which == 38 || event.which == 40)keyUp(event.which == 38) });
	
	// images zoom when clicked
	var modal = document.getElementById('imageModalDiv');
	var closeImage = document.getElementById("closeImage");
	var screenshots = document.getElementsByClassName('screenshot');
	for (i = 0; i < screenshots.length; i++) {
		screenshots[i].onclick = function(){
			modal.style.display = "block";
			
			modalImg = $("#imageModal");
			modalImg.attr("src", this.src);
			
			if(this.width/this.height > 1) {
				modalImg.css("width", "80%");
				modalImg.css("height", "auto");
			} else {
				modalImg.css("width", "auto");
				modalImg.css("height", "80%");
			}
		};
	}
	
	closeImage.onclick = modal.onclick = function() { 
		modal.style.display = "none";
	}
	
	// resize to fit the screen
	window.onresize = adaptContentSizeToWindow;
	adaptContentSizeToWindow();
});

// return the position of mouse/touch of an event
var pointerEventToXY = function(e){
	var out = {x:0, y:0};
	if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
		var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		out.x = touch.pageX;
		out.y = touch.pageY;
	} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
		out.x = e.pageX;
		out.y = e.pageY;
	}
	return out;
};

function adaptContentSizeToWindow(){
	// adapt the size of the content to the size of the window
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	
	heightRatio = windowHeight/minWindowHeight;
	
	var r = 1;
	r = Math.min(windowWidth / minWindowWidth, windowHeight / minWindowHeight); // based on the minimum acceptable sizes
	
	$("#all").css({
		'-webkit-transform': 'scale(' + r + ')',
		'-moz-transform': 'scale(' + r + ')',
		'-ms-transform': 'scale(' + r + ')',
		'-o-transform': 'scale(' + r + ')',
		'transform': 'scale(' + r + ')',
		'transform-origin': 'left top'
	});
	
	// top link to simpleproject resize
	$('#link-to-simple-projects-container').css({
		'-webkit-transform': 'scale(' + r + ')',
		'-moz-transform': 'scale(' + r + ')',
		'-ms-transform': 'scale(' + r + ')',
		'-o-transform': 'scale(' + r + ')',
		'transform': 'scale(' + r + ')',
		'transform-origin': 'left top'
	});
}

// MOVEMENT
setInterval(function() {
	if(imageModalDiv.css("display") != "none")
		return;
	
	if(upIsPressed || downIsPressed){
		if(characterStatus == 0){
			startInitialAnimation();
		} else {
			pixelMe.css("background-image", "url(img/pixelme_hanging_active.gif)");
			var yMovement = (downIsPressed ? distancePerIteration : 0) - (upIsPressed ? distancePerIteration : 0);
			
			// move the world, when the user presses the keys or the touch
			moveWorld(yMovement, -pitBottom, 0);
		}
	} else if(characterStatus == 1) {
		if(parseInt(world.css("top"), 10) > -pitBottom)
			pixelMe.css("background-image", "url(img/pixelme_hanging_idle.gif)");
		else
			pixelMe.css("background-image", "url(img/pixelme_happy.gif)");
	}
}, 20);

// move the world and show the divs with animation
function moveWorld(yMovement, minY, maxY){
	world.css({
        top: function(index, oldValue) {
            var newValue = parseInt(oldValue, 10) - yMovement;
			return newValue < minY ? minY : newValue > maxY ? maxY : newValue;
        }
    });
	
	// check the position of all elements, if is near the character, show it
	for (i = 0; i < divsToShow.length; i++) {
		var divYPosition = $(divsToShow[i]).offset().top;
		if( divYPosition < distanceToShowElements * heightRatio){
			// show it and remove from list
			bounceInAnimation($(divsToShow[i]));
			divsToShow.splice(i, 1);
			i--;
		}
	}
	
	// check for the manaMakerBaloon near Mana Maker
	var worldPos = parseInt(world.css("top"), 10);
	if( worldPos < -4400 && worldPos  > -6600){
		manaMakerBaloon.css("display","block");
	} else {
		manaMakerBaloon.css("display","none");
	}
}

function startInitialAnimation(){
	// JUMP!!
	if(!initialAnimationRunning){
		initialAnimationRunning = true;
		pixelMe.css("background-image", "url(img/pixelme_start_jump.gif)");
		
		setTimeout( function(){
			pixelMe.css("top", "280px");
			pixelMe.css("width", "360px");
			pixelMe.css("height", "300px");
			pixelMe.css("background-image", "url(img/pixelme_middle_jump.gif)");
		}, 650);
		
		setTimeout(function(){
				pixelMe.css("top", "270px");
				pixelMe.css("left", "220px");
				pixelMe.css("width", "180px");
				pixelMe.css("height", "260px");
				pixelMe.css("background-image", "url(img/pixelme_hanging_idle.gif)");
				characterStatus = 1;
		}, 1300 + 650);
	}
}

function moveCharacter(character, yMovement, xMovement){
	character.css({
        top: function(index, oldValue) {
            var newValue = parseInt(oldValue, 10) + yMovement;
			return newValue;
        }
    });
	character.css({
        left: function(index, oldValue) {
            var newValue = parseInt(oldValue, 10) + xMovement;
			return newValue;
        }
    });
}

function bounceInAnimation(el) {
	el.css("visibility", "visible");
	el.addClass("animated");
	el.addClass('bounceInRight');
}

function addAnimation(el, animationName) {
	el.removeClass(animationName).addClass("animated").offsetHeight;
	el.addClass(animationName);
}

