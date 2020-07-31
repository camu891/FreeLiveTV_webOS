 var $ = jQuery.noConflict();
 var settings = {
	PREVIEW: "isPreviewEnable",
	LAST_VIEW: "lastView",
	USER: "user",
}
var programs = null;
var totalPragrams = 0;
var tabindex = 0;
var allPrograms = [];
var navigationControl = {};
var retries = 0;

function getSettings(key){
	return typeof(Storage) !== "undefined" ? localStorage.getItem(key) : null;
}

function saveSettings(key,value){
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(key, value);
	} else {
		console.log("Sorry, your browser does not support Web Storage...");
	}
}

function removeSettings(key) {
	if (typeof(Storage) !== "undefined") {
		localStorage.removeItem(key);
	} else {
		console.log("Sorry, your browser does not support Web Storage...");
	}
}

$(document).ready(function(){
	
	$(".logout").on("click",logout);
	
	getdate();
	
	ajaxLoadPrograms();
	
	$('.icon-app').on("click",function(){
		ajaxLoadPrograms();
	});
	
	$('.reload').on("click",function(){
		ajaxLoadPrograms();
	});
	
	$('.search-icon').on("click",function(){
		showSearchInput(this);
	});
	
	$("#search").on("click",function(){
		tabindex=0;
	});
	
	$('#container_programs').click(function(){
		hideSearchInput();
	});

});

function showSearchInput(elem){
	$(this).css('visibility', 'hiden');
	$(".search-container").show();
	$("#search").focus();
}

function hideSearchInput(){
	$(".search-container").hide();
	$(".search-icon").css('visibility', 'visible');
}

function ajaxLoadPrograms(){
	retries++;
	$('#container_programs').empty();
	var loader = $(".content-loader");
	var error = $(".content-error-request");
	error.hide();
	loader.show();
	$.ajax({
		url: appConfig.URL_PROGRAMS_PROD,
		dataType: "json"
	}).done(function(json) {
		loader.hide();
		$("ul.nav-tabs").empty();
		var index = 0;
		$.each(json.programs, function(pos,items) {
			totalPragrams++;
			$.each(items, function(key, programs) {
				$.each(programs, function(i, program) {
					if(program.available){
						allPrograms.push(program)
						addProgramToCategory(key, program, index);
						index++;
						// MOUSEOVER
						$('#'+program.id).mouseenter(function() { 
						 	mouseOver(null,program.type,program.src);
						 });
					}
				});
			});
		});
		initNavTabs();
		setTabindex();
		initLastView();
	}).fail(function() {
		if (retries < 3) {
			setTimeout(function() {
				ajaxLoadPrograms();
			}, 3000);
		} else {
			loader.hide();
			error.show();
		}
		console.log("Fail request programs");
	});
}

function initLastView(){
	saveSettings(settings.LAST_VIEW, ''); //clear settings
	addLastViewCard(allPrograms);
	//two last view
	$(".card").click(function(){
		updateLastView($(this).attr("id"))
	});
}

function updateLastView(id){
	var array = [];
	var currentValues = JSON.parse(getSettings(settings.LAST_VIEW));
	if(!getSettings(settings.LAST_VIEW)){
		array[0] = id
	}else{
		if(id!== currentValues[0] && id !== currentValues[1]){
			array[0] = id;
			array[1] = currentValues[0];
		}else{
			array = currentValues;
		}
	}
	var values = JSON.stringify(array);
	saveSettings(settings.LAST_VIEW,values);
	addLastViewCard(allPrograms);
}

