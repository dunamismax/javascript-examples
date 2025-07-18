// 21 - Classes and Object-Oriented Programming
// Master ES6+ classes, inheritance, encapsulation, and OOP principles

console.log("=== Classes and Object-Oriented Programming ===");

// 1. Basic Class Syntax
console.log("\n=== Basic Class Syntax ===");

class Person {
    // Constructor method - called when creating new instance
    constructor(name, age, email) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.createdAt = new Date();
    }
    
    // Instance methods
    greet() {
        return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
    }
    
    getInfo() {
        return {
            name: this.name,
            age: this.age,
            email: this.email,
            createdAt: this.createdAt
        };
    }
    
    updateAge(newAge) {
        if (newAge > 0 && newAge < 150) {
            this.age = newAge;
            return true;
        }
        return false;
    }
    
    // Static method - belongs to class, not instance
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static createFromString(personString) {
        const [name, age, email] = personString.split(',');
        return new Person(name.trim(), parseInt(age.trim()), email.trim());
    }
}

// Creating instances
const person1 = new Person("Alice", 30, "alice@example.com");
const person2 = new Person("Bob", 25, "bob@example.com");

console.log(person1.greet());
console.log(person2.getInfo());

// Using static methods
console.log("Valid email:", Person.validateEmail("test@example.com"));
console.log("Invalid email:", Person.validateEmail("invalid-email"));

const person3 = Person.createFromString("Charlie, 35, charlie@example.com");
console.log("Person from string:", person3.greet());

// 2. Inheritance and Super
console.log("\n=== Inheritance ===");

class Employee extends Person {
    constructor(name, age, email, jobTitle, salary) {
        // Call parent constructor
        super(name, age, email);
        this.jobTitle = jobTitle;
        this.salary = salary;
        this.department = null;
        this.startDate = new Date();
    }
    
    // Override parent method
    greet() {
        return `${super.greet()} I work as a ${this.jobTitle}.`;
    }
    
    // New methods specific to Employee
    promote(newTitle, newSalary) {
        this.jobTitle = newTitle;
        this.salary = newSalary;
        return `${this.name} promoted to ${newTitle}`;
    }
    
    assignDepartment(department) {
        this.department = department;
    }
    
    getWorkInfo() {
        return {
            ...this.getInfo(),
            jobTitle: this.jobTitle,
            salary: this.salary,
            department: this.department,
            startDate: this.startDate
        };
    }
    
    // Static method in child class
    static createIntern(name, age, email) {
        return new Employee(name, age, email, "Intern", 30000);
    }
}

const employee1 = new Employee("David", 28, "david@company.com", "Developer", 75000);
employee1.assignDepartment("Engineering");

console.log(employee1.greet());
console.log("Work info:", employee1.getWorkInfo());
console.log(employee1.promote("Senior Developer", 90000));

const intern = Employee.createIntern("Emma", 22, "emma@company.com");
console.log("Intern:", intern.greet());

// 3. Private Fields and Methods (ES2022)
console.log("\n=== Private Fields and Methods ===");

class BankAccount {
    // Private fields (prefixed with #)
    #balance = 0;
    #accountNumber;
    #pin;
    
    constructor(initialBalance, pin) {
        this.#balance = initialBalance;
        this.#accountNumber = this.#generateAccountNumber();
        this.#pin = pin;
        this.owner = null;
    }
    
    // Private method
    #generateAccountNumber() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    #validatePin(pin) {
        return this.#pin === pin;
    }
    
    // Public methods
    deposit(amount, pin) {
        if (!this.#validatePin(pin)) {
            throw new Error("Invalid PIN");
        }
        
        if (amount > 0) {
            this.#balance += amount;
            return this.#balance;
        }
        throw new Error("Amount must be positive");
    }
    
    withdraw(amount, pin) {
        if (!this.#validatePin(pin)) {
            throw new Error("Invalid PIN");
        }
        
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            return this.#balance;
        }
        throw new Error("Insufficient funds or invalid amount");
    }
    
    getBalance(pin) {
        if (!this.#validatePin(pin)) {
            throw new Error("Invalid PIN");
        }
        return this.#balance;
    }
    
    getAccountNumber() {
        return this.#accountNumber;
    }
    
    changePin(oldPin, newPin) {
        if (!this.#validatePin(oldPin)) {
            throw new Error("Invalid current PIN");
        }
        this.#pin = newPin;
        return "PIN changed successfully";
    }
}

