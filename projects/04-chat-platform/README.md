# Chat Platform - Real-time Messaging Application

<p align="center">
  <img src="/images/chat-banner.png" alt="Chat Platform" width="600" />
</p>

**🎯 Learning Focus:** Real-time Communication, Advanced Authentication, WebSockets, File Handling, Testing

A production-ready real-time chat application that demonstrates advanced JavaScript concepts including WebSocket communication, JWT authentication, file upload handling, and comprehensive testing strategies.

## Table of Contents

- [Overview](#overview)
- [Learning Objectives](#learning-objectives)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

This chat platform represents the most advanced project in the JavaScript Learning Repository, building upon all concepts from the previous three projects while introducing sophisticated real-time communication patterns, advanced security practices, and modern development methodologies.

### Why This Project Matters

- **Real-World Relevance**: Chat applications are fundamental to modern web development
- **Advanced Concepts**: Introduces WebSockets, JWT authentication, and complex state management
- **Scalability Patterns**: Demonstrates patterns used in production chat systems
- **Testing Practices**: Comprehensive testing strategies for both frontend and backend
- **Security Focus**: Production-ready security implementations

## Learning Objectives

### Backend Advanced Concepts
- **WebSocket Server Implementation**: Real-time bidirectional communication
- **JWT Authentication**: Stateless authentication with token refresh
- **Database Relationships**: Complex multi-table designs with proper indexing
- **Middleware Architecture**: Reusable authentication and authorization middleware
- **File Upload Handling**: Secure file processing and validation
- **Rate Limiting**: API protection and spam prevention
- **Error Handling**: Comprehensive error management strategies

### Frontend Advanced Patterns
- **WebSocket Client Management**: Connection handling, reconnection, and state sync
- **Complex State Management**: Multi-room message state with real-time updates
- **Event-Driven Architecture**: Loose coupling with custom event systems
- **Real-time UI Updates**: Optimistic updates and conflict resolution
- **Advanced DOM Manipulation**: Efficient rendering and virtual scrolling
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### DevOps & Production Concepts
- **Environment Configuration**: Development vs production settings
- **Database Migrations**: Version-controlled schema changes
- **Testing Automation**: Unit, integration, and end-to-end testing
- **Performance Monitoring**: Connection tracking and metrics
- **Security Auditing**: Vulnerability scanning and best practices
- **Deployment Strategies**: Container-ready production deployment

## Features

### 🚀 Core Features
- ✅ **Real-time messaging** with WebSocket connections
- ✅ **User authentication** with JWT tokens and session management
- ✅ **Multiple chat rooms** with role-based access control
- ✅ **Message threading** with reply-to functionality
- ✅ **Typing indicators** showing when users are composing messages
- ✅ **Online presence** tracking with live user status
- ✅ **Message history** with pagination and search
- ✅ **File sharing** with image previews and document support

### 🔒 Security Features
- ✅ **JWT Authentication** with token refresh and expiration
- ✅ **Rate limiting** to prevent spam and abuse
- ✅ **Input validation** and sanitization on all inputs
- ✅ **CORS protection** with configurable origins
- ✅ **Helmet.js security headers** for XSS and clickjacking protection
- ✅ **SQL injection prevention** with parameterized queries
- ✅ **File upload validation** with type and size restrictions

### 💡 Advanced Features
- ✅ **Message editing** and deletion with proper authorization
- ✅ **Private rooms** with invitation-only access
- ✅ **Admin roles** with room management capabilities
- ✅ **Connection recovery** with automatic reconnection
- ✅ **Dark/Light theme** with user preference persistence
- ✅ **Responsive design** optimized for mobile and desktop
- ✅ **Accessibility support** with ARIA labels and keyboard navigation

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend Framework** | [Express.js](https://expressjs.com/) | RESTful API and WebSocket server |
| **WebSocket Library** | [ws](https://github.com/websockets/ws) | Real-time bidirectional communication |
| **Authentication** | [JWT](https://jwt.io/) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Secure token-based authentication |
| **Database** | [SQLite](https://www.sqlite.org/) | Relational data storage with complex relationships |
| **Database Driver** | [sqlite3](https://github.com/TryGhost/node-sqlite3) | Database connectivity and query execution |
| **File Upload** | [Multer](https://github.com/expressjs/multer) | Multipart form data handling |
| **Security** | [Helmet](https://helmetjs.github.io/) + [CORS](https://github.com/expressjs/cors) | Security headers and cross-origin protection |
| **Rate Limiting** | [express-rate-limit](https://github.com/nfriedly/express-rate-limit) | API request throttling |
| **Frontend** | Vanilla JavaScript (ES6+) | Modern JavaScript with classes and modules |
| **Build Tool** | [esbuild](https://esbuild.github.io/) | Lightning-fast bundling and minification |
| **Styling** | Vanilla CSS with CSS Grid/Flexbox | Modern responsive design patterns |

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm package manager
- Modern web browser with WebSocket support

### Installation & Setup

1. **Navigate to project directory:**
   ```bash
   cd projects/04-chat-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```

4. **Seed with demo data:**
   ```bash
   npm run seed-db
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Use demo accounts or create new account

### Demo Accounts

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `alice_demo` | `demo123` | Member | Regular user account |
| `bob_demo` | `demo123` | Member | Regular user account |
| `charlie_demo` | `demo123` | Member | Regular user account |
| `admin` | `admin123` | Admin | Administrator account |

## Project Structure

```
04-chat-platform/
├── server.js                 # Main server entry point
├── package.json              # Dependencies and scripts
├── index.html                # Main application HTML
├── 
├── database/                 # Database management
│   ├── init.js              # Schema creation and migrations
│   └── seed.js              # Sample data seeding
├── 
├── middleware/               # Express middleware
│   └── auth.js              # Authentication & authorization
├── 
├── routes/                   # API route handlers
│   ├── auth.js              # Authentication endpoints
│   └── chat.js              # Chat-related endpoints
├── 
├── utils/                    # Utility modules
│   └── websocket.js         # WebSocket server implementation
├── 
├── src/                      # Source files (pre-build)
│   ├── css/
│   │   └── styles.css       # Application styles
│   └── js/
│       └── main.js          # Frontend application logic
├── 
├── public/                   # Static assets (post-build)
│   ├── css/
│   │   └── bundle.css       # Compiled styles
│   ├── js/
│   │   └── bundle.js        # Compiled JavaScript
│   └── uploads/             # User uploaded files
├── 
└── tests/                    # Test suites
    ├── run-tests.js         # Test runner
    ├── auth.test.js         # Authentication tests
    ├── chat.test.js         # Chat functionality tests
    └── websocket.test.js    # WebSocket tests
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/logout
Logout user and update online status.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### Chat Endpoints

#### GET /api/chat/rooms
Get user's accessible chat rooms.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "rooms": [
    {
      "id": 1,
      "name": "General Discussion",
      "description": "Main chat room for general conversations",
      "isPrivate": false,
      "role": "member",
      "messageCount": 42,
      "lastMessageAt": "2023-12-01T10:30:00Z"
    }
  ]
}
```

#### GET /api/chat/rooms/:roomId/messages
Get paginated messages for a specific room.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Messages per page (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "content": "Hello everyone!",
      "messageType": "text",
      "createdAt": "2023-12-01T10:30:00Z",
      "user": {
        "id": 1,
        "username": "alice_demo",
        "avatarUrl": "/uploads/avatars/alice.png"
      },
      "replyTo": null
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalMessages": 142,
    "hasNextPage": true
  }
}
```

#### POST /api/chat/rooms/:roomId/messages
Send a new message to a room.

**Request Body:**
```json
{
  "content": "Hello everyone!",
  "messageType": "text",
  "replyTo": 5
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": 123,
    "content": "Hello everyone!",
    "messageType": "text",
    "createdAt": "2023-12-01T10:30:00Z",
    "user": {
      "id": 1,
      "username": "alice_demo"
    }
  }
}
```

## WebSocket Events

### Client → Server Events

#### Authentication
```javascript
{
  "type": "auth",
  "payload": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Join Room
```javascript
{
  "type": "join_room",
  "payload": {
    "roomId": 1
  }
}
```

#### Send Message
```javascript
{
  "type": "send_message",
  "payload": {
    "roomId": 1,
    "content": "Hello everyone!",
    "messageType": "text",
    "replyTo": 5
  }
}
```

#### Typing Indicators
```javascript
// Start typing
{
  "type": "typing_start",
  "payload": {
    "roomId": 1
  }
}

// Stop typing
{
  "type": "typing_stop",
  "payload": {
    "roomId": 1
  }
}
```

### Server → Client Events

#### New Message
```javascript
{
  "type": "new_message",
  "payload": {
    "roomId": 1,
    "message": {
      "id": 123,
      "content": "Hello everyone!",
      "user": {
        "id": 2,
        "username": "bob_demo"
      },
      "createdAt": "2023-12-01T10:30:00Z"
    }
  }
}
```

#### User Typing
```javascript
{
  "type": "user_typing",
  "payload": {
    "roomId": 1,
    "user": {
      "id": 2,
      "username": "bob_demo"
    },
    "isTyping": true
  }
}
```

#### User Status Change
```javascript
{
  "type": "user_status_change",
  "payload": {
    "user": {
      "id": 2,
      "username": "bob_demo"
    },
    "isOnline": true
  }
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  is_online BOOLEAN DEFAULT 0,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Rooms Table
```sql
CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT 0,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users (id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
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
);
```

### Room Members Table
```sql
CREATE TABLE room_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL,
  role VARCHAR(20) DEFAULT 'member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (room_id) REFERENCES rooms (id),
  UNIQUE(user_id, room_id)
);
```

## Security Features

### Authentication Security
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Token Refresh**: Automatic token renewal for long-lived sessions
- **Session Management**: Proper logout and token invalidation

### API Security
- **Rate Limiting**: Configurable request throttling per IP address
- **Input Validation**: Comprehensive validation on all user inputs
- **SQL Injection Prevention**: Parameterized queries throughout
- **CORS Protection**: Configurable cross-origin request handling
- **Security Headers**: Helmet.js for XSS and clickjacking protection

### WebSocket Security
- **Token-based Authentication**: JWT verification for all WebSocket connections
- **Message Validation**: Server-side validation of all WebSocket messages
- **Rate Limiting**: WebSocket message frequency limiting
- **Room Authorization**: Verify user access to rooms before message delivery

### File Upload Security
- **File Type Validation**: Whitelist of allowed file types
- **File Size Limits**: Configurable maximum file sizes
- **Virus Scanning**: Integration points for antivirus scanning
- **Secure Storage**: Isolated file storage with access controls

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:auth
npm run test:chat
npm run test:websocket

# Run tests with coverage
npm run test:coverage
```

### Test Categories

#### Unit Tests
- Authentication middleware
- Database operations
- WebSocket message handling
- Input validation functions

#### Integration Tests
- API endpoint functionality
- Database relationships
- WebSocket connection flows
- File upload processes

#### End-to-End Tests
- User registration and login flows
- Complete messaging workflows
- Real-time features testing
- Multi-user scenarios

### Test Structure
```javascript
// Example test structure
describe('Authentication', () => {
  describe('POST /api/auth/login', () => {
    it('should authenticate valid credentials', async () => {
      // Test implementation
    });
    
    it('should reject invalid credentials', async () => {
      // Test implementation
    });
  });
});
```

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build production assets
npm run init-db      # Initialize database schema
npm run seed-db      # Populate with sample data
npm run clean        # Clean build artifacts and database
npm test             # Run test suites
```

### Database Management
```bash
npm run init-db      # Create tables and indexes
npm run seed-db      # Add demo users and rooms
npm run reset-db     # Drop and recreate database
npm run backup-db    # Create database backup
```

### Development Workflow
```bash
# Initial setup
npm install
npm run init-db
npm run seed-db

# Development
npm run dev          # Starts server with auto-reload

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode

# Production build
npm run build        # Build optimized assets
npm start            # Start production server
```

## Deployment

### Environment Variables
```bash
# Production configuration
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database configuration
DB_PATH=./database/chat.db

# File upload configuration
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Update JWT_SECRET to cryptographically secure value
- [ ] Configure ALLOWED_ORIGINS for your domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure file upload limits
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure rate limiting for production load

## Troubleshooting

### Common Issues

#### WebSocket Connection Failed
```bash
# Check if server is running
curl http://localhost:3000/api/health

# Verify WebSocket endpoint
wscat -c ws://localhost:3000/ws
```

#### Database Errors
```bash
# Reset database
npm run clean
npm run init-db
npm run seed-db

# Check database file permissions
ls -la database/chat.db
```

#### Authentication Issues
```bash
# Clear browser storage
# Open Developer Tools → Application → Storage → Clear

# Verify JWT token format
# Check browser Network tab for 401 responses
```

#### Build Errors
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Performance Optimization

#### Database Optimization
- Ensure indexes are created on frequently queried columns
- Use LIMIT and OFFSET for pagination
- Consider connection pooling for high load

#### WebSocket Optimization
- Implement message queuing for offline users
- Add connection heartbeat/ping-pong
- Consider clustering for multiple server instances

#### Frontend Optimization
- Implement virtual scrolling for large message lists
- Use requestAnimationFrame for smooth animations
- Add service worker for offline functionality

### Debug Mode
```bash
# Enable detailed logging
DEBUG=chat:* npm run dev

# WebSocket debugging
DEBUG=ws npm run dev

# Database query logging
DEBUG=sqlite npm run dev
```

## Learning Path Recommendations

### After Completing This Project

1. **Microservices Architecture**: Split chat into separate services
2. **Message Queuing**: Implement Redis for message queuing
3. **Horizontal Scaling**: Multi-server deployment with load balancing
4. **Advanced Security**: OAuth2, 2FA, and audit logging
5. **Mobile Development**: React Native or Ionic chat client
6. **DevOps**: CI/CD pipelines and automated deployment

### Extension Ideas

#### Beginner Extensions
- **Emoji Reactions**: Add emoji reactions to messages
- **Message Formatting**: Support for bold, italic, and code formatting
- **User Status**: Custom status messages and presence indicators

#### Intermediate Extensions
- **Voice Messages**: Audio recording and playback
- **Screen Sharing**: WebRTC screen sharing integration
- **Message Search**: Full-text search across message history
- **Push Notifications**: Browser and mobile push notifications

#### Advanced Extensions
- **Video Calling**: WebRTC video chat integration
- **Message Encryption**: End-to-end encryption implementation
- **Bot Integration**: Chatbot API and webhook support
- **Analytics Dashboard**: User engagement and usage analytics

## Contributing

We welcome contributions to improve this learning project! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** and patterns
3. **Add comprehensive tests** for new functionality
4. **Update documentation** for any API changes
5. **Test thoroughly** across different browsers and scenarios

### Contribution Areas
- Bug fixes and security improvements
- Performance optimizations
- Additional test coverage
- Documentation improvements
- Accessibility enhancements
- Mobile responsiveness improvements

## Support

If you encounter issues or have questions:

1. **Check the troubleshooting section** above
2. **Review the console logs** for error messages
3. **Test with demo accounts** to isolate issues
4. **Check browser compatibility** (requires modern browser)
5. **Verify Node.js version** (requires Node.js 16+)

## License

This project is part of the JavaScript Learning Repository and is licensed under the MIT License. See the main repository LICENSE file for details.

---

<p align="center">
  <strong>Chat Platform - Real-time Messaging</strong><br>
  <sub>Advanced JavaScript • WebSockets • Authentication • Real-time Communication</sub>
</p>

<p align="center">
  Built with ❤️ for JavaScript learning
</p>