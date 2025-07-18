// 08 - Objects
// Learn how to work with objects - key-value pairs and complex data structures

// Creating objects
const person = {
    name: "Alice",
    age: 30,
    city: "New York",
    isEmployed: true
};

// Object literal with methods
const calculator = {
    result: 0,
    add: function(num) {
        this.result += num;
        return this;
    },
    multiply: function(num) {
        this.result *= num;
        return this;
    },
    getResult: function() {
        return this.result;
    }
};

console.log("Person:", person);

// Accessing object properties
console.log("Name (dot notation):", person.name);
console.log("Age (bracket notation):", person["age"]);

// Dynamic property access
const propertyName = "city";
console.log("Dynamic access:", person[propertyName]);

// Adding new properties
person.email = "alice@example.com";
person["phone"] = "123-456-7890";
console.log("Updated person:", person);

// Modifying properties
person.age = 31;
console.log("New age:", person.age);

// Deleting properties
delete person.phone;
console.log("After deletion:", person);

// Checking if property exists
console.log("Has name:", "name" in person);
console.log("Has phone:", "phone" in person);
console.log("Has toString:", "toString" in person); // inherited property

// Object.hasOwnProperty for own properties only
console.log("Own property - name:", person.hasOwnProperty("name"));
console.log("Own property - toString:", person.hasOwnProperty("toString"));

// Object methods
const car = {
    brand: "Toyota",
    model: "Camry",
    year: 2022,
    start: function() {
        console.log(`${this.brand} ${this.model} is starting...`);
    },
    getInfo: function() {
        return `${this.year} ${this.brand} ${this.model}`;
    }
};

car.start();
console.log("Car info:", car.getInfo());

// Method chaining
calculator.add(5).multiply(3).add(2);
console.log("Calculator result:", calculator.getResult()); // 17

// Object destructuring
const student = {
    name: "Bob",
    grade: 85,
    subject: "Math",
    teacher: "Ms. Smith"
};

const { name, grade } = student;
console.log("Destructured:", name, grade);

// Destructuring with renaming
const { subject: courseName, teacher: instructor } = student;
console.log("Renamed:", courseName, instructor);

// Destructuring with default values
const { gpa = 3.0 } = student;
console.log("GPA (default):", gpa);

// Nested objects
const company = {
    name: "Tech Corp",
    address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105"
    },
    employees: [
        { name: "John", position: "Developer" },
        { name: "Jane", position: "Designer" }
    ]
};

console.log("Company street:", company.address.street);
console.log("First employee:", company.employees[0].name);

// Nested destructuring
const { address: { city, state }, employees: [firstEmployee] } = company;
console.log("City and state:", city, state);
console.log("First employee name:", firstEmployee.name);

// Object methods and iteration
const scores = { math: 95, science: 87, english: 92 };

// Object.keys() - get array of property names
const subjects = Object.keys(scores);
console.log("Subjects:", subjects);

// Object.values() - get array of property values
const values = Object.values(scores);
console.log("Scores:", values);

// Object.entries() - get array of [key, value] pairs
const entries = Object.entries(scores);
console.log("Entries:", entries);

// Iterating over object properties
console.log("=== Iterating over object ===");
for (const subject in scores) {
    console.log(`${subject}: ${scores[subject]}`);
}

// Using Object.entries with forEach
Object.entries(scores).forEach(([subject, score]) => {
    console.log(`${subject} score: ${score}`);
});

// Object creation patterns
function createUser(name, email) {
    return {
        name: name,
        email: email,
        login: function() {
            console.log(`${this.name} logged in`);
        }
    };
}

// ES6 shorthand property names
function createUserES6(name, email) {
    return {
        name,     // same as name: name
        email,    // same as email: email
        login() { // method shorthand
            console.log(`${this.name} logged in`);
        }
    };
}

const user1 = createUser("Alice", "alice@example.com");
const user2 = createUserES6("Bob", "bob@example.com");

user1.login();
user2.login();

// Object copying
const original = { a: 1, b: 2, c: { nested: 3 } };

// Shallow copy methods
const copy1 = Object.assign({}, original);
const copy2 = { ...original }; // spread operator

// Both are shallow copies - nested objects are still referenced
copy1.a = 10;
copy1.c.nested = 30;

console.log("Original:", original); // c.nested is changed!
console.log("Copy 1:", copy1);

// Deep copy (simple method - doesn't work with functions/dates)
const deepCopy = JSON.parse(JSON.stringify(original));

// Object comparison
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = obj1;

console.log("obj1 === obj2:", obj1 === obj2); // false (different objects)
console.log("obj1 === obj3:", obj1 === obj3); // true (same reference)

// Comparing object contents
function objectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }
    
    return true;
}

console.log("Objects equal:", objectsEqual(obj1, obj2)); // true

// Computed property names
const dynamicKey = "score";
const gameResult = {
    player: "Alice",
    [dynamicKey]: 1500,
    [`${dynamicKey}_bonus`]: 200
};

console.log("Game result:", gameResult);

// Object.freeze() - make object immutable
const frozenObj = Object.freeze({ name: "Frozen" });
frozenObj.name = "Changed"; // This won't work
console.log("Frozen object:", frozenObj.name); // Still "Frozen"

// Object.seal() - prevent adding/deleting properties
const sealedObj = Object.seal({ name: "Sealed" });
sealedObj.name = "Changed"; // This works
sealedObj.age = 25; // This won't work
console.log("Sealed object:", sealedObj);