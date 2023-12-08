import { getLines } from "../utils";

export const parseInputForDay = (file: string) => {
    const [times, distances] = getLines(file).map(row => row.split(": ")[1].trim().split(/\s+/).map(Number))
    
    return times.map((time, i) => {
        return {
            time,
            distance: distances[i]
        }
    })
};

export const task1 = (races: ReturnType<typeof parseInputForDay>) => {
    return races.map(({time, distance}) => {
        let wins = 0;
        for(let i = 0; i < time; i++) {
            const secondsToPress = i;
            const travelTime = time - secondsToPress;
            const speed = secondsToPress;
            if(speed * travelTime > distance) {
                wins++
            }
        }

        return wins
    }).product()
};

export const task2 = (races: ReturnType<typeof parseInputForDay>) => {
    const time = Number(races.map(race => race.time.toString()).join(""))
    const distance = Number(races.map(race => race.distance.toString()).join(""))

    let wins = 0;
    let previousWon = false;
    for(let i = 0; i < time; i++) {
        const secondsToPress = i;
        const travelTime = time - secondsToPress;
        const speed = secondsToPress;
        if(speed * travelTime > distance) {
            previousWon = true
            wins++
        } else {

            if(previousWon) {
                break;
            }
        }

    }

    return wins
};