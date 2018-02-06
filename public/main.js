var socket ;

var nombre = "";

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

//Envio el puntaje
function EnviarPuntaje(){
  var puntaje = {nombre: nombre , puntos: $("#txtpuntos").val()};
  socket.emit('asgnarpuntaje' , puntaje);
}

$( document ).ready(function() {
   nombre = getUrlParameter('nombre');
   socket = io.connect('https://lincepocker.herokuapp.com/' , {'forceNew': true});

	//Escucho los mensajes del evento nuevoparticipante
	socket.on('nuevoparticipante' , function(data) {
	 console.log(data);
	});
});



