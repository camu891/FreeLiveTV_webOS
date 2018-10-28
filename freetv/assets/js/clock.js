

var months    = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function getdate(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var day = today.getDate();
  var month = today.getMonth();
  var thisMonth = months[month];
  var year = today.getFullYear();


  $("span.date").text((day<10 ? '0'+day : day)+" de "+thisMonth+" de "+year);    
  $("span.clock").text(h+":"+(m<10 ? '0'+m : m)+":"+(s<10 ? '0'+s : s));

  setTimeout(function(){getdate()}, 500);
}