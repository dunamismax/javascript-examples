// 26 - Performance Optimization
// Learn techniques to write fast, efficient JavaScript code

console.log("=== Performance Optimization ===");

// 1. Measuring Performance
console.log("\n=== Performance Measurement ===");

class PerformanceProfiler {
    static measureTime(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
    
    static async measureAsyncTime(name, fn) {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
    
    static benchmark(name, fn, iterations = 1000) {
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            fn();
            const end = performance.now();
            times.push(end - start);
        }
        
        const total = times.reduce((sum, time) => sum + time, 0);
        const average = total / iterations;
        const min = Math.min(...times);
        const max = Math.max(...times);
        
        console.log(`Benchmark: ${name}`);
        console.log(`  Iterations: ${iterations}`);
        console.log(`  Total: ${total.toFixed(2)}ms`);
        console.log(`  Average: ${average.toFixed(4)}ms`);
        console.log(`  Min: ${min.toFixed(4)}ms`);
        console.log(`  Max: ${max.toFixed(4)}ms`);
        
        return { total, average, min, max, times };
    }
    
    static memoryUsage() {
        if (typeof performance !== 'undefined' && performance.memory) {
            const memory = performance.memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
                total: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
                limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
            };
        }
        return null;
    }
}

// Example measurements
console.log("Memory usage:", PerformanceProfiler.memoryUsage());

// 2. Loop Optimization
console.log("\n=== Loop Optimization ===");

function demonstrateLoopOptimization() {
    const largeArray = Array.from({ length: 100000 }, (_, i) => i);
    
    // Slow: accessing length property every iteration
    function slowLoop() {
        let sum = 0;
        for (let i = 0; i < largeArray.length; i++) {
            sum += largeArray[i];
        }
        return sum;
    }
    
    // Fast: cache length property
    function fastLoop() {
        let sum = 0;
        const len = largeArray.length;
        for (let i = 0; i < len; i++) {
            sum += largeArray[i];
        }
        return sum;
    }
    
    // Fastest: reverse loop (sometimes)
    function reverseLoop() {
        let sum = 0;
        for (let i = largeArray.length - 1; i >= 0; i--) {
            sum += largeArray[i];
        }
        return sum;
    }
    
    // Modern approach
    function modernLoop() {
        return largeArray.reduce((sum, num) => sum + num, 0);
    }
    
    // Benchmark different loop approaches
    PerformanceProfiler.benchmark("Slow loop", slowLoop, 100);
    PerformanceProfiler.benchmark("Fast loop", fastLoop, 100);
    PerformanceProfiler.benchmark("Reverse loop", reverseLoop, 100);
    PerformanceProfiler.benchmark("Modern reduce", modernLoop, 100);
}

demonstrateLoopOptimization();

// 3. Object and Array Optimization
console.log("\n=== Object and Array Optimization ===");

function demonstrateDataStructureOptimization() {
    const testData = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        category: `Category ${i % 10}`,
        value: Math.random() * 100
    }));
    
    // Slow: Linear search in array
    function slowFind(id) {
        return testData.find(item => item.id === id);
    }
    
    // Fast: Use Map for O(1) lookup
    const dataMap = new Map(testData.map(item => [item.id, item]));
    function fastFind(id) {
        return dataMap.get(id);
    }
    
    // Fast: Use object for lookup
    const dataObject = Object.fromEntries(testData.map(item => [item.id, item]));
    function objectFind(id) {
        return dataObject[id];
    }
    
    const searchId = 7500;
    PerformanceProfiler.benchmark("Array find", () => slowFind(searchId), 1000);
    PerformanceProfiler.benchmark("Map get", () => fastFind(searchId), 1000);
    PerformanceProfiler.benchmark("Object lookup", () => objectFind(searchId), 1000);
    
    // Array operations optimization
    console.log("\nArray operations:");
    
    // Slow: Multiple iterations
    function slowArrayOperations() {
        return testData
            .filter(item => item.value > 50)
            .map(item => item.value * 2)
            .reduce((sum, value) => sum + value, 0);
    }
    
    // Fast: Single iteration
    function fastArrayOperations() {
        let sum = 0;
        for (const item of testData) {
            if (item.value > 50) {
                sum += item.value * 2;
            }
        }
        return sum;
    }
    
    PerformanceProfiler.benchmark("Multiple iterations", slowArrayOperations, 100);
    PerformanceProfiler.benchmark("Single iteration", fastArrayOperations, 100);
}

