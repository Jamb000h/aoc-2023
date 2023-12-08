import { getLines } from "../utils";

export const parseInputForDay = (file: string) => {
  return getLines(file).map((line) => {
    return {
      hand: line.split(/\s+/)[0].split(""),
      bid: Number(line.split(/\s+/)[1]),
    };
  });
};

export const task1 = (hands: ReturnType<typeof parseInputForDay>) => {
  const sortedByRank = hands
    .map((hand) => {
      return { ...hand, type: getType(hand.hand) };
    })
    .sort((hand1, hand2) => {
      if (hand1.type === hand2.type) {
        for (let i = 0; i < hand1.hand.length; i++) {
          const card1Value = mapCardToNumber(hand1.hand[i]);
          const card2Value = mapCardToNumber(hand2.hand[i]);

          if (card1Value === card2Value) {
            continue;
          }

          return card1Value - card2Value;
        }
      }

      return hand1.type - hand2.type;
    });


  return sortedByRank
    .map((hand, i) => {
      return hand.bid * (i + 1);
    })
    .sum();
};

export const task2 = (hands: ReturnType<typeof parseInputForDay>) => {
    const handsWithAllCombinations = hands.map(hand => getCombinations(hand.hand).map(newHand => {
        return {hand: newHand, bid: hand.bid}
    }))

    const sortedByRank = handsWithAllCombinations
    .map((hands) => {
        const allTypes = hands.map(hand => getType(hand.hand)).map(Number)
        return {...hands[0], type: Math.max(...allTypes)}
    })
    .sort((hand1, hand2) => {
      if (hand1.type === hand2.type) {
        for (let i = 0; i < hand1.hand.length; i++) {
          const card1Value = mapCardToNumber(hand1.hand[i], true);
          const card2Value = mapCardToNumber(hand2.hand[i], true);

          if (card1Value === card2Value) {
            continue;
          }

          return card1Value - card2Value;
        }
      }

      return hand1.type - hand2.type;
    });


  return sortedByRank
    .map((hand, i) => {
      return hand.bid * (i + 1);
    })
    .sum();
};

const getType = (hand: string[]) => {
  const handMappedToNumbers = mapHandToNumbers(hand).sort((a, b) => a - b);

  // Five of a kind
  if (isFiveOfAKind(handMappedToNumbers)) {
    return 7;
  }

  // Four of a kind
  if (isFourOfAKind(handMappedToNumbers)) {
    return 6;
  }

  // Full house
  if (isFullHouse(handMappedToNumbers)) {
    return 5;
  }

  // Three of a kind
  if (isThreeOfAKind(handMappedToNumbers)) {
    return 4;
  }

  // Two pairs
  if (getNumberOfDifferentCards(hand) === 3) {
    return 3;
  }

  // One pair
  if (getNumberOfDifferentCards(hand) === 4) {
    return 2;
  }

  // High card
  if (getNumberOfDifferentCards(hand) === 5) {
    return 1;
  }

  throw Error("INVALID :(");
};

const getNumberOfDifferentCards = (hand: string[]) => {
  let different = 0;
  const processed = [];

  hand.forEach((card) => {
    if (!processed.includes(card)) {
      different++;
      processed.push(card);
    }
  });

  return different;
};

const mapHandToNumbers = (hand: string[]) => {
  return hand.map((card) => mapCardToNumber(card));
};

const mapCardToNumber = (card, reduceJokerValue = false) => {
  switch (card) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return reduceJokerValue ? 1 : 11;
    case "T":
      return 10;
    default:
      return Number(card);
  }
};

const isFiveOfAKind = (hand: number[]) => {
  return hand.every((card) => card === hand[0]);
};

const isFourOfAKind = (hand: number[]) => {
  return hand.windows(4).some((cards) => {
    return cards.every((card) => card === cards[0]);
  });
};

const isThreeOfAKind = (hand: number[]) => {
  return hand.windows(3).some((cards) => {
    return cards.every((card) => card === cards[0]);
  });
};

const isFullHouse = (hand: number[]) => {
  return (
    (hand.slice(0, 2).every((card) => card === hand.slice(0, 2)[0]) &&
      hand.slice(2).every((card) => card === hand.slice(2)[0])) ||
    (hand.slice(0, 3).every((card) => card === hand.slice(0, 3)[0]) &&
      hand.slice(3).every((card) => card === hand.slice(3)[0]))
  );
};

const getCombinations = (hand: string[]) => {
    const cardsOtherThanJokerInHand = new Set(hand)
    cardsOtherThanJokerInHand.delete("J")
    const jokerIndices = hand.map((card, i) => {return {card, i}}).filter(card => card.card === "J").map(card => card.i)
    const jokered = jokerIndices.reduce((prev, cur) => {
        return prev.flatMap(prevHand => [...cardsOtherThanJokerInHand].map(card => {
            const newHand = [...prevHand]
            newHand[cur] = card
            return newHand
        }))
    }, [hand])
    return [hand, ...jokered]
}
