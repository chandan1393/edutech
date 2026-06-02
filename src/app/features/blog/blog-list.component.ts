import { SeoService } from '../../core/services/seo.service';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  posts         = signal<any[]>([]);
  loading       = signal(true);
  error         = signal(false);
  activeCategory = signal('All');
  currentPage   = signal(0);
  totalPages    = signal(1);
  readonly PAGE_SIZE = 12;

  categories = ['All', 'Online Class Help', 'Study Tips', 'Subject Guides', 'Test Taking', 'Time Management'];

  constructor(private seo: SeoService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.seo.set({
      title: 'Online Class Help Blog — Tips, Guides and Resources | EduPilotHelp',
      description: 'Expert articles on online class help, study strategies, LMS navigation, time management, and academic success tips for US college students.',
      canonical: '/blog'
    }); this.loadPage(0); }

  loadPage(page: number) {
    this.loading.set(true);
    this.error.set(false);
    const url = `${environment.apiUrl}/public/blogs?page=${page}&size=${this.PAGE_SIZE}`;
    this.http.get<any>(url).subscribe({
      next: (r) => {
        const arr = Array.isArray(r) ? r : (r?.content || []);
        this.posts.set(arr);
        this.totalPages.set(r?.totalPages ?? 1);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  get filteredPosts() {
    const cat = this.activeCategory();
    return cat === 'All' ? this.posts() : this.posts().filter(p => p.category === cat);
  }

  get featuredPost() { return this.filteredPosts[0] ?? null; }
  get gridPosts()    { return this.filteredPosts.slice(1); }

  openPost(slug: string) { this.router.navigate(['/blog', slug]); }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
    this.loadPage(0);
  }

  nextPage() { if (this.currentPage() < this.totalPages() - 1) this.loadPage(this.currentPage() + 1); }
  prevPage() { if (this.currentPage() > 0) this.loadPage(this.currentPage() - 1); }

  formatDate(d: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
