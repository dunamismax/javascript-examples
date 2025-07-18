/**
 * Blog Platform Frontend - Individual Post Page JavaScript
 * 
 * This file demonstrates:
 * - URL parameter extraction
 * - API data fetching for single resources
 * - Form handling and validation
 * - Dynamic comment management
 * - Real-time UI updates
 * 
 * Learning Focus:
 * 1. Single-page application patterns
 * 2. Form validation and submission
 * 3. Real-time content updates
 * 4. URL routing and parameters
 * 5. User interaction handling
 */

// Application state for post page
const postState = {
    currentPost: null,
    comments: [],
    isLoading: false,
    error: null
};

// DOM elements cache
const elements = {
    loadingState: null,
    errorState: null,
    errorMessage: null,
    postContent: null,
    commentsSection: null,
    postTitle: null,
    postAuthor: null,
    postDate: null,
    postCommentsCount: null,
    postBody: null,
    commentForm: null,
    commentsList: null,
    noComments: null,
    commentsCount: null,
    commentAuthor: null,
    commentContent: null,
    charCount: null,
    sharePost: null
};

/**
 * Initialize the post page
 */
function initPostPage() {
    cacheElements();
    setupEventListeners();
    
    // Extract post slug from URL
    const slug = extractSlugFromURL();
    if (slug) {
        loadPost(slug);
    } else {
        showError('Invalid URL', 'No post specified in the URL.');
    }
    
    console.log('Blog Platform post page initialized');
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements.loadingState = document.getElementById('loadingState');
    elements.errorState = document.getElementById('errorState');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.postContent = document.getElementById('postContent');
    elements.commentsSection = document.getElementById('commentsSection');
    
    // Post elements
    elements.postTitle = document.getElementById('postTitle');
    elements.postAuthor = document.getElementById('postAuthor');
    elements.postDate = document.getElementById('postDate');
    elements.postCommentsCount = document.getElementById('postCommentsCount');
    elements.postBody = document.getElementById('postBody');
    
    // Comment elements
    elements.commentForm = document.getElementById('commentForm');
    elements.commentsList = document.getElementById('commentsList');
    elements.noComments = document.getElementById('noComments');
    elements.commentsCount = document.getElementById('commentsCount');
    elements.commentAuthor = document.getElementById('commentAuthor');
    elements.commentContent = document.getElementById('commentContent');
    elements.charCount = document.getElementById('charCount');
    
    // Action elements
    elements.sharePost = document.getElementById('sharePost');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Comment form submission
    if (elements.commentForm) {
        elements.commentForm.addEventListener('submit', handleCommentSubmission);
    }
    
    // Character counter for comment content
    if (elements.commentContent) {
        elements.commentContent.addEventListener('input', updateCharacterCounter);
    }
    
    // Share post button
    if (elements.sharePost) {
        elements.sharePost.addEventListener('click', handleSharePost);
    }
}

/**
 * Extract post slug from current URL
 * Demonstrates URL parsing and routing
 */
function extractSlugFromURL() {
    const pathParts = window.location.pathname.split('/');
    // URL format: /post/slug-here
    return pathParts[2] || null;
}

/**
 * Load post data from API
 * Demonstrates async data fetching and error handling
 */
