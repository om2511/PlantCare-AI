# PlantCare AI - Backend

AI-powered plant care assistant backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication
- 🌱 Plant Management (CRUD)
- 🤖 AI-Powered Care Schedules (Groq API)
- 🌦️ Seasonal Care Tips (India-specific)
- 💧 Water Quality Recommendations
- 🔬 Disease Detection & Treatment
- 📊 Care Activity Logging
- 📸 Image Upload (Cloudinary)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **AI:** Groq API (Llama 3.3)
- **Image Storage:** Cloudinary
- **Authentication:** JWT

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Groq API key
- Cloudinary account

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd plant-care-backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

4. Start development server
```bash
npm run dev
```

Server runs on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Plants
- `GET /api/plants` - Get all user plants
- `POST /api/plants` - Add new plant (with AI care schedule)
- `GET /api/plants/:id` - Get plant details
- `PUT /api/plants/:id` - Update plant
- `DELETE /api/plants/:id` - Delete plant
- `GET /api/plants/care/today` - Get plants needing care
- `GET /api/plants/:id/seasonal-tips` - Get AI seasonal tips

### Care Logging
- `POST /api/care` - Log care activity
- `GET /api/care` - Get user care logs
- `GET /api/care/plant/:plantId` - Get plant care logs

### Plant Database
- `GET /api/plant-data/search?q=query` - Search plants
- `GET /api/plant-data/:id` - Get plant details
- `GET /api/plant-data/suggestions/ai` - Get AI suggestions

### Disease Detection
- `POST /api/disease/analyze` - Analyze plant image

### Water Quality
- `GET /api/water-quality/:plantId/:waterSource` - Get water advice

## Project Structure
```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # Business logic & AI services
├── data/           # Indian plants database
└── server.js       # Entry point
```

## Indian Plant Database

Contains 30 common Indian plants including:
- Vegetables (Tomato, Chilli, Brinjal, etc.)
- Herbs (Tulsi, Mint, Coriander, etc.)
- Flowers (Rose, Marigold, Jasmine, etc.)
- Indoor plants (Money Plant, Snake Plant, etc.)

## AI Features

All AI features use Groq API (100% free):

1. **Care Schedule Generation** - Personalized based on user's location, climate, and plant type
2. **Seasonal Tips** - India-specific monsoon, summer, winter care
3. **Plant Suggestions** - Recommends plants based on user conditions
4. **Water Quality Advice** - Tap/RO/Rainwater suitability
5. **Disease Detection** - AI-powered diagnosis and treatment

## License

MIT

## Author

Built for B.Tech IT Final Year Project