export const getLines = (file: string): string[] => file.split("\r\n");

export const sumOf = (numbers: number[]) => {
  return numbers.reduce((x, y) => x + y, 0);
};

export const productOf = (numbers: number[]) => {
  return numbers.reduce((x, y) => x * y, 1);
};

export const averageOf = (numbers: number[], floor = false) => {
  const avg = numbers.reduce((prev, cur) => prev + cur, 0) / numbers.length;
  return floor ? Math.floor(avg) : Math.round(avg);
};

export const inBounds2D = (y: number, x: number, grid: any[][], scale = 1) => {
  return (
    y >= 0 &&
    x >= 0 &&
    y < grid.length * scale &&
    x < grid[y % scale].length * scale
  );
};

export const inBounds3D = (
  y: number,
  x: number,
  z: number,
  grid: any[][][]
) => {
  return (
    y >= 0 &&
    x >= 0 &&
    z >= 0 &&
    y < grid.length &&
    x < grid[y].length &&
    z < grid[y][x].length
  );
};

export const neighbors2D = (
  y: number,
  x: number,
  grid: any[][],
  diagonal: boolean = true,
  scale = 1,
  includeSelf: boolean = false
): number[][] => {
  const neighbors = [];
  for (let ny = y - 1; ny <= y + 1; ny++) {
    for (let nx = x - 1; nx <= x + 1; nx++) {
      if (!includeSelf && ny === y && nx === x) continue;
      if (!diagonal && ny !== y && nx !== x) continue;
      if (inBounds2D(ny, nx, grid, scale)) {
        neighbors.push([ny, nx]);
      }
    }
  }
  return neighbors;
};

export const neighbors3D = (
  y: number,
  x: number,
  z: number,
  grid: any[][][],
  diagonal: boolean = false
): number[][] => {
  const neighbors = [];
  for (let ny = y - 1; ny <= y + 1; ny++) {
    for (let nx = x - 1; nx <= x + 1; nx++) {
      for (let nz = z - 1; nz <= z + 1; nz++) {
        if (!diagonal) {
          if (ny > y && (nx !== x || nz !== z)) continue;
          if (ny < y && (nx !== x || nz !== z)) continue;
          if (ny === y && nx !== x && nz !== z) continue;
        }
        if (ny === y && nx === x && nz === z) continue;
        if (inBounds3D(ny, nx, nz, grid)) {
          neighbors.push([ny, nx, nz]);
        }
      }
    }
  }
  return neighbors;
};

export const generateEmptyVisited = (grid: any[][]): boolean[][] => {
  const visited = [];
  for (let y = 0; y < grid.length; y++) {
    visited.push([]);
    for (let x = 0; x < grid[y].length; x++) {
      visited[y].push(false);
    }
  }

  return visited;
};

export const generateEmptyVisited3D = (grid: any[][][]): boolean[][][] => {
  const visited = [];
  for (let y = 0; y < grid.length; y++) {
    visited.push([]);
    for (let x = 0; x < grid[y].length; x++) {
      visited[y].push([]);
      for (let z = 0; z < grid[y][x].length; z++) {
        visited[y][x].push(false);
      }
    }
  }

  return visited;
};

export const pivot = (arrs: any[][]): any[][] => {
  const pivoted = Array.from(
    { length: Math.max(...arrs.map((arr) => arr.length)) },
    () => []
  );

  for (const arr of arrs) {
    arr.forEach((elem, i) => {
      pivoted[i].push(elem);
    });
  }

  return pivoted;
};

export const bfs = (
  y: number,
  x: number,
  grid: any[][],
  visited: boolean[][],
  diagonal = true,
  predicate?: (y: number, x: number, grid: any[][]) => any
) => {
  const V = [];
  let target = null;
  const queue = [[y, x]];
  while (queue.length > 0) {
    const [currentY, currentX] = queue.shift();
    if (visited[currentY][currentX]) continue;
    visited[currentY][currentX] = true;

    // Collect visited vertices for problems that require reachable area
    V.push([currentY, currentX]);

    // Early break for problems that have a defined target
    if (!!predicate && predicate(currentY, currentX, grid)) {
      target = [currentY, currentX];
      break;
    }

    const neighbors = neighbors2D(currentY, currentX, grid, diagonal);
    neighbors.forEach((n) => queue.push(n));
  }
  return {
    V,
    target,
  };
};

