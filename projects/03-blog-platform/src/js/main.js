/**
 * Blog Platform Frontend - Home Page JavaScript
 * 
 * This file demonstrates:
 * - API communication with fetch()
 * - Dynamic DOM content creation
 * - Error handling and user feedback
 * - State management for loading/error states
 * - Event handling and user interactions
 * 
 * Learning Focus:
 * 1. Frontend-backend communication
 * 2. REST API consumption
 * 3. Dynamic content rendering
 * 4. User experience patterns
 * 5. Error handling strategies
 */

// Application state
const appState = {
    posts: [],
    isLoading: false,
    error: null
};

// DOM elements cache
const elements = {
    loadingState: null,
    errorState: null,
    errorMessage: null,
    retryBtn: null,
    postsContainer: null,
    postsCount: null,
    emptyState: null,
    refreshPosts: null
};

/**
 * Initialize the home page
 * Sets up event listeners and loads initial data
 */
function initHomePage() {
    cacheElements();
    setupEventListeners();
    loadPosts();
    
    console.log('Blog Platform home page initialized');
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
    elements.loadingState = document.getElementById('loadingState');
    elements.errorState = document.getElementById('errorState');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.retryBtn = document.getElementById('retryBtn');
    elements.postsContainer = document.getElementById('postsContainer');
    elements.postsCount = document.getElementById('postsCount');
    elements.emptyState = document.getElementById('emptyState');
    elements.refreshPosts = document.getElementById('refreshPosts');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Retry button for error state
    if (elements.retryBtn) {
        elements.retryBtn.addEventListener('click', loadPosts);
    }
    
    // Refresh posts button
    if (elements.refreshPosts) {
        elements.refreshPosts.addEventListener('click', loadPosts);
    }
}

/**
 * Load all blog posts from the API
 * Demonstrates async/await and error handling
 */
async function loadPosts() {
    try {
        setUIState('loading');
        appState.isLoading = true;
        appState.error = null;
        
        // Fetch posts from API
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        const posts = await response.json();
        
        // Update application state
        appState.posts = posts;
        appState.isLoading = false;
        
        // Render posts in UI
        renderPosts(posts);
        updatePostsCount(posts.length);
        
        setUIState('success');
        
    } catch (error) {
        console.error('Failed to load posts:', error);
        
        appState.isLoading = false;
        appState.error = error.message;
        
        showError('Failed to Load Posts', 
            'Unable to connect to the server. Please check your connection and try again.');
    }
}

/**
 * Render posts in the UI
 * Demonstrates dynamic DOM content creation
 */
function renderPosts(posts) {
    // Clear existing content
    elements.postsContainer.innerHTML = '';
    
    // Show empty state if no posts
    if (posts.length === 0) {
        elements.emptyState.classList.remove('hidden');
        return;
    }
    
    elements.emptyState.classList.add('hidden');
    
    // Create and append post cards
    posts.forEach(post => {
        const postCard = createPostCard(post);
        elements.postsContainer.appendChild(postCard);
    });
}

/**
 * Create a post card element
 * Demonstrates DOM element creation and event handling
 */
function createPostCard(post) {
    // Create main container
    const card = document.createElement('article');
    card.className = 'post-card';
    card.dataset.slug = post.slug;
    
    // Add click handler for navigation
    card.addEventListener('click', () => {
        window.location.href = `/post/${post.slug}`;
    });
    
    // Create header section
    const header = document.createElement('header');
    header.className = 'post-card-header';
    
    const title = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = `/post/${post.slug}`;
    titleLink.textContent = post.title;
    titleLink.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
    });
    title.appendChild(titleLink);
    
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.innerHTML = `
        <span class="post-author">By <strong>${escapeHtml(post.author)}</strong></span>
        <span class="post-date">${post.created_at}</span>
        <span class="post-comments">${post.comment_count || 0} comments</span>
    `;
    
    header.appendChild(title);
    header.appendChild(meta);
    
    // Create excerpt section
    const excerpt = document.createElement('div');
    excerpt.className = 'post-excerpt';
    excerpt.textContent = post.excerpt || 'No excerpt available.';
    
    // Create footer section
    const footer = document.createElement('footer');
    footer.className = 'post-card-footer';
    
    const readMore = document.createElement('a');
    readMore.href = `/post/${post.slug}`;
    readMore.className = 'read-more';
    readMore.textContent = 'Read More →';
    readMore.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
    });
    
    const commentsIndicator = document.createElement('div');
    commentsIndicator.className = 'comments-indicator';
    commentsIndicator.innerHTML = `
        <span>💬</span>
        <span>${post.comment_count || 0}</span>
    `;
    
    footer.appendChild(readMore);
    footer.appendChild(commentsIndicator);
    
    // Assemble the card
    card.appendChild(header);
    card.appendChild(excerpt);
    card.appendChild(footer);
    
    return card;
}

/**
 * Update posts count display
 */
function updatePostsCount(count) {
    if (elements.postsCount) {
        const text = count === 1 ? '1 post' : `${count} posts`;
        elements.postsCount.textContent = text;
    }
}

/**
 * Set UI state (loading, error, success)
 * Demonstrates state-based UI management
 */
function setUIState(state) {
    // Hide all state elements
    elements.loadingState?.classList.add('hidden');
    elements.errorState?.classList.add('hidden');
    
    switch (state) {
        case 'loading':
            elements.loadingState?.classList.remove('hidden');
            break;
        case 'error':
            elements.errorState?.classList.remove('hidden');
            break;
        case 'success':
            // Content is visible by default
            break;
    }
}

/**
 * Show error message
 */
function showError(title, message) {
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message;
    }
    setUIState('error');
}

/**
 * Escape HTML to prevent XSS attacks
 * Demonstrates security best practices
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// API Demo Functions - for learning purposes
/**
 * Test GET /api/posts endpoint
 * Demonstrates API testing and debugging
 */
async function testGetPosts() {
    const resultElement = document.getElementById('apiResult1');
    if (!resultElement) return;
    
    try {
        resultElement.textContent = 'Loading...';
        
        const response = await fetch('/api/posts');
        const data = await response.json();
        
        resultElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
}

/**
 * Test POST /api/posts endpoint
 * Demonstrates form data submission
 */
async function testCreatePost() {
    const resultElement = document.getElementById('apiResult2');
    const titleInput = document.getElementById('apiTitle');
    const authorInput = document.getElementById('apiAuthor');
    const contentInput = document.getElementById('apiContent');
    
    if (!resultElement || !titleInput || !authorInput || !contentInput) return;
    
    try {
        resultElement.textContent = 'Creating post...';
        
        const postData = {
            title: titleInput.value || 'Test Post',
            author: authorInput.value || 'API Tester',
            content: contentInput.value || 'This is a test post created via the API.'
        };
        
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            resultElement.textContent = JSON.stringify(data, null, 2);
            // Clear form
            titleInput.value = '';
            authorInput.value = '';
            contentInput.value = '';
            // Refresh posts list
            loadPosts();
        } else {
            resultElement.textContent = `Error: ${data.error || 'Failed to create post'}`;
        }
        
    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
}

// Make functions globally available for HTML onclick handlers
window.testGetPosts = testGetPosts;
window.testCreatePost = testCreatePost;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initHomePage);