import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

/**
 * Animates a number counting up when it scrolls into view.
 * Usage: <strong appCountUp>5,000+</strong>
 * Parses the numeric part of the element's text, keeps any prefix/suffix
 * (e.g. "$", "+", "%", ","), and counts from 0 to the target once visible.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input() duration = 1400;

  private observer?: IntersectionObserver;
  private done = false;
  private prefix = '';
  private suffix = '';
  private target = 0;
  private decimals = 0;
  private hasComma = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const raw = (this.el.nativeElement.textContent || '').trim();
    const match = raw.match(/[\d,]+(\.\d+)?/);
    if (!match) return; // nothing numeric to animate

    const numStr = match[0];
    this.prefix = raw.slice(0, match.index!);
    this.suffix = raw.slice(match.index! + numStr.length);
    this.hasComma = numStr.includes(',');
    const clean = numStr.replace(/,/g, '');
    this.decimals = clean.includes('.') ? (clean.split('.')[1].length) : 0;
    this.target = parseFloat(clean);

    if (!('IntersectionObserver' in window) || isNaN(this.target)) {
      return; // leave original text as-is
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !this.done) {
          this.done = true;
          this.animate();
          this.observer?.disconnect();
        }
      });
    }, { threshold: 0.4 });
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() { this.observer?.disconnect(); }

  private format(val: number): string {
    let s = val.toFixed(this.decimals);
    if (this.hasComma) {
      const parts = s.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      s = parts.join('.');
    }
    return this.prefix + s + this.suffix;
  }

  private animate() {
    const start = performance.now();
    const el = this.el.nativeElement;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / this.duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = this.format(this.target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = this.format(this.target);
    };
    requestAnimationFrame(step);
  }
}
