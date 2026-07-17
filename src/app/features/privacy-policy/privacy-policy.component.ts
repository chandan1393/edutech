import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface LegalSection { id: string; title: string; }

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  progress = signal(0);
  activeId = signal('');

  sections: LegalSection[] = [
    { id: 'collect',   title: '1. Information We Collect' },
    { id: 'use',       title: '2. How We Use Your Information' },
    { id: 'cookies',   title: '3. Cookies & Local Storage' },
    { id: 'sharing',   title: '4. Data Sharing' },
    { id: 'retention', title: '5. Data Retention' },
    { id: 'rights',    title: '6. Your Rights' },
    { id: 'security',  title: '7. Security' },
  ];

  private onScroll = () => this.updateScroll();

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.scrollTo(0, 0);
    setTimeout(() => this.updateScroll(), 0);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  private updateScroll() {
    const el = document.documentElement;
    const scrollTop = el.scrollTop || document.body.scrollTop;
    const height = el.scrollHeight - el.clientHeight;
    this.progress.set(height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0);

    let current = this.sections[0]?.id ?? '';
    for (const s of this.sections) {
      const node = document.getElementById(s.id);
      if (node && node.getBoundingClientRect().top <= 140) current = s.id;
    }
    this.activeId.set(current);
  }

  scrollTo(id: string) {
    const node = document.getElementById(id);
    if (node) {
      const y = node.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
