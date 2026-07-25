import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoModel } from '../models/seo.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private meta: Meta
  ) { }

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

    // Twitter
    if (seo.twitterCard) {
      this.meta.updateTag({
        name: 'twitter:card',
        content: seo.twitterCard
      });
    }

  }

}
