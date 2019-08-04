<script>
import { onMount } from 'svelte';
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

let scene = {
  name: undefined,
  key: undefined,
  ready: false
};

let sceneReady = false;
let curtainLayer$;
let tl;

$: if (scene.name === SceneRegisterUser && $store.me) {
  goTo(SceneMatchMaking);
}

$: if (scene.name !== SceneGame && $store.game && !$store.game.completedAt) {
  goTo(SceneGame);
}

function goTo(nextScene) {
  scene.ready = false;
  if(tl) {
    tl.kill();
  }
  
  const leaveDuration = scene.name ? 0.6 : 0;
  tl = new TimelineMax();
  tl
    .to(curtainLayer$, leaveDuration, { opacity: 1 })
    .call(() => {
      // if(scene.name === Game) {
      //   tl.pause();
      //   gameSocket.leave(() => {
      //     store.leaveGame();
      //     console.log('nextScene', nextScene);
      //     scene.name = nextScene
      //     tl.play();
      //   });
      // } else {
      //   scene.name = nextScene
      // }
      scene.name = nextScene;
    })
    .to(curtainLayer$, 0.6, { opacity: 0 })
    .call(() => {
      scene.ready = true;
      tl = null
    });
}

function onComplete() {
  // console.log('on complete')
  if(scene.name === SceneSplashScreen) {
    goTo(SceneRegisterUser)
  }

  if(scene.name === SceneGame) {
    goTo(SceneEndSlide);
  }
  
  if(scene.name === SceneEndSlide) {
    goTo(SceneThanks);
  }
}

onMount(() => goTo(SceneSplashScreen));
</script>

<svelte:head>
	<title>Samurai Kirby !</title>
</svelte:head>

<div class="RouteHome">
  <LayoutGame>
    {#if scene.name}
      <svelte:component 
        this={scene.name} 
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