import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketingTagsService } from './core/services/marketing-tags.service';
import { CookieBannerComponent } from './shared/components/cookie-banner/cookie-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CookieBannerComponent],
  template: `
    <router-outlet />
    <app-cookie-banner />
  `
})
export class AppComponent implements OnInit {
  constructor(private tags: MarketingTagsService) {}
  ngOnInit() { this.tags.init(); }
}
