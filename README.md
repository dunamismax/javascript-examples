<p align="center">
  <img src="/images/js-learning.png" alt="js-examples Logo" width="400" />
</p>

<p align="center">
  <a href="https://github.com/dunamismax/js-examples">
    <img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&size=24&pause=1000&color=F7DF1E&center=true&vCenter=true&width=800&lines=JavaScript+Learning+Monorepo;Vanilla+JS+%2B+Express.js+%2B+SQLite;Progressive+Learning+Path;Todo+App+%2B+Weather+Dashboard+%2B+Blog+Platform;From+Beginner+to+Full-Stack+Developer" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-16+-339933.svg?logo=node.js" alt="Node.js Version"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-4.18+-000000.svg?logo=express" alt="Express Version"></a>
  <a href="https://www.sqlite.org/"><img src="https://img.shields.io/badge/SQLite-3.36+-003B57.svg?logo=sqlite" alt="SQLite Version"></a>
  <a href="https://esbuild.github.io/"><img src="https://img.shields.io/badge/esbuild-0.19+-FFCF00.svg?logo=esbuild" alt="esbuild Version"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg?logo=javascript" alt="JavaScript ES6+"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License"></a>
</p>

---

## About This Learning Repository

This monorepo showcases a comprehensive JavaScript learning path - engineered to take you from basic DOM manipulation to full-stack web development. It leverages pure, foundational web technologies to provide maximum learning value and a deep understanding of core mechanics without framework abstractions.

### Core Philosophy

- **Pure JavaScript Stack**: Vanilla JS, Node.js, Express.js, SQLite for maximum learning
- **Progressive Complexity**: Three projects that build upon each other systematically
- **Real-World Applications**: Practical projects you can actually use and deploy
- **Monorepo Architecture**: Professional development patterns and workspace management
- **Production-Ready Code**: Best practices, security, and performance optimization
- **Comprehensive Documentation**: Every concept explained with detailed code comments

## Tech Stack

