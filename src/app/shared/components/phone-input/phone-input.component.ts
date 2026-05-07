import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountryService, Country } from '../../../core/services/country.service';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="phi-wrap" [class.phi-dark]="theme==='dark'">
  <div class="phi-row" [class.invalid]="invalid">
    <!-- Country picker trigger -->
    <div class="phi-country" tabindex="0"
         (click)="toggleDrop()"
         (keydown.enter)="toggleDrop()"
         (keydown.escape)="open.set(false)">
      <span class="phi-flag">{{ selected().flag }}</span>
      <span class="phi-dial">{{ selected().dial }}</span>
      <span class="phi-caret">▾</span>
    </div>
    <!-- Phone input -->
    <input class="phi-input" type="tel" inputmode="numeric"
           [placeholder]="selected().example"
           [value]="phone"
           (input)="onInput($event)"
           (keydown)="onKeyDown($event)"
           (blur)="onBlur()"
           [attr.maxlength]="selected().maxLen" />
  </div>

  <!-- Dropdown — rendered outside phi-row to avoid overflow clip -->
  <div class="phi-drop" *ngIf="open()">
    <div class="phi-search">
      <input #searchInp type="text" [value]="searchQ()"
             (input)="searchQ.set($any($event.target).value)"
             placeholder="Search country..."
             (click)="$event.stopPropagation()" />
    </div>
    <div class="phi-list">
      <div class="phi-opt" *ngFor="let c of filtered()"
           (click)="pick(c); $event.stopPropagation()"
           [class.active]="c.code === selected().code">
        <span class="phi-flag">{{ c.flag }}</span>
        <span class="phi-name">{{ c.name }}</span>
        <span class="phi-dc">{{ c.dial }}</span>
      </div>
    </div>
  </div>

  <div class="phi-hint" *ngIf="invalid && errorMsg">{{ errorMsg }}</div>
</div>`,
  styles: [`
:host { display:block; position:relative }
.phi-wrap { position:relative }
.phi-row {
  display:flex;
  border:1.5px solid #e2e8f0;
  border-radius:10px;
  overflow:hidden;
  background:white;
  transition:border-color .15s;
  &:focus-within { border-color:#0d9488; box-shadow:0 0 0 3px rgba(13,148,136,.08) }
  &.invalid { border-color:#ef4444; &:focus-within { box-shadow:0 0 0 3px rgba(239,68,68,.08) } }
}
.phi-dark .phi-row {
  background:rgba(255,255,255,.05);
  border-color:rgba(255,255,255,.12);
  &:focus-within { border-color:#0d9488 }
}
.phi-country {
  display:flex; align-items:center; gap:5px;
  padding:10px 10px 10px 13px;
  cursor:pointer; border-right:1.5px solid #e2e8f0;
  user-select:none; flex-shrink:0;
  transition:background .15s;
  white-space:nowrap;
  &:hover { background:#f8fafc }
  &:focus { outline:none; background:#f0fdf9 }
}
.phi-dark .phi-country { border-right-color:rgba(255,255,255,.12); &:hover { background:rgba(255,255,255,.06) } }
.phi-flag { font-size:1.2rem; line-height:1 }
.phi-dial { font-size:.85rem; font-weight:700; color:#334155; min-width:34px }
.phi-dark .phi-dial { color:white }
.phi-caret { font-size:.58rem; color:#94a3b8 }
.phi-input {
  flex:1; background:none; border:none; outline:none;
  padding:10px 13px; font-size:.92rem; color:#0f172a;
  font-family:inherit; width:100%; min-width:0;
  &::placeholder { color:#94a3b8 }
}
.phi-dark .phi-input { color:white; &::placeholder { color:rgba(255,255,255,.3) } }

/* Dropdown */
.phi-drop {
  position:absolute;
  top:calc(100% + 6px);
  left:0;
  background:white;
  border:1.5px solid #e2e8f0;
  border-radius:13px;
  z-index:9999;
  width:260px;
  box-shadow:0 16px 48px rgba(0,0,0,.15);
  overflow:hidden;
}
.phi-dark .phi-drop { background:#1e2d3d; border-color:rgba(255,255,255,.12) }
.phi-search {
  padding:10px;
  border-bottom:1px solid #f1f5f9;
  input {
    width:100%; border:1.5px solid #e2e8f0; border-radius:8px;
    padding:8px 12px; font-size:.84rem; outline:none;
    color:#0f172a; font-family:inherit;
    &:focus { border-color:#0d9488 }
  }
}
.phi-dark .phi-search { border-bottom-color:rgba(255,255,255,.06);
  input { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.1); color:white }
}
.phi-list { max-height:220px; overflow-y:auto; padding:6px }
.phi-opt {
  display:flex; align-items:center; gap:9px;
  padding:9px 12px; border-radius:8px; cursor:pointer;
  transition:background .12s;
  &:hover, &.active { background:#f0fdf9 }
}
.phi-dark .phi-opt { &:hover, &.active { background:rgba(13,148,136,.1) } }
.phi-flag { font-size:1.1rem }
.phi-name { flex:1; font-size:.83rem; color:#0f172a; font-weight:500 }
.phi-dark .phi-name { color:rgba(255,255,255,.8) }
.phi-dc { font-size:.76rem; color:#64748b }
.phi-hint { font-size:.76rem; color:#ef4444; margin-top:5px; padding:0 2px }
  `]
})
export class PhoneInputComponent implements OnInit, OnDestroy {
  @Input() theme: 'light'|'dark' = 'light';
  @Input() invalid = false;
  @Input() errorMsg = '';
  @Input() defaultCountry = 'US';
  @Output() valueChange = new EventEmitter<{
    dial: string; phone: string; full: string; country: Country; valid: boolean
  }>();

  open     = signal(false);
  searchQ  = signal('');
  selected = signal<Country>(this.cs.countries[0]);
  phone    = '';

  filtered = computed(() => {
    const q = this.searchQ().toLowerCase().trim();
    if (!q) return this.cs.countries;
    return this.cs.countries.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  constructor(private cs: CountryService, private elRef: ElementRef) {}

  ngOnInit() {
    const def = this.cs.countries.find(c => c.code === this.defaultCountry) || this.cs.countries[0];
    this.selected.set(def);
  }

  ngOnDestroy() {}

  // Close on click outside
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (this.open() && !this.elRef.nativeElement.contains(e.target)) {
      this.open.set(false);
    }
  }

  toggleDrop() {
    this.open.update(v => !v);
    if (!this.open()) this.searchQ.set('');
  }

  pick(c: Country) {
    this.selected.set(c);
    this.open.set(false);
    this.searchQ.set('');
    this.emit();
  }

  // Digits-only input
  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/[^\d]/g, '');
    input.value = digitsOnly;          // update DOM immediately
    this.phone = digitsOnly;
    this.emit();
  }

  onKeyDown(e: KeyboardEvent) {
    const allowed = ['Backspace','Delete','Tab','Enter','Escape',
                     'ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
    if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  onBlur() { this.emit(); }

  private emit() {
    const clean = this.phone.replace(/[^\d]/g, '');
    const valid  = !clean || this.selected().pattern.test(clean);
    this.valueChange.emit({
      dial:    this.selected().dial,
      phone:   this.phone,
      full:    this.selected().dial + clean,
      country: this.selected(),
      valid
    });
  }
}
