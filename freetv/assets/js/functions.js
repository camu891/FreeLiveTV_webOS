var $ = jQuery.noConflict();
var settings = {
  PREVIEW: "isPreviewEnable",
  LAST_VIEW: "lastView",
  USER: "user"
};
var totalPrograms = 0;
var tabindex = 0;
var allPrograms = [];
var navigationControl = {};

function initApp() {
  if (typeof initWebOS === "function") {
    initWebOS();
  }
  if (typeof initSearch === "function") {
    initSearch();
  }
  getdate();
}

function getSettings(key) {
  return typeof Storage !== "undefined" ? localStorage.getItem(key) : null;
}

function saveSettings(key, value) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem(key, value);
  }
}

function removeSettings(key) {
  if (typeof Storage !== "undefined") {
    localStorage.removeItem(key);
  }
}

function getLastViews() {
  try {
    var raw = getSettings(settings.LAST_VIEW);
    if (!raw) {
      return [];
    }
    var parsed = JSON.parse(raw);
    return parsed && parsed.length ? parsed : [];
  } catch (e) {
    return [];
  }
}

function getProgramsUrls() {
  var local = appConfig.URL_PROGRAMS_DEV;
  var remote = appConfig.URL_PROGRAMS_PROD;
  var host = window.location.hostname || "";
  var cacheBust = "v=" + encodeURIComponent(appConfig.VERSION || "1");
  function withVersion(url) {
    return url + (url.indexOf("?") === -1 ? "?" : "&") + cacheBust;
  }
  if (host.indexOf("github.io") !== -1 || host === "localhost" || host === "127.0.0.1" || host === "") {
    return [withVersion(local), withVersion(remote)];
  }
  return [withVersion(remote), withVersion(local)];
}

$(document).ready(function () {
  $(".logout").on("click", logout);
  ajaxLoadPrograms();

  $(".icon-app").on("click", function () {
    ajaxLoadPrograms();
  });

  $(".reload").on("click", function () {
    ajaxLoadPrograms();
  });

  $(".search-icon").on("click", function () {
    showSearchInput();
  });

  $("#search").on("click", function () {
    tabindex = 0;
  });

  $("#container_programs").click(function () {
    hideSearchInput();
  });
});

function showSearchInput() {
  $(".search-icon").css("visibility", "hidden");
  $(".search-container").show();
  $("#search").focus();
}

function hideSearchInput() {
  $(".search-container").hide();
  $(".search-icon").css("visibility", "visible");
}

function ajaxLoadPrograms() {
  $("#container_programs").empty();
  allPrograms = [];
  totalPrograms = 0;
  tabindex = 0;
  $(".content-error-request").hide();
  $("#main-content > .content-loader").show();
  loadProgramsFromUrls(getProgramsUrls(), 0);
}

function loadProgramsFromUrls(urls, index) {
  if (index >= urls.length) {
    $("#main-content > .content-loader").hide();
    $(".content-error-request").show();
    return;
  }
  $.ajax({
    url: urls[index],
    dataType: "json"
  }).done(function (json) {
    renderPrograms(json);
  }).fail(function () {
    loadProgramsFromUrls(urls, index + 1);
  });
}

function renderPrograms(json) {
  var loader = $("#main-content > .content-loader");
  var error = $(".content-error-request");
  loader.hide();
  error.hide();
  $("ul.nav-tabs").empty();
  $("#container_programs").empty();
  allPrograms = [];
  totalPrograms = 0;

  var index = 0;
  $.each(json.programs, function (pos, items) {
    $.each(items, function (key, programs) {
      $.each(programs, function (i, program) {
        if (program.available) {
          allPrograms.push(program);
          addProgramToCategory(key, program, index);
          index++;
        }
      });
    });
  });
  totalPrograms = allPrograms.length;
  initNavTabs();
  setTabindex();
  initLastView();
}

function initLastView() {
  addLastViewCard(allPrograms);
}

