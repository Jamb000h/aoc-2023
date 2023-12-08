import { getLines } from "../utils";

type SeedMap = {
  sourceMin: number;
  destinationMin: number;
  range: number;
};

export const parseInputForDay = (file: string) => {
  const parseMap = (mapFile: string): SeedMap[] => {
    return mapFile
      .split(":")[1]
      .trim()
      .split(/\r?\n/)
      .map((map) => {
        const [destinationMin, sourceMin, range] = map.split(" ").map(Number);
        return {
          sourceMin,
          destinationMin,
          range,
        };
      })
      .sort((a, b) => a.sourceMin - b.sourceMin);
  };

  const lines = getLines(file);
  const seeds = lines[0].split(": ")[1].split(" ").map(Number);
  const maps = file.split(/\r?\n\r?\n/).slice(1);

  return {
    seeds,
    maps: {
      seedToSoilMap: parseMap(maps[0]),
      soilToFertilizerMap: parseMap(maps[1]),
      fertilizerToWaterMap: parseMap(maps[2]),
      waterToLightMap: parseMap(maps[3]),
      lightToTemperatureMap: parseMap(maps[4]),
      temperatureToHumidityMap: parseMap(maps[5]),
      humidityToLocationMap: parseMap(maps[6]),
    },
  };
};

export const task1 = (input: ReturnType<typeof parseInputForDay>) => {
  const maps = Object.values(input.maps);
  const locations = input.seeds.map((seed) => {
    return maps.reduce((prev, cur) => {
      return sourceToDestination(prev, cur);
    }, seed);
  });

  return locations.sortAscending()[0];
};

export const task2 = (input: ReturnType<typeof parseInputForDay>) => {
  const maps = Object.values(input.maps);
  const seedRanges = input.seeds.chunks<number>(2).map(([min, range]) => {
    return {
      min,
      range,
    };
  });

  const locations = Object.values(maps).reduce((prev, cur) => {
    return prev.flatMap(range => sourceRangeToDestinationRanges(range, cur))
  }, seedRanges)

  return locations.map(loc => loc.min).sortAscending()[0];
};

const sourceToDestination = (source: number, maps: SeedMap[]): number => {
  const destination = maps.find(
    (map) => source >= map.sourceMin && source < map.sourceMin + map.range
  );

  if (destination) {
    return destination.destinationMin + (source - destination.sourceMin);
  }

  return source;
};

const sourceRangeToDestinationRanges = (
  sourceRange: { min: number; range: number },
  maps: SeedMap[]
): Array<{ min: number; range: number }> => {
  const destinationRanges = [];
  maps.forEach(({ sourceMin, destinationMin, range }) => {
    if (sourceRange.range > 0) {
      // Gap
      if (sourceMin > sourceRange.min) {
        destinationRanges.push({
          min: sourceRange.min,
          range: Math.min(sourceMin - sourceRange.min, sourceRange.range),
        });
        sourceRange.min = sourceMin;
        sourceRange.range = sourceRange.range - destinationRanges.at(-1).range;
      }

      if(sourceRange.range > 0) {
        // If this map applies
        if(sourceMin <= sourceRange.min && sourceMin + range - 1 >= sourceRange.min) {
          const cap = Math.min(sourceMin + range - 1, sourceRange.min + sourceRange.range - 1)

          destinationRanges.push({
            min: destinationMin + (sourceRange.min - sourceMin),
            range: cap - sourceRange.min + 1,
          });
          
          sourceRange.min = cap + 1
          sourceRange.range = sourceRange.range - destinationRanges.at(-1).range
        }
      }
      
    }
  });

  // Some remaining?
  if (sourceRange.range > 0) {
    destinationRanges.push({
      min: sourceRange.min,
      range: sourceRange.range,
    });
  }

  return destinationRanges;
};
