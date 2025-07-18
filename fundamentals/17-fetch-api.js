// 17 - Fetch API and HTTP Requests
// Master modern HTTP requests, REST APIs, and data fetching patterns

console.log("=== Fetch API and HTTP Requests ===");

// Basic fetch usage (browser environment)
if (typeof fetch !== 'undefined') {
    console.log("Fetch API is available");
} else {
    console.log("Fetch API not available - simulating for demonstration");
}

// Simulated fetch for Node.js environment
function simulatedFetch(url, options = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const response = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Map([['content-type', 'application/json']]),
                json: () => Promise.resolve({
                    url,
                    method: options.method || 'GET',
                    data: options.body ? JSON.parse(options.body) : null,
                    timestamp: new Date().toISOString()
                }),
                text: () => Promise.resolve(JSON.stringify({
                    url,
                    method: options.method || 'GET'
                })),
                blob: () => Promise.resolve(new Blob(['mock data'])),
                clone: () => ({ ...response })
            };
            resolve(response);
        }, Math.random() * 500 + 100);
    });
}

// Use real fetch in browser, simulated in Node.js
const fetchAPI = typeof fetch !== 'undefined' ? fetch : simulatedFetch;

// Basic GET request
console.log("\n=== Basic Fetch Examples ===");

async function basicFetchExample() {
    try {
        console.log("Making basic GET request...");
        const response = await fetchAPI('https://jsonplaceholder.typicode.com/users/1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Basic fetch result:", data);
    } catch (error) {
        console.log("Basic fetch error:", error.message);
    }
}

// POST request with JSON data
async function postExample() {
    try {
        console.log("Making POST request...");
        const response = await fetchAPI('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'New Post',
                body: 'This is a new post created with fetch',
                userId: 1
            })
        });
        
        const data = await response.json();
        console.log("POST result:", data);
    } catch (error) {
        console.log("POST error:", error.message);
    }
}

// Different HTTP methods
async function httpMethodsExample() {
    console.log("\n=== HTTP Methods ===");
    
    const baseURL = 'https://jsonplaceholder.typicode.com/posts/1';
    
    // GET
    const getResponse = await fetchAPI(baseURL);
    console.log("GET response status:", getResponse.status);
    
    // PUT (update entire resource)
    const putResponse = await fetchAPI(baseURL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: 1,
            title: 'Updated Post',
            body: 'Updated content',
            userId: 1
        })
    });
    console.log("PUT response status:", putResponse.status);
    
    // PATCH (partial update)
    const patchResponse = await fetchAPI(baseURL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'Partially Updated Title'
        })
    });
    console.log("PATCH response status:", patchResponse.status);
    
    // DELETE
    const deleteResponse = await fetchAPI(baseURL, {
        method: 'DELETE'
    });
    console.log("DELETE response status:", deleteResponse.status);
}

// Working with different response types
async function responseTypesExample() {
    console.log("\n=== Response Types ===");
    
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    
    try {
        const response = await fetchAPI(url);
        
        // JSON response (most common)
        const jsonData = await response.clone().json();
        console.log("JSON data:", jsonData);
        
        // Text response
        const textData = await response.clone().text();
        console.log("Text data length:", textData.length);
        
        // Blob response (for files, images, etc.)
        const blobData = await response.clone().blob();
        console.log("Blob size:", blobData.size);
        
        // Response headers
        console.log("Content-Type header:", response.headers.get('content-type'));
        
    } catch (error) {
        console.log("Response types error:", error.message);
    }
}

// Error handling patterns
async function errorHandlingExample() {
    console.log("\n=== Error Handling ===");
    
    async function fetchWithErrorHandling(url) {
        try {
            const response = await fetchAPI(url);
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Check content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
            }
            
            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError') {
                // Network error
                console.log("Network error:", error.message);
            } else {
                // HTTP error or JSON parsing error
                console.log("Request error:", error.message);
            }
            throw error;
        }
    }
    
    // Test with different scenarios
    try {
        await fetchWithErrorHandling('https://jsonplaceholder.typicode.com/posts/1');
        console.log("Success case handled");
    } catch (error) {
        console.log("Error case handled");
    }
}

