<script>
import { onMount, tick } from 'svelte';
import { TimelineMax } from 'gsap/all';
import LayoutGame from '../components/LayoutGame';
import SceneSplashScreen from '../scenes/SceneSplashScreen';
import SceneRegisterUser from '../scenes/SceneRegisterUser';
import SceneEndSlide from '../scenes/SceneEndSlide';
import SceneThanks from '../scenes/SceneThanks';
import SceneMatchMaking from '../scenes/SceneMatchMaking';
import SceneGame from '../scenes/SceneGame';
import store from '../store';
import { game as gameSocket } from '../socket';

let curtainLayer$;
let tl;
let scene = {
  Component: undefined,
  ready: false
};

$: if (scene.Component === SceneRegisterUser && $store.me) {
  goTo(SceneMatchMaking);
}

$: if (scene.Component !== SceneGame && $store.game && !$store.game.completedAt) {
  goTo(SceneGame);
}

function onComplete() {
  // console.log('on complete')
  if(scene.Component === SceneSplashScreen) {
    goTo(SceneRegisterUser)
  }

  if(scene.Component === SceneGame) {
    goTo(SceneEndSlide);
    // goTo(SceneGame);
  }
  
  if(scene.Component === SceneEndSlide) {
    goTo(SceneThanks);
  }
}

function goTo(nextComponent) {
  scene.ready = false;
  if(tl) {
    tl.kill();
  }
  
  const leaveDuration = scene.Component ? 0.6 : 0;
  tl = new TimelineMax();
  tl
    .to(curtainLayer$, leaveDuration, { opacity: 1 })
    .call(() => {
      if(scene.Component === nextComponent) {
        scene.Component = undefined;
        tick().then(() => {
          scene.Component = nextComponent;
        });
      } else {
        scene.Component = nextComponent;
      }
    })
    .to(curtainLayer$, 0.6, { opacity: 0 })
    .call(() => {
      scene.ready = true;
      tl = null
    });
}

onMount(() => goTo(SceneSplashScreen));
</script>

<svelte:head>
  <title>Samurai Kirby !</title>
</svelte:head>

<div class="RouteHome">
  <LayoutGame>
    {#if scene.Component}
      <svelte:component 
        this={scene.Component} 
        ready={scene.ready}
        on:complete={onComplete}
      />
    {/if}
    <div class="curtain-layer" bind:this={curtainLayer$}></div>
  </LayoutGame>
</div>

<style lang="less">
.RouteHome {
  & { height: 100%; width: 100%; }

  /* :global(.SceneRegisterUser) {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  } */
}

.curtain-layer {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: black;
  opacity: 0;
  z-index: 20;
  pointer-events: none;
}
</style>