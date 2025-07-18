/**
 * Blog Platform Server - Full-Stack JavaScript Learning Example
 * 
 * This Express.js server demonstrates:
 * - Setting up a web server with Express
 * - Database integration with SQLite
 * - RESTful API design
 * - Middleware usage
 * - Static file serving
 * - Error handling
 * - CRUD operations
 * 
 * Learning Focus:
 * 1. Node.js server development
 * 2. Express.js framework usage
 * 3. Database operations with SQLite
 * 4. REST API design patterns
 * 5. Request/response handling
 * 6. Middleware implementation
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Database path
const DB_PATH = path.join(__dirname, 'database', 'blog.db');

// Global database connection
let db;

/**
 * Initialize database connection
 * Demonstrates SQLite database setup and connection
 */
function initializeDatabase() {
    // Ensure database directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Create database connection
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            process.exit(1);
        } else {
            console.log('✅ Connected to SQLite database');
            createTables();
        }
    });
}

/**
 * Create database tables if they don't exist
 * Demonstrates SQL DDL (Data Definition Language)
 */
function createTables() {
    // Posts table for blog articles
    const createPostsTable = `
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            excerpt TEXT,
            published INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Comments table for post comments
    const createCommentsTable = `
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            author TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
        )
    `;
    
    // Execute table creation
    db.run(createPostsTable, (err) => {
        if (err) {
            console.error('Error creating posts table:', err.message);
        } else {
            console.log('✅ Posts table ready');
        }
    });
    
    db.run(createCommentsTable, (err) => {
        if (err) {
            console.error('Error creating comments table:', err.message);
        } else {
            console.log('✅ Comments table ready');
        }
    });
}

/**
 * Middleware setup
 * Demonstrates Express middleware configuration
 */
function setupMiddleware() {
    // Parse JSON bodies
    app.use(express.json());
    
    // Parse URL-encoded bodies (for form submissions)
    app.use(express.urlencoded({ extended: true }));
    
    // Serve static files from public directory
    app.use(express.static('public'));
    
    // Custom logging middleware
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
    
    // CORS headers for API endpoints
    app.use('/api', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        next();
    });
}

/**
 * Utility function to create URL-friendly slugs
 * Demonstrates string manipulation for SEO-friendly URLs
 */
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 50);
}

/**
 * Utility function to create excerpt from content
 * Demonstrates text processing
 */
function createExcerpt(content, maxLength = 150) {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > maxLength 
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
}

/**
 * Utility function to format dates
 * Demonstrates date manipulation
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ================================
// API ROUTES - RESTful endpoints
// ================================

/**
 * GET /api/posts - Get all published posts
 * Demonstrates database querying and JSON API responses
 */
app.get('/api/posts', (req, res) => {
    const query = `
        SELECT 
            id, title, excerpt, author, slug, 
            created_at, updated_at,
            (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count
        FROM posts 
        WHERE published = 1 
        ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        // Format dates for frontend
        const formattedPosts = rows.map(post => ({
            ...post,
            created_at: formatDate(post.created_at),
            updated_at: formatDate(post.updated_at)
        }));
        
        res.json(formattedPosts);
    });
});

/**
 * GET /api/posts/:slug - Get single post by slug
 * Demonstrates parameterized queries and JOIN operations
 */
app.get('/api/posts/:slug', (req, res) => {
    const { slug } = req.params;
    
    // Get post details
    const postQuery = `
        SELECT * FROM posts 
        WHERE slug = ? AND published = 1
    `;
    
    db.get(postQuery, [slug], (err, post) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        
        // Get comments for this post
        const commentsQuery = `
            SELECT * FROM comments 
            WHERE post_id = ? 
            ORDER BY created_at ASC
        `;
        
        db.all(commentsQuery, [post.id], (err, comments) => {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            
            // Format response
            const formattedPost = {
                ...post,
                created_at: formatDate(post.created_at),
                updated_at: formatDate(post.updated_at),
                comments: comments.map(comment => ({
                    ...comment,
                    created_at: formatDate(comment.created_at)
                }))
            };
            
            res.json(formattedPost);
        });
    });
});

