// 19 - ES6+ Features
// Master modern JavaScript features introduced in ES6 and beyond

console.log("=== ES6+ Modern JavaScript Features ===");

// 1. Let and Const (Block Scoping)
console.log("\n=== Let and Const ===");

function demonstrateBlockScoping() {
    console.log("Block scoping demonstration:");
    
    // var is function-scoped
    if (true) {
        var varVariable = "I'm function scoped";
        let letVariable = "I'm block scoped";
        const constVariable = "I'm also block scoped and immutable";
    }
    
    console.log("var outside block:", varVariable); // Accessible
    // console.log(letVariable); // Error: not defined
    // console.log(constVariable); // Error: not defined
    
    // const prevents reassignment
    const config = { theme: "dark" };
    // config = {}; // Error: Assignment to constant variable
    config.theme = "light"; // This works - object is mutable
    console.log("Modified config:", config);
    
    // let allows reassignment
    let counter = 0;
    counter = 1;
    console.log("Counter:", counter);
}

demonstrateBlockScoping();

// 2. Arrow Functions
console.log("\n=== Arrow Functions ===");

function demonstrateArrowFunctions() {
    // Traditional function
    function traditionalFunction(x, y) {
        return x + y;
    }
    
    // Arrow function - multiple parameters
    const arrowFunction = (x, y) => {
        return x + y;
    };
    
    // Arrow function - single expression (implicit return)
    const shortArrow = (x, y) => x + y;
    
    // Arrow function - single parameter (parentheses optional)
    const square = x => x * x;
    
    // Arrow function - no parameters
    const greet = () => "Hello World!";
    
    // Arrow function - returning object (wrap in parentheses)
    const createUser = (name, age) => ({ name, age });
    
    console.log("Traditional:", traditionalFunction(5, 3));
    console.log("Arrow:", arrowFunction(5, 3));
    console.log("Short arrow:", shortArrow(5, 3));
    console.log("Square:", square(4));
    console.log("Greet:", greet());
    console.log("Create user:", createUser("Alice", 30));
    
    // Arrow functions and 'this' context
    const obj = {
        name: "Test Object",
        
        traditionalMethod: function() {
            console.log("Traditional method this:", this.name);
        },
        
        arrowMethod: () => {
            console.log("Arrow method this:", this); // Inherits from outer scope
        },
        
        methodWithCallback: function() {
            // Traditional function changes 'this'
            setTimeout(function() {
                console.log("Callback this (traditional):", this.name); // undefined
            }, 10);
            
            // Arrow function preserves 'this'
            setTimeout(() => {
                console.log("Callback this (arrow):", this.name); // "Test Object"
            }, 20);
        }
    };
    
    obj.traditionalMethod();
    obj.arrowMethod();
    obj.methodWithCallback();
}

demonstrateArrowFunctions();

// 3. Template Literals
console.log("\n=== Template Literals ===");

function demonstrateTemplateLiterals() {
    const name = "Alice";
    const age = 30;
    const score = 95.5;
    
    // Basic interpolation
    const message = `Hello, my name is ${name} and I'm ${age} years old.`;
    console.log(message);
    
    // Expressions in template literals
    const result = `${name} scored ${score}% (${score >= 90 ? 'Excellent' : 'Good'})`;
    console.log(result);
    
    // Multi-line strings
    const multiLine = `
        This is a multi-line string.
        It preserves line breaks and indentation.
        Name: ${name}
        Age: ${age}
    `;
    console.log(multiLine);
    
    // Tagged template literals
    function highlight(strings, ...values) {
        return strings.reduce((result, string, i) => {
            const value = values[i] ? `**${values[i]}**` : '';
            return result + string + value;
        }, '');
    }
    
    const highlighted = highlight`Name: ${name}, Age: ${age}`;
    console.log("Highlighted:", highlighted);
    
    // HTML template
    function createHTML(title, content) {
        return `
            <article>
                <h1>${title}</h1>
                <p>${content}</p>
                <time>${new Date().toISOString()}</time>
            </article>
        `;
    }
    
    console.log("HTML:", createHTML("My Article", "This is the content"));
}

