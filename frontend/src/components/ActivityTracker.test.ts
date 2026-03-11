import { fireEvent } from '@testing-library/dom';
import './ActivityTracker';
import type { ActivityTracker } from './ActivityTracker';
import type { ActivityDefinition, ActivitySuggestion } from 'models/activities';

const createTracker = () => {
  const tracker = document.createElement('activity-tracker') as ActivityTracker;
  document.body.appendChild(tracker);
  return tracker;
};

describe('ActivityTracker', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('shows a placeholder when no activity is selected', async () => {
    const tracker = createTracker();
    await tracker.updateComplete;

    const root = tracker.shadowRoot;
    expect(root).not.toBeNull();
    expect(root?.textContent).toContain('No activity suggestion available');
  });

  it('dispatches mark-done and applies manual changes', async () => {
    const suggestion: ActivitySuggestion = { type: 'stretching', id: 12, date: '2025-03-01' };
    const activities: ActivityDefinition[] = [
      { type: 'stretching', ids: [12, 14] },
      { type: 'fitness', ids: [1, 3] }
    ];

    const tracker = createTracker();
    tracker.selectedActivity = suggestion;
    tracker.activities = activities;
    await tracker.updateComplete;

    const markDoneHandler = jest.fn();
    tracker.addEventListener('mark-done', markDoneHandler);

    const root = tracker.shadowRoot;
    expect(root).not.toBeNull();

    const markDoneButton = Array.from(root!.querySelectorAll('button')).find(btn =>
      btn.textContent?.includes('Mark as Done')
    );
    expect(markDoneButton).toBeDefined();
    fireEvent.click(markDoneButton!);

    expect(markDoneHandler).toHaveBeenCalledTimes(1);
    expect(markDoneHandler.mock.calls[0][0].detail).toEqual({ type: 'stretching', id: 12 });

    const changeButton = Array.from(root!.querySelectorAll('button')).find(btn =>
      btn.textContent?.trim() === 'Change'
    );
    expect(changeButton).toBeDefined();
    fireEvent.click(changeButton!);
    await tracker.updateComplete;

    const typeSelect = tracker.shadowRoot?.getElementById('activity-type') as HTMLSelectElement;
    fireEvent.change(typeSelect, { target: { value: 'fitness' } });
    await tracker.updateComplete;

    const idSelect = tracker.shadowRoot?.getElementById('activity-id') as HTMLSelectElement;
    fireEvent.change(idSelect, { target: { value: '1' } });
    await tracker.updateComplete;

    const applyButton = Array.from(tracker.shadowRoot!.querySelectorAll('button')).find(btn =>
      btn.textContent?.includes('Apply Change')
    );
    expect(applyButton).toBeDefined();
    fireEvent.click(applyButton!);
    await tracker.updateComplete;

    expect(suggestion.type).toBe('fitness');
    expect(suggestion.id).toBe(1);
  });
});
