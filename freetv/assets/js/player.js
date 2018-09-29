  var $ = jQuery.noConflict();

  var queryString = decodeURIComponent(window.location.search); //parsing
  queryString = queryString.substring(1);

  var src = queryString.substring(queryString.lastIndexOf("src=")+4,queryString.lastIndexOf("&type="));//from type if src contain &
  var typeVideo = queryString.substring(queryString.lastIndexOf("&type=")+6,queryString.lastIndexOf("&title="));
  var title = queryString.substring(queryString.lastIndexOf("&title=")+7,queryString.lastIndexOf("&description="));
  var description = queryString.substring(queryString.lastIndexOf("&description=")+13,queryString.lastIndexOf("&"));

  console.log(src);
  console.log(typeVideo);

  function load(){
   addChannelInfo();
 }
 
 function addChannelInfo(){
  $(".channel-info").append("<h2>"+title+"</h2><p>"+description+"</p>");
  $(".container").click(function() {
    var header =  $('.channel-header');
    if (header.is(':hidden')) {
      header.slideDown('slow').delay(5000).slideUp('slow');
    }else{
      header.slideUp('slow');
    }
  }); 

  $(".back").click(function() {
   goBack();
 }); 

}

function goBack() {
  window.history.back();
}

function resizeIframe(obj) {
  obj.style.height = 0;
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

function addSourceToVideo(element, src, type) {
 var source = document.createElement('source');
 source.src = src;
 source.type = type;
 element.appendChild(source);
}

function createIframeYoutube(container){
  var iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.setAttribute('class','ytplayer');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow' ,'autoplay; encrypted-media');
  iframe.setAttribute('allowFullScreen', '');
  container.appendChild(iframe);

  $(document).ready(function(){
    $('iframe').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });

    $(window).resize(function(){
      $('iframe').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
    });
  });


}

function createNativeVideo(container){
  var video = document.createElement('video');
  video.poster = "assets/loading/loader.png";
  video.autoplay = true;
  video.setAttribute('controls', '');
  container.appendChild(video);
  addSourceToVideo(video, src, 'application/x-mpegURL');
}

window.addEventListener('DOMContentLoaded', function() {

 var container = document.getElementById("container");
 if(typeVideo==="native"){
   createNativeVideo(container);
 }else if(typeVideo==="youtube"){
  createIframeYoutube(container);
}

}, true);

 //for controls hidden
 //For Firefox we have to handle it in JavaScript 
 var vids = $("video"); 
 $.each(vids, function(){
   this.controls = false; 
 }); 



