// 05 - Loops
// Learn how to repeat code execution efficiently

// For loop - when you know how many times to repeat
console.log("=== For Loop ===");
for (let i = 0; i < 5; i++) {
    console.log(`Iteration ${i + 1}: Hello!`);
}

// Counting backwards
console.log("\n=== Counting Backwards ===");
for (let i = 5; i > 0; i--) {
    console.log(`Countdown: ${i}`);
}

// While loop - when you don't know exact number of iterations
console.log("\n=== While Loop ===");
let count = 0;
while (count < 3) {
    console.log(`While loop iteration: ${count + 1}`);
    count++;
}

// Do-while loop - executes at least once
console.log("\n=== Do-While Loop ===");
let number = 0;
do {
    console.log(`Do-while: ${number}`);
    number++;
} while (number < 3);

// For...of loop - iterating over arrays and strings
console.log("\n=== For...of Loop ===");
const fruits = ["apple", "banana", "orange"];
for (const fruit of fruits) {
    console.log(`Fruit: ${fruit}`);
}

// Works with strings too
const word = "JavaScript";
for (const letter of word) {
    console.log(`Letter: ${letter}`);
}

// For...in loop - iterating over object properties
console.log("\n=== For...in Loop ===");
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}

// Break and continue statements
console.log("\n=== Break and Continue ===");

// Break - exits the loop completely
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        console.log("Breaking at 5");
        break;
    }
    console.log(`Break example: ${i}`);
}

// Continue - skips current iteration
for (let i = 0; i < 5; i++) {
    if (i === 2) {
        console.log("Skipping 2");
        continue;
    }
    console.log(`Continue example: ${i}`);
}

// Nested loops
console.log("\n=== Nested Loops ===");
for (let row = 1; row <= 3; row++) {
    let rowString = "";
    for (let col = 1; col <= 3; col++) {
        rowString += `(${row},${col}) `;
    }
    console.log(rowString);
}

// Practical examples
console.log("\n=== Practical Examples ===");

// Find sum of numbers 1 to 10
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
}
console.log(`Sum of 1 to 10: ${sum}`);

// Find factorial of 5
let factorial = 1;
for (let i = 1; i <= 5; i++) {
    factorial *= i;
}
console.log(`Factorial of 5: ${factorial}`);

// Generate multiplication table
console.log("\n=== Multiplication Table for 7 ===");
for (let i = 1; i <= 10; i++) {
    console.log(`7 × ${i} = ${7 * i}`);
}

// Loop with array methods (modern approach)
console.log("\n=== Modern Array Iteration ===");
const numbers = [1, 2, 3, 4, 5];

// forEach - executes function for each element
numbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});

// map - creates new array with transformed elements
const doubled = numbers.map(num => num * 2);
console.log("Doubled:", doubled);

// filter - creates new array with elements that pass condition
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log("Even numbers:", evenNumbers);