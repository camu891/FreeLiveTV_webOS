 var $ = jQuery.noConflict();

 /*var info = $("div.info");
 function mouseOver(elem) {
 	info.fadeIn(100);
 }

 function mouseOut(elem) {
 	info.fadeOut(100);
 }*/
 //onmouseover='mouseOver(this);' onmouseout='mouseOut(this);'

 var totalPragrams=0;
 $.getJSON("assets/programs.json", function(json) {
 	$.each(json.programs, function(i) {
 		
 		var link = "src="+json.programs[i].link + "&";
 		var typeVideo = "type="+json.programs[i].type+"&";
 		var title = "title="+json.programs[i].name+"&";
 		var description = "description="+json.programs[i].description+"&";
 		var params="?"+ link + typeVideo + title + description;
 		$(".programs-container")
 		.append("<div tabindex='"+(i+1)+"' class='col-md-4 content-box'><a id='link' class='program-link' name='"
 			+json.programs[i].name+"' href='player.html"+params+"'><img class='programs-logo' src='"
 			+json.programs[i].logo+"'><span>"+json.programs[i].name+"</span></a></div>");
 		totalPragrams++;
 	});
 });


 var tabindex=0;
 document.addEventListener("keydown", function(inEvent){
 	console.log("button key: "+inEvent.keyCode);
 	var itemsPerRow = 8;
 	switch(inEvent.keyCode){
	case 37://left
	tabindex--;
	break;
	case 38://top
	tabindex = (tabindex >= itemsPerRow) ? tabindex-itemsPerRow : tabindex;
	break;
	case 39://right
	tabindex++;
	break;
	case 40://down
	if(tabindex==0){
		tabindex=1;
	}else{
		tabindex = (tabindex <= (totalPragrams-itemsPerRow)) ? tabindex+itemsPerRow : tabindex;
	}
	break;
	case 13:
	//enter
	window.location = $('[tabindex=' + tabindex + ']>a').attr('href');
	break;
	default:  break
}
$('[tabindex=' + tabindex + ']').focus();
});

