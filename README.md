# 1033 Program Map

An interactive map visualizing the US Department of Defense 1033 Program, which tracks the transfer of excess military equipment to law enforcement agencies across the United States.

![screenshot](https://dl.dropboxusercontent.com/s/4416m5cmrsz7rrc/Screenshot%202015-02-20%2018.30.20.png)

## What is the 1033 Program?

[From Wikipedia](http://en.wikipedia.org/wiki/1033_program):

> The 1033 Program was created by the National Defense Authorization Act of Fiscal Year 1997 as part of the US Government's Defense Logistics Agency Disposition Services (DLA) to transfer excess military equipment to law enforcement agencies. As of 2014, 8,000 local law enforcement agencies participated in the reutilization program that has transferred $5.1 billion in military hardware from the Department of Defense to local American law enforcement agencies since 1997. According to DLA material worth $449 million was transferred in 2013 alone. The most commonly obtained item from the 1033 program is ammunition. Some of the other most commonly requested items include cold weather clothing, sand bags, medical supplies, sleeping bags, flashlights and electrical wiring. Grenade launchers and vehicles such as aircraft, watercraft and armored vehicles have also been obtained.

## Features

- Interactive map showing military equipment distribution across counties
- Real-time data updates using Socket.io
- Detailed equipment information by region
- User authentication with multiple OAuth providers
- Responsive design for mobile and desktop

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Template Engine**: Pug (formerly Jade)
- **Authentication**: Passport.js with OAuth support
- **Maps**: Leaflet with TopoJSON/GeoJSON data

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (v4.4 or higher)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/michaelcolenso/1033-Program-Map.git
cd 1033-Program-Map
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and configure it with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration. At minimum, you'll need:

```env
# Required
SESSION_SECRET=your-random-session-secret
MONGODB_URI=mongodb://localhost:27017/test

# Optional: Only needed if using OAuth providers
FACEBOOK_ID=your-facebook-app-id
FACEBOOK_SECRET=your-facebook-app-secret
# ... other OAuth credentials
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. (Optional) Restore database dump

If you want to use the included database dump:

```bash
mongorestore --db test dump/test/
```

## Running the Application

### Development mode (with auto-restart)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The application will be available at `http://localhost:8080`

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

```
1033-Program-Map/
├── app.js              # Main application file
├── setup.js            # CLI setup utility
├── config/             # Configuration files
│   ├── secrets.js      # Environment variables config
│   └── passport.js     # Passport authentication strategies
├── controllers/        # Route controllers
│   ├── home.js
│   ├── map.js
│   ├── user.js
│   └── api.js
├── models/             # Database models
│   ├── User.js
│   └── Sale.js
├── views/              # Pug templates
│   ├── layout.pug
│   ├── home.pug
│   ├── map.pug
│   ├── account/
│   └── partials/
├── public/             # Static assets
│   ├── js/
│   ├── css/
│   └── fonts/
└── test/               # Test files
```

## Environment Variables

See `.env.example` for a complete list of supported environment variables. Key variables include:

- `SESSION_SECRET` - Secret for session encryption (required)
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 8080)
- OAuth credentials for various providers (Facebook, Twitter, GitHub, etc.)
- API keys for third-party services (Stripe, Twilio, etc.)

## Deployment

### Heroku

This application is configured for Heroku deployment with the included `Procfile`.

1. Create a Heroku app:
```bash
heroku create your-app-name
```

2. Add MongoDB addon:
```bash
heroku addons:create mongolab
```

3. Set environment variables:
```bash
heroku config:set SESSION_SECRET=your-secret
# ... other environment variables
```

4. Deploy:
```bash
git push heroku main
```

## API Integrations

The application includes example integrations with various APIs:

- Facebook, Twitter, Instagram, GitHub
- Stripe, Twilio
- Last.fm, New York Times
- Foursquare, LinkedIn
- And more...

Each integration requires appropriate API credentials in your `.env` file.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this project.

## Security

- Never commit `.env` or `config/secrets.js` with real credentials
- All API keys should be stored in environment variables
- Use strong session secrets in production
- Keep dependencies updated regularly

## License

MIT

## Acknowledgments

Built upon the [Hackathon Starter](https://github.com/sahat/hackathon-starter) boilerplate.

## Support

For issues and questions, please open an issue on GitHub.




