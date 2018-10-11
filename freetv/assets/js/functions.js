 var $ = jQuery.noConflict();

 var totalPragrams=0;
 $(document).ready(function(){

 	var request = webOS.service.request("luna://com.palm.connectionmanager", {
 		method: "getStatus",
 		onSuccess: function (inResponse) {
 			console.log("Result: " + JSON.stringify(inResponse));
 		},
 		onFailure: function (inError) {
 			console.log("Failed to get network state");
 			console.log("[" + inError.errorCode + "]: " + inError.errorText);
        // To-Do something
        return;
    }
	});

 	ajax_load_programs();
 });

 function ajax_load_programs(){
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

 			addProgramToCategory(json.programs[i],params,i);
 			totalPragrams++;
 		});
 	}).fail(function() {
 		loader.hide();
 		console.log("Fail request programs");
 	});
 }

 function addProgramToCategory(program,params,index){

 	var category = "#" + program.category;
 	if($(category).length == 0) {
 		tabindex=0;
 		$("#container_programs").append("<div class='category' id='"+program.category+"'><span class='category-title'>"+program.category+"</span><div class='programs-container row' id='list'></div></div>");
 	}else{
 		tabindex++; 		
 	}
 	$(category + "  div.programs-container").append(get_program_data(program,params,tabindex));
 }

 function get_program_data(program,params,tabindex){
 	return "<div onmouseover=\"mouseOver(this,'"+program.type+"','"+program.link+"');\" onmouseout='mouseOut(this);' tabindex='"+(tabindex)+"' class='card content-box'><a id='link' class='program-link' name='"
 	+program.name+"' href='player.html"+params+"'><div class='inner'><img class='programs-logo' src='"
 	+program.logo+"'><span>"+program.name+"</span></div></a></div>";
 }


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
	//tabindex = (tabindex >= itemsPerRow) ? tabindex-itemsPerRow : tabindex;
	//$('.programs-container > .content-box:focus').prevAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
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
	/*if(tabindex==0){
		tabindex=1;
		$('.content-box').not(".hide").first().focus();
	}else{
		tabindex = (tabindex <= (totalPragrams-itemsPerRow)) ? tabindex+itemsPerRow : tabindex;
		$('.programs-container > .content-box:focus').nextAll('.content-box[tabindex=' + tabindex + ']').not(".hide").first().focus();
	}*/
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





