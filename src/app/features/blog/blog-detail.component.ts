import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../core/services/seo.service';

interface TocItem { id: string; text: string; level: number; }

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  post     = signal<any>(null);
  loading  = signal(true);
  error    = signal(false);
  progress = signal(0);
  activeId = signal('');
  toc      = signal<TocItem[]>([]);
  related  = signal<any[]>([]);
  tags     = signal<string[]>([]);
  copied   = signal(false);

  private slug = '';
  private onScroll = () => this.updateScroll();

  constructor(private http: HttpClient, private route: ActivatedRoute, private seo: SeoService) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!this.slug) { this.loading.set(false); return; }
    window.addEventListener('scroll', this.onScroll, { passive: true });

    this.http.get<any>(`${environment.apiUrl}/public/blogs/${this.slug}`).subscribe({
      next: (p) => {
        this.post.set(p);
        this.loading.set(false);
        if (p) {
          this.setupTags(p);
          this.setSeo(p);
          // build TOC + related after the HTML content renders
          setTimeout(() => { this.buildToc(); this.updateScroll(); }, 0);
          this.loadRelated(p);
        }
      },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }

  ngOnDestroy() { window.removeEventListener('scroll', this.onScroll); }

  private setupTags(p: any) {
    if (Array.isArray(p.tags) && p.tags.length) { this.tags.set(p.tags); return; }
    if (typeof p.tags === 'string' && p.tags.trim()) {
      this.tags.set(p.tags.split(',').map((t: string) => t.trim()).filter(Boolean));
      return;
    }
    // derive a couple of sensible tags from the category
    const cat = (p.category || 'Online Class Help');
    this.tags.set([cat, 'Study Tips', 'Student Guide']);
  }

  private setSeo(p: any) {
    const canonical = '/blog/' + (p.slug || this.slug);
    const desc = p.excerpt || `${p.title} — expert guidance from EduPilotHelp.`;
    this.seo.set({
      title: p.title + ' | EduPilotHelp Blog',
      description: desc,
      keywords: (p.category || 'online class help') + ', student guide, EduPilotHelp',
      canonical,
      schemas: [
        this.seo.articleSchema({
          title: p.title, description: desc, url: canonical,
          author: p.author || 'EduPilotHelp Team',
          datePublished: p.createdAt, dateModified: p.updatedAt || p.createdAt,
          category: p.category, image: p.coverImage
        }),
        this.seo.breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: p.title, url: canonical },
        ]),
      ],
    });
  }

  /** Parse the rendered article HTML, inject ids into headings, build the TOC. */
  private buildToc() {
    const content = document.querySelector('.bd-content');
    if (!content) return;
    const heads = Array.from(content.querySelectorAll('h2, h3')) as HTMLElement[];
    const items: TocItem[] = [];
    heads.forEach((h, i) => {
      if (!h.id) h.id = 'section-' + i + '-' + (h.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      h.style.scrollMarginTop = '100px';
      items.push({ id: h.id, text: h.textContent || '', level: h.tagName === 'H3' ? 3 : 2 });
    });
    this.toc.set(items);
  }

  private loadRelated(p: any) {
    this.http.get<any>(`${environment.apiUrl}/public/blogs?page=0&size=6`).subscribe({
      next: (res) => {
        const list = (res?.content || res || []) as any[];
        const rel = list.filter(x => (x.slug || '') !== (p.slug || this.slug)).slice(0, 3);
        this.related.set(rel);
      },
      error: () => {}
    });
  }

  private updateScroll() {
    const el = document.documentElement;
    const top = el.scrollTop || document.body.scrollTop;
    const h = el.scrollHeight - el.clientHeight;
    this.progress.set(h > 0 ? Math.min(100, Math.max(0, (top / h) * 100)) : 0);
    let current = this.toc()[0]?.id || '';
    for (const t of this.toc()) {
      const node = document.getElementById(t.id);
      if (node && node.getBoundingClientRect().top <= 140) current = t.id;
    }
    this.activeId.set(current);
  }

  scrollTo(id: string) {
    const node = document.getElementById(id);
    if (node) window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  }

  shareUrl(): string {
    return `${this.seoBase()}/blog/${this.post()?.slug || this.slug}`;
  }
  private seoBase() { return 'https://www.edupilothelp.com'; }

  share(network: string) {
    const url = encodeURIComponent(this.shareUrl());
    const title = encodeURIComponent(this.post()?.title || '');
    const map: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };
    if (map[network]) window.open(map[network], '_blank', 'noopener,width=600,height=500');
  }

  copyLink() {
    const url = this.shareUrl();
    navigator.clipboard?.writeText(url).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }).catch(() => {});
  }

  formatDate(d: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