demonstrateDataStructureOptimization();

// 4. Function Optimization
console.log("\n=== Function Optimization ===");

// Memoization for expensive calculations
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Expensive fibonacci function
function fibonacci(n) {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memoized version
const memoizedFibonacci = memoize(fibonacci);

// Compare performance
console.log("Fibonacci comparison (n=35):");
PerformanceProfiler.measureTime("Regular fibonacci", () => fibonacci(35));
PerformanceProfiler.measureTime("Memoized fibonacci (first call)", () => memoizedFibonacci(35));
PerformanceProfiler.measureTime("Memoized fibonacci (cached)", () => memoizedFibonacci(35));

// Function call optimization
function demonstrateFunctionOptimization() {
    const numbers = Array.from({ length: 1000 }, () => Math.random() * 100);
    
    // Slow: Function call overhead in loop
    function processWithFunction(arr) {
        function square(x) {
            return x * x;
        }
        
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(square(arr[i]));
        }
        return result;
    }
    
    // Fast: Inline operation
    function processInline(arr) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(arr[i] * arr[i]);
        }
        return result;
    }
    
    PerformanceProfiler.benchmark("With function calls", () => processWithFunction(numbers), 1000);
    PerformanceProfiler.benchmark("Inline operations", () => processInline(numbers), 1000);
}

demonstrateFunctionOptimization();

// 5. String Optimization
console.log("\n=== String Optimization ===");

function demonstrateStringOptimization() {
    const words = Array.from({ length: 1000 }, (_, i) => `word${i}`);
    
    // Slow: String concatenation with +
    function slowStringConcat() {
        let result = "";
        for (const word of words) {
            result += word + " ";
        }
        return result;
    }
    
    // Fast: Array join
    function fastStringConcat() {
        return words.join(" ");
    }
    
    // Medium: Template literals
    function templateStringConcat() {
        let result = "";
        for (const word of words) {
            result += `${word} `;
        }
        return result;
    }
    
    PerformanceProfiler.benchmark("String concatenation", slowStringConcat, 100);
    PerformanceProfiler.benchmark("Array join", fastStringConcat, 100);
    PerformanceProfiler.benchmark("Template literals", templateStringConcat, 100);
    
    // String searching optimization
    const longString = words.join(" ").repeat(100);
    const searchTerm = "word500";
    
    function regexSearch() {
        return new RegExp(searchTerm).test(longString);
    }
    
    function includesSearch() {
        return longString.includes(searchTerm);
    }
    
    function indexOfSearch() {
        return longString.indexOf(searchTerm) !== -1;
    }
    
    PerformanceProfiler.benchmark("Regex search", regexSearch, 1000);
    PerformanceProfiler.benchmark("Includes search", includesSearch, 1000);
    PerformanceProfiler.benchmark("IndexOf search", indexOfSearch, 1000);
}

demonstrateStringOptimization();

// 6. DOM Optimization (Browser only)
console.log("\n=== DOM Optimization ===");

class DOMOptimizer {
    // Batch DOM operations
    static batchDOMUpdates(element, updates) {
        if (typeof document === 'undefined') {
            console.log("DOM optimization requires browser environment");
            return;
        }
        
        // Use DocumentFragment to batch operations
        const fragment = document.createDocumentFragment();
        
        updates.forEach(update => {
            const el = document.createElement(update.tag || 'div');
            if (update.text) el.textContent = update.text;
            if (update.className) el.className = update.className;
            if (update.attributes) {
                Object.entries(update.attributes).forEach(([key, value]) => {
                    el.setAttribute(key, value);
                });
            }
            fragment.appendChild(el);
        });
        
        element.appendChild(fragment);
    }
    
    // Efficient event delegation
    static addEventDelegation(container, selector, eventType, handler) {
        if (typeof document === 'undefined') return;
        
        container.addEventListener(eventType, (event) => {
            if (event.target.matches(selector)) {
                handler(event);
            }
        });
    }
    
