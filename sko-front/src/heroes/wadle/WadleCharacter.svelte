<script>
import { tick } from 'svelte';
import { TweenMax } from 'gsap/all';
import Sprite from '../../components/Sprite';
import BaseCharacter from '../BaseCharacter';
import wadle from './entity';

let chara$;
let className = '';
export { className as class };
export let animation;
export let iFrame = 0;
export let autoplay = true;
export let placement;

$: frames = wadle.animations[animation];
$: if(animation.includes('death') && !wadle.animations[animation]) {
  animation = 'death';
}

/* IDLE */
$: if(animation === 'idle') {
  moveChara(0);
}

/* ATTACK */
$: {
  if(animation.includes('attack') && !wadle.animations[animation]) {
    animation = 'attack';
  }

  if(animation.includes('attack')) {
    moveChara(110);
  }
}

/* DEATH */
$: {
  if(animation.includes('death') && !wadle.animations[animation]) {
    animation = 'death';
  }

  if(animation.includes('death')) {
    moveChara(90);
  }
}

async function moveChara(by) {
  await tick();
  const dir = placement === 'right' ? -1 : 1;
  TweenMax.set(chara$, { x: by * dir });
}
</script>

<BaseCharacter 
  class="Wadle {className}" 
  state={animation} 
  placement={placement}
  bind:el$={chara$}
>
  <Sprite 
    frames={frames} 
    autoplay={autoplay}
    bind:iFrame={iFrame}
  />
</BaseCharacter>
