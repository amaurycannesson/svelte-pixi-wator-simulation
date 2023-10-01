interface CellFactoryReturnType {
  [CellType.Empty]: Empty;
  [CellType.Fish]: Fish;
  [CellType.Shark]: Shark;
}

export class CellFactory {
  constructor(
    private readonly config: {
      fishBreedTime: number;
      sharkBreedTime: number;
      sharkStarveTime: number;
    }
  ) {}

  create = <T extends keyof CellFactoryReturnType>(
    type: T,
    x: number,
    y: number,
    config: Partial<Living & Breeder & Eater> = {}
  ): CellFactoryReturnType[T] => {
    if (type === CellType.Empty) return new Empty(x, y) as CellFactoryReturnType[T];
    else if (type === CellType.Fish)
      return new Fish(
        x,
        y,
        config.breedTime || this.config.fishBreedTime,
        config.breedTimeCounter,
        config.isAlive
      ) as CellFactoryReturnType[T];
    else if (type === CellType.Shark)
      return new Shark(
        x,
        y,
        config.starveTime || this.config.sharkStarveTime,
        config.breedTime || this.config.sharkBreedTime,
        config.starveTimeCounter,
        config.breedTimeCounter,
        config.isAlive
      );
    throw new Error(`Unknwon cell type: ${type}`);
  };
}

export const isFish = (cell: Cell): cell is Fish => {
  return cell instanceof Fish;
};

export const isShark = (cell: Cell): cell is Shark => {
  return cell instanceof Shark;
};

export const isEmpty = (cell: Cell): cell is Empty => {
  return cell instanceof Empty;
};

export const isAnEater = (obj: object): obj is Eater => {
  return 'starveTime' in obj && 'starveTimeCounter' in obj && 'preyType' in obj;
};

export const isABreeder = (obj: object): obj is Breeder => {
  return 'breedTime' in obj && 'breedTimeCounter' in obj;
};

export const isPreyType = (type: DenizenCellType, cell: Cell): cell is Denizen => {
  return cell.type === type;
};

export enum CellType {
  Empty,
  Fish,
  Shark,
}

export interface Cell {
  x: number;
  y: number;
  type: CellType;
}

export type DenizenCellType = Exclude<CellType, CellType.Empty>;

export type Denizen = Cell & Living;

export interface Eater {
  starveTime: number;
  starveTimeCounter: number;
  preyType: DenizenCellType;
}

export interface Breeder {
  breedTime: number;
  breedTimeCounter: number;
}

export interface Living {
  isAlive: boolean;
}

export class Empty implements Cell {
  constructor(public x: number, public y: number, public readonly type = CellType.Empty) {}
}

export class Fish implements Cell, Living, Breeder {
  constructor(
    public x: number,
    public y: number,
    readonly breedTime: number,
    public breedTimeCounter: number = 0,
    public isAlive: boolean = true,
    public readonly type = CellType.Fish
  ) {}
}

export class Shark implements Cell, Living, Breeder, Eater {
  constructor(
    public x: number,
    public y: number,
    readonly starveTime: number,
    readonly breedTime: number,
    public starveTimeCounter: number = 0,
    public breedTimeCounter: number = 0,
    public isAlive: boolean = true,
    public readonly type = CellType.Shark,
    public preyType: DenizenCellType = CellType.Fish
  ) {}
}
