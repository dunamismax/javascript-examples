/**
 * Database Seed Script
 * 
 * This script demonstrates:
 * - Sample data insertion
 * - SQL DML (Data Manipulation Language)
 * - Batch data operations
 * - Database population for development
 * 
 * Run with: npm run seed-db
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database configuration
const DB_PATH = path.join(__dirname, 'blog.db');

/**
 * Sample blog posts data
 */
const samplePosts = [
    {
        title: "Welcome to JavaScript Learning",
        author: "Jane Developer",
        content: `<p>Welcome to our JavaScript learning blog platform! This is your first step into the exciting world of full-stack web development.</p>

<p>In this blog, you'll discover how modern web applications are built using:</p>

<ul>
<li><strong>Node.js</strong> - Server-side JavaScript runtime</li>
<li><strong>Express.js</strong> - Minimalist web framework</li>
<li><strong>SQLite</strong> - Lightweight database solution</li>
<li><strong>Vanilla JavaScript</strong> - Pure frontend magic</li>
</ul>

<p>Each post in this blog demonstrates real-world coding patterns, best practices, and practical examples you can use in your own projects.</p>

<p><em>Ready to dive in? Let's start coding!</em></p>`,
        slug: "welcome-to-javascript-learning"
    },
    
    {
        title: "Understanding Async/Await in JavaScript",
        author: "Alex CodeMaster",
        content: `<p>Asynchronous programming is one of the most important concepts in modern JavaScript. Let's explore how async/await makes our code cleaner and more readable.</p>

<p><strong>What is Async/Await?</strong></p>
<p>Async/await is syntactic sugar over Promises, making asynchronous code look and behave more like synchronous code.</p>

<p><strong>Example:</strong></p>
<p>Instead of Promise chains:</p>
<p><code>fetch('/api/data').then(response => response.json()).then(data => console.log(data));</code></p>

<p>We can write:</p>
<p><code>const response = await fetch('/api/data');<br>
const data = await response.json();<br>
console.log(data);</code></p>

<p><strong>Key Benefits:</strong></p>
<ul>
<li>Better error handling with try/catch</li>
<li>More readable code flow</li>
<li>Easier debugging</li>
<li>Less callback hell</li>
</ul>

<p>Remember: async functions always return a Promise, and await can only be used inside async functions!</p>`,
        slug: "understanding-async-await-javascript"
    },
    
    {
        title: "Building RESTful APIs with Express.js",
        author: "Sarah Backend",
        content: `<p>REST (Representational State Transfer) is an architectural style for designing networked applications. Let's build a proper RESTful API!</p>

<p><strong>REST Principles:</strong></p>
<ul>
<li><strong>Stateless</strong> - Each request contains all necessary information</li>
<li><strong>Resource-based</strong> - URLs represent resources, not actions</li>
<li><strong>HTTP Methods</strong> - Use appropriate verbs (GET, POST, PUT, DELETE)</li>
<li><strong>JSON Communication</strong> - Structured data exchange</li>
</ul>

<p><strong>Example API Endpoints:</strong></p>
<ul>
<li><code>GET /api/posts</code> - Retrieve all posts</li>
<li><code>GET /api/posts/:id</code> - Retrieve specific post</li>
<li><code>POST /api/posts</code> - Create new post</li>
<li><code>PUT /api/posts/:id</code> - Update existing post</li>
<li><code>DELETE /api/posts/:id</code> - Delete post</li>
</ul>

<p><strong>HTTP Status Codes:</strong></p>
<ul>
<li>200 - OK (successful GET, PUT)</li>
<li>201 - Created (successful POST)</li>
<li>400 - Bad Request (validation error)</li>
<li>404 - Not Found (resource doesn't exist)</li>
<li>500 - Internal Server Error</li>
</ul>

<p>Good API design makes your application scalable, maintainable, and easy to integrate with other systems.</p>`,
        slug: "building-restful-apis-express"
    },
    
    {
        title: "Database Design Best Practices",
        author: "Mike DataGeek",
        content: `<p>Good database design is the foundation of any robust application. Let's explore the key principles that will make your data layer efficient and maintainable.</p>

<p><strong>Normalization Rules:</strong></p>
<ul>
<li><strong>First Normal Form (1NF)</strong> - No repeating groups</li>
<li><strong>Second Normal Form (2NF)</strong> - No partial dependencies</li>
<li><strong>Third Normal Form (3NF)</strong> - No transitive dependencies</li>
</ul>

<p><strong>Indexing Strategy:</strong></p>
<p>Create indexes on columns you frequently:</p>
<ul>
<li>Search or filter by (WHERE clauses)</li>
<li>Sort by (ORDER BY clauses)</li>
<li>Join on (JOIN conditions)</li>
</ul>

<p><strong>Relationships:</strong></p>
<ul>
<li><strong>One-to-One</strong> - User ↔ Profile</li>
<li><strong>One-to-Many</strong> - Post ↔ Comments</li>
<li><strong>Many-to-Many</strong> - Users ↔ Roles (via junction table)</li>
</ul>

<p><strong>Performance Tips:</strong></p>
<ul>
<li>Use appropriate data types</li>
<li>Avoid SELECT * in production</li>
<li>Use LIMIT for pagination</li>
<li>Consider database connection pooling</li>
</ul>

<p>Remember: A well-designed database schema today saves hours of refactoring tomorrow!</p>`,
        slug: "database-design-best-practices"
    },
    
    {
        title: "Frontend State Management Patterns",
        author: "Emma Frontend",
        content: `<p>Managing application state effectively is crucial for building maintainable frontend applications. Let's explore different patterns and when to use them.</p>

<p><strong>Simple State Management:</strong></p>
<p>For small applications, a simple object can hold your state:</p>
<p><code>const appState = { user: null, posts: [], loading: false };</code></p>

<p><strong>Event-Driven Updates:</strong></p>
<p>Use custom events to notify components of state changes:</p>
<p><code>document.dispatchEvent(new CustomEvent('stateChanged', { detail: newState }));</code></p>

<p><strong>State Management Principles:</strong></p>
<ul>
<li><strong>Single Source of Truth</strong> - One place for each piece of state</li>
<li><strong>Immutable Updates</strong> - Don't modify state directly</li>
<li><strong>Predictable Changes</strong> - State updates through defined actions</li>
<li><strong>Time-Travel Debugging</strong> - Track state changes over time</li>
</ul>

<p><strong>When to Use What:</strong></p>
<ul>
<li><strong>Local State</strong> - Component-specific data (form inputs)</li>
<li><strong>Global State</strong> - Shared data (user authentication)</li>
<li><strong>Server State</strong> - Data from APIs (cached responses)</li>
<li><strong>URL State</strong> - Navigation and routing info</li>
</ul>

<p><strong>Common Patterns:</strong></p>
<ul>
<li>Observer Pattern for reactive updates</li>
<li>Publisher-Subscriber for loose coupling</li>
<li>Command Pattern for undo/redo functionality</li>
</ul>

<p>Choose the simplest pattern that meets your needs. You can always refactor to more complex solutions as your app grows!</p>`,
        slug: "frontend-state-management-patterns"
    }
];

