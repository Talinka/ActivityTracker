import { Router } from 'express';
import { getStatistics } from '../controllers/statistics-controller';

const router = Router();

// Get statistics (weekly, monthly, yearly, streak)
router.get('/statistics', getStatistics);

export default router;