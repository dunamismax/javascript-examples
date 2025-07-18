const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { authenticateWebSocket } = require('../middleware/auth');

const DB_PATH = path.join(__dirname, '../database/chat.db');

class ChatWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws'
    });
    
    this.clients = new Map(); // Map of userId -> Set of WebSocket connections
    this.rooms = new Map();   // Map of roomId -> Set of userIds
    this.typingUsers = new Map(); // Map of roomId -> Set of userIds currently typing
    
    this.setupWebSocketServer();
    this.setupCleanupTimers();
  }

  setupWebSocketServer() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection attempt');
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnection(ws);
      });
    });
  }

  async handleMessage(ws, message) {
    const { type, payload } = message;

    try {
      switch (type) {
        case 'auth':
          await this.handleAuthentication(ws, payload);
          break;
        
        case 'join_room':
          await this.handleJoinRoom(ws, payload);
          break;
        
        case 'leave_room':
          await this.handleLeaveRoom(ws, payload);
          break;
        
        case 'send_message':
          await this.handleSendMessage(ws, payload);
          break;
        
        case 'typing_start':
          await this.handleTypingStart(ws, payload);
          break;
        
        case 'typing_stop':
          await this.handleTypingStop(ws, payload);
          break;
        
        case 'ping':
          this.sendToClient(ws, { type: 'pong', payload: { timestamp: Date.now() } });
          break;
        
        default:
          this.sendError(ws, `Unknown message type: ${type}`);
      }
    } catch (error) {
      console.error(`Error handling ${type} message:`, error);
      this.sendError(ws, `Failed to process ${type} message`);
    }
  }

  async handleAuthentication(ws, payload) {
    const { token } = payload;
    
    try {
      const user = await authenticateWebSocket(token);
      
      ws.userId = user.id;
      ws.username = user.username;
      ws.isAuthenticated = true;
      
      // Add client to active connections
      if (!this.clients.has(user.id)) {
        this.clients.set(user.id, new Set());
      }
      this.clients.get(user.id).add(ws);
      
      // Update user online status in database
      await this.updateUserOnlineStatus(user.id, true);
      
      this.sendToClient(ws, {
        type: 'auth_success',
        payload: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      });
      
      // Notify other users that this user is online
      this.broadcastUserStatusChange(user.id, user.username, true);
      
      console.log(`User ${user.username} (${user.id}) authenticated via WebSocket`);
      
    } catch (error) {
      console.error('WebSocket authentication failed:', error);
      this.sendError(ws, 'Authentication failed');
      ws.close();
    }
  }

  async handleJoinRoom(ws, payload) {
    if (!ws.isAuthenticated) {
      return this.sendError(ws, 'Authentication required');
    }

    const { roomId } = payload;
    
    try {
      // Verify user has access to room
      const hasAccess = await this.verifyRoomAccess(ws.userId, roomId);
      if (!hasAccess) {
        return this.sendError(ws, 'Access denied to room');
      }
      
      // Add user to room
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      this.rooms.get(roomId).add(ws.userId);
      
      // Add room to user's WebSocket connection
      if (!ws.rooms) {
        ws.rooms = new Set();
      }
      ws.rooms.add(roomId);
      
      this.sendToClient(ws, {
        type: 'room_joined',
        payload: { roomId }
      });
      
      // Notify other room members
      this.broadcastToRoom(roomId, {
        type: 'user_joined_room',
        payload: {
          roomId,
          user: {
            id: ws.userId,
            username: ws.username
          }
        }
      }, ws.userId); // Exclude the joining user
      
      console.log(`User ${ws.username} joined room ${roomId}`);
      
    } catch (error) {
      console.error('Error joining room:', error);
      this.sendError(ws, 'Failed to join room');
    }
  }

  async handleLeaveRoom(ws, payload) {
    if (!ws.isAuthenticated) {
      return this.sendError(ws, 'Authentication required');
    }

    const { roomId } = payload;
    this.removeUserFromRoom(ws.userId, roomId);
    
    if (ws.rooms) {
      ws.rooms.delete(roomId);
    }
    
    this.sendToClient(ws, {
      type: 'room_left',
      payload: { roomId }
    });
    
    // Notify other room members
    this.broadcastToRoom(roomId, {
      type: 'user_left_room',
      payload: {
        roomId,
        user: {
          id: ws.userId,
          username: ws.username
        }
      }
    }, ws.userId);
    
    console.log(`User ${ws.username} left room ${roomId}`);
  }

  async handleSendMessage(ws, payload) {
    if (!ws.isAuthenticated) {
      return this.sendError(ws, 'Authentication required');
    }

    const { roomId, content, messageType = 'text', replyTo } = payload;
    
    try {
      // Verify user has access to room
      const hasAccess = await this.verifyRoomAccess(ws.userId, roomId);
      if (!hasAccess) {
        return this.sendError(ws, 'Access denied to room');
      }
      
      // Save message to database
      const messageId = await this.saveMessage(ws.userId, roomId, content, messageType, replyTo);
      
      // Get complete message with user info
      const messageData = await this.getMessageById(messageId);
      
      // Broadcast message to all room members
      this.broadcastToRoom(roomId, {
        type: 'new_message',
        payload: {
          roomId,
          message: messageData
        }
      });
      
      console.log(`Message sent by ${ws.username} in room ${roomId}`);
      
    } catch (error) {
      console.error('Error sending message:', error);
      this.sendError(ws, 'Failed to send message');
    }
  }

  async handleTypingStart(ws, payload) {
    if (!ws.isAuthenticated) {
      return this.sendError(ws, 'Authentication required');
    }

    const { roomId } = payload;
    
    // Add user to typing indicators
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set());
    }
    this.typingUsers.get(roomId).add(ws.userId);
    
    // Broadcast typing indicator to room (except sender)
    this.broadcastToRoom(roomId, {
      type: 'user_typing',
      payload: {
        roomId,
        user: {
          id: ws.userId,
          username: ws.username
        },
        isTyping: true
      }
    }, ws.userId);
    
    // Auto-stop typing after 3 seconds
    setTimeout(() => {
      this.handleTypingStop(ws, { roomId });
    }, 3000);
  }

  async handleTypingStop(ws, payload) {
    if (!ws.isAuthenticated) {
      return;
    }

    const { roomId } = payload;
    
    // Remove user from typing indicators
    if (this.typingUsers.has(roomId)) {
      this.typingUsers.get(roomId).delete(ws.userId);
      
      if (this.typingUsers.get(roomId).size === 0) {
        this.typingUsers.delete(roomId);
      }
    }
    
    // Broadcast typing stop to room (except sender)
    this.broadcastToRoom(roomId, {
      type: 'user_typing',
      payload: {
        roomId,
        user: {
          id: ws.userId,
          username: ws.username
        },
        isTyping: false
      }
    }, ws.userId);
  }

  handleDisconnection(ws) {
    if (!ws.isAuthenticated) {
      return;
    }
    
    console.log(`User ${ws.username} (${ws.userId}) disconnected`);
    
    // Remove from all rooms
    if (ws.rooms) {
      ws.rooms.forEach(roomId => {
        this.removeUserFromRoom(ws.userId, roomId);
        
        // Notify room members
        this.broadcastToRoom(roomId, {
          type: 'user_left_room',
          payload: {
            roomId,
            user: {
              id: ws.userId,
              username: ws.username
            }
          }
        }, ws.userId);
      });
    }
    
    // Remove from typing indicators
    this.typingUsers.forEach((users, roomId) => {
      if (users.has(ws.userId)) {
        users.delete(ws.userId);
        this.broadcastToRoom(roomId, {
          type: 'user_typing',
          payload: {
            roomId,
            user: {
              id: ws.userId,
              username: ws.username
            },
            isTyping: false
          }
        }, ws.userId);
      }
    });
    
    // Remove from active connections
    if (this.clients.has(ws.userId)) {
      this.clients.get(ws.userId).delete(ws);
      
      // If user has no more connections, mark as offline
      if (this.clients.get(ws.userId).size === 0) {
        this.clients.delete(ws.userId);
        this.updateUserOnlineStatus(ws.userId, false);
        this.broadcastUserStatusChange(ws.userId, ws.username, false);
      }
    }
  }

  // Helper methods

  sendToClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  sendError(ws, error) {
    this.sendToClient(ws, {
      type: 'error',
      payload: { error }
    });
  }

  broadcastToRoom(roomId, message, excludeUserId = null) {
    if (!this.rooms.has(roomId)) {
      return;
    }
    
    this.rooms.get(roomId).forEach(userId => {
      if (userId === excludeUserId) {
        return;
      }
      
      if (this.clients.has(userId)) {
        this.clients.get(userId).forEach(ws => {
          this.sendToClient(ws, message);
        });
      }
    });
  }

  broadcastUserStatusChange(userId, username, isOnline) {
    const message = {
      type: 'user_status_change',
      payload: {
        user: {
          id: userId,
          username: username
        },
        isOnline
      }
    };
    
    this.clients.forEach((connections, clientUserId) => {
      if (clientUserId !== userId) {
        connections.forEach(ws => {
          this.sendToClient(ws, message);
        });
      }
    });
  }

  removeUserFromRoom(userId, roomId) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(userId);
      
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  // Database helper methods

  async verifyRoomAccess(userId, roomId) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB_PATH);
      
      db.get(
        'SELECT 1 FROM room_members WHERE user_id = ? AND room_id = ?',
        [userId, roomId],
        (err, row) => {
          db.close();
          
          if (err) {
            reject(err);
            return;
          }
          
          resolve(!!row);
        }
      );
    });
  }

  async updateUserOnlineStatus(userId, isOnline) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB_PATH);
      
      db.run(
        'UPDATE users SET is_online = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
        [isOnline ? 1 : 0, userId],
        (err) => {
          db.close();
          
          if (err) {
            reject(err);
            return;
          }
          
          resolve();
        }
      );
    });
  }

  async saveMessage(userId, roomId, content, messageType, replyTo) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB_PATH);
      
      db.run(
        'INSERT INTO messages (content, user_id, room_id, message_type, reply_to) VALUES (?, ?, ?, ?, ?)',
        [content, userId, roomId, messageType, replyTo || null],
        function(err) {
          db.close();
          
          if (err) {
            reject(err);
            return;
          }
          
          resolve(this.lastID);
        }
      );
    });
  }

  async getMessageById(messageId) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(DB_PATH);
      
      db.get(`
        SELECT 
          m.id,
          m.content,
          m.message_type,
          m.file_url,
          m.file_name,
          m.reply_to,
          m.created_at,
          u.id as user_id,
          u.username,
          u.avatar_url,
          reply_msg.content as reply_content,
          reply_user.username as reply_username
        FROM messages m
        JOIN users u ON m.user_id = u.id
        LEFT JOIN messages reply_msg ON m.reply_to = reply_msg.id
        LEFT JOIN users reply_user ON reply_msg.user_id = reply_user.id
        WHERE m.id = ?
      `, [messageId], (err, message) => {
        db.close();
        
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          id: message.id,
          content: message.content,
          messageType: message.message_type,
          fileUrl: message.file_url,
          fileName: message.file_name,
          replyTo: message.reply_to ? {
            id: message.reply_to,
            content: message.reply_content,
            username: message.reply_username
          } : null,
          createdAt: message.created_at,
          user: {
            id: message.user_id,
            username: message.username,
            avatarUrl: message.avatar_url
          }
        });
      });
    });
  }

  setupCleanupTimers() {
    // Clean up stale typing indicators every 30 seconds
    setInterval(() => {
      this.typingUsers.forEach((users, roomId) => {
        if (users.size === 0) {
          this.typingUsers.delete(roomId);
        }
      });
    }, 30000);
    
    // Clean up empty rooms every minute
    setInterval(() => {
      this.rooms.forEach((users, roomId) => {
        if (users.size === 0) {
          this.rooms.delete(roomId);
        }
      });
    }, 60000);
  }

  // Get connection statistics
  getStats() {
    return {
      connectedUsers: this.clients.size,
      activeRooms: this.rooms.size,
      totalConnections: Array.from(this.clients.values()).reduce((acc, connections) => acc + connections.size, 0),
      typingUsers: Array.from(this.typingUsers.values()).reduce((acc, users) => acc + users.size, 0)
    };
  }
}

module.exports = ChatWebSocketServer;