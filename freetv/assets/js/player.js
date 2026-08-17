var $ = jQuery.noConflict();
var currentHls = null;
var currentProgram = null;
var currentSourceIndex = 0;
var headerHideTimer = null;
var playbackWatchdog = null;
var playerEventsBound = false;
var mouseMoveBound = false;

function getSources(program) {
  if (program && program.sources && program.sources.length) {
    return program.sources;
  }
  if (program && program.src) {
    return [{ type: program.type, src: program.src }];
  }
  return [];
}

function initPlayer(program) {
  currentProgram = program;
  currentSourceIndex = 0;
  getdate();
  addChannelInfo(program);
  initGoBack();
  loadPlayer(program);
}

function addChannelInfo(program) {
  $(".channel-info").empty().append(
    "<h2>" + escapeHtml(program.name) + "</h2><p class='max-lines'>" + escapeHtml(program.description || "") + "</p>"
  );
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initGoBack() {
  if (playerEventsBound) {
    return;
  }
  playerEventsBound = true;
  $(".back").on("click", function () {
    back();
  });
  window.addEventListener("popstate", function () {
    if ($("#main-player").is(":visible")) {
      back();
    }
  });
}

function back() {
  showPlayer(false);
  destroyPlayer();
}

function destroyPlayer() {
  destroyMediaOnly();
  $(".channel-info").empty();
  hideLoader();
  hidePlayerError();
}

function destroyMediaOnly() {
  if (playbackWatchdog) {
    clearTimeout(playbackWatchdog);
    playbackWatchdog = null;
  }
  if (currentHls) {
    try {
      currentHls.destroy();
    } catch (e) {}
    currentHls = null;
  }
  $("#container_player").empty();
}

function showLoader() {
  $("#main-player .content-loader").show();
}

function hideLoader() {
  $("#main-player .content-loader").hide();
}

function showPlayerError() {
  hideLoader();
  var box = document.getElementById("player-error");
  if (box) {
    box.style.display = "flex";
  } else {
    showSnackbar("No se pudo reproducir este canal.");
    back();
  }
}

function hidePlayerError() {
  var box = document.getElementById("player-error");
  if (box) {
    box.style.display = "none";
  }
}

function loadPlayer(program) {
  hidePlayerError();
  var sources = getSources(program);
  if (!sources.length) {
    showPlayerError();
    return;
  }
  playSource(sources, currentSourceIndex);
  showHeaderOnMouseMove();
  showHeaderOnInit();
}

function playSource(sources, index) {
  destroyMediaOnly();
  hidePlayerError();
  if (!currentProgram || index >= sources.length) {
    showPlayerError();
    return;
  }
  currentSourceIndex = index;
  var source = sources[index];
  var container = document.getElementById("container_player");
  if (!source || !source.src) {
    tryNextSource();
    return;
  }
  if (source.type === "hls" || source.type === "mp4") {
    createNativeVideo(source, container);
  } else if (source.type === "youtube") {
    createIframe(source, container, true);
  } else {
    createIframe(source, container, false);
  }
}

function tryNextSource() {
  if (!currentProgram) {
    return;
  }
  var sources = getSources(currentProgram);
  playSource(sources, currentSourceIndex + 1);
}

function createIframe(source, container, isYoutube) {
  showLoader();
  var iframe = document.createElement("iframe");
  iframe.src = source.src;
  iframe.id = "iframe";
  iframe.className = isYoutube ? "ytplayer" : "ytplayer external-frame";
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allow", "autoplay; encrypted-media; fullscreen; picture-in-picture");
  iframe.setAttribute("allowFullScreen", "");
  iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  if (!isYoutube) {
    iframe.setAttribute("sandbox", "allow-forms allow-same-origin allow-scripts allow-popups allow-presentation");
  }
  container.appendChild(iframe);
  sizePlayerMedia();

  iframe.onload = function () {
    hideLoader();
  };
  iframe.onerror = function () {
    tryNextSource();
  };

  startWatchdog(isYoutube ? 18000 : 12000, function () {
    hideLoader();
  });
}

function createNativeVideo(source, container) {
  showLoader();
  var isMp4 = source.type === "mp4";
  var video = document.createElement("video");
  video.id = "live-video";
  video.className = isMp4 ? "mp4" : "hls";
  video.autoplay = true;
  video.controls = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.poster = "assets/loading/poster.jpg";
  video.addEventListener("playing", hideLoader);
  video.addEventListener("canplay", hideLoader);
  video.addEventListener("error", function () {
    tryNextSource();
  });
  container.appendChild(video);
  sizePlayerMedia();

  if (isMp4) {
    video.src = source.src;
    attemptPlay(video);
  } else {
    attachHls(video, source.src);
  }

  startWatchdog(15000, function () {
    if (video.readyState < 2) {
      tryNextSource();
    }
  });
}

function attachHls(video, src) {
  if (window.Hls && Hls.isSupported()) {
    currentHls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      xhrSetup: function (xhr) {
        xhr.withCredentials = false;
      }
    });
    currentHls.loadSource(src);
    currentHls.attachMedia(video);
    currentHls.on(Hls.Events.MANIFEST_PARSED, function () {
      attemptPlay(video);
    });
    currentHls.on(Hls.Events.ERROR, function (event, data) {
      if (data && data.fatal) {
        tryNextSource();
      }
    });
    return;
  }
  if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
    video.src = src;
    attemptPlay(video);
    return;
  }
  tryNextSource();
}

function attemptPlay(video) {
  var playPromise = video.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(function () {
      video.muted = true;
      video.play().catch(function () {
        tryNextSource();
      });
    });
  }
}

function startWatchdog(ms, onTimeout) {
  if (playbackWatchdog) {
    clearTimeout(playbackWatchdog);
  }
  playbackWatchdog = setTimeout(function () {
    playbackWatchdog = null;
    if (typeof onTimeout === "function") {
      onTimeout();
    }
  }, ms);
}

function sizePlayerMedia() {
  var w = $(window).innerWidth();
  var h = $(window).innerHeight();
  $("#container_player iframe, #container_player video").css({
    width: w + "px",
    height: h + "px"
  });
}

function hideHeader() {
  var header = $(".channel-header");
  if (header.is(":visible")) {
    header.fadeOut();
  }
}

function showHeaderOnMouseMove() {
  if (mouseMoveBound) {
    return;
  }
  mouseMoveBound = true;
  $(document).on("mousemove.player", function (e) {
    var header = $(".channel-header");
    if (e.pageY <= Math.max(header.outerHeight(), 120)) {
      header.fadeIn();
    } else {
      header.fadeOut();
    }
  });
}

function showHeaderOnInit() {
  var header = $(".channel-header");
  header.fadeIn();
  if (headerHideTimer) {
    clearTimeout(headerHideTimer);
  }
  headerHideTimer = setTimeout(hideHeader, 8000);
}

$(window).on("resize.player", sizePlayerMedia);

$(document).on("click", "#player-error-back", function () {
  back();
});

$(document).on("click", "#player-error-retry", function () {
  if (!currentProgram) {
    return;
  }
  currentSourceIndex = 0;
  loadPlayer(currentProgram);
});
