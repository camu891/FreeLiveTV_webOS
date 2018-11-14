
   const APPLICATION_MANAGER_SERVICE = 'luna://com.webos.applicationManager';
   const TV_APP_ID = 'com.matic.freetv';


  //sample code for calling LS2 API
  var lunaReq= webOS.service.request("luna://com.palm.systemservice",
  {
    method:"clock/getTime",
    parameters:{},
    onSuccess: function (args) {
     console.log("UTC:", args.utc);
   },
   onFailure: function (args) {
   }
 });

  function keyboardVisibilityChange(event) {
   var visibility = event.detail.visibility;
   if(visibility){
    console.log("Virtual keyboard appeared");
        // Do something.
      }
      else{
       console.log("Virtual keyboard disappeared");
        // Do something.
      }
    }
    document.addEventListener('keyboardStateChange', keyboardVisibilityChange, false);

    function cursorVisibilityChange(event) {
     var visibility = event.detail.visibility;
     if(visibility){
      Log("Cursor appeared");
        // Do something.
      }
      else{
       Log("Cursor disappeared");
        // Do something.
      }
    }
    document.addEventListener('cursorStateChange', cursorVisibilityChange, false);

    function load() {
     document.addEventListener("cursorStateChange", onCursor, false);
     document.addEventListener("visibilitychange", function () { Log(document.visibilityState);}, false);
     window.addEventListener("blur", function() { Log("Focus off");}, false);
     window.addEventListener("focus", function() { Log("Focus on");}, false);
   }

   function onCursor(event) {
     if (event.detail.visibility)
      Log("Cursor on");
    else
      Log("Cursor off");
  }

  var line = 0;
  function Log( msg ) {
    console.log(msg);
   	//document.getElementById('log').innerHTML += ++line + ": " + msg + "<br>";
   }


function sendAppToBackground() {
  webOS.service.request(APPLICATION_MANAGER_SERVICE, {
    method: 'launch',
    parameters: { id: TV_APP_ID },
    onSuccess(response) {
      if (response.returnValue === false) {
        logger.error(`Error sending Application to background and bringing TV Application with id ${TV_APP_ID} to the foreground.`);
        forciblyExitApp();
      }
    },
    onFailure(error) {
      logger.error(error);
      forciblyExitApp();
    },
  });
}

function forciblyExitApp() {
  window.close();
}

   

