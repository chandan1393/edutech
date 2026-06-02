import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="bd-page">
  <div class="bd-loading" *ngIf="loading()">
    <div class="spinner"></div>
    <p>Loading article...</p>
  </div>

  <ng-container *ngIf="!loading() && post()">
    <div class="bd-hero">
      <div class="wrap-mid">
        <a routerLink="/blog" class="back-link">← Back to Blog</a>
        <div class="bd-cat">{{ post().category || 'Online Class Help' }}</div>
        <h1>{{ post().title }}</h1>
        <div class="bd-meta">
          <span>✍️ {{ post().author || 'EduPilotHelp Team' }}</span>
          <span>⏱ {{ post().readTimeMinutes || 5 }} min read</span>
          <span>📅 {{ formatDate(post().createdAt) }}</span>
        </div>
      </div>
    </div>

    <div class="bd-body">
      <div class="wrap-mid">
        <div class="bd-content" [innerHTML]="post().content"></div>

        <div class="bd-cta">
          <div class="cta-icon">🎓</div>
          <h3>Need Help With Your Online Class?</h3>
          <p>Our verified experts handle everything from quizzes to final exams. Get a free custom quote within 24 hours — no upfront payment required.</p>
          <div class="cta-btns">
            <a routerLink="/" class="cta-btn-primary">Get a Free Quote →</a>
            <a routerLink="/how-it-works" class="cta-btn-ghost">See How It Works</a>
          </div>
          <div class="cta-trust">
            <span>✅ 5,000+ Classes Completed</span>
            <span>⭐ 4.9/5 Rated</span>
            <span>🔒 100% Confidential</span>
          </div>
        </div>
      </div>
    </div>
  </ng-container>

  <div class="not-found" *ngIf="!loading() && !post() && !error()">
    <div class="nf-icon">📄</div>
    <h2>Article Not Found</h2>
    <p>This article may have been moved or is not yet available.</p>
    <a routerLink="/blog" class="back-btn">← Browse All Articles</a>
  </div>

  <div class="not-found error-state" *ngIf="!loading() && error()">
    <div class="nf-icon">⚠️</div>
    <h2>Unable to Load Article</h2>
    <p>There was an error loading this article. Please check your connection and try again.</p>
    <a routerLink="/blog" class="back-btn">← Browse All Articles</a>
  </div>
</div>
  `,
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  post    = signal<any>(null);
  loading = signal(true);
  error   = signal(false);

  constructor(private http: HttpClient, private route: ActivatedRoute, private seo: SeoService) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!slug) { this.loading.set(false); return; }

    this.http.get<any>(`${environment.apiUrl}/public/blogs/${slug}`).subscribe({
      next: (p) => {
        this.post.set(p);
        this.loading.set(false);
        if (p) {
          this.seo.set({
            title: p.title + ' | EduPilotHelp',
            description: p.excerpt || p.title + ' — Expert online class help from EduPilotHelp. Verified academic specialists from $42/week.',
            keywords: (p.category || 'online class help') + ', EduPilotHelp',
            canonical: '/blog/' + (p.slug || slug)
          });
        }
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  formatDate(d: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
