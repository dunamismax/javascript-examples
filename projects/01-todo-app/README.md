# 📝 Todo App - JavaScript Learning Project

A comprehensive todo application built with vanilla JavaScript to demonstrate core web development concepts.

## 🎯 Learning Objectives

This project teaches fundamental JavaScript concepts through practical implementation:

### 1. **DOM Manipulation**
- Creating, modifying, and removing HTML elements dynamically
- Traversing the DOM tree
- Working with element attributes and properties
- Managing CSS classes and styles

### 2. **Event Handling**
- Click events and user interactions
- Keyboard events (Enter, Escape)
- Event delegation for dynamic content
- Event object properties and methods

### 3. **Local Storage**
- Persisting data in the browser
- JSON serialization and parsing
- Error handling for storage operations
- Data validation and integrity

### 4. **Array Methods & Functional Programming**
- `filter()` for data filtering
- `find()` for element lookup
- `map()` for data transformation
- `reduce()` for aggregation

### 5. **State Management**
- Centralized application state
- State updates and UI synchronization
- Immutable data patterns
- State persistence

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
01-todo-app/
├── src/
│   ├── css/
│   │   └── styles.css      # Modern CSS with Flexbox/Grid
│   └── js/
│       └── main.js         # Core application logic
├── dist/                   # Built files (generated)
├── index.html             # Main HTML structure
├── package.json           # Project configuration
└── README.md             # This file
```

## 🔍 Key Code Concepts

### State Management Pattern
```javascript
// Centralized state object
let todoState = {
    todos: [],
    currentFilter: 'all',
    nextId: 1
};
```

### Event Delegation
```javascript
// Handle all todo list clicks with a single listener
elements.todoList.addEventListener('click', handleTodoListClick);
```

### localStorage Integration
```javascript
// Persist data across browser sessions
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoState));
}
```

### Array Filtering
```javascript
// Filter todos based on completion status
const activeTodos = todos.filter(todo => !todo.completed);
```

## 🎨 Features Implemented

- ✅ Add new todos with input validation
- ✅ Mark todos as complete/incomplete
- ✅ Edit existing todos inline
- ✅ Delete todos with confirmation
- ✅ Filter todos (All, Active, Completed)
- ✅ Clear all completed todos
- ✅ Persistent storage with localStorage
- ✅ Responsive design
- ✅ Keyboard shortcuts (Enter, Escape)
- ✅ Empty state handling
- ✅ Real-time statistics

## 🧠 Learning Challenges

Try extending the app with these features:

1. **Due Dates**: Add date picker and sorting by due date
2. **Categories**: Implement todo categories with color coding
3. **Search**: Add search functionality to filter by text
4. **Drag & Drop**: Implement reordering with drag and drop
5. **Import/Export**: Add JSON import/export functionality
6. **Undo/Redo**: Implement action history
7. **Animations**: Add smooth transitions and micro-interactions

## 🔧 Technical Notes

- **No Frameworks**: Pure vanilla JavaScript for learning fundamentals
- **ES6+ Features**: Modern JavaScript syntax and features
- **Responsive Design**: Mobile-first CSS approach
- **Accessibility**: Semantic HTML and keyboard navigation
- **Performance**: Efficient DOM updates and event delegation
- **Error Handling**: Graceful handling of edge cases

## 📚 Concepts Demonstrated

| Concept | Implementation | Line Reference |
|---------|---------------|----------------|
| DOM Caching | `cacheElements()` | main.js:65 |
| Event Delegation | `handleTodoListClick()` | main.js:103 |
| Array Methods | `getFilteredTodos()` | main.js:276 |
| localStorage | `saveTodos()` / `loadTodos()` | main.js:356 |
| State Management | `todoState` object | main.js:18 |
| Input Validation | `handleAddTodo()` | main.js:81 |

This todo app serves as a practical introduction to JavaScript development patterns that scale to larger applications.