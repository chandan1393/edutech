import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent implements OnInit {
  tab = signal<'blogs' | 'feedback'>('blogs');

  // Blog state
  blogs      = signal<any[]>([]);
  blogEdit   = signal<any>(null);
  blogSaving = signal(false);
  blogErr    = signal('');
  blogForm:  FormGroup;

  // Feedback state
  feedbacks  = signal<any[]>([]);
  fbEdit     = signal<any>(null);
  fbSaving   = signal(false);
  fbErr      = signal('');
  fbForm:    FormGroup;

  private api = environment.apiUrl;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title:           ['', Validators.required],
      category:        ['Online Class Help'],
      author:          ['EduPilotHelp Team'],
      readTimeMinutes: [5],
      excerpt:         ['', Validators.required],
      content:         ['', Validators.required],
      published:       [false],
      featured:        [false],
    });
    this.fbForm = this.fb.group({
      studentName:  ['', Validators.required],
      course:       [''],
      location:     [''],
      feedbackText: ['', [Validators.required, Validators.minLength(10)]],
      rating:       [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      avatar:       [''],
      visible:      [true],
    });
  }

  ngOnInit() { this.loadBlogs(); this.loadFeedbacks(); }

  // ── BLOGS ──────────────────────────────────────────────────────────────
  loadBlogs() {
    this.http.get<any>(`${this.api}/admin/blogs?size=100`).subscribe({
      next: (r) => this.blogs.set(r.content || []),
      error: () => {}
    });
  }

  openBlog(b: any) {
    this.blogEdit.set(b || {});
    this.blogErr.set('');
    if (b?.id) this.blogForm.patchValue(b);
    else this.blogForm.reset({ category: 'Online Class Help', author: 'EduPilotHelp Team', readTimeMinutes: 5, published: false, featured: false });
  }

  saveBlog() {
    if (this.blogForm.invalid) return;
    this.blogSaving.set(true); this.blogErr.set('');
    const req = this.blogEdit()?.id
      ? this.http.put(`${this.api}/admin/blogs/${this.blogEdit().id}`, this.blogForm.value)
      : this.http.post(`${this.api}/admin/blogs`, this.blogForm.value);
    req.subscribe({
      next: () => { this.blogSaving.set(false); this.blogEdit.set(null); this.loadBlogs(); },
      error: (e: any) => { this.blogSaving.set(false); this.blogErr.set(e.error?.message || 'Save failed'); }
    });
  }

  deleteBlog(id: number) {
    if (!confirm('Delete this blog post?')) return;
    this.http.delete(`${this.api}/admin/blogs/${id}`).subscribe({ next: () => this.loadBlogs() });
  }

  toggleBlogPublished(b: any) {
    this.http.put(`${this.api}/admin/blogs/${b.id}`, { ...b, published: !b.published }).subscribe({
      next: () => this.loadBlogs()
    });
  }

  // ── FEEDBACK ───────────────────────────────────────────────────────────
  loadFeedbacks() {
    this.http.get<any[]>(`${this.api}/admin/feedback`).subscribe({
      next: (r) => this.feedbacks.set(r || []),
      error: () => {}
    });
  }

  openFeedback(f: any) {
    this.fbEdit.set(f || {});
    this.fbErr.set('');
    if (f?.id) this.fbForm.patchValue({ ...f, feedbackText: f.feedbackText });
    else this.fbForm.reset({ rating: 5, visible: true });
  }

  saveFeedback() {
    if (this.fbForm.invalid) return;
    this.fbSaving.set(true); this.fbErr.set('');
    const req = this.fbEdit()?.id
      ? this.http.put(`${this.api}/admin/feedback/${this.fbEdit().id}`, this.fbForm.value)
      : this.http.post(`${this.api}/admin/feedback`, this.fbForm.value);
    req.subscribe({
      next: () => { this.fbSaving.set(false); this.fbEdit.set(null); this.loadFeedbacks(); },
      error: (e: any) => { this.fbSaving.set(false); this.fbErr.set(e.error?.message || 'Save failed'); }
    });
  }

  toggleVisible(f: any) {
    this.http.patch(`${this.api}/admin/feedback/${f.id}/toggle`, {}).subscribe({
      next: () => this.loadFeedbacks()
    });
  }

  deleteFeedback(id: number) {
    if (!confirm('Delete this feedback?')) return;
    this.http.delete(`${this.api}/admin/feedback/${id}`).subscribe({ next: () => this.loadFeedbacks() });
  }

  stars(n: number) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  get visibleFeedbackCount() { return this.feedbacks().filter(f => f.visible).length; }
}
