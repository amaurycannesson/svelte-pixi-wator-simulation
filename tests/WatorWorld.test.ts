import { describe, expect, test } from 'vitest';
import { WatorWorld, Empty, Fish, Shark } from '../src/wator';

describe('Wa-Tor World', () => {
  describe('Grid', () => {
    test('should return empty grid when world size is 0', () => {
      const watorWorld = new WatorWorld({ width: 0, height: 0 });

      expect(watorWorld.getWorld().length).toBe(0);
    });

    test('should return only one empty cell when creating 1x1 world', () => {
      const watorWorld = new WatorWorld({
        width: 1,
        height: 1,
      });

      expect(watorWorld.getWorld()[0][0]).toBeInstanceOf(Empty);
    });

    test('should return 3 empty cells when creating a 3x1 ', () => {
      const watorWorld = new WatorWorld({ width: 3, height: 1 });

      expect(watorWorld.getWorld()[0].length).toBe(3);
      expect(
        watorWorld
          .getWorld()
          .flat()
          .every((c) => c instanceof Empty)
      ).toBeTruthy();
    });

    test('should return one cell with a fish when populating with one fish a 1x1 word', () => {
      const watorWorld = new WatorWorld({
        width: 1,
        height: 1,
      });

      watorWorld.populate({ fishPopSize: 1 });

      expect(watorWorld.getWorld()[0][0]).toBeInstanceOf(Fish);
    });

    test('should return 2 fishes and 2 empty cells when populating with 2 fishes a 2x2 word', () => {
      const watorWorld = new WatorWorld({
        width: 2,
        height: 2,
      });

      watorWorld.populate({ fishPopSize: 2 });

      expect(
        watorWorld
          .getWorld()
          .flat()
          .filter((c) => c instanceof Empty).length
      ).toBe(2);
      expect(
        watorWorld
          .getWorld()
          .flat()
          .filter((c) => c instanceof Fish).length
      ).toBe(2);
    });

    test('should return one cell with a shark when populating with one shar a 1x1 world', () => {
      const watorWorld = new WatorWorld({ width: 1, height: 1 });

      watorWorld.populate({ sharkPopSize: 1 });

      expect(watorWorld.getWorld()[0][0]).toBeInstanceOf(Shark);
    });
  });

  describe('Population', () => {
    test('should return empty population', () => {
      const watorWorld = new WatorWorld();

      expect(watorWorld.getPopulation().length).toBe(0);
    });

    test('should return one fish and one shark when populating world with one fish and one shark', () => {
      const watorWorld = new WatorWorld({ width: 10, height: 10 });

      watorWorld.populate({ fishPopSize: 1, sharkPopSize: 1 });

      const fishes = watorWorld.getPopulation().filter((p) => p instanceof Fish);
      expect(fishes.length).toBe(1);
      expect(watorWorld.getWorld()[fishes[0].y][fishes[0].x]).toBe(fishes[0]);

      const sharks = watorWorld.getPopulation().filter((p) => p instanceof Shark);
      expect(sharks.length).toBe(1);
      expect(watorWorld.getWorld()[sharks[0].y][sharks[0].x]).toBe(sharks[0]);
    });
  });

  describe('Movement', () => {
    test('should move to the next free cell when only one fish and 2 cells', () => {
      const watorWorld = new WatorWorld({ width: 2, height: 1 });

      watorWorld.populate({ fishPopSize: 1 });

      const beforeFish = { ...watorWorld.getPopulation()[0] };

      watorWorld.tick();

      const afterFish = watorWorld.getPopulation()[0];

      expect(watorWorld.getWorld()[afterFish.y][afterFish.x]).toBe(afterFish);
      expect(watorWorld.getWorld()[beforeFish.y][beforeFish.x]).toBeInstanceOf(Empty);
    });

    test('should not move when no free cells', () => {
      const watorWorld = new WatorWorld({ width: 2, height: 2 });

      watorWorld.populate({ fishPopSize: 4 });

      const beforeFish = { ...watorWorld.getPopulation()[0] };

      watorWorld.tick();

      const afterFish = watorWorld.getPopulation()[0];

      expect(watorWorld.getWorld()[afterFish.y][afterFish.x]).toBe(
        watorWorld.getWorld()[beforeFish.y][beforeFish.x]
      );
    });
  });

  describe('Breeding', () => {
    test('should create a new fish when breed time counter exceeded breed time and a free cell is availaible', () => {
      const watorWorld = new WatorWorld({ width: 2, height: 2, fishPopSize: 1, fishBreedTime: 3 });

      watorWorld.populate();
      watorWorld.tick();
      watorWorld.tick();
      watorWorld.tick();

      expect(watorWorld.getPopulation().length).toBe(2);
    });

    test('should reset breed time counter after breeding', () => {
      const watorWorld = new WatorWorld({ width: 2, height: 2, fishPopSize: 1, fishBreedTime: 3 });

      watorWorld.populate();
      watorWorld.tick();
      watorWorld.tick();
      watorWorld.tick();

      expect(watorWorld.getPopulation().every((f) => f.breedTimeCounter === 0)).toBeTruthy();
    });

    test('should create 2 sharks when having 2 sharks and breed time counter exceeded breed time and two free cells are availaible', () => {
      const watorWorld = new WatorWorld({
        width: 3,
        height: 3,
        fishPopSize: 0,
        fishBreedTime: 3,
        sharkPopSize: 2,
        sharkBreedTime: 5,
        sharkStarveTime: 10,
      });

      watorWorld.populate();
      watorWorld.tick();
      watorWorld.tick();
      watorWorld.tick();
      watorWorld.tick();
      watorWorld.tick();

      expect(watorWorld.getPopulation().filter((f) => f instanceof Shark).length).toBe(4);
    });
  });

  describe('Eating', () => {
    test('should eat the fish when having a shark next to it', () => {
      const watorWorld = new WatorWorld({
        width: 2,
        height: 1,
      });

      watorWorld.populate({ fishPopSize: 1, sharkPopSize: 1 });
      watorWorld.tick();

      expect(watorWorld.getPopulation().length).toBe(1);
      expect(watorWorld.getPopulation()[0]).toBeInstanceOf(Shark);
      expect(
        watorWorld
          .getWorld()
          .flat()
          .some((c) => c instanceof Empty)
      ).toBeTruthy();
    });

    test('should starve when not finding fishes', () => {
      const watorWorld = new WatorWorld({
        width: 3,
        height: 3,
        sharkStarveTime: 3,
      });

      watorWorld.populate({ sharkPopSize: 2 });
      watorWorld.tick();
      watorWorld.tick();
      watorWorld.tick();

      expect(watorWorld.getPopulation().length).toBe(0);
      expect(
        watorWorld
          .getWorld()
          .flat()
          .every((c) => c instanceof Empty)
      ).toBeTruthy();
    });
  });
});
