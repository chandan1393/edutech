import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoModel } from '../models/seo.model';
import {
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA
} from '../seo/structured-data';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSEO(seo: SeoModel): void {

    // Page Title
    this.title.setTitle(seo.title);

    // Description
    this.meta.updateTag({
      name: 'description',
      content: seo.description
    });

    // Keywords
    if (seo.keywords) {
      this.meta.updateTag({
        name: 'keywords',
        content: seo.keywords
      });
    }

    // Robots
    if (seo.robots) {
      this.meta.updateTag({
        name: 'robots',
        content: seo.robots
      });
    }

    // Open Graph
    this.meta.updateTag({
      property: 'og:title',
      content: seo.title
    });

    this.meta.updateTag({
      property: 'og:description',
      content: seo.description
    });

    this.meta.updateTag({
      property: 'og:type',
      content: seo.type
    });

    this.meta.updateTag({
      property: 'og:image',
      content: seo.image
    });

    this.meta.updateTag({
      property: 'og:url',
      content: seo.canonical
    });

    // Twitter Card
    if (seo.twitterCard) {
      this.meta.updateTag({
        name: 'twitter:card',
        content: seo.twitterCard
      });
    }

    // Canonical URL
    let canonical = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', seo.canonical);

    // Author
    if (seo.author) {
      this.meta.updateTag({
        name: 'author',
        content: seo.author
      });
    }

    // Published Time
    if (seo.publishedTime) {
      this.meta.updateTag({
        property: 'article:published_time',
        content: seo.publishedTime
      });
    }

    // Modified Time
    if (seo.modifiedTime) {
      this.meta.updateTag({
        property: 'article:modified_time',
        content: seo.modifiedTime
      });
    }

    // Image Alt
    if (seo.imageAlt) {
      this.meta.updateTag({
        property: 'og:image:alt',
        content: seo.imageAlt
      });
    }

    // Structured Data (JSON-LD)
    this.addSchema('organization-schema', ORGANIZATION_SCHEMA);
    this.addSchema('website-schema', WEBSITE_SCHEMA);
  }

  private addSchema(id: string, schema: any): void {

    // Remove old schema
    const existing = this.document.getElementById(id);

    if (existing) {
      existing.remove();
    }

    // Create new schema
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(schema);

    this.document.head.appendChild(script);
  }

}
