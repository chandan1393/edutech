import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PhoneInputComponent } from '../../shared/components/phone-input/phone-input.component';
import { LocalDatePipe } from '../../shared/pipes/local-date.pipe';
import { TimezoneService } from '../../core/services/timezone.service';
import { AuthService } from '../../core/services/auth.service';
import { AdminBlogComponent } from './admin-blog.component';
import { ChatComponent } from '../../shared/components/chat/chat.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminBlogComponent, ReactiveFormsModule, FormsModule, ChatComponent, LocalDatePipe, PhoneInputComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  activeTab = signal<'overview'|'enrollments'|'students'|'queries'|'writers'|'create-user'|'payments'|'stats'|'feedback'|'bugs'|'analytics'|'blogs'>('overview');
  enrollStats = signal<any>({});
  enrollments = signal<any[]>([]);
  students    = signal<any[]>([]);
  queries     = signal<any[]>([]);
  writers     = signal<any[]>([]);

  selEnrollment  = signal<any>(null);
  enrollPanelTab = signal<'info'|'plan'|'tracker'|'invite'|'chat'>('info');

  // Installment form rows
  installmentDrafts: any[] = [{ amount: '', dueDate: '', notes: '' }];

  // Validation signals
  planValidation = signal('');
  planSuccess    = signal('');

  selQuery      = signal<any>(null);
  cuSuccess     = signal(''); cuError   = signal('');
  writerSuccess = signal(''); writerError = signal('');
  replyForm: FormGroup; cuForm: FormGroup; writerForm: FormGroup;
  enrollUpdateForm: FormGroup;
  enrollUpdateError  = signal(''); updateSuccess = signal('');
  assignWriterSuccess = signal(''); assignWriterError = signal('');

  // Payment filter
  paymentFilter = signal<'1-5'|'5-10'|'10-30'|'all'>('all');

  enrollStatusOptions = ['SUBMITTED','UNDER_REVIEW','PAYMENT_PLAN_SENT','PARTIALLY_PAID','FULLY_PAID','IN_PROGRESS','UNDER_ADMIN_REVIEW','DELIVERED','REVISION_REQUESTED','COMPLETED'];

  constructor(private api: ApiService, public auth: AuthService, private fb: FormBuilder) {
    this.cuForm = this.fb.group({
      fullName: ['', Validators.required], email: ['', [Validators.required, Validators.email]],
      phone: [''], role: ['ROLE_STUDENT', Validators.required]
    });
    this.replyForm   = this.fb.group({ reply: ['', Validators.required] });
    this.writerForm  = this.fb.group({
      fullName: ['', Validators.required], email: ['', [Validators.required, Validators.email]],
      phone: [''], bio: [''], expertise: ['']
    });
    this.enrollUpdateForm = this.fb.group({
      status: [''], adminReply: [''], adminNotes: [''], totalPrice: [null]
    });
  }

  ngOnInit() { this.loadAll(); this.loadMyTasks(); }

  loadAll() {
    this.api.getEnrollmentStats().subscribe({ next: (s:any) => this.enrollStats.set(s), error:()=>{} });
    this.api.getAllEnrollments().subscribe({
      next: (r:any) => {
        // Backend returns Spring Page: { content: [...], totalElements: N }
        // Handle both Page response and plain array fallback
        const list = Array.isArray(r) ? r : (r?.content || []);
        this.enrollments.set(list);
      },
      error: (e:any) => {
        console.error('Failed to load enrollments:', e);
        this.enrollments.set([]);
      }
    });
    this.api.getAllStudents().subscribe({ next: (s:any) => this.students.set(Array.isArray(s)?s:[]) });
    this.api.getAllQueries().subscribe({ next: (r:any) => this.queries.set(Array.isArray(r) ? r : (r?.content || [])) });
    this.api.getAllWriters().subscribe({ next: (w:any) => this.writers.set(Array.isArray(w)?w:[]) });
  }

  // ── Enrollment ──────────────────────────────────────────────────────────
  openEnrollment(e: any) {
    this.selEnrollment.set(e);
    this.enrollPanelTab.set('info');
    this.enrollUpdateForm.patchValue({ status: e.status, adminReply: e.adminReply, adminNotes: e.adminNotes, totalPrice: e.totalPrice });
    this.enrollUpdateError.set(''); this.updateSuccess.set('');
    this.assignWriterError.set(''); this.assignWriterSuccess.set('');
    this.planValidation.set(''); this.planSuccess.set('');
    this.submissionSuccess.set(''); this.submissionError.set('');
    this.loadSubmissions(e.id);
    this.loadEnrollmentTasks(e.id);
    this.loadInvitations(e.id);
    // Load existing installments into draft form
    if (e.installments?.length > 0) {
      this.installmentDrafts = e.installments.map((i:any) => ({
        id: i.id, amount: i.amount, dueDate: i.dueDate, notes: i.notes || '',
        status: i.status, confirmed: i.status === 'CONFIRMED'
      }));
    } else {
      this.installmentDrafts = [{ amount: '', dueDate: '', notes: '' }];
    }
  }

  // MERGED save: validates total, saves plan + updates enrollment in one click
  saveAll() {
    this.planValidation.set(''); this.planSuccess.set(''); this.enrollUpdateError.set('');
    const totalPrice = Number(this.enrollUpdateForm.value.totalPrice) || 0;
    const validRows  = this.installmentDrafts.filter(r => r.amount && r.dueDate);

    // ── Validation ──
    if (validRows.length === 0) { this.planValidation.set('Add at least one installment.'); return; }
    for (const r of validRows) {
      if (!r.amount || Number(r.amount) <= 0) { this.planValidation.set('All installment amounts must be > 0.'); return; }
      if (!r.dueDate) { this.planValidation.set('All installments must have a due date.'); return; }
    }
    const installmentTotal = validRows.reduce((s:number, r:any) => s + Number(r.amount), 0);
    if (totalPrice > 0 && Math.abs(installmentTotal - totalPrice) > 0.01) {
      this.planValidation.set(`Installment total ($${installmentTotal.toFixed(2)}) must equal total price ($${totalPrice.toFixed(2)}).`);
      return;
    }
    // Don't allow deleting confirmed rows
    const existingIds   = (this.selEnrollment()?.installments||[]).map((i:any)=>i.id);
    const confirmedIds  = (this.selEnrollment()?.installments||[]).filter((i:any)=>i.status==='CONFIRMED').map((i:any)=>i.id);
    const draftIds      = this.installmentDrafts.filter(r=>r.id).map(r=>r.id);
    const removed       = confirmedIds.filter((id:any) => !draftIds.includes(id));
    if (removed.length > 0) { this.planValidation.set('Cannot remove installments that have already been paid.'); return; }

    // ── Save plan ──
    this.api.createInstallments(this.selEnrollment().id, validRows).subscribe({
      next: () => {
        // ── Also update enrollment status/price/reply ──
        this.api.updateEnrollment(this.selEnrollment().id, this.enrollUpdateForm.value).subscribe({
          next: (u:any) => {
            this.planSuccess.set('✅ Payment plan saved and student notified!');
            this.updateSuccess.set('');
            this.enrollments.update(list => list.map(e => e.id === u.id ? u : e));
            this.selEnrollment.set(u);
            // Re-open so installment drafts refresh
            this.api.getAllEnrollments().subscribe({ next: (r:any) => {
              this.enrollments.set(Array.isArray(r) ? r : (r?.content || []));
              const updated = (Array.isArray(r) ? r : (r?.content || [])).find((e:any) => e.id === this.selEnrollment()?.id);
              if (updated) this.openEnrollment(updated);
            }});
            setTimeout(() => this.planSuccess.set(''), 5000);
          },
          error: (err:any) => this.enrollUpdateError.set(err.error?.message||'Update failed.')
        });
      },
      error: (err:any) => this.planValidation.set(err.error?.message||'Failed to save plan.')
    });
  }

  addInstallmentRow() {
    this.installmentDrafts = [...this.installmentDrafts, { amount: '', dueDate: '', notes: '' }];
  }

  removeInstallmentRow(i: number) {
    const row = this.installmentDrafts[i];
    if (row.confirmed) { this.planValidation.set('Cannot remove a confirmed (paid) installment.'); return; }
    this.installmentDrafts = this.installmentDrafts.filter((_,idx) => idx !== i);
    this.planValidation.set('');
  }

  confirmInstallmentPayment(installmentId: number) {
    this.api.confirmInstallment(installmentId).subscribe({
      next: () => this.api.getAllEnrollments().subscribe({ next: (r:any) => {
        this.enrollments.set(Array.isArray(r) ? r : (r?.content || []));
        const updated = (Array.isArray(r) ? r : (r?.content || [])).find((e:any) => e.id === this.selEnrollment()?.id);
        if (updated) this.openEnrollment(updated);
      }})
    });
  }

  assignEnrollmentWriter(writerUserId: number) {
    if (!this.selEnrollment()) return;
    this.assignWriterError.set(''); this.assignWriterSuccess.set('');
    this.api.assignEnrollmentWriter(this.selEnrollment().id, writerUserId).subscribe({
      next: () => {
        this.assignWriterSuccess.set('Writer assigned! Both writer and student have been notified.');
        this.api.getAllEnrollments().subscribe({ next: (r:any) => {
          this.enrollments.set(Array.isArray(r) ? r : (r?.content || []));
          const updated = (Array.isArray(r) ? r : (r?.content || [])).find((e:any) => e.id === this.selEnrollment()?.id);
          if (updated) this.selEnrollment.set(updated);
        }});
      },
      error: (err:any) => this.assignWriterError.set(err.error?.message||'Failed.')
    });
  }

  approveEnrollmentZip() {
    if (!this.selEnrollment()) return;
    this.api.approveEnrollmentZip(this.selEnrollment().id).subscribe({
      next: () => {
        this.updateSuccess.set('✅ Approved! Student can download now.');
        this.api.getAllEnrollments().subscribe({ next: (r:any) => {
          this.enrollments.set(Array.isArray(r) ? r : (r?.content || []));
          const updated = (Array.isArray(r) ? r : (r?.content || [])).find((e:any) => e.id === this.selEnrollment()?.id);
          if (updated) this.selEnrollment.set(updated);
        }});
      }
    });
  }

  // ── Payment stats helpers ────────────────────────────────────────────────
  getAllInstallments(): any[] {
    const all: any[] = [];
    this.enrollments().forEach(e => {
      (e.installments||[]).forEach((i:any) => {
        all.push({ ...i, courseName: e.courseName, studentName: e.studentName, enrollmentId: e.id });
      });
    });
    return all;
  }

  getUpcomingInstallments(): any[] {
    const now   = new Date(); now.setHours(0,0,0,0);
    const filter = this.paymentFilter();
    return this.getAllInstallments()
      .filter((i:any) => {
        if (i.status === 'CONFIRMED') return false;
        const due = new Date(i.dueDate); due.setHours(0,0,0,0);
        const days = Math.ceil((due.getTime() - now.getTime()) / 86400000);
        if (filter === '1-5')  return days >= 0 && days <= 5;
        if (filter === '5-10') return days > 5  && days <= 10;
        if (filter === '10-30')return days > 10 && days <= 30;
        return days >= 0; // all upcoming
      })
      .sort((a:any,b:any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  getDaysUntilDue(dueDate: string): number {
    const now = new Date(); now.setHours(0,0,0,0);
    const due = new Date(dueDate); due.setHours(0,0,0,0);
    return Math.ceil((due.getTime() - now.getTime()) / 86400000);
  }

  getTotalRevenue(): number {
    return this.getAllInstallments().filter(i=>i.status==='CONFIRMED').reduce((s:number,i:any)=>s+Number(i.amount),0);
  }

  getPendingRevenue(): number {
    return this.getAllInstallments().filter(i=>i.status!=='CONFIRMED').reduce((s:number,i:any)=>s+Number(i.amount),0);
  }

  // ── Users/Writers ────────────────────────────────────────────────────────
  createUser() {
    if (this.cuForm.invalid) return;
    this.cuError.set(''); this.cuSuccess.set('');
    this.api.createUser(this.cuForm.value).subscribe({
      next: () => { this.cuSuccess.set('User created!'); this.cuForm.reset({role:'ROLE_STUDENT'}); this.api.getAllStudents().subscribe({next:(s:any)=>this.students.set(s)}); },
      error: (err:any) => this.cuError.set(err.error?.message||'Failed.')
    });
  }

  writerPhone = { full: '', valid: true };
  onWriterPhone(e: any) { this.writerPhone = e; }

  createWriter() {
    if (this.writerForm.invalid) return;
    this.writerError.set(''); this.writerSuccess.set('');
    const wData = { ...this.writerForm.value, phone: this.writerPhone.full };
    this.api.createWriter(wData).subscribe({
      next: () => { this.writerSuccess.set('Writer created!'); this.writerForm.reset(); this.api.getAllWriters().subscribe({next:(w:any)=>this.writers.set(w)}); },
      error: (err:any) => this.writerError.set(err.error?.message||'Failed.')
    });
  }

  toggleUser(id: number) {
    this.api.toggleUserStatus(id).subscribe({ next: () => this.api.getAllStudents().subscribe({next:(s:any)=>this.students.set(s)}) });
  }

  submitReply() {
    if (!this.selQuery() || this.replyForm.invalid) return;
    this.api.replyToQuery(this.selQuery().id, this.replyForm.value.reply).subscribe({
      next: (u:any) => { this.queries.update(list=>list.map(q=>q.id===u.id?u:q)); this.selQuery.set(u); this.replyForm.reset(); }
    });
  }

  logout() { this.auth.logout(); }

  pendingPaymentEnrollments(): any[] {
    return this.enrollments().filter(e => e.status==='PAYMENT_PLAN_SENT'||e.status==='PARTIALLY_PAID');
  }

  getConfirmedInstallments(installments: any[]): number {
    return (installments||[]).filter(i=>i.status==='CONFIRMED').length;
  }

  // ── Receipt PDF download ─────────────────────────────────────────────────
  downloadReceipt(installmentId: number) {
    this.api.downloadPaymentSlip(installmentId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `Receipt_Installment_${installmentId}.html`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); window.URL.revokeObjectURL(url);
      }
    });
  }

  sc(status: string): string {
    const m: any = {
      SUBMITTED:'s-pending', UNDER_REVIEW:'s-reviewing', PAYMENT_PLAN_SENT:'s-plan',
      PARTIALLY_PAID:'s-partial', FULLY_PAID:'s-paid', IN_PROGRESS:'s-progress',
      UNDER_ADMIN_REVIEW:'s-done', DELIVERED:'s-delivered', REVISION_REQUESTED:'s-revision',
      COMPLETED:'s-closed', PENDING:'s-pending', RESOLVED:'s-done', CLOSED:'s-closed'
    };
    return m[status] || 's-pending';
  }

  installmentClass(s: string): string {
    return ({PENDING:'ip-pending',RECEIPT_UPLOADED:'ip-uploaded',CONFIRMED:'ip-confirmed',OVERDUE:'ip-overdue'}[s])||'';
  }

  statusLabel(s: string): string { return (s||'').replace(/_/g,' '); }

  getCollectedForEnrollment(e: any): number {
    return (e.installments||[]).filter((i:any)=>i.status==='CONFIRMED').reduce((s:number,i:any)=>s+Number(i.amount),0);
  }
  getProgressForEnrollment(e: any): number {
    if (!e.totalPrice || e.totalPrice <= 0) return 0;
    return Math.min(100, Math.round((this.getCollectedForEnrollment(e)/Number(e.totalPrice))*100));
  }
  get Math() { return Math; }
  get Number() { return Number; }

  getConfirmedCount(): number { return this.getAllInstallments().filter(i=>i.status==='CONFIRMED').length; }
  getOverdueCount():   number { return this.getAllInstallments().filter(i=>i.status==='OVERDUE').length; }

  getDraftTotal(): string {
    const t = this.installmentDrafts.reduce((s, r) => s + Number(r.amount || 0), 0);
    return t.toFixed(2);
  }

  isTotalMismatch(): boolean {
    const tp = Number(this.enrollUpdateForm.value.totalPrice);
    if (!tp) return false;
    const t = this.installmentDrafts.reduce((s, r) => s + Number(r.amount || 0), 0);
    return Math.abs(t - tp) > 0.01;
  }

  // ── Submission management ───────────────────────────────────────────────
  enrollmentSubmissions = signal<any[]>([]);
  submissionActionId  = signal<number|null>(null);
  submissionSuccess   = signal('');
  submissionError     = signal('');
  rejectNotes: { [id: number]: string } = {};

  loadSubmissions(enrollmentId: number) {
    this.api.getEnrollmentSubmissions(enrollmentId).subscribe({
      next: (d: any[]) => this.enrollmentSubmissions.set(Array.isArray(d) ? d : []),
      error: () => this.enrollmentSubmissions.set([])
    });
  }

  approveSubmission(submissionId: number) {
    this.submissionActionId.set(submissionId);
    this.submissionSuccess.set(''); this.submissionError.set('');
    this.api.approveSubmission(submissionId).subscribe({
      next: (r: any) => {
        this.submissionSuccess.set('✅ Approved! Student can now download this file.');
        this.submissionActionId.set(null);
        this.loadSubmissions(this.selEnrollment()?.id);
        this.api.getAllEnrollments().subscribe({ next: (res:any) => {
          this.enrollments.set(res.content||[]);
          const up = (res.content||[]).find((e:any)=>e.id===this.selEnrollment()?.id);
          if (up) this.selEnrollment.set(up);
        }});
        setTimeout(() => this.submissionSuccess.set(''), 4000);
      },
      error: (err: any) => { this.submissionError.set(err.error?.message||'Approval failed.'); this.submissionActionId.set(null); }
    });
  }

  rejectSubmission(submissionId: number) {
    const note = this.rejectNotes[submissionId] || '';
    if (!note.trim()) { this.submissionError.set('Please enter a rejection reason before rejecting.'); return; }
    this.submissionActionId.set(submissionId);
    this.submissionSuccess.set(''); this.submissionError.set('');
    this.api.rejectSubmission(submissionId, note).subscribe({
      next: () => {
        this.submissionSuccess.set('Submission rejected. Writer has been notified.');
        this.rejectNotes[submissionId] = '';
        this.submissionActionId.set(null);
        this.loadSubmissions(this.selEnrollment()?.id);
        setTimeout(() => this.submissionSuccess.set(''), 4000);
      },
      error: (err: any) => { this.submissionError.set(err.error?.message||'Rejection failed.'); this.submissionActionId.set(null); }
    });
  }

  // ── Submission helpers ───────────────────────────────────────────────────
  getApprovedCount(): number {
    return this.enrollmentSubmissions().filter(s => s.status === 'APPROVED').length;
  }
  getPendingCount(): number {
    return this.enrollmentSubmissions().filter(s => s.status === 'PENDING_REVIEW').length;
  }
  getRejectedCount(): number {
    return this.enrollmentSubmissions().filter(s => s.status === 'REJECTED').length;
  }

  /** True only when every installment for this enrollment is CONFIRMED */
  isFullyPaid(): boolean {
    const insts = this.selEnrollment()?.installments || [];
    if (insts.length === 0) return true; // no payment plan set, allow approve
    return insts.every((i: any) => i.status === 'CONFIRMED');
  }

  subStatusClass(s: string): string {
    return { APPROVED: 'badge-approved', PENDING_REVIEW: 'badge-pending', REJECTED: 'badge-rejected' }[s] || '';
  }

  // ── Tracker ─────────────────────────────────────────────────────────────
  enrollmentTasks = signal<any[]>([]);
  myTasks = signal<any[]>([]);
  newTask = { assignmentTitle:'', description:'', assignmentType:'assignment', dueDate:'', uploadDeadline:'' };
  taskSuccess = signal(''); taskError = signal('');

  loadEnrollmentTasks(enrollmentId: number) {
    this.api.getEnrollmentTasks(enrollmentId).subscribe({ next:(t:any[])=>this.enrollmentTasks.set(Array.isArray(t)?t:[]), error:()=>{} });
  }
  loadMyTasks() {
    this.api.getMyTasks().subscribe({ next:(t:any[])=>this.myTasks.set(Array.isArray(t)?t:[]), error:()=>{} });
  }
  createTask() {
    if (!this.newTask.assignmentTitle || !this.newTask.dueDate) { this.taskError.set('Title and due date required.'); return; }
    this.taskError.set('');
    this.api.createTask(this.selEnrollment().id, this.newTask).subscribe({
      next: () => {
        this.taskSuccess.set('✅ Task added!');
        this.newTask = { assignmentTitle:'', description:'', assignmentType:'assignment', dueDate:'', uploadDeadline:'' };
        this.loadEnrollmentTasks(this.selEnrollment().id);
        setTimeout(()=>this.taskSuccess.set(''), 3000);
      },
      error: (e:any) => this.taskError.set(e.error?.message||'Failed.')
    });
  }
  deleteTask(taskId: number) {
    this.api.deleteTask(taskId).subscribe({ next: ()=>this.loadEnrollmentTasks(this.selEnrollment().id) });
  }
  taskDaysLeft(d: string): number {
    const now=new Date(); now.setHours(0,0,0,0);
    const due=new Date(d); due.setHours(0,0,0,0);
    return Math.ceil((due.getTime()-now.getTime())/86400000);
  }
  taskStatusClass(s: string): string { return ({PENDING:'tk-pending',UPLOADED:'tk-uploaded',APPROVED:'tk-approved',MISSED:'tk-missed'})[s]||'tk-pending'; }

  // ── Invitations ──────────────────────────────────────────────────────────
  invitations = signal<any[]>([]);
  inviteMsgs: { [writerId: number]: string } = {};  // per-writer message
  inviteSuccess=signal(''); inviteError=signal('');
  assignFromAcceptedSuccess=signal('');
  invitationLoading = signal<number|null>(null);

  loadInvitations(enrollmentId: number) {
    this.api.getEnrollmentInvitations(enrollmentId).subscribe({ next:(d:any[])=>this.invitations.set(Array.isArray(d)?d:[]), error:()=>{} });
  }
  inviteWriterById(writerId: number) {
    this.inviteSuccess.set(''); this.inviteError.set('');
    const msg = this.inviteMsgs[writerId] || '';
    this.api.inviteWriter(this.selEnrollment().id, writerId, msg).subscribe({
      next: () => { this.inviteSuccess.set('✅ Invitation sent!'); this.inviteMsgs[writerId] = ''; this.loadInvitations(this.selEnrollment().id); setTimeout(()=>this.inviteSuccess.set(''),3000); },
      error: (e:any) => this.inviteError.set(e.error?.message||'Failed to send.')
    });
  }
  approveCredentialsForInvitation(invId: number) {
    this.invitationLoading.set(invId);
    this.api.approveCredentials(invId).subscribe({
      next: () => { this.loadInvitations(this.selEnrollment().id); this.invitationLoading.set(null); },
      error: () => this.invitationLoading.set(null)
    });
  }
  assignFromAccepted(writerId: number) {
    this.assignEnrollmentWriter(writerId);
    this.assignFromAcceptedSuccess.set('✅ Writer assigned as Main Writer!');
    setTimeout(() => this.assignFromAcceptedSuccess.set(''), 4000);
  }

  invStatusClass(s: string): string { return ({PENDING:'ip-pending',ACCEPTED:'ip-accepted',DECLINED:'ip-declined'})[s]||''; }

  taskActionId = signal<number|null>(null);
  taskNotes: { [id: number]: string } = {};

  approveTask(taskId: number) {
    this.taskActionId.set(taskId);
    const note = this.taskNotes[taskId] || '';
    this.api.approveTask(taskId, note).subscribe({
      next: () => { this.loadEnrollmentTasks(this.selEnrollment()?.id); this.taskActionId.set(null); this.taskNotes[taskId] = ''; },
      error: (e: any) => { this.taskError.set(e.error?.message || 'Approval failed.'); this.taskActionId.set(null); }
    });
  }

  rejectTask(taskId: number) {
    this.taskActionId.set(taskId);
    const note = this.taskNotes[taskId] || 'Please revise and re-upload.';
    this.api.rejectTask(taskId, note).subscribe({
      next: () => { this.loadEnrollmentTasks(this.selEnrollment()?.id); this.taskActionId.set(null); },
      error: () => this.taskActionId.set(null)
    });
  }

  uploadTaskDoc(event: Event, taskId: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.api.uploadTaskDoc(taskId, file).subscribe({
      next: () => this.loadEnrollmentTasks(this.selEnrollment()?.id),
      error: (e: any) => this.taskError.set(e.error?.message || 'Upload failed.')
    });
  }

  downloadFile(type: 'writer' | 'doc', taskId: number, fileName: string) {
    const obs = type === 'writer' ? this.api.downloadTrackerWriterFile(taskId) : this.api.downloadTrackerDoc(taskId);
    obs.subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = fileName || 'task-file';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    });
  }

  // ── Feedback & Analytics ────────────────────────────────────────────────
  feedbackList = signal<any[]>([]);
  bugReports   = signal<any[]>([]);
  analytics    = signal<any>(null);

  loadFeedback()    { this.api.getAdminFeedback().subscribe({next:(d:any[])=>this.feedbackList.set(d),error:()=>{}}); }
  loadBugReports()  { this.api.getAdminBugReports().subscribe({next:(d:any[])=>this.bugReports.set(d),error:()=>{}}); }
  loadAnalytics()   { this.api.getAnalytics().subscribe({next:(d:any)=>this.analytics.set(d),error:()=>{}}); }

  updateBugStatus(id: number, status: string) {
    this.api.updateBugReport(id, {status}).subscribe({next:()=>this.loadBugReports()});
  }
  avgRating(): number {
    const r = this.feedbackList();
    if (!r.length) return 0;
    return Math.round((r.reduce((s,f)=>s+f.rating,0)/r.length)*10)/10;
  }

  closeEnrollment(enrollmentId: number) {
    if (!confirm('Close this enrollment? This marks it as archived. The student will be notified.')) return;
    this.api.updateEnrollment(enrollmentId, { status: 'CLOSED' }).subscribe({
      next: () => {
        this.assignWriterSuccess.set('Enrollment closed and archived.');
        this.loadAll();
        setTimeout(() => this.assignWriterSuccess.set(''), 4000);
      },
      error: (e: any) => this.assignWriterError.set(e.error?.message || 'Failed to close.')
    });
  }
}
