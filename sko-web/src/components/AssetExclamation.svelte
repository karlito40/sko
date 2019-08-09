<script>
let className = '';
export { className as class };
export let qty = 1;
</script>

<div class="Exclamation Exclamation--{qty} {className}"></div>

<style lang="less">
.Exclamation {
  background: url('/samurai-kirby.png') no-repeat;

  &--1 { 
    background-position: -275px -4px;
    width: 46px;
    height: 50px;
  }

  &--2 {
    background-position: -324px -4px;
	  width: 47px;
	  height: 52px;
  }
  
  &--2 {
    background-position: -324px -4px;
	  width: 47px;
	  height: 52px;
  }
}
</style>