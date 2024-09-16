# EcoTrack: Environmental Monitoring Platform

EcoTrack is a full-stack React application with a Node.js backend, simulating real-time data from IoT sensors to monitor environmental factors.

## Features

User Authentication (registration, login, password reset)
Dashboard Overview
Real-time Environmental Data Display
Map Integration
Data Visualization
Sensor Management
Alerts and Notifications
Historical Data Analysis
User Profile and Settings
Admin Panel

## Tech Stack

**Frontend:** React with Material UI
**Backend:** Node.js with Express
**Database:** MongoDB
**Real-time data:** WebSockets
**Mapping:** Mapbox API
**Deployment:** Render
**CI/CD:** GitHub Actions

## Getting Started

### Prerequisites

Node.js (v20 or later)
MongoDB
Docker

### Installation

#### Clone the repository:
```
git clone https://github.com/cnourrcier/ecotrack.git
cd ecotrack
```

#### Install dependencies:
```
npm install:all
```

#### Set up environment variables:

Create a .env file in the root directory and add the following:
```
NODE_ENV=put_development_or_production
PORT=your_port
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

#### Start the development server and client:
```
npm run dev
```

## Running Tests

To run the backend tests:
```
npm test:server
```

## API Documentation

For detailed API documentation, see API_DOCUMENTATION.md.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.




ecotrack/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── client/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   └── // React components
│   │   ├── pages/
│   │   │   └── // Page-level components
│   │   ├── hooks/
│   │   │   └── // Custom React hooks
│   │   ├── utils/
│   │   │   └── // Utility functions
│   │   ├── contexts/
│   │   │   └── // React contexts
│   │   ├── api/
│   │   │   └── // API service functions
│   │   ├── styles/
│   │   │   └── // Global styles and theme
│   │   ├── App.js
│   │   └── index.js
│   ├── .babelrc
│   ├── Dockerfile
│   ├── .eslintrc.json
│   ├── package.json
│   ├── webpack.config.js
│   ├── README.md
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── // Configuration files
│   │   ├── controllers/
│   │   │   └── // Route controllers
│   │   ├── models/
│   │   │   └── // MongoDB models
│   │   ├── routes/
│   │   │   └── // Express routes
│   │   ├── services/
│   │   │   └── // Business logic
│   │   ├── tests/
│   │   │   └── // Test files
│   │   ├── utils/
│   │   │   ├── // Utility functions
│   │   │   └── // Mock functions
│   │   ├── websockets/
│   │   │   └── // WebSocket handling
│   │   └── app.js
│   ├── API_DOCUMENTATION.md
│   ├── Dockerfile
│   ├── .eslintrc.json
│   ├── jest.config.js
│   ├── jest.setup.js
│   └── package.json
├── shared/
│   └── constants.js
├── .env
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── package.json
└── README.md







