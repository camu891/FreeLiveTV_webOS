
function load(){
  var input = document.getElementById("search");
  input.addEventListener("input", searching);

  function searching(e) {
    var filter = e.target.value.toUpperCase();

    var list = document.querySelectorAll("#list");
    var tabIndex=1;
    for (var j = 0; j < list.length; j++) {
      var divs = list[j].getElementsByClassName("card");
      for (var i = 0; i < divs.length; i++) {
        var a = divs[i].getElementsByTagName("span")[0];
        if (a) {
          if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            divs[i].style.display = "";
            divs[i].classList.remove("hide");
            divs[i].tabIndex = tabIndex;
            tabIndex++;
          } else {
            divs[i].style.display = "none";
            divs[i].classList.add("hide");
            divs[i].tabIndex = -1;
          }
        }
      }

    }

  }

//remove enter action on input search
$('input:not(textarea)').keydown(function(event){
    var kc = event.witch || event.keyCode;
    if(kc == 13){
    event.preventDefault();
        return false;
    }
});


}