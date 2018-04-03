const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const usersService = new UsersService();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket) {

	//kolejna czesc dodana na poczatku ale czy ma byc dodana
	//na poczatku ??
	socket.on('disconnect', () => {
    userService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: userService.getAllUsers()
    });
  });

	//dodana po diconect nie wiem czy ma byc w tym miejscu
	//sie okaze
	socket.on('message', function(message){
    const {name} = userService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });

   // klient nasłuchuje na wiadomość wejścia do czatu
socket.on('join', function(name){
  // użytkownika, który pojawił się w aplikacji zapisujemy do serwisu 
  //trzymającego listę osób w czacie
  userService.addUser({
    id: socket.id,
    name
  });
  // aplikacja emituje zdarzenie update, które aktualizuje informację na temat 
  //listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
  io.emit('update', {
    users: userService.getAllUsers()
  });
});
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});