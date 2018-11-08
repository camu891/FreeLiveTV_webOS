 var $ = jQuery.noConflict();
 
 var totalPragrams=0;
 $(document).ready(function(){
	
	getdate();
	
	ajax_load_programs();
	
	$('.icon-app').on("click",function(){
		ajax_load_programs();
	});
	
	$('.reload').on("click",function(){
		ajax_load_programs();
	});
	
	$('.search-icon').on("click",function(){
		showSearchInput(this);
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

function ajax_load_programs(){
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
		$.each(json.programs, function(i) {
			var link = "src="+json.programs[i].link + "&";
			var typeVideo = "type="+json.programs[i].type+"&";
			var title = "title="+json.programs[i].name+"&";
			var description = "description="+json.programs[i].description+"&";
			var params="?"+ link + typeVideo + title + description;
			
			addProgramToCategory(json.programs[i],params);
			totalPragrams++;
		});
		initNavTabs();
		set_tabindex();
	}).fail(function() {
		loader.hide();
		error.show();
		console.log("Fail request programs");
	});
}

function addProgramToCategory(program,params){
	var category = "#" + program.category + "  div.programs-container";
	if($(category).length == 0) {
		$("#container_programs").append("<div class='category' id='"+program.category+"'><span class='category-title'>"
		+program.category+"</span><div class='programs-container row' id='list'></div></div>");
		addCategoryTab(program.category);
	}
	$(category).append(get_program_data(program,params));
}

function addCategoryTab(category){
	$("ul.nav-tabs").append("<li id='tab_"+category+"'>"+category+"</li>");
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
	//$("body ,#container_programs").stop().animate({ scrollTop: $('#'+id).offset().top  }, 'slow');
	//$('#'+id)[0].scrollIntoView({ behavior: 'smooth', block: 'center' });	

	$('#'+id)[0].scrollIntoView(false);
	closeSidebar();
}

function get_program_data(program,params){
	return "<div onmouseover=\"mouseOver(this,'"+program.type+"','"+program.link+"');\" onmouseout='mouseOut(this);'"
	+" class='card content-box'><a id='link' class='program-link' name='"
	+program.name+"' href='player.html"+params+"'><div class='inner'><img class='programs-logo' src='"
	+program.logo+"'><span class='channel-title'>"+program.name+"</span></div></a></div>";
}

function set_tabindex(){
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

var tabindex=0;
document.addEventListener("keydown", function(inEvent){
	console.log("button key: "+inEvent.keyCode);
	var itemsPerRow = 8;
	switch(inEvent.keyCode){
		case 13://enter
		window.location = $('.programs-container > .content-box:focus > a').attr('href');
		break;
		case 37://left
		tabindex > 0 ? tabindex-- : tabindex;
		$('[tabindex=' + tabindex + ']').not(".hide").focus();
		//$('.card:focus').prev(".card").not(".hide").focus();
		break;
		case 39://right
		if(tabindex==0){
			tabindex=1;
			$('[tabindex=' + tabindex + ']').not(".hide").focus();
		}else{
			tabindex < totalPragrams ? tabindex++ : tabindex;
			$('[tabindex=' + tabindex + ']').not(".hide").focus();
		}
		break;
		case 38://top
		//tabindex = (tabindex >= itemsPerRow) ? tabindex-itemsPerRow : tabindex;
		//$('.programs-container > .content-box:focus').prevAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
		break;
		case 40://down
		/*if(tabindex==0){
			tabindex=1;
			$('.content-box').not(".hide").first().focus();
		}else{
			tabindex = (tabindex <= (totalPragrams-itemsPerRow)) ? tabindex+itemsPerRow : tabindex;
			$('.programs-container > .content-box:focus').nextAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
		}*/
		break;
		case 403://red
		$('body').toggleClass('visible_menu');
		break;
		case 404://green
		break;
		case 405://yelow
		break;
		case 406://blue
		showSearchInput($(".search-icon"));
		break;
		default:  break;
	}
	console.log(tabindex);
});

$(document).ready(function(){
	$("#search").on("click",function(){
		tabindex=0;
	});
});

function mouseOut(elem) {
	$(".preview").empty();
	$(".preview").hide();
}

function mouseOver(elem,typeVideo,link) {
	if (getSettings("isPreviewEnable")=="true") {
		var container = $(".preview");
		//container.empty()
		container.show();
		if(typeVideo==="hls"){
			createNativeVideo(container,link);
		}else if(typeVideo==="youtube" || typeVideo==="iframe"){
			createIframe(container,link);
		}
	}
}

function addSourceToVideo(element, src, type) {
	var source = document.createElement('source');
	source.src = src;
	source.type = type;
	element.appendChild(source);
}

function createIframe(container,src){
	var iframe = document.createElement('iframe');
	iframe.src = src;
	iframe.setAttribute('class','ytplayer');
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('allow' ,'autoplay; encrypted-media');
	iframe.setAttribute('allowFullScreen', '');
	iframe.width = "200px";
	iframe.height = "113px";
	container.append(iframe);
}

function createNativeVideo(container,src){
	var video = document.createElement('video');
	video.poster = "./assets/loading/loader-xs.gif";
	video.autoplay = true;
	container.append(video);
	addSourceToVideo(video, src, 'application/x-mpegURL');
}



$(document).ready(function(){
	
	$("#setting-preview").prop('checked', getSettings("isPreviewEnable"));
	$("#setting-preview").click(function(){
		var isPreviewEnable = false;
		if ($(this).is(':checked')) {
			isPreviewEnable = true;
		}else{
			isPreviewEnable = false;
		}
		saveSettings("isPreviewEnable",isPreviewEnable);
	});
	
});

function getSettings(name){
	if (typeof(Storage) !== "undefined") {
		return localStorage.getItem(name);
	} else {
		return null;
	}
}

function saveSettings(name,value){
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(name, value);
	} else {
		console.log("Sorry, your browser does not support Web Storage...");
	}
}





