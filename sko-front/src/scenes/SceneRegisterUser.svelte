<script>
import { createEventDispatcher } from 'svelte';
import { sample } from 'lodash-es';
import * as heroes from '../heroes';
import socket from '../socket';

const dispatch = createEventDispatcher();

let form = { 
  name: '',
  heroId: sample(heroes).id
};

function onSubmit() {
  if(form.name.length) {
    socket.emit('user.create', form);
  }
}
</script>

<form class="SceneRegisterUser" on:submit|preventDefault={onSubmit}>
	<input 
    type="text"
    placeholder="Enter name..."
    bind:value={form.name}
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    autofocus
  >
  <button type="submit">Go</button>
</form>

<style>
.SceneRegisterUser {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

input {
  border: 0;
  background: rgba(0, 0, 0, 0.3);
  font-size: 17px;
  color: peachpuff;
  display: inline-block;
  padding: 2px 5px;
  margin-right: 3px;
}

button {
  position: relative;
  top: -2px;
}

::placeholder {
  color: peachpuff;
  font-size: 13px;
}
</style>