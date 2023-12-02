import { getLines } from "../utils";

type Game = {
  id: number;
  pulls: Array<Array<{ n: number; color: string }>>;
};

export const parseInputForDay = (file: string): Game[] => {
  const games = getLines(file).map((game) => {
    return {
      id: Number(game.split(":")[0].split(" ")[1]),
      pulls: game
        .split(":")[1]
        .split(";")
        .map((pull) => {
          return pull
            .trim()
            .split(",")
            .map((cubes) => {
              return {
                n: Number(cubes.trim().split(" ")[0]),
                color: cubes.trim().split(" ")[1],
              };
            });
        }),
    };
  });

  return games;
};

export const task1 = (games: Game[]) => {
  const maxes = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const validGames = games.filter((game) => {
    return game.pulls.every((pull) => {
      return pull.every((cubes) => cubes.n <= maxes[cubes.color]);
    });
  });

  return validGames.map((game) => game.id).sum();
};

export const task2 = (games: Game[]) => {
  return games
    .map((game) => {
      const mins = {
        red: -1,
        green: -1,
        blue: -1,
      };

      game.pulls.forEach((pull) => {
        pull.forEach((cubes) => {
          mins[cubes.color] = Math.max(mins[cubes.color], cubes.n);
        });
      });

      const power = Object.values(mins).product();

      return power;
    })
    .sum();
};
