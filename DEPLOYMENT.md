# 1033 Program Map - Deployment Guide

This guide provides instructions for deploying the 1033 Program Map application in various environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Manual Deployment](#manual-deployment)
- [Health Checks](#health-checks)

## Prerequisites

### Required Software
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 4.4 (or MongoDB Atlas account)
- **Docker** (optional): >= 20.10
- **Docker Compose** (optional): >= 2.0

## Environment Variables

Copy `.env.example` to `.env` and configure the following required variables:

### Required Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/test
MONGOLAB_URI=mongodb://localhost:27017/test

# Session
SESSION_SECRET=your-strong-random-secret-here

# Server
NODE_ENV=production
PORT=8080
```

### Optional OAuth Variables
Configure these if you want to enable OAuth authentication:
- `FACEBOOK_ID`, `FACEBOOK_SECRET`
- `GITHUB_ID`, `GITHUB_SECRET`
- `GOOGLE_ID`, `GOOGLE_SECRET`
- `TWITTER_KEY`, `TWITTER_SECRET`
- `LINKEDIN_ID`, `LINKEDIN_SECRET`
- `INSTAGRAM_ID`, `INSTAGRAM_SECRET`

See `.env.example` for the complete list of available variables.

## Docker Deployment

### Quick Start with Docker Compose

1. **Start the application**:
   ```bash
   docker-compose up -d
   ```

2. **View logs**:
   ```bash
   docker-compose logs -f app
   ```

3. **Stop the application**:
   ```bash
   docker-compose down
   ```

4. **Access the application**:
   - Application: http://localhost:8080
   - Health Check: http://localhost:8080/health

### Production Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t 1033-program-map:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name 1033-app \
     -p 8080:8080 \
     -e MONGODB_URI="your-mongodb-uri" \
     -e SESSION_SECRET="your-session-secret" \
     1033-program-map:latest
   ```

## Heroku Deployment

The application is configured for Heroku deployment using the provided `Procfile`.

### Initial Setup

1. **Create a Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Add MongoDB addon**:
   ```bash
   heroku addons:create mongolab:sandbox
   ```
   Or use MongoDB Atlas and set the `MONGODB_URI` config var.

3. **Set environment variables**:
   ```bash
   heroku config:set SESSION_SECRET="your-strong-random-secret"
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Restore database** (if using dump):
   ```bash
   heroku run bash
   mongorestore --uri $MONGODB_URI dump/test/
   ```

## Manual Deployment

### 1. Install Dependencies
```bash
npm install --production
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start MongoDB
Ensure MongoDB is running locally or configure `MONGODB_URI` to point to your MongoDB instance.

### 4. Restore Database (Optional)
If you have a database dump:
```bash
mongorestore --db test dump/test/
```

### 5. Start the Application

**Production mode**:
```bash
NODE_ENV=production npm start
```

**Development mode** (with auto-restart):
```bash
npm run dev
```

## Health Checks

The application includes a health check endpoint at `/health` that returns:

### Healthy Response (200 OK)
```json
{
  "uptime": 123.456,
  "message": "OK",
  "timestamp": 1234567890,
  "database": "connected"
}
```

### Unhealthy Response (503 Service Unavailable)
```json
{
  "uptime": 123.456,
  "message": "Database connection failed",
  "timestamp": 1234567890,
  "database": "disconnected"
}
```

Use this endpoint for:
- Docker health checks (configured in Dockerfile)
- Load balancer health checks
- Monitoring systems
- Kubernetes liveness/readiness probes

## Security Considerations

### Before Production Deployment:

1. **Change default secrets**:
   - Generate a strong `SESSION_SECRET`
   - Use environment variables, never commit secrets

2. **Enable HTTPS**:
   - The session cookie is configured with `secure: true` in production
   - Ensure your deployment platform supports HTTPS

3. **Configure MongoDB authentication**:
   - Use authenticated MongoDB connections
   - Restrict network access to database

4. **Review OAuth credentials**:
   - Set up proper OAuth callback URLs
   - Use production OAuth app credentials

5. **Update dependencies**:
   ```bash
   npm audit fix
   ```

## Troubleshooting

### Application won't start
- Check MongoDB connection string
- Verify all required environment variables are set
- Check logs: `docker-compose logs app` or `heroku logs --tail`

### Database connection errors
- Ensure MongoDB is running
- Verify `MONGODB_URI` format
- Check network connectivity

### Session issues
- Verify `SESSION_SECRET` is set
- Check MongoDB session store connection

## Monitoring

Monitor the application using:
- Health check endpoint: `/health`
- Application logs
- MongoDB connection status
- Process uptime

For production deployments, consider using:
- Application Performance Monitoring (APM) tools
- Log aggregation services
- Database monitoring tools
