import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FinishedActivity, ActivityDefinition } from 'models/activities';
import { classMap } from 'lit/directives/class-map.js';

@customElement('activity-history')
export class ActivityHistory extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .history-container {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 2px solid #e5e7eb;
      max-height: 400px;
      overflow-y: auto;
    }

    h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      position: sticky;
      top: 0;
      background: white;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .history-canceled-item {
      background: #e2e2e2;
    }

    .activity-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .activity-type {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .history-canceled-item .activity-type {
      text-decoration: line-through;
    }

    .activity-details {
      color: #6b7280;
      font-size: 0.75rem;
    }

    .activity-date {
      color: #2563eb;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .history-canceled-item .activity-date {
      color: #d92f3f;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 2rem;
      font-style: italic;
    }

    @media (max-width: 640px) {
      .history-container {
        padding: 1.5rem;
        max-height: 300px;
      }

      .history-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .activity-info {
        width: 100%;
      }
    }
  `;

  @property({ type: Array })
  history!: FinishedActivity[];

  @property({ type: Array })
  activities!: ActivityDefinition[];

  getActivityClasses = (activity: FinishedActivity) => ({
    'history-item': true,
    'history-canceled-item': Boolean(activity.canceled),
  });

  render() {
    return html`
      <div class="history-container">
        <h3>Recent Activities</h3>

        ${this.history.length > 0 ? html`
          <div class="history-list">
            ${this.history.slice(0, 10).map(activity => html`
              <div class=${classMap(this.getActivityClasses(activity))}">
                <div class="activity-info">
                  <div class="activity-type">${activity.type} #${activity.id}</div>
                  <div class="activity-details">${this.formatTimestamp(activity.timestamp)}</div>
                </div>
                <div class="activity-date">${activity.canceled ? 'Canceled': new Date(activity.date).toLocaleDateString()}</div>
              </div>
            `)}
          </div>
        ` : html`
          <div class="empty-state">
            No activities completed yet. Start your fitness journey!
          </div>
        `}
      </div>
    `;
  }

  private formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'activity-history': ActivityHistory;
  }
}