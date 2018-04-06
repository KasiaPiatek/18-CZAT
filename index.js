const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const userService = new UsersService();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


//konfiguracja projektunode index.j


io.on('connection', function(socket) {
    socket.on('join', function(name){
      //uzytkowknik pojawil sie a pliakcji
      userService.addUser({
        id: socket.id,
        name
    });
    io.emit('update', {
      users: userService.getAllUsers()
    });
  });


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

  });

server.listen(3000, function(){
  console.log('listening on *:3000');
});