import { Router } from 'express';
import {
  getActivities,
  getSuggestion,
  getHistory,
  markDone,
	cancelLast
} from '../controllers/activity-controller';

const router = Router();

// Get all available activities
router.get('/activities', getActivities);

// Get suggested activity for today
router.get('/activities/suggest', getSuggestion);

// Mark today's activity as done or skip
router.post('/activities/done', markDone);

// Get activity history with optional filters
router.get('/activities/history', getHistory);

// Cancel last activity in training history
router.put('/activities/cancelLast', cancelLast);

export default router;