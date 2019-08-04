const uuid = require('uuid/v1');
const { random } = require('lodash');
const io = require('socket.io')(3006);

const users = [];

const Game = {
  list(socket) {
    return this.rooms(socket).map((room) => ({
      id: room.game.id,
      size: room.length
    }));
  },

  rooms(socket) {
    return Object.values(socket.adapter.rooms)
      .filter((room) => room.game);
  },

  current(socket) {
    return socket.gameId
      ? socket.adapter.rooms[socket.gameId].game
      : undefined;
  },

  setAndEmit (socket, changes) {
    const game = this.current(socket);
    Object.assign(game, changes);
    io.to(game.id).emit('change', { game });
  },

  setUser(game, userId, changes) {
    const user = game.users.find((user) => user.id === userId);
    Object.assign(user, changes);
    return this;
  },

  getOpponent (socket) {
    const game = this.current(socket);
    return game.users.find((userId) => userId !== socket.user.id);
  } 
}

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
    const user = {
      id: uuid(),
      name: form.name,
      heroId: form.heroId
    };
    users.push(user);
    socket.user = user;
    console.log('user create - ', user);

    io.emit('user.created', user);
    socket.emit('change', { me: user });
  });

  socket.on('game.join', () => {
    console.log('client join matchmaking - ', socket.id);
    
    const rooms = Game.rooms(socket);
    let room = rooms.find(room => room.length < 2 && !room.game.createdAt);
    
    if(!room) {
      const game = { 
        id: 'game.' + (rooms.length + 1),
        users: [socket.user]
      };
      socket.join(game.id);
      socket.gameId = game.id;
      socket.adapter.rooms[game.id].game = game;
    } else {
      // START RUMBLE
      const { game } = room;
      game.users.push(socket.user);
      game.createdAt = Date.now();
      socket.join(game.id);
      socket.gameId = game.id;

      io.to(game.id).emit('change', { 
        searching: false,
        game: game
      });
    }
  });

  // socket.on('game.leave', (ack) => {
  //   const game = Game.current(socket);
  //   socket.leave(game.id);
  //   ack();
  // });

  socket.on('game.ready', () => {
    console.log('game.Ready', socket.user.id);

    Game.setUser(Game.current(socket), socket.user.id, { readyAt: Date.now() });
    const game = Game.current(socket);
    const readyList = game.users.filter((user) => user.readyAt);
    if(readyList.length === 2) {
      const timer = parseInt(random(6, 9, true) * 1000);
      console.log('timer:', timer);
      Game.setAndEmit(socket, { 
        startedAt: Date.now(),
        fireAt: Date.now() + timer
      });
    }
  });

  socket.on('game.attack', () => {
    console.log('client attack - ', socket.id);

    const { gameId } = socket;
    const room = socket.adapter.rooms[gameId];
    
    // cette erreur se produit lorqu'on a perdu les rooms
    // après un redemarrage du serveur
    if(!room) {
      // envoyer seulement   "error" throw une erreur
      return socket.emit('game.error', 'room_not_found');
    }
    
    const { game } = room;
    if(game._timeout) {
      clearTimeout(game._timeout);
      game._timeout = undefined;
    }
    
    if(!game.winnerId) {
      const reactTime = Date.now() - game.fireAt;
      const isFalseStart = reactTime < 0;
      game.winnerId = (isFalseStart) ? Game.getOpponent(socket).id : socket.user.id;
      game.completedAt = Date.now();

      io.to(gameId).emit('change', {
        game: {
          reactScore: !isFalseStart ? reactTime / 10 : 0,
          winnerId: game.winnerId,
          completedAt: game.completedAt
        }
      });
      
      // setTimeout(() => {
      //   io.to(gameId).emit('game.end');
      // }, 1200)
    }
  });

  socket.on('game.list', () => {
    console.log('client game listing - ', socket.id);
    socket.emit('change', { games: Game.list(socket) });
  });
});

function updatePresence(io, socket) {
  socket.adapter.clients((error, clients) => {
    if (error) throw error;
    io.emit('change', { nbPlayers: clients.length });
  });
}