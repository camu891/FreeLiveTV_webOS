function initSearch() {
  var input = document.getElementById("search");
  if (!input) {
    return;
  }
  input.addEventListener("input", searching);

  function searching(e) {
    var filter = e.target.value.toUpperCase();
    var cards = document.querySelectorAll("#container_programs .card");
    var tabIndex = 1;
    for (var i = 0; i < cards.length; i++) {
      var title = cards[i].getElementsByTagName("span")[0];
      if (!title) {
        continue;
      }
      if (title.innerHTML.toUpperCase().indexOf(filter) > -1) {
        cards[i].style.display = "";
        cards[i].classList.remove("hide");
        cards[i].tabIndex = tabIndex;
        tabIndex++;
      } else {
        cards[i].style.display = "none";
        cards[i].classList.add("hide");
        cards[i].tabIndex = -1;
      }
    }
  }

  $("input:not(textarea)").keydown(function (event) {
    var kc = event.which || event.keyCode;
    if (kc === 13) {
      event.preventDefault();
      return false;
    }
  });
}
