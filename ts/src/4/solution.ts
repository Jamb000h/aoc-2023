import { getLines } from "../utils";

type ScratchCard = {
  winningNumbers: number[];
  yourNumbers: number[];
  n: number;
};

export const parseInputForDay = (file: string): ScratchCard[] => {
  return getLines(file).map((line) => {
    const [winningNumbers, yourNumbers] = line
      .split(":")[1]
      .split("|")
      .map((numbers) => numbers.trim().split(/\s+/).map(Number));
    return {
      winningNumbers,
      yourNumbers,
      n: 1,
    };
  });
};

export const task1 = (scratchCards: ScratchCard[]) => {
  return scratchCards
    .map((scratchCard) => {
      return scratchCard.yourNumbers.reduce((prev, cur) => {
        if (!scratchCard.winningNumbers.includes(cur)) {
          return prev;
        }

        return prev === 0 ? 1 : prev * 2;
      }, 0);
    })
    .sum();
};

export const task2 = (scratchCards: ScratchCard[]) => {
  scratchCards.forEach((scratchCard, i) => {
    const wins = scratchCard.yourNumbers.filter((yourNumber) =>
      scratchCard.winningNumbers.some(
        (winningNumber) => yourNumber === winningNumber
      )
    ).length;

    for(let j = i + 1; j <= i + wins; j++) {
        if(j < scratchCards.length) {
            scratchCards[j].n += scratchCard.n
        }
    }
  });

  return scratchCards.map(scratchCard => scratchCard.n).sum()
};
