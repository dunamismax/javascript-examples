// 18 - Local Storage and Web Storage APIs
// Learn browser storage options: localStorage, sessionStorage, and cookies

console.log("=== Web Storage APIs ===");

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

if (!isBrowser) {
    console.log("Running in Node.js - simulating browser storage for demonstration");
}

// Simulate storage for Node.js environment
class StorageSimulator {
    constructor() {
        this.data = new Map();
    }
    
    setItem(key, value) {
        this.data.set(key, String(value));
        console.log(`Simulated storage: ${key} = ${value}`);
    }
    
    getItem(key) {
        const value = this.data.get(key) || null;
        console.log(`Simulated storage: getting ${key} = ${value}`);
        return value;
    }
    
    removeItem(key) {
        this.data.delete(key);
        console.log(`Simulated storage: removed ${key}`);
    }
    
    clear() {
        this.data.clear();
        console.log("Simulated storage: cleared all items");
    }
    
    key(index) {
        const keys = Array.from(this.data.keys());
        return keys[index] || null;
    }
    
    get length() {
        return this.data.size;
    }
}

// Use real storage in browser, simulated in Node.js
const localStorage = isBrowser ? window.localStorage : new StorageSimulator();
const sessionStorage = isBrowser ? window.sessionStorage : new StorageSimulator();

// Basic localStorage operations
console.log("\n=== localStorage Basics ===");

function localStorageBasics() {
    // Set item
    localStorage.setItem('username', 'alice');
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('lastLogin', new Date().toISOString());
    
    // Get item
    const username = localStorage.getItem('username');
    const theme = localStorage.getItem('theme');
    const nonExistent = localStorage.getItem('nonExistent'); // returns null
    
    console.log("Retrieved values:");
    console.log("Username:", username);
    console.log("Theme:", theme);
    console.log("Non-existent:", nonExistent);
    
    // Remove item
    localStorage.removeItem('theme');
    console.log("Theme after removal:", localStorage.getItem('theme'));
    
    // Check length
    console.log("Storage length:", localStorage.length);
    
    // Iterate through keys
    console.log("All keys:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${i}: ${key} = ${value}`);
    }
}

// Working with objects and arrays
console.log("\n=== Storing Complex Data ===");

function complexDataStorage() {
    // Objects must be stringified
    const user = {
        id: 123,
        name: "Bob Smith",
        email: "bob@example.com",
        preferences: {
            theme: "light",
            notifications: true,
            language: "en"
        },
        tags: ["developer", "javascript", "frontend"]
    };
    
    // Store object
    localStorage.setItem('user', JSON.stringify(user));
    
    // Retrieve and parse object
    const retrievedUser = JSON.parse(localStorage.getItem('user'));
    console.log("Retrieved user:", retrievedUser);
    
    // Store array
    const recentSearches = ["javascript", "react", "vue", "angular"];
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    
    // Retrieve array
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    console.log("Recent searches:", searches);
    
    // Handle parsing errors
    localStorage.setItem('invalidJSON', 'invalid{json}');
    try {
        const parsed = JSON.parse(localStorage.getItem('invalidJSON'));
        console.log("Parsed:", parsed);
    } catch (error) {
        console.log("JSON parsing error:", error.message);
    }
}

// Storage wrapper class for better API
class LocalStorageWrapper {
    static set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('LocalStorage set error:', error);
            return false;
        }
    }
    
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return defaultValue;
        }
    }
    
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('LocalStorage remove error:', error);
            return false;
        }
    }
    
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('LocalStorage clear error:', error);
            return false;
        }
    }
    
    static has(key) {
        return localStorage.getItem(key) !== null;
    }
    
    static keys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        return keys;
    }
    
    static size() {
        return localStorage.length;
    }
    
    static getAll() {
        const data = {};
        this.keys().forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }
}

console.log("\n=== Storage Wrapper ===");

