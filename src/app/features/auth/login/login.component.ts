import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading  = signal(false);
  error    = signal('');
  showPass = signal(false);
  private returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // If already logged in:
    //   - firstLogin=true  → must change password first
    //   - firstLogin=false → go to their dashboard (normal returning user)
    if (this.auth.isLoggedIn()) {
      if (this.auth.isFirstLogin()) {
        this.router.navigate(['/change-password']);
      } else {
        this.redirectByRole(this.auth.currentUser()?.role || '');
      }
      return;
    }
    // Capture return URL (e.g. from payment-success redirect)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  login() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true); this.error.set('');
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: (res) => {
        if (res.firstLogin) {
          this.router.navigate(['/change-password']);
        } else if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.redirectByRole(res.role);
        }
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Invalid email or password.');
        this.loading.set(false);
      }
    });
  }

  private redirectByRole(role: string) {
    if (role === 'ROLE_ADMIN')  this.router.navigate(['/admin']);
    else if (role === 'ROLE_WRITER') this.router.navigate(['/writer']);
    else this.router.navigate(['/dashboard']);
  }
}
