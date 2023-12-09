import { getLines } from "../utils";

export const parseInputForDay = (file: string) => {
  return getLines(file).map((line) => line.split(" ").map(Number));
};

export const task1 = (histories: ReturnType<typeof parseInputForDay>) => {
  return histories
    .map(getDifferences)
    .map(extrapolate)
    .map((sequences) => sequences.at(0).at(-1))
    .sum();
};

export const task2 = (histories: ReturnType<typeof parseInputForDay>) => {
  return histories
    .map((history) => history.reverse())
    .map(getDifferences)
    .map(extrapolate)
    .map((sequences) => sequences.at(0).at(-1))
    .sum();
};

const getDifferences = (history: number[]) => {
  const differences = [[...history]];

  while (!differences.at(-1).every((n) => n === 0)) {
    differences.push(getDifference(differences.at(-1)));
  }

  return differences;
};

const getDifference = (history: number[]) =>
  history.windows<number>(2).map(([a, b]) => b - a);

const extrapolate = (differences: number[][]) => {
  const extrapolated = structuredClone(differences)
  extrapolated.at(-1).push(0);
  for (let i = extrapolated.length - 2; i >= 0; i--) {
    extrapolated
      .at(i)
      .push(extrapolated.at(i).at(-1) + extrapolated.at(i + 1).at(-1));
  }

  return extrapolated;
};
