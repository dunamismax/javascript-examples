// 14 - DOM Manipulation
// Learn how to interact with HTML elements using JavaScript
// Note: This script assumes it's running in a browser environment

// Creating a simple HTML structure for demonstration
console.log("=== DOM Manipulation Examples ===");
console.log("Note: These examples work in a browser environment");

// Document selection methods
console.log("=== Element Selection ===");

// Basic selection methods
function demonstrateSelection() {
    // Select by ID
    // const element = document.getElementById('myId');
    
    // Select by class name (returns HTMLCollection)
    // const elements = document.getElementsByClassName('myClass');
    
    // Select by tag name
    // const divs = document.getElementsByTagName('div');
    
    // Modern query selectors (preferred)
    // const element = document.querySelector('#myId'); // First match
    // const elements = document.querySelectorAll('.myClass'); // All matches
    
    console.log("Selection methods demonstrated (see browser console)");
}

// Creating and modifying elements
function createAndModifyElements() {
    console.log("=== Creating and Modifying Elements ===");
    
    // In browser environment, you would do:
    /*
    // Create new element
    const div = document.createElement('div');
    div.className = 'my-div';
    div.id = 'dynamic-div';
    div.textContent = 'Hello from JavaScript!';
    
    // Set attributes
    div.setAttribute('data-info', 'created by JS');
    div.style.backgroundColor = 'lightblue';
    div.style.padding = '10px';
    div.style.margin = '5px';
    
    // Add to document
    document.body.appendChild(div);
    
    // Create complex structure
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Dynamic Content</h2>
        <p>This was created with JavaScript</p>
        <button onclick="alert('Clicked!')">Click me</button>
    `;
    
    document.body.appendChild(container);
    */
    
    console.log("Element creation demonstrated");
}

// Event handling
function demonstrateEventHandling() {
    console.log("=== Event Handling ===");
    
    // In browser environment:
    /*
    // Method 1: Direct assignment
    button.onclick = function() {
        console.log('Button clicked!');
    };
    
    // Method 2: addEventListener (preferred)
    button.addEventListener('click', function(event) {
        console.log('Event:', event);
        console.log('Target:', event.target);
        console.log('Type:', event.type);
    });
    
    // Multiple event listeners
    button.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'yellow';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.backgroundColor = '';
    });
    
    // Remove event listener
    function handleClick() {
        console.log('Will be removed');
    }
    
    button.addEventListener('click', handleClick);
    button.removeEventListener('click', handleClick);
    */
    
    console.log("Event handling demonstrated");
}

// Common DOM manipulation patterns
const DOMHelpers = {
    // Create element with properties
    createElement: function(tag, properties = {}) {
        console.log(`Creating ${tag} element with properties:`, properties);
        
        // In browser:
        /*
        const element = document.createElement(tag);
        
        Object.keys(properties).forEach(key => {
            if (key === 'textContent' || key === 'innerHTML') {
                element[key] = properties[key];
            } else if (key === 'style') {
                Object.assign(element.style, properties[key]);
            } else if (key === 'events') {
                Object.keys(properties[key]).forEach(eventType => {
                    element.addEventListener(eventType, properties[key][eventType]);
                });
            } else {
                element.setAttribute(key, properties[key]);
            }
        });
        
        return element;
        */
        
        return { tag, properties }; // Mock return for demonstration
    },
    
    // Toggle class
    toggleClass: function(element, className) {
        console.log(`Toggling class ${className}`);
        
        // In browser:
        /*
        element.classList.toggle(className);
        */
    },
    
    // Show/hide elements
    show: function(element) {
        console.log("Showing element");
        // element.style.display = 'block';
    },
    
    hide: function(element) {
        console.log("Hiding element");
        // element.style.display = 'none';
    },
    
    // Get/set data attributes
    setData: function(element, key, value) {
        console.log(`Setting data-${key} to ${value}`);
        // element.setAttribute(`data-${key}`, value);
    },
    
    getData: function(element, key) {
        console.log(`Getting data-${key}`);
        // return element.getAttribute(`data-${key}`);
        return "mock-data";
    }
};

