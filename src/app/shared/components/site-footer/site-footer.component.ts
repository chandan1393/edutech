import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { WHATSAPP_DISPLAY, waLink, WA_MESSAGES } from '../../../core/constants/contact.constants';

/**
 * Shared site footer (plus the floating WhatsApp button).
 * Used on every public page so footer links and contact details
 * stay identical site-wide.
 */
@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent],
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss']
})
export class SiteFooterComponent {
  waDisplay = WHATSAPP_DISPLAY;
  waGeneralLink = waLink(WA_MESSAGES.general);

  constructor(private router: Router) {}

  goToLogin() { this.router.navigate(['/login']); }

  /**
   * The contact form lives on the landing page. If we're already there just
   * scroll; otherwise navigate home and scroll once the view has rendered.
   */
  goToContact() {
    const scroll = () => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    if (this.router.url.split(/[?#]/)[0] === '/') {
      scroll();
    } else {
      this.router.navigate(['/']).then(() => setTimeout(scroll, 120));
    }
  }
}
