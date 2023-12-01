import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import * as path from "path";

const day = process.argv[2];

if (!day) {
  console.log("Provide a day!");
  process.exit(0);
}

if (!(Number(day) > 0 && Number(day) <= 25)) {
  console.log("Invalid day!");
  process.exit(0);
}

// Check daily folder and files
const dayRoot = path.join(__dirname, "src", day);
const solutionPath = path.join(dayRoot, "solution.ts");
const inputPath = path.join(__dirname, "..", "inputs", "day" + day + ".txt");

if (!existsSync(dayRoot)) {
  console.log("No folder for day", day);
  try {
    mkdirSync(dayRoot);
  } catch (e) {
    console.error("Could not create folder for day", day);
    process.exit();
  }
  console.log("Created folder for day", day);
}

if (!existsSync(solutionPath)) {
  console.log("No solution file for day", day);
  try {
    writeFileSync(solutionPath, readFileSync("./solutionTemplate.ts"));
  } catch (e) {
    console.error("Could not create solution file for day", day);
    process.exit(0);
  }
  console.log("Created solution file for day", day);
}

if (!existsSync(inputPath)) {
  console.log("No input file for day", day);
  try {
    writeFileSync(inputPath, "");
  } catch (e) {
    console.error("Could not create input file for day", day);
    process.exit(0);
  }
  console.log("Created input file for day", day);
  process.exit(0);
}

const inputFile = readFileSync(inputPath, "utf-8");
if (inputFile.length === 0) {
  console.log("Input file for day", day, "is empty!");
  process.exit(0);
}

// Import daily parser and solvers
import("./src/" + day + "/solution").then(
  ({ task1, task2, parseInputForDay }) => {
    // Parse input -- Two copies to have one reference per task
    const parsingStart = performance.now();
    const input1 = parseInputForDay(inputFile);
    const parsingResult = performance.now() - parsingStart;
    const input2 = parseInputForDay(inputFile);

    // Solve part 1
    const start1 = performance.now();
    const result1 = task1(input1);
    const finish1 = performance.now() - start1;

    // Solve part 2
    const start2 = performance.now();
    const result2 = task2(input2);
    const finish2 = performance.now() - start2;

    // Write results to console

    console.log("Parsing time:", Math.round(parsingResult), "ms");

    if (!result1) {
      console.log("Task 1 not implemented!");
    } else {
      console.log("Task 1 time:", Math.round(finish1), "ms");
      console.log("Task 1 result:", result1);
    }

    if (!result2) {
      console.log("Task 2 not implemented!");
    } else {
      console.log("Task 2 time:", Math.round(finish2), "ms");
      console.log("Task 2 result:", result2);
    }
  }
);