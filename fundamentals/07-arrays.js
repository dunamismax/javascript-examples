// 07 - Arrays
// Learn how to work with collections of data

// Creating arrays
const fruits = ["apple", "banana", "orange"];
const numbers = [1, 2, 3, 4, 5];
const mixed = ["hello", 42, true, null];
const empty = [];

// Array constructor (less common)
const moreNumbers = new Array(1, 2, 3);

console.log("Fruits:", fruits);
console.log("Numbers:", numbers);

// Accessing array elements (zero-indexed)
console.log("First fruit:", fruits[0]);     // "apple"
console.log("Last fruit:", fruits[2]);      // "orange"
console.log("Out of bounds:", fruits[10]);  // undefined

// Array properties and methods
console.log("Array length:", fruits.length); // 3

// Adding elements
fruits.push("grape");           // Add to end
fruits.unshift("strawberry");   // Add to beginning
console.log("After adding:", fruits);

// Removing elements
const lastFruit = fruits.pop();      // Remove from end
const firstFruit = fruits.shift();   // Remove from beginning
console.log("Removed:", lastFruit, firstFruit);
console.log("After removing:", fruits);

// Finding elements
const index = fruits.indexOf("banana");
console.log("Index of banana:", index);

const hasOrange = fruits.includes("orange");
console.log("Has orange:", hasOrange);

// Array slicing (doesn't modify original)
const slice = fruits.slice(1, 3);
console.log("Slice (1,3):", slice);
console.log("Original:", fruits);

// Array splicing (modifies original)
const workingArray = ["a", "b", "c", "d", "e"];
const removed = workingArray.splice(2, 2, "X", "Y"); // Remove 2 items at index 2, add "X", "Y"
console.log("After splice:", workingArray);
console.log("Removed items:", removed);

// Joining arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = arr1.concat(arr2);
const spreadCombined = [...arr1, ...arr2]; // Modern spread syntax

console.log("Combined:", combined);
console.log("Spread combined:", spreadCombined);

// Converting array to string
const joinedFruits = fruits.join(", ");
const defaultJoin = fruits.join(); // Default separator is comma
console.log("Joined fruits:", joinedFruits);

// Reversing and sorting
const reversedNumbers = [1, 2, 3, 4, 5].reverse();
const sortedFruits = ["banana", "apple", "orange"].sort();
const sortedNumbers = [10, 5, 40, 25, 1000, 1].sort((a, b) => a - b);

console.log("Reversed:", reversedNumbers);
console.log("Sorted fruits:", sortedFruits);
console.log("Sorted numbers:", sortedNumbers);

// Array iteration methods
const testNumbers = [1, 2, 3, 4, 5];

// forEach - execute function for each element
console.log("=== forEach ===");
testNumbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});

// map - create new array with transformed elements
const doubled = testNumbers.map(num => num * 2);
console.log("Doubled:", doubled);

// filter - create new array with elements that pass test
const evens = testNumbers.filter(num => num % 2 === 0);
console.log("Even numbers:", evens);

// find - return first element that passes test
const found = testNumbers.find(num => num > 3);
console.log("First number > 3:", found);

// findIndex - return index of first element that passes test
const foundIndex = testNumbers.findIndex(num => num > 3);
console.log("Index of first number > 3:", foundIndex);

// reduce - reduce array to single value
const sum = testNumbers.reduce((total, num) => total + num, 0);
const product = testNumbers.reduce((total, num) => total * num, 1);
console.log("Sum:", sum);
console.log("Product:", product);

// every - test if all elements pass condition
const allPositive = testNumbers.every(num => num > 0);
console.log("All positive:", allPositive);

// some - test if at least one element passes condition
const hasEven = testNumbers.some(num => num % 2 === 0);
console.log("Has even number:", hasEven);

// Multi-dimensional arrays
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log("Matrix element [1][2]:", matrix[1][2]); // 6

// Iterate through 2D array
console.log("=== Matrix iteration ===");
for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        console.log(`matrix[${i}][${j}] = ${matrix[i][j]}`);
    }
}

// Array destructuring
const colors = ["red", "green", "blue", "yellow"];
const [first, second, ...rest] = colors;

console.log("First:", first);      // "red"
console.log("Second:", second);    // "green"
console.log("Rest:", rest);        // ["blue", "yellow"]

// Skipping elements
const [primary, , tertiary] = colors;
console.log("Primary:", primary);   // "red"
console.log("Tertiary:", tertiary); // "blue"

// Practical examples
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

function getUniqueElements(arr1, arr2) {
    return arr1.filter(item => !arr2.includes(item));
}

function chunk(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

// Testing practical functions
const duplicates = [1, 2, 2, 3, 3, 4, 5];
console.log("Remove duplicates:", removeDuplicates(duplicates));

const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];
console.log("Unique to array1:", getUniqueElements(array1, array2));

const longArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log("Chunked:", chunk(longArray, 3));