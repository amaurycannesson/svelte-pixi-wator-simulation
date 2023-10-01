<script lang="ts">
  import * as PIXI from 'pixi.js';
  import { ParticleContainer, onTick } from 'svelte-pixi';
  import { WatorWorld, type Cell, type WatorWorldConfig, CellType } from '../wator';
  import { onMount } from 'svelte';
  import type { SceneConfig } from '../types';

  export let sceneConfig: SceneConfig;
  export let watorWorldConfig: WatorWorldConfig;

  let watorWorld: WatorWorld | undefined;
  let cellSprites: PIXI.Sprite[] = [];
  let container: PIXI.ParticleContainer | undefined;

  $: {
    destroySprites();

    watorWorld = new WatorWorld(watorWorldConfig);
    watorWorld.populate();

    const grid = watorWorld.getWorld();

    if (container) {
      for (let y = 0; y < watorWorldConfig.height; y++) {
        for (let x = 0; x < watorWorldConfig.width; x++) {
          const cell = grid[y][x];
          const cellSprite = new PIXI.Sprite(PIXI.Texture.WHITE);

          updateCellColor(cell, cellSprite);

          cellSprite.x = x * sceneConfig.cellSize;
          cellSprite.y = y * sceneConfig.cellSize;
          cellSprite.width = sceneConfig.cellSize;
          cellSprite.height = sceneConfig.cellSize;

          cellSprites.push(cellSprite);
          container.addChild(cellSprite);
        }
      }
    }
  }

  const updateCellColor = (cell: Cell, cellSprite: PIXI.Sprite) => {
    if (cell.type === CellType.Shark) {
      cellSprite.tint = sceneConfig.sharkColor;
    } else if (cell.type === CellType.Fish) {
      cellSprite.tint = sceneConfig.fishColor;
    } else if (cell.type === CellType.Empty) {
      cellSprite.tint = sceneConfig.emptyColor;
    }
  };

  const destroySprites = () => {
    cellSprites.forEach((sprite) => sprite.destroy());
    cellSprites = [];
  };

  let elapsedTime = 0;
  onTick((delta) => {
    elapsedTime += (1 / 60) * delta;

    if (elapsedTime >= sceneConfig.updateTime / 1000 && watorWorld) {
      elapsedTime = 0;

      watorWorld.tick();

      const grid = watorWorld.getWorld();

      for (let y = 0; y < watorWorldConfig.height; y++) {
        for (let x = 0; x < watorWorldConfig.width; x++) {
          const cell = grid[y][x];
          const cellSprite = cellSprites[watorWorldConfig.width * y + x]!;

          updateCellColor(cell, cellSprite);
        }
      }
    }
  });

  onMount(() => {
    return () => {
      destroySprites();
    };
  });
</script>

<ParticleContainer
  bind:instance={container}
  maxSize={sceneConfig.width * sceneConfig.height}
  properties={{
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  }}
/>
