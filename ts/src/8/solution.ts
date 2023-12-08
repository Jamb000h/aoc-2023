import { getLines } from "../utils";

export const parseInputForDay = (file: string) => {
    const lines = getLines(file)
    const instructions = lines[0].split("")
    const nodes = {}
    lines.slice(2).forEach(row => {
        nodes[ row.split(" = ")[0]] = {
            L: row.split(" = ")[1].split(", ")[0].slice(1),
            R: row.split(" = ")[1].split(", ")[1].slice(0, -1)

        }
    })

    return {
        instructions,
        nodes
    }
};

export const task1 = (input: ReturnType<typeof parseInputForDay>) => {
    let currentNode = "AAA"
    let currentInstruction = 0
    let steps = 0;
    while(true) {
        steps++
        currentNode = input.nodes[currentNode][input.instructions[currentInstruction]]

        if(currentNode === "ZZZ") {
            return steps
        }

        currentInstruction += 1

        if (currentInstruction > input.instructions.length - 1) {
            currentInstruction = 0
        }
    }
};

export const task2 = (input: ReturnType<typeof parseInputForDay>) => {
    const startNodes = Object.keys(input.nodes).filter(node => node.at(-1) === "A")
    const zHits = startNodes.map(startNode => {
        let currentNode = startNode
        let currentInstruction = 0
        let steps = 0;

        while(true) {
            steps++
            currentNode = input.nodes[currentNode][input.instructions[currentInstruction]]

            if(currentNode.at(-1) === "Z") {
                return steps
            }

            currentInstruction += 1

            if (currentInstruction > input.instructions.length - 1) {
                currentInstruction = 0
            }
        }
    })

    return zHits.lcm()
};