demonstrateTemplateLiterals();

// 4. Destructuring Assignment
console.log("\n=== Destructuring Assignment ===");

function demonstrateDestructuring() {
    // Array destructuring
    const numbers = [1, 2, 3, 4, 5];
    const [first, second, ...rest] = numbers;
    
    console.log("First:", first);
    console.log("Second:", second);
    console.log("Rest:", rest);
    
    // Skipping elements
    const [a, , c] = numbers;
    console.log("Skip example:", a, c);
    
    // Default values
    const [x, y, z = 0] = [1, 2];
    console.log("With defaults:", x, y, z);
    
    // Object destructuring
    const user = {
        name: "Bob",
        age: 25,
        email: "bob@example.com",
        address: {
            city: "New York",
            country: "USA"
        }
    };
    
    const { name, age, email } = user;
    console.log("User data:", name, age, email);
    
    // Renaming variables
    const { name: userName, age: userAge } = user;
    console.log("Renamed:", userName, userAge);
    
    // Default values
    const { phone = "Not provided" } = user;
    console.log("Phone:", phone);
    
    // Nested destructuring
    const { address: { city, country } } = user;
    console.log("Address:", city, country);
    
    // Function parameter destructuring
    function greetUser({ name, age, email = "Not provided" }) {
        return `Hello ${name}, age ${age}, email: ${email}`;
    }
    
    console.log(greetUser(user));
    
    // Swapping variables
    let var1 = "first";
    let var2 = "second";
    [var1, var2] = [var2, var1];
    console.log("After swap:", var1, var2);
}

demonstrateDestructuring();

// 5. Spread and Rest Operators
console.log("\n=== Spread and Rest Operators ===");

function demonstrateSpreadRest() {
    // Spread with arrays
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const combined = [...arr1, ...arr2];
    console.log("Combined arrays:", combined);
    
    // Array copying
    const originalArray = [1, 2, 3];
    const copiedArray = [...originalArray];
    console.log("Copied array:", copiedArray);
    
    // Spread with objects
    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3, d: 4 };
    const combinedObj = { ...obj1, ...obj2 };
    console.log("Combined objects:", combinedObj);
    
    // Object copying and overriding
    const originalObj = { name: "Alice", age: 30, city: "NYC" };
    const updatedObj = { ...originalObj, age: 31, country: "USA" };
    console.log("Updated object:", updatedObj);
    
    // Rest in function parameters
    function sum(...numbers) {
        return numbers.reduce((total, num) => total + num, 0);
    }
    
    console.log("Sum:", sum(1, 2, 3, 4, 5));
    
    // Rest with destructuring
    const [head, ...tail] = [1, 2, 3, 4, 5];
    console.log("Head:", head, "Tail:", tail);
    
    const { name, ...restProps } = { name: "Bob", age: 25, city: "LA" };
    console.log("Name:", name, "Rest:", restProps);
    
    // Spread in function calls
    const maxNumber = Math.max(...[1, 5, 3, 9, 2]);
    console.log("Max number:", maxNumber);
}

demonstrateSpreadRest();

// 6. Default Parameters
console.log("\n=== Default Parameters ===");

function demonstrateDefaultParameters() {
    // Basic default parameters
    function greet(name = "Guest", greeting = "Hello") {
        return `${greeting}, ${name}!`;
    }
    
    console.log(greet());
    console.log(greet("Alice"));
    console.log(greet("Bob", "Hi"));
    
    // Default parameters with expressions
    function createUser(name, id = Math.random().toString(36).substr(2, 9)) {
        return { name, id };
    }
    
    console.log("User 1:", createUser("Alice"));
    console.log("User 2:", createUser("Bob"));
    
    // Default parameters using previous parameters
    function fullName(first, last = first) {
        return `${first} ${last}`;
    }
    
    console.log("Same name:", fullName("Smith"));
    console.log("Different names:", fullName("John", "Doe"));
    
    // Default parameters with destructuring
    function configureApp({ theme = "light", lang = "en", debug = false } = {}) {
        return { theme, lang, debug };
    }
    
    console.log("Default config:", configureApp());
    console.log("Custom config:", configureApp({ theme: "dark", debug: true }));
}

