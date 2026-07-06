import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface LegalSection { id: string; title: string; }

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit, OnDestroy {
  progress = signal(0);
  activeId = signal('');

  sections: LegalSection[] = [
    { id: 'acceptance',  title: '1. Acceptance of Terms' },
    { id: 'service',     title: '2. Service Description' },
    { id: 'account',     title: '3. Account Responsibilities' },
    { id: 'payment',     title: '4. Payment Terms' },
    { id: 'refund',      title: '5. Refund Policy' },
    { id: 'confidential',title: '6. Confidentiality' },
    { id: 'quality',     title: '7. Service Quality' },
    { id: 'prohibited',  title: '8. Prohibited Uses' },
    { id: 'liability',   title: '9. Limitation of Liability' },
    { id: 'changes',     title: '10. Changes to Terms' },
  ];

  private onScroll = () => this.updateScroll();

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.scrollTo(0, 0);
    setTimeout(() => this.updateScroll(), 0);
  }
  ngOnDestroy() { window.removeEventListener('scroll', this.onScroll); }

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
