<script lang="ts">
  import type { WatorWorldConfig } from '../wator';
  import type { SceneConfig } from '../types';
  import Slider from '@bulatdashiev/svelte-slider';

  export let sceneConfig: SceneConfig;
  export let watorWorldConfig: WatorWorldConfig;

  let dialog: HTMLDialogElement;
  let isWatorTabSelected = true;

  // Scene config
  let maxWidth = window.innerWidth;
  let minWidth = Math.round(maxWidth / 8) * 2;
  let width = [maxWidth / 2, maxWidth];

  let maxHeight = window.innerHeight;
  let minHeight = Math.round(maxHeight / 8) * 2;
  let height = [maxHeight / 2, maxHeight];

  let maxCells = 22000;
  let maxCellSize = 32;
  let minCellSize = maxCellSize / 4;
  let cellSize = [maxCellSize / 2, maxCellSize];
  $: minCellSize = Math.round(Math.sqrt((width[0] * height[0]) / maxCells) / 2) * 2;

  let sceneUpdateTimeout: NodeJS.Timeout;
  $: {
    clearTimeout(sceneUpdateTimeout);
    sceneUpdateTimeout = setTimeout(() => {
      sceneConfig.width = width[0];
      sceneConfig.height = height[0];
      sceneConfig.cellSize = cellSize[0];
    }, 250);
  }

  // Wa-Tor config
  let minFishPopSize = 0;
  let maxFishPopSize = watorWorldConfig.width * watorWorldConfig.height;
  let fishPopSize = [maxFishPopSize / 4, maxFishPopSize];
  $: maxFishPopSize = watorWorldConfig.width * watorWorldConfig.height;

  let minSharkPopSize = 0;
  let maxSharkPopSize = watorWorldConfig.width * watorWorldConfig.height - fishPopSize[0];
  let sharkPopSize = [maxSharkPopSize / 4, maxSharkPopSize];
  $: maxSharkPopSize = watorWorldConfig.width * watorWorldConfig.height - fishPopSize[0];

  let minFishBreedTime = 1;
  let maxFishBreedTime = 30;
  let fishBreedTime = [maxFishBreedTime / 10, maxFishBreedTime];

  let minSharkBreedTime = 1;
  let maxSharkBreedTime = 30;
  let sharkBreedTime = [maxSharkBreedTime / 2, maxSharkBreedTime];

  let minSharkStarveTime = 1;
  let maxSharkStarveTime = 30;
  let sharkStarveTime = [maxSharkStarveTime / 10, maxSharkStarveTime];

  let watorUpdateTimeout: NodeJS.Timeout;
  $: {
    clearTimeout(watorUpdateTimeout);
    watorUpdateTimeout = setTimeout(() => {
      watorWorldConfig.fishPopSize = fishPopSize[0];
      watorWorldConfig.sharkPopSize = sharkPopSize[0];
      watorWorldConfig.fishBreedTime = fishBreedTime[0];
      watorWorldConfig.sharkBreedTime = sharkBreedTime[0];
      watorWorldConfig.sharkStarveTime = sharkStarveTime[0];
    }, 250);
  }
</script>

<button class="open-modal-button" on:click={() => dialog.showModal()}>⚙️</button>

<dialog bind:this={dialog}>
  <button class="tab-button" on:click={() => (isWatorTabSelected = true)}>Wa-Tor</button> |
  <button class="tab-button" on:click={() => (isWatorTabSelected = false)}>Scene</button>
  <button class="tab-button" style="float:right" on:click={() => dialog.close()}>[X] Close</button>
  <hr />
  {#if isWatorTabSelected}
    Number of fish: {fishPopSize[0]}
    <Slider bind:value={fishPopSize} min={minFishPopSize} max={maxFishPopSize} />
    Number of sharks: {sharkPopSize[0]}
    <Slider bind:value={sharkPopSize} min={minSharkPopSize} max={maxSharkPopSize} />
    Fish breed time: {fishBreedTime[0]} chronons
    <Slider bind:value={fishBreedTime} min={minFishBreedTime} max={maxFishBreedTime} />
    Shark breed time: {sharkBreedTime[0]} chronons
    <Slider bind:value={sharkBreedTime} min={minSharkBreedTime} max={maxSharkBreedTime} />
    Shark starve time: {sharkStarveTime[0]} chronons
    <Slider bind:value={sharkStarveTime} min={minSharkStarveTime} max={maxSharkStarveTime} />
  {:else}
    width: {width[0]}px
    <Slider bind:value={width} min={minWidth} max={maxWidth} step={cellSize[0]} />
    height: {height[0]}px
    <Slider bind:value={height} min={minHeight} max={maxHeight} step={cellSize[0]} />
    cell size: {cellSize[0]}px
    <Slider bind:value={cellSize} min={minCellSize} max={maxCellSize} step="2" />
  {/if}
</dialog>

<style>
  .open-modal-button {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-size: xx-large;
  }

  .open-modal-button:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .tab-button {
    all: unset;
    text-decoration: underline;
  }

  .tab-button:hover {
    cursor: pointer;
  }

  :modal {
    --thumb-bg: rgba(63, 124, 133);
    --progress-bg: rgb(63, 124, 133);
    --track-bg: rgb(114, 242, 235);

    color: white;
    background-color: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    max-width: 330px;
    border-radius: 12px;
    padding: 24px;
    backdrop-filter: blur(12px);
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.6);
    margin-bottom: 24px;
  }
</style>
