const uuid = require('uuid/v1');
const { random } = require('lodash');
const { IoC } = require('./libs');

module.exports = class Game {
  static enhanceSocket (socket) {
    socket.joinGame = (game) => {
      socket.gameId = game.id;
      socket.join(game.id);
  
      if(!socket.adapter.rooms[game.id].game) {
        socket.adapter.rooms[game.id].game = game;
      }

      return game.addUser(socket.getUser());
    }
  
    socket.getGame = () => {
      const { gameId } = socket;
      return socket.adapter.rooms[gameId].game;
    }
  }

  static getRooms (socket) {
    return Object
      .values(socket.adapter.rooms)
      .filter((room) => room.game);
  }

  static make (form) {
    return new Game({
      id: 'game.' + uuid(),
      ...form
    });
  }

  constructor ({ id, createdAt, startedAt, fullAt }) {
    this.id = id;
    this.users = [];
    this.createdAt = createdAt;
    this.startedAt = startedAt;
    this.fullAt = fullAt;
  }
  
  addUser (user) {
    this.users.push(user);

    if(this.users.length === 2) {
      this.fullAt = Date.now();

      IoC('io').to(this.id).emit('change', {
        searching: false,
        game: this.toJSON()
      })
    }
  }

  start () {
    this.startedAt = Date.now();
    this.fireAt = Date.now() + parseInt(random(6, 9, true) * 1000);
    
    IoC('io').to(this.id).emit('change', {
      game: {
        startedAt: this.startedAt,
        fireAt: this.fireAt
      }
    });
  }

  handleAttack (attackingUser, targetedUser) {
    const reactTime = Date.now() - this.fireAt;
    const isFalseStart = reactTime < 0;
    const reactScore = (!isFalseStart) ? reactTime / 10 : 0;
    this.winnerId = (isFalseStart) ? targetedUser.id : attackingUser.id;
    this.completedAt = Date.now();

    IoC('io').to(this.id).emit('change', {
      game: {
        reactScore,
        winnerId: this.winnerId,
        completedAt: this.completedAt
      }
    });
  }

  getOpponent (user) {
    return this.users.find((u) => u.id !== user.id);
  }

  isReady () {
    return this.users.filter((user) => user.readyAt).length === 2;
  }

  hasWinner () { return this.winnerId; }
  isFull () { return Boolean(this.fullAt); }

  toJSON () {
    return {
      id: this.id,
      createdAt: Date.now(),
      fullAt: this.fullAt,
      users: this.users.map((u) => u.toJSON())
    };
  }
}