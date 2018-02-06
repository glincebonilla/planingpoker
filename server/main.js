//Llamo la libreria express
 var express = require('express');//Se instala por npm
 var app = express();
 //Creo el servidor en una variable, usando el metodo server le pasamos la variable app
 var server = require('http').Server(app);
 //Creo la funcionalidad de los sockets, le pasamos el servidor http y el servidor express
 var io = require('socket.io')(server) ; //Se instala por npm

 var participantes = [];

 //para poder usar la parte publica de neustra aplicacion de ficheros estaticos debemos usar un middleware llamado
//Static. simplemente antes de cualquier ruta a la varaible app le vamos a decir que use el directorio que contiene el front o parte publica
app.use(express.static('public'));

//En app donde tenemos la aplicación express le decimos que cuando reciba un get en la ruta raiz, acitive la siguiente función
app.get('/' , function(req, res) {
  res.status(200).send("Hello World");//
});


//Con socket lo que hay que hacer es estar escuchando un mensaje que llegue
//Nuestro servidor de socket no es app, es io.
//Le decimos que escuche un determinado mensaje que llegue desde un navegador o desde otro servidor 
//Que cuando le llegue el mensaje que haga lo que se esta indicando en la función.
//La función recibe como parametro un socket que este abierto en ese momento, ese cliente web que ha mandado el mensaje
//¿Como se manda este mensaje?. R://hay que hacer que venga del navegador, una pagina html, y un codigo
//JavaScript que envie ese mensaje
io.on('connection' , function(socket) {
	console.log('Alguien se ha conectado con Socket');
	//Respondo solamente al que se acaba de conectar
	socket.emit('nuevoparticipante' , 'Se conecto un nuevo cliente..');

	//Escuchar el evento asgnarpuntaje
	socket.on('asgnarpuntaje' , function(data) {
     //Vamos a tener un array de mensajes para añadir nuevos elementos cada vez que se escriba un mensaje
     //Añado un mensaje en el array
     AgregarParticipante(data);
     //Tenemos que avisar a todos los clientes que esten conectados que ha llegado un mensaje
     //que a todos los sockets les emita el mensaje. por eso no se hace socket.emit si no io.emit (Para que le mande el mensaje a todos)
     io.sockets.emit('nuevoparticipante' , 'Les presento a' + data.nombre);
     //Respondo al los clientes que tengan el tablero abierto.
     io.sockets.emit('mensajetablero' , participantes);
	});
    //Socket para limpiar el tablero, cuando escuche el mensaje
	socket.on('limpiartablero' , function(data) {
		participantes = [];
		//Aviso a todos los tableros abiertos.
        io.sockets.emit('mensajetablero' , participantes);
	});
});

function AgregarParticipante( participante ) {
   var encontro = false;
   for (var i in participantes) {
     if (participantes[i].nombre == participante.nombre) {
        participantes[i].puntos = participante.puntos;
        encontro = true;
        break; //Stop this loop, we found it!
     }
   }
   if(encontro == false){
   	 participantes.push(participante);
   }

   ListarParticipantes();
}

function ListarParticipantes(){
	 for (var i in participantes){
	 	console.log(participantes[i].nombre + " " + participantes[i].puntos );
	 }
}

//Para poner a correr el servidor escribo en la consola node server/main.js
 server.listen(4040 , function() {
 	console.log('Servidor corriendo en http://localhost:4040');
 });
