import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-bug-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="br-wrap">
  <button class="br-trigger" (click)="open.set(!open())">🐛 Report Bug</button>
  <div class="br-panel" *ngIf="open()">
    <div class="br-head"><h4>🐛 Report a Bug</h4><button (click)="open.set(false)">✕</button></div>
    <div class="br-body" *ngIf="!submitted()">
      <div class="br-row">
        <div class="brf"><label>Category</label>
          <select [(ngModel)]="form.category">
            <option value="ui">UI / Display</option><option value="payment">Payment</option>
            <option value="login">Login / Auth</option><option value="tracker">Tracker</option>
            <option value="upload">File Upload</option><option value="other">Other</option>
          </select></div>
        <div class="brf"><label>Severity</label>
          <select [(ngModel)]="form.severity">
            <option value="LOW">Low</option><option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option><option value="CRITICAL">Critical</option>
          </select></div>
      </div>
      <div class="brf"><label>Title *</label><input type="text" [(ngModel)]="form.title" placeholder="Brief description of the bug" /></div>
      <div class="brf"><label>What happened? *</label><textarea [(ngModel)]="form.description" rows="3" placeholder="Describe the bug, steps to reproduce, expected vs actual behavior..."></textarea></div>
      <div class="br-err" *ngIf="error()">{{ error() }}</div>
      <button class="br-submit" [disabled]="submitting()" (click)="submit()">
        {{ submitting() ? 'Sending...' : 'Submit Report' }}
      </button>
    </div>
    <div class="br-success" *ngIf="submitted()">✅ Bug report submitted! We'll look into it. Thank you!</div>
  </div>
</div>`,
  styles: [`
.br-wrap{position:relative;display:inline-block}
.br-trigger{background:rgba(239,68,68,.1);border:1.5px solid rgba(239,68,68,.25);color:#e11d48;padding:7px 14px;border-radius:20px;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .2s;&:hover{background:rgba(239,68,68,.15)}}
.br-panel{position:absolute;bottom:calc(100% + 10px);right:0;width:340px;background:white;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.15);border:1.5px solid #e2e8f0;z-index:1000;overflow:hidden}
.br-head{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #f1f5f9;h4{font-size:.9rem;font-weight:700;color:#0f172a}button{background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1rem;&:hover{color:#0f172a}}}
.br-body{padding:16px 18px;display:flex;flex-direction:column;gap:10px}
.br-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.brf{display:flex;flex-direction:column;gap:4px;label{font-size:.71rem;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:.04em}input,select,textarea{background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:8px;padding:8px 11px;font-size:.84rem;color:#0f172a;font-family:inherit;outline:none;width:100%;resize:none;transition:border-color .15s;&:focus{border-color:#0d9488}}}
.br-err{font-size:.78rem;color:#e11d48}
.br-submit{background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border:none;padding:10px;border-radius:9px;font-weight:700;font-size:.87rem;cursor:pointer;transition:all .2s;&:hover{transform:translateY(-1px)}&:disabled{opacity:.6;cursor:not-allowed;transform:none}}
.br-success{padding:16px 18px;font-size:.85rem;color:#0d9488;font-weight:500;line-height:1.6}
  `]
})
export class BugReportComponent {
  open = signal(false);
  submitting = signal(false); submitted = signal(false); error = signal('');
  form = { title:'', description:'', category:'ui', severity:'MEDIUM' };

  constructor(private api: ApiService) {}

  submit() {
    if (!this.form.title.trim()) { this.error.set('Title is required.'); return; }
    if (!this.form.description.trim() || this.form.description.length < 10) { this.error.set('Please describe the bug (min 10 chars).'); return; }
    this.submitting.set(true); this.error.set('');
    this.api.submitBugReport({ ...this.form, pageUrl: window.location.href, browserInfo: navigator.userAgent }).subscribe({
      next: () => { this.submitted.set(true); this.submitting.set(false); },
      error: (e: any) => { this.error.set(e.error?.message || 'Failed.'); this.submitting.set(false); }
    });
  }
}