demonstrateDefaultParameters();

// 7. Enhanced Object Literals
console.log("\n=== Enhanced Object Literals ===");

function demonstrateEnhancedObjects() {
    const name = "Alice";
    const age = 30;
    
    // Property shorthand
    const user = { name, age }; // Same as { name: name, age: age }
    console.log("User:", user);
    
    // Method shorthand
    const calculator = {
        value: 0,
        
        // Old way: add: function(num) { ... }
        add(num) {
            this.value += num;
            return this;
        },
        
        multiply(num) {
            this.value *= num;
            return this;
        },
        
        getValue() {
            return this.value;
        }
    };
    
    const result = calculator.add(5).multiply(3).getValue();
    console.log("Calculator result:", result);
    
    // Computed property names
    const propertyName = "dynamicProperty";
    const obj = {
        staticProperty: "static",
        [propertyName]: "dynamic",
        [`${propertyName}_2`]: "dynamic 2",
        [Date.now()]: "timestamp property"
    };
    
    console.log("Dynamic properties:", obj);
    
    // Getters and setters
    const person = {
        firstName: "John",
        lastName: "Doe",
        
        get fullName() {
            return `${this.firstName} ${this.lastName}`;
        },
        
        set fullName(value) {
            [this.firstName, this.lastName] = value.split(" ");
        }
    };
    
    console.log("Full name:", person.fullName);
    person.fullName = "Jane Smith";
    console.log("After setting:", person.firstName, person.lastName);
}

demonstrateEnhancedObjects();

// 8. Classes
console.log("\n=== ES6 Classes ===");

function demonstrateClasses() {
    // Basic class
    class Animal {
        constructor(name, species) {
            this.name = name;
            this.species = species;
        }
        
        speak() {
            return `${this.name} makes a sound`;
        }
        
        getInfo() {
            return `${this.name} is a ${this.species}`;
        }
        
        // Static method
        static getKingdom() {
            return "Animalia";
        }
    }
    
    const animal = new Animal("Generic", "Unknown");
    console.log(animal.speak());
    console.log(animal.getInfo());
    console.log("Kingdom:", Animal.getKingdom());
    
    // Class inheritance
    class Dog extends Animal {
        constructor(name, breed) {
            super(name, "Dog"); // Call parent constructor
            this.breed = breed;
        }
        
        speak() {
            return `${this.name} barks!`;
        }
        
        wagTail() {
            return `${this.name} wags its tail`;
        }
        
        getInfo() {
            return `${super.getInfo()} and is a ${this.breed}`;
        }
    }
    
    const dog = new Dog("Buddy", "Golden Retriever");
    console.log(dog.speak());
    console.log(dog.wagTail());
    console.log(dog.getInfo());
    
    // Private fields (ES2022)
    class BankAccount {
        #balance = 0; // Private field
        
        constructor(initialBalance) {
            this.#balance = initialBalance;
        }
        
        deposit(amount) {
            if (amount > 0) {
                this.#balance += amount;
            }
            return this.#balance;
        }
        
        withdraw(amount) {
            if (amount > 0 && amount <= this.#balance) {
                this.#balance -= amount;
            }
            return this.#balance;
        }
        
        get balance() {
            return this.#balance;
        }
    }
    
    const account = new BankAccount(100);
    console.log("Initial balance:", account.balance);
    console.log("After deposit:", account.deposit(50));
    console.log("After withdrawal:", account.withdraw(30));
    // console.log(account.#balance); // Error: Private field
}

demonstrateClasses();

// 9. Modules (import/export)
console.log("\n=== Modules ===");

