<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/Vanilla-JS-Logo.png" alt="JavaScript Learning Monorepo" width="200" />
</p>

<p align="center">
  <a href="https://github.com/dunamismax/javascript-examples">
    <img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&size=24&pause=1000&color=F7DF1E&center=true&vCenter=true&width=1000&lines=JavaScript+Learning+Monorepo;26+Progressive+Fundamentals+Scripts;4+Real-World+Projects+Collection;From+Beginner+to+Full-Stack+Developer;Vanilla+JS+%2B+Express.js+%2B+SQLite;Complete+Learning+Path+%2B+Hands-On+Practice;Modern+JavaScript+ES6%2B+Features;DOM+Manipulation+%2B+API+Integration;Database+Integration+%2B+Authentication;WebSockets+%2B+Real-Time+Communication;Progressive+Difficulty+Levels;Interactive+Code+Examples;Comprehensive+Project+Portfolio;MIT+Licensed+Educational+Resource" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <a href="#javascript-fundamentals---26-progressive-scripts"><img src="https://img.shields.io/badge/Fundamentals-26_Scripts-FF6B35.svg" alt="Fundamentals"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18+-339933.svg?logo=node.js" alt="Node.js Version"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-4.18+-000000.svg?logo=express" alt="Express Version"></a>
  <a href="https://www.sqlite.org/"><img src="https://img.shields.io/badge/SQLite-3.36+-003B57.svg?logo=sqlite" alt="SQLite Version"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/Vanilla_JS-ES2020+-F7DF1E.svg?logo=javascript" alt="Vanilla JavaScript"></a>
  <a href="https://esbuild.github.io/"><img src="https://img.shields.io/badge/Build_Tool-esbuild-FFCF00.svg?logo=esbuild" alt="esbuild"></a>
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/Code_Quality-ESLint-4B32C3.svg?logo=eslint" alt="ESLint"></a>
  <a href="https://prettier.io/"><img src="https://img.shields.io/badge/Code_Format-Prettier-F7B93E.svg?logo=prettier" alt="Prettier"></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Testing-Vitest-6E9F18.svg?logo=vitest" alt="Vitest"></a>
  <a href="https://socket.io/"><img src="https://img.shields.io/badge/Real_Time-Socket.IO-010101.svg?logo=socket.io" alt="Socket.IO"></a>
  <a href="https://www.npmjs.com/"><img src="https://img.shields.io/badge/Package_Manager-npm-CB3837.svg?logo=npm" alt="npm"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"></a>
</p>

---

# JavaScript Learning Monorepo

A comprehensive learning path from JavaScript fundamentals to full-stack development using Vanilla JS, Express.js, and SQLite. Features 26 progressive scripts and 4 real-world projects designed to take you from beginner to full-stack developer.

## Features

- **Progressive Learning Path** - 26 carefully structured scripts from basics to advanced concepts
- **Real-World Projects** - 4 complete applications with increasing complexity
- **Modern JavaScript** - ES6+ features, async/await, modern web APIs
- **Full-Stack Development** - Frontend, backend, database, and real-time communication
- **Hands-On Practice** - Interactive examples and practical exercises
- **Complete Toolchain** - Modern development tools and best practices
- **Project Portfolio** - Build deployable applications for your resume
- **Educational Resource** - Comprehensive documentation and learning guides

## Project Structure

```sh
├── fundamentals/
│   ├── 01-10-basics/          # Core JavaScript concepts
│   ├── 11-20-intermediate/    # Modern JS features and DOM
│   └── 21-26-advanced/        # Expert topics and optimization
├── projects/
│   ├── 01-todo-app/           # DOM manipulation and localStorage
│   ├── 02-weather-dashboard/  # API integration and geolocation
│   ├── 03-blog-platform/      # Full-stack CRUD with database
│   └── 04-chat-platform/      # Real-time WebSocket communication
├── shared/                    # Common utilities and configurations
└── Configuration files        # ESLint, Prettier, build tools
```

---

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/JavaScript-logo.png" alt="JavaScript" width="100" />
</p>

## Quick Start

