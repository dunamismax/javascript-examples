// 20 - Modules and Imports
// Master JavaScript module system: CommonJS, ES6 modules, and modern patterns

console.log("=== JavaScript Modules and Imports ===");

// JavaScript has evolved through different module systems:
// 1. No modules (global scope pollution)
// 2. CommonJS (Node.js)
// 3. AMD (RequireJS)
// 4. ES6 Modules (modern standard)

console.log("\n=== Module System Evolution ===");

// 1. The Problem: Global Scope Pollution (pre-modules)
console.log("1. Global Scope Issues:");
/*
// Without modules, everything was global
var userName = "Alice";
var userAge = 30;

function validateUser() {
    // Could conflict with other scripts
}

// Issues:
// - Name conflicts
// - Dependency management
// - No encapsulation
// - Hard to maintain
*/
console.log("Global variables cause naming conflicts and dependencies are unclear");

// 2. IIFE Pattern (Immediate solution)
console.log("\n2. IIFE Pattern:");

const UserModule = (function() {
    let userName = "Private Alice";
    let userAge = 30;
    
    function validateUser(name) {
        return name && name.length > 0;
    }
    
    // Public API
    return {
        getName: () => userName,
        getAge: () => userAge,
        setName: (name) => {
            if (validateUser(name)) {
                userName = name;
            }
        },
        validate: validateUser
    };
})();

console.log("IIFE Module name:", UserModule.getName());
UserModule.setName("Bob");
console.log("After update:", UserModule.getName());

// 3. CommonJS (Node.js modules)
console.log("\n3. CommonJS Pattern:");

// This is how CommonJS works (Node.js style)
// Note: This won't work in browser without bundler

/*
// math.js (CommonJS export)
function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

const PI = 3.14159;

// Export methods
module.exports = {
    add,
    multiply,
    PI
};

// Alternative single export
// module.exports = add;

// Or named exports
// exports.add = add;
// exports.multiply = multiply;
*/

/*
// main.js (CommonJS import)
const math = require('./math');
const { add, multiply } = require('./math');
const PI = require('./math').PI;

console.log(add(2, 3));
console.log(multiply(4, 5));
*/

// Simulate CommonJS for demonstration
const CommonJSExample = {
    createModule: function() {
        // Simulate module.exports
        const module = { exports: {} };
        const exports = module.exports;
        
        // Module code
        function add(a, b) {
            return a + b;
        }
        
        function multiply(a, b) {
            return a * b;
        }
        
        // Export
        module.exports = { add, multiply, PI: 3.14159 };
        
        return module.exports;
    },
    
    require: function(moduleFactory) {
        return moduleFactory();
    }
};

const mathModule = CommonJSExample.createModule();
console.log("CommonJS style add:", mathModule.add(5, 3));
console.log("CommonJS style multiply:", mathModule.multiply(4, 2));

// 4. ES6 Modules (Modern Standard)
console.log("\n4. ES6 Modules Pattern:");

// ES6 modules are the modern standard
// They work in browsers and Node.js (with .mjs or type: "module")

/*
// math.js (ES6 exports)

// Named exports
export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export const PI = 3.14159;

// Export list
// export { add, multiply, PI };

// Default export
export default function subtract(a, b) {
    return a - b;
}

// Mixed exports
// export { add, multiply };
// export default subtract;
*/

/*
// main.js (ES6 imports)

// Named imports
import { add, multiply, PI } from './math.js';

// Rename imports
import { add as addNumbers } from './math.js';

// Import all
import * as MathUtils from './math.js';

// Default import
import subtract from './math.js';

// Mixed imports
import subtract, { add, multiply } from './math.js';

// Dynamic imports
const module = await import('./math.js');
*/

// Simulate ES6 modules for demonstration
const ES6ModuleExample = {
    // Simulate a module with named and default exports
    mathModule: {
        add: function(a, b) { return a + b; },
        multiply: function(a, b) { return a * b; },
        PI: 3.14159,
        default: function subtract(a, b) { return a - b; }
    },
    
    // Simulate import behavior
    namedImport: function(module, names) {
        const imported = {};
        names.forEach(name => {
            imported[name] = module[name];
        });
        return imported;
    },
    
    defaultImport: function(module) {
        return module.default;
    },
    
    importAll: function(module) {
        return { ...module };
    }
};

