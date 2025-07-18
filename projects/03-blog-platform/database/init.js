/**
 * Database Initialization Script
 * 
 * This script demonstrates:
 * - SQLite database creation
 * - Table schema design
 * - SQL DDL (Data Definition Language)
 * - Database setup automation
 * 
 * Run with: npm run init-db
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database configuration
const DB_PATH = path.join(__dirname, 'blog.db');

/**
 * Initialize the database with tables
 */
function initializeDatabase() {
    console.log('🗄️ Initializing Blog Platform Database...');
    console.log('=====================================');
    
    // Remove existing database if it exists
    if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('🗑️ Removed existing database');
    }
    
    // Create new database
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('❌ Error creating database:', err.message);
            process.exit(1);
        }
        console.log('✅ Database file created');
    });
    
    // Create tables
    createTables(db);
}

/**
 * Create all database tables
 */
function createTables(db) {
    console.log('\n📋 Creating database tables...');
    
    // Posts table - stores blog posts
    const createPostsTable = `
        CREATE TABLE posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL CHECK(length(title) >= 3 AND length(title) <= 200),
            content TEXT NOT NULL CHECK(length(content) >= 10),
            author TEXT NOT NULL CHECK(length(author) >= 2 AND length(author) <= 50),
            slug TEXT UNIQUE NOT NULL,
            excerpt TEXT,
            published INTEGER DEFAULT 1 CHECK(published IN (0, 1)),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Comments table - stores post comments
    const createCommentsTable = `
        CREATE TABLE comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            author TEXT NOT NULL CHECK(length(author) >= 2 AND length(author) <= 50),
            content TEXT NOT NULL CHECK(length(content) >= 5 AND length(content) <= 500),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
        )
    `;
    
    // Create indexes for better performance
    const createIndexes = [
        'CREATE INDEX idx_posts_published ON posts(published)',
        'CREATE INDEX idx_posts_created_at ON posts(created_at DESC)',
        'CREATE INDEX idx_posts_slug ON posts(slug)',
        'CREATE INDEX idx_comments_post_id ON comments(post_id)',
        'CREATE INDEX idx_comments_created_at ON comments(created_at)'
    ];
    
    // Create trigger to update updated_at timestamp
    const createUpdateTrigger = `
        CREATE TRIGGER update_posts_timestamp 
        AFTER UPDATE ON posts
        BEGIN
            UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
    `;
    
    // Execute table creation
    db.serialize(() => {
        // Create posts table
        db.run(createPostsTable, (err) => {
            if (err) {
                console.error('❌ Error creating posts table:', err.message);
                process.exit(1);
            }
            console.log('✅ Posts table created');
        });
        
        // Create comments table
        db.run(createCommentsTable, (err) => {
            if (err) {
                console.error('❌ Error creating comments table:', err.message);
                process.exit(1);
            }
            console.log('✅ Comments table created');
        });
        
        // Create indexes
        createIndexes.forEach((indexSQL, i) => {
            db.run(indexSQL, (err) => {
                if (err) {
                    console.error(`❌ Error creating index ${i + 1}:`, err.message);
                } else {
                    console.log(`✅ Index ${i + 1} created`);
                }
            });
        });
        
        // Create trigger
        db.run(createUpdateTrigger, (err) => {
            if (err) {
                console.error('❌ Error creating trigger:', err.message);
            } else {
                console.log('✅ Update trigger created');
            }
        });
        
        // Close database and finish
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
                process.exit(1);
            }
            
            console.log('\n🎉 Database initialization complete!');
            console.log(`📁 Database location: ${DB_PATH}`);
            console.log('\n💡 Next steps:');
            console.log('   • Run "npm run seed-db" to add sample data');
            console.log('   • Run "npm run dev" to start the development server');
            console.log('   • Open http://localhost:3000 to view the blog');
        });
    });
}

/**
 * Display database schema information
 */
function displaySchemaInfo() {
    console.log('\n📊 Database Schema:');
    console.log('===================');
    
    console.log('\n📝 POSTS Table:');
    console.log('   • id (PRIMARY KEY, AUTO INCREMENT)');
    console.log('   • title (TEXT, 3-200 chars, NOT NULL)');
    console.log('   • content (TEXT, min 10 chars, NOT NULL)');
    console.log('   • author (TEXT, 2-50 chars, NOT NULL)');
    console.log('   • slug (TEXT, UNIQUE, NOT NULL)');
    console.log('   • excerpt (TEXT, nullable)');
    console.log('   • published (INTEGER, 0 or 1, default 1)');
    console.log('   • created_at (DATETIME, auto-generated)');
    console.log('   • updated_at (DATETIME, auto-updated)');
    
    console.log('\n💬 COMMENTS Table:');
    console.log('   • id (PRIMARY KEY, AUTO INCREMENT)');
    console.log('   • post_id (INTEGER, FOREIGN KEY → posts.id)');
    console.log('   • author (TEXT, 2-50 chars, NOT NULL)');
    console.log('   • content (TEXT, 5-500 chars, NOT NULL)');
    console.log('   • created_at (DATETIME, auto-generated)');
    
    console.log('\n🔗 Relationships:');
    console.log('   • posts.id ← comments.post_id (One-to-Many)');
    console.log('   • CASCADE DELETE: Deleting a post removes all its comments');
    
    console.log('\n📈 Indexes:');
    console.log('   • posts.published (for filtering published posts)');
    console.log('   • posts.created_at (for sorting by date)');
    console.log('   • posts.slug (for URL lookups)');
    console.log('   • comments.post_id (for joining with posts)');
    console.log('   • comments.created_at (for sorting comments)');
}

// Run initialization if called directly
if (require.main === module) {
    displaySchemaInfo();
    initializeDatabase();
}

module.exports = { initializeDatabase };