/**
 * POST /api/posts - Create new post
 * Demonstrates data validation and INSERT operations
 */
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    
    // Input validation
    if (!title || !content || !author) {
        res.status(400).json({ 
            error: 'Missing required fields: title, content, and author are required' 
        });
        return;
    }
    
    if (title.length < 3 || title.length > 200) {
        res.status(400).json({ 
            error: 'Title must be between 3 and 200 characters' 
        });
        return;
    }
    
    if (content.length < 10) {
        res.status(400).json({ 
            error: 'Content must be at least 10 characters long' 
        });
        return;
    }
    
    // Generate slug and excerpt
    const slug = createSlug(title);
    const excerpt = createExcerpt(content);
    
    // Check if slug already exists
    db.get('SELECT id FROM posts WHERE slug = ?', [slug], (err, existingPost) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        if (existingPost) {
            res.status(409).json({ 
                error: 'A post with similar title already exists' 
            });
            return;
        }
        
        // Insert new post
        const insertQuery = `
            INSERT INTO posts (title, content, author, slug, excerpt, published)
            VALUES (?, ?, ?, ?, ?, 1)
        `;
        
        db.run(insertQuery, [title, content, author, slug, excerpt], function(err) {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).json({ error: 'Failed to create post' });
                return;
            }
            
            // Return created post
            db.get('SELECT * FROM posts WHERE id = ?', [this.lastID], (err, newPost) => {
                if (err) {
                    console.error('Database error:', err.message);
                    res.status(500).json({ error: 'Post created but failed to retrieve' });
                    return;
                }
                
                res.status(201).json({
                    message: 'Post created successfully',
                    post: {
                        ...newPost,
                        created_at: formatDate(newPost.created_at),
                        updated_at: formatDate(newPost.updated_at)
                    }
                });
            });
        });
    });
});

/**
 * POST /api/posts/:slug/comments - Add comment to post
 * Demonstrates foreign key relationships and data validation
 */
app.post('/api/posts/:slug/comments', (req, res) => {
    const { slug } = req.params;
    const { author, content } = req.body;
    
    // Input validation
    if (!author || !content) {
        res.status(400).json({ 
            error: 'Missing required fields: author and content are required' 
        });
        return;
    }
    
    if (author.length < 2 || author.length > 50) {
        res.status(400).json({ 
            error: 'Author name must be between 2 and 50 characters' 
        });
        return;
    }
    
    if (content.length < 5 || content.length > 500) {
        res.status(400).json({ 
            error: 'Comment must be between 5 and 500 characters' 
        });
        return;
    }
    
    // Find post by slug
    db.get('SELECT id FROM posts WHERE slug = ? AND published = 1', [slug], (err, post) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        
        // Insert comment
        const insertQuery = `
            INSERT INTO comments (post_id, author, content)
            VALUES (?, ?, ?)
        `;
        
        db.run(insertQuery, [post.id, author, content], function(err) {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).json({ error: 'Failed to add comment' });
                return;
            }
            
            // Return created comment
            db.get('SELECT * FROM comments WHERE id = ?', [this.lastID], (err, newComment) => {
                if (err) {
                    console.error('Database error:', err.message);
                    res.status(500).json({ error: 'Comment created but failed to retrieve' });
                    return;
                }
                
                res.status(201).json({
                    message: 'Comment added successfully',
                    comment: {
                        ...newComment,
                        created_at: formatDate(newComment.created_at)
                    }
                });
            });
        });
    });
});

/**
 * DELETE /api/posts/:id - Delete post (admin functionality)
 * Demonstrates DELETE operations and cascade behavior
 */
app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    
    // In a real app, you'd implement authentication here
    // For learning purposes, we'll skip auth
    
    db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: 'Failed to delete post' });
            return;
        }
        
        if (this.changes === 0) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        
        res.json({ 
            message: 'Post deleted successfully',
            deletedRows: this.changes
        });
    });
});

// ================================
// WEB ROUTES - HTML pages
// ================================

/**
 * GET / - Home page with blog post list
 * Demonstrates server-side HTML generation
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * GET /post/:slug - Individual post page
 * Demonstrates dynamic routing
 */
app.get('/post/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'post.html'));
});

/**
 * GET /create - Create new post page
 * Demonstrates form handling setup
 */
app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'create.html'));
});

// ================================
// ERROR HANDLING MIDDLEWARE
// ================================

/**
 * 404 handler for undefined routes
 * Demonstrates error handling middleware
 */
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested resource was not found on this server'
    });
});

/**
 * Global error handler
 * Demonstrates centralized error handling
 */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Something went wrong on our end'
    });
});

// ================================
// SERVER STARTUP
// ================================

/**
 * Start the server
 * Demonstrates server initialization and graceful shutdown
 */
function startServer() {
    app.listen(PORT, () => {
        console.log(`🚀 Blog Platform server running on http://localhost:${PORT}`);
        console.log(`📚 Learning endpoints:`);
        console.log(`   • Home: http://localhost:${PORT}`);
        console.log(`   • Create Post: http://localhost:${PORT}/create`);
        console.log(`   • API Docs: See README.md for API endpoints`);
    });
}

/**
 * Graceful shutdown handling
 * Demonstrates proper resource cleanup
 */
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('✅ Database connection closed');
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

// Initialize and start the application
console.log('🎓 JavaScript Blog Platform - Learning Server');
console.log('=====================================');
initializeDatabase();
setupMiddleware();
startServer();