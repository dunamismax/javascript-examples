// 16 - Asynchronous Programming
// Master callbacks, promises, async/await, and asynchronous patterns

console.log("=== Asynchronous Programming ===");

// Understanding synchronous vs asynchronous
console.log("1. Synchronous code");
console.log("2. This runs after 1");
console.log("3. This runs after 2");

// Asynchronous with setTimeout
setTimeout(() => {
    console.log("4. This runs asynchronously after a delay");
}, 100);

console.log("5. This runs before 4, even though it comes after");

// Callbacks - the traditional way
console.log("\n=== Callbacks ===");

function fetchUserData(userId, callback) {
    console.log(`Fetching user data for ID: ${userId}`);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        const userData = {
            id: userId,
            name: "Alice",
            email: "alice@example.com"
        };
        
        // Simulate occasional errors
        if (userId < 0) {
            callback(new Error("Invalid user ID"), null);
        } else {
            callback(null, userData);
        }
    }, 500);
}

// Using callback
fetchUserData(123, (error, data) => {
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("User data received:", data);
    }
});

// Callback hell - nested callbacks become hard to manage
function fetchUserPosts(userId, callback) {
    setTimeout(() => {
        const posts = [
            { id: 1, title: "First Post", content: "Hello World" },
            { id: 2, title: "Second Post", content: "Learning JavaScript" }
        ];
        callback(null, posts);
    }, 300);
}

function fetchPostComments(postId, callback) {
    setTimeout(() => {
        const comments = [
            { id: 1, text: "Great post!", author: "Bob" },
            { id: 2, text: "Very helpful", author: "Charlie" }
        ];
        callback(null, comments);
    }, 200);
}

// Callback hell example
console.log("\n=== Callback Hell ===");
fetchUserData(123, (userError, userData) => {
    if (userError) {
        console.log("User error:", userError);
        return;
    }
    
    fetchUserPosts(userData.id, (postsError, posts) => {
        if (postsError) {
            console.log("Posts error:", postsError);
            return;
        }
        
        fetchPostComments(posts[0].id, (commentsError, comments) => {
            if (commentsError) {
                console.log("Comments error:", commentsError);
                return;
            }
            
            console.log("All data fetched:", {
                user: userData,
                posts: posts,
                comments: comments
            });
        });
    });
});

// Promises - a better way to handle async operations
console.log("\n=== Promises ===");

function fetchUserDataPromise(userId) {
    return new Promise((resolve, reject) => {
        console.log(`Promise: Fetching user data for ID: ${userId}`);
        
        setTimeout(() => {
            if (userId < 0) {
                reject(new Error("Invalid user ID"));
            } else {
                const userData = {
                    id: userId,
                    name: "Bob",
                    email: "bob@example.com"
                };
                resolve(userData);
            }
        }, 300);
    });
}

function fetchUserPostsPromise(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const posts = [
                { id: 1, title: "Promise Post", content: "Promises are great!" },
                { id: 2, title: "Async Post", content: "Async programming rocks" }
            ];
            resolve(posts);
        }, 200);
    });
}

function fetchPostCommentsPromise(postId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const comments = [
                { id: 1, text: "Promises solve callback hell!", author: "Dave" },
                { id: 2, text: "Much cleaner code", author: "Eve" }
            ];
            resolve(comments);
        }, 150);
    });
}

// Using promises with .then()
fetchUserDataPromise(456)
    .then(userData => {
        console.log("Promise user data:", userData);
        return fetchUserPostsPromise(userData.id);
    })
    .then(posts => {
        console.log("Promise posts:", posts);
        return fetchPostCommentsPromise(posts[0].id);
    })
    .then(comments => {
        console.log("Promise comments:", comments);
    })
    .catch(error => {
        console.log("Promise error:", error.message);
    });

// Promise.all - run multiple promises in parallel
console.log("\n=== Promise.all ===");

const userPromise = fetchUserDataPromise(789);
const postsPromise = fetchUserPostsPromise(789);

Promise.all([userPromise, postsPromise])
    .then(([userData, posts]) => {
        console.log("Promise.all results:", { userData, posts });
    })
    .catch(error => {
        console.log("Promise.all error:", error);
    });

// Promise.race - get result from fastest promise
Promise.race([
    new Promise(resolve => setTimeout(() => resolve("Fast"), 100)),
    new Promise(resolve => setTimeout(() => resolve("Slow"), 200))
])
    .then(result => {
        console.log("Promise.race winner:", result); // "Fast"
    });

