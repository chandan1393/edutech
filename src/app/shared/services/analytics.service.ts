import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private base = environment.apiUrl;
  private sessionId = this.getOrCreateSession();

  constructor(private http: HttpClient, private router: Router) {}

  init() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.track('page_view', e.urlAfterRedirects);
    });
  }

  track(eventType: string, page = '', element = '', metadata: Record<string, any> = {}) {
    this.http.post(`${this.base}/events/track`, {
      sessionId: this.sessionId, eventType, page, element,
      metadata: JSON.stringify(metadata), browserInfo: navigator.userAgent
    }).subscribe({ error: () => {} });
  }

  trackPayment(stage: 'start'|'success'|'fail', installmentId: number, amount?: number) {
    this.track('payment_' + stage, window.location.pathname, 'payment_btn', { installmentId, amount });
  }

  private getOrCreateSession(): string {
    let s = sessionStorage.getItem('ea_session');
    if (!s) { s = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2); sessionStorage.setItem('ea_session', s); }
    return s;
  }
}
