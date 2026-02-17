import { env } from 'process';
import path from 'path';

const dataDir = path.join(__dirname, 'data')
env.EXERCIZE_TRACKER_DATA_DIR = dataDir;

import { dataService } from '../services/data.service';
import { activityService } from '../services/activity-service';
import { statisticsService } from '../services/statistics-service';
import { activityHistory1 } from './fixtures/activityHistory1';
import { activityHistory2 } from './fixtures/activityHistory2';

function runTests(): void {
	let testsPassed = 0;
	let testsFailed = 0;

	function test(name: string, fn: () => boolean): void {
		// Reset data for test
		dataService.saveHistory([]);
		activityService.reloadData();
		try {
			const result = fn();
			if (result) {
				console.log(`✓ ${name}`);
				testsPassed++;
			} else {
				console.log(`✗ ${name} - Test returned false`);
				testsFailed++;
			}
		} catch (error) {
			console.log(`✗ ${name} - Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
			testsFailed++;
		}
	}

	// Activity service tests
	test('suggestAlternatingTypes', () => {
		const suggestion1 = activityService.suggestActivity();
		// Should start with first type (stretching), first id (12)
		if (suggestion1.type !== 'stretching' || suggestion1.id !== 12) {
			console.log(`	Expected: stretching/12, Got: ${suggestion1.type}/${suggestion1.id}`);
			return false;
		}

		return true;
	});

	test('getAllActivities', () => {
		const activities = activityService.getAllActivities();
		if (!Array.isArray(activities) || activities.length !== 2) {
			return false;
		}

		const stretching = activities.find(a => a.type === 'stretching');
		const fitness = activities.find(a => a.type === 'fitness');

		if (!stretching || !fitness) return false;
		if (!Array.isArray(stretching.ids) || stretching.ids.length !== 4) return false;
		if (!Array.isArray(fitness.ids) || fitness.ids.length !== 4) return false;

		return true;
	});

	test('markDoneSingleActivity', () => {
		// Get a suggestion and mark it as done
		const suggestion = activityService.suggestActivity();
		activityService.markDone(suggestion.type, suggestion.id);

		// Check that history was updated
		const history = activityService.getHistory();
		const lastActivity = history[history.length - 1];

		if (!lastActivity) {
			return false;
		}
		// Should have marked the suggested activity
		if (lastActivity.type !== suggestion.type || lastActivity.id !== suggestion.id) {
			console.log(`	Expected marked: ${suggestion.type}/${suggestion.id}, Got: ${lastActivity.type}/${lastActivity.id}`);
			return false;
		}

		return true;
	});

	test('incrementIdsCorrectly', () => {
		// Get first suggestion (should be stretching, id 12)
		const suggestion1 = activityService.suggestActivity();
		if (suggestion1.type !== 'stretching' || suggestion1.id !== 12) {
			console.log(`	Expected: stretching/12, Got: ${suggestion1.type}/${suggestion1.id}`);
			return false;
		}

		activityService.markDone(suggestion1.type, suggestion1.id);

		// Get second suggestion (should be next type: fitness, id 1)
		const suggestion2 = activityService.suggestActivity();
		if (suggestion2.type !== 'fitness' || suggestion2.id !== 1) {
			console.log(`	Expected: fitness/1, Got: ${suggestion2.type}/${suggestion2.id}`);
			return false;
		}

		activityService.markDone(suggestion2.type, suggestion2.id);

		// Get third suggestion (should be back to first type: stretching, id 14)
		const suggestion3 = activityService.suggestActivity();
		if (suggestion3.type !== 'stretching' || suggestion3.id !== 14) {
			console.log(`	Expected: stretching/14, Got: ${suggestion3.type}/${suggestion3.id}`);
			return false;
		}

		return true;
	});

	test('statisticsCalculation', () => {
		dataService.saveHistory(activityHistory1);
		activityService.reloadData();
		statisticsService.reloadData();
		const stats = statisticsService.getCurrentStatistics(new Date('2026-02-15'));

		// Check structure
		if (!stats.week || !stats.month || !stats.year || typeof stats.streak !== 'number') {
			return false;
		}

		if (stats.week.total !== 2) {
			console.log(`	Expected: week total /2, Got: ${stats.week.total}`);
			return false;
		}

		if (stats.month.total !== 3) {
			console.log(`	Expected: month total /3, Got: ${stats.month.total}`);
			return false;
		}

		if (stats.year.total !== 4) {
			console.log(`	Expected: year total /4, Got: ${stats.year.total}`);
			return false;
		}

		if (stats.streak !== 0) {
			console.log(`	Expected: streak /0, Got: ${stats.streak}`);
			return false;
		}

		return true;
	});

		test('streakCalculation', () => {
		dataService.saveHistory(activityHistory2);
		activityService.reloadData();
		statisticsService.reloadData();

		const stats = statisticsService.getCurrentStatistics(new Date('2026-02-10'));

		if (stats.streak !== 4) {
			console.log(`	Expected: streak /4, Got: ${stats.streak}`);
			return false;
		}

		return true;
	});

	console.log(`\n=== Test Results ===`);
	console.log(`Passed: ${testsPassed}`);
	console.log(`Failed: ${testsFailed}`);
	console.log(`Total: ${testsPassed + testsFailed}`);

	if (testsFailed > 0) {
		process.exit(1);
	} else {
		console.log('All tests passed!');
	}
}

// Run tests
runTests();