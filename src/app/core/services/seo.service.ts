import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  /** Optional JSON-LD schema objects to inject for this page. */
  schemas?: any[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly SITE = 'EduPilotHelp';
  private readonly BASE_URL = 'https://www.edupilothelp.com';
  private readonly LD_ATTR = 'data-page-ld';

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
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    if (data.canonical) {
      this.meta.updateTag({ property: 'og:url', content: `${this.BASE_URL}${data.canonical}` });
    }

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });

    // Canonical
    const canonicalUrl = data.canonical ? `${this.BASE_URL}${data.canonical}` : this.BASE_URL;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    // Per-page JSON-LD schema
    this.clearSchemas();
    if (data.schemas && data.schemas.length) {
      data.schemas.forEach(schema => this.injectSchema(schema));
    }
  }

  /** Remove any page-scoped JSON-LD from a previous route. */
  private clearSchemas() {
    document.querySelectorAll(`script[${this.LD_ATTR}]`).forEach(el => el.remove());
  }

  private injectSchema(schema: any) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(this.LD_ATTR, 'true');
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /** Helper: build a Service schema object. */
  serviceSchema(name: string, description: string, url: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: name,
      name,
      description,
      url: `${this.BASE_URL}${url}`,
      provider: { '@type': 'Organization', name: this.SITE, url: this.BASE_URL },
      areaServed: ['US', 'CA', 'GB', 'AU'],
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' }
    };
  }

  /** Helper: build a FAQPage schema from Q/A pairs. */
  faqSchema(faqs: { q: string; a: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    };
  }

  /** Helper: build a BreadcrumbList schema. */
  breadcrumbSchema(items: { name: string; url: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        item: `${this.BASE_URL}${it.url}`
      }))
    };
  }

  /** Helper: build a BlogPosting/Article schema. */
  articleSchema(a: {
    title: string; description: string; url: string; author: string;
    datePublished?: string; dateModified?: string; category?: string; image?: string;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.description,
      url: `${this.BASE_URL}${a.url}`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${this.BASE_URL}${a.url}` },
      author: { '@type': 'Organization', name: a.author || this.SITE, url: this.BASE_URL },
      publisher: {
        '@type': 'Organization',
        name: this.SITE,
        url: this.BASE_URL,
        logo: { '@type': 'ImageObject', url: `${this.BASE_URL}/favicon.svg` }
      },
      ...(a.datePublished ? { datePublished: a.datePublished } : {}),
      ...(a.dateModified ? { dateModified: a.dateModified } : {}),
      ...(a.category ? { articleSection: a.category } : {}),
      ...(a.image ? { image: a.image } : {})
    };
  }
}
