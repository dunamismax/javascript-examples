/**
 * Chat Platform - Real-time messaging application
 * 
 * This application demonstrates advanced JavaScript concepts including:
 * - WebSocket real-time communication
 * - JWT authentication
 * - Modern ES6+ syntax and patterns
 * - DOM manipulation and event handling
 * - State management
 * - Error handling and user feedback
 * - Responsive design and accessibility
 */

class ChatApplication {
  constructor() {
    // Application state
    this.state = {
      user: null,
      currentRoom: null,
      rooms: [],
      messages: new Map(),
      onlineUsers: new Set(),
      typingUsers: new Map(),
      replyingTo: null
    };

    // WebSocket connection
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;

    // API base URL
    this.apiBase = window.location.origin + '/api';

    // DOM elements
    this.elements = {};

    // Event listeners
    this.eventListeners = new Map();

    // Initialize application
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      this.cacheElements();
      this.setupEventListeners();
      
      // Check for existing authentication
      const token = this.getAuthToken();
      if (token) {
        await this.authenticateUser(token);
      } else {
        this.showAuthModal();
      }
      
      this.hideLoadingScreen();
    } catch (error) {
      console.error('Application initialization failed:', error);
      this.showError('Failed to initialize application');
      this.hideLoadingScreen();
    }
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    const elementIds = [
      'loading-screen', 'app', 'auth-modal', 'connection-status',
      'user-menu-btn', 'user-dropdown', 'user-avatar-img',
      'user-display-name', 'user-email', 'logout-btn',
      'rooms-list', 'current-room-name', 'current-room-description',
      'messages-container', 'welcome-message', 'messages-list',
      'typing-indicators', 'message-input', 'send-btn',
      'char-counter', 'reply-context', 'reply-username',
      'reply-content', 'reply-cancel-btn', 'online-users-list',
      'login-form', 'register-form', 'auth-error',
      'auth-error-message', 'room-members-modal', 'room-members-list'
    ];

    elementIds.forEach(id => {
      this.elements[id] = document.getElementById(id);
    });

