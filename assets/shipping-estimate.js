if (!customElements.get('shipping-estimate')) {
  customElements.define(
    'shipping-estimate',
    class ShippingEstimate extends HTMLElement {
      connectedCallback() {
        this.datesElement = this.querySelector('.shipping-estimate__dates');
        this.toggle = this.querySelector('.shipping-estimate__toggle');
        this.details = this.querySelector('.shipping-estimate__details');

        this.renderDates();

        if (this.toggle && this.details) {
          this.toggle.addEventListener('click', this.onToggleClick.bind(this));
        }
      }

      onToggleClick() {
        const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
        this.toggle.setAttribute('aria-expanded', String(!isExpanded));
        this.details.hidden = isExpanded;
      }

      renderDates() {
        if (!this.datesElement) return;

        const minDays = parseInt(this.dataset.minDays, 10) || 0;
        const maxDays = Math.max(parseInt(this.dataset.maxDays, 10) || minDays, minDays);
        const skipWeekends = this.dataset.skipWeekends === 'true';
        const locale = this.dataset.locale || document.documentElement.lang;

        const start = this.formatDate(this.addDays(new Date(), minDays, skipWeekends), locale);
        const end = this.formatDate(this.addDays(new Date(), maxDays, skipWeekends), locale);

        this.datesElement.textContent = `${start} – ${end}`;
      }

      addDays(date, days, skipWeekends) {
        const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (!skipWeekends) {
          result.setDate(result.getDate() + days);
          return result;
        }

        // count business days: Saturdays and Sundays don't count toward the delivery window
        let added = 0;
        while (added < days) {
          result.setDate(result.getDate() + 1);
          const day = result.getDay();
          if (day !== 0 && day !== 6) added++;
        }
        return result;
      }

      formatDate(date, locale) {
        try {
          return new Intl.DateTimeFormat(locale || undefined, { month: 'short', day: 'numeric' }).format(date);
        } catch {
          return date.toLocaleDateString();
        }
      }
    }
  );
}
