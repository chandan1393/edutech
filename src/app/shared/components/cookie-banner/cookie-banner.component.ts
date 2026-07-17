import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketingTagsService } from '../../../core/services/marketing-tags.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="cb" *ngIf="show()" [class.visible]="shown()">
  <div class="cb-inner">
    <span class="cb-icon">🍪</span>
    <p>We use analytics cookies to understand how visitors use our site. Essential functionality never uses cookies.
       <a routerLink="/privacy-policy">Privacy Policy</a>
    </p>
    <div class="cb-btns">
      <button class="cb-accept" (click)="accept()">Accept All</button>
      <button class="cb-ess" (click)="essential()">Essential Only</button>
    </div>
    <button class="cb-close" (click)="essential()" aria-label="Close">✕</button>
  </div>
</div>`,
  styles: [`
.cb {
  position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(20px);
  z-index:9999;width:calc(100% - 40px);max-width:700px;
  opacity:0;transition:all .4s cubic-bezier(.22,.61,.36,1);pointer-events:none;
  &.visible{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}
}
.cb-inner {
  display:flex;align-items:center;gap:12px;flex-wrap:wrap;
  background:rgba(5,9,22,.95);backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,.1);border-radius:14px;
  padding:14px 18px;box-shadow:0 20px 50px rgba(0,0,0,.4);
}
.cb-icon{font-size:1.2rem;flex-shrink:0}
p{flex:1;font-size:.8rem;color:rgba(255,255,255,.55);line-height:1.55;margin:0;
  a{color:#2563eb;text-decoration:none;&:hover{text-decoration:underline}}}
.cb-btns{display:flex;gap:8px;flex-shrink:0}
.cb-accept{background:#2563eb;color:white;border:none;padding:7px 16px;border-radius:8px;font-size:.8rem;font-weight:700;cursor:pointer;white-space:nowrap;&:hover{background:#0F4C81}}
.cb-ess{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.6);padding:7px 14px;border-radius:8px;font-size:.8rem;cursor:pointer;white-space:nowrap;&:hover{background:rgba(255,255,255,.1)}}
.cb-close{background:none;border:none;color:rgba(255,255,255,.25);cursor:pointer;font-size:.9rem;padding:4px;flex-shrink:0;&:hover{color:rgba(255,255,255,.6)}}
@media(max-width:560px){.cb-inner{flex-direction:column;align-items:flex-start}.cb-btns{align-self:stretch}.cb-accept,.cb-ess{flex:1;text-align:center}}
  `]
})
export class CookieBannerComponent {
  /**
   * Only prompt when a third-party tag that actually sets cookies is configured.
   * With no tags configured this site sets no cookies at all (auth uses
   * localStorage, which is exempt as strictly necessary), so showing a consent
   * banner would be both inaccurate and needless friction.
   */
  show  = signal(false);
  shown = signal(false);

  constructor(private tags: MarketingTagsService) {
    const needsConsent = this.tags.hasCookieSettingTags && !localStorage.getItem('cookie_consent');
    this.show.set(needsConsent);
    if (needsConsent) setTimeout(() => this.shown.set(true), 1200);
  }

  accept()    { localStorage.setItem('cookie_consent','all');       this.dismiss(); }
  essential() { localStorage.setItem('cookie_consent','essential'); this.dismiss(); }

  private dismiss() {
    this.shown.set(false);
    setTimeout(() => this.show.set(false), 400);
  }
}
