import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Statistics } from '../types';

@customElement('statistics-panel')
export class StatisticsPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 2px solid #e5e7eb;
    }

    h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .stat-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .streak {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .streak .stat-value {
      color: white;
    }

    .streak .stat-label {
      color: rgba(255, 255, 255, 0.9);
    }

    @media (max-width: 640px) {
      padding: 1.5rem;

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .stat-card {
        padding: 1.25rem;
      }
    }
  `;

  @property({ type: Object })
  statistics!: Statistics | null;

  render() {
    if (!this.statistics) {
      return html`<div class="stat-card">Loading statistics...</div>`;
    }

    return html`
      <h3>Statistics</h3>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${this.getWeeklyTotal()}</div>
          <div class="stat-label">This Week</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">${this.getMonthlyTotal()}</div>
          <div class="stat-label">This Month</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">${this.getYearlyTotal()}</div>
          <div class="stat-label">This Year</div>
        </div>

        <div class="stat-card streak">
          <div class="stat-value">${this.statistics.streak}</div>
          <div class="stat-label">Day Streak</div>
        </div>
      </div>
    `;
  }

  private getWeeklyTotal(): number {
    return Object.values(this.statistics!.weekly).reduce((sum, count) => sum + count, 0);
  }

  private getMonthlyTotal(): number {
    const currentMonth = new Date().getFullYear() + '-' +
      String(new Date().getMonth() + 1).padStart(2, '0');

    const monthData = this.statistics!.monthly[currentMonth];
    return monthData ? monthData.total : 0;
  }

  private getYearlyTotal(): number {
    const currentYear = new Date().getFullYear().toString();
    const yearData = this.statistics!.yearly[currentYear];
    return yearData ? yearData.total : 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'statistics-panel': StatisticsPanel;
  }
}