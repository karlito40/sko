<script>
import BaseStare from '../BaseStare';

let className = '';
export { className as class };
export let from;
</script>

<BaseStare class="WadleStare {className}" from="{from}">
  <div class="face"></div>
</BaseStare>

<style lang="less">
.face {
  background: url('/samurai-kirby.png') no-repeat 0 -53px;
  width: 256px;
  height: 46px;
}
</style>
