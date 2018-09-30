
function load(){
  var input = document.getElementById("search");
  input.addEventListener("input", searching);

  function searching(e) {
    var filter = e.target.value.toUpperCase();

    var list = document.getElementById("list");
    var divs = list.getElementsByTagName("div");
    var tabIndex=1;
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
          divs[i].tabIndex = 0;
        }
      }
    }
  }
}