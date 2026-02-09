# Exercise Planner

A Progressive Web App (PWA) for tracking sport activities and managing exercise routines.

## Features

- **Activity Suggestions**: Suggests activities based on alternating types and incrementing IDs
- **Statistics Dashboard**: Weekly, monthly, and yearly statistics with streak tracking
- **Activity History**: View completed activities with timestamps
- **Manual Activity Changes**: Override suggestions and select custom activities
- **Skip Activities**: Skip suggested activities for rest days
- **PWA Support**: Installable on mobile devices, works offline
- **Responsive Design**: Works on desktop and mobile devices

## Technologies

- **Backend**: Express.js + TypeScript
- **Frontend**: Lit.js + TypeScript + Tailwind CSS
- **Build Tools**: Vite
- **Testing**: Jest (frontend), Simple unit tests (backend)
- **Deployment**: Docker + Alpine Linux

## Project Structure

```
ExercisePlanner/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # TypeScript interfaces
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── tests/          # Backend tests
│   └── package.json
├── frontend/          # Lit.js PWA
│   ├── src/
│   │   ├── components/     # Lit components
│   │   ├── services/       # API client
│   │   └── types/          # TypeScript types
│   ├── public/         # Static assets
│   └── package.json
├── data/              # JSON data files
├── docker/            # Docker configuration
└── package.json       # Workspace root
```

## Activity Suggestion Rules

The app alternates between activity types and increments IDs within each type:

Example sequence:
```
stretching #12 → fitness #1 → stretching #14 → fitness #3 → stretching #16 → ...
```

Activities are defined in `data/activities.json`:

```json
[
  {
    "type": "stretching",
    "ids": [12, 14, 16, 18]
  },
  {
    "type": "fitness",
    "ids": [1, 3, 5, 7]
  }
]
```

## Getting Started

### Prerequisites

- Node.js 20.x
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExercisePlanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Start both backend (port 3000) and frontend (port 3001)
   npm run dev
   ```

4. **Open the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## Testing

Run tests after every change:

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

## Docker Deployment

### Build and run with Docker

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run
```

### Docker Compose (recommended for development/prod)

```bash
# Build and run with Docker Compose
docker-compose -f docker/docker-compose.yml up --build
```

The application will be available at http://localhost:3000 with persistent data storage.

## API Documentation

### Endpoints

- `GET /api/health` - Health check
- `GET /api/activities` - Get all activity definitions
- `GET /api/activities/suggest` - Get today's suggested activity
- `GET /api/activities/history` - Get activity history
- `POST /api/activities/done` - Mark activity as done (body: `{ skip: false }`)
- `PUT /api/activities/cancel` - Cancel last activity
- `GET /api/statistics` - Get statistics

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment ('development' or 'production')
- `DATA_PATH` - Path to data directory (default: './data')

### Data Files

- `data/activities.json` - Activity definitions
- `data/activities-history.json` - Completed activities history

## Development

### Building for Production

```bash
# Build all components
npm run build

# Frontend builds to frontend/dist/
# Backend builds to backend/dist/
```

### Architecture

- **Single Responsibility**: Each service/controller has one responsibility
- **Dependency Injection**: Services are injected into controllers
- **Error Handling**: Consistent error responses across API
- **Type Safety**: Full TypeScript coverage
- **Testing**: Unit tests for critical business logic
- **PWA Ready**: Service worker and manifest for offline support

## Contributing

1. Make changes
2. Run tests: `npm test`
3. Build and test locally: `npm run dev`
4. Ensure Docker build works: `npm run docker:build`

## License

MIT License - see LICENSE file for details.