export const bfs3D = (
  y: number,
  x: number,
  z: number,
  grid: any[][][],
  visited: boolean[][][],
  diagonal: boolean = false,
  predicate?: (y: number, x: number, z: number, grid: any[][][]) => any,
  skip?: (y: number, x: number, z: number, grid: any[][][]) => any
) => {
  const V = [];
  let target = null;
  const queue = [[y, x, z]];
  while (queue.length > 0) {
    const [currentY, currentX, currentZ] = queue.shift();
    if (visited[currentY][currentX][currentZ]) continue;
    visited[currentY][currentX][currentZ] = true;

    // Collect visited vertices for problems that require reachable area
    V.push([currentY, currentX, currentZ]);

    // Early break for problems that have a defined target
    if (!!predicate && predicate(currentY, currentX, currentZ, grid)) {
      target = [currentY, currentX, currentZ];
      break;
    }

    const potentialNeighbors = neighbors3D(
      currentY,
      currentX,
      currentZ,
      grid,
      diagonal
    );
    const neighbors = skip
      ? potentialNeighbors.filter(([nY, nX, nZ]) => !skip(nY, nX, nZ, grid))
      : potentialNeighbors;
    neighbors.forEach((n) => queue.push(n));
  }
  return {
    V,
    target,
  };
};

declare global {
  interface Array<T> {
    sortAscending(): Array<T>;
    sortDescending(): Array<T>;
    sum(): number;
    product(): number;
    lcm(): number;
    gcd(): number;
    take(n: number): Array<T>;
    chunks<T>(n: number): Array<Array<T>>;
    groupBy<T>(pred: (x: T) => boolean): Array<Array<T>>;
    windows<T>(size: number): Array<Array<T>>;
  }
}

Array.prototype.sortAscending = function () {
  return this.sort((a, b) => a - b);
};

Array.prototype.sortDescending = function () {
  return this.sort((a, b) => b - a);
};

Array.prototype.take = function (n: number) {
  return this.slice(0, n);
};

Array.prototype.sum = function () {
  return this.reduce((prev: number, cur: number) => prev + cur, 0);
};

Array.prototype.product = function () {
  return this.reduce((prev: number, cur: number) => prev * cur, 1);
};

Array.prototype.gcd = function () {
  if(this.length === 0) {
    return -1
  }

  if(this.length < 2) {
    return this[0]
  }

  const _gcd = (a: number, b: number) => {
    while(b !== 0) {
      const t = b
      b = a % b
      a = t
    }

    return a
  }

  return this.slice(1).reduce((prev: number, cur: number) => _gcd(prev, cur), this[0])
}

Array.prototype.lcm = function () {
  if(this.length === 0) {
    return -1
  }

  if(this.length < 2) {
    return this[0]
  }

  const _lcm = (a: number, b:number) => {
    return Math.abs(a) * (Math.abs(b) / [a,b].gcd())
  }

  return this.slice(1).reduce((prev: number, cur: number) => _lcm(prev, cur), this[0])
}

Array.prototype.groupBy = function <T>(pred: (x: T) => boolean) {
  if (this.length < 1) {
    return [];
  }

  const groups = [[]];
  let prevResult = pred(this[0]);

  this.forEach((x) => {
    if (pred(x) !== prevResult) {
      groups.push([]);
      prevResult = pred(x);
    }
    groups.at(-1).push(x);
  });

  return groups;
};

Array.prototype.chunks = function (n: number) {
  if (this.length % n !== 0) {
    throw Error("Cannot chunk array as its length is not divisible by " + n);
  }

  const chunks = [[]];

  this.forEach((x) => {
    if (chunks.at(-1).length === n) {
      chunks.push([]);
    }

    chunks.at(-1).push(x);
  });

  return chunks;
};

Array.prototype.windows = function (size: number) {
  if (size < 1) {
    throw Error("Window size needs to be at least 1");
  }

  if (size > this.length) {
    throw Error(
      "Window size needs to be at most the length of the given array"
    );
  }

  if (this.length < 1) {
    return [];
  }

  const w = [];

  for (let lower = 0, upper = size - 1; upper < this.length; lower++, upper++) {
    w.push(this.slice(lower, upper + 1));
  }

  return w;
};