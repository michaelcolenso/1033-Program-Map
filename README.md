# 1033 Program Map

An interactive map visualizing the US Department of Defense 1033 Program, which tracks the transfer of excess military equipment to law enforcement agencies across the United States.

## What is the 1033 Program?

[From Wikipedia](http://en.wikipedia.org/wiki/1033_program):

> The 1033 Program was created by the National Defense Authorization Act of Fiscal Year 1997 as part of the US Government's Defense Logistics Agency Disposition Services (DLA) to transfer excess military equipment to law enforcement agencies. As of 2014, 8,000 local law enforcement agencies participated in the reutilization program that has transferred $5.1 billion in military hardware from the Department of Defense to local American law enforcement agencies since 1997.

## Features

- Interactive map showing military equipment distribution across US counties
- Real-time data updates using Socket.io
- Color-coded visualization by cost per household
- Detailed equipment breakdown by clicking on any county
- User authentication (optional)
- Responsive design for mobile and desktop

## Tech Stack

- **Backend**: Node.js 18+, Express.js 4
- **Database**: MongoDB 6+ with Mongoose ODM
- **Real-time**: Socket.io 4
- **Template Engine**: Pug
- **Maps**: Leaflet.js with D3.js overlay
- **Data**: TopoJSON for county boundaries
- **Security**: Helmet, rate limiting, CSRF protection

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/michaelcolenso/1033-Program-Map.git
cd 1033-Program-Map

# Start with Docker Compose
docker-compose up -d

# Seed the database
docker-compose exec app npm run seed
```

The application will be available at `http://localhost:8080`

### Manual Installation

#### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 6+

#### Steps

1. **Clone and install**
   ```bash
   git clone https://github.com/michaelcolenso/1033-Program-Map.git
   cd 1033-Program-Map
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community

   # Ubuntu/Debian
   sudo systemctl start mongod
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/1033-program-map` |
| `SESSION_SECRET` | Session encryption secret | (required) |
| `EMAIL_HOST` | SMTP host for password reset | (optional) |
| `EMAIL_USER` | SMTP username | (optional) |
| `EMAIL_PASSWORD` | SMTP password | (optional) |

## Project Structure

```
1033-Program-Map/
├── app.js                 # Express application
├── routes/
│   └── index.js           # Route definitions
├── controllers/
│   ├── home.js            # Home page
│   ├── map.js             # Map page
│   ├── user.js            # Authentication
│   └── contact.js         # Contact form
├── models/
│   └── User.js            # User model
├── config/
│   ├── secrets.js         # Environment config
│   └── passport.js        # Auth strategies
├── views/                 # Pug templates
├── public/
│   ├── js/
│   │   ├── main.js        # Map logic
│   │   └── *.json         # GeoJSON data
│   └── css/
├── scripts/
│   └── seed.js            # Database seeder
├── Dockerfile
└── docker-compose.yml
```

## Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run test suite
npm run seed       # Seed database with equipment data
npm run lint       # Run ESLint
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Home page |
| `GET /map` | Interactive map |
| `GET /api/health` | Health check |
| `GET /login` | Login page |
| `GET /signup` | Registration page |

### Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `getid` | Client → Server | Request equipment data for a county |
| `id` | Server → Client | Equipment data response |

## Deployment

### Docker

```bash
docker build -t 1033-program-map .
docker run -p 8080:8080 -e MONGODB_URI=your-mongo-uri 1033-program-map
```

### Heroku

```bash
heroku create your-app-name
heroku addons:create mongolab
heroku config:set SESSION_SECRET=your-secret
git push heroku main
```

## Security

- CSRF protection enabled
- Rate limiting on API routes
- Helmet.js security headers
- Secure session cookies in production
- Password hashing with bcrypt

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Data Source

Equipment data from [The New York Times](https://github.com/TheUpshot/Military-Surplus-Gear).

## License

MIT

## Support

For issues and questions, please [open an issue](https://github.com/michaelcolenso/1033-Program-Map/issues) on GitHub.