function addLastViewCard(allPrograms) {
	$(".last-view .lv-container").empty();
	var lastViews = JSON.parse(getSettings(settings.LAST_VIEW));
	var lastViewContainer = $(".last-view")
	if(lastViews){
		lastViewContainer.show();
		$.each(allPrograms, function(i, program) {
			if(program.id == lastViews[0] || program.id == lastViews[1]){		
					var data = getProgramData(program,i)
					$(data).appendTo(".last-view .lv-container")
				}
			});
		}else {
			lastViewContainer.hide();
		}
	}
	
	function addProgramToCategory(category, program, index){
		var categoryRef = "#" + category + "  div.programs-container";
		if($(categoryRef).length == 0) {
			$("#container_programs").append("<div class='category' id='"+category+"'><span class='category-title'>"
			+category+"</span><div class='programs-container row' id='list'></div></div>");
			addCategoryTab(category);
		}
		$(categoryRef).append(getProgramData(program, index))
	}
	
	function addCategoryTab(category){
		$("ul.nav-tabs").append("<li id='tab_"+category+"'>"+category+"</li>");
		$("ul.nav-tabs").ready(function(){
			$(".subheader").fadeIn();
		});
	}
	
	function initNavTabs(){
		$("ul.nav-tabs li").on("click",function(e){
			e.preventDefault();
			goToByScroll(this.id);
			return false;
		});
	}
	
	function goToByScroll(id) {
		id = id.replace("tab_", "");
		$('#container_programs').animate({scrollTop: 0 }, 0).animate({scrollTop: $('#'+id).offset().top - 130 }, 0);
		closeSidebar();
	}
	
	function getProgramData(program, index){
		// return "<div id='"+program.id+"' onmouseover=\"mouseOver(this,'"+program.type+"','"+program.src+"');\" onmouseout='mouseOut(this);'"
		// +" class='card content-box'><a id='link' class='program-link' name='"
		// +program.name+"' onClick='onSelectProgram("+JSON.stringify(program)+","+index+")'><div class='inner'><img class='programs-logo' src='"
		// +program.logo+"'><span class='channel-title'>"+program.name+"</span></div></a></div>";

		return "<div id='"+program.id+"' onmouseout='mouseOut(this);'"
		+" class='card content-box'><a id='link' class='program-link' name='"
		+program.name+"' onClick='onSelectProgram("+JSON.stringify(program)+","+index+")'><div class='inner'><img class='programs-logo' src='"
		+program.logo+"'><span class='channel-title'>"+program.name+"</span></div></a></div>";
	}
	
	function setTabindex(){
		var list = document.querySelectorAll("#list");
		var ti=1;
		for (var j = 0; j < list.length; j++) {
			var divs = list[j].getElementsByClassName("card");
			for (var i = 0; i < divs.length; i++) {
				divs[i].tabIndex = ti;
				ti++;
			}
		}
	}
	
	document.addEventListener("keydown", function(inEvent){
		console.log("button key: "+inEvent.keyCode);
		var itemsPerRow = 8;
		switch(inEvent.keyCode){
			case keyRemoteControl.ENTER:
			window.location = $('.programs-container > .content-box:focus > a').attr('href');
			break;
			case keyRemoteControl.NAVIGATION.LEFT:
			tabindex > 0 ? tabindex-- : tabindex;
			$('[tabindex=' + tabindex + ']').not(".hide").focus();
			//$('.card:focus').prev(".card").not(".hide").focus();
			break;
			case keyRemoteControl.NAVIGATION.RIGTH:
			if(tabindex == 0){
				tabindex = 1;
				$('[tabindex=' + tabindex + ']').not(".hide").focus();
			}else{
				tabindex < totalPragrams ? tabindex++ : tabindex;
				$('[tabindex=' + tabindex + ']').not(".hide").focus();
			}
			break;
			case keyRemoteControl.NAVIGATION.TOP:
			//tabindex = (tabindex >= itemsPerRow) ? tabindex-itemsPerRow : tabindex;
			//$('.programs-container > .content-box:focus').prevAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
			break;
			case keyRemoteControl.NAVIGATION.DOWN:
			/*if(tabindex==0){
				tabindex=1;
				$('.content-box').not(".hide").first().focus();
			}else{
				tabindex = (tabindex <= (totalPragrams-itemsPerRow)) ? tabindex+itemsPerRow : tabindex;
				$('.programs-container > .content-box:focus').nextAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
			}*/
			break;
			case keyRemoteControl.FAST_ACTIONS.RED:
			$('body').toggleClass('visible_menu');
			break;
			case keyRemoteControl.FAST_ACTIONS.GREEN:
			ajaxLoadPrograms();
			break;
			case keyRemoteControl.FAST_ACTIONS.YELLOW:
			$(".alert-dialog").fadeIn();
			break;
			case keyRemoteControl.FAST_ACTIONS.BLUE:
			if($(".search-container").is(":visible")){
				hideSearchInput()
			}else{
				showSearchInput($(".search-icon"));
			}
			break;
			case keyRemoteControl.CHANNEL.UP:
			moveToNextPrevChannel(navigationControl.next)
			break;
			case keyRemoteControl.CHANNEL.DOWN:
			moveToNextPrevChannel(navigationControl.previous)
			break;
			default:  break;
		}
	});

	function moveToNextPrevChannel(program){
		destroyPlayer()
		onSelectProgram(program, getIndexByObject(program))
		updateLastView(program.id)
		showHeaderOnInit()
	}
	
	function mouseOut(elem) {
		$(".preview").each(function(i,elem){
			$(elem).empty().hide()
		})
	}
	
	function mouseOver(elem,typeVideo,src) {
		if (getSettings(settings.PREVIEW) == "true") {
			var container = $(".preview");
			container.each(function(i,elem) {
				$(elem).empty().hide();
			});
		$.ajax({ cache: true,
			url: src,
			success: function () {
					if(typeVideo==="hls"){
						createNativeVideoPreview(container,src);
					}else if(typeVideo==="youtube" || typeVideo==="iframe"){
						createIframePreview(container,src);
					}			
			},
			error: function (e) {
			  console.log('error src')
			}
		  });
		}
	}
	
	function addSourceToVideoPrev(element, src, type) {
		var source = document.createElement('source');
		source.src = src;
		source.type = type;
		element.appendChild(source);
	}
	
	function createIframePreview(container,src){
		var iframe = document.createElement('iframe');
		iframe.src = src;
		iframe.setAttribute('id','smallIframe');
		iframe.setAttribute('class','ytplayer');
		iframe.setAttribute('frameborder', '0');
		iframe.setAttribute('allow' ,'autoplay; encrypted-media');
		iframe.setAttribute('allowFullScreen', '');
		iframe.width = "200px";
		iframe.height = "113px";
		container.append(iframe);
		container.show();		
	}

	function createNativeVideoPreview(container,src){
		var video = document.getElementById("video") 
		if (!video){
			video = document.createElement('video');
		}
		video.poster = "./assets/loading/loader-xs.gif";
		video.autoplay = true;
		video.setAttribute('id','video');
		video.setAttribute('class','hls');
		container.append(video);
		container.show();
		addSourceToVideoPrev(video, src, 'application/x-mpegURL');
	}
	
	$(document).ready(function(){
		$("#setting-preview").prop('checked', getSettings(settings.PREVIEW));
		$("#setting-preview").click(function() {
			saveSettings(settings.PREVIEW, $(this).is(':checked'));
		});
	});
	
	$(document).ready(function(){
		$("#alert-ok").click(function(){
			window.close();
		});
		$("#alert-cancel").click(function(){
			$(".alert-dialog").fadeOut();
		});
	});
	
	function onSelectProgram(program, index) {
		if (history.pushState) {
			var newurl = window.location.protocol + "//" + window.location.host 
			+ window.location.pathname + "?" + JSON.stringify(program);
			window.history.pushState({path:newurl},'',newurl);
		}
		var queryString = decodeURIComponent(window.location.search);
		queryString = queryString.substring(1);
		showPlayer(true)
		initPlayer(JSON.parse(queryString))
		updateNavigationControl(index)
	}
	
	function updateNavigationControl(index){
		var previous=allPrograms[index==0?allPrograms.length-1:index-1];
		var current=allPrograms[index];
		var next=allPrograms[index==allPrograms.length-1?0:index+1];
		navigationControl = {
			previous: previous,
			current: current,
			next: next
		}
	}
	
	function showPlayer(playerVisible) {
		if (playerVisible){
			$("#main-content").hide()
			$("#main-player").show()
		} else {
			$("#main-content").show()
			$("#main-player").hide()
		}	
	}
	
	function getIndexByObject(program){
		var index = allPrograms.map(function(e){return e.id;
		}).indexOf(program.id);
		return index;
	}

	function showSnackbar() {
		// Get the snackbar DIV
		var x = document.getElementById("snackbar");
	  
		// Add the "show" class to DIV
		x.className = "show";
	  
		// After 3 seconds, remove the show class from DIV
		setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
	  }
	