/**
 * Sample comments data
 */
const sampleComments = [
    // Comments for "Welcome to JavaScript Learning"
    {
        post_slug: "welcome-to-javascript-learning",
        author: "Tom Learner",
        content: "Great introduction! I'm excited to learn more about full-stack development."
    },
    {
        post_slug: "welcome-to-javascript-learning", 
        author: "Lisa Student",
        content: "This looks like exactly what I need to improve my JavaScript skills. Thank you!"
    },
    {
        post_slug: "welcome-to-javascript-learning",
        author: "Carlos Beginner",
        content: "As someone new to web development, this blog seems like a perfect starting point."
    },
    
    // Comments for "Understanding Async/Await"
    {
        post_slug: "understanding-async-await-javascript",
        author: "Rachel Developer",
        content: "Excellent explanation! The comparison between Promises and async/await really helped."
    },
    {
        post_slug: "understanding-async-await-javascript",
        author: "John Coder",
        content: "I've been struggling with async programming. This makes it much clearer, thanks!"
    },
    
    // Comments for "Building RESTful APIs"
    {
        post_slug: "building-restful-apis-express",
        author: "Backend Betty",
        content: "Love the clear explanation of HTTP status codes. Very helpful reference!"
    },
    {
        post_slug: "building-restful-apis-express",
        author: "API Andy",
        content: "The endpoint examples are perfect. Going to implement this pattern in my next project."
    },
    {
        post_slug: "building-restful-apis-express",
        author: "Junior Dev",
        content: "Finally understand the difference between PUT and POST. Great post!"
    },
    
    // Comments for "Database Design"
    {
        post_slug: "database-design-best-practices",
        author: "Data Dave",
        content: "The indexing tips are gold! Definitely applying these to optimize my queries."
    },
    {
        post_slug: "database-design-best-practices",
        author: "SQL Sally",
        content: "Normalization explained simply - this should be required reading for all developers!"
    },
    
    // Comments for "State Management"
    {
        post_slug: "frontend-state-management-patterns",
        author: "React Rick",
        content: "Great overview! The principles apply beyond just vanilla JS too."
    },
    {
        post_slug: "frontend-state-management-patterns",
        author: "Vue Victoria",
        content: "Love the breakdown of when to use different state types. Very practical advice."
    }
];

