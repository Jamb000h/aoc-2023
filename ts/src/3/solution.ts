import { getLines, neighbors2D } from "../utils";

type Input = string[][];

export const parseInputForDay = (file: string): Input => {
  return getLines(file).map((line) => line.split(""));
};

export const task1 = (input: Input) => {
  const parts = [];
  for (let y = 0; y < input.length; y++) {
    let numberString = "";
    let numberIsPart = false;
    for (let x = 0; x < input[y].length; x++) {
      const char = Number(input[y][x]);

      if (!isNaN(char)) {
        numberString += char;
      } else {
        if (numberIsPart) {
          parts.push(Number(numberString));
        }
        numberString = "";
        numberIsPart = false;
        continue;
      }

      if (numberString.length > 0 && !numberIsPart) {
        numberIsPart = neighbors2D(y, x, input).some(
          ([nY, nX]) =>
            ![".", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(
              input[nY][nX]
            )
        );
      }
    }

    if (numberString.length > 0 && numberIsPart) {
      parts.push(Number(numberString));
    }
  }

  return parts.sum();
};

export const task2 = (input: Input) => {
  const parts : {part: number, coords: number[][]}[] = [];
  const gears = [];
  const ratios = [];
  for (let y = 0; y < input.length; y++) {
    let numberString = "";
    let numberCoords = [];
    let numberIsPart = false;
    for (let x = 0; x < input[y].length; x++) {
      const char = input[y][x];

      if (char === "*") {
        gears.push([y, x]);
      }

      if (!isNaN(Number(char))) {
        numberString += char;
        numberCoords.push([y, x]);
      } else {
        if (numberIsPart) {
          parts.push({ part: Number(numberString), coords: numberCoords });
        }
        numberString = "";
        numberCoords = [];
        numberIsPart = false;
        continue;
      }

      if (numberString.length > 0 && !numberIsPart) {
        numberIsPart = neighbors2D(y, x, input).some(
          ([nY, nX]) =>
            ![".", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(
              input[nY][nX]
            )
        );
      }
    }

    if (numberString.length > 0 && numberIsPart) {
      parts.push({ part: Number(numberString), coords: numberCoords });
    }
  }

  gears.forEach(([y, x]) => {
    const gearNeighborCoords = neighbors2D(y, x, input)
    const partsConnectedToGear = parts.filter(part => {
      return part.coords.some(([pY, pX]) => {
        return gearNeighborCoords.some(([gNY, gNX]) => {
          return pY === gNY && pX === gNX
        })
      })
    })

    if(partsConnectedToGear.length === 2) {
      ratios.push(partsConnectedToGear.map(part => part.part).product())
    }
  })

  return ratios.sum()
};
