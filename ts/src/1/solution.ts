import { getLines } from "../utils";

export const parseInputForDay = (file: string) => {
  return getLines(file);
};

export const task1 = (lines: string[]) => {
  return lines
    .map((line) => {
      const charArr = line.split("");
      const firstDigit = charArr.find((x) => !isNaN(Number(x)));
      const lastDigit = charArr.reverse().find((x) => !isNaN(Number(x)));

      return Number(firstDigit + lastDigit);
    })
    .sum();
};

export const task2 = (lines: string[]) => {
  const fixedLines = lines.map((line) => toDigits(line));
  return task1(fixedLines);
};

const digits = [
  "one",
  "1",
  "two",
  "2",
  "three",
  "3",
  "four",
  "4",
  "five",
  "5",
  "six",
  "6",
  "seven",
  "7",
  "eight",
  "8",
  "nine",
  "9",
];

const mapToIntString = (s: string): string => {
  switch (s) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      return s;
  }
};

const findDigitOccurrencesInLine = (
  line: string,
  digit: string
): Array<{ digit: string; index: number }> => {
  const matchesArr = [...line.matchAll(new RegExp(digit, "g"))];

  return matchesArr.map((match) => {
    return {
      digit: mapToIntString(digit),
      index: match.index,
    };
  });
};

const toDigits = (line: string) =>
  digits
    .flatMap((digit) => findDigitOccurrencesInLine(line, digit))
    .sort((a, b) => (a.index < b.index ? -1 : 1))
    .map((digit) => digit.digit)
    .join("");