    // Virtual scrolling for large lists
    static createVirtualList(container, items, itemHeight, visibleCount) {
        if (typeof document === 'undefined') return;
        
        let startIndex = 0;
        const totalHeight = items.length * itemHeight;
        
        container.style.height = `${visibleCount * itemHeight}px`;
        container.style.overflowY = 'auto';
        
        const viewport = document.createElement('div');
        viewport.style.height = `${totalHeight}px`;
        viewport.style.position = 'relative';
        
        const content = document.createElement('div');
        content.style.position = 'absolute';
        content.style.top = '0';
        content.style.width = '100%';
        
        viewport.appendChild(content);
        container.appendChild(viewport);
        
        function render() {
            content.innerHTML = '';
            const endIndex = Math.min(startIndex + visibleCount, items.length);
            
            for (let i = startIndex; i < endIndex; i++) {
                const item = document.createElement('div');
                item.textContent = items[i];
                item.style.height = `${itemHeight}px`;
                item.style.position = 'absolute';
                item.style.top = `${i * itemHeight}px`;
                content.appendChild(item);
            }
        }
        
        container.addEventListener('scroll', () => {
            const newStartIndex = Math.floor(container.scrollTop / itemHeight);
            if (newStartIndex !== startIndex) {
                startIndex = newStartIndex;
                render();
            }
        });
        
        render();
    }
}

// 7. Memory Management
console.log("\n=== Memory Management ===");

class MemoryManager {
    static detectMemoryLeaks() {
        const memoryBefore = PerformanceProfiler.memoryUsage();
        if (!memoryBefore) {
            console.log("Memory monitoring not available");
            return;
        }
        
        console.log("Memory before:", memoryBefore);
        
        // Create potential memory leak
        const leakyArray = [];
        for (let i = 0; i < 100000; i++) {
            leakyArray.push({
                data: new Array(1000).fill(i),
                callback: function() { return i; }
            });
        }
        
        const memoryAfter = PerformanceProfiler.memoryUsage();
        console.log("Memory after creating objects:", memoryAfter);
        
        // Clean up
        leakyArray.length = 0;
        
        // Force garbage collection (if available)
        if (typeof gc === 'function') {
            gc();
        }
        
        setTimeout(() => {
            const memoryFinal = PerformanceProfiler.memoryUsage();
            console.log("Memory after cleanup:", memoryFinal);
        }, 100);
    }
    
    static avoidMemoryLeaks() {
        console.log("Memory leak prevention tips:");
        console.log("1. Remove event listeners when no longer needed");
        console.log("2. Clear timers and intervals");
        console.log("3. Avoid circular references");
        console.log("4. Use WeakMap and WeakSet for loose references");
        console.log("5. Be careful with closures capturing large objects");
        
        // Example: Using WeakMap to avoid memory leaks
        const cache = new WeakMap();
        
        function processObject(obj) {
            if (cache.has(obj)) {
                return cache.get(obj);
            }
            
            const result = { processed: true, original: obj };
            cache.set(obj, result);
            return result;
        }
        
        // When obj is garbage collected, the cache entry is automatically removed
        let obj = { data: "test" };
        const processed = processObject(obj);
        console.log("Processed object:", processed);
        
        obj = null; // Original object can be garbage collected
    }
}

MemoryManager.detectMemoryLeaks();
MemoryManager.avoidMemoryLeaks();

// 8. Asynchronous Performance
console.log("\n=== Asynchronous Performance ===");

class AsyncOptimizer {
    // Parallel vs Sequential execution
    static async demonstrateParallelExecution() {
        const urls = [
            'https://api.example.com/data1',
            'https://api.example.com/data2',
            'https://api.example.com/data3'
        ];
        
        // Simulate API calls
        const mockFetch = (url) => new Promise(resolve => {
            setTimeout(() => resolve(`Data from ${url}`), Math.random() * 1000);
        });
        
        // Sequential execution
        const sequentialTime = await PerformanceProfiler.measureAsyncTime(
            "Sequential execution",
            async () => {
                const results = [];
                for (const url of urls) {
                    results.push(await mockFetch(url));
                }
                return results;
            }
        );
        
        // Parallel execution
        const parallelTime = await PerformanceProfiler.measureAsyncTime(
            "Parallel execution",
            async () => {
                const promises = urls.map(url => mockFetch(url));
                return Promise.all(promises);
            }
        );
        
        console.log("Parallel execution is faster when operations are independent");
    }
    
