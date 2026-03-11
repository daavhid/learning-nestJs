# NestJS Real-Time Chat Application

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A comprehensive real-time chat application built with NestJS, featuring social networking capabilities, WebSocket communication, and comprehensive API documentation.
</p>

<p align="center">
  <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/built%20with-NestJS-red.svg" alt="Built with NestJS" /></a>
  <a href="https://www.mongodb.com" target="_blank"><img src="https://img.shields.io/badge/database-MongoDB-green.svg" alt="MongoDB" /></a>
  <a href="https://socket.io" target="_blank"><img src="https://img.shields.io/badge/websocket-Socket.IO-black.svg" alt="Socket.IO" /></a>
  <a href="https://swagger.io" target="_blank"><img src="https://img.shields.io/badge/docs-Swagger-blue.svg" alt="Swagger" /></a>
</p>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- WebSocket authentication guards
- Role-based access control
- Secure password hashing

### 💬 Real-Time Communication
- WebSocket-based chat system
- Real-time messaging in conversations
- Live notifications
- Online/offline status tracking

### 👥 Social Features
- User profiles with avatars and cover photos
- Friend request system
- User search and discovery
- Follow/unfollow functionality

### 📝 Content Management
- Post creation and management
- Comment system with threading
- Reaction system (likes, etc.)
- Media upload with Cloudinary integration

### 🏠 Conversation Management
- One-on-one and group conversations
- Conversation member management
- Admin controls for groups
- Message history and search

### 📊 Advanced Features
- Pagination for large datasets
- File upload and media management
- Comprehensive API documentation
- Code documentation with Compodoc
- ESLint code quality enforcement

## 🛠 Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO for WebSocket communication
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI and Compodoc

### Development Tools
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest
- **Process Management**: PM2 (for production)
- **Containerization**: Docker & Docker Compose
- **API Testing**: Postman/Insomnia

### External Services
- **Media Storage**: Cloudinary
- **Database**: MongoDB Atlas (cloud) or local MongoDB

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intro-concepts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🔧 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/chat-app

# JWT
JWT_SECRET_ACCESS_TOKEN=your-jwt-secret-here
JWT_SECRET_REFRESH_TOKEN=your-refresh-jwt-secret-here

# Cloudinary (for media uploads)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## ▶️ Running the Application

### Development Mode
```bash
# Start with hot reload
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Docker
```bash
# Start with Docker Compose
docker-compose up -d
```

## 📚 API Documentation

### Swagger UI
Once the application is running, visit:
- **API Docs**: `http://localhost:5000/api-docs`
- Interactive API testing interface with all endpoints documented

### Code Documentation
```bash
# Generate and serve code documentation
npm run compodoc
# Visit: http://localhost:8080
```

## 📁 Project Structure

```
src/
├── _cores/                    # Core application modules
│   ├── decorators/           # Custom decorators (object-id, current-user, etc.)
│   ├── guards/               # Authentication & authorization guards
│   ├── interceptors/         # Response transformation interceptors
│   ├── middlewares/          # Custom middlewares
│   └── swagger/              # Custom Swagger decorators
├── app/                      # Main application module
├── auth/                     # Authentication module
├── users/                    # User management
├── posts/                    # Posts and content management
├── comments/                 # Comments system
├── conversations/            # Chat conversations
├── messages/                 # Real-time messaging
├── notifications/            # Notification system
├── friend-request/           # Friend request functionality
├── cloudinary/               # Media upload service
├── common/                   # Shared utilities and DTOs
└── main.ts                   # Application entry point

test/                         # Test files
├── app.e2e-spec.ts
└── jest-e2e.json
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run linting
npm run lint
```

## 🚀 Deployment

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Start with PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name "chat-app"
   ```

### Docker Deployment
```bash
# Build and run with Docker
docker build -t nestjs-chat-app .
docker run -p 5000:5000 nestjs-chat-app
```

### Cloud Deployment
- **Railway**: Connect your GitHub repo for automatic deployments
- **Heroku**: Use the Heroku CLI or GitHub integration
- **AWS**: Deploy to EC2, ECS, or use Elastic Beanstalk
- **Vercel**: For serverless deployment (requires adapter)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The framework that makes building scalable server applications easy
- [Socket.IO](https://socket.io/) - Real-time bidirectional communication
- [MongoDB](https://www.mongodb.com/) - NoSQL database for flexible data storage
- [Swagger](https://swagger.io/) - API documentation and testing
- [Cloudinary](https://cloudinary.com/) - Media management and optimization

## 📞 Support

If you have any questions or need help with the project:

- Open an issue on GitHub
- Check the [NestJS Documentation](https://docs.nestjs.com)
- Join the [NestJS Discord](https://discord.gg/G7Qnnhy)

---

<p align="center">
  Built with ❤️ using <a href="https://nestjs.com">NestJS</a>
</p>
