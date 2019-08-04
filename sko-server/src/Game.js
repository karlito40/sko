const uuid = require('uuid/v1');
const { random } = require('lodash');

module.exports = class Game {
  static rooms (socket) {
    return Object.values(socket.adapter.rooms)
      .filter((room) => room.game);
  }

  constructor (io) {
    this.io = io;
    this.id = 'game.' + uuid();
    this.users = [];
    this.createdAt = Date.now();
    this.startedAt = undefined;
    this.fullAt = undefined;
  }

  addUser (user) {
    this.users.push(user);

    const socket = user.socket;
    socket.game = this;
    socket.join(this.id);

    if(!socket.adapter.rooms[this.id].game) {
      socket.adapter.rooms[this.id].game = this;
    }

    if(this.users.length === 2) {
      this.fullAt = Date.now();

      this.io.to(this.id).emit('change', {
        searching: false,
        game: this.toJSON()
      })
    }
  }

  start () {
    this.startedAt = Date.now();
    this.fireAt = Date.now() + parseInt(random(6, 9, true) * 1000);
    
    this.io.to(this.id).emit('change', {
      game: {
        startedAt: this.startedAt,
        fireAt: this.fireAt
      }
    });
  }

  attackBy (attacker) {
    const reactTime = Date.now() - this.fireAt;
    const isFalseStart = reactTime < 0;
    const reactScore = (!isFalseStart) ? reactTime / 10 : 0;
    this.winnerId = (isFalseStart) ? this.getOpponent(attacker).id : attacker.id;
    this.completedAt = Date.now();

    this.io.to(this.id).emit('change', {
      game: {
        reactScore,
        winnerId: this.winnerId,
        completedAt: this.completedAt
      }
    });
  }

  getOpponent (user) {
    return this.users.find((userId) => userId !== user.id);
  }

  isReady () {
    return this.users.filter((user) => user.readyAt).length === 2;
  }

  hasWinner () { return this.winnerId; }

  toJSON () {
    return {
      id: this.id,
      createdAt: Date.now(),
      fullAt: undefined,
      users: this.users.map((u) => u.toJSON())
    }
  }
}