| Layer                 | Technology                                                                        | Purpose                                     |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------------- |
| **Frontend Logic**    | [Vanilla JavaScript](http://vanilla-js.com/)                                     | Pure DOM manipulation and browser APIs      |
| **Build System**      | [esbuild](https://esbuild.github.io/)                                            | Lightning-fast bundling and optimization    |
| **Backend Framework** | [Express.js](https://expressjs.com/)                                             | Minimalist web framework for Node.js        |
| **Database**          | [SQLite](https://www.sqlite.org/)                                                | Self-contained, serverless SQL database     |
| **Database Driver**   | [sqlite3](https://github.com/TryGhost/node-sqlite3)                              | Direct communication with SQLite            |
| **Styling**           | Vanilla CSS                                                                       | Modern CSS with Flexbox and Grid           |
| **Package Manager**   | [npm](https://www.npmjs.com/)                                                    | Standard Node.js package management         |

## Quick Start

### Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)
- Basic understanding of HTML, CSS, and JavaScript

### Installation

1. Clone and initialize:

   ```bash
   git clone https://github.com/dunamismax/js-examples.git
   cd js-examples
   npm install
   ```

2. Build all projects:

   ```bash
   npm run build
   ```

3. Start development:

   ```bash
   npm run dev
   # All projects available with hot reload
   ```

## Learning Projects Portfolio

### Project 1: Todo App (Beginner Level)

**🎯 Learning Focus:** DOM Manipulation, Event Handling, Local Storage

A feature-complete todo application that teaches fundamental JavaScript concepts.

**What You'll Learn:**
- Creating, modifying, and removing DOM elements
- Event handling and delegation patterns
- Browser localStorage for data persistence
- Array methods (filter, map, find, reduce)
- State management in vanilla JavaScript
- Input validation and user experience

**Key Features:**
- ✅ Add, edit, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Filter todos (All, Active, Completed)
- ✅ Persistent storage across browser sessions
- ✅ Character counting and validation
- ✅ Keyboard shortcuts and accessibility

**Run the Project:**
```bash
cd projects/01-todo-app
npm run dev
# Open http://localhost:8000
```

### Project 2: Weather Dashboard (Intermediate Level)

**🎯 Learning Focus:** API Integration, Async Programming, Browser APIs

A comprehensive weather application demonstrating modern JavaScript async patterns.

**What You'll Learn:**
- Making HTTP requests with fetch()
- Async/await for handling asynchronous operations
- Geolocation API for location services
- Error handling and user feedback patterns
- Date/time manipulation and formatting
- Dynamic content creation and updates
- State management for loading/error states

**Key Features:**
- ✅ Real-time weather data from OpenWeatherMap API
- ✅ 5-day weather forecast with daily summaries
- ✅ Geolocation-based weather lookup
- ✅ City search with input validation
- ✅ Temperature unit conversion (°C/°F)
- ✅ Recent searches with localStorage persistence
- ✅ Comprehensive error handling and retry mechanisms
- ✅ Responsive design with glassmorphism UI

**Run the Project:**
```bash
cd projects/02-weather-dashboard
npm run dev
# Open http://localhost:8001
```

### Project 3: Blog Platform (Advanced Level)

**🎯 Learning Focus:** Full-Stack Development, Database Integration, Server-Side Programming

A complete blogging platform demonstrating full-stack JavaScript development.

**What You'll Learn:**
- Setting up Express.js server with middleware
- RESTful API design and implementation
- Database integration with SQLite
- SQL queries and database relationships
- Request/response handling and validation
- Frontend-backend communication patterns
- Form handling and real-time validation
- Security considerations and best practices

**Key Features:**
- ✅ Complete blog with posts and comments
- ✅ RESTful API with proper HTTP methods
- ✅ SQLite database with relational design
- ✅ Real-time character counting and validation
- ✅ Live preview while writing posts
- ✅ Auto-save drafts in localStorage
- ✅ SEO-friendly URL slugs
- ✅ Database seeding with sample content

**Run the Project:**
```bash
cd projects/03-blog-platform
npm run init-db  # Initialize database
npm run seed-db  # Add sample data
npm run dev      # Start server
# Open http://localhost:3000
```

## Development Commands

### Essential Commands

```bash
npm install        # Install all dependencies
npm run dev        # Start all projects in development mode
npm run build      # Build all projects for production
npm run clean      # Clean build artifacts and databases
```

### Individual Projects

```bash
cd projects/01-todo-app && npm run dev         # Run Todo App only
cd projects/02-weather-dashboard && npm run dev # Run Weather Dashboard only
cd projects/03-blog-platform && npm run dev    # Run Blog Platform only
```

### Blog Platform Database Commands

```bash
cd projects/03-blog-platform
npm run init-db    # Create database and tables
npm run seed-db    # Add sample blog posts and comments
npm run clean      # Remove database and build files
```

## Project Architecture

### Learning Applications (`projects/`)

**01-todo-app**
- Vanilla JavaScript with localStorage persistence
- Modern CSS with responsive design
- Event delegation and state management patterns
- Input validation and user experience focus

**02-weather-dashboard**
- API integration with error handling
- Async/await patterns and Promise management
- Browser APIs (Geolocation, localStorage)
- Real-time data updates and caching

**03-blog-platform**
- Full-stack Express.js application
- SQLite database with proper schema design
- RESTful API with CRUD operations
- Frontend-backend integration patterns

### Shared Configurations

**Root Level**
- Workspace configuration for monorepo management
- Shared dependencies and build tools
- ESLint and development tooling
- Documentation and learning resources

## Learning Path Progression

### Phase 1: Frontend Fundamentals (Todo App)
1. **DOM Manipulation** - Creating and modifying elements
2. **Event Handling** - User interactions and delegation
3. **Local Storage** - Browser data persistence
4. **Array Methods** - Functional programming patterns
5. **State Management** - Application state in vanilla JS

### Phase 2: API Integration (Weather Dashboard)
6. **Fetch API** - Making HTTP requests
7. **Async/Await** - Modern asynchronous programming
8. **Error Handling** - Graceful failure management
9. **Browser APIs** - Geolocation and other native features
10. **Real-time Updates** - Dynamic content and state

### Phase 3: Full-Stack Development (Blog Platform)
11. **Server Setup** - Express.js configuration and middleware
12. **Database Design** - SQL schema and relationships
13. **RESTful APIs** - HTTP methods and status codes
14. **CRUD Operations** - Create, Read, Update, Delete
15. **Security** - Input validation and sanitization
16. **Production Deployment** - Build optimization and deployment

## API Documentation

### Weather Dashboard API Integration

```javascript
// Fetch weather data
const response = await fetch(`/api/weather/${cityName}`);
const weatherData = await response.json();

// Handle geolocation
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeatherByCoords(latitude, longitude);
  }
);
```

### Blog Platform RESTful API

```javascript
// Get all posts
GET /api/posts

// Get single post with comments
GET /api/posts/:slug

// Create new post
POST /api/posts
{
  "title": "My Blog Post",
  "author": "John Doe", 
  "content": "Post content here..."
}

// Add comment to post
POST /api/posts/:slug/comments
{
  "author": "Jane Reader",
  "content": "Great post!"
}
```

## Performance Benefits

- **Lightning-Fast Builds**: esbuild compiles projects in milliseconds
- **Minimal Dependencies**: Pure JavaScript reduces bundle size
- **Efficient Database**: SQLite provides fast, local data storage
- **Hot Reload**: Instant feedback during development
- **Optimized Code**: Production builds with minification
- **Responsive Design**: Mobile-first CSS for all devices
- **Caching Strategies**: Smart caching for API data and assets

## Learning Outcomes

### After Completing This Repository

**Frontend Development:**
- Master DOM manipulation and event handling
- Understand modern JavaScript ES6+ features
- Build responsive, accessible user interfaces
- Handle asynchronous operations confidently
- Implement client-side state management

**Backend Development:**
- Set up and configure Express.js servers
- Design and implement RESTful APIs
- Work with SQL databases and relationships
- Handle authentication and validation
- Understand server-side security principles

**Full-Stack Integration:**
- Connect frontend and backend systems
- Design efficient data flows
- Implement real-time features
- Handle errors gracefully across the stack
- Deploy applications to production

## Best Practices Demonstrated

### Code Quality
- Comprehensive error handling patterns
- Input validation on client and server
- Security best practices (XSS prevention, SQL injection)
- Performance optimization techniques
- Accessible and semantic HTML

### Development Workflow
- Monorepo management with workspaces
- Build automation with esbuild
- Database migrations and seeding
- Development vs production configurations
- Code documentation and comments

### Architecture Patterns
- Separation of concerns
- RESTful API design
- Database normalization
- State management patterns
- Event-driven programming

## Extending the Projects

### Beginner Extensions
1. **Todo Categories** - Add category system with color coding
2. **Weather Alerts** - Implement severe weather notifications
3. **Blog Search** - Add search functionality to blog platform

### Intermediate Extensions
4. **User Authentication** - Add login/logout functionality
5. **Real-time Features** - WebSocket integration for live updates
6. **Image Uploads** - File handling and storage
7. **Email Notifications** - SMTP integration for alerts

### Advanced Extensions
8. **Mobile Apps** - Convert to Progressive Web Apps
9. **API Rate Limiting** - Implement request throttling
10. **Microservices** - Split into separate services
11. **Cloud Deployment** - Deploy to AWS, Heroku, or Vercel

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-project`
3. Follow the established project structure
4. Add comprehensive documentation
5. Include learning objectives and comments
6. Submit a pull request

## Troubleshooting

### Common Issues

**Installation Problems:**
```bash
rm -rf node_modules projects/*/node_modules
npm install
```

**Build Errors:**
```bash
npm run clean
npm run build
```

**Database Issues (Blog Platform):**
```bash
cd projects/03-blog-platform
npm run clean
npm run init-db
npm run seed-db
```

**API Key Setup (Weather Dashboard):**
- Get free API key from [OpenWeatherMap](https://openweathermap.org/api)
- Replace `YOUR_API_KEY_HERE` in `src/js/main.js`
- Or use the included mock data mode for learning

## Support This Project

If you find this JavaScript Learning Repository valuable for your education or teaching, consider supporting its development:

<p align="center">
  <a href="https://www.buymeacoffee.com/dunamismax" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" />
  </a>
</p>

## Connect

<p align="center">
  <a href="https://twitter.com/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"></a>
  <a href="https://bsky.app/profile/dunamismax.bsky.social" target="_blank"><img src="https://img.shields.io/badge/Bluesky-blue?style=for-the-badge&logo=bluesky&logoColor=white" alt="Bluesky"></a>
  <a href="https://reddit.com/user/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Reddit-%23FF4500.svg?&style=for-the-badge&logo=reddit&logoColor=white" alt="Reddit"></a>
  <a href="https://discord.com/users/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Discord-dunamismax-7289DA.svg?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://signal.me/#p/+dunamismax.66" target="_blank"><img src="https://img.shields.io/badge/Signal-dunamismax.66-3A76F0.svg?style=for-the-badge&logo=signal&logoColor=white" alt="Signal"></a>
</p>

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <img src="/images/js-crown.png" alt="JavaScript Learning" width="400" />
</p>

<p align="center">
  <strong>JavaScript Learning Monorepo</strong><br>
  <sub>Vanilla JS + Express.js + SQLite + esbuild</sub>
</p>