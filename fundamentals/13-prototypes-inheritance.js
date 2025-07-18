// 13 - Prototypes and Inheritance
// Learn JavaScript's prototype-based inheritance system

// Every object has a prototype
console.log("=== Prototype Basics ===");

const obj = {};
console.log("Object prototype:", Object.getPrototypeOf(obj));
console.log("Object constructor:", obj.constructor);

// Function constructor with prototype
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Adding methods to prototype
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
};

Person.prototype.getAgeGroup = function() {
    if (this.age < 18) return "minor";
    if (this.age < 65) return "adult";
    return "senior";
};

const person1 = new Person("Alice", 30);
const person2 = new Person("Bob", 25);

console.log(person1.greet());
console.log(person2.greet());
console.log("Age group:", person1.getAgeGroup());

// Prototype chain
console.log("=== Prototype Chain ===");
console.log("person1 prototype:", Object.getPrototypeOf(person1));
console.log("Person.prototype:", Person.prototype);
console.log("Are they the same?", Object.getPrototypeOf(person1) === Person.prototype);

// Checking prototype chain
console.log("person1 instanceof Person:", person1 instanceof Person);
console.log("person1 instanceof Object:", person1 instanceof Object);

// hasOwnProperty vs prototype properties
console.log("=== Own vs Prototype Properties ===");
console.log("person1.hasOwnProperty('name'):", person1.hasOwnProperty('name')); // true
console.log("person1.hasOwnProperty('greet'):", person1.hasOwnProperty('greet')); // false

// Listing all properties
console.log("Own properties:", Object.getOwnPropertyNames(person1));
console.log("All enumerable properties:");
for (let prop in person1) {
    console.log(`${prop}: ${person1.hasOwnProperty(prop) ? 'own' : 'inherited'}`);
}

// Prototype inheritance
console.log("=== Prototype Inheritance ===");

// Parent constructor
function Animal(name, species) {
    this.name = name;
    this.species = species;
}

Animal.prototype.speak = function() {
    return `${this.name} makes a sound`;
};

Animal.prototype.getInfo = function() {
    return `${this.name} is a ${this.species}`;
};

// Child constructor
function Dog(name, breed) {
    Animal.call(this, name, "dog"); // Call parent constructor
    this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add child-specific methods
Dog.prototype.speak = function() {
    return `${this.name} barks!`;
};

Dog.prototype.wagTail = function() {
    return `${this.name} wags its tail`;
};

const dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.speak());      // Overridden method
console.log(dog.getInfo());    // Inherited method
console.log(dog.wagTail());    // Child-specific method
console.log("Dog breed:", dog.breed);

// Prototype chain verification
console.log("=== Inheritance Chain ===");
console.log("dog instanceof Dog:", dog instanceof Dog);
console.log("dog instanceof Animal:", dog instanceof Animal);
console.log("dog instanceof Object:", dog instanceof Object);

// Modern class syntax (ES6)
console.log("=== ES6 Classes ===");

class Vehicle {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    
    getInfo() {
        return `${this.year} ${this.make} ${this.model}`;
    }
    
    start() {
        return `${this.getInfo()} is starting`;
    }
    
    // Static method
    static compareYears(vehicle1, vehicle2) {
        return vehicle1.year - vehicle2.year;
    }
}

class Car extends Vehicle {
    constructor(make, model, year, doors) {
        super(make, model, year); // Call parent constructor
        this.doors = doors;
    }
    
    start() {
        return `${this.getInfo()} with ${this.doors} doors is starting`;
    }
    
    honk() {
        return `${this.getInfo()} goes beep beep!`;
    }
}

const car1 = new Car("Toyota", "Camry", 2022, 4);
const car2 = new Car("Honda", "Civic", 2021, 4);

console.log(car1.start());
console.log(car1.honk());
console.log("Year comparison:", Vehicle.compareYears(car1, car2));

// Prototype methods vs instance methods
console.log("=== Prototype vs Instance Methods ===");

function Calculator(initialValue = 0) {
    this.value = initialValue;
    
    // Instance method - each instance gets its own copy
    this.instanceMethod = function() {
        return "I'm an instance method";
    };
}

// Prototype method - shared among all instances
Calculator.prototype.prototypeMethod = function() {
    return "I'm a prototype method";
};

Calculator.prototype.add = function(num) {
    this.value += num;
    return this;
};

Calculator.prototype.getValue = function() {
    return this.value;
};

const calc1 = new Calculator(10);
const calc2 = new Calculator(20);

console.log("Same prototype method?", calc1.prototypeMethod === calc2.prototypeMethod); // true
console.log("Same instance method?", calc1.instanceMethod === calc2.instanceMethod); // false

// Object.create() for prototype-based inheritance
console.log("=== Object.create ===");

const personPrototype = {
    init: function(name, age) {
        this.name = name;
        this.age = age;
        return this;
    },
    
    greet: function() {
        return `Hello, I'm ${this.name}`;
    }
};

const student = Object.create(personPrototype);
student.init("Charlie", 20);
student.study = function(subject) {
    return `${this.name} is studying ${subject}`;
};

console.log(student.greet());
console.log(student.study("JavaScript"));

// Prototype modification affects all instances
console.log("=== Dynamic Prototype Modification ===");

function Book(title, author) {
    this.title = title;
    this.author = author;
}

const book1 = new Book("1984", "George Orwell");
const book2 = new Book("Brave New World", "Aldous Huxley");

// Add method to prototype after instances are created
Book.prototype.getDescription = function() {
    return `"${this.title}" by ${this.author}`;
};

console.log(book1.getDescription()); // Works!
console.log(book2.getDescription()); // Works!

// Prototype pollution (security concern)
console.log("=== Prototype Pollution ===");

const userInput = '{"__proto__": {"isAdmin": true}}';

// Dangerous - can modify Object.prototype
// const parsed = JSON.parse(userInput);
// console.log("Is admin?", {}.isAdmin); // Could be true!

// Safe alternative
function safeAssign(target, source) {
    for (const key in source) {
        if (key !== '__proto__' && source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

// Mixin pattern using prototypes
console.log("=== Mixin Pattern ===");

const CanFly = {
    fly: function() {
        return `${this.name} is flying!`;
    }
};

const CanSwim = {
    swim: function() {
        return `${this.name} is swimming!`;
    }
};

function Bird(name) {
    this.name = name;
}

function Fish(name) {
    this.name = name;
}

function Duck(name) {
    this.name = name;
}

// Add flying capability to Bird and Duck
Object.assign(Bird.prototype, CanFly);
Object.assign(Duck.prototype, CanFly, CanSwim);

// Add swimming capability to Fish and Duck
Object.assign(Fish.prototype, CanSwim);

const eagle = new Bird("Eagle");
const salmon = new Fish("Salmon");
const mallard = new Duck("Mallard");

console.log(eagle.fly());
console.log(salmon.swim());
console.log(mallard.fly());
console.log(mallard.swim());

// Property descriptors and inheritance
console.log("=== Property Descriptors ===");

function SecureObject() {
    this._secret = "hidden value";
}

Object.defineProperty(SecureObject.prototype, 'secret', {
    get: function() {
        return "Access denied";
    },
    set: function(value) {
        console.log("Cannot set secret value");
    },
    enumerable: false,
    configurable: false
});

const secure = new SecureObject();
console.log("Secret value:", secure.secret);
secure.secret = "new value"; // Won't work

// Check if property is enumerable
console.log("Secret enumerable?", Object.propertyIsEnumerable.call(secure, 'secret'));