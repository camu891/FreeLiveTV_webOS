  var $ = jQuery.noConflict();
  window.name="myMainWindow";
  if (window.name!='myMainWindow') {
    window.open(location.href,"myMainWindow")
    window.close();
  }
  
  function initPlayer(program){
    getdate();
    addChannelInfo(program);
    initGoBack();
    loadPlayer(program);
  }
  
  function addChannelInfo(program){
    $(".channel-info").append("<h2>"+program.name+"</h2><p class='max-lines'>"+program.description+"</p>");
  }
  
  function initGoBack(){
    $(".back").on("click",function(e) {
      back();
    }); 
    
    window.addEventListener("popstate", function(inEvent) {
      back();
    });
  }
  
  function back(){
    $("#main-content").show()
    $("#main-player").hide()
    destroyPlayer();
  }
  
  function destroyPlayer() {
    $(".channel-info").empty()
    $("#container_player").empty()
    hideLoader()
  }
  
  function addSourceToVideo(element, program, type) {
    console.log(program)
    var source = document.createElement('source');
    source.src = program.src;
    source.type = type;
    element.appendChild(source);
    if(program.type == "mp4" && program.subtitle){
      var track = document.createElement('track');
      track.label = program.subtitle.label;
      track.kind = "subtitles";
      track.srclang = program.subtitle.srclang;
      track.src = program.subtitle.src;
      element.appendChild(track);
    }
  }
  
  function createIframe(program, container, isYoutube){
    showLoader();
    var iframe = document.createElement('iframe');
    iframe.src = program.src;
    
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
    iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation');
    iframe.setAttribute('error','onErrorIframe');

    container.appendChild(iframe);

    $(document).ready(function(){
      $('iframe').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
      $(window).resize(function(){
        $('iframe').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
      });
      document.getElementById('iframe').onload = function() {
        var that = $(this)[0];
        try{
          $.ajax({ cache: true,
            url: that.src,
            success: function (data) {
              hideLoader()
            },
            error: function (e) {
              back();
              showSnackbar();
            }
          });
        }
        catch(err){
          console.log("error on load iframe")
        }
    }
  });
  }

  function onErrorIframe(){
    console.log("error iframe")
  }
  
  function showLoader(){
    $(".content-loader").show();
  }
  
  function hideLoader(){
    $(".content-loader").hide();
  }
  
  function createNativeVideo(program, container, type){
    showLoader();
    var type='';
    var video = document.createElement('video');
    video.poster = "assets/loading/poster.jpg";
    
    if(program.type==='mp4'){
      type = 'video/mp4';
      video.autoplay = true;
      video.controls = true;
      $(".above").remove();
      video.setAttribute('class','mp4');
    }else{
      type = 'application/x-mpegURL';
      video.autoplay = true;
      video.setAttribute('class','hls');
    }
    video.oncanplay = function(){
      hideLoader();
    }
    container.appendChild(video);
    addSourceToVideo(video, program, type );
  }
  
  function loadPlayer(program){
    var container = document.getElementById("container_player");
    if(program){
      if(program.type==="hls" || program.type==="mp4" ){
        createNativeVideo(program,container, program.type);
      }else if(program.type==="youtube"){
        createIframe(program, container, true);
      }else if (program.type==="iframe"){
        createIframe(program, container, false);
        $(".above").remove();
        // autoplayHandler();
      }
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
  
  function showHeaderOnInit() {
    var header = $('.channel-header');
    header.fadeIn();
    setInterval(hideHeader, 10000);
  }
  
  //remove ads and logs in iframe
  function clearPlayer(){
    var iframelimp= $("iframe").contents().find("iframe").contents();
    iframelimp.find("#windowads").remove();
    iframelimp.find(".logo").remove();
    $("#ventana-flotante").remove();
  }
  
  
  
  
  