function updateLastView(id) {
  var currentValues = getLastViews();
  var array = [];
  if (!currentValues.length) {
    array[0] = id;
  } else if (id !== currentValues[0] && id !== currentValues[1]) {
    array[0] = id;
    array[1] = currentValues[0];
  } else {
    array = currentValues;
  }
  saveSettings(settings.LAST_VIEW, JSON.stringify(array));
  addLastViewCard(allPrograms);
}

function addLastViewCard(programs) {
  $(".last-view .lv-container").empty();
  var lastViews = getLastViews();
  var lastViewContainer = $(".last-view");
  if (!lastViews.length) {
    lastViewContainer.hide();
    return;
  }
  lastViewContainer.show();
  $.each(programs, function (i, program) {
    if (program.id === lastViews[0] || program.id === lastViews[1]) {
      var card = getProgramData(program, i).replace("id='" + program.id + "'", "id='lv-" + program.id + "'");
      $(".last-view .lv-container").append(card);
    }
  });
}

function addProgramToCategory(category, program, index) {
  var safeId = category.replace(/\s+/g, "_");
  var categoryRef = "#" + safeId + " div.programs-container";
  if ($(categoryRef).length === 0) {
    $("#container_programs").append(
      "<div class='category' id='" + safeId + "'><span class='category-title'>" +
      category + "</span><div class='programs-container row'></div></div>"
    );
    addCategoryTab(category, safeId);
  }
  $(categoryRef).append(getProgramData(program, index));
}

function addCategoryTab(category, safeId) {
  $("ul.nav-tabs").append("<li id='tab_" + safeId + "'>" + category + "</li>");
  $(".subheader").fadeIn();
}

function initNavTabs() {
  $("ul.nav-tabs li").off("click").on("click", function (e) {
    e.preventDefault();
    goToByScroll(this.id);
    return false;
  });
}

function goToByScroll(id) {
  id = id.replace("tab_", "");
  var target = document.getElementById(id);
  var container = document.getElementById("container_programs");
  if (!target || !container) {
    return;
  }
  container.scrollTop = Math.max(target.offsetTop - 130, 0);
  closeSidebar();
}

function getProgramData(program, index) {
  var logo = program.logo || "./assets/img/no_image.png";
  return (
    "<div id='" + program.id + "' class='card content-box'>" +
      "<a class='program-link' href='javascript:void(0)' data-program-id='" + program.id + "'>" +
        "<div class='inner'>" +
          "<img class='programs-logo' src='" + logo + "' alt='" + program.name + "' onerror=\"this.src='./assets/img/no_image.png'\">" +
          "<span class='channel-title'>" + program.name + "</span>" +
        "</div>" +
      "</a>" +
    "</div>"
  );
}

$(document).on("click", "a.program-link", function (e) {
  e.preventDefault();
  var id = $(this).attr("data-program-id");
  var program = getProgramById(id);
  if (program) {
    onSelectProgram(program, getIndexByObject(program));
  }
});

function getProgramById(id) {
  for (var i = 0; i < allPrograms.length; i++) {
    if (allPrograms[i].id === id) {
      return allPrograms[i];
    }
  }
  return null;
}

function setTabindex() {
  var cards = document.querySelectorAll("#container_programs .card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].tabIndex = i + 1;
  }
}

