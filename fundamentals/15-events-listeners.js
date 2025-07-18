// 15 - Events and Event Listeners
// Master JavaScript event handling, propagation, and modern event patterns

// Event listener basics (browser environment examples)
console.log("=== Event Listener Fundamentals ===");

// Different ways to add event listeners
function demonstrateEventMethods() {
    console.log("Event listener methods:");
    
    // In browser environment:
    /*
    // Method 1: HTML attribute (not recommended)
    // <button onclick="handleClick()">Click me</button>
    
    // Method 2: DOM property
    const button1 = document.querySelector('#button1');
    button1.onclick = function(event) {
        console.log('Property method clicked');
    };
    
    // Method 3: addEventListener (recommended)
    const button2 = document.querySelector('#button2');
    button2.addEventListener('click', function(event) {
        console.log('addEventListener method clicked');
    });
    
    // Arrow function event listener
    button2.addEventListener('click', (event) => {
        console.log('Arrow function listener');
    });
    */
    
    console.log("Event methods demonstrated (browser only)");
}

// Event object properties
function demonstrateEventObject() {
    console.log("=== Event Object Properties ===");
    
    // Mock event object for demonstration
    const mockEvent = {
        type: 'click',
        target: { tagName: 'BUTTON', id: 'myButton' },
        currentTarget: { tagName: 'DIV', id: 'container' },
        clientX: 150,
        clientY: 200,
        pageX: 150,
        pageY: 300,
        screenX: 500,
        screenY: 400,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        button: 0,
        buttons: 1,
        detail: 1,
        timeStamp: Date.now()
    };
    
    function analyzeEvent(event) {
        console.log("Event analysis:");
        console.log("Type:", event.type);
        console.log("Target:", event.target);
        console.log("Current target:", event.currentTarget);
        console.log("Mouse position:", { x: event.clientX, y: event.clientY });
        console.log("Modifier keys:", {
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            alt: event.altKey,
            meta: event.metaKey
        });
        console.log("Button:", event.button);
        console.log("Timestamp:", event.timeStamp);
    }
    
    analyzeEvent(mockEvent);
}

// Event propagation (bubbling and capturing)
function demonstrateEventPropagation() {
    console.log("=== Event Propagation ===");
    
    // In browser environment:
    /*
    // HTML structure:
    // <div id="outer">
    //   <div id="middle">
    //     <button id="inner">Click me</button>
    //   </div>
    // </div>
    
    const outer = document.querySelector('#outer');
    const middle = document.querySelector('#middle');
    const inner = document.querySelector('#inner');
    
    // Bubbling phase (default) - from target to root
    outer.addEventListener('click', () => console.log('Outer bubbling'));
    middle.addEventListener('click', () => console.log('Middle bubbling'));
    inner.addEventListener('click', () => console.log('Inner bubbling'));
    
    // Capturing phase - from root to target
    outer.addEventListener('click', () => console.log('Outer capturing'), true);
    middle.addEventListener('click', () => console.log('Middle capturing'), true);
    inner.addEventListener('click', () => console.log('Inner capturing'), true);
    
    // Order when clicking inner button:
    // 1. Outer capturing
    // 2. Middle capturing
    // 3. Inner capturing
    // 4. Inner bubbling
    // 5. Middle bubbling
    // 6. Outer bubbling
    */
    
    console.log("Event propagation order demonstrated");
}

// Preventing default behavior and stopping propagation
function demonstrateEventControl() {
    console.log("=== Event Control ===");
    
    // In browser environment:
    /*
    // Prevent default behavior
    const link = document.querySelector('#myLink');
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Stop navigation
        console.log('Link click prevented');
    });
    
    const form = document.querySelector('#myForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop form submission
        console.log('Form submission prevented');
        
        // Custom form handling here
        handleFormSubmission(event.target);
    });
    
    // Stop propagation
    const button = document.querySelector('#stopButton');
    button.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop bubbling
        console.log('Propagation stopped');
    });
    
    // Stop immediate propagation (prevents other listeners on same element)
    button.addEventListener('click', function(event) {
        event.stopImmediatePropagation();
        console.log('This runs');
    });
    
    button.addEventListener('click', function(event) {
        console.log('This will NOT run due to stopImmediatePropagation');
    });
    */
    
    console.log("Event control methods demonstrated");
}

