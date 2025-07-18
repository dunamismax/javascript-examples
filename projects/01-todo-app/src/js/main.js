/**
 * Todo App - Vanilla JavaScript Learning Example
 * 
 * This application demonstrates core JavaScript concepts including:
 * - DOM manipulation and traversal
 * - Event handling and delegation
 * - localStorage for data persistence
 * - Array methods and functional programming
 * - State management patterns
 * 
 * Learning Focus:
 * 1. How to create, modify, and remove DOM elements
 * 2. How to handle user interactions with events
 * 3. How to persist data in the browser
 * 4. How to filter and transform data
 * 5. How to manage application state
 */

// State Management - The single source of truth for our application
let todoState = {
    todos: [],
    currentFilter: 'all',
    nextId: 1
};

// Constants for better maintainability
const STORAGE_KEY = 'todoApp_data';
const FILTERS = {
    ALL: 'all',
    ACTIVE: 'active', 
    COMPLETED: 'completed'
};

// DOM element references - cached for performance
const elements = {
    todoInput: null,
    addBtn: null,
    todoList: null,
    todoCount: null,
    clearCompleted: null,
    filterBtns: null,
    emptyState: null
};

/**
 * Initialize the application
 * This function runs when the page loads and sets up everything
 */
function initApp() {
    // Cache DOM elements for better performance
    cacheElements();
    
    // Load existing todos from localStorage
    loadTodos();
    
    // Set up all event listeners
    setupEventListeners();
    
    // Render the initial state
    renderTodos();
    updateStats();
}

/**
 * Cache DOM elements to avoid repeated queries
 * This improves performance by storing references to frequently used elements
 */
function cacheElements() {
    elements.todoInput = document.getElementById('todoInput');
    elements.addBtn = document.getElementById('addBtn');
    elements.todoList = document.getElementById('todoList');
    elements.todoCount = document.getElementById('todoCount');
    elements.clearCompleted = document.getElementById('clearCompleted');
    elements.filterBtns = document.querySelectorAll('.filter-btn');
    elements.emptyState = document.getElementById('emptyState');
}

/**
 * Set up all event listeners for the application
 * Demonstrates different types of event handling
 */
function setupEventListeners() {
    // Add todo on button click
    elements.addBtn.addEventListener('click', handleAddTodo);
    
    // Add todo on Enter key press - keyboard interaction
    elements.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    });
    
    // Event delegation for todo list - handles clicks on dynamic content
    // This is more efficient than adding listeners to individual items
    elements.todoList.addEventListener('click', handleTodoListClick);
    
    // Filter button clicks
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setFilter(filter);
        });
    });
    
    // Clear completed todos
    elements.clearCompleted.addEventListener('click', clearCompletedTodos);
}

/**
 * Handle adding a new todo
 * Demonstrates input validation and state updates
 */
function handleAddTodo() {
    const text = elements.todoInput.value.trim();
    
    // Input validation
    if (!text) {
        // Focus back to input for better UX
        elements.todoInput.focus();
        return;
    }
    
    // Create new todo object
    const newTodo = {
        id: todoState.nextId++,
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to state
    todoState.todos.push(newTodo);
    
    // Clear input
    elements.todoInput.value = '';
    
    // Update UI and save to localStorage
    renderTodos();
    updateStats();
    saveTodos();
    
    // Keep focus on input for continuous adding
    elements.todoInput.focus();
}

/**
 * Handle clicks within the todo list using event delegation
 * This demonstrates how to handle events on dynamically created elements
 */
function handleTodoListClick(e) {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    
    const todoId = parseInt(todoItem.dataset.id);
    
    // Handle different types of clicks based on the target element
    if (e.target.classList.contains('todo-checkbox')) {
        toggleTodo(todoId);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTodo(todoId);
    } else if (e.target.classList.contains('edit-btn')) {
        startEditTodo(todoId);
    } else if (e.target.classList.contains('save-btn')) {
        saveEditTodo(todoId);
    } else if (e.target.classList.contains('cancel-btn')) {
        cancelEditTodo(todoId);
    }
}

/**
 * Toggle the completed status of a todo
 * Demonstrates array manipulation with find()
 */
function toggleTodo(id) {
    const todo = todoState.todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
        updateStats();
        saveTodos();
    }
}

/**
 * Delete a todo from the list
 * Demonstrates array manipulation with filter()
 */
function deleteTodo(id) {
    // Confirm deletion for better UX
    if (confirm('Are you sure you want to delete this task?')) {
        todoState.todos = todoState.todos.filter(todo => todo.id !== id);
        renderTodos();
        updateStats();
        saveTodos();
    }
}

/**
 * Start editing a todo
 * Demonstrates DOM manipulation and input handling
 */
function startEditTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const todo = todoState.todos.find(todo => todo.id === id);
    
    if (!todoItem || !todo) return;
    
    // Add editing class for CSS styling
    todoItem.classList.add('editing');
    
    // Create edit input and buttons
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'todo-edit-input';
    editInput.value = todo.text;
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Cancel';
    
    // Insert edit elements
    todoItem.appendChild(editInput);
    todoItem.appendChild(saveBtn);
    todoItem.appendChild(cancelBtn);
    
    // Focus and select text for better UX
    editInput.focus();
    editInput.select();
    
    // Handle Enter key to save
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEditTodo(id);
        } else if (e.key === 'Escape') {
            cancelEditTodo(id);
        }
    });
}

