
<script>
import { onMount, createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

onMount(() => {
  setTimeout(() => {
    dispatch('complete');
  }, 1200);
})
</script>

<div class="SceneEndSlide">
  <div>That's all folks !!!</div>
</div>

<style lang="less">
.SceneEndSlide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
  text-align: center;
  height: 100%;
  width: 100%;
}
</style>