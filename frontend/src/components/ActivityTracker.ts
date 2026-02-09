import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ActivitySuggestion, ActivityDefinition } from '../types';

@customElement('activity-tracker')
export class ActivityTracker extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 2px solid #e5e7eb;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .today-label {
      background: #dbeafe;
      color: #1d4ed8;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .activity-display {
      background: #f9fafb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .activity-type {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .activity-id {
      font-size: 2rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .activity-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .change-form {
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    select:focus {
      outline: none;
      ring: 2px;
      ring-color: #2563eb;
      border-color: #2563eb;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      flex: 1;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .btn-success {
      background: #059669;
      color: white;
    }

    .btn-success:hover {
      background: #047857;
    }

		.btn-danger {
			background: #c70036;
			color: white;
		}

		.btn-danger:hover {
			background: #a50036;
		}

    @media (max-width: 640px) {
      padding: 1.5rem;

      .actions {
        flex-direction: column;
      }

      .btn {
        padding: 1rem;
      }
    }
  `;

  @property({ type: Object })
  selectedActivity!: ActivitySuggestion | null;

  @property({ type: Array })
  activities!: ActivityDefinition[];

  @state()
  private selectedType: string | null = null;

  @state()
  private selectedId: number | null = null;

  @state()
  private showChangeForm: boolean = false;

  render() {
    return html`
      <div class="header">
        <h2>Today's Activity</h2>
        <span class="today-label">Today</span>
      </div>

      ${this.selectedActivity ? html`
        <div class="activity-display">
          <div class="activity-type">${this.selectedActivity.type}</div>
          <div class="activity-id">#${this.selectedActivity.id}</div>
          <div class="activity-date">${new Date(this.selectedActivity.date).toLocaleDateString()}</div>
        </div>

        <div class="actions">
          <button
            class="btn btn-success"
            @click=${this.handleMarkDone}
          >
            Mark as Done
          </button>

          <button
            class="btn btn-primary"
            @click=${() => this.showChangeForm = !this.showChangeForm}
          >
            ${this.showChangeForm ? 'Cancel' : 'Change'}
          </button>

          <button
            class="btn btn-danger"
            @click=${() => this.dispatchEvent(new Event('cancel-last'))}
          >
            Cancel last activity
          </button>
        </div>

        ${this.showChangeForm ? html`
          <div class="change-form">
            <div class="form-group">
              <label for="activity-type">Activity Type</label>
              <select
                id="activity-type"
                .value=${this.selectedType}
                @change=${(e: Event) => this.handleTypeChange((e.target as HTMLSelectElement).value)}
              >
                <option value="">Select type...</option>
                ${this.activities.map(activity => html`
                  <option value=${activity.type}>${activity.type}</option>
                `)}
              </select>
            </div>

            <div class="form-group">
              <label for="activity-id">Activity ID</label>
              <select
                id="activity-id"
                .value=${this.selectedId}
                @change=${(e: Event) => this.selectedId = parseInt((e.target as HTMLSelectElement).value)}
                ?disabled=${!this.selectedType}
              >
                <option value="">Select ID...</option>
                ${this.getIdsForType().map(id => html`
                  <option value=${id}>${id}</option>
                `)}
              </select>
            </div>

            <div class="actions">
              <button
                class="btn btn-primary"
                ?disabled=${!this.selectedType || !this.selectedId}
                @click=${this.handleApplyChange}
              >
                Apply Change
              </button>
            </div>
          </div>
        ` : ''}
      ` : html`
        <div class="activity-display">
          <div style="color: #6b7280;">No activity suggestion available</div>
        </div>
      `}
    `;
  }

  private handleTypeChange(type: string) {
    this.selectedType = type;
    this.selectedId = null;
  }

  private getIdsForType(): number[] {
    if (!this.selectedType) return [];
    const activity = this.activities.find(a => a.type === this.selectedType);
    return activity ? activity.ids : [];
  }

  private handleApplyChange() {
    if (this.selectedType && this.selectedId && this.selectedActivity) {
      this.selectedActivity.type = this.selectedType;
      this.selectedActivity.id = this.selectedId;
      this.showChangeForm = false;
    }
  }

  private handleMarkDone() {
    if (this.selectedActivity) {
      this.dispatchEvent(new CustomEvent('mark-done', {
        detail: { type: this.selectedActivity.type, id: this.selectedActivity.id }
      }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'activity-tracker': ActivityTracker;
  }
}