// 11 - Scope and Closures
// Understand how JavaScript handles variable scope and closures

// Global scope - accessible everywhere
const globalVariable = "I'm global!";

function demonstrateGlobalScope() {
    console.log("Inside function:", globalVariable); // Can access global variable
}

demonstrateGlobalScope();
console.log("Outside function:", globalVariable);

// Function scope - variables declared inside functions
function functionScopeExample() {
    const functionVariable = "I'm inside the function";
    var anotherFunctionVar = "Me too!";
    
    console.log("Inside function:", functionVariable);
    
    // Nested function has access to parent scope
    function innerFunction() {
        console.log("Inner function accessing:", functionVariable);
    }
    
    innerFunction();
}

functionScopeExample();
// console.log(functionVariable); // Error: functionVariable is not defined

// Block scope with let and const
function blockScopeExample() {
    console.log("=== Block Scope ===");
    
    if (true) {
        let blockScoped = "I'm block scoped with let";
        const alsoBlockScoped = "I'm block scoped with const";
        var functionScoped = "I'm function scoped with var";
        
        console.log("Inside block:", blockScoped);
    }
    
    // console.log(blockScoped); // Error: blockScoped is not defined
    console.log("Outside block:", functionScoped); // This works - var is function scoped
}

blockScopeExample();

// Variable hoisting
function hoistingExample() {
    console.log("=== Hoisting ===");
    
    console.log("Before declaration:", typeof hoistedVar); // undefined (not error)
    // console.log("Before declaration:", hoistedLet); // Error: Cannot access before initialization
    
    var hoistedVar = "I'm hoisted";
    let hoistedLet = "I'm not hoisted the same way";
    
    console.log("After declaration:", hoistedVar);
    console.log("After declaration:", hoistedLet);
}

hoistingExample();

// Closures - functions that remember their outer scope
function createCounter() {
    let count = 0; // Private variable
    
    return function() {
        count++; // Access to outer scope variable
        return count;
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log("=== Closures ===");
console.log("Counter 1:", counter1()); // 1
console.log("Counter 1:", counter1()); // 2
console.log("Counter 2:", counter2()); // 1 (separate closure)
console.log("Counter 1:", counter1()); // 3

// Closure with multiple functions
function createBankAccount(initialBalance) {
    let balance = initialBalance;
    
    return {
        deposit: function(amount) {
            if (amount > 0) {
                balance += amount;
                return balance;
            }
        },
        withdraw: function(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                return balance;
            }
            return "Insufficient funds";
        },
        getBalance: function() {
            return balance;
        }
    };
}

const account = createBankAccount(100);
console.log("=== Bank Account Closure ===");
console.log("Initial balance:", account.getBalance()); // 100
console.log("After deposit 50:", account.deposit(50)); // 150
console.log("After withdraw 30:", account.withdraw(30)); // 120
console.log("Current balance:", account.getBalance()); // 120

// Module pattern using closures
const Calculator = (function() {
    let result = 0; // Private variable
    
    return {
        add: function(num) {
            result += num;
            return this;
        },
        subtract: function(num) {
            result -= num;
            return this;
        },
        multiply: function(num) {
            result *= num;
            return this;
        },
        divide: function(num) {
            if (num !== 0) {
                result /= num;
            }
            return this;
        },
        getResult: function() {
            return result;
        },
        reset: function() {
            result = 0;
            return this;
        }
    };
})();

console.log("=== Module Pattern ===");
const calcResult = Calculator
    .add(10)
    .multiply(3)
    .subtract(5)
    .getResult();

console.log("Calculation result:", calcResult); // 25

// Common closure pitfall with loops
console.log("=== Closure Pitfall ===");

// Wrong way - all functions will log 3
console.log("Wrong way:");
const functions = [];
for (var i = 0; i < 3; i++) {
    functions.push(function() {
        console.log("Value:", i); // All will log 3
    });
}

functions.forEach(fn => fn());

// Correct way 1 - use let instead of var
console.log("Correct way 1 (let):");
const correctFunctions1 = [];
for (let i = 0; i < 3; i++) {
    correctFunctions1.push(function() {
        console.log("Value:", i); // Will log 0, 1, 2
    });
}

correctFunctions1.forEach(fn => fn());

// Correct way 2 - use IIFE (Immediately Invoked Function Expression)
console.log("Correct way 2 (IIFE):");
const correctFunctions2 = [];
for (var i = 0; i < 3; i++) {
    correctFunctions2.push((function(index) {
        return function() {
            console.log("Value:", index);
        };
    })(i));
}

correctFunctions2.forEach(fn => fn());

// Practical closure examples
function createValidator(rules) {
    return function(value) {
        for (const rule of rules) {
            if (!rule.test(value)) {
                return { isValid: false, message: rule.message };
            }
        }
        return { isValid: true };
    };
}

const emailValidator = createValidator([
    {
        test: value => value && value.length > 0,
        message: "Email is required"
    },
    {
        test: value => value.includes("@"),
        message: "Email must contain @"
    },
    {
        test: value => value.includes("."),
        message: "Email must contain a domain"
    }
]);

console.log("=== Validator Closure ===");
console.log("Valid email:", emailValidator("user@example.com"));
console.log("Invalid email:", emailValidator("invalid-email"));

// Closure for memoization (caching function results)
function memoize(fn) {
    const cache = {};
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (key in cache) {
            console.log("Cache hit for:", args);
            return cache[key];
        }
        
        console.log("Computing for:", args);
        const result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// Expensive function to memoize
function fibonacci(n) {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFibonacci = memoize(fibonacci);

console.log("=== Memoization ===");
console.log("First call:", memoizedFibonacci(10));
console.log("Second call:", memoizedFibonacci(10)); // Should use cache

// Closure for creating specialized functions
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenTimes = createMultiplier(10);

console.log("=== Specialized Functions ===");
console.log("Double 5:", double(5));    // 10
console.log("Triple 5:", triple(5));    // 15
console.log("Ten times 5:", tenTimes(5)); // 50