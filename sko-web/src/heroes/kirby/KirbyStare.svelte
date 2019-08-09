<script>
import BaseStare from '../BaseStare';

let className = '';
export { className as class };
export let from;
</script>

<BaseStare class="KirbyStare {className}" from="{from}">
  <div class="face"></div>
</BaseStare>

<style lang="less">
.face {
  background: url('/samurai-kirby.png') no-repeat -1px -1px;
  width: 254px;
  height: 44px;
}
</style>