function demonstrateWrapper() {
    // Using the wrapper
    LocalStorageWrapper.set('settings', {
        theme: 'dark',
        autoSave: true,
        fontSize: 14
    });
    
    const settings = LocalStorageWrapper.get('settings', {});
    console.log("Settings:", settings);
    
    // Check if key exists
    console.log("Has settings:", LocalStorageWrapper.has('settings'));
    console.log("Has nonexistent:", LocalStorageWrapper.has('nonexistent'));
    
    // Get all data
    const allData = LocalStorageWrapper.getAll();
    console.log("All stored data:", allData);
}

// SessionStorage (same API as localStorage, but session-scoped)
console.log("\n=== sessionStorage ===");

function sessionStorageExample() {
    // sessionStorage works the same as localStorage
    // but data is cleared when the tab is closed
    
    sessionStorage.setItem('sessionData', 'This persists only for the session');
    sessionStorage.setItem('tabSpecific', JSON.stringify({
        timestamp: Date.now(),
        tabId: Math.random().toString(36).substr(2, 9)
    }));
    
    console.log("Session data:", sessionStorage.getItem('sessionData'));
    console.log("Tab data:", JSON.parse(sessionStorage.getItem('tabSpecific')));
    
    // sessionStorage is isolated per tab
    // Opening the same page in a new tab creates separate sessionStorage
}

// Storage events (cross-tab communication)
console.log("\n=== Storage Events ===");

function setupStorageEvents() {
    if (isBrowser) {
        // Listen for storage changes in other tabs
        window.addEventListener('storage', function(event) {
            console.log('Storage event detected:');
            console.log('Key:', event.key);
            console.log('Old value:', event.oldValue);
            console.log('New value:', event.newValue);
            console.log('URL:', event.url);
            
            // React to specific changes
            if (event.key === 'theme') {
                console.log('Theme changed in another tab:', event.newValue);
                // Update UI accordingly
            }
        });
        
        console.log("Storage event listener registered");
    } else {
        console.log("Storage events available only in browser");
    }
}

// Practical examples
console.log("\n=== Practical Examples ===");

// User preferences manager
class UserPreferences {
    constructor() {
        this.key = 'userPreferences';
        this.defaults = {
            theme: 'light',
            language: 'en',
            notifications: true,
            autoSave: false,
            fontSize: 14
        };
    }
    
    get() {
        return LocalStorageWrapper.get(this.key, this.defaults);
    }
    
    set(preferences) {
        const current = this.get();
        const updated = { ...current, ...preferences };
        return LocalStorageWrapper.set(this.key, updated);
    }
    
    update(key, value) {
        const preferences = this.get();
        preferences[key] = value;
        return this.set(preferences);
    }
    
    reset() {
        return LocalStorageWrapper.set(this.key, this.defaults);
    }
    
    remove() {
        return LocalStorageWrapper.remove(this.key);
    }
}

// Shopping cart manager
class ShoppingCart {
    constructor() {
        this.key = 'shoppingCart';
    }
    
    getItems() {
        return LocalStorageWrapper.get(this.key, []);
    }
    
    addItem(item) {
        const items = this.getItems();
        const existingIndex = items.findIndex(i => i.id === item.id);
        
        if (existingIndex > -1) {
            items[existingIndex].quantity += item.quantity || 1;
        } else {
            items.push({ ...item, quantity: item.quantity || 1 });
        }
        
        LocalStorageWrapper.set(this.key, items);
        return items;
    }
    
    removeItem(itemId) {
        const items = this.getItems().filter(item => item.id !== itemId);
        LocalStorageWrapper.set(this.key, items);
        return items;
    }
    
    updateQuantity(itemId, quantity) {
        const items = this.getItems();
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                items.splice(itemIndex, 1);
            } else {
                items[itemIndex].quantity = quantity;
            }
            LocalStorageWrapper.set(this.key, items);
        }
        
        return items;
    }
    
    clear() {
        LocalStorageWrapper.remove(this.key);
    }
    
    getTotal() {
        const items = this.getItems();
        return items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
}

// Recent searches manager
class RecentSearches {
    constructor(maxItems = 10) {
        this.key = 'recentSearches';
        this.maxItems = maxItems;
    }
    
