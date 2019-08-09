<script>
import SpriteExplosion from '../components/SpriteExplosion';

let className = '';
export { className as class };
export let state = '';
export let placement = 'left';
export let el$;
let explosion = {
  frame: 0,
  play: false
};

$: if (explosion.play) {
  explosion.frame = 0;
}

$: if (state.includes('death')) {
  explosion.play = true;
}
</script>

<div class="Chara {className}" data-placement={placement} bind:this={el$}>
  <slot/>
  <SpriteExplosion
    bind:iFrame={explosion.frame}
    autoplay={explosion.play}
    class={explosion.play ? 'is-active' : ''}
    on:complete={() => explosion.play = false}
  />
</div>

<style lang="less">
.Chara {
  & { position: relative; }
  &[data-placement="right"] { transform: rotateY(180deg); }

  :global(.Explosion) {
    position: absolute;
    bottom: 7px;
    transform: scale(0.6);
    left: 0;
    visibility: hidden;
  }

  :global(.Explosion.is-active) {
    visibility: visible;
  }
}
</style>