import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="ablog">
  <div class="ph">
    <div><h1>Blog Posts</h1><p>Manage all blog articles published on the site</p></div>
    <button class="abtn teal" (click)="openForm(null)">+ New Post</button>
  </div>

  <!-- Form -->
  <div class="mng-panel" *ngIf="editing()">
    <div class="mp-head">
      <button class="back-btn" (click)="editing.set(null)">← Cancel</button>
      <h2>{{ editing()?.id ? 'Edit Post' : 'New Post' }}</h2>
    </div>
    <form [formGroup]="form" (ngSubmit)="save()" style="padding:24px">
      <div class="fg2">
        <div class="fg"><label>Title *</label><input type="text" formControlName="title" placeholder="Blog post title" /></div>
        <div class="fg"><label>Category</label><input type="text" formControlName="category" placeholder="e.g. Online Class Help" /></div>
      </div>
      <div class="fg2">
        <div class="fg"><label>Author</label><input type="text" formControlName="author" placeholder="EduPilotHelp Team" /></div>
        <div class="fg"><label>Read Time (min)</label><input type="number" formControlName="readTimeMinutes" placeholder="5" /></div>
      </div>
      <div class="fg"><label>Excerpt *</label><textarea formControlName="excerpt" rows="2" placeholder="Brief description shown on blog list"></textarea></div>
      <div class="fg"><label>Content (HTML) *</label><textarea formControlName="content" rows="12" placeholder="Full article content — HTML supported (h2, h3, p, ul, li, strong)"></textarea></div>
      <div style="display:flex;gap:16px;align-items:center;margin-top:16px">
        <label style="display:flex;align-items:center;gap:8px;font-size:.87rem;cursor:pointer">
          <input type="checkbox" formControlName="published" /> Published
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:.87rem;cursor:pointer">
          <input type="checkbox" formControlName="featured" /> Featured
        </label>
        <button type="submit" class="abtn teal" [disabled]="saving()">{{ saving() ? 'Saving...' : 'Save Post' }}</button>
      </div>
      <div class="err" *ngIf="error()">{{ error() }}</div>
    </form>
  </div>

  <!-- Posts table -->
  <div class="tbl" *ngIf="!editing()">
    <div class="th" style="grid-template-columns:3fr 1fr 1fr .8fr .8fr">
      <span>Title</span><span>Category</span><span>Author</span><span>Status</span><span>Actions</span>
    </div>
    <div class="tr" style="grid-template-columns:3fr 1fr 1fr .8fr .8fr" *ngFor="let p of posts()">
      <div class="tc"><strong>{{ p.title }}</strong><small>{{ p.excerpt?.slice(0,60) }}...</small></div>
      <div class="tm">{{ p.category }}</div>
      <div class="tm">{{ p.author }}</div>
      <div><span class="chip" [class.s-progress]="p.published" [class.s-pending]="!p.published">{{ p.published ? 'Published' : 'Draft' }}</span></div>
      <div style="display:flex;gap:8px">
        <button class="abtn" (click)="openForm(p)">Edit</button>
        <button class="abtn danger" (click)="deletePost(p.id)">Del</button>
      </div>
    </div>
    <div class="empty-sm" *ngIf="posts().length === 0">No blog posts yet. Click + New Post to add your first article.</div>
  </div>
</div>
  `,
  styles: [`
.ablog{display:flex;flex-direction:column;gap:20px}
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;h1{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#0f172a}p{font-size:.86rem;color:#64748b}}
.fg2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.fg{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;label{font-size:.72rem;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:.06em}input,textarea{background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:9px;padding:10px 13px;color:#0f172a;font-size:.9rem;outline:none;font-family:inherit;resize:none;width:100%;&:focus{border-color:#3b82f6;background:#fff}}}
.err{color:#dc2626;font-size:.83rem;margin-top:10px}
.mng-panel{background:#fff;border:1.5px solid #e2e8f0;border-radius:16px;overflow:hidden}
.mp-head{display:flex;align-items:center;gap:14px;padding:16px 22px;border-bottom:1.5px solid #e2e8f0;background:#f8fafc;h2{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:#0f172a}}
.back-btn{display:flex;align-items:center;gap:5px;background:#f1f5f9;border:1.5px solid #e2e8f0;color:#334155;padding:6px 12px;border-radius:8px;font-size:.82rem;cursor:pointer;transition:all .15s;&:hover{border-color:#2563eb;color:#2563eb}}
.tbl{background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;overflow:hidden}
.th{display:grid;padding:10px 16px;background:#f8fafc;border-bottom:1.5px solid #e2e8f0;font-size:.71rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em}
.tr{display:grid;padding:11px 16px;border-bottom:1px solid #f1f5f9;align-items:center;transition:background .1s;&:hover{background:#f8fafc}&:last-child{border-bottom:none}}
.tc{strong{display:block;font-size:.84rem;color:#0f172a;font-weight:600}small{font-size:.74rem;color:#64748b}}
.tm{font-size:.8rem;color:#64748b}
.chip{display:inline-block;padding:3px 10px;border-radius:20px;font-size:.69rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;&.s-progress{background:#dbeafe;color:#2563eb;border:1px solid rgba(37,99,235,.2)}&.s-pending{background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0}}
.abtn{background:#f8fafc;border:1.5px solid #e2e8f0;color:#334155;padding:5px 12px;border-radius:7px;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .15s;&:hover{border-color:#2563eb;color:#2563eb}&.teal{background:#2563eb;border-color:#2563eb;color:#fff;&:hover{background:#1e3a8a}}&.danger{&:hover{border-color:#dc2626;color:#dc2626}}&:disabled{opacity:.6;cursor:not-allowed}}
.empty-sm{text-align:center;padding:24px;font-size:.83rem;color:#64748b}
  `]
})
export class AdminBlogComponent implements OnInit {
  posts   = signal<any[]>([]);
  editing = signal<any>(null);
  saving  = signal(false);
  error   = signal('');
  form:    FormGroup;
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['Online Class Help'],
      author: ['EduPilotHelp Team'],
      readTimeMinutes: [5],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      published: [false],
      featured: [false],
    });
  }

  ngOnInit() { this.loadPosts(); }

  loadPosts() {
    this.http.get<any>(`${this.api}/admin/blogs?size=100`).subscribe({
      next: (r) => this.posts.set(r.content || []),
      error: () => {}
    });
  }

  openForm(post: any) {
    this.editing.set(post || {});
    this.error.set('');
    if (post?.id) {
      this.form.patchValue(post);
    } else {
      this.form.reset({ category: 'Online Class Help', author: 'EduPilotHelp Team', readTimeMinutes: 5, published: false, featured: false });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving.set(true); this.error.set('');
    const data = this.form.value;
    const req = this.editing()?.id
      ? this.http.put(`${this.api}/admin/blogs/${this.editing().id}`, data)
      : this.http.post(`${this.api}/admin/blogs`, data);
    req.subscribe({
      next: () => { this.saving.set(false); this.editing.set(null); this.loadPosts(); },
      error: (e: any) => { this.saving.set(false); this.error.set(e.error?.message || 'Save failed'); }
    });
  }

  deletePost(id: number) {
    if (!confirm('Delete this post?')) return;
    this.http.delete(`${this.api}/admin/blogs/${id}`).subscribe({ next: () => this.loadPosts() });
  }
}
