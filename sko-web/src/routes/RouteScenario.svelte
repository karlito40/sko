<script>
import { TimelineMax, Linear, Elastic } from 'gsap/all';
import AssetExclamation from '../components/AssetExclamation';
import LayoutGame from '../components/LayoutGame';
import UISignScore from '../components/UISignScore';
import { kirby, wadle, metaKnight } from '../heroes';

let backLayer$;
let frontLayer$;
let charaLayer$;
let curtainLayer$;
let score = 0;
let tl;
let winner, loser;

let game = {
  state: 'running',
  me: {
    hero: {
      // ...kirby,
      ...kirby,
      // ...wadle,
      state: 'idle'
    }
  },
  opponent: { 
    hero: {
      ...metaKnight,
      // ...kirby,
      state: 'idle'
    }
  }
};

function initScenario() {
  const fireAt = 1; // 1 seconde 
  const reactTime = 0.8;  
  tl = new TimelineMax();
  // affichage du fond noir
  tl
    .to(backLayer$.querySelector('.mask'), 1, { opacity: 0.8 })
  // affichage des regards
    .to(backLayer$.querySelectorAll('.Stare'), 0, { opacity: 1 })
    .to(backLayer$.querySelectorAll('.Stare .face'), 0.4, { x: 0, ease: Linear.easeNone }, '+=0.8')
    .to(backLayer$.querySelectorAll('.Stare'), 0, { opacity: 0 }, '+=1.5')
  // suppression du fond noir
    .to(backLayer$.querySelectorAll('.mask'), 0.3, { opacity: 0 })
    .to(frontLayer$.querySelector('.versus'), 0, { opacity: 1 })
    .to(frontLayer$.querySelector('.Exclamation'), 0, { opacity: 1 }, `+=${fireAt}`)
    .call(() => score = 8, null, this, `+=${reactTime}`)
    .to(frontLayer$.querySelector('.Exclamation'), 0, { opacity: 0 })
    .addLabel('hit', '+=0.03')
    // shaking effect
    // .to([backLayer$, charaLayer$], 0, { y: 1 }, 'hit')
    // .to([backLayer$, charaLayer$], 0.05, { y: 0, ease: Elastic.easeOut.config( 5, 0.1) }, 'hit')
    // red hit background
    .to(backLayer$, 0, { mixBlendMode: 'lighten' }, 'hit')
    .to(backLayer$.querySelector('.mask'), 0, { opacity: 1 }, 'hit')
    .to(backLayer$.querySelector('.mask'), 0.04, { background: 'red'}, 'hit')
    .addLabel('hit:after')
    .to(backLayer$, 0, { mixBlendMode: 'normal'}, 'hit:after') // remove red hit backgroubd
    .to(backLayer$.querySelector('.mask'), 0.04, { background: 'white' }, 'hit:after')
    .to(backLayer$.querySelector('.mask'), 0, { background: 'transparent', opacity: 0})
    .call(() => {
      winner = game.me;
      loser = game.opponent;
      winner.hero.state = 'attack_' + loser.hero.id;
      loser.hero.state = 'death_' + winner.hero.id;
      game.state = 'complete';
      game = game;
    })
    .addLabel('endgame', '+=0.1')
    .to(frontLayer$.querySelectorAll('.endgame'), 0, { opacity: 1 }, 'endgame')
    .from(frontLayer$.querySelectorAll('.sign.no-tie'), 0.2, { height: 0, ease: Linear.easeNone }, 'engame')
    .from(frontLayer$.querySelectorAll('.sign.winner'), 0.3, { height: 0, ease: Linear.easeNone }, 'engame')
    .addLabel('next-round', 'endgame+=1.4')
    .to(frontLayer$.querySelector('.endgame__label'), 0, { opacity: 0 }, 'next-round')
    .to(frontLayer$.querySelectorAll('.sign.no-tie'), 0.2, { height: 0, ease: Linear.easeNone }, 'next-round+=0.2')
    .to(frontLayer$.querySelectorAll('.sign.winner'), 0.3, { height: 0, ease: Linear.easeNone }, 'next-round+=0.2')
    .to(curtainLayer$, 1, { opacity: 1 }, '+=0.4')
}

function toggleScenario() {
  if(!tl) {
    initScenario()
  } else if(!tl.reversed()){
    score = 0;
    tl.reverse();       
  } else {
    tl.play()
  }
}
</script>

