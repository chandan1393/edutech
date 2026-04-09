import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { LocalDatePipe } from '../../shared/pipes/local-date.pipe';
import { TimezoneService } from '../../core/services/timezone.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatComponent } from '../../shared/components/chat/chat.component';

@Component({
  selector: 'app-writer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent, LocalDatePipe],
  templateUrl: './writer-dashboard.component.html',
  styleUrls: ['./writer-dashboard.component.scss']
})
export class WriterDashboardComponent implements OnInit {
  activeTab   = signal<'overview'|'enrollments'|'invitations'>('overview');
  panelTab    = signal<'details'|'submit'|'history'|'tracker'|'chat'>('details');
  enrollments = signal<any[]>([]);
  profile     = signal<any>(null);
  loading     = signal(false);
  selected    = signal<any>(null);
  submissions = signal<any[]>([]);

  uploadingId   = signal<number|null>(null);
  uploadSuccess = signal('');
  uploadError   = signal('');
  uploadNote    = ''; // description for this submission

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.profile.set(this.auth.currentUser());
    this.load();
    this.loadInvitations();
    this.loadMyTasks();
  }

  load() {
    this.loading.set(true);
    this.api.getWriterEnrollments().subscribe({
      next: (d: any[]) => {
        this.enrollments.set(Array.isArray(d) ? d : []);
        if (this.selected()) {
          const up = this.enrollments().find(e => e.id === this.selected()?.id);
          if (up) this.selected.set(up);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  select(e: any) {
    if (this.selected()?.id === e.id) { this.selected.set(null); return; }
    this.selected.set(e);
    this.panelTab.set('details');
    this.uploadSuccess.set(''); this.uploadError.set('');
    this.uploadNote = '';
    this.loadSubmissions(e.id);
    this.loadEnrollmentTasks(e.id);
  }

  loadSubmissions(enrollmentId: number) {
    this.api.getWriterSubmissions(enrollmentId).subscribe({
      next: (data: any[]) => this.submissions.set(Array.isArray(data) ? data : []),
      error: () => this.submissions.set([])
    });
  }

  uploadZip(event: Event, enrollmentId: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingId.set(enrollmentId);
    this.uploadSuccess.set(''); this.uploadError.set('');
    const note = this.uploadNote || '';
    this.api.writerUploadZip(enrollmentId, file, note).subscribe({
      next: () => {
        this.uploadSuccess.set('✅ Assignment uploaded! Admin will review before releasing to the student.');
        this.uploadNote = '';
        this.uploadingId.set(null);
        this.load();
        this.loadSubmissions(enrollmentId);
      },
      error: (err: any) => {
        this.uploadError.set(err.error?.message || 'Upload failed. Please try again.');
        this.uploadingId.set(null);
      }
    });
  }

  statusClass(s: string): string {
    const m: any = { SUBMITTED:'sp', UNDER_REVIEW:'sr', PAYMENT_PLAN_SENT:'sr', PARTIALLY_PAID:'sr',
      FULLY_PAID:'si', IN_PROGRESS:'si', UNDER_ADMIN_REVIEW:'sc', DELIVERED:'sd', COMPLETED:'sd' };
    return m[s] || 'sp';
  }
  statusLabel(s: string): string { return (s || '').replace(/_/g, ' '); }
  submissionStatusClass(s: string): string {
    return { PENDING_REVIEW:'sr', APPROVED:'sd', REJECTED:'se' }[s] || 'sp';
  }
  countByStatus(s: string): number { return this.enrollments().filter(e => e.status === s).length; }
  logout() { this.auth.logout(); }

  // ── Invitations ──────────────────────────────────────────────────────────
  invitations = signal<any[]>([]);
  invResponse = signal('');

  loadInvitations() {
    this.api.getMyInvitations().subscribe({ next:(d:any[])=>this.invitations.set(Array.isArray(d)?d:[]), error:()=>{} });
  }
  accept(invId: number, note = '') {
    this.api.acceptInvitation(invId, note).subscribe({
      next: () => { this.invResponse.set('✅ Accepted! Admin will review and may assign you.'); this.loadInvitations(); setTimeout(()=>this.invResponse.set(''),4000); },
      error:(e:any)=>this.invResponse.set('⚠️ '+e.error?.message||'Failed.')
    });
  }
  decline(invId: number, note = '') {
    this.api.declineInvitation(invId, note).subscribe({
      next: () => { this.invResponse.set('Invitation declined.'); this.loadInvitations(); setTimeout(()=>this.invResponse.set(''),3000); },
      error:()=>{}
    });
  }
  pendingInvCount(): number { return this.invitations().filter(i=>i.status==='PENDING').length; }

  // ── Tracker ──────────────────────────────────────────────────────────────
  myTasks = signal<any[]>([]);
  enrollmentTasks = signal<any[]>([]);
  taskFilter = signal<'upcoming'|'today'|'all'>('upcoming');

  loadMyTasks() {
    this.api.getMyTasks().subscribe({ next:(t:any[])=>this.myTasks.set(Array.isArray(t)?t:[]), error:()=>{} });
  }
  loadEnrollmentTasks(enrollmentId: number) {
    this.api.getEnrollmentTasks(enrollmentId).subscribe({ next:(t:any[])=>this.enrollmentTasks.set(Array.isArray(t)?t:[]), error:()=>{} });
  }
  filteredTasks(): any[] {
    const now=new Date(); now.setHours(0,0,0,0); const today=now.getTime();
    if (this.taskFilter()==='today') return this.myTasks().filter(t=>{const d=new Date(t.dueDate);d.setHours(0,0,0,0);return d.getTime()===today;});
    if (this.taskFilter()==='upcoming') return this.myTasks().filter(t=>{const d=new Date(t.dueDate);d.setHours(0,0,0,0);return d.getTime()>=today&&t.status!=='APPROVED';});
    return this.myTasks();
  }
  taskDaysLeft(d: string): number {
    const now=new Date();now.setHours(0,0,0,0);const due=new Date(d);due.setHours(0,0,0,0);
    return Math.ceil((due.getTime()-now.getTime())/86400000);
  }
  taskStatusClass(s: string): string { return ({PENDING:'tk-pending',UPLOADED:'tk-uploaded',APPROVED:'tk-approved',MISSED:'tk-missed'})[s]||''; }

  // Task creation (writer can also add tasks)
  newTask = { assignmentTitle:'', description:'', assignmentType:'assignment', dueDate:'', uploadDeadline:'' };
  taskSuccess = signal(''); taskError = signal('');

  createTask(enrollmentId: number) {
    if (!this.newTask.assignmentTitle || !this.newTask.dueDate) { this.taskError.set('Title and due date are required.'); return; }
    this.taskError.set('');
    this.api.createTask(enrollmentId, this.newTask).subscribe({
      next: () => {
        this.taskSuccess.set('✅ Task added!');
        this.newTask = { assignmentTitle:'', description:'', assignmentType:'assignment', dueDate:'', uploadDeadline:'' };
        this.loadEnrollmentTasks(enrollmentId);
        setTimeout(() => this.taskSuccess.set(''), 3000);
      },
      error: (e: any) => this.taskError.set(e.error?.message || 'Failed to add task.')
    });
  }

  // Per-task file upload
  uploadingTaskId = signal<number|null>(null);
  uploadNotes: { [id: number]: string } = {};

  uploadTaskFile(event: Event, taskId: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingTaskId.set(taskId);
    const note = this.uploadNotes[taskId] || '';
    this.api.uploadTaskFile(taskId, file, note).subscribe({
      next: () => {
        this.uploadingTaskId.set(null);
        this.uploadNotes[taskId] = '';
        this.loadEnrollmentTasks(this.selected()?.id);
        this.uploadSuccess.set('✅ File uploaded for this task! Admin will review.');
        setTimeout(() => this.uploadSuccess.set(''), 4000);
      },
      error: (e: any) => {
        this.uploadError.set(e.error?.message || 'Upload failed.');
        this.uploadingTaskId.set(null);
      }
    });
  }

  downloadFile(type: 'writer'|'doc', taskId: number, fileName: string) {
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
}
