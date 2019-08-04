import { CSSPlugin }  from "gsap/all"
import App from './App.svelte';
import './socket';

const treeShakingCompliant = [CSSPlugin];

const app = new App({
	target: document.body
});

export default app;