document.addEventListener("keydown", function (inEvent) {
  var key = inEvent.keyCode;
  var playerVisible = $("#main-player").is(":visible");

  if (playerVisible && (key === 8 || key === 27 || key === 461 || key === keyRemoteControl.BACK)) {
    inEvent.preventDefault();
    back();
    return;
  }

  switch (key) {
    case keyRemoteControl.ENTER:
      var focused = $(".card:focus a.program-link");
      if (focused.length) {
        focused.trigger("click");
      }
      break;
    case keyRemoteControl.NAVIGATION.LEFT:
      tabindex = tabindex > 1 ? tabindex - 1 : 1;
      $("[tabindex=" + tabindex + "]").not(".hide").focus();
      break;
    case keyRemoteControl.NAVIGATION.RIGTH:
      if (tabindex === 0) {
        tabindex = 1;
      } else if (tabindex < totalPrograms) {
        tabindex++;
      }
      $("[tabindex=" + tabindex + "]").not(".hide").focus();
      break;
    case keyRemoteControl.NAVIGATION.TOP:
      tabindex = tabindex > 8 ? tabindex - 8 : tabindex;
      $("[tabindex=" + tabindex + "]").not(".hide").focus();
      break;
    case keyRemoteControl.NAVIGATION.DOWN:
      if (tabindex === 0) {
        tabindex = 1;
      } else if (tabindex + 8 <= totalPrograms) {
        tabindex += 8;
      }
      $("[tabindex=" + tabindex + "]").not(".hide").focus();
      break;
    case keyRemoteControl.FAST_ACTIONS.RED:
      $("body").toggleClass("visible_menu");
      break;
    case keyRemoteControl.FAST_ACTIONS.GREEN:
      ajaxLoadPrograms();
      break;
    case keyRemoteControl.FAST_ACTIONS.YELLOW:
      $(".alert-dialog").fadeIn();
      break;
    case keyRemoteControl.FAST_ACTIONS.BLUE:
      if ($(".search-container").is(":visible")) {
        hideSearchInput();
      } else {
        showSearchInput();
      }
      break;
    case keyRemoteControl.CHANNEL.UP:
      if (navigationControl.next) {
        moveToNextPrevChannel(navigationControl.next);
      }
      break;
    case keyRemoteControl.CHANNEL.DOWN:
      if (navigationControl.previous) {
        moveToNextPrevChannel(navigationControl.previous);
      }
      break;
    default:
      break;
  }
});

function moveToNextPrevChannel(program) {
  destroyPlayer();
  onSelectProgram(program, getIndexByObject(program));
  updateLastView(program.id);
  showHeaderOnInit();
}

function mouseOut() {
  $(".preview").empty().hide();
}

$(document).ready(function () {
  $("#setting-preview").prop("checked", getSettings(settings.PREVIEW) === "true");
  $("#setting-preview").click(function () {
    saveSettings(settings.PREVIEW, $(this).is(":checked") ? "true" : "false");
  });
});

$(document).ready(function () {
  $("#alert-ok").click(function () {
    window.close();
  });
  $("#alert-cancel").click(function () {
    $(".alert-dialog").fadeOut();
  });
});

function onSelectProgram(program, index) {
  if (history.pushState) {
    var newurl = window.location.protocol + "//" + window.location.host +
      window.location.pathname + "?channel=" + encodeURIComponent(program.id);
    window.history.pushState({ channel: program.id }, "", newurl);
  }
  showPlayer(true);
  initPlayer(program);
  updateLastView(program.id);
  updateNavigationControl(typeof index === "number" ? index : getIndexByObject(program));
}

function updateNavigationControl(index) {
  var previous = allPrograms[index === 0 ? allPrograms.length - 1 : index - 1];
  var current = allPrograms[index];
  var next = allPrograms[index === allPrograms.length - 1 ? 0 : index + 1];
  navigationControl = {
    previous: previous,
    current: current,
    next: next
  };
}

function showPlayer(playerVisible) {
  if (playerVisible) {
    $("#main-content").hide();
    $("#main-player").show();
  } else {
    $("#main-content").show();
    $("#main-player").hide();
  }
}

function getIndexByObject(program) {
  for (var i = 0; i < allPrograms.length; i++) {
    if (allPrograms[i].id === program.id) {
      return i;
    }
  }
  return 0;
}

function showSnackbar(message) {
  var x = document.getElementById("snackbar");
  if (!x) {
    return;
  }
  if (message) {
    x.textContent = message;
  }
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 5000);
}

function getQueryParam(name) {
  var search = window.location.search || "";
  var match = search.match(new RegExp("[?&]" + name + "=([^&]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

$(document).ready(function () {
  var channelId = getQueryParam("channel");
  if (!channelId) {
    return;
  }
  var tries = 0;
  var waitForPrograms = setInterval(function () {
    tries++;
    if (!allPrograms.length) {
      if (tries > 50) {
        clearInterval(waitForPrograms);
      }
      return;
    }
    clearInterval(waitForPrograms);
    var program = getProgramById(channelId);
    if (program) {
      onSelectProgram(program, getIndexByObject(program));
    }
  }, 200);
});
