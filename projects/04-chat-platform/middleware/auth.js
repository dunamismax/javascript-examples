const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/chat.db');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
    
    req.user = user;
    next();
  });
}

// Middleware to verify WebSocket token
function authenticateWebSocket(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Access token required'));
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        reject(new Error('Invalid or expired token'));
        return;
      }
      resolve(user);
    });
  });
}

// Middleware to check if user has access to a room
function authorizeRoom(req, res, next) {
  const { roomId } = req.params;
  const userId = req.user.id;

  const db = new sqlite3.Database(DB_PATH);
  
  db.get(`
    SELECT rm.*, r.is_private, r.name 
    FROM room_members rm
    JOIN rooms r ON rm.room_id = r.id
    WHERE rm.user_id = ? AND rm.room_id = ?
  `, [userId, roomId], (err, row) => {
    if (err) {
      console.error('Database error in room authorization:', err);
      return res.status(500).json({ 
        error: 'Database error',
        message: 'Failed to verify room access'
      });
    }

    if (!row) {
      return res.status(403).json({ 
        error: 'Room access denied',
        message: 'You do not have access to this room'
      });
    }

    req.roomAccess = {
      role: row.role,
      isPrivate: row.is_private,
      roomName: row.name
    };
    
    db.close();
    next();
  });
}

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.roomAccess?.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'This action requires administrator privileges'
    });
  }
  next();
}

// Generate JWT token for user
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '24h',
    issuer: 'chat-platform',
    audience: 'chat-users'
  });
}

// Refresh token (generate new token with extended expiry)
function refreshToken(oldToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true }, (err, decoded) => {
      if (err) {
        reject(new Error('Invalid token'));
        return;
      }

      // Check if token was expired more than 7 days ago
      const now = Math.floor(Date.now() / 1000);
      const maxRefreshAge = 7 * 24 * 60 * 60; // 7 days
      
      if (decoded.exp && (now - decoded.exp) > maxRefreshAge) {
        reject(new Error('Token too old to refresh'));
        return;
      }

      // Generate new token with same payload
      const newPayload = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email
      };
      
      const newToken = jwt.sign(newPayload, JWT_SECRET, { 
        expiresIn: '24h',
        issuer: 'chat-platform',
        audience: 'chat-users'
      });
      
      resolve(newToken);
    });
  });
}

module.exports = {
  authenticateToken,
  authenticateWebSocket,
  authorizeRoom,
  requireAdmin,
  generateToken,
  refreshToken,
  JWT_SECRET
};