function demonstrateModules() {
    // This is demonstration code - actual imports would be at top of file
    
    console.log("Module patterns demonstrated:");
    
    // Named exports
    /*
    // math.js
    export function add(a, b) {
        return a + b;
    }
    
    export function multiply(a, b) {
        return a * b;
    }
    
    export const PI = 3.14159;
    
    // Importing
    import { add, multiply, PI } from './math.js';
    import { add as addNumbers } from './math.js'; // Rename
    import * as mathUtils from './math.js'; // Import all
    */
    
    // Default exports
    /*
    // calculator.js
    export default class Calculator {
        add(a, b) { return a + b; }
    }
    
    // Importing
    import Calculator from './calculator.js';
    import Calc from './calculator.js'; // Can rename default
    */
    
    // Mixed exports
    /*
    // utils.js
    export function helper() { ... }
    export default function mainFunction() { ... }
    
    // Importing
    import mainFunction, { helper } from './utils.js';
    */
    
    // Dynamic imports
    /*
    async function loadModule() {
        const module = await import('./dynamic-module.js');
        module.default();
    }
    */
    
    console.log("Module examples shown in comments - use in actual files");
}

demonstrateModules();

// 10. Symbols
console.log("\n=== Symbols ===");

function demonstrateSymbols() {
    // Unique symbols
    const sym1 = Symbol();
    const sym2 = Symbol();
    console.log("Symbols equal?", sym1 === sym2); // false
    
    // Symbols with descriptions
    const sym3 = Symbol("description");
    const sym4 = Symbol("description");
    console.log("Named symbols equal?", sym3 === sym4); // false
    console.log("Symbol description:", sym3.toString());
    
    // Symbols as object keys
    const obj = {
        [sym1]: "value1",
        [sym2]: "value2",
        regularProperty: "regular"
    };
    
    console.log("Symbol property:", obj[sym1]);
    console.log("Regular property:", obj.regularProperty);
    
    // Symbols are not enumerable
    console.log("Object keys:", Object.keys(obj)); // Only regularProperty
    console.log("Symbol keys:", Object.getOwnPropertySymbols(obj));
    
    // Well-known symbols
    const iterableObj = {
        data: [1, 2, 3],
        
        [Symbol.iterator]() {
            let index = 0;
            const data = this.data;
            
            return {
                next() {
                    if (index < data.length) {
                        return { value: data[index++], done: false };
                    }
                    return { done: true };
                }
            };
        }
    };
    
    console.log("Custom iterable:");
    for (const value of iterableObj) {
        console.log("Iterated value:", value);
    }
}

demonstrateSymbols();

// 11. Maps and Sets
console.log("\n=== Maps and Sets ===");

function demonstrateMapsAndSets() {
    // Map
    const map = new Map();
    
    // Set key-value pairs
    map.set("name", "Alice");
    map.set("age", 30);
    map.set(1, "number key");
    map.set(true, "boolean key");
    
    console.log("Map size:", map.size);
    console.log("Get name:", map.get("name"));
    console.log("Has age:", map.has("age"));
    
    // Iterate over map
    console.log("Map entries:");
    for (const [key, value] of map) {
        console.log(`${key}: ${value}`);
    }
    
    // Map methods
    console.log("Map keys:", Array.from(map.keys()));
    console.log("Map values:", Array.from(map.values()));
    
    map.delete("age");
    console.log("After delete:", map.size);
    
    // Set
    const set = new Set();
    
    set.add(1);
    set.add(2);
    set.add(2); // Duplicate - ignored
    set.add("hello");
    
    console.log("Set size:", set.size);
    console.log("Set has 2:", set.has(2));
    
    console.log("Set values:");
    for (const value of set) {
        console.log("Set value:", value);
    }
    
    // Array deduplication with Set
    const arrayWithDuplicates = [1, 2, 2, 3, 3, 4];
    const uniqueArray = [...new Set(arrayWithDuplicates)];
    console.log("Deduplicated array:", uniqueArray);
    
    // WeakMap and WeakSet (for garbage collection)
    const weakMap = new WeakMap();
    const obj1 = {};
    const obj2 = {};
    
    weakMap.set(obj1, "value for obj1");
    weakMap.set(obj2, "value for obj2");
    
    console.log("WeakMap get:", weakMap.get(obj1));
    console.log("WeakMap has obj2:", weakMap.has(obj2));
}

demonstrateMapsAndSets();

console.log("\n=== ES6+ Features Complete ===");
console.log("These features make JavaScript more powerful and expressive!");