const { add, multiply, PI } = ES6ModuleExample.namedImport(
    ES6ModuleExample.mathModule, 
    ['add', 'multiply', 'PI']
);
const subtract = ES6ModuleExample.defaultImport(ES6ModuleExample.mathModule);

console.log("ES6 style add:", add(10, 5));
console.log("ES6 style subtract:", subtract(10, 5));

// 5. Module Patterns and Best Practices
console.log("\n=== Module Patterns ===");

// Singleton Pattern
const ConfigManager = (function() {
    let instance;
    let config = {};
    
    function createInstance() {
        return {
            set(key, value) {
                config[key] = value;
            },
            get(key) {
                return config[key];
            },
            getAll() {
                return { ...config };
            }
        };
    }
    
    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();

config1.set('theme', 'dark');
console.log("Singleton test:", config2.get('theme')); // 'dark'
console.log("Same instance:", config1 === config2); // true

// Factory Pattern Module
const UserFactory = {
    createUser(type, data) {
        const baseUser = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            ...data
        };
        
        switch (type) {
            case 'admin':
                return {
                    ...baseUser,
                    role: 'admin',
                    permissions: ['read', 'write', 'delete']
                };
            case 'moderator':
                return {
                    ...baseUser,
                    role: 'moderator',
                    permissions: ['read', 'write']
                };
            case 'user':
            default:
                return {
                    ...baseUser,
                    role: 'user',
                    permissions: ['read']
                };
        }
    }
};

const admin = UserFactory.createUser('admin', { name: 'Alice' });
const user = UserFactory.createUser('user', { name: 'Bob' });

console.log("Factory admin:", admin);
console.log("Factory user:", user);

// Observer Pattern Module
const EventEmitter = (function() {
    const events = {};
    
    return {
        on(event, callback) {
            if (!events[event]) {
                events[event] = [];
            }
            events[event].push(callback);
        },
        
        off(event, callback) {
            if (events[event]) {
                events[event] = events[event].filter(cb => cb !== callback);
            }
        },
        
        emit(event, data) {
            if (events[event]) {
                events[event].forEach(callback => callback(data));
            }
        },
        
        once(event, callback) {
            const wrapper = (data) => {
                callback(data);
                this.off(event, wrapper);
            };
            this.on(event, wrapper);
        }
    };
})();

// Test observer pattern
EventEmitter.on('userLogin', (user) => {
    console.log('User logged in:', user.name);
});

EventEmitter.once('userLogout', (user) => {
    console.log('User logged out (once):', user.name);
});

EventEmitter.emit('userLogin', { name: 'Charlie' });
EventEmitter.emit('userLogout', { name: 'Charlie' });
EventEmitter.emit('userLogout', { name: 'Charlie' }); // Won't trigger

// 6. Module Bundlers and Build Tools
console.log("\n=== Module Bundlers ===");

console.log("Popular module bundlers:");
console.log("- Webpack: Most popular, feature-rich");
console.log("- Rollup: Tree-shaking, library focused");
console.log("- Parcel: Zero configuration");
console.log("- esbuild: Very fast");
console.log("- Vite: Modern, fast development");

// Example of how bundlers resolve dependencies
function simulateBundler() {
    const modules = {
        'utils.js': {
            exports: {
                formatDate: (date) => date.toISOString().split('T')[0],
                capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
            },
            dependencies: []
        },
        'user.js': {
            exports: {
                createUser: function(name, email) {
                    const { formatDate, capitalize } = this.require('utils.js');
                    return {
                        name: capitalize(name),
                        email: email.toLowerCase(),
                        created: formatDate(new Date())
                    };
                }
            },
            dependencies: ['utils.js']
        }
    };
    
    // Simple dependency resolver
    function resolveModule(moduleName, resolved = new Set()) {
        if (resolved.has(moduleName)) {
            return;
        }
        
        const module = modules[moduleName];
        if (!module) {
            throw new Error(`Module ${moduleName} not found`);
        }
        
        // Resolve dependencies first
        module.dependencies.forEach(dep => {
            resolveModule(dep, resolved);
        });
        
        resolved.add(moduleName);
        
        // Inject require function
        module.exports.require = (depName) => modules[depName].exports;
        
        return module.exports;
    }
    
    return resolveModule;
}

const bundler = simulateBundler();
const userModule = bundler('user.js');
const newUser = userModule.createUser('john doe', 'John.Doe@EXAMPLE.COM');
console.log("Bundled module result:", newUser);

// 7. Tree Shaking Example
console.log("\n=== Tree Shaking ===");

// Tree shaking removes unused code
const LargeLibrary = {
    // Used function
    usedFunction() {
        return "This is used";
    },
    
    // Unused function (would be removed by tree shaking)
    unusedFunction() {
        return "This is never used";
    },
    
    // Another used function
    anotherUsedFunction() {
        return "This is also used";
    }
};

// Only import what you need for tree shaking to work
const { usedFunction, anotherUsedFunction } = LargeLibrary;

console.log("Tree shaking example:");
console.log(usedFunction());
console.log(anotherUsedFunction());
// unusedFunction is not imported, so it could be tree-shaken

// 8. Dynamic Imports
console.log("\n=== Dynamic Imports ===");

// Dynamic imports for code splitting and lazy loading
async function demonstrateDynamicImports() {
    console.log("Dynamic import examples:");
    
    // Simulate dynamic import
    function dynamicImport(moduleName) {
        const modules = {
            'heavy-lib': {
                default: {
                    processData: (data) => `Processed: ${data}`,
                    heavyComputation: () => "Heavy computation result"
                }
            },
            'utils': {
                formatCurrency: (amount) => `$${amount.toFixed(2)}`,
                generateId: () => Math.random().toString(36).substr(2, 9)
            }
        };
        
        return Promise.resolve(modules[moduleName]);
    }
    
    try {
        // Load module only when needed
        console.log("Loading heavy library...");
        const heavyLib = await dynamicImport('heavy-lib');
        console.log("Heavy lib result:", heavyLib.default.processData("test data"));
        
        // Conditional loading
        const shouldLoadUtils = true;
        if (shouldLoadUtils) {
            const utils = await dynamicImport('utils');
            console.log("Utils result:", utils.formatCurrency(123.456));
        }
        
    } catch (error) {
        console.log("Dynamic import error:", error.message);
    }
}

// 9. Module Best Practices
console.log("\n=== Module Best Practices ===");

// Good module structure example
const GoodModule = (function() {
    // Private variables
    const API_URL = 'https://api.example.com';
    let cache = new Map();
    
    // Private functions
    function validateInput(data) {
        return data && typeof data === 'object';
    }
    
    function makeRequest(endpoint, options = {}) {
        // Simulate API request
        return Promise.resolve({
            data: `Mock data from ${endpoint}`,
            status: 200
        });
    }
    
    // Public API
    return {
        // Clear, descriptive names
        async fetchUser(userId) {
            if (!userId) {
                throw new Error('User ID is required');
            }
            
            // Check cache first
            if (cache.has(userId)) {
                return cache.get(userId);
            }
            
            const response = await makeRequest(`/users/${userId}`);
            cache.set(userId, response.data);
            return response.data;
        },
        
        async createUser(userData) {
            if (!validateInput(userData)) {
                throw new Error('Invalid user data');
            }
            
            return makeRequest('/users', {
                method: 'POST',
                data: userData
            });
        },
        
        clearCache() {
            cache.clear();
        },
        
        // Expose version for debugging
        version: '1.0.0'
    };
})();

console.log("Good module practices:");
console.log("- Clear public API");
console.log("- Private implementation details");
console.log("- Error handling");
console.log("- Documentation through naming");

// Test the good module
GoodModule.fetchUser(123).then(user => {
    console.log("Fetched user:", user);
});

// Run dynamic import demo
demonstrateDynamicImports();

console.log("\n=== Module System Summary ===");
console.log("1. Use ES6 modules for new projects");
console.log("2. Keep modules small and focused");
console.log("3. Export only what's needed");
console.log("4. Use dynamic imports for code splitting");
console.log("5. Consider tree shaking in your bundler");
console.log("6. Follow consistent naming conventions");