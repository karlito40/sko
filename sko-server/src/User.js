const uuid = require('uuid/v1');

module.exports = class User {
  constructor (socket, { name, heroId }) {
    this.socket = socket;
    this.socket.user = this;

    this.id = uuid();
    this.name = name;
    this.heroId = heroId;
  }

  save () {
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