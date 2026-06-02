import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly SITE = 'EduPilotHelp';
  private readonly BASE_URL = 'https://www.edupilothelp.com';

  constructor(private meta: Meta, private title: Title) {}

  set(data: SeoData) {
    const fullTitle = data.title.includes(this.SITE)
      ? data.title
      : `${data.title} | ${this.SITE}`;

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: data.description });
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    if (data.canonical) {
      this.meta.updateTag({ property: 'og:url', content: `${this.BASE_URL}${data.canonical}` });
    }

    // Twitter
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });

    // Canonical
    const canonicalUrl = data.canonical
      ? `${this.BASE_URL}${data.canonical}`
      : this.BASE_URL;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }
}
