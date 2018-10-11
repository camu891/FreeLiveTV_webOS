
function getdate(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var day = today.getDay();
  var month = today.getMonth();
  var year = today.getFullYear();


  $("span.date").text((day<10 ? '0'+day : day)+"/"+(month<10 ? '0'+month : month)+"/"+year);    
  $("span.clock").text(h+":"+(m<10 ? '0'+m : m)+":"+(s<10 ? '0'+s : s));

  setTimeout(function(){getdate()}, 500);
}