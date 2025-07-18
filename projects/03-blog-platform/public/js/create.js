/**
 * Blog Platform Frontend - Create Post Page JavaScript
 * 
 * This file demonstrates:
 * - Form validation and user experience
 * - Real-time content preview
 * - Character counting and input feedback
 * - Form state management
 * - POST request handling
 * 
 * Learning Focus:
 * 1. Form validation patterns
 * 2. Real-time user feedback
 * 3. Form state management
 * 4. Content preview functionality
 * 5. Success/error handling flows
 */

// Application state for create post page
const createPostState = {
    isSubmitting: false,
    lastCreatedPost: null,
    formData: {
        title: '',
        author: '',
        content: ''
    }
};

// DOM elements cache
const elements = {
    createPostForm: null,
    postTitle: null,
    postAuthor: null,
    postContent: null,
    contentCharCount: null,
    contentPreview: null,
    submitBtn: null,
    successMessage: null,
    errorMessage: null,
    errorText: null,
    viewPostBtn: null,
    createAnotherBtn: null,
    retryBtn: null
};

/**
 * Initialize the create post page
 */
function initCreatePostPage() {
    cacheElements();
    setupEventListeners();
    loadSavedData();
    updatePreview();
    
    console.log('Blog Platform create post page initialized');
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements.createPostForm = document.getElementById('createPostForm');
    elements.postTitle = document.getElementById('postTitle');
    elements.postAuthor = document.getElementById('postAuthor');
    elements.postContent = document.getElementById('postContent');
    elements.contentCharCount = document.getElementById('contentCharCount');
    elements.contentPreview = document.getElementById('contentPreview');
    elements.submitBtn = document.getElementById('submitBtn');
    elements.successMessage = document.getElementById('successMessage');
    elements.errorMessage = document.getElementById('errorMessage');
    elements.errorText = document.getElementById('errorText');
    elements.viewPostBtn = document.getElementById('viewPostBtn');
    elements.createAnotherBtn = document.getElementById('createAnotherBtn');
    elements.retryBtn = document.getElementById('retryBtn');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Form submission
    if (elements.createPostForm) {
        elements.createPostForm.addEventListener('submit', handleFormSubmission);
        elements.createPostForm.addEventListener('reset', handleFormReset);
    }
    
    // Real-time input handlers
    if (elements.postTitle) {
        elements.postTitle.addEventListener('input', handleTitleInput);
    }
    
    if (elements.postAuthor) {
        elements.postAuthor.addEventListener('input', handleAuthorInput);
    }
    
    if (elements.postContent) {
        elements.postContent.addEventListener('input', handleContentInput);
    }
    
    // Success message actions
    if (elements.viewPostBtn) {
        elements.viewPostBtn.addEventListener('click', handleViewPost);
    }
    
    if (elements.createAnotherBtn) {
        elements.createAnotherBtn.addEventListener('click', handleCreateAnother);
    }
    
    if (elements.retryBtn) {
        elements.retryBtn.addEventListener('click', handleRetry);
    }
    
    // Auto-save functionality (save form data locally)
    window.addEventListener('beforeunload', saveFormData);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Handle form submission
 * Demonstrates comprehensive form handling
 */
async function handleFormSubmission(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (createPostState.isSubmitting) {
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const postData = {
        title: formData.get('title').trim(),
        author: formData.get('author').trim(),
        content: formData.get('content').trim()
    };
    
    // Validate form data
    const validationError = validatePostData(postData);
    if (validationError) {
        alert(validationError);
        return;
    }
    
    try {
        // Set submitting state
        createPostState.isSubmitting = true;
        setSubmittingState(true);
        
        // Submit to API
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Success!
            createPostState.lastCreatedPost = result.post;
            showSuccessState();
            clearSavedData(); // Clear auto-saved data
        } else {
            // API error
            throw new Error(result.error || 'Failed to create post');
        }
        
    } catch (error) {
        console.error('Failed to create post:', error);
        showErrorState(error.message);
    } finally {
        createPostState.isSubmitting = false;
        setSubmittingState(false);
    }
}

/**
 * Validate post data
 * Demonstrates client-side validation patterns
 */
function validatePostData(data) {
    // Title validation
    if (!data.title) {
        return 'Title is required.';
    }
    if (data.title.length < 3) {
        return 'Title must be at least 3 characters long.';
    }
    if (data.title.length > 200) {
        return 'Title must be no more than 200 characters long.';
    }
    
    // Author validation
    if (!data.author) {
        return 'Author name is required.';
    }
    if (data.author.length > 50) {
        return 'Author name must be no more than 50 characters long.';
    }
    
    // Content validation
    if (!data.content) {
        return 'Post content is required.';
    }
    if (data.content.length < 10) {
        return 'Post content must be at least 10 characters long.';
    }
    
    return null; // No errors
}

/**
 * Handle title input changes
 * Demonstrates real-time validation feedback
 */
function handleTitleInput(e) {
    const title = e.target.value;
    createPostState.formData.title = title;
    
    // Update character feedback
    const length = title.length;
    if (length > 180) {
        e.target.style.borderColor = length > 200 ? '#dc3545' : '#ffc107';
    } else {
        e.target.style.borderColor = '#e9ecef';
    }
    
    saveFormData();
}

/**
 * Handle author input changes
 */
function handleAuthorInput(e) {
    const author = e.target.value;
    createPostState.formData.author = author;
    
    // Update character feedback
    if (author.length > 45) {
        e.target.style.borderColor = author.length > 50 ? '#dc3545' : '#ffc107';
    } else {
        e.target.style.borderColor = '#e9ecef';
    }
    
    saveFormData();
}

/**
 * Handle content input changes
 * Demonstrates real-time preview and character counting
 */
function handleContentInput(e) {
    const content = e.target.value;
    createPostState.formData.content = content;
    
    // Update character count
    updateCharacterCount(content.length);
    
    // Update live preview
    updatePreview();
    
    saveFormData();
}

/**
 * Update character count display
 */
function updateCharacterCount(count) {
    if (elements.contentCharCount) {
        elements.contentCharCount.textContent = count.toLocaleString();
        
        // Color code based on length
        if (count < 50) {
            elements.contentCharCount.style.color = '#dc3545'; // Too short
        } else if (count > 2000) {
            elements.contentCharCount.style.color = '#ffc107'; // Getting long
        } else {
            elements.contentCharCount.style.color = '#28a745'; // Good length
        }
    }
}

/**
 * Update live preview
 * Demonstrates content processing and HTML rendering
 */
function updatePreview() {
    if (!elements.contentPreview || !elements.postContent) return;
    
    const content = elements.postContent.value;
    
    if (!content.trim()) {
        elements.contentPreview.innerHTML = '<em>Start typing to see a preview of your post...</em>';
        return;
    }
    
    // Process content for preview (basic HTML rendering)
    const processedContent = processContentForPreview(content);
    elements.contentPreview.innerHTML = processedContent;
}

/**
 * Process content for preview display
 * Demonstrates basic HTML processing
 */
function processContentForPreview(content) {
    // Convert line breaks to <br> tags
    let processed = content.replace(/\n/g, '<br>');
    
    // Basic HTML tag processing (keep existing tags)
    // In a real app, you might use a markdown processor here
    
    return processed;
}

/**
 * Handle form reset
 */
function handleFormReset() {
    createPostState.formData = { title: '', author: '', content: '' };
    updateCharacterCount(0);
    updatePreview();
    clearSavedData();
    
    // Reset visual feedback
    [elements.postTitle, elements.postAuthor, elements.postContent].forEach(el => {
        if (el) el.style.borderColor = '#e9ecef';
    });
}

/**
 * Handle keyboard shortcuts
 * Demonstrates keyboard navigation patterns
 */
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!createPostState.isSubmitting) {
            elements.createPostForm?.requestSubmit();
        }
    }
}

