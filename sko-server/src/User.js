const uuid = require('uuid/v1');

module.exports = class User {
  static enhanceSocket (socket) {
    socket.setUser = (user) => {
      socket.user = user;
      socket.emit('change', { me: user });
    }
    socket.getUser = () => socket.user;
  }

  static make(form) {
    return new User({
      id: uuid(),
      ...form
    });
  }

  constructor ({ id, name, heroId }) {
    this.id = id;
    this.name = name;
    this.heroId = heroId;
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