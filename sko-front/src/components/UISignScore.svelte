<script>
import { padStart } from 'lodash-es';

export let toScore = 0;
let currentScore = toScore;
let oldScore = toScore;
let tweenScore = null;

$: if(oldScore !== toScore) {
  updateScore();
  oldScore = toScore;
}

function updateScore() {
  if(tweenScore) {
    tweenScore.kill();
  }
  
  // TODO: calculer le temps d'animation en fonction de la difference
  // entre currentScore et toScore
  const animObject = { v: currentScore };
  tweenScore = TweenMax.to(animObject, 0.2, {
    v: toScore,
    ease: Linear.easeNone,
    onUpdate: () => currentScore = ~~animObject.v
  });
}
</script>

<div class="SignScore">{padStart(currentScore, 2, 0)}</div>

<style lang="less">
.SignScore {
  position: absolute;
  bottom: 57px;
  right: 18px;
  width: 25px;
  line-height: 21px;
  font-family: MatchupPro, sans-serif;
  text-align: center;
  font-size: 26px;
  color: #101010;
}
</style>
