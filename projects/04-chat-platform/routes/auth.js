const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const rateLimit = require('express-rate-limit');
const { generateToken, refreshToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../database/chat.db');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again in 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Input validation helper
function validateInput(fields, body) {
  const errors = [];
  
  for (const field of fields) {
    if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  }
  
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Invalid email format');
  }
  
  if (body.password && body.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (body.username && (body.username.length < 3 || body.username.length > 50)) {
    errors.push('Username must be between 3 and 50 characters');
  }
  
  if (body.username && !/^[a-zA-Z0-9_]+$/.test(body.username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return errors;
}

// POST /api/auth/register - Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    const validationErrors = validateInput(['username', 'email', 'password'], req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please correct the following errors',
        details: validationErrors
      });
    }

    const db = new sqlite3.Database(DB_PATH);

    // Check if username or email already exists
    db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username.trim(), email.trim()],
      async (err, existingUser) => {
        if (err) {
          console.error('Database error during registration check:', err);
          db.close();
          return res.status(500).json({
            error: 'Database error',
            message: 'Failed to check user existence'
          });
        }

        if (existingUser) {
          db.close();
          return res.status(409).json({
            error: 'User already exists',
            message: 'Username or email is already taken'
          });
        }

        try {
          // Hash password
          const saltRounds = 12;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Insert new user
          db.run(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username.trim(), email.trim(), hashedPassword],
            function(err) {
              if (err) {
                console.error('Database error during user creation:', err);
                db.close();
                return res.status(500).json({
                  error: 'Database error',
                  message: 'Failed to create user account'
                });
              }

              const userId = this.lastID;
              
              // Auto-join user to public rooms
              db.run(
                'INSERT INTO room_members (user_id, room_id, role) SELECT ?, id, "member" FROM rooms WHERE is_private = 0',
                [userId],
                (err) => {
                  db.close();
                  
                  if (err) {
                    console.error('Error auto-joining rooms:', err);
                    // Don't fail registration for this
                  }

                  // Generate token
                  const user = {
                    id: userId,
                    username: username.trim(),
                    email: email.trim()
                  };
                  
                  const token = generateToken(user);

                  res.status(201).json({
                    message: 'User registered successfully',
                    user: {
                      id: userId,
                      username: username.trim(),
                      email: email.trim()
                    },
                    token
                  });
                }
              );
            }
          );
        } catch (hashError) {
          console.error('Password hashing error:', hashError);
          db.close();
          res.status(500).json({
            error: 'Server error',
            message: 'Failed to process password'
          });
        }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Registration failed'
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', authLimiter, (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    const validationErrors = validateInput(['username', 'password'], req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please provide both username and password',
        details: validationErrors
      });
    }

    const db = new sqlite3.Database(DB_PATH);

    // Find user by username or email
    db.get(
      'SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?',
      [username.trim(), username.trim()],
      async (err, user) => {
        if (err) {
          console.error('Database error during login:', err);
          db.close();
          return res.status(500).json({
            error: 'Database error',
            message: 'Login failed'
          });
        }

        if (!user) {
          db.close();
          return res.status(401).json({
            error: 'Invalid credentials',
            message: 'Username or password is incorrect'
          });
        }

        try {
          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.password_hash);
          
          if (!passwordMatch) {
            db.close();
            return res.status(401).json({
              error: 'Invalid credentials',
              message: 'Username or password is incorrect'
            });
          }

          // Update user's online status
          db.run(
            'UPDATE users SET is_online = 1, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id],
            (err) => {
              db.close();
              
              if (err) {
                console.error('Error updating online status:', err);
                // Don't fail login for this
              }

              // Generate token
              const tokenUser = {
                id: user.id,
                username: user.username,
                email: user.email
              };
              
              const token = generateToken(tokenUser);

              res.json({
                message: 'Login successful',
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email
                },
                token
              });
            }
          );
        } catch (compareError) {
          console.error('Password comparison error:', compareError);
          db.close();
          res.status(500).json({
            error: 'Server error',
            message: 'Login failed'
          });
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Login failed'
    });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', authenticateToken, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  // Update user's online status
  db.run(
    'UPDATE users SET is_online = 0, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
    [req.user.id],
    (err) => {
      db.close();
      
      if (err) {
        console.error('Error updating offline status:', err);
        return res.status(500).json({
          error: 'Database error',
          message: 'Logout failed'
        });
      }

      res.json({
        message: 'Logout successful'
      });
    }
  );
});

// POST /api/auth/refresh - Refresh JWT token
router.post('/refresh', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      error: 'Token required',
      message: 'Please provide a token to refresh'
    });
  }

  refreshToken(token)
    .then(newToken => {
      res.json({
        message: 'Token refreshed successfully',
        token: newToken
      });
    })
    .catch(error => {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: 'Token refresh failed',
        message: error.message
      });
    });
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  db.get(
    'SELECT id, username, email, avatar_url, is_online, last_seen, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      db.close();
      
      if (err) {
        console.error('Database error fetching user:', err);
        return res.status(500).json({
          error: 'Database error',
          message: 'Failed to fetch user information'
        });
      }

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User account no longer exists'
        });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatar_url,
          isOnline: user.is_online,
          lastSeen: user.last_seen,
          createdAt: user.created_at
        }
      });
    }
  );
});

module.exports = router;