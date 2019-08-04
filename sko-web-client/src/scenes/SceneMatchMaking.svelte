<script>
import { TimelineMax, Linear } from 'gsap/all';
import { onMount } from 'svelte';
import store from '../store';
import { game as gameSocket } from '../socket';

let el$;

onMount(() => {
  gameSocket.join();

  const tl = new TimelineMax({ repeat: -1 });
  tl.staggerTo(el$.querySelectorAll('span'), 0.5, { opacity: 1 }, 1.2);
});
</script>

<div class="SceneMatchMaking" bind:this={el$}>
  <div></div>
  <div>Searching match<span>.</span><span>.</span><span>.</span></div>
  <div>{ $store.nbPlayers } player(s) online</div>
</div>

<style lang="less">
.SceneMatchMaking {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  background: black;
  color: white;
  padding: 10px;
}

span {
  opacity: 0;
}
</style>