import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

declare global {
  interface Window { dataLayer: any[]; gtag: (...args: any[]) => void; clarity: any; }
}

/**
 * Modular, configurable analytics.
 * - Loads Google Analytics 4 only if environment.gaMeasurementId is set.
 * - Loads Microsoft Clarity only if environment.clarityProjectId is set.
 * - Tracks SPA route changes as page views.
 * No IDs configured = nothing loads (zero performance cost).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private gaId = (environment as any).gaMeasurementId as string;
  private clarityId = (environment as any).clarityProjectId as string;
  private started = false;

  constructor(private router: Router) {}

  init() {
    if (this.started) return;
    this.started = true;
    if (this.gaId) this.loadGA();
    if (this.clarityId) this.loadClarity();

    // Track SPA navigation as page views
    if (this.gaId) {
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          window.gtag?.('event', 'page_view', {
            page_path: e.urlAfterRedirects,
            page_location: window.location.href,
            page_title: document.title,
          });
        });
    }
  }

  /** Track a custom event (e.g. quote_request, contact_submit). */
  event(name: string, params: Record<string, any> = {}) {
    if (this.gaId) window.gtag?.('event', name, params);
  }

  private loadGA() {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', this.gaId, { send_page_view: false });
  }

  private loadClarity() {
    (function (c: any, l: any, a: any, r: any, i: any) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      const t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', this.clarityId);
  }
}