<div class="debug-bar">
  <button on:click={toggleScenario}>Toggle</button>
</div>

<LayoutGame>
  <div class="back-layer layer" bind:this={backLayer$}>
    <div class="mask"></div>
    <svelte:component this={game.me.hero.Stare} from="left"/>
    <svelte:component this={game.opponent.hero.Stare} from="right"/>
  </div>

  <div class="character-layer layer" bind:this={charaLayer$}>
    <div class="chara is-left">
      <svelte:component
        this={game.me.hero.Character}
        animation={game.me.hero.state}
      />
    </div>
    <div class="chara is-right">
      <svelte:component
        this={game.opponent.hero.Character}
        animation={game.opponent.hero.state}
        placement="right"
      />
    </div>
  </div>

  <div class="front-layer layer" bind:this={frontLayer$}>
    <AssetExclamation qty="1"/>
    <div class="versus">
      <div class="info">
        <div class="info__label">Karl</div>
        <div class="info__count">0</div>
      </div>
      <div class="info">
        <div class="info__label">Left</div>
        <div class="info__count">1</div>
      </div>
      <div class="info">
        <div class="info__label">Jack</div>
        <div class="info__count">0</div>
      </div>
    </div>
    <div class="endgame">
      <div class="endgame__label">
        {#if game.state === 'complete'}
          {winner 
            ? `Winner ${winner.hero.name}`
            : 'Tie'
          }
        {/if}
      </div>
      <div class="endgame__sign">
        <div class="sign no-tie"></div>
        <div class="sign winner"></div>
      </div>
    </div>

    <div class="curtain-layer" bind:this={curtainLayer$}></div>
  </div>

  <UISignScore toScore={score}/>
</LayoutGame>

<style lang="less">
.layer {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
}

.debug-bar {
  position: absolute;
  z-index: 10;
}

.curtain-layer {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: black;
  opacity: 0;
  z-index: 20;
}

.back-layer {
  & { z-index: 1; }

  .mask {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: black;
    opacity: 0;
  }

  :global(.Stare) {
    & {
      position: absolute;
      left: 0; right: 0;
    }
    &.from-left { top: 0; }
    &.from-right { bottom: 0; }
  }
}

.character-layer {
  & { z-index: 3; }

  :global(.chara) {
    & { 
      position: absolute;
      bottom: 67px;
    }
    &.is-left { left: 46px; }
    &.is-right { right: 65px; }
  }
}

.front-layer {
  & { z-index: 4; }

  :global(.Exclamation) {
    position: absolute;
    top: 102px; left: 105px; 
    opacity: 0;
  }
}

.endgame {
  & {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    opacity: 0;
  }

  .endgame__label {
    position: absolute;
    bottom: 24px;
    width: 100%;
    text-align: center;
    font-family: MatchupPro, sans-serif;
    color: white;
    text-shadow: 1px 1px black;
    font-size: 23px;
  }

  .endgame__sign {
    .no-tie {
      background: url(/samurai-kirby.png) no-repeat -34px -105px;
      width: 22px;
      height: 38px;
      position: absolute;
      top: 35px;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .winner {
      background: url(/samurai-kirby.png) no-repeat -676px -102px;
      width: 22px;
      height: 70px;
      position: absolute;
      top: 35px;
      left: 40px;
    }
  }
}

.versus {
  & {
    display: flex;
    position: absolute;
    top: 20px;
    left: 40px; 
    right: 40px;
    opacity: 0;
  }
  
  .info {
    & { flex: 1; }
    &:nth-child(2) { text-align: center; }
    &:last-child { text-align: right; }
  }

  .info__label {
    font-family: MatchupPro, sans-serif;
    color: #061d9a;
    text-shadow: 0 0px 2px #7d7676;
    font-size: 14px;
  }

  .info:nth-child(2) .info__label {
    color: white;
  }

  .info:first-child .info__count, 
  .info:last-child .info__count {
    animation: blinker 0.5s step-start infinite;
  }

  .info__count {
    font-family: 'Vontens', cursive;
    color: #e0c90c;
    font-size: 28px;
    position: relative;
    top: -4px;
  }
}

@keyframes blinker {
  50% { opacity: 0; }
}
</style>