// Common event types
const EventTypes = {
    // Mouse events
    mouse: {
        click: 'Single click',
        dblclick: 'Double click',
        mousedown: 'Mouse button pressed',
        mouseup: 'Mouse button released',
        mousemove: 'Mouse moved',
        mouseover: 'Mouse enters element',
        mouseout: 'Mouse leaves element',
        mouseenter: 'Mouse enters (no bubbling)',
        mouseleave: 'Mouse leaves (no bubbling)',
        contextmenu: 'Right-click context menu'
    },
    
    // Keyboard events
    keyboard: {
        keydown: 'Key pressed down',
        keyup: 'Key released',
        keypress: 'Key pressed (deprecated)'
    },
    
    // Form events
    form: {
        submit: 'Form submitted',
        reset: 'Form reset',
        change: 'Input value changed',
        input: 'Input value changing',
        focus: 'Element gained focus',
        blur: 'Element lost focus',
        select: 'Text selected'
    },
    
    // Window events
    window: {
        load: 'Page fully loaded',
        DOMContentLoaded: 'DOM ready',
        resize: 'Window resized',
        scroll: 'Page scrolled',
        unload: 'Page unloading',
        beforeunload: 'Before page unloads'
    }
};

console.log("=== Event Types ===");
console.log("Available event types:", EventTypes);

// Event delegation pattern
function demonstrateEventDelegation() {
    console.log("=== Event Delegation ===");
    
    // Instead of adding listeners to many elements, use delegation
    // In browser environment:
    /*
    // HTML:
    // <ul id="todo-list">
    //   <li><button class="delete">Delete</button> Task 1</li>
    //   <li><button class="delete">Delete</button> Task 2</li>
    //   <li><button class="delete">Delete</button> Task 3</li>
    // </ul>
    
    // Bad approach - add listener to each button
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
    });
    
    // Good approach - single listener on parent
    const todoList = document.querySelector('#todo-list');
    todoList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            handleDelete(event);
        }
    });
    
    function handleDelete(event) {
        const listItem = event.target.closest('li');
        listItem.remove();
    }
    
    // Benefits:
    // 1. Better performance with many elements
    // 2. Works with dynamically added elements
    // 3. Single event listener to manage
    */
    
    // Simulation of event delegation
    function simulateEventDelegation(eventTarget, eventType) {
        console.log(`Event delegation: ${eventType} on ${eventTarget}`);
        
        // Check if target matches our selector
        const selectors = {
            '.delete': 'Delete button clicked',
            '.edit': 'Edit button clicked',
            '.toggle': 'Toggle button clicked'
        };
        
        for (const [selector, action] of Object.entries(selectors)) {
            if (eventTarget.includes(selector.slice(1))) {
                console.log(`Delegated action: ${action}`);
                break;
            }
        }
    }
    
    // Simulate clicks
    simulateEventDelegation('delete-btn', 'click');
    simulateEventDelegation('edit-btn', 'click');
    simulateEventDelegation('toggle-btn', 'click');
}

// Custom events
function demonstrateCustomEvents() {
    console.log("=== Custom Events ===");
    
    // In browser environment:
    /*
    // Create custom event
    const customEvent = new CustomEvent('userLogin', {
        detail: {
            username: 'alice',
            timestamp: Date.now()
        },
        bubbles: true,
        cancelable: true
    });
    
    // Listen for custom event
    document.addEventListener('userLogin', function(event) {
        console.log('User logged in:', event.detail);
    });
    
    // Dispatch custom event
    document.dispatchEvent(customEvent);
    
    // More complex custom event
    function createNotification(message, type = 'info') {
        const event = new CustomEvent('notification', {
            detail: { message, type, id: Date.now() }
        });
        
        document.dispatchEvent(event);
    }
    
    document.addEventListener('notification', function(event) {
        const { message, type, id } = event.detail;
        console.log(`[${type.toUpperCase()}] ${message} (ID: ${id})`);
    });
    
    createNotification('Welcome back!', 'success');
    createNotification('Please check your email', 'warning');
    */
    
    // Simulate custom events with EventTarget
    class CustomEventEmitter extends EventTarget {
        login(username) {
            const event = new CustomEvent('login', {
                detail: { username, timestamp: Date.now() }
            });
            this.dispatchEvent(event);
        }
        
        logout() {
            const event = new CustomEvent('logout', {
                detail: { timestamp: Date.now() }
            });
            this.dispatchEvent(event);
        }
    }
    
    const emitter = new CustomEventEmitter();
    
    emitter.addEventListener('login', (event) => {
        console.log('Login event:', event.detail);
    });
    
    emitter.addEventListener('logout', (event) => {
        console.log('Logout event:', event.detail);
    });
    
    emitter.login('alice');
    emitter.logout();
}

