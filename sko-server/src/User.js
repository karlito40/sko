const uuid = require('uuid/v1');

module.exports = class User {
  constructor (socket) {
    this.socket = socket;
    this.socket.user = this;
  }

  create ({ name, heroId }) {
    this.id = uuid();
    this.name = name,
    this.heroId = heroId;
    
    console.log('user create - ', this.toJSON());
    this.socket.nsp.emit('user.created', this);
    this.socket.emit('change', { me: this });
  }

  ready () { this.readyAt = Date.now(); }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      heroId: this.heroId
    };
  }
}