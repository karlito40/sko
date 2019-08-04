<script context="module">
export const frames = [
  { width: 10, height: 10, x: 11, y: 11 },
  { width: 18, height: 18, x: 39, y: 7 },
  { width: 28, height: 28, x: 66, y: 2 },
  { width: 27, height: 27, x: 98, y: 2 },
  { width: 26, height: 19, x: 192, y: 0 },
];
</script>

<script>
import Sprite from './Sprite';

let className = '';
export { className as class };
export let autoplay = true;
export let iFrame = 0;
</script>

<!-- mandantory to override css -->
<div class="Explosion {className}">
  <Sprite 
    frames={frames} 
    autoplay={autoplay}
    bind:iFrame={iFrame}
    speed="30"
    on:complete
  />
</div>


<style lang="less">
.Explosion :global(.frame) {
  background-image: url('/explosion.png');
} 
</style>
