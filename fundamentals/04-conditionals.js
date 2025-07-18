// 04 - Conditionals
// Learn how to make decisions in your code based on conditions

// Basic if statement
const temperature = 25;

if (temperature > 30) {
    console.log("It's hot outside!");
}

// if-else statement
const age = 17;

if (age >= 18) {
    console.log("You can vote!");
} else {
    console.log("You're too young to vote.");
}

// if-else if-else chain
const grade = 85;

if (grade >= 90) {
    console.log("Grade: A");
} else if (grade >= 80) {
    console.log("Grade: B");
} else if (grade >= 70) {
    console.log("Grade: C");
} else if (grade >= 60) {
    console.log("Grade: D");
} else {
    console.log("Grade: F");
}

// Multiple conditions with logical operators
const username = "admin";
const password = "secret123";
const isLoggedIn = false;

if (username === "admin" && password === "secret123") {
    console.log("Access granted!");
} else {
    console.log("Invalid credentials!");
}

if (isLoggedIn || username === "guest") {
    console.log("Welcome to the system!");
}

// Switch statement - good for multiple specific values
const dayOfWeek = "Monday";

switch (dayOfWeek) {
    case "Monday":
        console.log("Start of the work week");
        break;
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
        console.log("Midweek grind");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend relaxation");
        break;
    default:
        console.log("Invalid day");
}

// Ternary operator for simple conditions
const isRaining = true;
const outfit = isRaining ? "raincoat" : "t-shirt";
console.log(`Wear a ${outfit} today`);

// Truthy and falsy values
// Falsy: false, 0, "", null, undefined, NaN
// Everything else is truthy

const userInput = ""; // empty string is falsy

if (userInput) {
    console.log("User provided input:", userInput);
} else {
    console.log("No input provided");
}

// Short-circuit evaluation
const user = null;
const defaultName = "Guest";

// If user exists, use user.name, otherwise use defaultName
const displayName = user?.name || defaultName;
console.log("Display name:", displayName);

// Nullish coalescing operator (??) - only null and undefined are falsy
const setting = 0;
const defaultSetting = 10;

const finalSetting = setting ?? defaultSetting; // Uses 0, not defaultSetting
console.log("Final setting:", finalSetting);

// Complex condition example
const userAge = 25;
const hasAccount = true;
const accountType = "premium";

if (userAge >= 18 && hasAccount && (accountType === "premium" || accountType === "gold")) {
    console.log("Full access granted!");
} else if (userAge >= 18 && hasAccount) {
    console.log("Basic access granted!");
} else {
    console.log("Access denied!");
}