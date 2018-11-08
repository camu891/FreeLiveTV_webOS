var $ = jQuery.noConflict();

function sidebar_open() {
	$("#sidebar").fadeIn();
}
function sidebar_close() {
	$("#sidebar").fadeOut();
}

$( document ).ready(function() {
	
	initToggleNavBar();
	
	//oculta sidebar 
	$('#container_programs').click(function(){
		closeSidebar();
	});
	
});

function closeSidebar(){
	if($( 'body').hasClass( "visible_menu" )){
		$('body').toggleClass('visible_menu')
	}
}

function initToggleNavBar(){
	$('#menu_on').click(function(){ // Al hacer click...
		$('body').toggleClass('visible_menu'); // Añadimos o eliminamos la clase 'visible_menu' al body
	})
}