const account = new BankAccount(1000, "1234");
account.owner = "Alice Smith";

console.log("Account number:", account.getAccountNumber());
console.log("Initial balance:", account.getBalance("1234"));
console.log("After deposit:", account.deposit(500, "1234"));
console.log("After withdrawal:", account.withdraw(200, "1234"));

try {
    account.getBalance("wrong-pin");
} catch (error) {
    console.log("Security error:", error.message);
}

// console.log(account.#balance); // Error: Private field '#balance' must be declared in an enclosing class

// 4. Getters and Setters
console.log("\n=== Getters and Setters ===");

class Temperature {
    constructor(celsius = 0) {
        this._celsius = celsius;
    }
    
    // Getter
    get celsius() {
        return this._celsius;
    }
    
    // Setter
    set celsius(value) {
        if (typeof value !== 'number') {
            throw new Error("Temperature must be a number");
        }
        if (value < -273.15) {
            throw new Error("Temperature cannot be below absolute zero");
        }
        this._celsius = value;
    }
    
    get fahrenheit() {
        return (this._celsius * 9/5) + 32;
    }
    
    set fahrenheit(value) {
        this.celsius = (value - 32) * 5/9;
    }
    
    get kelvin() {
        return this._celsius + 273.15;
    }
    
    set kelvin(value) {
        this.celsius = value - 273.15;
    }
    
    toString() {
        return `${this._celsius}°C (${this.fahrenheit.toFixed(1)}°F, ${this.kelvin.toFixed(1)}K)`;
    }
}

const temp = new Temperature(25);
console.log("Temperature:", temp.toString());

temp.fahrenheit = 100;
console.log("Set to 100°F:", temp.toString());

temp.kelvin = 300;
console.log("Set to 300K:", temp.toString());

// 5. Abstract Classes and Interfaces (Patterns)
console.log("\n=== Abstract Classes Pattern ===");

// JavaScript doesn't have true abstract classes, but we can simulate them
class AbstractShape {
    constructor(name) {
        if (this.constructor === AbstractShape) {
            throw new Error("Abstract class cannot be instantiated");
        }
        this.name = name;
    }
    
    // Abstract method - must be implemented by subclasses
    area() {
        throw new Error("area() method must be implemented");
    }
    
    perimeter() {
        throw new Error("perimeter() method must be implemented");
    }
    
    // Concrete method
    describe() {
        return `${this.name} with area ${this.area()} and perimeter ${this.perimeter()}`;
    }
}

class Rectangle extends AbstractShape {
    constructor(width, height) {
        super("Rectangle");
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
    
    perimeter() {
        return 2 * (this.width + this.height);
    }
}

class Circle extends AbstractShape {
    constructor(radius) {
        super("Circle");
        this.radius = radius;
    }
    
    area() {
        return Math.PI * this.radius ** 2;
    }
    
    perimeter() {
        return 2 * Math.PI * this.radius;
    }
}

const rectangle = new Rectangle(5, 3);
const circle = new Circle(4);

console.log(rectangle.describe());
console.log(circle.describe());

// try {
//     const abstract = new AbstractShape("test"); // Would throw error
// } catch (error) {
//     console.log("Abstract error:", error.message);
// }

// 6. Mixins and Composition
console.log("\n=== Mixins ===");

// Mixin for flying capability
const CanFly = {
    fly() {
        return `${this.name} is flying at ${this.altitude || 1000} feet`;
    },
    
    setAltitude(altitude) {
        this.altitude = altitude;
    }
};

// Mixin for swimming capability
const CanSwim = {
    swim() {
        return `${this.name} is swimming at ${this.depth || 5} feet depth`;
    },
    
    setDepth(depth) {
        this.depth = depth;
    }
};

// Mixin for making sounds
const CanMakeSound = {
    makeSound(sound) {
        return `${this.name} makes a ${sound || 'sound'}`;
    }
};

class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    introduce() {
        return `I'm ${this.name}, a ${this.species}`;
    }
}

class Bird extends Animal {
    constructor(name) {
        super(name, "Bird");
    }
}

class Fish extends Animal {
    constructor(name) {
        super(name, "Fish");
    }
}

