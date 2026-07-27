export interface SeoModel {
  title: string;
  description: string;
  canonical: string;

  keywords?: string;
  robots?: string;

  image?: string;
  imageAlt?: string;

  type?: 'website' | 'article' | 'service';

  author?: string;

  publishedTime?: string;
  modifiedTime?: string;

  twitterCard?: string;
}