    // Auth form elements
    this.elements.loginUsername = document.getElementById('login-username');
    this.elements.loginPassword = document.getElementById('login-password');
    this.elements.registerUsername = document.getElementById('register-username');
    this.elements.registerEmail = document.getElementById('register-email');
    this.elements.registerPassword = document.getElementById('register-password');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Authentication
    this.addEventListeners([
      [this.elements['login-form'], 'submit', this.handleLogin.bind(this)],
      [this.elements['register-form'], 'submit', this.handleRegister.bind(this)],
      [this.elements['logout-btn'], 'click', this.handleLogout.bind(this)]
    ]);

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      this.addEventListener(tab, 'click', this.handleAuthTabSwitch.bind(this));
    });

    // Demo account buttons
    document.querySelectorAll('.demo-account-btn').forEach(btn => {
      this.addEventListener(btn, 'click', this.handleDemoLogin.bind(this));
    });

    // User menu
    this.addEventListeners([
      [this.elements['user-menu-btn'], 'click', this.toggleUserMenu.bind(this)],
      [document, 'click', this.handleDocumentClick.bind(this)]
    ]);

    // Message input
    this.addEventListeners([
      [this.elements['message-input'], 'input', this.handleMessageInput.bind(this)],
      [this.elements['message-input'], 'keydown', this.handleMessageKeydown.bind(this)],
      [this.elements['send-btn'], 'click', this.sendMessage.bind(this)],
      [this.elements['reply-cancel-btn'], 'click', this.cancelReply.bind(this)]
    ]);

    // Modal close buttons
    document.querySelectorAll('[data-modal]').forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        const modalId = e.target.getAttribute('data-modal');
        this.hideModal(modalId);
      });
    });

    // Room members button
    const roomMembersBtn = document.getElementById('room-members-btn');
    if (roomMembersBtn) {
      this.addEventListener(roomMembersBtn, 'click', this.showRoomMembers.bind(this));
    }

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      this.addEventListener(themeToggleBtn, 'click', this.toggleTheme.bind(this));
    }

    // Window events
    this.addEventListeners([
      [window, 'beforeunload', this.handleBeforeUnload.bind(this)],
      [window, 'online', this.handleOnline.bind(this)],
      [window, 'offline', this.handleOffline.bind(this)]
    ]);
  }

  /**
   * Helper to add multiple event listeners and track them
   */
  addEventListeners(listeners) {
    listeners.forEach(([element, event, handler]) => {
      if (element) {
        this.addEventListener(element, event, handler);
      }
    });
  }

  /**
   * Add event listener and track it for cleanup
   */
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, []);
    }
    this.eventListeners.get(element).push({ event, handler });
  }

  /**
   * Remove all tracked event listeners
   */
  removeAllEventListeners() {
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });
    this.eventListeners.clear();
  }

  /**
   * Authentication Methods
   */
  async handleLogin(e) {
    e.preventDefault();
    
    const username = this.elements.loginUsername.value.trim();
    const password = this.elements.loginPassword.value;

    if (!username || !password) {
      this.showAuthError('Please fill in all fields');
      return;
    }

    try {
      const response = await this.apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (response.token) {
        this.setAuthToken(response.token);
        await this.authenticateUser(response.token);
        this.hideAuthModal();
      }
    } catch (error) {
      this.showAuthError(error.message || 'Login failed');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    
    const username = this.elements.registerUsername.value.trim();
    const email = this.elements.registerEmail.value.trim();
    const password = this.elements.registerPassword.value;

    if (!username || !email || !password) {
      this.showAuthError('Please fill in all fields');
      return;
    }

    try {
      const response = await this.apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });

      if (response.token) {
        this.setAuthToken(response.token);
        await this.authenticateUser(response.token);
        this.hideAuthModal();
        this.showSuccess('Account created successfully!');
      }
    } catch (error) {
      this.showAuthError(error.message || 'Registration failed');
    }
  }

  async handleDemoLogin(e) {
    const username = e.target.getAttribute('data-username');
    const password = e.target.getAttribute('data-password');
    
    this.elements.loginUsername.value = username;
    this.elements.loginPassword.value = password;
    
    // Switch to login tab
    this.switchAuthTab('login');
    
    // Auto-submit after a short delay
    setTimeout(() => {
      this.elements['login-form'].dispatchEvent(new Event('submit'));
    }, 100);
  }

  async handleLogout() {
    try {
      // Call logout API
      await this.apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Clean up regardless of API call success
    this.logout();
  }

  logout() {
    // Close WebSocket connection
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Clear authentication
    this.removeAuthToken();
    this.state.user = null;
    this.state.currentRoom = null;
    this.state.rooms = [];
    this.state.messages.clear();

    // Reset UI
    this.hideUserMenu();
    this.clearMessages();
    this.clearRooms();
    this.showWelcomeMessage();
    this.showAuthModal();
    this.updateConnectionStatus('disconnected');
  }

  async authenticateUser(token) {
    try {
      // Verify token with server
      const response = await this.apiCall('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.user) {
        this.state.user = response.user;
        this.updateUserUI();
        await this.connectWebSocket(token);
        await this.loadRooms();
        return true;
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      this.removeAuthToken();
      throw error;
    }
    
    return false;
  }

  /**
   * WebSocket Methods
   */
  async connectWebSocket(token) {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.updateConnectionStatus('connected');
        this.reconnectAttempts = 0;
        
        // Authenticate via WebSocket
        this.sendWebSocketMessage('auth', { token });
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.updateConnectionStatus('disconnected');
        
        if (!event.wasClean && this.state.user) {
          this.attemptReconnect(token);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateConnectionStatus('disconnected');
        reject(error);
      };
    });
  }

  sendWebSocketMessage(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected, message not sent:', type, payload);
    }
  }

  handleWebSocketMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'auth_success':
        console.log('WebSocket authentication successful');
        break;

      case 'new_message':
        this.handleNewMessage(payload);
        break;

      case 'user_joined_room':
        this.handleUserJoinedRoom(payload);
        break;

      case 'user_left_room':
        this.handleUserLeftRoom(payload);
        break;

      case 'user_typing':
        this.handleUserTyping(payload);
        break;

      case 'user_status_change':
        this.handleUserStatusChange(payload);
        break;

      case 'room_joined':
        console.log('Joined room:', payload.roomId);
        break;

      case 'error':
        console.error('WebSocket error:', payload.error);
        this.showError(payload.error);
        break;

      case 'pong':
        // Handle ping response
        break;

      default:
        console.log('Unknown WebSocket message type:', type, payload);
    }
  }

  attemptReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.showError('Connection lost. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    this.updateConnectionStatus('connecting');
    
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(async () => {
      try {
        await this.connectWebSocket(token);
        
        // Rejoin current room if any
        if (this.state.currentRoom) {
          this.sendWebSocketMessage('join_room', { roomId: this.state.currentRoom.id });
        }
      } catch (error) {
        console.error('Reconnection failed:', error);
        this.attemptReconnect(token);
      }
    }, delay);
  }

  /**
   * Room and Message Methods
   */
  async loadRooms() {
    try {
      const response = await this.apiCall('/chat/rooms');
      this.state.rooms = response.rooms;
      this.renderRooms();
      
      // Auto-select first room if available
      if (this.state.rooms.length > 0 && !this.state.currentRoom) {
        this.selectRoom(this.state.rooms[0]);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
      this.showError('Failed to load rooms');
    }
  }

  async selectRoom(room) {
    // Leave current room
    if (this.state.currentRoom) {
      this.sendWebSocketMessage('leave_room', { roomId: this.state.currentRoom.id });
    }

    this.state.currentRoom = room;
    
    // Update UI
    this.updateRoomUI();
    this.hideWelcomeMessage();
    this.showMessagesList();
    
    // Enable input
    this.elements['message-input'].disabled = false;
    this.elements['send-btn'].disabled = false;
    
    // Join room via WebSocket
    this.sendWebSocketMessage('join_room', { roomId: room.id });
    
    // Load messages
    await this.loadMessages(room.id);
    
    // Load room members
    await this.loadRoomMembers(room.id);
  }

  async loadMessages(roomId, page = 1) {
    try {
      const response = await this.apiCall(`/chat/rooms/${roomId}/messages?page=${page}&limit=50`);
      
      if (!this.state.messages.has(roomId)) {
        this.state.messages.set(roomId, []);
      }
      
      // For now, just replace messages (pagination can be improved later)
      this.state.messages.set(roomId, response.messages);
      
      if (this.state.currentRoom && this.state.currentRoom.id === roomId) {
        this.renderMessages();
        this.scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      this.showError('Failed to load messages');
    }
  }

  async loadRoomMembers(roomId) {
    try {
      const response = await this.apiCall(`/chat/rooms/${roomId}/members`);
      // Update online users list
      this.renderOnlineUsers(response.members.filter(member => member.isOnline));
    } catch (error) {
      console.error('Failed to load room members:', error);
    }
  }

  async sendMessage() {
    const content = this.elements['message-input'].value.trim();
    
    if (!content || !this.state.currentRoom) {
      return;
    }

    const messageData = {
      roomId: this.state.currentRoom.id,
      content,
      messageType: 'text',
      replyTo: this.state.replyingTo?.id || null
    };

    try {
      // Send via WebSocket for real-time delivery
      this.sendWebSocketMessage('send_message', messageData);
      
      // Clear input
      this.elements['message-input'].value = '';
      this.updateCharCounter();
      this.cancelReply();
      
      // Auto-resize textarea
      this.autoResizeTextarea();
      
    } catch (error) {
      console.error('Failed to send message:', error);
      this.showError('Failed to send message');
    }
  }

  handleNewMessage(data) {
    const { roomId, message } = data;
    
    // Add message to state
    if (!this.state.messages.has(roomId)) {
      this.state.messages.set(roomId, []);
    }
    this.state.messages.get(roomId).push(message);
    
    // Update UI if it's the current room
    if (this.state.currentRoom && this.state.currentRoom.id === roomId) {
      this.appendMessage(message);
      this.scrollToBottom();
    }
    
    // Update room's last message time (for sorting)
    const room = this.state.rooms.find(r => r.id === roomId);
    if (room) {
      room.lastMessageAt = message.createdAt;
      this.renderRooms(); // Re-sort rooms
    }
  }

  /**
   * UI Update Methods
   */
  updateUserUI() {
    if (this.state.user) {
      this.elements['user-display-name'].textContent = this.state.user.username;
      this.elements['user-email'].textContent = this.state.user.email;
      
      if (this.state.user.avatarUrl) {
        this.elements['user-avatar-img'].src = this.state.user.avatarUrl;
      }
    }
  }

  updateConnectionStatus(status) {
    const statusElement = this.elements['connection-status'];
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('.status-text');
    
    // Remove all status classes
    indicator.className = 'status-indicator';
    
    switch (status) {
      case 'connected':
        indicator.classList.add('connected');
        text.textContent = 'Connected';
        break;
      case 'connecting':
        indicator.classList.add('connecting');
        text.textContent = 'Connecting...';
        break;
      case 'disconnected':
      default:
        indicator.classList.add('disconnected');
        text.textContent = 'Disconnected';
        break;
    }
  }

  updateRoomUI() {
    if (this.state.currentRoom) {
      this.elements['current-room-name'].textContent = this.state.currentRoom.name;
      this.elements['current-room-description'].textContent = 
        this.state.currentRoom.description || 'No description available';
    }
  }

  renderRooms() {
    const roomsList = this.elements['rooms-list'];
    
    // Sort rooms by last message time
    const sortedRooms = [...this.state.rooms].sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt) : new Date(a.createdAt);
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt) : new Date(b.createdAt);
      return timeB - timeA;
    });
    
    roomsList.innerHTML = sortedRooms.map(room => `
      <div class="room-item ${this.state.currentRoom?.id === room.id ? 'active' : ''}" 
           data-room-id="${room.id}">
        <div class="room-icon">${room.isPrivate ? '🔒' : '#'}</div>
        <div class="room-info">
          <div class="room-name">${this.escapeHtml(room.name)}</div>
          <div class="room-description">${this.escapeHtml(room.description || '')}</div>
        </div>
        <div class="room-meta">
          ${room.messageCount ? `${room.messageCount} msgs` : ''}
        </div>
      </div>
    `).join('');
    
    // Add click listeners
    roomsList.querySelectorAll('.room-item').forEach(item => {
      this.addEventListener(item, 'click', () => {
        const roomId = parseInt(item.getAttribute('data-room-id'));
        const room = this.state.rooms.find(r => r.id === roomId);
        if (room) {
          this.selectRoom(room);
        }
      });
    });
  }

  renderMessages() {
    if (!this.state.currentRoom) return;
    
    const messages = this.state.messages.get(this.state.currentRoom.id) || [];
    const messagesList = this.elements['messages-list'];
    
    messagesList.innerHTML = messages.map(message => this.createMessageHTML(message)).join('');
    
    // Add event listeners to message actions
    this.attachMessageEventListeners();
  }

  appendMessage(message) {
    const messagesList = this.elements['messages-list'];
    const messageHTML = this.createMessageHTML(message);
    messagesList.insertAdjacentHTML('beforeend', messageHTML);
    
    // Attach event listeners to the new message
    const newMessageElement = messagesList.lastElementChild;
    this.attachMessageEventListenersToElement(newMessageElement);
  }

  createMessageHTML(message) {
    const isOwnMessage = message.user.id === this.state.user.id;
    const timestamp = this.formatTimestamp(message.createdAt);
    
    return `
      <div class="message ${isOwnMessage ? 'own' : ''}" data-message-id="${message.id}">
        ${!isOwnMessage ? `
          <div class="message-avatar">
            <img src="${message.user.avatarUrl || '/uploads/avatars/default.png'}" 
                 alt="${this.escapeHtml(message.user.username)}">
          </div>
        ` : ''}
        <div class="message-body">
          ${!isOwnMessage ? `
            <div class="message-header">
              <span class="message-username">${this.escapeHtml(message.user.username)}</span>
              <span class="message-timestamp">${timestamp}</span>
            </div>
          ` : ''}
          ${message.replyTo ? `
            <div class="message-reply">
              <strong>${this.escapeHtml(message.replyTo.username)}:</strong>
              ${this.escapeHtml(message.replyTo.content)}
            </div>
          ` : ''}
          <div class="message-content">
            ${this.escapeHtml(message.content)}
          </div>
          ${isOwnMessage ? `
            <div class="message-header" style="text-align: right; margin-top: 4px;">
              <span class="message-timestamp">${timestamp}</span>
            </div>
          ` : ''}
          <div class="message-actions">
            <button class="message-action reply-btn" data-message-id="${message.id}">
              💬 Reply
            </button>
            ${isOwnMessage ? `
              <button class="message-action edit-btn" data-message-id="${message.id}">
                ✏️ Edit
              </button>
              <button class="message-action delete-btn" data-message-id="${message.id}">
                🗑️ Delete
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  attachMessageEventListeners() {
    this.elements['messages-list'].querySelectorAll('.message').forEach(messageElement => {
      this.attachMessageEventListenersToElement(messageElement);
    });
  }

  attachMessageEventListenersToElement(messageElement) {
    // Reply button
    const replyBtn = messageElement.querySelector('.reply-btn');
    if (replyBtn) {
      this.addEventListener(replyBtn, 'click', (e) => {
        const messageId = parseInt(e.target.getAttribute('data-message-id'));
        this.startReply(messageId);
      });
    }

    // Edit button
    const editBtn = messageElement.querySelector('.edit-btn');
    if (editBtn) {
      this.addEventListener(editBtn, 'click', (e) => {
        const messageId = parseInt(e.target.getAttribute('data-message-id'));
        this.startEdit(messageId);
      });
    }

    // Delete button
    const deleteBtn = messageElement.querySelector('.delete-btn');
    if (deleteBtn) {
      this.addEventListener(deleteBtn, 'click', (e) => {
        const messageId = parseInt(e.target.getAttribute('data-message-id'));
        this.deleteMessage(messageId);
      });
    }
  }

  startReply(messageId) {
    const message = this.findMessageById(messageId);
    if (!message) return;

    this.state.replyingTo = message;
    
    // Update reply context UI
    this.elements['reply-username'].textContent = message.user.username;
    this.elements['reply-content'].textContent = message.content;
    this.elements['reply-context'].classList.remove('hidden');
    
    // Focus message input
    this.elements['message-input'].focus();
  }

  cancelReply() {
    this.state.replyingTo = null;
    this.elements['reply-context'].classList.add('hidden');
  }

  async deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await this.apiCall(`/chat/messages/${messageId}`, {
        method: 'DELETE'
      });

      // Remove from UI
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
      if (messageElement) {
        messageElement.remove();
      }

      // Remove from state
      if (this.state.currentRoom) {
        const messages = this.state.messages.get(this.state.currentRoom.id) || [];
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        this.state.messages.set(this.state.currentRoom.id, updatedMessages);
      }

      this.showSuccess('Message deleted');
    } catch (error) {
      console.error('Failed to delete message:', error);
      this.showError('Failed to delete message');
    }
  }

  renderOnlineUsers(users) {
    const onlineUsersList = this.elements['online-users-list'];
    
    onlineUsersList.innerHTML = users.map(user => `
      <div class="online-user">
        ${this.escapeHtml(user.username)}
      </div>
    `).join('');
  }

  /**
   * Event Handlers
   */
  handleAuthTabSwitch(e) {
    const targetTab = e.target.getAttribute('data-tab');
    this.switchAuthTab(targetTab);
  }

  switchAuthTab(tab) {
    // Update tab active state
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Show/hide forms
    this.elements['login-form'].classList.toggle('hidden', tab !== 'login');
    this.elements['register-form'].classList.toggle('hidden', tab !== 'register');
    
    // Clear any error messages
    this.hideAuthError();
  }

  handleMessageInput(e) {
    this.updateCharCounter();
    this.autoResizeTextarea();
    
    // Send typing indicator
    if (this.state.currentRoom && e.target.value.trim()) {
      this.sendWebSocketMessage('typing_start', { roomId: this.state.currentRoom.id });
    } else if (this.state.currentRoom) {
      this.sendWebSocketMessage('typing_stop', { roomId: this.state.currentRoom.id });
    }
  }

  handleMessageKeydown(e) {
    // Send message on Enter (but not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  handleUserTyping(data) {
    const { roomId, user, isTyping } = data;
    
    if (this.state.currentRoom && this.state.currentRoom.id === roomId) {
      if (isTyping) {
        this.state.typingUsers.set(user.id, user);
      } else {
        this.state.typingUsers.delete(user.id);
      }
      
      this.updateTypingIndicators();
    }
  }

  handleUserStatusChange(data) {
    const { user, isOnline } = data;
    
    if (isOnline) {
      this.state.onlineUsers.add(user.id);
    } else {
      this.state.onlineUsers.delete(user.id);
    }
    
    // Update online users list if in current room
    if (this.state.currentRoom) {
      this.loadRoomMembers(this.state.currentRoom.id);
    }
  }

  handleUserJoinedRoom(data) {
    console.log('User joined room:', data);
    // Could show a notification or update member list
  }

  handleUserLeftRoom(data) {
    console.log('User left room:', data);
    // Could show a notification or update member list
  }

  toggleUserMenu() {
    this.elements['user-dropdown'].classList.toggle('hidden');
  }

  hideUserMenu() {
    this.elements['user-dropdown'].classList.add('hidden');
  }

  handleDocumentClick(e) {
    // Close user menu if clicking outside
    if (!this.elements['user-menu-btn'].contains(e.target) && 
        !this.elements['user-dropdown'].contains(e.target)) {
      this.hideUserMenu();
    }
  }

  handleBeforeUnload() {
    // Send typing stop for all rooms
    if (this.state.currentRoom) {
      this.sendWebSocketMessage('typing_stop', { roomId: this.state.currentRoom.id });
    }
  }

  handleOnline() {
    this.showSuccess('Connection restored');
    // Attempt to reconnect WebSocket if needed
    if (this.state.user && (!this.ws || this.ws.readyState !== WebSocket.OPEN)) {
      const token = this.getAuthToken();
      if (token) {
        this.connectWebSocket(token);
      }
    }
  }

  handleOffline() {
    this.showError('Connection lost - you are now offline');
    this.updateConnectionStatus('disconnected');
  }

  async showRoomMembers() {
    if (!this.state.currentRoom) return;

    try {
      const response = await this.apiCall(`/chat/rooms/${this.state.currentRoom.id}/members`);
      
      const membersList = this.elements['room-members-list'];
      membersList.innerHTML = response.members.map(member => `
        <div class="member-item">
          <div class="member-avatar">
            <img src="${member.avatarUrl || '/uploads/avatars/default.png'}" 
                 alt="${this.escapeHtml(member.username)}">
          </div>
          <div class="member-info">
            <div class="member-name">${this.escapeHtml(member.username)}</div>
            <div class="member-status">
              <span class="status-indicator ${member.isOnline ? 'connected' : 'disconnected'}"></span>
              ${member.isOnline ? 'Online' : 'Offline'}
              ${member.role === 'admin' ? ' • Admin' : ''}
            </div>
          </div>
        </div>
      `).join('');
      
      this.showModal('room-members-modal');
    } catch (error) {
      console.error('Failed to load room members:', error);
      this.showError('Failed to load room members');
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button text
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  /**
   * Utility Methods
   */
  updateCharCounter() {
    const input = this.elements['message-input'];
    const counter = this.elements['char-counter'];
    const length = input.value.length;
    
    counter.textContent = length;
    
    // Change color when approaching limit
    if (length > 1800) {
      counter.style.color = 'var(--error-color)';
    } else if (length > 1500) {
      counter.style.color = 'var(--warning-color)';
    } else {
      counter.style.color = 'var(--text-muted)';
    }
  }

  autoResizeTextarea() {
    const textarea = this.elements['message-input'];
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  updateTypingIndicators() {
    const indicators = this.elements['typing-indicators'];
    
    if (this.state.typingUsers.size === 0) {
      indicators.innerHTML = '';
      return;
    }
    
    const usernames = Array.from(this.state.typingUsers.values()).map(user => user.username);
    let text = '';
    
    if (usernames.length === 1) {
      text = `${usernames[0]} is typing`;
    } else if (usernames.length === 2) {
      text = `${usernames[0]} and ${usernames[1]} are typing`;
    } else {
      text = `${usernames.length} people are typing`;
    }
    
    indicators.innerHTML = `
      <div class="typing-indicator">
        <span>${text}</span>
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
  }

  scrollToBottom() {
    const container = this.elements['messages-container'];
    container.scrollTop = container.scrollHeight;
  }

  clearMessages() {
    this.elements['messages-list'].innerHTML = '';
  }

  clearRooms() {
    this.elements['rooms-list'].innerHTML = '';
  }

  showWelcomeMessage() {
    this.elements['welcome-message'].classList.remove('hidden');
    this.elements['messages-list'].classList.add('hidden');
  }

  hideWelcomeMessage() {
    this.elements['welcome-message'].classList.add('hidden');
  }

  showMessagesList() {
    this.elements['messages-list'].classList.remove('hidden');
  }

  findMessageById(messageId) {
    if (!this.state.currentRoom) return null;
    
    const messages = this.state.messages.get(this.state.currentRoom.id) || [];
    return messages.find(msg => msg.id === messageId);
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * API and Authentication Helpers
   */
  async apiCall(endpoint, options = {}) {
    const url = this.apiBase + endpoint;
    const token = this.getAuthToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  getAuthToken() {
    return localStorage.getItem('chatToken');
  }

  setAuthToken(token) {
    localStorage.setItem('chatToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('chatToken');
  }

  /**
   * UI State Management
   */
  hideLoadingScreen() {
    this.elements['loading-screen'].classList.add('hidden');
    this.elements.app.classList.remove('hidden');
  }

  showAuthModal() {
    this.elements['auth-modal'].classList.remove('hidden');
  }

  hideAuthModal() {
    this.elements['auth-modal'].classList.add('hidden');
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  showAuthError(message) {
    this.elements['auth-error-message'].textContent = message;
    this.elements['auth-error'].classList.remove('hidden');
  }

  hideAuthError() {
    this.elements['auth-error'].classList.add('hidden');
  }

  showError(message) {
    this.showToast('error', message);
  }

  showSuccess(message) {
    this.showToast('success', message);
  }

  showToast(type, message) {
    const toastId = `${type}-toast`;
    const toast = document.getElementById(toastId);
    const messageElement = document.getElementById(`${type}-toast-message`);
    
    if (toast && messageElement) {
      messageElement.textContent = message;
      toast.classList.remove('hidden');
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.hideToast(toastId);
      }, 5000);
    }
  }

  hideToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.classList.add('hidden');
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    // Close WebSocket
    if (this.ws) {
      this.ws.close();
    }
    
    // Remove all event listeners
    this.removeAllEventListeners();
    
    // Clear timers and intervals
    // (Add any cleanup for timers/intervals here)
    
    console.log('Chat application destroyed');
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  // Create global app instance
  window.chatApp = new ChatApplication();
});

// Global functions for toast management
window.hideToast = function(toastId) {
  if (window.chatApp) {
    window.chatApp.hideToast(toastId);
  }
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.chatApp) {
    window.chatApp.destroy();
  }
});