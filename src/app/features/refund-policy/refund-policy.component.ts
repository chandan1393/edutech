import { SeoService } from '../../core/services/seo.service';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';
@Component({ selector: 'app-refund-policy', standalone: true, imports: [RouterLink, SiteFooterComponent],
  templateUrl: './refund-policy.component.html', styleUrls: ['./refund-policy.component.scss'] })
export class RefundPolicyComponent {}
