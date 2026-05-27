import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  state = signal<'verifying' | 'success' | 'error' | 'canceled'>('verifying');
  message = signal('');
  details = signal<any>(null);
  countdown = signal(5);
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    const sessionId     = params['session_id'];
    const installmentId = params['installment_id'];
    const canceled      = params['canceled'];

    if (canceled) {
      this.state.set('canceled');
      this.startCountdown('/dashboard');
      return;
    }

    if (!sessionId || !installmentId) {
      this.state.set('error');
      this.message.set('Invalid payment session. Please contact support.');
      return;
    }

    // Verify with backend
    this.api.verifyStripeSession(sessionId, Number(installmentId)).subscribe({
      next: (res: any) => {
        this.analytics.trackPayment('success', Number(installmentId), res?.amount);
        this.state.set('success');
        this.details.set(res);
        this.startCountdown('/dashboard');
      },
      error: (err: any) => {
        this.analytics.trackPayment('fail', Number(installmentId));
        this.state.set('error');
        this.message.set(err.error?.message || 'Payment verification failed. Contact support if money was deducted.');
      }
    });
  }

  startCountdown(path: string) {
    this.timer = setInterval(() => {
      this.countdown.update(c => c - 1);
      if (this.countdown() <= 0) {
        clearInterval(this.timer);
        this.router.navigate(['/dashboard'], { queryParams: { tab: 'enrollments' } });
      }
    }, 1000);
  }

  goToDashboard() {
    clearInterval(this.timer);
    this.router.navigate(['/dashboard'], { queryParams: { tab: 'enrollments' } });
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }
}
