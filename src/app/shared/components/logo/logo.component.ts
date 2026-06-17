import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 76 84" fill="none"
         xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EduPilotHelp logo"
         [style.flex-shrink]="0">
      <!-- location pin -->
      <path [attr.d]="pinPath" fill="none" [attr.stroke]="pinColor" stroke-width="4"
            stroke-linecap="round" stroke-linejoin="round"/>
      <!-- graduation cap board -->
      <path d="M14 30 L38 19 L62 30 L38 41 Z" fill="none" [attr.stroke]="capColor"
            stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- cap tassel -->
      <path d="M38 41 L38 51 M52 34 L52 46 C 52 46, 46 51, 38 51" fill="none"
            [attr.stroke]="capColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  styles: [`:host{display:inline-flex;align-items:center;justify-content:center;line-height:0}`]
})
export class LogoComponent {
  /** pixel size of the square mark */
  @Input() size = 34;
  /** 'brand' = blue pin + teal cap (default), 'light' = white for dark backgrounds */
  @Input() variant: 'brand' | 'light' = 'brand';

  pinPath = 'M38 80 C 38 80, 12 50, 12 32 A 26 26 0 1 1 64 32 C 64 50, 38 80, 38 80 Z';

  get pinColor() { return this.variant === 'light' ? '#ffffff' : '#1e3a8a'; }
  get capColor() { return this.variant === 'light' ? '#5eead4' : '#0d9488'; }
}
