  var $ = jQuery.noConflict();
  window.name="myMainWindow";
  if (window.name!='myMainWindow') {
    window.open(location.href,"myMainWindow")
    window.close();
  }
  
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
    loadPlayer();
  }
  
  function addChannelInfo(){
    $(".channel-info").append("<h2>"+title+"</h2><p class='max-lines'>"+description+"</p>");
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
  
  function createIframe(container,isYoutube){
    var iframe = document.createElement('iframe');
    iframe.src = src;
    
    if (isYoutube){
      iframe.setAttribute('class','ytplayer yt-disable');
    }else{
      iframe.setAttribute('class','ytplayer');
      iframe.setAttribute('style','margin-top:5px;');
    }
    iframe.setAttribute('id','iframe');
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
  
  function loadPlayer(){
    var container = document.getElementById("container_player");
    if(typeVideo==="native"){
      createNativeVideo(container);
    }else if(typeVideo==="youtube"){
      createIframe(container,true);
    }else if (typeVideo==="iframe"){
      createIframe(container,false);
      $(".above").remove();
     // autoplayHandler();
    }
    showHeaderOnMouseMove();
  }

  function autoplayHandler(){
    var e = new $.Event("click");
    e.pageX = 500;
    e.pageY = 500;
    $("#iframe").trigger(e);
  }

  function hideHeader(){
    var header = $('.channel-header');
    if($(header).is(":visible"))  
    $(header).fadeOut();
  }

  function showHeaderOnMouseMove(){
    $(document).mousemove(function(e){
      var header = $('.channel-header');
      var vertical = e.pageY;
      if( vertical <= header.height()) {   
        header.fadeIn();
      } else {
        header.fadeOut();
      }
    }); 
   setInterval(hideHeader, 10000);
  }
  
  //remove ads and logs in iframe
  function clearPlayer(){
    var iframelimp= $("iframe").contents().find("iframe").contents();
    iframelimp.find("#windowads").remove();
    iframelimp.find(".logo").remove();
    $("#ventana-flotante").remove();
  }
  
  
  
  
  