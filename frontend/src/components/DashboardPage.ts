import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ActivitySuggestion, Statistics, FinishedActivity, ActivityDefinition } from '../types';
import './ActivityTracker';
import './StatisticsPanel';
import './ActivityHistory';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
	static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .full-width {
        grid-column: 1;
      }
    }
  `;

	@property({ type: Object })
	currentSuggestion!: ActivitySuggestion | null;

	@property({ type: Object })
	statistics!: Statistics | null;

	@property({ type: Array })
	history!: FinishedActivity[];

	@property({ type: Array })
	activities!: ActivityDefinition[];

	render() {
		return html`
      <div class="dashboard-grid">
        <activity-tracker
          class="full-width"
          .selectedActivity=${this.currentSuggestion}
          .activities=${this.activities}
          @mark-done=${(e: CustomEvent) => this.dispatchEvent(new CustomEvent('mark-done', { detail: e.detail }))}
					@cancel-last=${() => this.dispatchEvent(new Event('cancel-last'))}
        ></activity-tracker>

        <statistics-panel
          .statistics=${this.statistics}
        ></statistics-panel>

        <activity-history
          .history=${this.history}
          .activities=${this.activities}
        ></activity-history>
      </div>
    `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'dashboard-page': DashboardPage;
	}
}