async function loadPost(slug) {
    try {
        setUIState('loading');
        postState.isLoading = true;
        postState.error = null;
        
        // Fetch post data
        const response = await fetch(`/api/posts/${encodeURIComponent(slug)}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Post not found');
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }
        }
        
        const post = await response.json();
        
        // Update state
        postState.currentPost = post;
        postState.comments = post.comments || [];
        postState.isLoading = false;
        
        // Render post and comments
        renderPost(post);
        renderComments(post.comments || []);
        
        // Update page title
        document.title = `${post.title} - Blog Platform`;
        
        setUIState('success');
        
    } catch (error) {
        console.error('Failed to load post:', error);
        
        postState.isLoading = false;
        postState.error = error.message;
        
        const errorMessage = error.message === 'Post not found' 
            ? 'The requested post could not be found. It may have been deleted or the URL is incorrect.'
            : 'Unable to load the post. Please check your connection and try again.';
            
        showError('Post Not Found', errorMessage);
    }
}

/**
 * Render post content in the UI
 * Demonstrates content rendering and HTML sanitization
 */
function renderPost(post) {
    // Update post header
    elements.postTitle.textContent = post.title;
    elements.postAuthor.textContent = post.author;
    elements.postDate.textContent = post.created_at;
    
    // Update comments count
    const commentCount = post.comments ? post.comments.length : 0;
    const commentText = commentCount === 1 ? '1 comment' : `${commentCount} comments`;
    elements.postCommentsCount.textContent = commentText;
    
    // Render post content (allow basic HTML)
    elements.postBody.innerHTML = sanitizeHTML(post.content);
}

/**
 * Render comments list
 * Demonstrates dynamic list rendering
 */
function renderComments(comments) {
    // Clear existing comments
    elements.commentsList.innerHTML = '';
    
    // Update comments count
    const count = comments.length;
    elements.commentsCount.textContent = count === 1 ? '1 comment' : `${count} comments`;
    
    // Show/hide no comments state
    if (comments.length === 0) {
        elements.noComments.classList.remove('hidden');
    } else {
        elements.noComments.classList.add('hidden');
        
        // Render each comment
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            elements.commentsList.appendChild(commentElement);
        });
    }
}

/**
 * Create a comment DOM element
 * Demonstrates DOM element creation and data binding
 */
function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.dataset.commentId = comment.id;
    
    commentDiv.innerHTML = `
        <header class="comment-header">
            <span class="comment-author">${escapeHtml(comment.author)}</span>
            <span class="comment-date">${comment.created_at}</span>
        </header>
        <div class="comment-content">${escapeHtml(comment.content)}</div>
    `;
    
    return commentDiv;
}

/**
 * Handle comment form submission
 * Demonstrates form validation and API submission
 */
async function handleCommentSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const author = formData.get('author').trim();
    const content = formData.get('content').trim();
    
    // Client-side validation
    if (!author || author.length < 2) {
        alert('Please enter your name (at least 2 characters).');
        elements.commentAuthor.focus();
        return;
    }
    
    if (!content || content.length < 5) {
        alert('Please enter a comment (at least 5 characters).');
        elements.commentContent.focus();
        return;
    }
    
    if (content.length > 500) {
        alert('Comment is too long (maximum 500 characters).');
        elements.commentContent.focus();
        return;
    }
    
    try {
        // Disable form during submission
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';
        
        // Submit comment to API
        const slug = postState.currentPost.slug;
        const response = await fetch(`/api/posts/${encodeURIComponent(slug)}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ author, content })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Add new comment to state and UI
            const newComment = result.comment;
            postState.comments.push(newComment);
            
            // Re-render comments
            renderComments(postState.comments);
            
            // Clear form
            elements.commentForm.reset();
            updateCharacterCounter();
            
            // Show success feedback
            showSuccessMessage('Comment posted successfully!');
            
            // Update post comments count
            const newCount = postState.comments.length;
            const commentText = newCount === 1 ? '1 comment' : `${newCount} comments`;
            elements.postCommentsCount.textContent = commentText;
            
        } else {
            // Show error message
            alert(`Failed to post comment: ${result.error || 'Unknown error'}`);
        }
        
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
    } catch (error) {
        console.error('Failed to post comment:', error);
        alert('Failed to post comment. Please check your connection and try again.');
        
        // Re-enable form
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Comment';
    }
}

/**
 * Update character counter for comment content
 * Demonstrates real-time input validation
 */
function updateCharacterCounter() {
    if (elements.commentContent && elements.charCount) {
        const currentLength = elements.commentContent.value.length;
        elements.charCount.textContent = currentLength;
        
        // Change color based on character count
        if (currentLength > 500) {
            elements.charCount.style.color = '#dc3545'; // Red
        } else if (currentLength > 400) {
            elements.charCount.style.color = '#ffc107'; // Yellow
        } else {
            elements.charCount.style.color = '#666'; // Default
        }
    }
}

/**
 * Handle share post functionality
 * Demonstrates Web APIs usage
 */
function handleSharePost() {
    const post = postState.currentPost;
    if (!post) return;
    
    const shareData = {
        title: post.title,
        text: post.excerpt || 'Check out this blog post!',
        url: window.location.href
    };
    
    // Use Web Share API if available
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Post shared successfully'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showSuccessMessage('Post URL copied to clipboard!');
            })
            .catch(() => {
                // Final fallback: select URL for manual copying
                prompt('Copy this URL to share the post:', window.location.href);
            });
    }
}

/**
 * Set UI state (loading, error, success)
 */
function setUIState(state) {
    // Hide all state elements
    elements.loadingState?.classList.add('hidden');
    elements.errorState?.classList.add('hidden');
    elements.postContent?.classList.add('hidden');
    elements.commentsSection?.classList.add('hidden');
    
    switch (state) {
        case 'loading':
            elements.loadingState?.classList.remove('hidden');
            break;
        case 'error':
            elements.errorState?.classList.remove('hidden');
            break;
        case 'success':
            elements.postContent?.classList.remove('hidden');
            elements.commentsSection?.classList.remove('hidden');
            break;
    }
}

/**
 * Show error message
 */
function showError(title, message) {
    const errorTitle = document.getElementById('errorTitle');
    if (errorTitle) {
        errorTitle.textContent = title;
    }
    
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message;
    }
    
    setUIState('error');
}

/**
 * Show temporary success message
 * Demonstrates user feedback patterns
 */
function showSuccessMessage(message) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Basic HTML sanitization (allow only safe tags)
 * In production, use a proper HTML sanitization library
 */
function sanitizeHTML(html) {
    // This is a basic implementation for learning purposes
    // In production, use DOMPurify or similar library
    const allowedTags = ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br'];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove script tags and other dangerous elements
    const scripts = tempDiv.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach(script => script.remove());
    
    return tempDiv.innerHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPostPage);