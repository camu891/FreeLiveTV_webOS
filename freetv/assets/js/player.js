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
   initGoBack();
 }
 
 function addChannelInfo(){
  $(".channel-info").append("<h2>"+title+"</h2><p>"+description+"</p>");
  $(".above").click(function() {
    var header =  $('.channel-header');
    header.slideToggle();
  }); 
}

function initGoBack(){
 $(".back").on("click",function(e) {
   e.preventDefault();
   window.history.back();
 }); 
}


function addSourceToVideo(element, src, type) {
 var source = document.createElement('source');
 source.src = src;
 source.type = type;
 element.appendChild(source);
}

function createIframe(container){
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
  var loader = $(".content-loader");
  loader.show();
  var video = document.createElement('video');
  video.poster = "assets/loading/poster.jpg";
  video.autoplay = true;
  video.oncanplay = function(){
    loader.hide();
  }
  container.appendChild(video);
  addSourceToVideo(video, src, 'application/x-mpegURL');
}

window.addEventListener('DOMContentLoaded', function() {

 var container = document.getElementById("container_player");
 if(typeVideo==="native"){
   createNativeVideo(container);
 }else if(typeVideo==="youtube" || typeVideo==="iframe"){
  createIframe(container);
  //clearPlayer();
}


}, true);


//remove ads and logs in iframe
function clearPlayer(){
  var iframelimp= $("iframe").contents().find("iframe").contents();
  iframelimp.find("#windowads").remove();
  iframelimp.find(".logo").remove();
}




