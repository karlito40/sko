import { merge } from 'lodash-es';
import { writable } from 'svelte/store';

const { subscribe, update } = writable({
  connected: false,
  searching: false,
  me: undefined,
  nbPlayers: 0,
  games: [],
  game: undefined
});

export default {
  subscribe,
  merge: (data) => update(state => merge(state, data)),
  leaveGame: (data) => update(state => ({
    ...state,
    game: undefined
  })),
};