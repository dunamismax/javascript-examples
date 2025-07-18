// 25 - Browser APIs
// Explore powerful browser APIs for modern web applications

console.log("=== Browser APIs ===");

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

if (!isBrowser) {
    console.log("Running in Node.js - many APIs are browser-only");
    console.log("Copy this code to a browser console for full functionality");
}

// 1. Geolocation API
console.log("\n=== Geolocation API ===");

function demonstrateGeolocation() {
    if (isBrowser && 'geolocation' in navigator) {
        console.log("Geolocation is supported");
        
        // Get current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Current position:", {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                    timestamp: new Date(position.timestamp)
                });
            },
            (error) => {
                console.log("Geolocation error:", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
        
        // Watch position changes
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log("Position update:", position.coords);
            },
            (error) => {
                console.log("Watch error:", error.message);
            }
        );
        
        // Stop watching after 30 seconds
        setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);
            console.log("Stopped watching position");
        }, 30000);
        
    } else {
        console.log("Geolocation not supported or not in browser");
    }
}

// 2. Notification API
console.log("\n=== Notification API ===");

class NotificationManager {
    static async requestPermission() {
        if (!isBrowser || !('Notification' in window)) {
            console.log("Notifications not supported");
            return 'denied';
        }
        
        if (Notification.permission === 'granted') {
            return 'granted';
        }
        
        if (Notification.permission === 'denied') {
            return 'denied';
        }
        
        const permission = await Notification.requestPermission();
        return permission;
    }
    
    static async showNotification(title, options = {}) {
        const permission = await this.requestPermission();
        
        if (permission === 'granted') {
            const notification = new Notification(title, {
                body: options.body || '',
                icon: options.icon || '',
                tag: options.tag || '',
                requireInteraction: options.requireInteraction || false,
                silent: options.silent || false,
                ...options
            });
            
            notification.onclick = () => {
                console.log("Notification clicked");
                notification.close();
            };
            
            // Auto-close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
            
            return notification;
        } else {
            console.log("Notification permission denied");
            return null;
        }
    }
}

// Test notifications
async function testNotifications() {
    if (isBrowser) {
        const notification = await NotificationManager.showNotification(
            "Hello from JavaScript!",
            {
                body: "This is a test notification",
                icon: "https://via.placeholder.com/64",
                tag: "test-notification"
            }
        );
        
        if (notification) {
            console.log("Notification created successfully");
        }
    } else {
        console.log("Notifications require browser environment");
    }
}

// 3. Web Storage API (localStorage, sessionStorage)
console.log("\n=== Web Storage API ===");

class StorageManager {
    static isSupported() {
        try {
            return isBrowser && typeof Storage !== 'undefined';
        } catch (e) {
            return false;
        }
    }
    
    static setItem(key, value, session = false) {
        if (!this.isSupported()) {
            console.log("Storage not supported");
            return false;
        }
        
        try {
            const storage = session ? sessionStorage : localStorage;
            storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.log("Storage error:", e.message);
            return false;
        }
    }
    
    static getItem(key, session = false) {
        if (!this.isSupported()) {
            console.log("Storage not supported");
            return null;
        }
        
        try {
            const storage = session ? sessionStorage : localStorage;
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.log("Storage parse error:", e.message);
            return null;
        }
    }
    
    static removeItem(key, session = false) {
        if (!this.isSupported()) return false;
        
        const storage = session ? sessionStorage : localStorage;
        storage.removeItem(key);
        return true;
    }
    
    static clear(session = false) {
        if (!this.isSupported()) return false;
        
        const storage = session ? sessionStorage : localStorage;
        storage.clear();
        return true;
    }
    
    static getStorageInfo() {
        if (!this.isSupported()) return null;
        
        return {
            localStorageLength: localStorage.length,
            sessionStorageLength: sessionStorage.length,
            localStorageKeys: Object.keys(localStorage),
            sessionStorageKeys: Object.keys(sessionStorage)
        };
    }
}

// Test storage
if (isBrowser) {
    StorageManager.setItem('user-preferences', { theme: 'dark', language: 'en' });
    StorageManager.setItem('session-data', { startTime: Date.now() }, true);
    
    console.log("Stored preferences:", StorageManager.getItem('user-preferences'));
    console.log("Session data:", StorageManager.getItem('session-data', true));
    console.log("Storage info:", StorageManager.getStorageInfo());
}

// 4. File API
console.log("\n=== File API ===");

