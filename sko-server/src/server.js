const Game = require('./Game');
const User = require('./User');
const { IoC } = require('./libs');
const io = require('socket.io')(3006);

IoC('io', io);

io.on('connection', function(socket) {
  Game.enhanceSocket(socket);
  User.enhanceSocket(socket);

  console.log('client connect - ', socket.id);
  updatePresence(socket);

  socket.on('reconnect', (attemptNumber) => {
    console.log('client reconnect - ', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('client disconnect - ', socket.id);
    updatePresence(socket);
  });

  socket.on('user.create', async (form) => {
    console.log('client create user - ', socket.id);

    const user = await User.make(form);
    socket.setUser(user);
  });

  socket.on('game.join', () => {
    console.log('client join matchmaking - ', socket.id);
    
    const rooms = Game.getRooms(socket);
    const room = rooms.find(room => room.length < 2 && !room.game.fullAt);
    const game = (room) ? room.game : Game.make({ createdAt: Date.now() });
    
    socket.joinGame(game);
  });

  // socket.on('game.leave', (ack) => {
  //   const game = Game.current(socket);
  //   socket.leave(game.id);
  //   ack();
  // });

  socket.on('game.ready', () => {
    console.log('game ready for user -', socket.getUser().id);
    const user = socket.getUser();
    const game = socket.getGame();
    
    user.ready();

    if(game.isReady()) {
      game.start();
    }
  });

  socket.on('game.attack', () => {
    console.log('client attack - ', socket.id);
    const game = socket.getGame();
    if(game && !game.hasWinner()) {
      const attacker = socket.getUser();
      const target = game.getOpponent(attacker);
      game.handleAttack(attacker, target);
    }
  });
});

function updatePresence(socket) {
  socket.adapter.clients((error, clients) => {
    if (error) throw error;
    socket.nsp.emit('change', { nbPlayers: clients.length });
  });
}