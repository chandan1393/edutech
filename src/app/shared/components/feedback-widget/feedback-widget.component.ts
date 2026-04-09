import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-feedback-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="fw-wrap" *ngIf="!submitted()">
  <button class="fw-trigger" (click)="open.set(!open())" [class.active]="open()">
    ⭐ Rate Your Experience
  </button>
  <div class="fw-panel" *ngIf="open()">
    <div class="fw-head"><h4>Your Feedback</h4><button (click)="open.set(false)">✕</button></div>
    <div class="fw-body">
      <div class="fw-stars">
        <button *ngFor="let s of [1,2,3,4,5]" (click)="rating.set(s)"
                [class.active]="rating() >= s" class="fw-star">★</button>
      </div>
      <p class="fw-rating-label">{{ ratingLabel() }}</p>
      <textarea [(ngModel)]="comment" rows="3" placeholder="Tell us about your experience..."></textarea>
      <label class="fw-anon"><input type="checkbox" [(ngModel)]="anonymous" /> Submit anonymously</label>
      <div class="fw-err" *ngIf="error()">{{ error() }}</div>
      <button class="fw-submit" [disabled]="!rating() || submitting()" (click)="submit()">
        {{ submitting() ? 'Submitting...' : 'Submit Feedback' }}
      </button>
    </div>
  </div>
</div>
<div class="fw-success" *ngIf="submitted()">✅ Thank you for your feedback!</div>`,
  styles: [`
.fw-wrap{position:relative;display:inline-block}
.fw-trigger{background:linear-gradient(135deg,#f59e0b,#d97706);color:white;border:none;padding:9px 18px;border-radius:25px;font-size:.83rem;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(245,158,11,.3);transition:all .2s;&:hover{transform:translateY(-1px)}&.active{background:linear-gradient(135deg,#d97706,#b45309)}}
.fw-panel{position:absolute;bottom:calc(100% + 10px);right:0;width:300px;background:white;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.15);border:1.5px solid #e2e8f0;z-index:1000;overflow:hidden}
.fw-head{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #f1f5f9;h4{font-size:.9rem;font-weight:700;color:#0f172a}button{background:none;border:none;color:#94a3b8;cursor:pointer;font-size:1rem;&:hover{color:#0f172a}}}
.fw-body{padding:16px 18px;textarea{width:100%;border:1.5px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:.84rem;color:#0f172a;font-family:inherit;resize:vertical;outline:none;margin-top:12px;&:focus{border-color:#0d9488}}}
.fw-stars{display:flex;gap:4px}.fw-star{background:none;border:none;font-size:1.8rem;cursor:pointer;color:#e2e8f0;transition:color .15s;padding:0;&.active{color:#f59e0b}}
.fw-rating-label{font-size:.78rem;color:#64748b;margin-top:5px;height:14px}
.fw-anon{display:flex;align-items:center;gap:7px;font-size:.79rem;color:#64748b;margin-top:10px;cursor:pointer}
.fw-err{font-size:.78rem;color:#e11d48;margin-top:8px}
.fw-submit{width:100%;background:linear-gradient(135deg,#0d9488,#0369a1);color:white;border:none;padding:10px;border-radius:9px;font-weight:700;font-size:.87rem;cursor:pointer;margin-top:12px;transition:all .2s;&:hover{transform:translateY(-1px)}&:disabled{opacity:.6;cursor:not-allowed;transform:none}}
.fw-success{font-size:.83rem;color:#0d9488;font-weight:600;padding:8px 14px;background:#f0fdf9;border:1.5px solid #ccfbf1;border-radius:10px}
  `]
})
export class FeedbackWidgetComponent {
  @Input() enrollmentId?: number;
  open = signal(false);
  rating = signal(0);
  comment = ''; anonymous = false;
  submitting = signal(false); submitted = signal(false); error = signal('');

  ratingLabel(): string {
    return ['','😞 Poor','😐 Fair','🙂 Good','😊 Great','🤩 Excellent!'][this.rating()] || '';
  }

  constructor(private api: ApiService) {}

  submit() {
    if (!this.rating()) { this.error.set('Please select a rating.'); return; }
    this.submitting.set(true); this.error.set('');
    this.api.submitFeedback({ rating: this.rating(), comment: this.comment, anonymous: this.anonymous, enrollmentId: this.enrollmentId }).subscribe({
      next: () => { this.submitted.set(true); },
      error: (e: any) => { this.error.set(e.error?.message || 'Failed.'); this.submitting.set(false); }
    });
  }
}
