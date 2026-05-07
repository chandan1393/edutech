import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading  = signal(false);
  error    = signal('');
  success  = signal(false);
  showCurr = signal(false);
  showNew  = signal(false);
  showConf = signal(false);
  isFirstLogin: boolean;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.isFirstLogin = this.auth.currentUser()?.firstLogin ?? true;
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword:     ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.matchPasswords });
  }

  // Custom validators
  private passwordStrengthValidator(c: AbstractControl) {
    const v = c.value || '';
    if (!v) return null;
    const hasUpper  = /[A-Z]/.test(v);
    const hasLower  = /[a-z]/.test(v);
    const hasNumber = /\d/.test(v);
    const hasMin    = v.length >= 8;
    if (!hasMin || !hasUpper || !hasLower || !hasNumber)
      return { weakPassword: true };
    return null;
  }

  private matchPasswords(g: AbstractControl) {
    const np = g.get('newPassword')?.value;
    const cp = g.get('confirmPassword')?.value;
    return np && cp && np !== cp ? { mismatch: true } : null;
  }

  // Password strength display
  get newPwd(): string { return this.form.get('newPassword')?.value || ''; }
  get hasMin()   { return this.newPwd.length >= 8; }
  get hasUpper() { return /[A-Z]/.test(this.newPwd); }
  get hasLower() { return /[a-z]/.test(this.newPwd); }
  get hasNum()   { return /\d/.test(this.newPwd); }
  get strength(): number {
    let s = 0;
    if (this.hasMin)   s++;
    if (this.hasUpper) s++;
    if (this.hasLower) s++;
    if (this.hasNum)   s++;
    return s;
  }
  get strengthLabel(): string { return ['','Weak','Fair','Good','Strong'][this.strength] || ''; }

  passwordsMismatch(): boolean {
    return !!(this.form.get('confirmPassword')?.touched && this.form.hasError('mismatch'));
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading.set(true); this.error.set('');
    this.auth.changePassword(
      this.form.value.currentPassword,
      this.form.value.newPassword
    ).subscribe({
      next: () => { this.success.set(true); this.loading.set(false); },
      error: (e: any) => {
        this.error.set(e.error?.message || 'Failed to change password. Check your current password.');
        this.loading.set(false);
      }
    });
  }

  goToDashboard() {
    const role = this.auth.currentUser()?.role;
    if (role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
    else if (role === 'ROLE_WRITER') this.router.navigate(['/writer']);
    else this.router.navigate(['/dashboard']);
  }
}