class FileManager {
    static readFile(file) {
        return new Promise((resolve, reject) => {
            if (!isBrowser || !file) {
                reject(new Error("File API not available or no file provided"));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: new Date(file.lastModified),
                    content: event.target.result
                });
            };
            
            reader.onerror = () => {
                reject(new Error("Error reading file"));
            };
            
            // Read as text (can also use readAsArrayBuffer, readAsDataURL, etc.)
            reader.readAsText(file);
        });
    }
    
    static readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            if (!isBrowser || !file) {
                reject(new Error("File API not available or no file provided"));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = () => reject(new Error("Error reading file"));
            reader.readAsDataURL(file);
        });
    }
    
    static validateFile(file, options = {}) {
        const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
        const allowedTypes = options.allowedTypes || [];
        
        const errors = [];
        
        if (file.size > maxSize) {
            errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds limit (${(maxSize / 1024 / 1024).toFixed(2)}MB)`);
        }
        
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            errors.push(`File type ${file.type} is not allowed`);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Simulate file handling
function simulateFileHandling() {
    console.log("File API examples (browser only):");
    console.log("- Use <input type='file'> to select files");
    console.log("- Use FileReader to read file contents");
    console.log("- Validate file size and type before processing");
    console.log("- Support drag and drop file uploads");
    
    // Example usage in browser:
    /*
    document.getElementById('fileInput').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const validation = FileManager.validateFile(file, {
                maxSize: 5 * 1024 * 1024, // 5MB
                allowedTypes: ['text/plain', 'application/json']
            });
            
            if (validation.valid) {
                try {
                    const fileData = await FileManager.readFile(file);
                    console.log('File data:', fileData);
                } catch (error) {
                    console.error('File read error:', error);
                }
            } else {
                console.error('File validation errors:', validation.errors);
            }
        }
    });
    */
}

simulateFileHandling();

// 5. Clipboard API
console.log("\n=== Clipboard API ===");

class ClipboardManager {
    static async writeText(text) {
        if (!isBrowser || !navigator.clipboard) {
            console.log("Clipboard API not supported");
            return false;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            console.log("Text copied to clipboard");
            return true;
        } catch (error) {
            console.log("Clipboard write error:", error.message);
            return false;
        }
    }
    
    static async readText() {
        if (!isBrowser || !navigator.clipboard) {
            console.log("Clipboard API not supported");
            return null;
        }
        
        try {
            const text = await navigator.clipboard.readText();
            console.log("Text read from clipboard:", text);
            return text;
        } catch (error) {
            console.log("Clipboard read error:", error.message);
            return null;
        }
    }
    
    static async writeData(data) {
        if (!isBrowser || !navigator.clipboard) {
            console.log("Clipboard API not supported");
            return false;
        }
        
        try {
            await navigator.clipboard.write(data);
            console.log("Data copied to clipboard");
            return true;
        } catch (error) {
            console.log("Clipboard write error:", error.message);
            return false;
        }
    }
    
    // Fallback for older browsers
    static fallbackCopyText(text) {
        if (!isBrowser) return false;
        
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (error) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// 6. Battery Status API
console.log("\n=== Battery Status API ===");

async function getBatteryInfo() {
    if (!isBrowser || !('getBattery' in navigator)) {
        console.log("Battery Status API not supported");
        return;
    }
    
    try {
        const battery = await navigator.getBattery();
        
        console.log("Battery information:");
        console.log("Level:", Math.round(battery.level * 100) + "%");
        console.log("Charging:", battery.charging);
        console.log("Charging time:", battery.chargingTime, "seconds");
        console.log("Discharging time:", battery.dischargingTime, "seconds");
        
        // Event listeners
        battery.addEventListener('chargingchange', () => {
            console.log("Charging state changed:", battery.charging);
        });
        
        battery.addEventListener('levelchange', () => {
            console.log("Battery level changed:", Math.round(battery.level * 100) + "%");
        });
        
    } catch (error) {
        console.log("Battery API error:", error.message);
    }
}

// 7. Network Information API
console.log("\n=== Network Information API ===");

function getNetworkInfo() {
    if (!isBrowser || !('connection' in navigator)) {
        console.log("Network Information API not supported");
        return;
    }
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
        console.log("Network information:");
        console.log("Effective type:", connection.effectiveType);
        console.log("Downlink:", connection.downlink, "Mbps");
        console.log("RTT:", connection.rtt, "ms");
        console.log("Save data mode:", connection.saveData);
        
        connection.addEventListener('change', () => {
            console.log("Network connection changed:", connection.effectiveType);
        });
    }
}

// 8. Intersection Observer API
console.log("\n=== Intersection Observer API ===");

class VisibilityObserver {
    constructor(callback, options = {}) {
        if (!isBrowser || !('IntersectionObserver' in window)) {
            console.log("Intersection Observer not supported");
            return;
        }
        
        this.callback = callback;
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            root: options.root || null,
            rootMargin: options.rootMargin || '0px',
            threshold: options.threshold || 0.1
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            this.callback({
                element: entry.target,
                isVisible: entry.isIntersecting,
                visibilityRatio: entry.intersectionRatio,
                boundingRect: entry.boundingClientRect
            });
        });
    }
    
    observe(element) {
        if (this.observer && element) {
            this.observer.observe(element);
        }
    }
    
    unobserve(element) {
        if (this.observer && element) {
            this.observer.unobserve(element);
        }
    }
    
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Example usage
function demonstrateIntersectionObserver() {
    if (isBrowser) {
        const observer = new VisibilityObserver((data) => {
            console.log("Element visibility changed:", data);
        }, { threshold: 0.5 });
        
        // In a real application, you would observe actual DOM elements
        console.log("Intersection Observer created (use with DOM elements)");
    }
}

// 9. Web Workers API
console.log("\n=== Web Workers API ===");

class WorkerManager {
    static isSupported() {
        return isBrowser && typeof Worker !== 'undefined';
    }
    
    static createWorker(script) {
        if (!this.isSupported()) {
            console.log("Web Workers not supported");
            return null;
        }
        
        try {
            const worker = new Worker(script);
            
            worker.onmessage = (event) => {
                console.log("Worker message:", event.data);
            };
            
            worker.onerror = (error) => {
                console.log("Worker error:", error.message);
            };
            
            return worker;
        } catch (error) {
            console.log("Worker creation error:", error.message);
            return null;
        }
    }
    
    static createInlineWorker(workerCode) {
        if (!this.isSupported()) {
            console.log("Web Workers not supported");
            return null;
        }
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerURL = URL.createObjectURL(blob);
        
        const worker = new Worker(workerURL);
        
        // Clean up the URL when worker is terminated
        const originalTerminate = worker.terminate;
        worker.terminate = function() {
            URL.revokeObjectURL(workerURL);
            originalTerminate.call(this);
        };
        
        return worker;
    }
}

// Example worker code
const workerCode = `
    self.onmessage = function(event) {
        const { task, data } = event.data;
        
        switch (task) {
            case 'fibonacci':
                const result = fibonacci(data);
                self.postMessage({ task, result });
                break;
            case 'sort':
                const sorted = data.sort((a, b) => a - b);
                self.postMessage({ task, result: sorted });
                break;
            default:
                self.postMessage({ error: 'Unknown task' });
        }
    };
    
    function fibonacci(n) {
        if (n < 2) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
`;

// 10. Device Orientation API
console.log("\n=== Device Orientation API ===");

function setupDeviceOrientation() {
    if (!isBrowser || !('DeviceOrientationEvent' in window)) {
        console.log("Device Orientation API not supported");
        return;
    }
    
    window.addEventListener('deviceorientation', (event) => {
        console.log("Device orientation:", {
            alpha: event.alpha,  // Z-axis rotation (0-360)
            beta: event.beta,    // X-axis rotation (-180 to 180)
            gamma: event.gamma   // Y-axis rotation (-90 to 90)
        });
    });
    
    // Request permission on iOS 13+
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    console.log("Device orientation permission granted");
                }
            })
            .catch(console.error);
    }
}

// Browser environment setup
if (isBrowser) {
    console.log("Setting up browser APIs...");
    
    // Setup event listeners for APIs that need user interaction
    document.addEventListener('DOMContentLoaded', () => {
        demonstrateGeolocation();
        getBatteryInfo();
        getNetworkInfo();
        demonstrateIntersectionObserver();
        setupDeviceOrientation();
    });
    
    // Add click handler for notification test
    document.addEventListener('click', () => {
        testNotifications();
    }, { once: true });
    
} else {
    console.log("Browser APIs demonstrated - copy to browser for full functionality");
}

// 11. Browser Compatibility Utilities
console.log("\n=== Browser Compatibility ===");

class BrowserDetector {
    static getInfo() {
        if (!isBrowser) return { environment: 'node' };
        
        const userAgent = navigator.userAgent;
        const vendor = navigator.vendor;
        
        return {
            userAgent,
            vendor,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            onLine: navigator.onLine,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints
        };
    }
    
    static supports(feature) {
        if (!isBrowser) return false;
        
        const features = {
            'localStorage': () => typeof Storage !== 'undefined',
            'geolocation': () => 'geolocation' in navigator,
            'webgl': () => {
                try {
                    const canvas = document.createElement('canvas');
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                } catch (e) {
                    return false;
                }
            },
            'webworkers': () => typeof Worker !== 'undefined',
            'serviceworker': () => 'serviceWorker' in navigator,
            'notifications': () => 'Notification' in window,
            'camera': () => 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
            'microphone': () => 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
            'accelerometer': () => 'DeviceMotionEvent' in window,
            'gyroscope': () => 'DeviceOrientationEvent' in window
        };
        
        return features[feature] ? features[feature]() : false;
    }
}

const browserInfo = BrowserDetector.getInfo();
console.log("Browser info:", browserInfo);

console.log("Feature support:");
['localStorage', 'geolocation', 'webgl', 'webworkers', 'serviceworker', 'notifications', 'camera'].forEach(feature => {
    console.log(`${feature}: ${BrowserDetector.supports(feature)}`);
});

console.log("\n=== Browser API Best Practices ===");
console.log("1. Always check for API support before using");
console.log("2. Handle permissions gracefully");
console.log("3. Provide fallbacks for unsupported features");
console.log("4. Respect user privacy and preferences");
console.log("5. Use feature detection, not browser detection");
console.log("6. Handle errors and edge cases");
console.log("7. Consider performance impact of APIs");
console.log("8. Keep up with evolving web standards");