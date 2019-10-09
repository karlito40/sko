import { CSSPlugin }  from "gsap/all"
import App from './App.svelte';
import './socket';

const treeShakingCompliant = [CSSPlugin];

export default new App({
  target: document.body
});