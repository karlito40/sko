<script>
import { padStart } from 'lodash-es';
import { onMount } from 'svelte';
import { TweenMax, Linear } from 'gsap/all';

let game$;
const scene = {
  img: '/background.png',
  width: 256,
  height: 222,
  scale: 1
};

onMount(autoScale);

function autoScale() {
  const container = game$.getBoundingClientRect()
  
  if(container.width < container.height) {
    scene.scale = container.width / scene.width;
  } else {
    scene.scale = container.height / scene.height;
  }
}
</script>

<svelte:window on:resize={autoScale}/>

<div class="LayoutGame" bind:this={game$}>
  <div 
    class="Game__body" 
    style="{`
      background: url(${scene.img});
      width: ${scene.width}px;
      height: ${scene.height}px;
      transform: scale(${scene.scale});
    `}"
  >
    <slot/>
  </div>
</div>

<style lang="less">
.LayoutGame {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.Game__body {
  position: relative;
  background-color: black;
  box-shadow: 0 0 9px rgba(0, 0, 0, 0.6), 0 0 0 9999px rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  overflow: hidden;
}
</style>
