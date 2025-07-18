// 09 - Strings
// Learn comprehensive string manipulation and methods

// Creating strings
const singleQuotes = 'Hello with single quotes';
const doubleQuotes = "Hello with double quotes";
const backticks = `Hello with backticks`;
const stringObject = new String("String object"); // Less common

console.log("Different string types:");
console.log(singleQuotes);
console.log(doubleQuotes);
console.log(backticks);

// String properties
const text = "JavaScript";
console.log("Length:", text.length); // 10

// Accessing characters
console.log("First character:", text[0]);           // "J"
console.log("Last character:", text[text.length - 1]); // "t"
console.log("charAt method:", text.charAt(4));      // "S"

// String immutability - strings cannot be changed
let message = "Hello";
message[0] = "h"; // This doesn't work
console.log("Unchanged message:", message); // Still "Hello"

// You must create new strings
message = "h" + message.slice(1);
console.log("Changed message:", message); // "hello"

// Template literals (backticks) - string interpolation
const name = "Alice";
const age = 25;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
console.log(greeting);

// Multi-line strings with template literals
const multiLine = `
    This is a
    multi-line
    string
`;
console.log("Multi-line:", multiLine);

// String methods - searching
const sentence = "The quick brown fox jumps over the lazy dog";

console.log("=== Search Methods ===");
console.log("indexOf 'fox':", sentence.indexOf("fox"));           // 16
console.log("lastIndexOf 'o':", sentence.lastIndexOf("o"));       // 41
console.log("includes 'quick':", sentence.includes("quick"));     // true
console.log("startsWith 'The':", sentence.startsWith("The"));     // true
console.log("endsWith 'dog':", sentence.endsWith("dog"));         // true

// String methods - extracting
console.log("=== Extract Methods ===");
console.log("slice(4, 9):", sentence.slice(4, 9));          // "quick"
console.log("substring(4, 9):", sentence.substring(4, 9));   // "quick"
console.log("substr(4, 5):", sentence.substr(4, 5));        // "quick" (deprecated)

// Negative indices with slice
console.log("slice(-8, -4):", sentence.slice(-8, -4));       // "lazy"

// String methods - transforming
const mixedCase = "JavaScript Programming";

console.log("=== Transform Methods ===");
console.log("toLowerCase:", mixedCase.toLowerCase());
console.log("toUpperCase:", mixedCase.toUpperCase());
console.log("trim whitespace:", "  hello world  ".trim());

// String replacement
const original = "I love cats. Cats are amazing!";
console.log("replace first:", original.replace("cats", "dogs"));
console.log("replace all:", original.replace(/cats/gi, "dogs")); // Using regex
console.log("replaceAll:", original.replaceAll("cats", "dogs")); // ES2021

// String splitting and joining
const csv = "apple,banana,orange,grape";
const fruits = csv.split(",");
console.log("Split CSV:", fruits);

const rejoined = fruits.join(" | ");
console.log("Rejoined:", rejoined);

// Split with limit
const limited = csv.split(",", 2);
console.log("Limited split:", limited);

// String padding
const number = "42";
console.log("padStart:", number.padStart(5, "0"));   // "00042"
console.log("padEnd:", number.padEnd(5, "0"));       // "42000"

// Character codes
const char = "A";
console.log("Character code of A:", char.charCodeAt(0));    // 65
console.log("Character from code 66:", String.fromCharCode(66)); // "B"

// String comparison
const str1 = "apple";
const str2 = "banana";
console.log("Comparison:", str1.localeCompare(str2)); // -1 (str1 comes before str2)

// Regular expressions with strings
const email = "user@example.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log("Valid email:", emailPattern.test(email));

// Extract matches
const phoneText = "Call me at 123-456-7890 or 987-654-3210";
const phonePattern = /\d{3}-\d{3}-\d{4}/g;
const phoneNumbers = phoneText.match(phonePattern);
console.log("Phone numbers:", phoneNumbers);

// String validation functions
function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function isValidPassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
}

console.log("Valid email test:", isValidEmail("test@example.com"));
console.log("Valid password test:", isValidPassword("Password123"));

// String utilities
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeWords(str) {
    return str.split(' ')
              .map(word => capitalizeFirst(word))
              .join(' ');
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}

function countVowels(str) {
    const vowels = str.match(/[aeiouAEIOU]/g);
    return vowels ? vowels.length : 0;
}

// Testing utility functions
console.log("=== String Utilities ===");
console.log("Capitalize first:", capitalizeFirst("hello world"));
console.log("Capitalize words:", capitalizeWords("hello world from javascript"));
console.log("Reverse string:", reverseString("hello"));
console.log("Is palindrome:", isPalindrome("A man a plan a canal Panama"));
console.log("Count vowels:", countVowels("Hello World"));

// URL and encoding
const url = "https://example.com/search?q=hello world&type=text";
console.log("Encoded URL:", encodeURIComponent(url));

const encoded = "Hello%20World%21";
console.log("Decoded URL:", decodeURIComponent(encoded));

// JSON and strings
const data = { name: "Alice", age: 30 };
const jsonString = JSON.stringify(data);
console.log("JSON string:", jsonString);

const parsedData = JSON.parse(jsonString);
console.log("Parsed data:", parsedData);

// String templates for HTML
function createUserCard(user) {
    return `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>Age: ${user.age}</p>
            <p>Email: ${user.email}</p>
        </div>
    `;
}

const user = { name: "Bob", age: 28, email: "bob@example.com" };
console.log("HTML template:", createUserCard(user));

// Performance tip: Use array join for many concatenations
function buildLargeString(items) {
    const parts = [];
    for (const item of items) {
        parts.push(`Item: ${item}`);
    }
    return parts.join('\n');
}

const items = ['apple', 'banana', 'orange'];
console.log("Large string building:", buildLargeString(items));