class Duck extends Animal {
    constructor(name) {
        super(name, "Duck");
    }
}

// Apply mixins
Object.assign(Bird.prototype, CanFly, CanMakeSound);
Object.assign(Fish.prototype, CanSwim);
Object.assign(Duck.prototype, CanFly, CanSwim, CanMakeSound);

const eagle = new Bird("Eagle");
const salmon = new Fish("Salmon");
const mallard = new Duck("Mallard");

console.log(eagle.introduce());
console.log(eagle.fly());
console.log(eagle.makeSound("screech"));

console.log(salmon.introduce());
console.log(salmon.swim());

console.log(mallard.introduce());
console.log(mallard.fly());
console.log(mallard.swim());
console.log(mallard.makeSound("quack"));

// 7. Design Patterns with Classes
console.log("\n=== Design Patterns ===");

// Singleton Pattern
class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        this.host = "localhost";
        this.port = 5432;
        this.connected = false;
        
        DatabaseConnection.instance = this;
    }
    
    connect() {
        if (!this.connected) {
            console.log(`Connecting to ${this.host}:${this.port}`);
            this.connected = true;
        }
        return this.connected;
    }
    
    disconnect() {
        this.connected = false;
        console.log("Disconnected from database");
    }
    
    query(sql) {
        if (!this.connected) {
            throw new Error("Not connected to database");
        }
        return `Executing: ${sql}`;
    }
}

const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

console.log("Same instance:", db1 === db2); // true
db1.connect();
console.log("DB2 connected:", db2.connected); // true

// Factory Pattern
class VehicleFactory {
    static createVehicle(type, options = {}) {
        switch (type.toLowerCase()) {
            case 'car':
                return new Car(options);
            case 'bike':
                return new Bike(options);
            case 'truck':
                return new Truck(options);
            default:
                throw new Error(`Unknown vehicle type: ${type}`);
        }
    }
}

class Vehicle {
    constructor(options) {
        this.make = options.make || "Unknown";
        this.model = options.model || "Unknown";
        this.year = options.year || new Date().getFullYear();
    }
    
    start() {
        return `${this.make} ${this.model} is starting`;
    }
}

class Car extends Vehicle {
    constructor(options) {
        super(options);
        this.doors = options.doors || 4;
        this.type = "Car";
    }
    
    honk() {
        return "Beep beep!";
    }
}

class Bike extends Vehicle {
    constructor(options) {
        super(options);
        this.wheels = 2;
        this.type = "Bike";
    }
    
    ringBell() {
        return "Ring ring!";
    }
}

class Truck extends Vehicle {
    constructor(options) {
        super(options);
        this.capacity = options.capacity || 1000;
        this.type = "Truck";
    }
    
    loadCargo() {
        return `Loading cargo up to ${this.capacity} lbs`;
    }
}

const car = VehicleFactory.createVehicle('car', { make: 'Toyota', model: 'Camry' });
const bike = VehicleFactory.createVehicle('bike', { make: 'Trek', model: 'X-1' });

console.log("Factory car:", car.start());
console.log("Factory bike:", bike.start());

// Observer Pattern
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(
            listener => listener !== listenerToRemove
        );
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(listener => listener(data));
    }
}

class NewsPublisher extends EventEmitter {
    constructor() {
        super();
        this.news = [];
    }
    
    publishNews(article) {
        this.news.push(article);
        this.emit('news', article);
    }
}

class NewsSubscriber {
    constructor(name) {
        this.name = name;
    }
    
    notify(article) {
        console.log(`${this.name} received news: ${article.title}`);
    }
}

const publisher = new NewsPublisher();
const subscriber1 = new NewsSubscriber("Alice");
const subscriber2 = new NewsSubscriber("Bob");

publisher.on('news', (article) => subscriber1.notify(article));
publisher.on('news', (article) => subscriber2.notify(article));

publisher.publishNews({
    title: "JavaScript Classes are Awesome",
    content: "Learn about ES6+ class features..."
});

console.log("\n=== OOP Principles Summary ===");
console.log("1. Encapsulation: Private fields and methods");
console.log("2. Inheritance: Extending classes with super()");
console.log("3. Polymorphism: Method overriding and interfaces");
console.log("4. Abstraction: Abstract classes and design patterns");