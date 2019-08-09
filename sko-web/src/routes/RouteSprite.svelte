<script>
import LayoutGame from '../components/LayoutGame';
import { kirby, wadle, metaKnight } from '../heroes';
import SpriteExplosion, { frames as explosionFrames } from '../components/SpriteExplosion';

const sprites = {
  kirby: {
    component: Kirby.Character,
    autoplay: true,
    iFrame: 0,
    animation: Object.keys(kirby.animations)[0],
    animations: Object.keys(kirby.animations)
  },
  wadle: {
    component: Wadle.Character,
    autoplay: true,
    iFrame: 0,
    animation: Object.keys(wadle.animations)[0],
    animations: Object.keys(wadle.animations)
  },
  metaKnight: {
    component: MetaKnight.Character,
    autoplay: true,
    iFrame: 0,
    animation: Object.keys(metaKnight.animations)[0],
    animations: Object.keys(metaKnight.animations)
  },
  explosion: {
    component: SpriteExplosion,
    autoplay: true,
    iFrame: 0,
    animation: explosionFrames,
    animations: []
  }
};
</script>

<LayoutGame>
  {#each Object.values(sprites) as sprite}
    <section class="animation">
      <div class="animation__body">
        {sprite.iFrame}
        <svelte:component 
          this={sprite.component}
          {...sprite}
          bind:iFrame={sprite.iFrame}
        />
      </div>

      <div class="animation__footer">
        <div class="actions">
          <button on:click={() => sprite.iFrame--}> prev</button>
          <button on:click={() => sprite.iFrame++}> next</button>
          <button on:click={() => sprite.iFrame = 0}> reset</button>
          <button on:click={() => sprite.autoplay = !sprite.autoplay}>
            {sprite.autoplay ? 'pause' : 'start'}
          </button>
        </div>

        <div class="animations">
          {#each sprite.animations as animation}
            <button on:click={() => sprite.animation = animation}> {animation}</button>
          {/each}
        </div>
      </div>
    </section>
  {/each}
</LayoutGame>

<style lang="less">
.animation__body, .animation__footer {
  display: flex;
}

button {
  font-size: 7px;
  padding: 0px 3px;
}
.animations button {
  color: orange;
}
</style>