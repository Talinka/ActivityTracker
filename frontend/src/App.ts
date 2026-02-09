import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ActivitySuggestion, Statistics, FinishedActivity, ActivityDefinition } from './types';
import { apiService } from './services/api';
import './components/DashboardPage';

@customElement('exercise-app')
export class App extends LitElement {
	static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    nav {
      background: #2563eb;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    nav h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .error {
      background: #f87171;
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      font-size: 1.2rem;
      color: #6b7280;
    }
  `;

	@state()
	private currentSuggestion: ActivitySuggestion | null = null;

	@state()
	private statistics: Statistics | null = null;

	@state()
	private history: FinishedActivity[] = [];

	@state()
	private activities: ActivityDefinition[] = [];

	@state()
	private loading = false;

	@state()
	private error: string | null = null;

	async firstUpdated() {
		await this.loadData();
	}

	private async loadData() {
		this.loading = true;
		this.error = null;

		try {
			const [suggestion, stats, historyResult, activitiesResult] = await Promise.all([
				apiService.getSuggestion(),
				apiService.getStatistics(),
				apiService.getHistory(),
				apiService.getActivities()
			]);

			this.currentSuggestion = suggestion;
			this.statistics = stats;
			this.history = historyResult;
			this.activities = activitiesResult;
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Failed to load data';
			console.error('Error loading data:', error);
		} finally {
			this.loading = false;
		}
	}

	private async handleMarkDone(type: string, id: number) {
		try {
			await apiService.markDone(type, id);
			await this.loadData();
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Failed to mark activity as done';
			console.error('Error marking done:', error);
		}
	}

	private async handleCancelLastActivity() {
		try {
			await apiService.cancelLastActivity();
			await this.loadData();
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Failed to cancel last activity';
			console.error('Error marking done:', error);
		}
	}

	render() {
		return html`
      <nav>
        <h1>Exercise Planner</h1>
      </nav>

      <main>
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}

        ${this.loading ? html`<div class="loading">Loading...</div>` : html`
          <dashboard-page
            .currentSuggestion=${this.currentSuggestion}
            .statistics=${this.statistics}
            .history=${this.history}
            .activities=${this.activities}
            @mark-done=${(e: CustomEvent) => this.handleMarkDone(e.detail.type, e.detail.id)}
            @cancel-last=${() => this.handleCancelLastActivity()}
            @refresh=${() => this.loadData()}
          ></dashboard-page>
        `}
      </main>
    `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'exercise-app': App;
	}
}