    // Debouncing and throttling
    static createDebounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    static createThrottle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Request batching
    static createBatcher(processor, delay = 10) {
        let batch = [];
        let timeoutId;
        
        return function(item) {
            batch.push(item);
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                processor([...batch]);
                batch = [];
            }, delay);
        };
    }
}

// Test async optimization
AsyncOptimizer.demonstrateParallelExecution();

// Example of batching
const batchProcessor = AsyncOptimizer.createBatcher((items) => {
    console.log(`Processing batch of ${items.length} items:`, items);
});

// Simulate multiple rapid calls
for (let i = 0; i < 5; i++) {
    setTimeout(() => batchProcessor(`item-${i}`), i * 2);
}

// 9. Code Splitting and Lazy Loading
console.log("\n=== Code Splitting ===");

class LazyLoader {
    static async loadModule(moduleFactory) {
        try {
            const start = performance.now();
            const module = await moduleFactory();
            const end = performance.now();
            console.log(`Module loaded in ${(end - start).toFixed(2)}ms`);
            return module;
        } catch (error) {
            console.error("Module loading failed:", error);
            return null;
        }
    }
    
    static createLazyFunction(moduleFactory) {
        let modulePromise = null;
        
        return async function(...args) {
            if (!modulePromise) {
                modulePromise = LazyLoader.loadModule(moduleFactory);
            }
            
            const module = await modulePromise;
            if (module && module.default) {
                return module.default(...args);
            }
            
            throw new Error("Module or default export not found");
        };
    }
    
    // Preload critical modules
    static preloadModules(moduleFactories) {
        return Promise.all(
            moduleFactories.map(factory => LazyLoader.loadModule(factory))
        );
    }
}

// Example usage
const heavyCalculation = LazyLoader.createLazyFunction(async () => {
    // Simulate dynamic import
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
        default: (n) => {
            let result = 0;
            for (let i = 0; i < n * 1000; i++) {
                result += Math.sqrt(i);
            }
            return result;
        }
    };
});

// First call loads the module, subsequent calls use cached module
heavyCalculation(100).then(result => console.log("Heavy calculation result:", result));

// 10. Performance Monitoring
console.log("\n=== Performance Monitoring ===");

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
    }
    
    startTimer(name) {
        this.metrics.set(name, { start: performance.now() });
    }
    
    endTimer(name) {
        const metric = this.metrics.get(name);
        if (metric) {
            metric.end = performance.now();
            metric.duration = metric.end - metric.start;
            console.log(`Timer ${name}: ${metric.duration.toFixed(2)}ms`);
        }
    }
    
    recordMetric(name, value, unit = '') {
        console.log(`Metric ${name}: ${value}${unit}`);
        this.metrics.set(name, { value, unit, timestamp: Date.now() });
    }
    
    // Performance observer for browser metrics
    observePerformance() {
        if (typeof PerformanceObserver === 'undefined') {
            console.log("PerformanceObserver not available");
            return;
        }
        
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    console.log(`Performance entry: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
            this.observers.push(observer);
        } catch (error) {
            console.log("Performance observation setup failed:", error.message);
        }
    }
    
    getMetrics() {
        return Object.fromEntries(this.metrics);
    }
    
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.metrics.clear();
    }
}

// Example usage
const monitor = new PerformanceMonitor();
monitor.observePerformance();

monitor.startTimer("example-operation");
// Simulate some work
setTimeout(() => {
    monitor.endTimer("example-operation");
    monitor.recordMetric("items-processed", 1000, " items");
    console.log("All metrics:", monitor.getMetrics());
}, 50);

console.log("\n=== Performance Optimization Best Practices ===");
console.log("1. Measure before optimizing - profile your code");
console.log("2. Optimize the critical path first");
console.log("3. Use appropriate data structures for your use case");
console.log("4. Minimize DOM manipulations and batch them");
console.log("5. Implement lazy loading for non-critical resources");
console.log("6. Use memoization for expensive pure functions");
console.log("7. Avoid memory leaks with proper cleanup");
console.log("8. Leverage browser caching and compression");
console.log("9. Consider using Web Workers for heavy computations");
console.log("10. Monitor performance in production");