// 12 - The 'this' Keyword and Context
// Learn how 'this' works in different contexts and how to control it

// Global context
console.log("=== Global Context ===");
console.log("Global this:", this); // In browser: window, in Node.js: global object

function globalFunction() {
    console.log("Function this:", this); // In strict mode: undefined, otherwise global
}

globalFunction();

// Object method context
console.log("=== Object Method Context ===");
const person = {
    name: "Alice",
    age: 30,
    greet: function() {
        console.log(`Hello, I'm ${this.name} and I'm ${this.age} years old`);
        console.log("Method this:", this); // Refers to the person object
    },
    
    // Arrow function doesn't have its own 'this'
    greetArrow: () => {
        console.log("Arrow function this:", this); // Inherits from surrounding scope
    },
    
    // Method that returns a function
    getGreeter: function() {
        return function() {
            console.log("Inner function this:", this); // Lost context!
        };
    },
    
    // Method that returns an arrow function
    getArrowGreeter: function() {
        return () => {
            console.log("Inner arrow function this:", this); // Preserves context!
            console.log(`Arrow: Hello, I'm ${this.name}`);
        };
    }
};

person.greet();
person.greetArrow();

const lostContext = person.greet;
// lostContext(); // 'this' is undefined or global

const innerGreeter = person.getGreeter();
// innerGreeter(); // 'this' is undefined or global

const arrowGreeter = person.getArrowGreeter();
arrowGreeter(); // 'this' refers to person object

// Constructor function context
console.log("=== Constructor Context ===");
function Person(name, age) {
    this.name = name;
    this.age = age;
    
    this.greet = function() {
        console.log(`Constructor: Hello, I'm ${this.name}`);
    };
    
    // Arrow function in constructor
    this.greetArrow = () => {
        console.log(`Constructor arrow: Hello, I'm ${this.name}`);
    };
}

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);

alice.greet();
bob.greet();

// call, apply, and bind methods
console.log("=== call, apply, bind ===");

const user1 = { name: "John" };
const user2 = { name: "Jane" };

function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

// call - invoke function with specific 'this' and individual arguments
introduce.call(user1, "Hello", "!");
introduce.call(user2, "Hi", ".");

// apply - same as call but arguments as array
introduce.apply(user1, ["Greetings", "!!"]);
introduce.apply(user2, ["Hey", "..."]);

// bind - create new function with bound 'this'
const boundIntroduce = introduce.bind(user1);
boundIntroduce("Howdy", "!");

const boundIntroduceWithArgs = introduce.bind(user2, "Good morning");
boundIntroduceWithArgs("!");

// Event handler context (conceptual - would work in browser)
console.log("=== Event Handler Context ===");

const button = {
    text: "Click me",
    
    // Regular method
    handleClick: function() {
        console.log(`Button clicked: ${this.text}`);
    },
    
    // Arrow method
    handleClickArrow: () => {
        console.log(`Arrow clicked: ${this.text}`); // 'this' doesn't refer to button
    },
    
    // Method that adds event listener
    addEventListeners: function() {
        // In browser, you would do:
        // element.addEventListener('click', this.handleClick); // Wrong! 'this' becomes element
        // element.addEventListener('click', this.handleClick.bind(this)); // Correct!
        // element.addEventListener('click', () => this.handleClick()); // Also correct!
        
        console.log("Event listeners added (conceptual)");
    }
};

button.handleClick();
button.handleClickArrow();

// Class context
console.log("=== Class Context ===");
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    speak() {
        console.log(`${this.name} the ${this.species} makes a sound`);
    }
    
    // Arrow method in class (experimental syntax)
    speakArrow = () => {
        console.log(`Arrow: ${this.name} the ${this.species} makes a sound`);
    }
    
    // Static method - 'this' refers to the class itself
    static getSpeciesCount() {
        console.log("Static method this:", this); // Animal class
        return "Multiple species available";
    }
}

const dog = new Animal("Buddy", "dog");
const cat = new Animal("Whiskers", "cat");

dog.speak();
cat.speak();

// Method reference loses context
const dogSpeak = dog.speak;
// dogSpeak(); // Error or undefined behavior

// Arrow method preserves context
const dogSpeakArrow = dog.speakArrow;
dogSpeakArrow(); // Works correctly

Animal.getSpeciesCount();

// Practical examples
console.log("=== Practical Examples ===");

// Timer with 'this' context
const timer = {
    seconds: 0,
    
    start: function() {
        // Wrong way - 'this' changes inside setInterval
        // setInterval(function() {
        //     this.seconds++;
        //     console.log(this.seconds);
        // }, 1000);
        
        // Correct way 1 - arrow function
        const interval = setInterval(() => {
            this.seconds++;
            console.log(`Timer: ${this.seconds} seconds`);
            if (this.seconds >= 3) {
                clearInterval(interval);
                console.log("Timer stopped");
            }
        }, 100);
    },
    
    startWithBind: function() {
        // Correct way 2 - bind
        const updateTimer = function() {
            this.seconds++;
            console.log(`Bound timer: ${this.seconds} seconds`);
        }.bind(this);
        
        setTimeout(updateTimer, 50);
    }
};

timer.start();
setTimeout(() => timer.startWithBind(), 200);

// Chain of method calls maintaining context
const calculator = {
    value: 0,
    
    add: function(num) {
        this.value += num;
        return this; // Return 'this' for chaining
    },
    
    multiply: function(num) {
        this.value *= num;
        return this;
    },
    
    subtract: function(num) {
        this.value -= num;
        return this;
    },
    
    getValue: function() {
        return this.value;
    },
    
    reset: function() {
        this.value = 0;
        return this;
    }
};

const result = calculator
    .reset()
    .add(10)
    .multiply(3)
    .subtract(5)
    .getValue();

console.log("Chained calculation result:", result); // 25

// Common pitfalls and solutions
console.log("=== Common Pitfalls ===");

const obj = {
    name: "Object",
    
    methods: {
        regular: function() {
            console.log("Regular method this:", this.name); // undefined
        },
        
        arrow: () => {
            console.log("Arrow method this:", this); // global or undefined
        }
    },
    
    getMethod: function() {
        return this.methods.regular;
    },
    
    // Solution: use function declaration at object level
    regularMethod: function() {
        console.log("Object method this:", this.name); // "Object"
    }
};

obj.regularMethod();
// obj.methods.regular(); // 'this' doesn't refer to obj
// obj.methods.arrow(); // 'this' doesn't refer to obj

// Solution for nested object methods
const fixedObj = {
    name: "Fixed Object",
    
    init: function() {
        const self = this; // Store reference to 'this'
        
        return {
            regular: function() {
                console.log("Fixed regular method:", self.name);
            },
            
            arrow: () => {
                console.log("Fixed arrow method:", this.name); // Uses outer 'this'
            }
        };
    }
};

const methods = fixedObj.init();
methods.regular();
methods.arrow();