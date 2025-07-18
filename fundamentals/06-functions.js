// 06 - Functions
// Learn how to create reusable blocks of code

// Function declaration - hoisted (can be called before definition)
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("Alice")); // "Hello, Alice!"

// Function with multiple parameters
function add(a, b) {
    return a + b;
}

console.log(add(5, 3)); // 8

// Function with default parameters
function greetWithDefault(name = "Guest") {
    return `Welcome, ${name}!`;
}

console.log(greetWithDefault());        // "Welcome, Guest!"
console.log(greetWithDefault("Bob"));   // "Welcome, Bob!"

// Function expression - not hoisted
const multiply = function(x, y) {
    return x * y;
};

console.log(multiply(4, 5)); // 20

// Arrow functions (ES6) - concise syntax
const divide = (a, b) => {
    return a / b;
};

// Even shorter for single expressions
const square = x => x * x;
const cube = x => x ** 3;

console.log(square(4));  // 16
console.log(cube(3));    // 27

// Function with no parameters
const sayHello = () => {
    console.log("Hello from a function!");
};

sayHello();

// Function that doesn't return anything (returns undefined)
function logMessage(message) {
    console.log(`Log: ${message}`);
    // No return statement = returns undefined
}

const result = logMessage("Testing");
console.log("Result:", result); // undefined

// Rest parameters - accept multiple arguments
function sum(...numbers) {
    let total = 0;
    for (const num of numbers) {
        total += num;
    }
    return total;
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Function with destructured parameters
function createUser({name, age, email}) {
    return {
        id: Math.random(),
        name,
        age,
        email,
        createdAt: new Date()
    };
}

const userData = createUser({
    name: "John",
    age: 25,
    email: "john@example.com"
});

console.log(userData);

// Higher-order functions - functions that use other functions
function applyOperation(x, y, operation) {
    return operation(x, y);
}

const addFunc = (a, b) => a + b;
const multiplyFunc = (a, b) => a * b;

console.log(applyOperation(10, 5, addFunc));      // 15
console.log(applyOperation(10, 5, multiplyFunc)); // 50

// Function returning another function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(8));  // 16
console.log(triple(8));  // 24

// Immediately Invoked Function Expression (IIFE)
(function() {
    console.log("This function runs immediately!");
})();

// Arrow function IIFE
(() => {
    console.log("Arrow IIFE!");
})();

// Practical examples
function calculateAge(birthYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

function isEven(number) {
    return number % 2 === 0;
}

function findMax(arr) {
    if (arr.length === 0) return undefined;
    
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// Using the functions
console.log(`Age: ${calculateAge(1990)}`);
console.log(`Is 8 even? ${isEven(8)}`);
console.log(`Max of [3, 7, 2, 9, 1]: ${findMax([3, 7, 2, 9, 1])}`);

// Function scope and closures
function outerFunction(x) {
    // This variable is in the outer function's scope
    const outerVariable = x;
    
    function innerFunction(y) {
        // Inner function has access to outer function's variables
        return outerVariable + y;
    }
    
    return innerFunction;
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8 (5 + 3)