// 23 - JSON and Data Manipulation
// Master JSON parsing, stringifying, and advanced data manipulation techniques

console.log("=== JSON and Data Manipulation ===");

// 1. JSON Basics
console.log("\n=== JSON Fundamentals ===");

// JSON (JavaScript Object Notation) is a lightweight data format
// Supports: strings, numbers, booleans, null, objects, arrays

const sampleData = {
    name: "Alice Johnson",
    age: 30,
    isActive: true,
    skills: ["JavaScript", "Python", "React"],
    address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
    },
    projects: [
        { name: "Website", status: "completed", year: 2023 },
        { name: "Mobile App", status: "in-progress", year: 2024 }
    ],
    metadata: null
};

// JSON.stringify() - convert to JSON string
const jsonString = JSON.stringify(sampleData);
console.log("JSON string:", jsonString);

// Pretty printing with indentation
const prettyJson = JSON.stringify(sampleData, null, 2);
console.log("Pretty JSON:");
console.log(prettyJson);

// JSON.parse() - convert from JSON string
const parsedData = JSON.parse(jsonString);
console.log("Parsed data:", parsedData);
console.log("Are objects equal?", sampleData === parsedData); // false - different objects

// 2. JSON.stringify() Advanced Options
console.log("\n=== JSON.stringify Advanced ===");

const complexData = {
    id: 1,
    password: "secret123",
    createdAt: new Date(),
    updateFunction: function() { return "updated"; },
    undefinedValue: undefined,
    symbolKey: Symbol("key"),
    regexp: /test/g,
    infinity: Infinity,
    nan: NaN
};

// Basic stringify - some values are omitted/converted
console.log("Basic stringify:", JSON.stringify(complexData));

// Using replacer function
function replacer(key, value) {
    // Hide password fields
    if (key === 'password') {
        return '***hidden***';
    }
    
    // Convert dates to ISO strings
    if (value instanceof Date) {
        return value.toISOString();
    }
    
    // Convert functions to string representation
    if (typeof value === 'function') {
        return value.toString();
    }
    
    // Handle special numbers
    if (value === Infinity) return 'Infinity';
    if (Number.isNaN(value)) return 'NaN';
    
    return value;
}

const customStringified = JSON.stringify(complexData, replacer, 2);
console.log("Custom stringify:");
console.log(customStringified);

// Using replacer array (whitelist properties)
const publicData = JSON.stringify(complexData, ['id', 'createdAt'], 2);
console.log("Public data only:");
console.log(publicData);

// 3. JSON.parse() Advanced Options
console.log("\n=== JSON.parse Advanced ===");

const jsonWithDates = `{
    "name": "Event",
    "startDate": "2024-01-15T10:00:00.000Z",
    "endDate": "2024-01-15T18:00:00.000Z",
    "price": "29.99",
    "isActive": "true"
}`;

// Using reviver function
function reviver(key, value) {
    // Convert date strings to Date objects
    if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
    }
    
    // Convert string numbers to numbers
    if (key === 'price' && typeof value === 'string') {
        return parseFloat(value);
    }
    
    // Convert string booleans to booleans
    if (key === 'isActive' && typeof value === 'string') {
        return value === 'true';
    }
    
    return value;
}

const revivedData = JSON.parse(jsonWithDates, reviver);
console.log("Revived data:", revivedData);
console.log("Start date is Date object:", revivedData.startDate instanceof Date);
console.log("Price is number:", typeof revivedData.price);

// 4. Deep Cloning with JSON
console.log("\n=== Deep Cloning ===");

const originalObject = {
    name: "Original",
    nested: {
        value: 42,
        array: [1, 2, 3]
    }
};

// Simple deep clone (limitations: no functions, dates become strings, etc.)
const simpleClone = JSON.parse(JSON.stringify(originalObject));
simpleClone.nested.value = 99;

console.log("Original:", originalObject.nested.value); // 42
console.log("Clone:", simpleClone.nested.value); // 99

// Better deep clone function
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    
    return obj;
}

const complexObject = {
    date: new Date(),
    regex: /test/g,
    array: [1, { nested: true }],
    func: function() { return "test"; }
};

const betterClone = deepClone(complexObject);
console.log("Better clone preserves dates:", betterClone.date instanceof Date);
console.log("Better clone preserves regex:", betterClone.regex instanceof RegExp);

// 5. JSON Validation and Error Handling
console.log("\n=== JSON Validation ===");

function safeJSONParse(jsonString, defaultValue = null) {
    try {
        const parsed = JSON.parse(jsonString);
        return { success: true, data: parsed, error: null };
    } catch (error) {
        return { success: false, data: defaultValue, error: error.message };
    }
}

