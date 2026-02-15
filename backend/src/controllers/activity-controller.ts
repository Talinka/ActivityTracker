import { Request, Response } from 'express';
import { activityService } from '../services/activity-service';
import { ApiResponse, HistoryQuery, MarkDoneRequest } from 'models/api';

export const getActivities = async (req: Request, res: Response): Promise<void> => {
	try {
		const activities = activityService.getAllActivities();
		const response: ApiResponse<any> = {
			success: true,
			data: activities
		};
		res.json(response);
	} catch (error) {
		const response: ApiResponse<any> = {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to get activities'
		};
		res.status(500).json(response);
	}
};

export const getSuggestion = async (req: Request, res: Response): Promise<void> => {
	try {
		const suggestion = activityService.suggestActivity();
		const response: ApiResponse<any> = {
			success: true,
			data: suggestion
		};
		res.json(response);
	} catch (error) {
		const response: ApiResponse<any> = {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to get suggestion'
		};
		res.status(500).json(response);
	}
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
	try {
		const query = req.query as HistoryQuery;
		const { startDate, endDate, type } = query;
		const history = activityService.getHistory(
			startDate,
			endDate,
			type
		);
		const response: ApiResponse<any> = {
			success: true,
			data: history
		};
		res.json(response);
	} catch (error) {
		const response: ApiResponse<any> = {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to get history'
		};
		res.status(500).json(response);
	}
};

export const markDone = async (req: Request, res: Response): Promise<void> => {
	try {
		const body = req.body as MarkDoneRequest;
		const { type, id } = body;
		activityService.markDone(type, id);
		const response: ApiResponse<any> = {
			success: true,
			data: { message: 'Activity marked as done' }
		};
		res.json(response);
	} catch (error) {
		const response: ApiResponse<any> = {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to mark activity'
		};
		const status = error instanceof Error && error.message.includes('already marked') ? 400 : 500;
		res.status(status).json(response);
	}
};

export const cancelLast = async (req: Request, res: Response): Promise<void> => {
	try {
		activityService.cancelLastActivity();
		const response: ApiResponse<any> = {
			success: true,
			data: { message: 'Last activity was canceled' }
		};
		res.json(response);
	} catch (error) {
		const response: ApiResponse<any> = {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to cancel activity'
		};

		res.status(500).json(response);
	}
};
