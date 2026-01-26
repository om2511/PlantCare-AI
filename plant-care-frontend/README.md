# PlantCare AI - Frontend

React-based web application for AI-powered plant care management.

## Features

- 🌱 Plant Management Dashboard
- 🔍 Search Indian Plants Database
- 🤖 AI-Powered Recommendations
- 📸 Image Upload for Disease Detection
- 📊 Care Activity Tracking
- 🌦️ Seasonal Care Tips
- 💧 Water Quality Checker

## Tech Stack

- **Framework:** React 18
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** Context API

## Installation

1. Install dependencies
```bash
npm install
```

2. Start development server
```bash
npm start
```

App runs on http://localhost:3000

## Project Structure
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── auth/       # Auth components
│   │   ├── layout/     # Layout components
│   │   └── plants/     # Plant components
│   ├── pages/          # Page components
│   │   ├── auth/       # Login, Register
│   │   └── dashboard/  # App pages
│   ├── context/        # React Context
│   ├── utils/          # Utilities & API
│   ├── App.js
│   └── index.js
├── public/
└── package.json
```

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Environment Variables

Create `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Features Overview

### Dashboard
- View all plants
- Plants needing care today
- Quick actions

### Add Plant
- Search plant database
- AI generates care schedule
- Manual entry option

### Plant Details
- AI care schedule
- Seasonal tips
- Care history
- Water quality checker
- Disease detection

### AI Suggestions
- Personalized plant recommendations
- Based on location & climate
- Current season consideration

## Deployment

Build for production:
```bash
npm run build
```

Deploy to Vercel:
```bash
vercel deploy
```

## License

MIT
```

---

## STEP 3: PREPARE FOR DEPLOYMENT (1 hour)

### Backend Deployment (Railway) - FREE

#### File 5: Create `Procfile` in backend root
```
web: node server.js