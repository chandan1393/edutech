import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ── Public ─────────────────────────────────────────────────────────────
  submitQuery(data: any): Observable<any> { return this.http.post(`${this.base}/public/query`, data); }
  submitContact(data: any): Observable<any> { return this.http.post(`${this.base}/public/contact`, data); }
  submitTextMe(phone: string, countryCode: string): Observable<any> { return this.http.post(`${this.base}/public/text-me`, { phone, countryCode }); }
  getPublicConfig(): Observable<any> { return this.http.get(`${this.base}/public/config`); }
  getTestimonials(): Observable<any> { return this.http.get(`${this.base}/public/testimonials`); }

  // ── Auth ────────────────────────────────────────────────────────────────
  getProfile(): Observable<any> { return this.http.get(`${this.base}/student/profile`); }
  getNotifications(): Observable<any> { return this.http.get(`${this.base}/student/notifications`); }
  markAllNotificationsRead(): Observable<any> { return this.http.post(`${this.base}/student/notifications/read-all`, {}); }
  getStudentDashboardStats(): Observable<any> { return this.http.get(`${this.base}/student/dashboard/stats`); }

  // ── Stripe Checkout (installment-based, no Razorpay) ───────────────────
  createStripeSession(installmentId: number): Observable<any> {
    return this.http.post(`${this.base}/stripe/create-session/${installmentId}`, {});
  }
  verifyStripeSession(sessionId: string, installmentId: number): Observable<any> {
    return this.http.post(`${this.base}/stripe/verify-session`, { sessionId, installmentId });
  }
  getStripeSessionStatus(sessionId: string, installmentId: number): Observable<any> {
    return this.http.get(`${this.base}/stripe/session-status/${sessionId}`, { params: { installmentId } });
  }

  // ── Student Enrollments ─────────────────────────────────────────────────
  createEnrollment(formData: FormData): Observable<any> { return this.http.post(`${this.base}/student/enrollments`, formData); }
  getMyEnrollments(): Observable<any> { return this.http.get(`${this.base}/student/enrollments`); }
  uploadInstallmentReceipt(installmentId: number, file: File): Observable<any> {
    const fd = new FormData(); fd.append('receipt', file);
    return this.http.post(`${this.base}/student/installments/${installmentId}/receipt`, fd);
  }
  downloadPaymentSlip(installmentId: number): Observable<Blob> {
    return this.http.get(`${this.base}/student/payment-slip/${installmentId}`, { responseType: 'blob' });
  }

  // ── Admin Enrollments ───────────────────────────────────────────────────
  getAllEnrollments(page = 0, size = 50): Observable<any> { return this.http.get(`${this.base}/admin/enrollments`, { params: { page, size } }); }
  updateEnrollment(id: number, data: any): Observable<any> { return this.http.put(`${this.base}/admin/enrollments/${id}`, data); }
  createInstallments(enrollmentId: number, installments: any[]): Observable<any> { return this.http.post(`${this.base}/admin/enrollments/${enrollmentId}/installments`, installments); }
  confirmInstallment(installmentId: number): Observable<any> { return this.http.post(`${this.base}/admin/installments/${installmentId}/confirm`, {}); }
  assignEnrollmentWriter(enrollmentId: number, writerUserId: number): Observable<any> { return this.http.post(`${this.base}/admin/enrollments/${enrollmentId}/assign-writer`, { writerUserId }); }
  approveEnrollmentZip(enrollmentId: number): Observable<any> { return this.http.post(`${this.base}/admin/enrollments/${enrollmentId}/approve-zip`, {}); }
  getEnrollmentStats(): Observable<any> { return this.http.get(`${this.base}/admin/enrollments/stats`); }

  // ── Admin Users/Writers ─────────────────────────────────────────────────
  getAllStudents(): Observable<any> { return this.http.get(`${this.base}/admin/students`); }
  getAllUsers(): Observable<any> { return this.http.get(`${this.base}/admin/users`); }
  createUser(data: any): Observable<any> { return this.http.post(`${this.base}/admin/users`, data); }
  toggleUserStatus(id: number): Observable<any> { return this.http.patch(`${this.base}/admin/users/${id}/toggle-status`, {}); }
  getAllWriters(): Observable<any> { return this.http.get(`${this.base}/admin/writers`); }
  createWriter(data: any): Observable<any> { return this.http.post(`${this.base}/admin/writers`, data); }
  getAllQueries(page = 0, size = 50): Observable<any> { return this.http.get(`${this.base}/admin/queries`, { params: { page, size } }); }
  replyToQuery(id: number, reply: string): Observable<any> { return this.http.post(`${this.base}/admin/queries/${id}/reply`, { reply }); }

  // ── Writer Enrollments ──────────────────────────────────────────────────
  getWriterEnrollments(): Observable<any> { return this.http.get(`${this.base}/writer/enrollments`); }
  writerUploadZip(enrollmentId: number, file: File, description = ''): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('description', description);
    return this.http.post(`${this.base}/writer/enrollments/${enrollmentId}/upload-zip`, fd);
  }
  getWriterSubmissions(enrollmentId: number): Observable<any> {
    return this.http.get(`${this.base}/writer/enrollments/${enrollmentId}/submissions`);
  }
  getEnrollmentSubmissions(enrollmentId: number): Observable<any> {
    return this.http.get(`${this.base}/admin/enrollments/${enrollmentId}/submissions`);
  }
  approveSubmission(submissionId: number, adminNote?: string): Observable<any> {
    return this.http.post(`${this.base}/admin/submissions/${submissionId}/approve`, { adminNote: adminNote || '' });
  }
  rejectSubmission(submissionId: number, adminNote: string): Observable<any> {
    return this.http.post(`${this.base}/admin/submissions/${submissionId}/reject`, { adminNote });
  }

  uploadTaskFile(taskId: number, file: File, note = ''): Observable<any> {
    const fd = new FormData(); fd.append('file', file); fd.append('note', note);
    return this.http.post(`${this.base}/tracker/tasks/${taskId}/upload`, fd);
  }
  uploadTaskDoc(taskId: number, file: File): Observable<any> {
    const fd = new FormData(); fd.append('file', file);
    return this.http.post(`${this.base}/tracker/tasks/${taskId}/upload-doc`, fd);
  }
  approveTask(taskId: number, note = ''): Observable<any> { return this.http.post(`${this.base}/tracker/tasks/${taskId}/approve`, { note }); }
  rejectTask(taskId: number, note: string): Observable<any> { return this.http.post(`${this.base}/tracker/tasks/${taskId}/reject`, { note }); }
  downloadTaskWriterFile(taskId: number): Observable<Blob> { return this.http.get(`${this.base}/tracker/tasks/${taskId}/download-writer-file`, { responseType: 'blob' }); }
  downloadTaskDoc(taskId: number): Observable<Blob> { return this.http.get(`${this.base}/tracker/tasks/${taskId}/download-doc`, { responseType: 'blob' }); }

  // ── Tracker ─────────────────────────────────────────────────────────────
  getMyTasks(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/tracker/my-tasks`); }
  getEnrollmentTasks(enrollmentId: number): Observable<any[]> { return this.http.get<any[]>(`${this.base}/tracker/enrollments/${enrollmentId}/tasks`); }
  createTask(enrollmentId: number, data: any): Observable<any> { return this.http.post(`${this.base}/tracker/enrollments/${enrollmentId}/tasks`, data); }
  updateTask(taskId: number, data: any): Observable<any> { return this.http.put(`${this.base}/tracker/tasks/${taskId}`, data); }
  deleteTask(taskId: number): Observable<any> { return this.http.delete(`${this.base}/tracker/tasks/${taskId}`); }

  // ── Writer Invitations ───────────────────────────────────────────────────
  inviteWriter(enrollmentId: number, writerId: number, message = ''): Observable<any> { return this.http.post(`${this.base}/invitations/enrollments/${enrollmentId}/invite/${writerId}`, { message }); }
  getEnrollmentInvitations(enrollmentId: number): Observable<any[]> { return this.http.get<any[]>(`${this.base}/invitations/enrollments/${enrollmentId}`); }
  getMyInvitations(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/invitations/my`); }
  acceptInvitation(id: number, note = ''): Observable<any> { return this.http.post(`${this.base}/invitations/${id}/accept`, { note }); }
  declineInvitation(id: number, note = ''): Observable<any> { return this.http.post(`${this.base}/invitations/${id}/decline`, { note }); }
  approveCredentials(invitationId: number): Observable<any> { return this.http.post(`${this.base}/invitations/${invitationId}/approve-credentials`, {}); }

  // ── Credential Update ────────────────────────────────────────────────────
  updateCredentials(enrollmentId: number, data: any): Observable<any> { return this.http.put(`${this.base}/enrollments/${enrollmentId}/credentials`, data); }

  // ── Chat ────────────────────────────────────────────────────────────────
  getChatMessages(assignmentId: number, context: string): Observable<any> {
    return this.http.get(`${this.base}/chat/${assignmentId}/${context}`);
  }
  sendChatMessage(assignmentId: number, context: string, message: string): Observable<any> {
    return this.http.post(`${this.base}/chat/${assignmentId}/${context}`, { message });
  }
  markChatRead(assignmentId: number, context: string): Observable<any> {
    return this.http.post(`${this.base}/chat/${assignmentId}/${context}/read`, {});
  }
  getChatUnread(assignmentId: number, context: string): Observable<any> {
    return this.http.get(`${this.base}/chat/${assignmentId}/${context}/unread`);
  }

  // ── Feedback & Bug Report ────────────────────────────────────────────────
  submitFeedback(data: any): Observable<any> { return this.http.post(`${this.base}/feedback`, data); }
  submitBugReport(data: any): Observable<any> { return this.http.post(`${this.base}/bug-report`, data); }
  getAdminFeedback(): Observable<any> { return this.http.get(`${this.base}/admin/feedback`); }
  getAdminBugReports(): Observable<any> { return this.http.get(`${this.base}/admin/bug-reports`); }
  updateBugReport(id: number, data: any): Observable<any> { return this.http.patch(`${this.base}/admin/bug-reports/${id}`, data); }
  getAnalytics(): Observable<any> { return this.http.get(`${this.base}/admin/analytics`); }

  // ── File Downloads (all through authenticated /api/files/ endpoints) ────
  downloadSubmission(submissionId: number): Observable<Blob> {
    return this.http.get(`${this.base}/files/submission/${submissionId}`, { responseType: 'blob' });
  }
  downloadReceipt(installmentId: number): Observable<Blob> {
    return this.http.get(`${this.base}/files/receipt/${installmentId}`, { responseType: 'blob' });
  }
  downloadEnrollmentDoc(enrollmentId: number): Observable<Blob> {
    return this.http.get(`${this.base}/files/enrollment-doc/${enrollmentId}`, { responseType: 'blob' });
  }
  downloadTrackerWriterFile(taskId: number): Observable<Blob> {
    return this.http.get(`${this.base}/files/tracker/${taskId}/writer-file`, { responseType: 'blob' });
  }
  downloadTrackerDoc(taskId: number): Observable<Blob> {
    return this.http.get(`${this.base}/files/tracker/${taskId}/task-doc`, { responseType: 'blob' });
  }

  // ── Student Registration ─────────────────────────────────────────────────
  registerStudent(data: { fullName:string; email:string; password:string; phone:string }): Observable<any> {
    return this.http.post(`${this.base}/auth/register`, data);
  }
}
