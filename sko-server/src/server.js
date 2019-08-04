const Game = require('./Game');
const User = require('./User');
const IoC = require('./IoC');
const io = require('socket.io')(3006);

IoC('io', io);

io.on('connection', function(socket) {
  console.log('client connect - ', socket.id);
  updatePresence(io, socket);

  socket.on('reconnect', (attemptNumber) => {
    console.log('client reconnect - ', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('client disconnect - ', socket.id);
    updatePresence(io, socket);
  });

  socket.on('user.create', (form) => {
    console.log('client create user - ', socket.id);
    const user = new User(socket, form);
    user.save();
  });

  socket.on('game.join', () => {
    console.log('client join matchmaking - ', socket.id);
    
    const rooms = Game.rooms(socket);
    const room = rooms.find(room => room.length < 2 && !room.game.fullAt);
    const game = (room) ? room.game : new Game();
    game.addUser(socket.user);
  });

  // socket.on('game.leave', (ack) => {
  //   const game = Game.current(socket);
  //   socket.leave(game.id);
  //   ack();
  // });

  socket.on('game.ready', () => {
    console.log('game ready for user -', socket.user.id);
    socket.user.ready();

    if(socket.game.isReady()) {
      socket.game.start();
    }
  });

  socket.on('game.attack', () => {
    console.log('client attack - ', socket.id);
    if(socket.game && !socket.game.hasWinner()) {
      socket.game.attackBy(socket.user);
    }
  });
});

function updatePresence(io, socket) {
  socket.adapter.clients((error, clients) => {
    if (error) throw error;
    io.emit('change', { nbPlayers: clients.length });
  });
}