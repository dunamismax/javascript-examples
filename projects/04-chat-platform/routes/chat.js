const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { authenticateToken, authorizeRoom } = require('../middleware/auth');

const router = express.Router();
const DB_PATH = path.join(__dirname, '../database/chat.db');

// GET /api/chat/rooms - Get user's rooms
router.get('/rooms', authenticateToken, (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  db.all(`
    SELECT 
      r.id,
      r.name,
      r.description,
      r.is_private,
      r.created_at,
      rm.role,
      rm.joined_at,
      COUNT(DISTINCT m.id) as message_count,
      MAX(m.created_at) as last_message_at
    FROM rooms r
    JOIN room_members rm ON r.id = rm.room_id
    LEFT JOIN messages m ON r.id = m.room_id
    WHERE rm.user_id = ?
    GROUP BY r.id, r.name, r.description, r.is_private, r.created_at, rm.role, rm.joined_at
    ORDER BY last_message_at DESC, r.created_at DESC
  `, [req.user.id], (err, rooms) => {
    db.close();
    
    if (err) {
      console.error('Database error fetching rooms:', err);
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to fetch rooms'
      });
    }

    res.json({
      rooms: rooms.map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        isPrivate: room.is_private,
        role: room.role,
        messageCount: room.message_count,
        lastMessageAt: room.last_message_at,
        joinedAt: room.joined_at,
        createdAt: room.created_at
      }))
    });
  });
});

// GET /api/chat/rooms/:roomId/messages - Get room messages with pagination
router.get('/rooms/:roomId/messages', authenticateToken, authorizeRoom, (req, res) => {
  const { roomId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const db = new sqlite3.Database(DB_PATH);
  
  // Get messages with user info
  db.all(`
    SELECT 
      m.id,
      m.content,
      m.message_type,
      m.file_url,
      m.file_name,
      m.reply_to,
      m.edited_at,
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
    WHERE m.room_id = ?
    ORDER BY m.created_at DESC
    LIMIT ? OFFSET ?
  `, [roomId, parseInt(limit), offset], (err, messages) => {
    if (err) {
      console.error('Database error fetching messages:', err);
      db.close();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to fetch messages'
      });
    }

    // Get total count for pagination
    db.get(
      'SELECT COUNT(*) as total FROM messages WHERE room_id = ?',
      [roomId],
      (err, countResult) => {
        db.close();
        
        if (err) {
          console.error('Database error counting messages:', err);
          return res.status(500).json({
            error: 'Database error',
            message: 'Failed to count messages'
          });
        }

        const totalMessages = countResult.total;
        const totalPages = Math.ceil(totalMessages / parseInt(limit));

        res.json({
          messages: messages.reverse().map(msg => ({
            id: msg.id,
            content: msg.content,
            messageType: msg.message_type,
            fileUrl: msg.file_url,
            fileName: msg.file_name,
            replyTo: msg.reply_to ? {
              id: msg.reply_to,
              content: msg.reply_content,
              username: msg.reply_username
            } : null,
            editedAt: msg.edited_at,
            createdAt: msg.created_at,
            user: {
              id: msg.user_id,
              username: msg.username,
              avatarUrl: msg.avatar_url
            }
          })),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalMessages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        });
      }
    );
  });
});

// POST /api/chat/rooms/:roomId/messages - Send new message
router.post('/rooms/:roomId/messages', authenticateToken, authorizeRoom, (req, res) => {
  const { roomId } = req.params;
  const { content, messageType = 'text', replyTo } = req.body;

  // Validate input
  if (!content || content.trim() === '') {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Message content is required'
    });
  }

  if (content.length > 2000) {
    return res.status(400).json({
      error: 'Message too long',
      message: 'Message cannot exceed 2000 characters'
    });
  }

  const allowedMessageTypes = ['text', 'file', 'image'];
  if (!allowedMessageTypes.includes(messageType)) {
    return res.status(400).json({
      error: 'Invalid message type',
      message: 'Message type must be text, file, or image'
    });
  }

  const db = new sqlite3.Database(DB_PATH);
  
  // Insert message
  db.run(
    'INSERT INTO messages (content, user_id, room_id, message_type, reply_to) VALUES (?, ?, ?, ?, ?)',
    [content.trim(), req.user.id, roomId, messageType, replyTo || null],
    function(err) {
      if (err) {
        console.error('Database error sending message:', err);
        db.close();
        return res.status(500).json({
          error: 'Database error',
          message: 'Failed to send message'
        });
      }

      const messageId = this.lastID;
      
      // Get the complete message with user info
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
          console.error('Database error fetching sent message:', err);
          return res.status(500).json({
            error: 'Database error',
            message: 'Message sent but failed to retrieve'
          });
        }

        const formattedMessage = {
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
        };

        res.status(201).json({
          message: 'Message sent successfully',
          data: formattedMessage
        });
      });
    }
  );
});