function safeJSONStringify(obj, defaultValue = '{}') {
    try {
        return { success: true, data: JSON.stringify(obj), error: null };
    } catch (error) {
        return { success: false, data: defaultValue, error: error.message };
    }
}

// Test with various inputs
const testInputs = [
    '{"valid": "json"}',
    '{invalid json}',
    'null',
    'undefined',
    '"string"',
    '123',
    'true'
];

console.log("JSON parsing tests:");
testInputs.forEach(input => {
    const result = safeJSONParse(input);
    console.log(`Input: ${input} -> Success: ${result.success}, Data: ${result.data}`);
});

// Circular reference handling
const circularObj = { name: "circular" };
circularObj.self = circularObj;

const circularResult = safeJSONStringify(circularObj);
console.log("Circular object stringify:", circularResult);

// 6. Data Transformation Utilities
console.log("\n=== Data Transformation ===");

class DataTransformer {
    // Convert object keys to camelCase
    static toCamelCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.toCamelCase(item));
        }
        
        if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
            const newObj = {};
            for (const key in obj) {
                const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                newObj[camelKey] = this.toCamelCase(obj[key]);
            }
            return newObj;
        }
        
        return obj;
    }
    
    // Convert object keys to snake_case
    static toSnakeCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.toSnakeCase(item));
        }
        
        if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
            const newObj = {};
            for (const key in obj) {
                const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                newObj[snakeKey] = this.toSnakeCase(obj[key]);
            }
            return newObj;
        }
        
        return obj;
    }
    
    // Remove null/undefined values
    static removeEmpty(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.removeEmpty(item)).filter(item => item != null);
        }
        
        if (obj !== null && typeof obj === 'object') {
            const newObj = {};
            for (const key in obj) {
                const value = this.removeEmpty(obj[key]);
                if (value != null && value !== '') {
                    newObj[key] = value;
                }
            }
            return newObj;
        }
        
        return obj;
    }
    
    // Flatten nested object
    static flatten(obj, prefix = '') {
        const flattened = {};
        
        for (const key in obj) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            
            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(flattened, this.flatten(obj[key], newKey));
            } else {
                flattened[newKey] = obj[key];
            }
        }
        
        return flattened;
    }
    
    // Unflatten object
    static unflatten(obj) {
        const result = {};
        
        for (const key in obj) {
            const keys = key.split('.');
            let current = result;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!(keys[i] in current)) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = obj[key];
        }
        
        return result;
    }
}

// Test data transformations
const testData = {
    user_name: "Alice",
    user_email: "alice@example.com",
    user_profile: {
        first_name: "Alice",
        last_name: "Johnson",
        contact_info: {
            phone_number: "123-456-7890"
        }
    },
    empty_field: null,
    undefined_field: undefined,
    empty_string: ""
};

console.log("Original data:", testData);

const camelCased = DataTransformer.toCamelCase(testData);
console.log("CamelCase:", camelCased);

const snakeCased = DataTransformer.toSnakeCase(camelCased);
console.log("SnakeCase:", snakeCased);

const cleaned = DataTransformer.removeEmpty(testData);
console.log("Cleaned:", cleaned);

const flattened = DataTransformer.flatten(testData);
console.log("Flattened:", flattened);

const unflattened = DataTransformer.unflatten(flattened);
console.log("Unflattened:", unflattened);

// 7. Working with Large JSON Data
console.log("\n=== Large Data Handling ===");

// Generate large dataset
function generateLargeDataset(size) {
    const data = [];
    for (let i = 0; i < size; i++) {
        data.push({
            id: i,
            name: `User ${i}`,
            email: `user${i}@example.com`,
            active: Math.random() > 0.5,
            score: Math.floor(Math.random() * 100),
            tags: [`tag${i % 10}`, `category${i % 5}`]
        });
    }
    return data;
}

const largeData = generateLargeDataset(1000);

// Streaming JSON processing simulation
class JSONProcessor {
    static processInChunks(data, chunkSize = 100, processor) {
        const results = [];
        
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            const processed = processor(chunk);
            results.push(...processed);
        }
        
        return results;
    }
    
    static filter(data, predicate) {
        return this.processInChunks(data, 100, chunk => 
            chunk.filter(predicate)
        );
    }
    
    static map(data, transformer) {
        return this.processInChunks(data, 100, chunk => 
            chunk.map(transformer)
        );
    }
    
    static reduce(data, reducer, initialValue) {
        let accumulator = initialValue;
        
        this.processInChunks(data, 100, chunk => {
            accumulator = chunk.reduce(reducer, accumulator);
            return [];
        });
        
        return accumulator;
    }
}