// Form handling
function demonstrateFormHandling() {
    console.log("=== Form Handling ===");
    
    // In browser environment:
    /*
    const form = document.querySelector('#myForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        
        // Get form data
        const formData = new FormData(form);
        
        // Or get individual field values
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        
        // Validation
        if (!name.trim()) {
            alert('Name is required');
            return;
        }
        
        if (!email.includes('@')) {
            alert('Valid email is required');
            return;
        }
        
        // Process form data
        console.log('Form submitted:', { name, email });
    });
    
    // Real-time validation
    const emailInput = document.querySelector('#email');
    emailInput.addEventListener('input', function() {
        const isValid = this.value.includes('@');
        this.style.borderColor = isValid ? 'green' : 'red';
    });
    */
    
    console.log("Form handling demonstrated");
}

// Dynamic content updates
function demonstrateDynamicUpdates() {
    console.log("=== Dynamic Content Updates ===");
    
    // Mock data
    const users = [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" },
        { id: 3, name: "Charlie", email: "charlie@example.com" }
    ];
    
    // Create user list
    function createUserList(users) {
        console.log("Creating user list for:", users);
        
        // In browser:
        /*
        const container = document.querySelector('#user-list');
        container.innerHTML = ''; // Clear existing content
        
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <h3>${user.name}</h3>
                <p>Email: ${user.email}</p>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            `;
            
            container.appendChild(userDiv);
        });
        */
    }
    
    // Filter users
    function filterUsers(searchTerm) {
        console.log("Filtering users by:", searchTerm);
        
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        createUserList(filtered);
        return filtered;
    }
    
    createUserList(users);
    const filtered = filterUsers("alice");
    console.log("Filtered users:", filtered);
}

// Animation and transitions
function demonstrateAnimations() {
    console.log("=== Animations and Transitions ===");
    
    // CSS transition helper
    function fadeIn(element, duration = 300) {
        console.log(`Fading in element over ${duration}ms`);
        
        // In browser:
        /*
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
        */
    }
    
    function slideDown(element, duration = 300) {
        console.log(`Sliding down element over ${duration}ms`);
        
        // In browser:
        /*
        const height = element.scrollHeight;
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease-in-out`;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.height = height + 'px';
        }, 10);
        
        setTimeout(() => {
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration);
        */
    }
    
    // JavaScript animation
    function animateWidth(element, targetWidth, duration = 1000) {
        console.log(`Animating width to ${targetWidth}px over ${duration}ms`);
        
        // In browser:
        /*
        const startWidth = element.offsetWidth;
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-in-out)
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const currentWidth = startWidth + (targetWidth - startWidth) * eased;
            element.style.width = currentWidth + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
        */
    }
}

// Performance optimization
function demonstratePerformanceOptimization() {
    console.log("=== Performance Optimization ===");
    
    // Document fragment for batch DOM updates
    function createManyElements(count) {
        console.log(`Creating ${count} elements efficiently`);
        
        // In browser:
        /*
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.textContent = `Item ${i + 1}`;
            fragment.appendChild(div);
        }
        
        // Single DOM update
        document.querySelector('#container').appendChild(fragment);
        */
    }
    
    // Debounced event handler
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttled event handler
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
    const debouncedSearch = debounce(function(searchTerm) {
        console.log("Searching for:", searchTerm);
    }, 300);
    
    const throttledScroll = throttle(function() {
        console.log("Scroll event triggered");
    }, 100);
    
    console.log("Performance helpers created");
}

// Browser environment check
if (typeof window !== 'undefined') {
    console.log("Running in browser - DOM manipulation available");
    
    // You can uncomment these in a browser environment
    // demonstrateSelection();
    // createAndModifyElements();
    // demonstrateEventHandling();
    // demonstrateFormHandling();
} else {
    console.log("Running in Node.js - DOM not available");
    console.log("Copy this code to a browser console to see DOM manipulation in action");
}

// Run non-DOM dependent demonstrations
demonstrateDynamicUpdates();
demonstrateAnimations();
demonstratePerformanceOptimization();

// Export helpers for use in browser
if (typeof window !== 'undefined') {
    window.DOMHelpers = DOMHelpers;
}