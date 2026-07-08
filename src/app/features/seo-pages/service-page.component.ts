import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { SERVICE_PAGES, ServicePageData } from './service-pages.data';
import { LMS_PAGES } from './lms-pages.data';
import { SUBJECT_PAGES } from './subject-pages.data';
import { EXAM_PAGES } from './exam-pages.data';
import { UNIVERSITY_PAGES } from './university-pages.data';

@Component({
  selector: 'app-service-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss']
})
export class ServicePageComponent implements OnInit {
  data!: ServicePageData;
  activeFaq = signal(-1);
  toggle(i: number) { this.activeFaq.set(this.activeFaq() === i ? -1 : i); }

  constructor(private route: ActivatedRoute, private router: Router, private seo: SeoService) {}

  ngOnInit() {
    // Slug comes from route data (set per-route) or the URL path.
    const slug: string = this.route.snapshot.data['slug']
      || this.router.url.replace(/^\//, '').split(/[?#]/)[0];
    const page = SERVICE_PAGES[slug] || LMS_PAGES[slug] || SUBJECT_PAGES[slug] || EXAM_PAGES[slug] || UNIVERSITY_PAGES[slug];
    if (!page) { this.router.navigate(['/']); return; }
    this.data = page;

    const canonical = `/${page.slug}`;
    this.seo.set({
      title: page.title,
      description: page.metaDescription,
      keywords: page.keywords,
      canonical,
      schemas: [
        this.seo.serviceSchema(page.badge, page.metaDescription, canonical),
        this.seo.faqSchema(page.faqs),
        this.seo.breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: page.badge, url: canonical },
        ]),
      ],
    });
    window.scrollTo(0, 0);
  }
}
