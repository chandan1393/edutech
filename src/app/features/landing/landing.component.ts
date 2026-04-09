import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { CountryService, Country } from '../../core/services/country.service';
import { PhoneInputComponent } from '../../shared/components/phone-input/phone-input.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PhoneInputComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  // ── Forms ────────────────────────────────────────────────────────────────
  queryForm:   FormGroup;
  contactForm: FormGroup;
  textMeForm:  FormGroup;

  // Phone data (from PhoneInputComponent valueChange events)
  queryPhone   = { full: '', valid: true };
  contactPhone = { full: '', valid: true };
  textMePhone  = { full: '', valid: true };

  onQueryPhone(e: any)   { this.queryPhone   = e; }
  onContactPhone(e: any) { this.contactPhone = e; }
  onTextMePhone(e: any)  { this.textMePhone  = e; }

  // ── Signals ──────────────────────────────────────────────────────────────
  querySubmitting   = signal(false);
  contactSubmitting = signal(false);
  textMeSubmitting  = signal(false);
  querySuccess      = signal('');
  contactSuccess    = signal('');
  textMeSuccess     = signal('');
  queryError        = signal('');
  contactError      = signal('');
  textMeError       = signal('');
  mobileMenuOpen    = signal(false);
  activeFaq         = signal(-1);
  siteConfig        = signal<any>({
    company_name:    'EduAssist',
    company_tagline: 'Expert Online Class Support',
    company_email:   'support@eduassist.com',
    company_phone:   '+1 800 000 0000',
    whatsapp_number: '+1 800 000 0000'
  });
  testimonials  = signal<any[]>([]);
  testiIndex    = signal(0);
  testiLeaving  = signal(false);
  private testiTimer: any;

  // ── Static data ─────────────────────────────────────────────────────────
  services = [
    { icon: '📚', title: 'Full Online Class',     tag: 'Core Service', color: '#0d9488', desc: 'We manage your entire online class from start to finish — quizzes, discussions, projects, exams.' },
    { icon: '📝', title: 'Essay & Papers',         tag: 'Most Popular', color: '#6366f1', desc: 'Academic essays, research papers and reports in any format — APA, MLA, Chicago, Harvard.' },
    { icon: '💻', title: 'Programming Classes',    tag: 'Tech',         color: '#06b6d4', desc: 'All coding labs done — Python, Java, JS, C++, SQL, web dev and more.' },
    { icon: '📊', title: 'Data & Statistics',      tag: 'STEM',         color: '#10b981', desc: 'SPSS, R, Python data analysis, statistics homework and full interpretation reports.' },
    { icon: '🏦', title: 'Business & MBA',         tag: 'High Demand',  color: '#f59e0b', desc: 'Case studies, business plans, strategy papers, finance and accounting assignments.' },
    { icon: '⚖️', title: 'Law & Social Sciences', tag: 'Specialized',  color: '#8b5cf6', desc: 'Legal briefs, case analyses, psychology reports, sociology and political science papers.' },
  ];

  stats = [
    { value: '2,500+', label: 'Classes Completed', icon: '🎓' },
    { value: '5,000+', label: 'Happy Students',    icon: '😊' },
    { value: '150+',   label: 'Expert Writers',    icon: '✍️' },
    { value: '99%',    label: 'On-Time Delivery',  icon: '⚡' },
  ];

  howSteps = [
    { icon:'📚', title:'Submit Class Details',  desc:'Share your course name, institution, class dates and portal credentials.', tag:'Takes 3 minutes' },
    { icon:'💳', title:'Approve Payment Plan', desc:'Admin sets an installment plan. You approve before paying a single cent.', tag:'Within 24 hours' },
    { icon:'✍️', title:'Expert Takes Over',    desc:'Expert logs into your portal and handles every task throughout the class.', tag:'After 1st payment' },
    { icon:'📦', title:'Download Your Work',   desc:'Work is packaged as a ZIP, reviewed by admin, ready for download anytime.', tag:'On or before deadline' },
  ];

  faqs = [
    { q: 'How does the online class service work?',       a: 'You submit your class details and portal credentials. Our verified expert logs in and manages every quiz, discussion, project and exam from start to end date.' },
    { q: 'How much does it cost?',                        a: 'Pricing depends on the course, duration, and workload. Admin reviews your class and sets a custom installment plan within 24 hours of your submission.' },
    { q: 'When is a writer assigned?',                    a: 'After the first installment is confirmed, a verified expert writer is assigned. They begin working immediately.' },
    { q: 'How do I receive completed class work?',        a: 'Completed work is packaged as a ZIP file, reviewed by admin, then available to download from your student dashboard.' },
    { q: 'Is my information kept confidential?',          a: 'Yes. Your identity and portal credentials are never disclosed. Writers only know the class details — never the student behind it.' },
    { q: 'What if I need to change my portal credentials?', a: 'You can update credentials anytime from your dashboard. The assigned writer is notified automatically.' },
  ];

  // ── Constructor ──────────────────────────────────────────────────────────
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private http: HttpClient,
    public cs: CountryService
  ) {
    this.queryForm = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      email:   ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone:   [''],                       // set from PhoneInputComponent
      subject: ['', [Validators.required, Validators.maxLength(150)]],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
    });
    this.contactForm = this.fb.group({
      name:    ['', [Validators.required, Validators.minLength(2)]],
      email:   ['', [Validators.required, Validators.email]],
      phone:   [''],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });
    this.textMeForm = this.fb.group({
      // Validation handled by PhoneInputComponent — this form just tracks submission state
      agree: [true]
    });
  }

  ngOnInit()  { this.loadSiteConfig(); this.loadTestimonials(); }
  ngOnDestroy() { this.stopTestiTimer(); }

  // ── Backend data ─────────────────────────────────────────────────────────
  loadSiteConfig() {
    this.api.getPublicConfig().subscribe({ next: (c: any) => this.siteConfig.set(c), error: () => {} });
  }
  loadTestimonials() {
    this.api.getTestimonials().subscribe({
      next: (data: any[]) => { this.testimonials.set(data); if (data.length) this.startTestiTimer(); },
      error: () => {}
    });
  }

  // ── Testimonial carousel ─────────────────────────────────────────────────
  testiGroups(): any[][] {
    const all = this.testimonials();
    if (!all.length) return [];
    const groups: any[][] = [];
    for (let i = 0; i < all.length; i += 3) groups.push(all.slice(i, i + 3));
    return groups.slice(0, 3);
  }
  nextTesti() {
    const t = this.testiGroups().length; if (t <= 1) return;
    this.testiLeaving.set(true);
    setTimeout(() => { this.testiIndex.set((this.testiIndex() + 1) % t); this.testiLeaving.set(false); }, 420);
  }
  prevTesti() {
    const t = this.testiGroups().length; if (t <= 1) return;
    this.testiLeaving.set(true);
    setTimeout(() => { this.testiIndex.set((this.testiIndex() - 1 + t) % t); this.testiLeaving.set(false); }, 420);
  }
  goToTesti(i: number) {
    if (i === this.testiIndex()) return;
    this.testiLeaving.set(true);
    setTimeout(() => { this.testiIndex.set(i); this.testiLeaving.set(false); }, 420);
  }
  startTestiTimer() { this.testiTimer = setInterval(() => this.nextTesti(), 5000); }
  stopTestiTimer()  { if (this.testiTimer) clearInterval(this.testiTimer); }

  // ── Form submissions ─────────────────────────────────────────────────────
  submitQuery() {
    this.queryForm.markAllAsTouched();
    if (this.queryForm.invalid) return;
    this.querySubmitting.set(true); this.queryError.set('');
    const data = { ...this.queryForm.value, phone: this.queryPhone.full };
    this.api.submitQuery(data).subscribe({
      next: (res: any) => {
        this.querySuccess.set(res.message || 'Query submitted! We will contact you shortly.');
        this.queryForm.reset(); this.queryPhone = { full: '', valid: true };
        this.querySubmitting.set(false);
      },
      error: (err: any) => {
        this.queryError.set(err.error?.message || 'Submission failed. Please try again.');
        this.querySubmitting.set(false);
      }
    });
  }

  submitContact() {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) return;
    this.contactSubmitting.set(true); this.contactError.set('');
    const data = { ...this.contactForm.value, phone: this.contactPhone.full };
    this.api.submitContact(data).subscribe({
      next: (res: any) => {
        this.contactSuccess.set(res.message || 'Message sent! We will get back to you soon.');
        this.contactForm.reset(); this.contactPhone = { full: '', valid: true };
        this.contactSubmitting.set(false);
      },
      error: (err: any) => {
        this.contactError.set(err.error?.message || 'Failed to send. Please try again.');
        this.contactSubmitting.set(false);
      }
    });
  }

  submitTextMe() {
    if (!this.textMePhone.full || !this.textMePhone.valid) {
      this.textMeError.set('Please select your country and enter a valid mobile number.');
      return;
    }
    this.textMeSubmitting.set(true); this.textMeError.set('');
    this.api.submitTextMe(this.textMePhone.full, '').subscribe({
      next: (res: any) => {
        this.textMeSuccess.set(res.message || 'Thanks! Our team will WhatsApp you shortly at ' + this.textMePhone.full);
        this.textMePhone = { full: '', valid: true };
        this.textMeSubmitting.set(false);
      },
      error: (err: any) => {
        this.textMeError.set(err.error?.message || 'Failed to submit. Please try again.');
        this.textMeSubmitting.set(false);
      }
    });
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.mobileMenuOpen.set(false);
  }
  goToLogin()    { this.router.navigate(['/login']); }
  toggleFaq(i: number) { this.activeFaq.set(this.activeFaq() === i ? -1 : i); }
  companyName(): string { return this.siteConfig()?.company_name || 'EduAssist'; }
}
