# STVT Backend Server

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Initialize the database:

   ```bash
   npm run init-db
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **GET /api/auth/verify** - Verify authentication token
  _Requires Authorization header with Bearer token_

- **POST /api/auth/logout** - Logout (invalidate token)
  _Requires Authorization header with Bearer token_

- **GET /api/auth/permissions** - Get user permissions
  _Requires Authorization header with Bearer token_

### Health Check

- **GET /api/health** - Get server status and diagnostics
