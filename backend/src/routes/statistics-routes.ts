import { Router } from 'express';
import { getCurrentStatistics } from '../controllers/statistics-controller';

const router = Router();

// Get current statistics (week, month, year, streak)
router.get('/current-statistics', getCurrentStatistics);

export default router;