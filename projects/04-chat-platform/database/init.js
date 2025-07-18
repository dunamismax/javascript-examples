const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'chat.db');

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        is_online BOOLEAN DEFAULT 0,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('✓ Users table created');
    });

    // Create rooms table
    db.run(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        is_private BOOLEAN DEFAULT 0,
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating rooms table:', err.message);
        reject(err);
        return;
      }
      console.log('✓ Rooms table created');
    });

    // Create messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        room_id INTEGER NOT NULL,
        message_type VARCHAR(20) DEFAULT 'text',
        file_url VARCHAR(255),
        file_name VARCHAR(255),
        reply_to INTEGER,
        edited_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (room_id) REFERENCES rooms (id),
        FOREIGN KEY (reply_to) REFERENCES messages (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating messages table:', err.message);
        reject(err);
        return;
      }
      console.log('✓ Messages table created');
    });

    // Create room_members table for many-to-many relationship
    db.run(`
      CREATE TABLE IF NOT EXISTS room_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        room_id INTEGER NOT NULL,
        role VARCHAR(20) DEFAULT 'member',
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (room_id) REFERENCES rooms (id),
        UNIQUE(user_id, room_id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating room_members table:', err.message);
        reject(err);
        return;
      }
      console.log('✓ Room members table created');
    });

    // Create typing_indicators table for real-time typing status
    db.run(`
      CREATE TABLE IF NOT EXISTS typing_indicators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        room_id INTEGER NOT NULL,
        is_typing BOOLEAN DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (room_id) REFERENCES rooms (id),
        UNIQUE(user_id, room_id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating typing_indicators table:', err.message);
        reject(err);
        return;
      }
      console.log('✓ Typing indicators table created');
    });

    // Create indexes for better performance
    db.run('CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id)', (err) => {
      if (err) console.error('Error creating messages room index:', err.message);
      else console.log('✓ Messages room index created');
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)', (err) => {
      if (err) console.error('Error creating messages timestamp index:', err.message);
      else console.log('✓ Messages timestamp index created');
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id)', (err) => {
      if (err) console.error('Error creating room members index:', err.message);
      else console.log('✓ Room members index created');
    });

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
        reject(err);
        return;
      }
      console.log('Database connection closed');
      console.log('✨ Database initialization complete!');
      resolve();
    });
  });
}

// Run initialization if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database setup failed:', err);
      process.exit(1);
    });
}

module.exports = { initializeDatabase, DB_PATH };