// Event performance optimization
function demonstrateEventOptimization() {
    console.log("=== Event Performance Optimization ===");
    
    // Debouncing - delay execution until after events stop
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    // Throttling - limit execution frequency
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Usage examples
    const debouncedSearch = debounce(function(query) {
        console.log('Searching for:', query);
    }, 300);
    
    const throttledScroll = throttle(function() {
        console.log('Scroll position updated');
    }, 100);
    
    // Simulate multiple rapid calls
    console.log("Simulating debounced search:");
    debouncedSearch("a");
    debouncedSearch("ab");
    debouncedSearch("abc");
    setTimeout(() => debouncedSearch("abcd"), 100);
    
    console.log("Simulating throttled scroll:");
    for (let i = 0; i < 5; i++) {
        setTimeout(() => throttledScroll(), i * 20);
    }
}

// Event cleanup and memory management
function demonstrateEventCleanup() {
    console.log("=== Event Cleanup ===");
    
    // In browser environment:
    /*
    class Widget {
        constructor(element) {
            this.element = element;
            this.handleClick = this.handleClick.bind(this);
            this.handleResize = this.handleResize.bind(this);
            
            this.init();
        }
        
        init() {
            this.element.addEventListener('click', this.handleClick);
            window.addEventListener('resize', this.handleResize);
        }
        
        handleClick(event) {
            console.log('Widget clicked');
        }
        
        handleResize(event) {
            console.log('Window resized, updating widget');
        }
        
        destroy() {
            // Important: remove event listeners to prevent memory leaks
            this.element.removeEventListener('click', this.handleClick);
            window.removeEventListener('resize', this.handleResize);
            
            // Clear references
            this.element = null;
        }
    }
    
    // Usage
    const widget = new Widget(document.querySelector('#myWidget'));
    
    // When done with widget
    widget.destroy();
    */
    
    // AbortController for easier cleanup (modern approach)
    /*
    const controller = new AbortController();
    const signal = controller.signal;
    
    element.addEventListener('click', handleClick, { signal });
    element.addEventListener('mouseover', handleMouseOver, { signal });
    
    // Remove all listeners at once
    controller.abort();
    */
    
    console.log("Event cleanup patterns demonstrated");
}

// Practical event handling examples
function practicalEventExamples() {
    console.log("=== Practical Event Examples ===");
    
    // Form validation with events
    function createFormValidator() {
        const validators = {
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            required: (value) => value.trim().length > 0,
            minLength: (min) => (value) => value.length >= min
        };
        
        return {
            validate: function(field, value, rules) {
                for (const rule of rules) {
                    const validator = typeof rule === 'string' 
                        ? validators[rule] 
                        : rule;
                    
                    if (!validator(value)) {
                        return { valid: false, rule };
                    }
                }
                return { valid: true };
            }
        };
    }
    
    const validator = createFormValidator();
    
    // Test validation
    console.log("Email validation:", validator.validate('email', 'test@example.com', ['required', 'email']));
    console.log("Invalid email:", validator.validate('email', 'invalid', ['required', 'email']));
    
    // Keyboard shortcut handler
    class KeyboardShortcuts {
        constructor() {
            this.shortcuts = new Map();
            this.init();
        }
        
        init() {
            if (typeof window !== 'undefined') {
                // document.addEventListener('keydown', this.handleKeydown.bind(this));
            }
        }
        
        register(keys, callback, description = '') {
            const keyString = keys.toLowerCase().replace(/\s+/g, '');
            this.shortcuts.set(keyString, { callback, description });
            console.log(`Registered shortcut: ${keys} - ${description}`);
        }
        
        handleKeydown(event) {
            const keys = [];
            if (event.ctrlKey || event.metaKey) keys.push('ctrl');
            if (event.shiftKey) keys.push('shift');
            if (event.altKey) keys.push('alt');
            keys.push(event.key.toLowerCase());
            
            const keyString = keys.join('+');
            const shortcut = this.shortcuts.get(keyString);
            
            if (shortcut) {
                event.preventDefault();
                shortcut.callback(event);
            }
        }
        
        getShortcuts() {
            return Array.from(this.shortcuts.entries()).map(([keys, {description}]) => ({
                keys,
                description
            }));
        }
    }
    
    const shortcuts = new KeyboardShortcuts();
    shortcuts.register('Ctrl+S', () => console.log('Save shortcut triggered'), 'Save document');
    shortcuts.register('Ctrl+Shift+P', () => console.log('Command palette opened'), 'Open command palette');
    
    console.log("Registered shortcuts:", shortcuts.getShortcuts());
}

// Run demonstrations
demonstrateEventMethods();
demonstrateEventObject();
demonstrateEventPropagation();
demonstrateEventControl();
demonstrateEventDelegation();
demonstrateCustomEvents();
demonstrateEventOptimization();
demonstrateEventCleanup();
practicalEventExamples();

// Browser environment check
if (typeof window !== 'undefined') {
    console.log("Running in browser - full event handling available");
} else {
    console.log("Running in Node.js - copy to browser console for DOM events");
}