
function load(){
  var input = document.getElementById("search");
  input.addEventListener("input", searching);

  function searching(e) {
    var filter = e.target.value.toUpperCase();

    var list = document.getElementById("list");
    var divs = list.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
      var a = divs[i].getElementsByTagName("span")[0];

      if (a) {
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          divs[i].style.display = "";
        } else {
          divs[i].style.display = "none";
        }
      }
    }
  }
}