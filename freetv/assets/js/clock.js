var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var clockTimer = null;

function getdate() {
  updateClock();
  if (!clockTimer) {
    clockTimer = setInterval(updateClock, 1000);
  }
}

function updateClock() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var day = today.getDate();
  var thisMonth = months[today.getMonth()];
  var year = today.getFullYear();

  $("span.date").text(day + " de " + thisMonth + " de " + year);
  $("span.clock").text((h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s));
}
