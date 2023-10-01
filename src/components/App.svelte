<script lang="ts">
  import { Application } from 'svelte-pixi';
  import Scene from './Scene.svelte';
  import Config from './Config.svelte';
  import type { WatorWorldConfig } from '../wator';

  let sceneConfig = {
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
    cellSize: 16,
    fishColor: 0x00ccbf,
    sharkColor: 0x3f7c85,
    emptyColor: 0x72f2eb,
    updateTime: 100,
  };

  let watorWorldConfig: WatorWorldConfig = {
    width: 0,
    height: 0,
    fishPopSize: 2000 / 4,
    sharkPopSize: 200 / 4,
    fishBreedTime: 3,
    sharkBreedTime: 20,
    sharkStarveTime: 3,
  };

  $: watorWorldConfig.width = Math.floor(sceneConfig.width / sceneConfig.cellSize);
  $: watorWorldConfig.height = Math.floor(sceneConfig.height / sceneConfig.cellSize);
</script>

<div class="app">
  <div class="config">
    <Config bind:sceneConfig bind:watorWorldConfig />
  </div>
  {#key sceneConfig.width * sceneConfig.height}
    <Application width={sceneConfig.width} height={sceneConfig.height}>
      <Scene {sceneConfig} {watorWorldConfig} />
    </Application>
  {/key}
</div>

<style>
  .app {
    position: relative;
  }
  .config {
    position: absolute;
    right: 0;
    padding: 1%;
  }
</style>
