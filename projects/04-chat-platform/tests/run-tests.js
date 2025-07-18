/**
 * Simple Test Runner for Chat Platform
 * 
 * This test runner provides a lightweight testing framework for the chat platform
 * without requiring external dependencies like Jest or Mocha. It demonstrates
 * how to build testing infrastructure and organize test suites.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      failures: []
    };
    this.currentSuite = null;
    this.server = null;
    this.baseUrl = 'http://localhost:3001'; // Different port for testing
  }

  /**
   * Test organization methods
   */
  describe(suiteName, suiteFunction) {
    console.log(`\n📁 ${suiteName}`);
    this.currentSuite = suiteName;
    suiteFunction();
    this.currentSuite = null;
  }

  it(testName, testFunction) {
    const fullName = this.currentSuite ? `${this.currentSuite} - ${testName}` : testName;
    this.tests.push({
      name: fullName,
      function: testFunction
    });
  }

  /**
   * Assertion methods
   */
  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        }
      },
      
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected ${actual} to be truthy`);
        }
      },
      
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected ${actual} to be falsy`);
        }
      },
      
      toContain: (expected) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      
      toBeGreaterThan: (expected) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      
      toHaveProperty: (property) => {
        if (!(property in actual)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to have property ${property}`);
        }
      }
    };
  }

  /**
   * HTTP request helper
   */
  async request(options) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        hostname: 'localhost',
        port: 3001,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const requestOptions = { ...defaultOptions, ...options };
      
      const req = http.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = data ? JSON.parse(data) : {};
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: jsonData
            });
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (requestOptions.body) {
        req.write(JSON.stringify(requestOptions.body));
      }

      req.end();
    });
  }

  /**
   * WebSocket helper
   */
  async connectWebSocket(token) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket('ws://localhost:3001/ws');
      
      ws.on('open', () => {
        if (token) {
          ws.send(JSON.stringify({
            type: 'auth',
            payload: { token }
          }));
        }
        resolve(ws);
      });
      
      ws.on('error', reject);
    });
  }

  /**
   * Database helper
   */
  async setupTestDatabase() {
    // For testing, we'll use the same database but with a different name
    // In a real project, you'd use a separate test database
    const { initializeDatabase } = require('../database/init');
    await initializeDatabase();
    console.log('✅ Test database initialized');
  }

  /**
   * Test execution
   */
  async runTests() {
    console.log('🚀 Starting Chat Platform Tests\n');
    
    try {
      // Setup test environment
      await this.setupTestDatabase();
      
      // Load test files
      this.loadTestFiles();
      
      // Run all tests
      for (const test of this.tests) {
        await this.runSingleTest(test);
      }
      
      // Print results
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test setup failed:', error.message);
      process.exit(1);
    }
  }

  async runSingleTest(test) {
    try {
      await test.function();
      this.results.passed++;
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      this.results.failed++;
      this.results.failures.push({
        name: test.name,
        error: error.message
      });
      console.log(`  ❌ ${test.name}`);
      console.log(`     ${error.message}`);
    }
    this.results.total++;
  }

  loadTestFiles() {
    // Load authentication tests
    this.loadAuthTests();
    
    // Load chat tests
    this.loadChatTests();
    
    // Load WebSocket tests
    this.loadWebSocketTests();
  }

  loadAuthTests() {
    this.describe('Authentication API', () => {
      this.it('should register a new user', async () => {
        const response = await this.request({
          path: '/api/auth/register',
          method: 'POST',
          body: {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpass123'
          }
        });

        this.expect(response.status).toBe(201);
        this.expect(response.data).toHaveProperty('token');
        this.expect(response.data.user.username).toBe('testuser');
      });

      this.it('should login with valid credentials', async () => {
        const response = await this.request({
          path: '/api/auth/login',
          method: 'POST',
          body: {
            username: 'testuser',
            password: 'testpass123'
          }
        });

        this.expect(response.status).toBe(200);
        this.expect(response.data).toHaveProperty('token');
        this.expect(response.data.message).toBe('Login successful');
      });

      this.it('should reject invalid credentials', async () => {
        const response = await this.request({
          path: '/api/auth/login',
          method: 'POST',
          body: {
            username: 'testuser',
            password: 'wrongpassword'
          }
        });

        this.expect(response.status).toBe(401);
        this.expect(response.data.error).toBe('Invalid credentials');
      });

      this.it('should protect routes without authentication', async () => {
        const response = await this.request({
          path: '/api/auth/me',
          method: 'GET'
        });

        this.expect(response.status).toBe(401);
        this.expect(response.data.error).toBe('Access token required');
      });

      this.it('should return user info with valid token', async () => {
        // First login to get token
        const loginResponse = await this.request({
          path: '/api/auth/login',
          method: 'POST',
          body: {
            username: 'testuser',
            password: 'testpass123'
          }
        });

        const token = loginResponse.data.token;

        // Then use token to get user info
        const response = await this.request({
          path: '/api/auth/me',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.expect(response.status).toBe(200);
        this.expect(response.data.user.username).toBe('testuser');
      });
    });
  }

  loadChatTests() {
    this.describe('Chat API', () => {
      let authToken;

      // Helper to get auth token
      const getAuthToken = async () => {
        if (!authToken) {
          const response = await this.request({
            path: '/api/auth/login',
            method: 'POST',
            body: {
              username: 'testuser',
              password: 'testpass123'
            }
          });
          authToken = response.data.token;
        }
        return authToken;
      };

      this.it('should get user rooms', async () => {
        const token = await getAuthToken();
        
        const response = await this.request({
          path: '/api/chat/rooms',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.expect(response.status).toBe(200);
        this.expect(response.data).toHaveProperty('rooms');
        this.expect(Array.isArray(response.data.rooms)).toBeTruthy();
      });

      this.it('should send a message to a room', async () => {
        const token = await getAuthToken();
        
        // First get rooms to find a room ID
        const roomsResponse = await this.request({
          path: '/api/chat/rooms',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const rooms = roomsResponse.data.rooms;
        if (rooms.length === 0) {
          throw new Error('No rooms available for testing');
        }

        const roomId = rooms[0].id;

        // Send message
        const response = await this.request({
          path: `/api/chat/rooms/${roomId}/messages`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: {
            content: 'Test message from automated test',
            messageType: 'text'
          }
        });

        this.expect(response.status).toBe(201);
        this.expect(response.data.message).toBe('Message sent successfully');
        this.expect(response.data.data.content).toBe('Test message from automated test');
      });

      this.it('should get messages from a room', async () => {
        const token = await getAuthToken();
        
        // Get rooms
        const roomsResponse = await this.request({
          path: '/api/chat/rooms',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const roomId = roomsResponse.data.rooms[0].id;

        // Get messages
        const response = await this.request({
          path: `/api/chat/rooms/${roomId}/messages`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.expect(response.status).toBe(200);
        this.expect(response.data).toHaveProperty('messages');
        this.expect(response.data).toHaveProperty('pagination');
        this.expect(Array.isArray(response.data.messages)).toBeTruthy();
      });

      this.it('should require authentication for protected endpoints', async () => {
        const response = await this.request({
          path: '/api/chat/rooms',
          method: 'GET'
        });

        this.expect(response.status).toBe(401);
      });
    });
  }

  loadWebSocketTests() {
    this.describe('WebSocket Connection', () => {
      this.it('should establish WebSocket connection', async () => {
        try {
          const ws = await this.connectWebSocket();
          this.expect(ws.readyState).toBe(WebSocket.OPEN);
          ws.close();
        } catch (error) {
          throw new Error(`WebSocket connection failed: ${error.message}`);
        }
      });

      this.it('should authenticate via WebSocket', async () => {
        // First get auth token
        const loginResponse = await this.request({
          path: '/api/auth/login',
          method: 'POST',
          body: {
            username: 'testuser',
            password: 'testpass123'
          }
        });

        const token = loginResponse.data.token;

        return new Promise(async (resolve, reject) => {
          try {
            const ws = await this.connectWebSocket();
            
            ws.on('message', (data) => {
              const message = JSON.parse(data.toString());
              
              if (message.type === 'auth_success') {
                this.expect(message.payload).toHaveProperty('user');
                ws.close();
                resolve();
              } else if (message.type === 'error') {
                ws.close();
                reject(new Error(`Auth failed: ${message.payload.error}`));
              }
            });

            // Send auth message
            ws.send(JSON.stringify({
              type: 'auth',
              payload: { token }
            }));

          } catch (error) {
            reject(error);
          }
        });
      });

      this.it('should reject invalid WebSocket authentication', async () => {
        return new Promise(async (resolve, reject) => {
          try {
            const ws = await this.connectWebSocket();
            
            ws.on('message', (data) => {
              const message = JSON.parse(data.toString());
              
              if (message.type === 'error') {
                this.expect(message.payload.error).toContain('Authentication failed');
                ws.close();
                resolve();
              }
            });

            ws.on('close', () => {
              resolve(); // Connection should close on auth failure
            });

            // Send invalid auth
            ws.send(JSON.stringify({
              type: 'auth',
              payload: { token: 'invalid-token' }
            }));

          } catch (error) {
            reject(error);
          }
        });
      });
    });
  }

  printResults() {
    console.log('\n📊 Test Results');
    console.log('================');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    
    if (this.results.failures.length > 0) {
      console.log('\n💥 Failures:');
      this.results.failures.forEach(failure => {
        console.log(`   ${failure.name}: ${failure.error}`);
      });
    }

    const successRate = (this.results.passed / this.results.total) * 100;
    console.log(`\n📈 Success Rate: ${successRate.toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Some tests failed. Please review the errors above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
    }
  }
}

// Utility functions for test database setup
async function waitForServer(port, timeout = 10000) {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: port,
          path: '/api/health',
          method: 'GET'
        }, (res) => {
          resolve();
        });
        
        req.on('error', reject);
        req.end();
      });
      
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return false;
}

// Main execution
async function main() {
  console.log('🔧 Setting up test environment...');
  
  // Check if server is running on test port
  const serverRunning = await waitForServer(3001, 2000);
  
  if (!serverRunning) {
    console.log('⚠️  Test server not running on port 3001');
    console.log('Please start the server with: PORT=3001 npm run dev');
    console.log('Or modify the test runner to use port 3000');
    process.exit(1);
  }

  const runner = new TestRunner();
  await runner.runTests();
}

// Export for use in other test files
module.exports = { TestRunner };

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}