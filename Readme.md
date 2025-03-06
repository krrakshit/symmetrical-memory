# Zenith

A modern web application with a React frontend and a backend API.

## Overview

This project is a full-stack application that uses React for the frontend and communicates with a backend API. It includes a robust authentication system and error handling.

## Features

- User authentication with JWT tokens
- Secure API communication
- Toast notifications for user feedback
- Error handling for common HTTP status codes
- TypeScript support for type safety

## Project Structure

The project is organized into frontend and backend components:

### Frontend

- Built with React and TypeScript
- Uses Axios for API communication
- Includes toast notifications for user feedback

### Backend

- RESTful API endpoints
- Authentication and authorization
- Running on port 3000

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PITIFULHAWK/symmetrical-memory
   cd symmetrical-memory
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   bun install
   
   # Install backend dependencies
   cd ../backend
   bun install
   ```

3. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   bun run index.ts
   
   # In a new terminal, start frontend server
   cd frontend
   bun run dev
   ```

## API Communication

The frontend communicates with the backend using Axios. The API service is configured to:

- Send authentication tokens with each request
- Handle common error responses (401, 403, 500)
- Provide convenient methods for API calls (get, post, put, delete, patch)

## Authentication

The application uses JWT token-based authentication:

- Tokens are stored in localStorage
- Tokens are automatically included in API requests
- Session expiration is handled with user notifications
- Unauthorized access redirects to the login page

## Error Handling

The application includes comprehensive error handling:

- 401 Unauthorized: Clears auth state and redirects to login
- 403 Forbidden: Displays access denied message
- 500 Server Error: Displays server error message

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
