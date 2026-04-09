import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="cookie-banner" *ngIf="show()">
  <div class="cb-content">
    <div class="cb-icon">🍪</div>
    <div class="cb-text">
      <strong>We use cookies</strong>
      <span>We use essential cookies for authentication and session management. We also track anonymous usage events to improve our service. No tracking cookies are shared with advertisers.</span>
    </div>
    <div class="cb-actions">
      <button class="cb-accept" (click)="accept()">Accept All</button>
      <button class="cb-essential" (click)="essential()">Essential Only</button>
      <a routerLink="/privacy-policy" class="cb-link">Privacy Policy</a>
    </div>
  </div>
</div>`,
  styles: [`
.cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#1e2d3d;border-top:1px solid rgba(255,255,255,.08);padding:16px 24px;box-shadow:0 -8px 32px rgba(0,0,0,.2)}
.cb-content{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.cb-icon{font-size:1.6rem;flex-shrink:0}
.cb-text{flex:1;min-width:200px;strong{display:block;color:white;font-size:.9rem;margin-bottom:3px}span{font-size:.79rem;color:rgba(255,255,255,.5);line-height:1.5}}
.cb-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;flex-shrink:0}
.cb-accept{background:linear-gradient(135deg,#0d9488,#0369a1);color:white;border:none;padding:8px 20px;border-radius:8px;font-size:.84rem;font-weight:700;cursor:pointer;transition:all .2s;&:hover{transform:translateY(-1px)}}
.cb-essential{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);padding:8px 16px;border-radius:8px;font-size:.84rem;cursor:pointer;transition:all .2s;&:hover{background:rgba(255,255,255,.12)}}
.cb-link{font-size:.78rem;color:#0d9488;text-decoration:none;&:hover{text-decoration:underline}}
  `]
})
export class CookieBannerComponent {
  show = signal(!localStorage.getItem('cookie_consent'));

  accept() {
    localStorage.setItem('cookie_consent', 'all');
    this.show.set(false);
  }
  essential() {
    localStorage.setItem('cookie_consent', 'essential');
    this.show.set(false);
  }
}