// PUT /api/chat/messages/:messageId - Edit message
router.put('/messages/:messageId', authenticateToken, (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Message content is required'
    });
  }

  if (content.length > 2000) {
    return res.status(400).json({
      error: 'Message too long',
      message: 'Message cannot exceed 2000 characters'
    });
  }

  const db = new sqlite3.Database(DB_PATH);
  
  // Check if message belongs to user
  db.get(
    'SELECT id, user_id, room_id FROM messages WHERE id = ?',
    [messageId],
    (err, message) => {
      if (err) {
        console.error('Database error checking message ownership:', err);
        db.close();
        return res.status(500).json({
          error: 'Database error',
          message: 'Failed to verify message ownership'
        });
      }

      if (!message) {
        db.close();
        return res.status(404).json({
          error: 'Message not found',
          message: 'The specified message does not exist'
        });
      }

      if (message.user_id !== req.user.id) {
        db.close();
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only edit your own messages'
        });
      }

      // Update message
      db.run(
        'UPDATE messages SET content = ?, edited_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content.trim(), messageId],
        (err) => {
          db.close();
          
          if (err) {
            console.error('Database error updating message:', err);
            return res.status(500).json({
              error: 'Database error',
              message: 'Failed to update message'
            });
          }

          res.json({
            message: 'Message updated successfully'
          });
        }
      );
    }
  );
});

// DELETE /api/chat/messages/:messageId - Delete message
router.delete('/messages/:messageId', authenticateToken, (req, res) => {
  const { messageId } = req.params;

  const db = new sqlite3.Database(DB_PATH);
  
  // Check if message belongs to user
  db.get(
    'SELECT id, user_id, room_id FROM messages WHERE id = ?',
    [messageId],
    (err, message) => {
      if (err) {
        console.error('Database error checking message ownership:', err);
        db.close();
        return res.status(500).json({
          error: 'Database error',
          message: 'Failed to verify message ownership'
        });
      }

      if (!message) {
        db.close();
        return res.status(404).json({
          error: 'Message not found',
          message: 'The specified message does not exist'
        });
      }

      if (message.user_id !== req.user.id) {
        db.close();
        return res.status(403).json({
          error: 'Access denied',
          message: 'You can only delete your own messages'
        });
      }

      // Delete message
      db.run(
        'DELETE FROM messages WHERE id = ?',
        [messageId],
        (err) => {
          db.close();
          
          if (err) {
            console.error('Database error deleting message:', err);
            return res.status(500).json({
              error: 'Database error',
              message: 'Failed to delete message'
            });
          }

          res.json({
            message: 'Message deleted successfully'
          });
        }
      );
    }
  );
});

// GET /api/chat/rooms/:roomId/members - Get room members
router.get('/rooms/:roomId/members', authenticateToken, authorizeRoom, (req, res) => {
  const { roomId } = req.params;

  const db = new sqlite3.Database(DB_PATH);
  
  db.all(`
    SELECT 
      u.id,
      u.username,
      u.avatar_url,
      u.is_online,
      u.last_seen,
      rm.role,
      rm.joined_at
    FROM users u
    JOIN room_members rm ON u.id = rm.user_id
    WHERE rm.room_id = ?
    ORDER BY rm.role DESC, u.username ASC
  `, [roomId], (err, members) => {
    db.close();
    
    if (err) {
      console.error('Database error fetching room members:', err);
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to fetch room members'
      });
    }

    res.json({
      members: members.map(member => ({
        id: member.id,
        username: member.username,
        avatarUrl: member.avatar_url,
        isOnline: member.is_online,
        lastSeen: member.last_seen,
        role: member.role,
        joinedAt: member.joined_at
      }))
    });
  });
});

module.exports = router;