/**
 * Set submitting state UI
 */
function setSubmittingState(isSubmitting) {
    if (elements.submitBtn) {
        elements.submitBtn.disabled = isSubmitting;
        
        const btnText = elements.submitBtn.querySelector('.btn-text');
        const btnLoading = elements.submitBtn.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            if (isSubmitting) {
                btnText.classList.add('hidden');
                btnLoading.classList.remove('hidden');
            } else {
                btnText.classList.remove('hidden');
                btnLoading.classList.add('hidden');
            }
        }
    }
    
    // Disable form inputs during submission
    const inputs = elements.createPostForm?.querySelectorAll('input, textarea, button');
    inputs?.forEach(input => {
        if (input.type !== 'submit') {
            input.disabled = isSubmitting;
        }
    });
}

/**
 * Show success state after post creation
 */
function showSuccessState() {
    elements.createPostForm?.classList.add('hidden');
    elements.errorMessage?.classList.add('hidden');
    elements.successMessage?.classList.remove('hidden');
    
    // Update view post button
    if (elements.viewPostBtn && createPostState.lastCreatedPost) {
        elements.viewPostBtn.onclick = () => {
            window.location.href = `/post/${createPostState.lastCreatedPost.slug}`;
        };
    }
}

/**
 * Show error state
 */
