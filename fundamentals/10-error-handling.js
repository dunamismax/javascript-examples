// 10 - Error Handling
// Learn how to handle errors gracefully in JavaScript

// Basic try-catch block
try {
    // Code that might throw an error
    const result = 10 / 0; // This is Infinity, not an error
    console.log("Result:", result);
    
    // This will throw an error
    const undefinedFunction = nonExistentFunction();
} catch (error) {
    console.log("Caught an error:", error.message);
    console.log("Error type:", error.name);
}

console.log("Program continues after error handling");

// Try-catch-finally
try {
    console.log("In try block");
    throw new Error("Intentional error");
} catch (error) {
    console.log("In catch block:", error.message);
} finally {
    console.log("In finally block - always executes");
}

// Different types of errors
console.log("=== Error Types ===");

// ReferenceError - using undefined variable
try {
    console.log(undefinedVariable);
} catch (error) {
    console.log("ReferenceError:", error.message);
}

// TypeError - wrong type operation
try {
    const num = 42;
    num.toUpperCase(); // Numbers don't have toUpperCase method
} catch (error) {
    console.log("TypeError:", error.message);
}

// SyntaxError - cannot be caught in same script
// try {
//     eval("const x = ;"); // Invalid syntax
// } catch (error) {
//     console.log("SyntaxError:", error.message);
// }

// RangeError - number out of range
try {
    const arr = new Array(-1); // Negative array length
} catch (error) {
    console.log("RangeError:", error.message);
}

// Custom errors
class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "CustomError";
        this.code = code;
    }
}

function divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError("Arguments must be numbers");
    }
    if (b === 0) {
        throw new CustomError("Division by zero is not allowed", "DIV_BY_ZERO");
    }
    return a / b;
}

// Using custom error handling
try {
    console.log(divide(10, 2)); // Works fine
    console.log(divide(10, 0)); // Throws CustomError
} catch (error) {
    if (error instanceof CustomError) {
        console.log(`Custom error [${error.code}]: ${error.message}`);
    } else if (error instanceof TypeError) {
        console.log("Type error:", error.message);
    } else {
        console.log("Unknown error:", error.message);
    }
}

// Error handling with JSON parsing
function safeJsonParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.log("Invalid JSON:", error.message);
        return defaultValue;
    }
}

console.log("=== JSON Parsing ===");
console.log(safeJsonParse('{"name": "Alice"}'));  // Works
console.log(safeJsonParse('{invalid json}'));     // Returns null
console.log(safeJsonParse('{invalid}', {}));      // Returns empty object

// Error handling with async/await
async function fetchData(url) {
    try {
        // Simulating an API call
        if (!url) {
            throw new Error("URL is required");
        }
        
        if (url === "invalid") {
            throw new Error("Invalid URL");
        }
        
        // Simulate successful response
        return { data: "Sample data", status: "success" };
    } catch (error) {
        console.log("Fetch error:", error.message);
        throw error; // Re-throw to let caller handle it
    }
}

async function handleAsyncErrors() {
    try {
        const data1 = await fetchData("https://api.example.com");
        console.log("Success:", data1);
        
        const data2 = await fetchData("invalid");
        console.log("This won't execute");
    } catch (error) {
        console.log("Async error handled:", error.message);
    }
}

handleAsyncErrors();

// Error boundaries pattern (conceptual - more relevant for React)
function executeWithErrorBoundary(operation, fallback) {
    try {
        return operation();
    } catch (error) {
        console.log("Error boundary caught:", error.message);
        return fallback;
    }
}

const result = executeWithErrorBoundary(
    () => {
        const obj = null;
        return obj.property; // Will throw TypeError
    },
    "Default value"
);

console.log("Fallback result:", result);

// Validation with error throwing
function validateUser(user) {
    const errors = [];
    
    if (!user.name || user.name.length < 2) {
        errors.push("Name must be at least 2 characters");
    }
    
    if (!user.email || !user.email.includes("@")) {
        errors.push("Valid email is required");
    }
    
    if (!user.age || user.age < 0 || user.age > 150) {
        errors.push("Age must be between 0 and 150");
    }
    
    if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
    
    return true;
}

// Testing validation
const users = [
    { name: "Alice", email: "alice@example.com", age: 25 },
    { name: "B", email: "invalid-email", age: -5 },
    { name: "Charlie", email: "charlie@example.com", age: 30 }
];

users.forEach((user, index) => {
    try {
        validateUser(user);
        console.log(`User ${index + 1} is valid`);
    } catch (error) {
        console.log(`User ${index + 1} validation error: ${error.message}`);
    }
});

// Global error handling (in browsers)
// window.addEventListener('error', (event) => {
//     console.log('Global error:', event.error);
// });

// Unhandled promise rejection handling
// window.addEventListener('unhandledrejection', (event) => {
//     console.log('Unhandled promise rejection:', event.reason);
//     event.preventDefault(); // Prevent default browser behavior
// });

// Error logging utility
class ErrorLogger {
    static log(error, context = {}) {
        const errorInfo = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            context: context
        };
        
        console.log("Error logged:", JSON.stringify(errorInfo, null, 2));
        
        // In real applications, you might send this to a logging service
        // fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorInfo) });
    }
}

// Using error logger
try {
    throw new Error("Something went wrong");
} catch (error) {
    ErrorLogger.log(error, { 
        userId: 123, 
        action: "processing payment",
        additional: "User had insufficient funds"
    });
}

// Retrying operations with error handling
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries}`);
            return await operation();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt < maxRetries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Example of retry mechanism
async function unreliableOperation() {
    const random = Math.random();
    if (random < 0.7) { // 70% chance of failure
        throw new Error("Random failure occurred");
    }
    return "Operation succeeded!";
}

// Test retry mechanism
retryOperation(unreliableOperation, 5, 500)
    .then(result => console.log("Final result:", result))
    .catch(error => console.log("Final error:", error.message));