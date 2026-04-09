import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PhoneInputComponent } from '../../../shared/components/phone-input/phone-input.component';
import { Country } from '../../../core/services/country.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PhoneInputComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading   = signal(false);
  error     = signal('');
  success   = signal(false);
  phoneData = { dial: '+1', phone: '', full: '', valid: true };
  phoneTouched = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.form = this.fb.group({
      fullName:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80), Validators.pattern(/^[a-zA-Z\s'\-\.]+$/)]],
      email:     ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      password:  ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), this.strengthValidator]],
      confirm:   ['', Validators.required],
    }, { validators: this.matchPasswords });
  }

  private strengthValidator(c: AbstractControl) {
    const v = c.value || '';
    const ok = v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
    return ok ? null : { weak: true };
  }
  private matchPasswords(g: AbstractControl) {
    const p = g.get('password')?.value, c = g.get('confirm')?.value;
    return p && c && p !== c ? { mismatch: true } : null;
  }

  onPhone(e: { dial:string; phone:string; full:string; country:Country; valid:boolean }) {
    this.phoneData = e;
  }

  // Password strength helpers
  get pwd() { return this.form.get('password')?.value || ''; }
  get hasMin()   { return this.pwd.length >= 8; }
  get hasUpper() { return /[A-Z]/.test(this.pwd); }
  get hasLower() { return /[a-z]/.test(this.pwd); }
  get hasNum()   { return /\d/.test(this.pwd); }
  get strength() { return [this.hasMin, this.hasUpper, this.hasLower, this.hasNum].filter(Boolean).length; }
  get strengthLabel() { return ['','Weak 🔴','Fair 🟡','Good 🔵','Strong 🟢'][this.strength]; }
  get strengthClass() { return ['','s1','s2','s3','s4'][this.strength]; }

  e(f: string) { return this.form.get(f); }
  err(f: string, type: string) { return this.e(f)?.touched && this.e(f)?.hasError(type); }

  submit() {
    this.form.markAllAsTouched();
    this.phoneTouched = true;
    if (this.form.invalid) { this.error.set('Please fix all errors before submitting.'); return; }
    if (this.phoneData.phone && !this.phoneData.valid) { this.error.set('Please enter a valid phone number.'); return; }
    this.loading.set(true); this.error.set('');
    this.api.registerStudent({
      fullName: this.form.value.fullName.trim(),
      email:    this.form.value.email.trim().toLowerCase(),
      password: this.form.value.password,
      phone:    this.phoneData.full || '',
    }).subscribe({
      next: () => { this.success.set(true); this.loading.set(false); setTimeout(() => this.router.navigate(['/login']), 3000); },
      error: (e: any) => { this.error.set(e.error?.message || 'Registration failed. This email may already be registered.'); this.loading.set(false); }
    });
  }
}