/**
 * Save the edited todo
 * Demonstrates input validation and DOM cleanup
 */
function saveEditTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const editInput = todoItem.querySelector('.todo-edit-input');
    const newText = editInput.value.trim();
    
    // Validation
    if (!newText) {
        editInput.focus();
        return;
    }
    
    // Update the todo
    const todo = todoState.todos.find(todo => todo.id === id);
    if (todo) {
        todo.text = newText;
        saveTodos();
    }
    
    // Clean up edit mode
    cancelEditTodo(id);
}

/**
 * Cancel editing and restore original state
 * Demonstrates DOM cleanup
 */
function cancelEditTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    
    // Remove editing class
    todoItem.classList.remove('editing');
    
    // Remove edit elements
    const editInput = todoItem.querySelector('.todo-edit-input');
    const saveBtn = todoItem.querySelector('.save-btn');
    const cancelBtn = todoItem.querySelector('.cancel-btn');
    
    if (editInput) editInput.remove();
    if (saveBtn) saveBtn.remove();
    if (cancelBtn) cancelBtn.remove();
}

/**
 * Set the current filter and update UI
 * Demonstrates state management and UI updates
 */
function setFilter(filter) {
    todoState.currentFilter = filter;
    
    // Update active filter button
    elements.filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderTodos();
}

/**
 * Clear all completed todos
 * Demonstrates array filtering
 */
function clearCompletedTodos() {
    const completedCount = todoState.todos.filter(todo => todo.completed).length;
    
    if (completedCount === 0) return;
    
    if (confirm(`Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
        todoState.todos = todoState.todos.filter(todo => !todo.completed);
        renderTodos();
        updateStats();
        saveTodos();
    }
}

/**
 * Render all todos based on current filter
 * Demonstrates DOM manipulation and array filtering
 */
function renderTodos() {
    // Clear existing todos
    elements.todoList.innerHTML = '';
    
    // Filter todos based on current filter
    const filteredTodos = getFilteredTodos();
    
    // Show/hide empty state
    elements.emptyState.classList.toggle('hidden', filteredTodos.length > 0);
    
    // Render each todo
    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        elements.todoList.appendChild(todoElement);
    });
}

/**
 * Get filtered todos based on current filter
 * Demonstrates array filtering and functional programming
 */
function getFilteredTodos() {
    switch (todoState.currentFilter) {
        case FILTERS.ACTIVE:
            return todoState.todos.filter(todo => !todo.completed);
        case FILTERS.COMPLETED:
            return todoState.todos.filter(todo => todo.completed);
        default:
            return todoState.todos;
    }
}

/**
 * Create a DOM element for a todo item
 * Demonstrates DOM creation and element building
 */
function createTodoElement(todo) {
    // Create main container
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    
    // Create text span
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    
    // Create actions container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'todo-actions';
    
    // Create edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    
    // Assemble the element
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);
    
    return li;
}

/**
 * Update the statistics display
 * Demonstrates array methods and conditional rendering
 */
function updateStats() {
    const activeTodos = todoState.todos.filter(todo => !todo.completed);
    const completedTodos = todoState.todos.filter(todo => todo.completed);
    
    // Update count text
    const count = activeTodos.length;
    elements.todoCount.textContent = `${count} task${count !== 1 ? 's' : ''} remaining`;
    
    // Show/hide clear completed button
    elements.clearCompleted.style.display = completedTodos.length > 0 ? 'block' : 'none';
}

/**
 * Save todos to localStorage
 * Demonstrates data persistence in the browser
 */
function saveTodos() {
    try {
        const dataToSave = {
            todos: todoState.todos,
            nextId: todoState.nextId
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Failed to save todos to localStorage:', error);
        // In a real app, you might show a user-friendly error message
    }
}

/**
 * Load todos from localStorage
 * Demonstrates data retrieval and error handling
 */
function loadTodos() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            todoState.todos = parsedData.todos || [];
            todoState.nextId = parsedData.nextId || 1;
            
            // Ensure nextId is always higher than existing IDs
            // This prevents ID conflicts if data gets corrupted
            const maxId = todoState.todos.reduce((max, todo) => 
                Math.max(max, todo.id), 0);
            todoState.nextId = Math.max(todoState.nextId, maxId + 1);
        }
    } catch (error) {
        console.error('Failed to load todos from localStorage:', error);
        // Reset to default state if loading fails
        todoState.todos = [];
        todoState.nextId = 1;
    }
}

/**
 * Initialize the app when the DOM is fully loaded
 * This ensures all elements exist before we try to access them
 */
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for potential testing (optional)
// In a real application, you might want to test these functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        todoState,
        handleAddTodo,
        toggleTodo,
        deleteTodo,
        setFilter,
        getFilteredTodos
    };
}