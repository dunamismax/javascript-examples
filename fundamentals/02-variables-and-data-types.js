// 02 - Variables and Data Types
// Learn how to store and work with different types of data

// Three ways to declare variables
var oldWay = "avoid using var"; // function-scoped, can cause issues
let changeable = "use let for variables that change"; // block-scoped
const unchangeable = "use const for constants"; // block-scoped, cannot be reassigned

// JavaScript has several primitive data types:

// 1. String - text data
const name = "JavaScript";
const description = 'A powerful programming language';
const templateString = `Hello, ${name}!`; // template literal with interpolation

// 2. Number - integers and floating-point numbers
const age = 25;
const price = 19.99;
const negative = -10;

// 3. Boolean - true or false
const isAwesome = true;
const isComplicated = false;

// 4. Undefined - variable declared but not assigned
let notAssigned;
console.log(notAssigned); // undefined

// 5. Null - intentionally empty value
const emptyValue = null;

// 6. Symbol - unique identifier (advanced)
const uniqueId = Symbol('id');

// 7. BigInt - for very large integers (advanced)
const veryLargeNumber = 123456789012345678901234567890n;

// typeof operator tells you the data type
console.log(typeof name);        // "string"
console.log(typeof age);         // "number"
console.log(typeof isAwesome);   // "boolean"
console.log(typeof notAssigned); // "undefined"
console.log(typeof emptyValue);  // "object" (this is a known quirk!)
console.log(typeof uniqueId);    // "symbol"

// Variable naming rules:
// ✅ Valid: camelCase, snake_case, $variable, _private
// ❌ Invalid: 123name, my-variable, class (reserved word)

const userName = "camelCase is preferred in JavaScript";
const user_name = "snake_case works but not conventional";
const $element = "dollar sign is allowed";
const _private = "underscore prefix suggests private";