function showErrorState(errorMessage) {
    if (elements.errorText) {
        elements.errorText.textContent = errorMessage;
    }
    
    elements.successMessage?.classList.add('hidden');
    elements.errorMessage?.classList.remove('hidden');
}

/**
 * Handle view post button click
 */
function handleViewPost() {
    if (createPostState.lastCreatedPost) {
        window.location.href = `/post/${createPostState.lastCreatedPost.slug}`;
    }
}

/**
 * Handle create another post button click
 */
function handleCreateAnother() {
    // Reset form and state
    elements.createPostForm?.reset();
    handleFormReset();
    
    // Show form again
    elements.successMessage?.classList.add('hidden');
    elements.errorMessage?.classList.add('hidden');
    elements.createPostForm?.classList.remove('hidden');
    
    // Focus on title input
    elements.postTitle?.focus();
}

/**
 * Handle retry button click
 */
function handleRetry() {
    elements.errorMessage?.classList.add('hidden');
    elements.createPostForm?.classList.remove('hidden');
}

/**
 * Save form data to localStorage (auto-save)
 * Demonstrates data persistence patterns
 */
function saveFormData() {
    try {
        const dataToSave = {
            title: elements.postTitle?.value || '',
            author: elements.postAuthor?.value || '',
            content: elements.postContent?.value || '',
            timestamp: Date.now()
        };
        
        localStorage.setItem('blogPost_draft', JSON.stringify(dataToSave));
    } catch (error) {
        console.warn('Failed to save form data:', error);
    }
}

/**
 * Load saved form data from localStorage
 */
function loadSavedData() {
    try {
        const savedData = localStorage.getItem('blogPost_draft');
        if (!savedData) return;
        
        const data = JSON.parse(savedData);
        
        // Check if data is not too old (24 hours)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - data.timestamp > maxAge) {
            clearSavedData();
            return;
        }
        
        // Restore form data
        if (elements.postTitle && data.title) {
            elements.postTitle.value = data.title;
            createPostState.formData.title = data.title;
        }
        
        if (elements.postAuthor && data.author) {
            elements.postAuthor.value = data.author;
            createPostState.formData.author = data.author;
        }
        
        if (elements.postContent && data.content) {
            elements.postContent.value = data.content;
            createPostState.formData.content = data.content;
            updateCharacterCount(data.content.length);
        }
        
        // Show notification about restored data
        if (data.title || data.author || data.content) {
            showAutoSaveNotification();
        }
        
    } catch (error) {
        console.warn('Failed to load saved form data:', error);
        clearSavedData();
    }
}

/**
 * Clear saved form data
 */
function clearSavedData() {
    try {
        localStorage.removeItem('blogPost_draft');
    } catch (error) {
        console.warn('Failed to clear saved data:', error);
    }
}

/**
 * Show auto-save notification
 */
function showAutoSaveNotification() {
    const notification = document.createElement('div');
    notification.className = 'auto-save-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #17a2b8;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
            z-index: 1000;
            font-size: 14px;
        ">
            📝 Restored your draft from previous session
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCreatePostPage);