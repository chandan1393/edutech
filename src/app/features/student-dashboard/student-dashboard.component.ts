import { Component, OnInit, OnDestroy, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { FeedbackWidgetComponent } from '../../shared/components/feedback-widget/feedback-widget.component';
import { BugReportComponent } from '../../shared/components/bug-report-widget/bug-report-widget.component';
import { LocalDatePipe } from '../../shared/pipes/local-date.pipe';
import { TimezoneService } from '../../core/services/timezone.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusCountPipe } from '../../shared/pipes/status-count.pipe';
import { PaidCountPipe } from '../../shared/pipes/paid-count.pipe';
import { ChatComponent } from '../../shared/components/chat/chat.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StatusCountPipe, PaidCountPipe, ChatComponent, LocalDatePipe, FeedbackWidgetComponent, BugReportComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  activeTab = signal<'overview' | 'enrollments' | 'new' | 'stats' | 'notifications'>('overview');
  enrollments = signal<any[]>([]);
  notifications = signal<any[]>([]);
  profile = signal<any>(null);
  loading = signal(false);
  submitting = signal(false);
  formSuccess = signal('');
  formError = signal('');
  selectedEnrollment = signal<any>(null);
  panelTab = signal<'details' | 'payments' | 'tracker' | 'credentials' | 'chat'>('details');
  enrollmentTasks = signal<any[]>([]);
  uploadingReceiptId = signal<number | null>(null);
  receiptSuccess = signal('');
  private pollInterval: any = null;

  enrollForm: FormGroup;

  constructor(private api: ApiService, public auth: AuthService, private fb: FormBuilder, private zone: NgZone, private route: ActivatedRoute, public tz: TimezoneService, private analytics: AnalyticsService) {
    this.enrollForm = this.fb.group({
      courseName:         ['', [Validators.required, Validators.minLength(3)]],
      institutionName:    ['', Validators.required],
      subject:            ['', Validators.required],
      courseDescription:  ['', [Validators.required, Validators.minLength(20)]],
      classStartDate:     ['', Validators.required],
      classEndDate:       ['', Validators.required],
      portalUrl:          [''],
      portalUsername:     ['', Validators.required],
      portalPassword:     ['', Validators.required],
      studentNotes:       ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
    this.loadEnrollments();
    this.loadNotifications();
    this.loadMyTasks();
    // Handle redirect from payment-success page
    const tab = this.route.snapshot.queryParams['tab'];
    if (tab === 'enrollments') {
      this.activeTab.set('enrollments');
    }
  }
  ngOnDestroy() { if (this.pollInterval) clearInterval(this.pollInterval); }

  loadProfile() { this.api.getProfile().subscribe({ next: (p: any) => this.profile.set(p) }); }

  loadEnrollments() {
    this.loading.set(true);
    this.api.getMyEnrollments().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : [];
        this.enrollments.set(list);
        if (this.selectedEnrollment()) {
          const updated = list.find((e: any) => e.id === this.selectedEnrollment().id);
          if (updated) this.selectedEnrollment.set(updated);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadNotifications() {
    this.api.getNotifications().subscribe({ next: (n: any) => this.notifications.set(Array.isArray(n) ? n : []) });
  }

  selectedDoc: File | null = null;
  onDocSelected(e: Event) { this.selectedDoc = (e.target as HTMLInputElement).files?.[0] || null; }

  submitEnrollment() {
    if (this.enrollForm.invalid) { this.enrollForm.markAllAsTouched(); return; }
    this.submitting.set(true); this.formError.set('');
    const fd = new FormData();
    Object.entries(this.enrollForm.value).forEach(([k, v]) => fd.append(k, (v as any) || ''));
    if (this.selectedDoc) fd.append('document', this.selectedDoc);

    this.api.createEnrollment(fd).subscribe({
      next: (res: any) => {
        this.formSuccess.set('Enrollment submitted! Our team will review and set up your payment plan within 24 hours.');
        this.enrollForm.reset(); this.selectedDoc = null; this.submitting.set(false);
        this.loadEnrollments();
        setTimeout(() => { this.activeTab.set('enrollments'); this.formSuccess.set(''); }, 3000);
      },
      error: (err: any) => { this.formError.set(err.error?.message || 'Failed. Please try again.'); this.submitting.set(false); }
    });
  }

  openEnrollment(e: any) {
    this.selectedEnrollment.set(e);
    this.panelTab.set('details');
    this.receiptSuccess.set('');
    this.enrollmentTasks.set([]);
    this.api.getEnrollmentTasks(e.id).subscribe({ next:(t:any[])=>this.enrollmentTasks.set(Array.isArray(t)?t:[]), error:()=>{} });
  }

  uploadReceipt(installmentId: number, event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingReceiptId.set(installmentId);
    this.receiptSuccess.set('');
    this.api.uploadInstallmentReceipt(installmentId, file).subscribe({
      next: () => {
        this.receiptSuccess.set('Receipt uploaded! Admin will verify within 24 hours.');
        this.uploadingReceiptId.set(null);
        this.loadEnrollments();
      },
      error: (err: any) => { alert(err.error?.message || 'Upload failed.'); this.uploadingReceiptId.set(null); }
    });
  }

  statusLabel(s: string): string { return (s || '').replace(/_/g, ' '); }
  statusClass(s: string): string {
    const m: any = { SUBMITTED:'s-pending', UNDER_REVIEW:'s-reviewing', PAYMENT_PLAN_SENT:'s-plan',
      PARTIALLY_PAID:'s-partial', FULLY_PAID:'s-paid', IN_PROGRESS:'s-progress',
      UNDER_ADMIN_REVIEW:'s-done', DELIVERED:'s-delivered', REVISION_REQUESTED:'s-revision', COMPLETED:'s-closed' };
    return m[s] || 's-pending';
  }
  installmentClass(s: string): string {
    const m: any = { PENDING:'ip-pending', RECEIPT_UPLOADED:'ip-uploaded', CONFIRMED:'ip-confirmed', OVERDUE:'ip-overdue' };
    return m[s] || '';
  }
  unreadCount(): number { return this.notifications().filter((n: any) => !n.read).length; }
  markAllRead() { this.api.markAllNotificationsRead().subscribe({ next: () => this.loadNotifications() }); }
  logout() { this.auth.logout(); }
  payingInstallmentId = signal<number | null>(null);
  payError = signal('');

  /** Pay installment via Stripe Checkout — redirects to Stripe, returns to /payment-success */
  payInstallment(installmentId: number) {
    this.payingInstallmentId.set(installmentId);
    this.payError.set('');
    this.analytics.trackPayment('start', installmentId);
    this.api.createStripeSession(installmentId).subscribe({
      next: (res: any) => {
        // Redirect to Stripe Checkout page
        window.location.href = res.checkoutUrl;
      },
      error: (err: any) => {
        this.payError.set(err.error?.message || 'Could not initiate payment. Please try again.');
        this.payingInstallmentId.set(null);
      }
    });
  }

  canDownload(e: any): boolean { return e?.status === 'DELIVERED' && e?.deliveryZipPath && e?.writerFileApproved; }
  getPendingPayments(): any[] { return this.enrollments().filter((e: any) => e.status === 'PAYMENT_PLAN_SENT' || e.status === 'PARTIALLY_PAID'); }
  getActiveEnrollments(): any[] { return this.enrollments().filter((e: any) => e.status === 'IN_PROGRESS'); }
  getTotalPaid(): number {
    let total = 0;
    this.enrollments().forEach((e: any) => {
      (e.installments || []).filter((i: any) => i.status === 'CONFIRMED').forEach((i: any) => total += i.amount);
    });
    return total;
  }

  // Payment stats helpers
  studentPayFilter = signal<'all'|'1-5'|'5-10'|'10-30'>('all');
  slipDownloadingId = signal<number|null>(null);

  allInstallments(): any[] {
    const all: any[] = [];
    this.enrollments().forEach((e:any) => {
      (e.installments||[]).forEach((i:any) => {
        all.push({...i, courseName: e.courseName, institutionName: e.institutionName });
      });
    });
    return all;
  }

  paidInstallments(): any[] {
    return this.allInstallments().filter((i:any) => i.status === 'CONFIRMED');
  }

 

  getTotalPaidCount(): number { return this.paidInstallments().length; }

  getPendingTotal(): number {
    return this.allInstallments().filter((i:any) => i.status !== 'CONFIRMED')
      .reduce((s:number,i:any) => s + Number(i.amount), 0);
  }

  getDaysUntil(dueDate: string): number {
    const now = new Date(); now.setHours(0,0,0,0);
    const due = new Date(dueDate); due.setHours(0,0,0,0);
    return Math.ceil((due.getTime() - now.getTime()) / 86400000);
  }

  getUpcomingPayments(): any[] {
    const now = new Date(); now.setHours(0,0,0,0);
    const filter = this.studentPayFilter();
    return this.allInstallments()
      .filter((i:any) => {
        if (i.status === 'CONFIRMED') return false;
        const due = new Date(i.dueDate); due.setHours(0,0,0,0);
        const days = Math.ceil((due.getTime() - now.getTime()) / 86400000);
        if (filter === '1-5')  return days >= 0 && days <= 5;
        if (filter === '5-10') return days > 5  && days <= 10;
        if (filter === '10-30')return days > 10 && days <= 30;
        return days >= 0;
      })
      .sort((a:any,b:any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  downloadReceiptByInstallmentId(installmentId: number) {
    this.slipDownloadingId.set(installmentId);
    this.api.downloadPaymentSlip(installmentId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `EduAssist_Receipt_${installmentId}.html`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); window.URL.revokeObjectURL(url);
        this.slipDownloadingId.set(null);
      },
      error: () => this.slipDownloadingId.set(null)
    });
  }

  // ── Tracker ────────────────────────────────────────────────────────────
  myTasks = signal<any[]>([]);
  taskFilter = signal<'all'|'today'|'upcoming'|'overdue'>('upcoming');

  loadMyTasks() {
    this.api.getMyTasks().subscribe({ next: (t:any[]) => this.myTasks.set(Array.isArray(t)?t:[]), error:()=>{} });
  }

  filteredTasks(): any[] {
    const now = new Date(); now.setHours(0,0,0,0);
    const today = now.getTime();
    const tasks = this.myTasks();
    if (this.taskFilter() === 'today')
      return tasks.filter(t => { const d = new Date(t.dueDate); d.setHours(0,0,0,0); return d.getTime() === today; });
    if (this.taskFilter() === 'overdue')
      return tasks.filter(t => t.status !== 'APPROVED' && new Date(t.dueDate).getTime() < today);
    if (this.taskFilter() === 'upcoming')
      return tasks.filter(t => { const d = new Date(t.dueDate); d.setHours(0,0,0,0); return d.getTime() >= today && t.status !== 'APPROVED'; });
    return tasks;
  }

  taskDaysLeft(dueDate: string): number {
    const now = new Date(); now.setHours(0,0,0,0);
    const due = new Date(dueDate); due.setHours(0,0,0,0);
    return Math.ceil((due.getTime() - now.getTime()) / 86400000);
  }

  taskStatusClass(s: string): string {
    return ({PENDING:'tk-pending', UPLOADED:'tk-uploaded', APPROVED:'tk-approved', MISSED:'tk-missed'})[s] || 'tk-pending';
  }

  // ── Credential Change ───────────────────────────────────────────────────
  credForm = signal<any>(null);
  credSuccess = signal('');
  credError = signal('');

  openCredForm(enrollment: any) {
    this.credForm.set({ enrollmentId: enrollment.id, portalUrl: enrollment.portalUrl||'', portalUsername: enrollment.portalUsername||'', portalPassword: enrollment.portalPassword||'' });
  }

  saveCredentials() {
    const f = this.credForm();
    if (!f) return;
    this.credSuccess.set(''); this.credError.set('');
    this.api.updateCredentials(f.enrollmentId, { portalUrl: f.portalUrl, portalUsername: f.portalUsername, portalPassword: f.portalPassword }).subscribe({
      next: () => { this.credSuccess.set('✅ Credentials updated! Writer has been notified.'); this.credForm.set(null); this.loadEnrollments(); setTimeout(()=>this.credSuccess.set(''), 4000); },
      error: (e:any) => this.credError.set(e.error?.message||'Update failed.')
    });
  }

  downloadTaskFile(type: 'writer'|'doc', taskId: number, fileName: string) {
    const obs = type === 'writer' ? this.api.downloadTrackerWriterFile(taskId) : this.api.downloadTrackerDoc(taskId);
    obs.subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = fileName || 'file';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    });
  }

  // ── Shared download helper ─────────────────────────────────────────────
  private triggerDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); window.URL.revokeObjectURL(url);
  }

  downloadSubmissionFile(submissionId: number, fileName: string) {
    this.api.downloadSubmission(submissionId).subscribe({
      next: (blob) => this.triggerDownload(blob, fileName || 'classwork.zip'),
      error: () => alert('Download failed. Please try again.')
    });
  }

  downloadEnrollmentDoc(enrollmentId: number) {
    this.api.downloadEnrollmentDoc(enrollmentId).subscribe({
      next: (blob) => this.triggerDownload(blob, 'reference_doc.pdf'),
      error: () => alert('Document not available.')
    });
  }

  downloadReceiptFile(installmentId: number) {
    this.api.downloadReceipt(installmentId).subscribe({
      next: (blob) => this.triggerDownload(blob, `receipt_${installmentId}.jpg`),
      error: () => alert('Receipt not available.')
    });
  }
}
