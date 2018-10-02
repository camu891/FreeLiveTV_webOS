var $ = jQuery.noConflict();

function sidebar_open() {
	$("#sidebar").fadeIn();
}
function sidebar_close() {
	$("#sidebar").fadeOut();
}

$( document ).ready(function() {

		$('#menu_on').click(function(){ // Al hacer click...
		   $('body').toggleClass('visible_menu'); // Añadimos o eliminamos la clase 'visible_menu' al body
		})

		//oculta sidebar 
		$('.programs-container').click(function(){
			closeSidebar();
		});
		
	});

function closeSidebar(){
	if($( 'body').hasClass( "visible_menu" )){
		$('body').toggleClass('visible_menu')
	}
}