// Request timeout implementation
function fetchWithTimeout(url, options = {}, timeout = 5000) {
    return Promise.race([
        fetchAPI(url, options),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

// Retry mechanism
async function fetchWithRetry(url, options = {}, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries}`);
            const response = await fetchWithTimeout(url, options, 5000);
            
            if (response.ok) {
                return response;
            }
            
            // Don't retry for client errors (4xx)
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`Client error: ${response.status}`);
            }
            
            throw new Error(`Server error: ${response.status}`);
        } catch (error) {
            lastError = error;
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
}

// API Client class
class APIClient {
    constructor(baseURL, defaultHeaders = {}) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        };
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetchWithRetry(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.log(`API request failed: ${error.message}`);
            throw error;
        }
    }
    
    get(endpoint, params = {}) {
        const searchParams = new URLSearchParams(params);
        const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;
        return this.request(url);
    }
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
    
    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Using the API Client
async function apiClientExample() {
    console.log("\n=== API Client Example ===");
    
    const api = new APIClient('https://jsonplaceholder.typicode.com');
    
    try {
        // GET with parameters
        const posts = await api.get('/posts', { userId: 1 });
        console.log("Posts fetched:", posts.length);
        
        // POST new data
        const newPost = await api.post('/posts', {
            title: 'New Post via API Client',
            body: 'Content of the new post',
            userId: 1
        });
        console.log("New post created:", newPost);
        
        // UPDATE data
        const updatedPost = await api.put('/posts/1', {
            id: 1,
            title: 'Updated Post Title',
            body: 'Updated content',
            userId: 1
        });
        console.log("Post updated:", updatedPost);
        
    } catch (error) {
        console.log("API client error:", error.message);
    }
}

// Handling authentication
class AuthenticatedAPIClient extends APIClient {
    constructor(baseURL, token) {
        super(baseURL, {
            'Authorization': `Bearer ${token}`
        });
        this.token = token;
    }
    
    setToken(token) {
        this.token = token;
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    clearToken() {
        this.token = null;
        delete this.defaultHeaders['Authorization'];
    }
    
    async refreshToken() {
        try {
            const response = await this.request('/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            this.setToken(response.token);
            return response.token;
        } catch (error) {
            console.log("Token refresh failed:", error.message);
            this.clearToken();
            throw error;
        }
    }
    
    async request(endpoint, options = {}) {
        try {
            return await super.request(endpoint, options);
        } catch (error) {
            // Try to refresh token on 401 error
            if (error.message.includes('401') && this.token) {
                try {
                    await this.refreshToken();
                    return await super.request(endpoint, options);
                } catch (refreshError) {
                    throw error; // Throw original error if refresh fails
                }
            }
            throw error;
        }
    }
}

// File upload example
async function fileUploadExample() {
    console.log("\n=== File Upload Example ===");
    
    // Simulated file upload
    function simulateFileUpload(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', 'Uploaded via fetch');
        
        return fetchAPI('/upload', {
            method: 'POST',
            body: formData
            // Note: Don't set Content-Type header for FormData
        });
    }
    
    // In browser environment with actual file:
    /*
    const fileInput = document.querySelector('#fileInput');
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const response = await simulateFileUpload(file);
                const result = await response.json();
                console.log('Upload successful:', result);
            } catch (error) {
                console.log('Upload failed:', error.message);
            }
        }
    });
    */
    
    console.log("File upload pattern demonstrated");
}

// Pagination helper
async function paginatedFetch(url, pageSize = 10) {
    const results = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        try {
            const response = await fetchAPI(`${url}?_page=${page}&_limit=${pageSize}`);
            const data = await response.json();
            
            if (data.length === 0) {
                hasMore = false;
            } else {
                results.push(...data);
                page++;
                
                // Prevent infinite loops
                if (page > 10) {
                    console.log("Reached pagination limit");
                    hasMore = false;
                }
            }
        } catch (error) {
            console.log("Pagination error:", error.message);
            break;
        }
    }
    
    return results;
}

// Real-time data with Server-Sent Events
function setupServerSentEvents() {
    console.log("\n=== Server-Sent Events ===");
    
    // In browser environment:
    /*
    const eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('SSE message:', data);
    };
    
    eventSource.onerror = function(event) {
        console.log('SSE error:', event);
    };
    
    eventSource.addEventListener('custom-event', function(event) {
        const data = JSON.parse(event.data);
        console.log('Custom SSE event:', data);
    });
    
    // Close connection when done
    // eventSource.close();
    */
    
    console.log("Server-Sent Events pattern demonstrated");
}

// Run examples
setTimeout(basicFetchExample, 100);
setTimeout(postExample, 300);
setTimeout(httpMethodsExample, 500);
setTimeout(responseTypesExample, 700);
setTimeout(errorHandlingExample, 900);
setTimeout(apiClientExample, 1100);
setTimeout(fileUploadExample, 1300);
setTimeout(setupServerSentEvents, 1500);

// Test pagination
setTimeout(async () => {
    try {
        const allPosts = await paginatedFetch('https://jsonplaceholder.typicode.com/posts', 5);
        console.log("Paginated fetch result:", allPosts.length, "items");
    } catch (error) {
        console.log("Pagination test error:", error.message);
    }
}, 1700);

// Environment check
if (typeof window !== 'undefined') {
    console.log("Running in browser - full Fetch API available");
} else {
    console.log("Running in Node.js - using simulated fetch for demonstration");
}