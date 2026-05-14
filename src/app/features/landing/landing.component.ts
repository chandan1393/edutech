import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
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

  queryForm:   FormGroup;
  contactForm: FormGroup;
  textMeForm:  FormGroup;

  queryPhone   = { full: '', valid: true };
  contactPhone = { full: '', valid: true };
  textMePhone  = { full: '', valid: true };

  onQueryPhone(e: any)   { this.queryPhone   = e; }
  onContactPhone(e: any) { this.contactPhone = e; }
  onTextMePhone(e: any)  { this.textMePhone  = e; }

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
  navScrolled       = signal(false);
  activeStep        = signal(0);

  siteConfig        = signal<any>({
    company_name:    'EduAssist',
    company_email:   'support@edupilothelp.com',
    company_phone:   '+1 (800) 000-0000',
    whatsapp_number: '+1 (800) 000-0000',
    company_address: 'Available 24/7 Online'
  });

  testimonials = signal<any[]>([]);
  testiIndex   = signal(0);
  testiLeaving = signal(false);

  private testiTimer: any;
  private stepTimer: any;
  private scrollHandler: any;

  services = [
    {
      icon:'📚',
      title:'Full Online Class',
      tag:'Core Service',
      color:'#0d9488',
      desc:'Complete class management — every quiz, discussion, project and exam handled from day one to final grade.'
    },
    {
      icon:'📝',
      title:'Essays & Research',
      tag:'Most Popular',
      color:'#6366f1',
      desc:'APA, MLA, Chicago, Harvard — research papers, essays and reports crafted to your rubric.'
    },
    {
      icon:'💻',
      title:'Programming & CS',
      tag:'Tech',
      color:'#06b6d4',
      desc:'Python, Java, JavaScript, SQL and more — all coding labs and projects completed and tested.'
    },
    {
      icon:'📊',
      title:'Data & Statistics',
      tag:'STEM',
      color:'#10b981',
      desc:'SPSS, R, Excel and Python analysis — from raw data to professional interpretation reports.'
    },
    {
      icon:'🏦',
      title:'Business & MBA',
      tag:'High Demand',
      color:'#f59e0b',
      desc:'Case studies, business plans, strategy reports and financial modeling by MBA experts.'
    },
    {
      icon:'⚖️',
      title:'Law & Social Sciences',
      tag:'Specialized',
      color:'#8b5cf6',
      desc:'Legal briefs, case analyses, psychology and sociology coursework — citation-perfect.'
    },
  ];

  stats = [
    { value:'5,000+', label:'Students Helped',  icon:'🎓' },
    { value:'2,500+', label:'Classes Completed', icon:'📚' },
    { value:'150+',   label:'Verified Experts', icon:'✍️' },
    { value:'99%',    label:'On-Time Delivery', icon:'⚡' },
  ];

  howSteps = [
    {
      num:'01',
      icon:'📋',
      title:'Submit Your Class Details',
      desc:'Share your course name, institution, portal URL and class dates. Completely free — no commitment.',
      badge:'Takes 3 minutes',
      color:'#0d9488'
    },
    {
      num:'02',
      icon:'📋',
      title:'Receive Custom Price Plan',
      desc:'Our admin reviews your class workload and sends an installment plan. You approve every detail.',
      badge:'Within 24 hours',
      color:'#6366f1'
    },
    {
      num:'03',
      icon:'✍️',
      title:'Expert Takes Full Control',
      desc:'Your verified expert logs into your portal and handles every assignment, quiz and discussion.',
      badge:'After 1st payment',
      color:'#06b6d4'
    },
    {
      num:'04',
      icon:'📦',
      title:'Download & You\'re Done',
      desc:'Work is admin-reviewed, packaged as a ZIP, and available in your dashboard before each deadline.',
      badge:'On or before deadline',
      color:'#f59e0b'
    },
  ];

  faqs = [
    {
      q:'How do you complete my online class?',
      a:'You share your institutional portal credentials and class details. Our verified expert logs in directly and handles all coursework — quizzes, discussions, projects and exams — throughout the entire class duration.'
    },
    {
      q:'How much does it cost?',
      a:'Pricing is custom based on the course, number of credits, duration and workload. Submit your class details and we\'ll send a detailed installment plan within 24 hours. There\'s no charge to request a quote.'
    },
    {
      q:'When will a writer be assigned to my class?',
      a:'Once you approve the payment plan and confirm your first installment, your expert is assigned and begins working immediately — typically within a few hours.'
    },
    {
      q:'Are my credentials and information secure?',
      a:'Yes. Your portal credentials are encrypted and only accessible to your assigned expert and our admin team. We never store credentials after class completion. Your identity is never disclosed to the writer.'
    },
    {
      q:'What if I\'m unhappy with the delivered work?',
      a:'We offer unlimited revisions within 7 days of delivery. Our quality team reviews all work before delivery to ensure it meets the agreed standards.'
    },
    {
      q:'Which institutions and LMS platforms do you support?',
      a:'We support all major Learning Management Systems — Canvas, Blackboard, Moodle, D2L, Coursera, edX, and institutional portals — across universities in the USA, UK, Canada, Australia and 40+ other countries.'
    },
  ];

  subjects = [
    'Mathematics','Statistics','Calculus','Python','Java','JavaScript','SQL','Data Science',
    'Machine Learning','Business Administration','MBA','Finance','Accounting','Marketing',
    'Biology','Chemistry','Anatomy','Nursing','Psychology','Sociology','History',
    'Political Science','Law','Criminal Justice','Economics','Literature','Philosophy',
  ];

  trustBadges = [
    { icon:'🔒', label:'256-bit SSL Encrypted' },
    { icon:'🛡️', label:'Confidential & Private' },
    { icon:'💳', label:'Secure Stripe Payments' },
    { icon:'✅', label:'Verified Expert Writers' },
  ];

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
      phone:   [''],
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
      agree: [true]
    });
  }

  ngOnInit() {
    this.loadSiteConfig();
    this.setStaticTestimonials();
    this.startTestiTimer();
    this.startStepRotation();

    this.scrollHandler = () =>
      this.navScrolled.set(window.scrollY > 30);

    window.addEventListener('scroll', this.scrollHandler, {
      passive: true
    });
  }

  ngOnDestroy() {
    this.stopTestiTimer();

    if (this.stepTimer)
      clearInterval(this.stepTimer);

    if (this.scrollHandler)
      window.removeEventListener('scroll', this.scrollHandler);
  }

  loadSiteConfig() {
    this.api.getPublicConfig().subscribe({
      next:(c: any) => this.siteConfig.set(c),
      error:() => {}
    });
  }

  setStaticTestimonials() {
    this.testimonials.set([
      {
        rating:5,
        text:'I was working full-time and taking two online courses. EduAssist handled both completely. Got A\'s in both. The expert was always ahead of deadlines.',
        studentName:'Marcus T.',
        course:'MBA — Operations Management',
        avatar:'MT'
      },
      {
        rating:5,
        text:'My Java programming class was overwhelming. The expert completed every lab, passed all autograders and even explained the code so I actually learned. Incredible service.',
        studentName:'Priya S.',
        course:'Computer Science — Java Programming',
        avatar:'PS',
        alt:true
      },
      {
        rating:5,
        text:'International student, tight on time, my English not perfect. EduAssist handled my entire Nursing class. Every discussion, every quiz. Delivered before deadline every time.',
        studentName:'Amara O.',
        course:'Nursing — Healthcare Management',
        avatar:'AO'
      }
    ]);
  }

  testiGroups(): any[][] {
    const all = this.testimonials();
    const groups: any[][] = [];

    for (let i = 0; i < all.length; i += 3) {
      groups.push(all.slice(i, i + 3));
    }

    return groups;
  }

  nextTesti() {
    const t = this.testiGroups().length;
    if (t <= 1) return;

    this.testiLeaving.set(true);

    setTimeout(() => {
      this.testiIndex.set((this.testiIndex() + 1) % t);
      this.testiLeaving.set(false);
    }, 380);
  }

  prevTesti() {
    const t = this.testiGroups().length;
    if (t <= 1) return;

    this.testiLeaving.set(true);

    setTimeout(() => {
      this.testiIndex.set((this.testiIndex() - 1 + t) % t);
      this.testiLeaving.set(false);
    }, 380);
  }

  goToTesti(i: number) {
    if (i === this.testiIndex()) return;

    this.testiLeaving.set(true);

    setTimeout(() => {
      this.testiIndex.set(i);
      this.testiLeaving.set(false);
    }, 380);
  }

  startTestiTimer() {
    this.testiTimer = setInterval(() => this.nextTesti(), 6000);
  }

  stopTestiTimer() {
    if (this.testiTimer)
      clearInterval(this.testiTimer);
  }

  startStepRotation() {
    this.stepTimer = setInterval(() => {
      this.activeStep.set((this.activeStep() + 1) % 4);
    }, 2500);
  }

  submitQuery() {
    this.queryForm.markAllAsTouched();

    if (this.queryForm.invalid) return;

    this.querySubmitting.set(true);
    this.queryError.set('');

    this.api.submitQuery({
      ...this.queryForm.value,
      phone: this.queryPhone.full
    }).subscribe({
      next: (res: any) => {
        this.querySuccess.set(
          res.message || 'We\'ll send your custom plan within 24 hours!'
        );

        this.queryForm.reset();
        this.querySubmitting.set(false);
      },

      error: (err: any) => {
        this.queryError.set(
          err.error?.message || 'Submission failed. Please try again.'
        );

        this.querySubmitting.set(false);
      }
    });
  }

  submitContact() {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) return;

    this.contactSubmitting.set(true);

    this.api.submitContact({
      ...this.contactForm.value,
      phone: this.contactPhone.full
    }).subscribe({
      next: (res: any) => {
        this.contactSuccess.set(
          res.message || 'Message received! We\'ll reply within a few hours.'
        );

        this.contactForm.reset();
        this.contactSubmitting.set(false);
      },

      error: (err: any) => {
        this.contactError.set(
          err.error?.message || 'Failed. Please email us directly.'
        );

        this.contactSubmitting.set(false);
      }
    });
  }

  submitTextMe() {

    if (!this.textMePhone.full || !this.textMePhone.valid) {
      this.textMeError.set('Please enter a valid mobile number.');
      return;
    }

    this.textMeSubmitting.set(true);
    this.textMeError.set('');

    this.api.submitTextMe(this.textMePhone.full, '').subscribe({
      next: (res: any) => {
        this.textMeSuccess.set(
          'Our team will WhatsApp you within 5 minutes!'
        );

        this.textMeSubmitting.set(false);
      },

      error: (err: any) => {
        this.textMeError.set(
          err.error?.message || 'Failed. Please try again.'
        );

        this.textMeSubmitting.set(false);
      }
    });
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior:'smooth',
      block:'start'
    });

    this.mobileMenuOpen.set(false);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  toggleFaq(i: number) {
    this.activeFaq.set(
      this.activeFaq() === i ? -1 : i
    );
  }
}
