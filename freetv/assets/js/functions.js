 var $ = jQuery.noConflict();

 var totalPragrams=0;
 $(document).ready(function(){
 	var loader = $(".content-loader");
 	loader.show();
 	$.ajax({
 		url: "https://camu891.github.io/FreeLiveTV_webOS/freetv/assets/programs.json",
 		dataType: "json"
 	}).done(function(json) {
 		loader.hide();
 		$.each(json.programs, function(i) {
 			var link = "src="+json.programs[i].link + "&";
 			var typeVideo = "type="+json.programs[i].type+"&";
 			var title = "title="+json.programs[i].name+"&";
 			var description = "description="+json.programs[i].description+"&";
 			var params="?"+ link + typeVideo + title + description;

 			$(".programs-container")
 			.append("<div onmouseover=\"mouseOver(this,'"+json.programs[i].type+"','"+json.programs[i].link+"');\" onmouseout='mouseOut(this);' tabindex='"+(i+1)+"' class='col-md-4 content-box'><a id='link' class='program-link' name='"
 				+json.programs[i].name+"' href='player.html"+params+"'><img class='programs-logo' src='"
 				+json.programs[i].logo+"'><span>"+json.programs[i].name+"</span></a></div>");
 			totalPragrams++;
 		});
 	});

 });

 var tabindex=0;
 document.addEventListener("keydown", function(inEvent){
 	console.log("button key: "+inEvent.keyCode);
 	var itemsPerRow = 8;
 	switch(inEvent.keyCode){
	case 37://left
	tabindex--;
	$('.programs-container > .content-box:focus').prevAll('.content-box').not(".hide").first().focus();
	break;
	case 38://top
	tabindex = (tabindex >= itemsPerRow) ? tabindex-itemsPerRow : tabindex;
	$('.programs-container > .content-box:focus').prevAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
	break;
	case 39://right
	if(tabindex==0){
		tabindex=1;
		$('.content-box').not(".hide").first().focus();
	}else{
		tabindex++;
		$('.programs-container > .content-box:focus').nextAll('.content-box').not(".hide").first().focus();
	}
	break;
	case 40://down
	if(tabindex==0){
		tabindex=1;
		$('.content-box').not(".hide").first().focus();
	}else{
		tabindex = (tabindex <= (totalPragrams-itemsPerRow)) ? tabindex+itemsPerRow : tabindex;
		$('.programs-container > .content-box:focus').nextAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
	}
	break;
	case 13://enter
	window.location = $('.programs-container > .content-box:focus > a').attr('href');
	break;
	default:  break;
}
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
 		container.empty()
 		container.fadeIn();
 		if(typeVideo==="native"){
 			createNativeVideo(container,link);
 		}else if(typeVideo==="youtube"){
 			createIframeYoutube(container,link);
 		}
 	}
 }

 function addSourceToVideo(element, src, type) {
 	var source = document.createElement('source');
 	source.src = src;
 	source.type = type;
 	element.appendChild(source);
 }

 function createIframeYoutube(container,src){
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

 



