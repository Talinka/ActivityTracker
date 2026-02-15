import { Request, Response } from 'express';
import { statisticsService } from '../services/statistics-service';
import { ApiResponse } from 'models/api';

export const getCurrentStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const statistics = statisticsService.getCurrentStatistics();
    const response: ApiResponse<any> = {
      success: true,
      data: statistics
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<any> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get statistics'
    };
    res.status(500).json(response);
  }
};