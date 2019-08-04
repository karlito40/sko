import io from 'socket.io-client';
import store from './store';

const socket = io('http://localhost:3006');
socket.on('connect', () => {
  console.log('- socket connect');
  store.merge({ connected: true });
});

socket.on('change', (changes) => {
  console.log('change -', changes);
  store.merge(changes);
});

socket.on('game.end', () => {
  console.log('game.end')
  store.leaveGame();
});

socket.on('disconnect', () => {
  console.log('- socket disconnect');
  store.merge({ connected: false });
});

socket.on('reconnect', () => {
  console.log('- socket reconnect');
  store.merge({ connected: true });
});

export const game = {
  join() {
    store.merge({ searching: true });
    socket.emit('game.join')
  },
  // leave: (cb) => socket.emit('game.leave', cb),
  ready: () => socket.emit('game.ready'),
  list: () => socket.emit('game.list'),
  attack: () => socket.emit('game.attack')
};

export default socket;