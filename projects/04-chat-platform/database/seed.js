const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, 'chat.db');

async function seedDatabase() {
  return new Promise(async (resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to database for seeding');
    });

    try {
      // Hash passwords for demo users
      const demoPassword = await bcrypt.hash('demo123', 10);
      const adminPassword = await bcrypt.hash('admin123', 10);

      // Seed users
      const users = [
        {
          username: 'alice_demo',
          email: 'alice@example.com',
          password_hash: demoPassword,
          avatar_url: '/uploads/avatars/alice.png'
        },
        {
          username: 'bob_demo',
          email: 'bob@example.com',
          password_hash: demoPassword,
          avatar_url: '/uploads/avatars/bob.png'
        },
        {
          username: 'charlie_demo',
          email: 'charlie@example.com',
          password_hash: demoPassword,
          avatar_url: '/uploads/avatars/charlie.png'
        },
        {
          username: 'admin',
          email: 'admin@example.com',
          password_hash: adminPassword,
          avatar_url: '/uploads/avatars/admin.png'
        }
      ];

      // Insert users
      for (const user of users) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR REPLACE INTO users (username, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
            [user.username, user.email, user.password_hash, user.avatar_url],
            function(err) {
              if (err) {
                console.error('Error inserting user:', err.message);
                reject(err);
              } else {
                console.log(`✓ User ${user.username} created with ID: ${this.lastID}`);
                resolve();
              }
            }
          );
        });
      }

      // Seed rooms
      const rooms = [
        {
          name: 'General Discussion',
          description: 'Main chat room for general conversations',
          is_private: 0,
          created_by: 4 // admin
        },
        {
          name: 'JavaScript Help',
          description: 'Get help with JavaScript programming',
          is_private: 0,
          created_by: 4 // admin
        },
        {
          name: 'Random',
          description: 'Off-topic discussions and random thoughts',
          is_private: 0,
          created_by: 4 // admin
        },
        {
          name: 'Private Team',
          description: 'Private room for team members only',
          is_private: 1,
          created_by: 4 // admin
        }
      ];

      // Insert rooms
      for (const room of rooms) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR REPLACE INTO rooms (name, description, is_private, created_by) VALUES (?, ?, ?, ?)',
            [room.name, room.description, room.is_private, room.created_by],
            function(err) {
              if (err) {
                console.error('Error inserting room:', err.message);
                reject(err);
              } else {
                console.log(`✓ Room "${room.name}" created with ID: ${this.lastID}`);
                resolve();
              }
            }
          );
        });
      }

      // Add users to rooms
      const roomMemberships = [
        // General Discussion (room 1) - all users
        { user_id: 1, room_id: 1, role: 'member' },
        { user_id: 2, room_id: 1, role: 'member' },
        { user_id: 3, room_id: 1, role: 'member' },
        { user_id: 4, room_id: 1, role: 'admin' },
        
        // JavaScript Help (room 2) - most users
        { user_id: 1, room_id: 2, role: 'member' },
        { user_id: 3, room_id: 2, role: 'member' },
        { user_id: 4, room_id: 2, role: 'admin' },
        
        // Random (room 3) - some users
        { user_id: 2, room_id: 3, role: 'member' },
        { user_id: 3, room_id: 3, role: 'member' },
        { user_id: 4, room_id: 3, role: 'admin' },
        
        // Private Team (room 4) - limited users
        { user_id: 1, room_id: 4, role: 'member' },
        { user_id: 4, room_id: 4, role: 'admin' }
      ];

      for (const membership of roomMemberships) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT OR REPLACE INTO room_members (user_id, room_id, role) VALUES (?, ?, ?)',
            [membership.user_id, membership.room_id, membership.role],
            function(err) {
              if (err) {
                console.error('Error inserting room membership:', err.message);
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      }
      console.log('✓ Room memberships created');

      // Seed sample messages
      const messages = [
        {
          content: 'Welcome to the General Discussion room! Feel free to introduce yourself.',
          user_id: 4,
          room_id: 1,
          message_type: 'text'
        },
        {
          content: 'Hi everyone! I\'m Alice, excited to be part of this chat platform.',
          user_id: 1,
          room_id: 1,
          message_type: 'text'
        },
        {
          content: 'Hey Alice! Welcome aboard. This platform has some great features.',
          user_id: 2,
          room_id: 1,
          message_type: 'text'
        },
        {
          content: 'Thanks Bob! The real-time messaging is really smooth.',
          user_id: 1,
          room_id: 1,
          message_type: 'text'
        },
        {
          content: 'If you need help with JavaScript, check out the #javascript-help room!',
          user_id: 3,
          room_id: 1,
          message_type: 'text'
        },
        {
          content: 'This room is dedicated to helping with JavaScript questions and problems.',
          user_id: 4,
          room_id: 2,
          message_type: 'text'
        },
        {
          content: 'I\'m having trouble with async/await. Can someone help?',
          user_id: 1,
          room_id: 2,
          message_type: 'text'
        },
        {
          content: 'Sure! Async/await is syntactic sugar over Promises. What specific issue are you facing?',
          user_id: 3,
          room_id: 2,
          message_type: 'text'
        },
        {
          content: 'What\'s everyone\'s favorite programming meme? 😄',
          user_id: 2,
          room_id: 3,
          message_type: 'text'
        },
        {
          content: '"It works on my machine" - every developer ever 😂',
          user_id: 3,
          room_id: 3,
          message_type: 'text'
        }
      ];

      for (const message of messages) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO messages (content, user_id, room_id, message_type) VALUES (?, ?, ?, ?)',
            [message.content, message.user_id, message.room_id, message.message_type],
            function(err) {
              if (err) {
                console.error('Error inserting message:', err.message);
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      }
      console.log('✓ Sample messages created');

      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
          return;
        }
        console.log('Database connection closed');
        console.log('✨ Database seeding complete!');
        console.log('\nDemo accounts created:');
        console.log('- Username: alice_demo, Password: demo123');
        console.log('- Username: bob_demo, Password: demo123');
        console.log('- Username: charlie_demo, Password: demo123');
        console.log('- Username: admin, Password: admin123');
        resolve();
      });

    } catch (error) {
      console.error('Error during seeding:', error);
      db.close();
      reject(error);
    }
  });
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };