import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { writerGuard } from './core/guards/writer.guard';
import { firstLoginGuard } from './core/guards/first-login.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'services', loadComponent: () => import('./features/services-page/services-page.component').then(m => m.ServicesPageComponent) },
  { path: 'about', loadComponent: () => import('./features/about-page/about-page.component').then(m => m.AboutPageComponent) },
  { path: 'privacy-policy', loadComponent: () => import('./features/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent) },
  { path: 'terms', loadComponent: () => import('./features/terms-conditions/terms-conditions.component').then(m => m.TermsConditionsComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'change-password', canActivate: [authGuard], loadComponent: () => import('./features/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'dashboard', canActivate: [authGuard, firstLoginGuard], loadComponent: () => import('./features/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
  { path: 'admin', canActivate: [authGuard, adminGuard], loadComponent: () => import('./features/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'writer', canActivate: [authGuard, writerGuard], loadComponent: () => import('./features/writer-dashboard/writer-dashboard.component').then(m => m.WriterDashboardComponent) },
  { path: 'payment-success', canActivate: [authGuard], loadComponent: () => import('./features/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent) },
  { path: '**', redirectTo: '' }
];