// Process large data
const activeUsers = JSONProcessor.filter(largeData, user => user.active);
console.log(`Found ${activeUsers.length} active users out of ${largeData.length}`);

const userNames = JSONProcessor.map(largeData, user => user.name);
console.log("First 5 names:", userNames.slice(0, 5));

const averageScore = JSONProcessor.reduce(
    largeData, 
    (sum, user) => sum + user.score, 
    0
) / largeData.length;
console.log("Average score:", averageScore.toFixed(2));

// 8. JSON Schema Validation
console.log("\n=== JSON Schema Validation ===");

// Simple schema validator
class SchemaValidator {
    static validate(data, schema) {
        const errors = [];
        
        function validateValue(value, schemaRule, path = '') {
            if (schemaRule.required && (value === undefined || value === null)) {
                errors.push(`${path} is required`);
                return;
            }
            
            if (value === undefined || value === null) {
                return; // Optional field
            }
            
            if (schemaRule.type && typeof value !== schemaRule.type) {
                errors.push(`${path} must be of type ${schemaRule.type}`);
                return;
            }
            
            if (schemaRule.minLength && value.length < schemaRule.minLength) {
                errors.push(`${path} must be at least ${schemaRule.minLength} characters`);
            }
            
            if (schemaRule.maxLength && value.length > schemaRule.maxLength) {
                errors.push(`${path} must be at most ${schemaRule.maxLength} characters`);
            }
            
            if (schemaRule.pattern && !schemaRule.pattern.test(value)) {
                errors.push(`${path} does not match required pattern`);
            }
            
            if (schemaRule.enum && !schemaRule.enum.includes(value)) {
                errors.push(`${path} must be one of: ${schemaRule.enum.join(', ')}`);
            }
            
            if (schemaRule.properties) {
                for (const prop in schemaRule.properties) {
                    validateValue(
                        value[prop], 
                        schemaRule.properties[prop], 
                        path ? `${path}.${prop}` : prop
                    );
                }
            }
        }
        
        validateValue(data, schema);
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Define schema
const userSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            required: true,
            minLength: 2,
            maxLength: 50
        },
        email: {
            type: 'string',
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        age: {
            type: 'number',
            required: false
        },
        role: {
            type: 'string',
            enum: ['admin', 'user', 'moderator']
        }
    }
};

// Test validation
const validUser = {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    role: "user"
};

const invalidUser = {
    name: "A", // Too short
    email: "invalid-email", // Invalid format
    role: "invalid" // Not in enum
};

console.log("Valid user validation:", SchemaValidator.validate(validUser, userSchema));
console.log("Invalid user validation:", SchemaValidator.validate(invalidUser, userSchema));

// 9. JSON Data Persistence
console.log("\n=== Data Persistence Simulation ===");

// Simulate localStorage for data persistence
class DataStore {
    constructor() {
        this.storage = new Map();
    }
    
    save(key, data) {
        try {
            const jsonString = JSON.stringify(data);
            this.storage.set(key, jsonString);
            return true;
        } catch (error) {
            console.error('Save error:', error.message);
            return false;
        }
    }
    
    load(key, defaultValue = null) {
        try {
            const jsonString = this.storage.get(key);
            return jsonString ? JSON.parse(jsonString) : defaultValue;
        } catch (error) {
            console.error('Load error:', error.message);
            return defaultValue;
        }
    }
    
    remove(key) {
        return this.storage.delete(key);
    }
    
    clear() {
        this.storage.clear();
    }
    
    keys() {
        return Array.from(this.storage.keys());
    }
    
    export() {
        const data = {};
        for (const [key, value] of this.storage) {
            data[key] = JSON.parse(value);
        }
        return data;
    }
    
    import(data) {
        for (const [key, value] of Object.entries(data)) {
            this.save(key, value);
        }
    }
}

// Test data store
const store = new DataStore();

store.save('user-preferences', {
    theme: 'dark',
    language: 'en',
    notifications: true
});

store.save('recent-searches', ['javascript', 'json', 'data']);

console.log("Loaded preferences:", store.load('user-preferences'));
console.log("Loaded searches:", store.load('recent-searches'));
console.log("All keys:", store.keys());

const exportedData = store.export();
console.log("Exported data:", exportedData);

console.log("\n=== JSON Best Practices ===");
console.log("1. Always handle JSON.parse() errors with try-catch");
console.log("2. Be aware of JSON limitations (no functions, dates, etc.)");
console.log("3. Use replacer/reviver functions for custom serialization");
console.log("4. Validate JSON structure before processing");
console.log("5. Consider performance with large JSON data");
console.log("6. Use consistent naming conventions");
console.log("7. Implement proper error handling and fallbacks");