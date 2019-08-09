
<script>
import Navaid from 'navaid';
import { onDestroy } from 'svelte';

let Route, params;

const router = Navaid('/')
  .on('/', () => import('./routes/RouteHome.svelte').then(renderRoute))
  .on('/sprites', () => import('./routes/RouteSprite.svelte').then(renderRoute))
  .on('/scenarios', () => import('./routes/RouteScenario.svelte').then(renderRoute))
  .listen();

onDestroy(router.unlisten);

function renderRoute(m, obj) {
  params = obj || {};
  if (m.preload) {
    m.preload({ params }).then(() => {
      Route = m.default;
    });
  } else {
    Route = m.default;
  }
}
</script>

<main class="App">
  <svelte:component this={Route} {params} />
</main>

<style lang="less">
:global(*, *:after, *:before) {
  box-sizing: border-box;
}

:global(body, html) {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  font-family: MatchupPro, sans-serif;
  user-select: none;
}

:global(input) {
  font-family: MatchupPro, sans-serif;
  outline: 0;
  padding: 1px;
}

:global(button[type="submit"]) {
  & {
    cursor: pointer;
    font-family: MatchupPro, sans-serif;
    background: linear-gradient(to bottom, #f1e767 0%,#feb645 100%);
    color: white;
    text-shadow: 1px 1px black;
    display: inline-block;
    border-radius: 2px;
    border: 1px solid #feb645;
    transition: 0.2s all;
    outline: 0;
  }

  &:hover {
    border: 1px solid #f1e767;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  }

  &:active {
    border: 1px solid black;
  }
}

.App {
  width: 100%;
  height: 100%;
  padding: 30px;
  background: url('/background.png') no-repeat;
  background-size: cover;
}
</style>