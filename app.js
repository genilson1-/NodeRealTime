
var app = require("express")();
var express = require("express");


var mysql = require('mysql');
var pool =  mysql.createPool({
connectionLimit : 100,
host : 'localhost',
user : 'root',
password: '852456963',
database: 'DadosArduino'
});
 

 function insert(valor) {
//	console.log(getDateTime());
	pool.getConnection(function(err, connection) {
		if(consumo_real != 0 && valor != 0){
			connection.query( "insert into dados (gasto, potencia) values (" + consumo_real +"," + valor +");", function(err, rows) {
      			connection.release();


      			});
		}
   });	
}


consumo_real = 0;

 function select() {
//      console.log(getDateTime());
        pool.getConnection(function(err, connection) {
    connection.query( "SELECT * FROM dados ORDER BY ID DESC LIMIT 1;", function(err, rows, fields) {
		consumo_real = (rows[0].gasto);

	//console.log(teste[0]);
      //console.log(pool._freeConnections.indexOf(connection)); // -1

      connection.release();

      //console.log(pool._freeConnections.indexOf(connection)); // 0

      });
   });
}





 // Na pasta public é onde colocaremos o arquivo Chart.js
 app.use(express.static(__dirname + '/public'));

 var http = require("http").Server(app);

 // Socket.io é um biblioteca que permite estabelecer concexão cliente servidor em tempo ral.
 var io = require("socket.io").listen(http);

 var serialport = require("serialport");
 var SerialPort = serialport.SerialPort;

 var mySocket;

/**
 * app.get - 
 */
 app.get("/", function(req, res){
 	res.sendfile("view/index.html");
	

 });



/**
 * mySerial - cria uma porta serial para comunicação com o Arduíno, define a velocidade de 
 * comunicação e interpreta o pular linha.
 * Onde eu estou colocando "/dev/ttyACM8" você deve substituir essa informação pela sua porta 
 * serial, onde o seu Arduíno está conectado. 
 */
 var mySerial = new SerialPort("/dev/ttyACM0", {
 	baudrate : 9600,
 	parser : serialport.parsers.readline("\n")
 });


/**
 * mySerial.on - Verifiica conexão com o arduino e informa no console.
 */
 mySerial.on("open", function(){
 	console.log("Arduino conexão estabelecida!");
		select();

 });

/**
 * mySerial.on -
 */
valor = 0;
cont = 0;
valor_imediato = 0;
 mySerial.on("data", function(data){
 	// Recebe os dados enviados pelo arduino e exibe no console.
 	// console.log(data);
 	io.emit("dadosArduino", { // Emite um evento e o objeto data recebe valor.
 		valor: consumo_real,
  // Neat!

 	});
	//setInterval(function(){ handle_database(data); }, 10000);
	//handle_database(data);
	valor =+ data;
	valor_imediato = data;
	cont++;
 });

db = valor/cont;

/**
 * io.on - Recebe conexão de cliente.
 */
 io.on('connection', function(socket){
 	console.log("Usuário está conectádo!");
 });

/**
 * http.linten -  
 */
 http.listen("8080", function(){
 	console.log("Servidor on-line em http://localhost:3000 - para sair Ctrl+C.");
 });


var serial = ''
/** abre conexão do cliente para o servidor
cliente envia dados via socket
**/
io.sockets.on('connection', function(socket) {	
	// pega os dados enviados via socket pelo cliente
	socket.on('mensagem_servidor', function(data) {
		console.log('recebido:' + data);
		serial = data;
		console.log(serial);
		// envia o dado recebido pela serial para o arduino
		mySerial.write(serial);
	});
	
	socket.on('disconnect', function() {
		console.log('desconectado: ' + socket.id);
		insert(valor/cont);
	});
});


function consumo(valor_imediato){
	console.log(consumo_real);
        consumo_real +=(valor_imediato * 0,0002777 * 0,48)/1000;
}



setInterval(function(){ insert(valor/cont); }, 100000);
setInterval(function(){ consumo(valor_imediato); }, 1000);
