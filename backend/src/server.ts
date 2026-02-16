import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import activityRoutes from './routes/activity-routes';
import statisticsRoutes from './routes/statistics-routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, 'wwwroot');
  app.use(express.static(staticPath));

  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

// API routes
app.use('/api', activityRoutes);
app.use('/api', statisticsRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// For testing purposes
export default app;