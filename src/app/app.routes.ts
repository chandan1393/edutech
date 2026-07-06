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
  { path: 'blog', loadComponent: () => import('./features/blog/blog-list.component').then(m => m.BlogListComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./features/blog/blog-detail.component').then(m => m.BlogDetailComponent) },
  { path: 'payment-success', canActivate: [authGuard], loadComponent: () => import('./features/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent) },
  { path: 'pay-someone-to-do-my-online-class', loadComponent: () => import('./features/seo-pages/pillar.component').then(m => m.PillarComponent) },
  { path: 'online-class-help',    data: { slug: 'online-class-help' },    loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'assignment-help',      data: { slug: 'assignment-help' },      loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'homework-help',        data: { slug: 'homework-help' },        loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'exam-help',            data: { slug: 'exam-help' },            loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'quiz-help',            data: { slug: 'quiz-help' },            loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'discussion-post-help', data: { slug: 'discussion-post-help' }, loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'essay-writing-help',   data: { slug: 'essay-writing-help' },   loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'take-my-online-class', data: { slug: 'take-my-online-class' }, loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'online-course-help',   data: { slug: 'online-course-help' },   loadComponent: () => import('./features/seo-pages/service-page.component').then(m => m.ServicePageComponent) },
  { path: 'how-it-works', loadComponent: () => import('./features/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent) },
  { path: 'reviews', loadComponent: () => import('./features/reviews-page/reviews-page.component').then(m => m.ReviewsPageComponent) },
  { path: 'faq', loadComponent: () => import('./features/faq-page/faq-page.component').then(m => m.FaqPageComponent) },
  { path: 'refund-policy', loadComponent: () => import('./features/refund-policy/refund-policy.component').then(m => m.RefundPolicyComponent) },
  { path: 'academic-integrity', loadComponent: () => import('./features/academic-integrity/academic-integrity.component').then(m => m.AcademicIntegrityComponent) },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
