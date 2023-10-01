export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomElement = <T>(array: T[]): T => {
  if (isEmpty(array)) throw new Error('Empty array');

  return array[randomInt(0, array.length - 1)];
};

export const isEmpty = (array: unknown[]) => {
  return array.length == 0;
};

export const isNotEmpty = (array: unknown[]) => {
  return !isEmpty(array);
};

export const buildMatrix = <T>(
  width: number,
  height: number,
  builder: (x: number, y: number) => T
): T[][] => {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => builder(x, y))
  );
};

export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};
