import shuffle from 'lodash.shuffle';
import { buildMatrix, isNotEmpty, mod, randomElement } from './utils';
import {
  type Cell,
  type Breeder,
  CellFactory,
  Empty,
  CellType,
  isEmpty,
  type Denizen,
  type DenizenCellType,
  type Eater,
  isAnEater,
  isPreyType,
  isABreeder,
} from './cells';

export interface WatorWorldConfig {
  width: number;
  height: number;
  fishPopSize: number;
  sharkPopSize: number;
  fishBreedTime: number;
  sharkBreedTime: number;
  sharkStarveTime: number;
}

const defaultConfig: WatorWorldConfig = {
  width: 10,
  height: 10,
  fishPopSize: 0,
  sharkPopSize: 0,
  fishBreedTime: 5,
  sharkBreedTime: 10,
  sharkStarveTime: 5,
};

class WatorWorld {
  private readonly config: WatorWorldConfig;
  private grid: Cell[][];
  private population: Denizen[];
  private cellFactory: CellFactory;

  constructor(config: Partial<WatorWorldConfig> = defaultConfig) {
    this.config = { ...defaultConfig, ...config };

    const { width, height, sharkBreedTime, sharkStarveTime, fishBreedTime } = this.config;

    this.cellFactory = new CellFactory({ sharkBreedTime, sharkStarveTime, fishBreedTime });
    this.population = [];
    this.grid = buildMatrix<Cell>(width, height, (x, y) =>
      this.cellFactory.create(CellType.Empty, x, y)
    );
  }

  populate({
    fishPopSize,
    sharkPopSize,
  }: {
    fishPopSize?: number;
    sharkPopSize?: number;
  } = {}) {
    const createPopulation = (popType: DenizenCellType, popSize: number) => {
      let remaining = popSize;

      while (remaining) {
        const emptyCells = this.grid.flat().filter(isEmpty);

        if (isNotEmpty(emptyCells)) {
          const emptyCell = randomElement(emptyCells);
          const fish = this.cellFactory.create(popType, emptyCell.x, emptyCell.y);
          this.grid[emptyCell.y][emptyCell.x] = fish;
          this.population.push(fish);
          remaining--;
        } else {
          break;
        }
      }
    };

    createPopulation(CellType.Fish, fishPopSize || this.config.fishPopSize);
    createPopulation(CellType.Shark, sharkPopSize || this.config.sharkPopSize);
  }

  _moveCell(from: Cell, to: Cell, replacement: Cell) {
    this.grid[from.y][from.x] = replacement;
    this.grid[to.y][to.x] = from;
    from.x = to.x;
    from.y = to.y;
  }

  _eat(denizen: Denizen & Eater, neighbours: Cell[]): Cell | null {
    let newEmptyCell: Empty | null = null;
    const preys = neighbours.filter((c): c is Denizen => isPreyType(denizen.preyType, c));

    if (isNotEmpty(preys)) {
      const prey = randomElement(preys);
      newEmptyCell = this.cellFactory.create(CellType.Empty, denizen.x, denizen.y);
      this._moveCell(denizen, prey, newEmptyCell);
      prey.isAlive = false;
    } else {
      denizen.starveTimeCounter += 1;

      if (denizen.starveTimeCounter >= denizen.starveTime) {
        denizen.isAlive = false;
        newEmptyCell = this.cellFactory.create(CellType.Empty, denizen.x, denizen.y);
        this.grid[denizen.y][denizen.x] = newEmptyCell;
      }
    }

    return newEmptyCell;
  }

  _move(denizen: Denizen, neighbours: Cell[]): Cell | null {
    let newEmptyCell: Empty | null = null;
    const emptyCells = neighbours.filter(isEmpty);

    if (isNotEmpty(emptyCells)) {
      const moveTo = randomElement(emptyCells);
      newEmptyCell = this.cellFactory.create(CellType.Empty, denizen.x, denizen.y);
      this._moveCell(denizen, moveTo, newEmptyCell);
    }

    return newEmptyCell;
  }

  _breed(denizen: Denizen & Breeder, emptyCell: Cell) {
    denizen.breedTimeCounter += 1;

    if (denizen.breedTimeCounter >= denizen.breedTime) {
      const newDenizen = this.cellFactory.create(
        denizen.type as DenizenCellType,
        emptyCell.x,
        emptyCell.y
      );
      this.grid[newDenizen.y][newDenizen.x] = newDenizen;
      this.population.push(newDenizen);
      denizen.breedTimeCounter = 0;
    }
  }

  tick() {
    const shuffledPop = shuffle(this.population);

    for (const denizen of shuffledPop) {
      if (!denizen.isAlive) {
        continue;
      }

      const neighbours = this._getNeighboursFrom(denizen.x, denizen.y);

      let newEmptyCell: Empty | null = null;

      if (isAnEater(denizen)) {
        newEmptyCell = this._eat(denizen, neighbours);

        if (!denizen.isAlive) {
          continue;
        }
      }

      const hasMoved = !newEmptyCell;
      if (hasMoved) {
        newEmptyCell = this._move(denizen, neighbours);
      }

      if (isABreeder(denizen) && newEmptyCell) {
        this._breed(denizen, newEmptyCell);
      }
    }

    this.population = this.population.filter((f) => f.isAlive);
  }

  _getNeighboursFrom(x: number, y: number) {
    const { width, height } = this.config;

    return [
      this.grid[mod(y - 1, height)][x],
      this.grid[mod(y + 1, height)][x],
      this.grid[y][mod(x - 1, width)],
      this.grid[y][mod(x + 1, width)],
    ];
  }

  getWorld() {
    return this.grid;
  }

  getPopulation() {
    return this.population;
  }
}

export default WatorWorld;
