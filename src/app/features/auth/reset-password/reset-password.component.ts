import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<div class="auth-page">
  <div class="auth-card">
    <div class="auth-header"><div class="auth-icon">🔑</div><h2>Reset Password</h2><p>Enter your new password below.</p></div>
    <div *ngIf="error()" class="alert alert-error">{{ error() }}</div>
    <div *ngIf="success()" class="alert alert-success">{{ success() }} <a routerLink="/login">Go to Login →</a></div>
    <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!success()">
      <div class="form-group"><label>New Password</label><input type="password" formControlName="newPassword" placeholder="Min. 8 characters" /></div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" formControlName="confirmPassword" placeholder="Repeat password" />
        <span class="field-error" *ngIf="mismatch()">Passwords do not match</span>
      </div>
      <button type="submit" class="btn-submit" [disabled]="loading()">{{ loading() ? 'Resetting...' : 'Reset Password' }}</button>
    </form>
  </div>
</div>`,
  styleUrls: ['../change-password/change-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = signal(false); error = signal(''); success = signal('');
  private token = '';
  constructor(private fb: FormBuilder, private auth: AuthService, private route: ActivatedRoute) {
    this.form = this.fb.group({ newPassword: ['', [Validators.required, Validators.minLength(8)]], confirmPassword: ['', Validators.required] });
  }
  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) this.error.set('Invalid reset link. Please request a new one.');
  }
  mismatch(): boolean { return this.form.get('confirmPassword')?.touched === true && this.form.get('newPassword')?.value !== this.form.get('confirmPassword')?.value; }
  submit() {
    if (this.form.invalid || this.mismatch() || !this.token) return;
    this.loading.set(true);
    this.auth.resetPassword(this.token, this.form.value.newPassword).subscribe({
      next: () => { this.success.set('Password reset successfully!'); this.loading.set(false); },
      error: (err: any) => { this.error.set(err.error?.message || 'Failed. Link may be expired.'); this.loading.set(false); }
    });
  }
}