// Promise.allSettled - wait for all promises regardless of outcome
Promise.allSettled([
    fetchUserDataPromise(999),
    fetchUserDataPromise(-1), // This will reject
    fetchUserPostsPromise(999)
])
    .then(results => {
        console.log("Promise.allSettled results:");
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index} fulfilled:`, result.value);
            } else {
                console.log(`Promise ${index} rejected:`, result.reason.message);
            }
        });
    });

// Async/Await - modern syntax for promises
console.log("\n=== Async/Await ===");

async function fetchAllUserData(userId) {
    try {
        console.log("Async: Starting data fetch...");
        
        // Sequential execution
        const userData = await fetchUserDataPromise(userId);
        console.log("Async: User data received");
        
        const posts = await fetchUserPostsPromise(userData.id);
        console.log("Async: Posts received");
        
        const comments = await fetchPostCommentsPromise(posts[0].id);
        console.log("Async: Comments received");
        
        return {
            user: userData,
            posts: posts,
            comments: comments
        };
    } catch (error) {
        console.log("Async error:", error.message);
        throw error;
    }
}

// Using async function
fetchAllUserData(555)
    .then(allData => {
        console.log("All async data:", allData);
    })
    .catch(error => {
        console.log("Async function error:", error.message);
    });

// Parallel execution with async/await
async function fetchAllUserDataParallel(userId) {
    try {
        console.log("Async parallel: Starting data fetch...");
        
        // Start all requests simultaneously
        const userPromise = fetchUserDataPromise(userId);
        const postsPromise = fetchUserPostsPromise(userId);
        
        // Wait for both to complete
        const [userData, posts] = await Promise.all([userPromise, postsPromise]);
        
        // Then fetch comments
        const comments = await fetchPostCommentsPromise(posts[0].id);
        
        return {
            user: userData,
            posts: posts,
            comments: comments
        };
    } catch (error) {
        console.log("Async parallel error:", error.message);
        throw error;
    }
}

// Error handling patterns
console.log("\n=== Error Handling Patterns ===");

// Try-catch with async/await
async function safeAsyncOperation() {
    try {
        const result = await fetchUserDataPromise(-1); // Will fail
        return result;
    } catch (error) {
        console.log("Caught error:", error.message);
        return null; // Return default value
    }
}

safeAsyncOperation();

// Multiple catch blocks
async function multipleErrorHandling() {
    try {
        const userData = await fetchUserDataPromise(888);
        const posts = await fetchUserPostsPromise(userData.id);
        return { userData, posts };
    } catch (error) {
        if (error.message.includes("user")) {
            console.log("User-related error:", error.message);
        } else if (error.message.includes("posts")) {
            console.log("Posts-related error:", error.message);
        } else {
            console.log("Unknown error:", error.message);
        }
        throw error; // Re-throw if needed
    }
}

// Creating utility functions
console.log("\n=== Utility Functions ===");

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Timeout wrapper
function withTimeout(promise, timeoutMs) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
}

// Retry function
async function retry(operation, maxAttempts = 3, delayMs = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxAttempts) {
                console.log(`Retrying in ${delayMs}ms...`);
                await delay(delayMs);
            }
        }
    }
    
    throw new Error(`Operation failed after ${maxAttempts} attempts: ${lastError.message}`);
}

// Using utility functions
async function demonstrateUtilities() {
    console.log("Demonstrating utilities...");
    
    // Delay
    await delay(100);
    console.log("Delay completed");
    
    // Timeout
    try {
        await withTimeout(delay(2000), 500); // Will timeout
    } catch (error) {
        console.log("Timeout error:", error.message);
    }
    
    // Retry
    let attemptCount = 0;
    const unreliableOperation = async () => {
        attemptCount++;
        if (attemptCount < 3) {
            throw new Error("Temporary failure");
        }
        return "Success after retries";
    };
    
    try {
        const result = await retry(unreliableOperation, 5, 100);
        console.log("Retry result:", result);
    } catch (error) {
        console.log("Retry failed:", error.message);
    }
}

// Real-world examples
console.log("\n=== Real-world Examples ===");

// API client with error handling and retries
class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Simulate HTTP request
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.8) { // 80% success rate
                    resolve({
                        status: 200,
                        data: { message: "Success", endpoint }
                    });
                } else {
                    reject(new Error("Network error"));
                }
            }, Math.random() * 500);
        });
    }
    
    async get(endpoint) {
        return retry(() => this.request(endpoint), 3, 200);
    }
    
    async post(endpoint, data) {
        return retry(() => this.request(endpoint, { method: 'POST', data }), 2, 300);
    }
}

// Data processing pipeline
async function processUserDataPipeline(userId) {
    console.log("Starting data processing pipeline...");
    
    const api = new APIClient("https://api.example.com");
    
    try {
        // Fetch user data
        const userResponse = await api.get(`/users/${userId}`);
        console.log("User fetched:", userResponse.data);
        
        // Process in parallel
        const [profileData, settingsData] = await Promise.all([
            api.get(`/users/${userId}/profile`),
            api.get(`/users/${userId}/settings`)
        ]);
        
        console.log("Profile and settings fetched");
        
        // Post-process data
        const processedData = {
            userId,
            profile: profileData.data,
            settings: settingsData.data,
            lastUpdated: new Date().toISOString()
        };
        
        return processedData;
    } catch (error) {
        console.log("Pipeline error:", error.message);
        throw error;
    }
}

// Run examples with proper timing
setTimeout(() => {
    demonstrateUtilities();
}, 1000);

setTimeout(() => {
    processUserDataPipeline(12345)
        .then(result => console.log("Pipeline result:", result))
        .catch(error => console.log("Pipeline failed:", error.message));
}, 2000);

// Event loop demonstration
console.log("\n=== Event Loop Understanding ===");

console.log("1 - Synchronous");

setTimeout(() => console.log("2 - setTimeout"), 0);

Promise.resolve().then(() => console.log("3 - Promise"));

console.log("4 - Synchronous");

// Output order: 1, 4, 3, 2
// Microtasks (Promises) have higher priority than macrotasks (setTimeout)