/**
 * Utility function to create URL-friendly slugs
 */
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Utility function to create excerpt from content
 */
function createExcerpt(content, maxLength = 150) {
    // Remove HTML tags for excerpt
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
}

/**
 * Seed the database with sample data
 */
function seedDatabase() {
    console.log('🌱 Seeding Blog Platform Database...');
    console.log('====================================');
    
    // Check if database exists
    if (!fs.existsSync(DB_PATH)) {
        console.error('❌ Database not found. Please run "npm run init-db" first.');
        process.exit(1);
    }
    
    // Open database connection
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('❌ Error opening database:', err.message);
            process.exit(1);
        }
        console.log('✅ Connected to database');
    });
    
    // Insert sample data
    insertSampleData(db);
}

/**
 * Insert sample posts and comments
 */
function insertSampleData(db) {
    console.log('\n📝 Inserting sample posts...');
    
    db.serialize(() => {
        // Clear existing data
        db.run('DELETE FROM comments', (err) => {
            if (err) console.error('Error clearing comments:', err.message);
        });
        
        db.run('DELETE FROM posts', (err) => {
            if (err) console.error('Error clearing posts:', err.message);
        });
        
        // Reset auto-increment counters
        db.run('DELETE FROM sqlite_sequence WHERE name IN ("posts", "comments")');
        
        // Prepare insert statement for posts
        const insertPost = db.prepare(`
            INSERT INTO posts (title, content, author, slug, excerpt)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        // Insert posts
        const postPromises = samplePosts.map((post, index) => {
            return new Promise((resolve, reject) => {
                const excerpt = createExcerpt(post.content);
                
                insertPost.run([
                    post.title,
                    post.content,
                    post.author,
                    post.slug,
                    excerpt
                ], function(err) {
                    if (err) {
                        console.error(`❌ Error inserting post ${index + 1}:`, err.message);
                        reject(err);
                    } else {
                        console.log(`✅ Inserted post: "${post.title}"`);
                        resolve(this.lastID);
                    }
                });
            });
        });
        
        // Wait for all posts to be inserted, then insert comments
        Promise.all(postPromises)
            .then((postIds) => {
                insertPost.finalize();
                insertComments(db, postIds);
            })
            .catch((err) => {
                console.error('❌ Failed to insert posts:', err);
                process.exit(1);
            });
    });
}

/**
 * Insert sample comments
 */
function insertComments(db, postIds) {
    console.log('\n💬 Inserting sample comments...');
    
    // Create a mapping of slugs to post IDs
    const slugToId = {};
    
    // Get post slugs and IDs
    db.all('SELECT id, slug FROM posts', (err, rows) => {
        if (err) {
            console.error('❌ Error fetching posts for comments:', err.message);
            return;
        }
        
        // Create slug to ID mapping
        rows.forEach(row => {
            slugToId[row.slug] = row.id;
        });
        
        // Prepare insert statement for comments
        const insertComment = db.prepare(`
            INSERT INTO comments (post_id, author, content)
            VALUES (?, ?, ?)
        `);
        
        // Insert comments
        let commentCount = 0;
        const commentPromises = sampleComments.map((comment, index) => {
            return new Promise((resolve, reject) => {
                const postId = slugToId[comment.post_slug];
                
                if (!postId) {
                    console.warn(`⚠️ Post not found for slug: ${comment.post_slug}`);
                    resolve();
                    return;
                }
                
                insertComment.run([
                    postId,
                    comment.author,
                    comment.content
                ], function(err) {
                    if (err) {
                        console.error(`❌ Error inserting comment ${index + 1}:`, err.message);
                        reject(err);
                    } else {
                        commentCount++;
                        console.log(`✅ Inserted comment by ${comment.author}`);
                        resolve();
                    }
                });
            });
        });
        
        // Finalize comments insertion
        Promise.all(commentPromises)
            .then(() => {
                insertComment.finalize();
                finalizeSeed(db, samplePosts.length, commentCount);
            })
            .catch((err) => {
                console.error('❌ Failed to insert comments:', err);
                process.exit(1);
            });
    });
}

/**
 * Finalize the seeding process
 */
function finalizeSeed(db, postCount, commentCount) {
    // Display statistics
    db.all('SELECT COUNT(*) as count FROM posts WHERE published = 1', (err, rows) => {
        if (err) {
            console.error('❌ Error getting post count:', err.message);
        } else {
            console.log(`\n📊 Database Statistics:`);
            console.log(`   • ${rows[0].count} published posts`);
            console.log(`   • ${commentCount} comments`);
        }
        
        // Close database
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
                process.exit(1);
            }
            
            console.log('\n🎉 Database seeding complete!');
            console.log('💡 Next steps:');
            console.log('   • Run "npm run dev" to start the development server');
            console.log('   • Open http://localhost:3000 to view the blog');
            console.log('   • Try creating new posts and comments');
            console.log('   • Explore the API endpoints at /api/posts');
        });
    });
}

/**
 * Display sample data information
 */
function displaySampleDataInfo() {
    console.log('\n📋 Sample Data Overview:');
    console.log('========================');
    
    console.log(`\n📝 ${samplePosts.length} Sample Posts:`);
    samplePosts.forEach((post, index) => {
        console.log(`   ${index + 1}. "${post.title}" by ${post.author}`);
    });
    
    console.log(`\n💬 ${sampleComments.length} Sample Comments:`);
    const commentsByPost = {};
    sampleComments.forEach(comment => {
        if (!commentsByPost[comment.post_slug]) {
            commentsByPost[comment.post_slug] = 0;
        }
        commentsByPost[comment.post_slug]++;
    });
    
    Object.entries(commentsByPost).forEach(([slug, count]) => {
        const post = samplePosts.find(p => p.slug === slug);
        const title = post ? post.title : slug;
        console.log(`   • ${count} comments on "${title}"`);
    });
    
    console.log('\n🎯 This sample data demonstrates:');
    console.log('   • Various content types and lengths');
    console.log('   • HTML content with formatting');
    console.log('   • Different authors and writing styles');
    console.log('   • Realistic comment interactions');
    console.log('   • SEO-friendly URL slugs');
}

// Run seeding if called directly
if (require.main === module) {
    displaySampleDataInfo();
    seedDatabase();
}

module.exports = { seedDatabase };