**Prerequisites:** [Node.js 18+](https://nodejs.org/) and [npm](https://npmjs.com/)

### Get Learning in 3 Steps

```bash
# 1. Clone and install
git clone https://github.com/dunamismax/javascript-examples.git
cd javascript-examples && npm install

# 2. Start with fundamentals (Recommended)
cd fundamentals
node 01-hello-world.js

# 3. Or jump into projects
npm run build && npm run dev
```

**Access:** Individual projects run on ports 8000-8001 (frontend) and 3000 (full-stack)

## JavaScript Fundamentals - 26 Progressive Scripts

The fundamentals directory contains a carefully crafted learning path that builds JavaScript knowledge incrementally, from basic syntax to advanced concepts.

### Learning Progression

- **Structured Curriculum** - Each script builds upon previous knowledge
- **Practical Examples** - Real-world scenarios and use cases
- **Interactive Learning** - Run and modify code to see results
- **Progressive Difficulty** - Gradual increase in complexity
- **Modern Standards** - ES6+ features and best practices
- **Documentation** - Comprehensive comments and explanations

### Curriculum Breakdown

| Phase                | Scripts    | Focus Areas                           | Skills Developed                      |
| -------------------- | ---------- | ------------------------------------- | ------------------------------------- |
| Basics (01-10)       | 10 scripts | Core syntax, data types, control flow | Variables, functions, arrays, objects |
| Intermediate (11-20) | 10 scripts | DOM, events, async programming        | Web APIs, fetch, promises, ES6+       |
| Advanced (21-26)     | 6 scripts  | OOP, patterns, optimization           | Classes, regex, performance, security |

## Tech Stack

**Frontend:** Vanilla JavaScript ES6+, Modern CSS, HTML5 APIs
**Backend:** Express.js server, RESTful APIs, middleware
**Database:** SQLite with better-sqlite3 driver for data persistence
**Build Tools:** esbuild for fast bundling and hot reload development
**Real-Time:** Socket.IO for WebSocket communication and live updates
**Development:** ESLint, Prettier, Vitest testing, comprehensive tooling

## Architecture

**Monorepo Structure:** npm workspaces with shared utilities and independent projects

- **`fundamentals/`** - 26 progressive learning scripts with comprehensive examples
- **`projects/01-todo-app`** - DOM manipulation, event handling, localStorage persistence
- **`projects/02-weather-dashboard`** - API integration, geolocation, async programming
- **`projects/03-blog-platform`** - Full-stack CRUD, SQLite database, Express.js backend
- **`projects/04-chat-platform`** - WebSockets, authentication, real-time communication
- **`shared/`** - Common utilities, configurations, and reusable components

## Development Scripts

```bash
# Learning Path
cd fundamentals
node 01-hello-world.js    # Start the progressive learning journey
node 15-dom-manipulation.js  # Jump to specific topics
node 26-performance.js    # Advanced concepts

# Individual Projects
cd projects/01-todo-app && npm run dev        # http://localhost:8000
cd projects/02-weather-dashboard && npm run dev  # http://localhost:8001
cd projects/03-blog-platform && npm run dev  # http://localhost:3000
cd projects/04-chat-platform && npm run dev  # http://localhost:3000

# Development
npm run dev               # Start all projects in development mode
npm run build             # Build all projects for production
npm run clean             # Clean all built assets

# Database Management
npm run init-db           # Initialize SQLite databases
npm run seed-db           # Seed with sample data
npm run reset-db          # Reset and reseed databases

# Code Quality
npm run lint              # Lint all JavaScript files with ESLint
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting

# Testing
npm test                  # Run unit tests with Vitest
npm run test:coverage     # Generate test coverage reports
```

---

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/js-evolution-wallpaper.jpg" alt="JavaScript Evolution" width="450" />
</p>

## Key Features

**Progressive Learning:** 26 structured scripts building from basics to expert level, comprehensive documentation, interactive examples

**Modern Development:** ES6+ JavaScript features, async/await patterns, modern web APIs, performance optimization techniques

**Full-Stack Skills:** Frontend DOM manipulation, backend Express.js development, SQLite database integration, real-time communication

**Project Portfolio:** Four complete applications demonstrating different skill levels and technologies for professional development

## Learning Path

**Phase 1: JavaScript Fundamentals (Weeks 1-2)**

- **Basics (Scripts 01-10):** Variables, data types, operators, conditionals, loops, functions, arrays, objects, strings, error handling
- **Intermediate (Scripts 11-20):** Scope, closures, prototypes, DOM manipulation, events, async programming, fetch API, localStorage, ES6+ features
- **Advanced (Scripts 21-26):** Classes, OOP principles, regular expressions, JSON handling, dates, browser APIs, performance optimization

**Phase 2: Real-World Projects (Weeks 3-6)**

- **Todo App (Beginner):** DOM manipulation, event handling, localStorage persistence, responsive design
- **Weather Dashboard (Intermediate):** API integration, async/await, geolocation, error handling, dynamic UI updates
- **Blog Platform (Advanced):** Full-stack development, Express.js server, SQLite database, CRUD operations, routing
- **Chat Platform (Expert):** WebSocket communication, user authentication, real-time messaging, session management

**Phase 3: Advanced Concepts (Weeks 7-8)**

- Performance optimization and memory management
- Security best practices and input validation
- Testing strategies and debugging techniques
- Design patterns and architectural principles

## Environment Setup

**Development Environment:**

```bash
NODE_ENV=development
PORT=3000
```

**Database Configuration:**

```bash
DB_PATH=./database/app.db
DB_SEED=true
```

**Project-Specific Settings:**

Each project includes `.env.example` files with required configuration. Copy and customize these files for your development environment.

## Production Deployment

**Quick Deploy:**

```bash
npm run build    # Build all projects for production
npm run start    # Start production servers
```

**Self-Hosting:** All projects are designed for easy deployment to static hosting providers or Node.js hosting platforms. Database projects include production-ready configurations.

## Projects Overview

**1. Todo App (Beginner Level):**

- DOM manipulation and event handling fundamentals
- localStorage for data persistence without backend
- Responsive design with modern CSS
- Add, edit, delete, and filter functionality
- Local storage state management

**2. Weather Dashboard (Intermediate Level):**

- OpenWeatherMap API integration with async/await
- Geolocation API for user location detection
- Dynamic UI updates based on weather data
- Error handling for network requests
- Responsive design for mobile devices

**3. Blog Platform (Advanced Level):**

- Full-stack Express.js application with routing
- SQLite database with better-sqlite3 integration
- Complete CRUD operations for blog posts
- User authentication and session management
- RESTful API design patterns

**4. Chat Platform (Expert Level):**

- Real-time WebSocket communication with Socket.IO
- User authentication and session persistence
- Private messaging and group chat features
- Message history with database storage
- Advanced security and input validation

## Contributing

1. Fork and create feature branch
2. Make changes following existing learning patterns and documentation standards
3. Run `npm run lint && npm run format && npm run build && npm test`
4. Test changes across all projects and learning materials
5. Submit pull request with clear description and educational value

**Educational Standards:** Maintains clear progression, comprehensive comments, and practical examples suitable for learners

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <a href="https://www.buymeacoffee.com/dunamismax">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"></a>
  <a href="https://bsky.app/profile/dunamismax.bsky.social" target="_blank"><img src="https://img.shields.io/badge/Bluesky-blue?style=for-the-badge&logo=bluesky&logoColor=white" alt="Bluesky"></a>
  <a href="https://reddit.com/user/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Reddit-%23FF4500.svg?&style=for-the-badge&logo=reddit&logoColor=white" alt="Reddit"></a>
  <a href="https://discord.com/users/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Discord-dunamismax-7289DA.svg?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://signal.me/#p/+dunamismax.66" target="_blank"><img src="https://img.shields.io/badge/Signal-dunamismax.66-3A76F0.svg?style=for-the-badge&logo=signal&logoColor=white" alt="Signal"></a>
</p>

---

<p align="center">
  <strong>JavaScript Learning Monorepo</strong><br>
  <sub>Vanilla JS • Express.js • SQLite • WebSockets • Complete Full-Stack Education</sub>
</p>

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/js-coffee-particles.jpg" alt="JavaScript Coffee" width="450" />
</p>