    add(searchTerm) {
        if (!searchTerm.trim()) return;
        
        let searches = LocalStorageWrapper.get(this.key, []);
        
        // Remove if already exists
        searches = searches.filter(term => 
            term.toLowerCase() !== searchTerm.toLowerCase()
        );
        
        // Add to beginning
        searches.unshift(searchTerm);
        
        // Limit size
        if (searches.length > this.maxItems) {
            searches = searches.slice(0, this.maxItems);
        }
        
        LocalStorageWrapper.set(this.key, searches);
        return searches;
    }
    
    get() {
        return LocalStorageWrapper.get(this.key, []);
    }
    
    remove(searchTerm) {
        const searches = this.get().filter(term => term !== searchTerm);
        LocalStorageWrapper.set(this.key, searches);
        return searches;
    }
    
    clear() {
        LocalStorageWrapper.remove(this.key);
    }
}

// Test practical examples
function testPracticalExamples() {
    console.log("Testing practical examples...");
    
    // User preferences
    const prefs = new UserPreferences();
    prefs.update('theme', 'dark');
    prefs.update('fontSize', 16);
    console.log("User preferences:", prefs.get());
    
    // Shopping cart
    const cart = new ShoppingCart();
    cart.addItem({ id: 1, name: "Widget", price: 9.99 });
    cart.addItem({ id: 2, name: "Gadget", price: 19.99, quantity: 2 });
    cart.addItem({ id: 1, name: "Widget", price: 9.99 }); // Increase quantity
    
    console.log("Cart items:", cart.getItems());
    console.log("Cart total:", cart.getTotal());
    
    cart.updateQuantity(2, 1);
    console.log("Updated cart:", cart.getItems());
    
    // Recent searches
    const searches = new RecentSearches(5);
    searches.add("javascript");
    searches.add("react");
    searches.add("vue");
    searches.add("javascript"); // Should move to top
    
    console.log("Recent searches:", searches.get());
}

// Storage quotas and limits
function checkStorageQuotas() {
    console.log("\n=== Storage Quotas ===");
    
    if (isBrowser && 'navigator' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
            console.log("Storage quota:", Math.round(estimate.quota / 1024 / 1024), "MB");
            console.log("Storage usage:", Math.round(estimate.usage / 1024 / 1024), "MB");
            console.log("Usage percentage:", Math.round(estimate.usage / estimate.quota * 100), "%");
        });
    } else {
        console.log("Storage quota API not available");
        console.log("localStorage typically limited to 5-10MB per origin");
        console.log("sessionStorage typically limited to 5-10MB per origin");
    }
}

// Error handling and fallbacks
function storageErrorHandling() {
    console.log("\n=== Error Handling ===");
    
    function safeStorageOperation(operation) {
        try {
            return operation();
        } catch (error) {
            console.log("Storage operation failed:", error.message);
            
            if (error.name === 'QuotaExceededError') {
                console.log("Storage quota exceeded");
                // Handle quota exceeded (clear old data, notify user, etc.)
                return false;
            } else if (error.name === 'SecurityError') {
                console.log("Storage access denied (private browsing?)");
                return false;
            } else {
                console.log("Unknown storage error");
                return false;
            }
        }
    }
    
    // Test safe storage
    const success = safeStorageOperation(() => {
        localStorage.setItem('test', 'value');
        return true;
    });
    
    console.log("Storage operation success:", success);
}

// Run demonstrations
localStorageBasics();
complexDataStorage();
demonstrateWrapper();
sessionStorageExample();
setupStorageEvents();
testPracticalExamples();
checkStorageQuotas();
storageErrorHandling();

// Cleanup
setTimeout(() => {
    console.log("\n=== Cleanup ===");
    LocalStorageWrapper.clear();
    console.log("Storage cleared");
}, 2000);

// Browser environment notes
if (isBrowser) {
    console.log("\nRunning in browser - full Web Storage API available");
} else {
    console.log("\nRunning in Node.js - copy to browser console for full functionality");
}