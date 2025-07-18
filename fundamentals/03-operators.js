// 03 - Operators
// Learn different types of operators to manipulate data

// Arithmetic Operators
const a = 10;
const b = 3;

console.log("Arithmetic Operators:");
console.log(a + b);  // Addition: 13
console.log(a - b);  // Subtraction: 7
console.log(a * b);  // Multiplication: 30
console.log(a / b);  // Division: 3.333...
console.log(a % b);  // Modulus (remainder): 1
console.log(a ** b); // Exponentiation: 1000

// Assignment Operators
let x = 5;
x += 3;  // Same as: x = x + 3 (now x is 8)
x -= 2;  // Same as: x = x - 2 (now x is 6)
x *= 2;  // Same as: x = x * 2 (now x is 12)
x /= 3;  // Same as: x = x / 3 (now x is 4)
x %= 3;  // Same as: x = x % 3 (now x is 1)

console.log("x after operations:", x);

// Increment and Decrement
let counter = 0;
counter++;     // Post-increment: use value, then add 1
++counter;     // Pre-increment: add 1, then use value
counter--;     // Post-decrement: use value, then subtract 1
--counter;     // Pre-decrement: subtract 1, then use value

console.log("Counter:", counter); // 0

// Comparison Operators
const num1 = 5;
const num2 = "5";

console.log("Comparison Operators:");
console.log(num1 == num2);   // Loose equality: true (converts types)
console.log(num1 === num2);  // Strict equality: false (no type conversion)
console.log(num1 != num2);   // Loose inequality: false
console.log(num1 !== num2);  // Strict inequality: true
console.log(num1 > 3);       // Greater than: true
console.log(num1 < 10);      // Less than: true
console.log(num1 >= 5);      // Greater than or equal: true
console.log(num1 <= 4);      // Less than or equal: false

// Logical Operators
const isAdult = true;
const hasLicense = false;

console.log("Logical Operators:");
console.log(isAdult && hasLicense); // AND: false (both must be true)
console.log(isAdult || hasLicense); // OR: true (at least one must be true)
console.log(!isAdult);              // NOT: false (inverts the value)

// Ternary Operator (shorthand if-else)
const age = 18;
const status = age >= 18 ? "adult" : "minor";
console.log("Status:", status); // "adult"

// String Operators
const firstName = "John";
const lastName = "Doe";
const fullName = firstName + " " + lastName; // Concatenation
console.log("Full name:", fullName);

// Modern alternative: template literals
const greeting = `Hello, ${fullName}!`;
console.log(greeting);