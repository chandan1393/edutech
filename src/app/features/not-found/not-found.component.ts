import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="nf" role="main">
      <div class="nf-inner">
        <div class="nf-badge">404 · Page Not Found</div>
        <h1 class="nf-code">404</h1>
        <h2 class="nf-title">This page took an unscheduled day off</h2>
        <p class="nf-sub">
          The page you're looking for doesn't exist or may have moved. Let's get you
          back on track — your online class help is just a click away.
        </p>
        <div class="nf-actions">
          <a routerLink="/" class="nf-btn nf-btn-primary">← Back to Home</a>
          <a routerLink="/pay-someone-to-do-my-online-class" class="nf-btn nf-btn-ghost">Get a Free Quote</a>
        </div>
        <nav class="nf-links" aria-label="Helpful links">
          <a routerLink="/how-it-works">How It Works</a>
          <a routerLink="/reviews">Reviews</a>
          <a routerLink="/faq">FAQ</a>
          <a routerLink="/blog">Blog</a>
        </nav>
      </div>
    </main>
  `,
  styles: [`
    .nf{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 24px;
      background:radial-gradient(900px 480px at 80% -10%,rgba(13,148,136,.12),transparent 60%),radial-gradient(760px 460px at 0% 110%,rgba(59,130,246,.12),transparent 60%),linear-gradient(180deg,#fbfdff,#eef4ff);font-family:'DM Sans',system-ui,sans-serif}
    .nf-inner{max-width:600px;text-align:center}
    .nf-badge{display:inline-flex;align-items:center;gap:7px;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:#1e3a8a;background:#eff6ff;border:1px solid #dbeafe;padding:6px 15px;border-radius:30px;margin-bottom:24px}
    .nf-code{font-family:'Playfair Display',serif;font-size:clamp(4.5rem,14vw,8rem);font-weight:800;line-height:1;letter-spacing:-.04em;margin:0 0 8px;background:linear-gradient(115deg,#1e3a8a,#1d4ed8,#0d9488);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .nf-title{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,3vw,2rem);font-weight:700;color:#0f172a;letter-spacing:-.02em;margin:0 0 14px}
    .nf-sub{font-size:1rem;color:#64748b;line-height:1.75;margin:0 auto 32px;max-width:480px}
    .nf-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:36px}
    .nf-btn{padding:13px 26px;border-radius:11px;font-size:.95rem;font-weight:700;text-decoration:none;transition:all .25s cubic-bezier(.22,1,.36,1);display:inline-flex;align-items:center}
    .nf-btn-primary{background:linear-gradient(135deg,#1d4ed8,#1e3a8a);color:#fff;box-shadow:0 8px 24px -8px rgba(30,58,138,.6);&:hover{transform:translateY(-2px);box-shadow:0 14px 34px -8px rgba(30,58,138,.7)}}
    .nf-btn-ghost{background:#fff;border:1.5px solid #e2e8f0;color:#334155;&:hover{border-color:#3b82f6;color:#1e3a8a;transform:translateY(-1px)}}
    .nf-links{display:flex;gap:8px 24px;justify-content:center;flex-wrap:wrap;padding-top:28px;border-top:1px solid #e2e8f0;a{color:#64748b;font-size:.9rem;font-weight:600;text-decoration:none;transition:color .15s;&:hover{color:#1e3a8a}}}
  `]
})
export class NotFoundComponent {}
