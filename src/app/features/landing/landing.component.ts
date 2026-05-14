import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import { CountryService } from '../../core/services/country.service';
import { PhoneInputComponent } from '../../shared/components/phone-input/phone-input.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PhoneInputComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {

  /* =========================================================
     FORMS
  ========================================================= */

  queryForm: FormGroup;
  contactForm: FormGroup;
  textMeForm: FormGroup;

  queryPhone = {
    full: '',
    valid: true
  };

  contactPhone = {
    full: '',
    valid: true
  };

  textMePhone = {
    full: '',
    valid: true
  };

  onQueryPhone(event: any) {
    this.queryPhone = event;
  }

  onContactPhone(event: any) {
    this.contactPhone = event;
  }

  onTextMePhone(event: any) {
    this.textMePhone = event;
  }

  /* =========================================================
     UI STATE
  ========================================================= */

  querySubmitting = signal(false);
  contactSubmitting = signal(false);
  textMeSubmitting = signal(false);

  querySuccess = signal('');
  contactSuccess = signal('');
  textMeSuccess = signal('');

  queryError = signal('');
  contactError = signal('');
  textMeError = signal('');

  navScrolled = signal(false);
  mobileMenuOpen = signal(false);

  activeFaq = signal<number | null>(null);

  currentTestimonial = signal(0);

  /* =========================================================
     SITE CONFIG
  ========================================================= */

  siteConfig = signal<any>({
    company_name: 'EduPilotHelp',
    company_email: 'support@edupilothelp.com',
    company_phone: '+1 (800) 000-0000',
    whatsapp_number: '+1 (800) 000-0000',
    company_address: 'Available Online 24/7'
  });

  /* =========================================================
     SERVICES
  ========================================================= */

  services = [
    {
      icon: '📚',
      title: 'Full Online Class Help',
      tag: 'Most Popular',
      description:
        'Complete online course management including quizzes, assignments, discussions, exams and projects.'
    },
    {
      icon: '💻',
      title: 'Programming Assignments',
      tag: 'Tech',
      description:
        'Python, Java, SQL, JavaScript, C++, Machine Learning and all computer science coursework.'
    },
    {
      icon: '📊',
      title: 'Statistics & Data Science',
      tag: 'STEM',
      description:
        'SPSS, Excel, R Studio, Data Analytics, Regression and advanced statistics assignments.'
    },
    {
      icon: '🏦',
      title: 'Business & MBA',
      tag: 'High Demand',
      description:
        'Case studies, business reports, finance, accounting, economics and MBA coursework.'
    },
    {
      icon: '⚕️',
      title: 'Nursing & Healthcare',
      tag: 'Healthcare',
      description:
        'Nursing assignments, care plans, healthcare discussions and medical coursework.'
    },
    {
      icon: '📝',
      title: 'Essays & Research Papers',
      tag: 'Writing',
      description:
        'APA, MLA, Harvard and Chicago style academic writing by professional experts.'
    }
  ];

  /* =========================================================
     STATS
  ========================================================= */

  stats = [
    {
      value: '5,000+',
      label: 'Students Helped'
    },
    {
      value: '2,500+',
      label: 'Classes Completed'
    },
    {
      value: '150+',
      label: 'Verified Experts'
    },
    {
      value: '99%',
      label: 'On-Time Delivery'
    }
  ];

  /* =========================================================
     TESTIMONIALS
  ========================================================= */

  testimonials = [
    {
      rating: 5,
      text:
        'I was overwhelmed with my MBA classes while working full-time. EduPilotHelp handled everything professionally and I finished with A grades.',
      name: 'Marcus T.',
      course: 'MBA — Operations Management',
      avatar: 'MT'
    },
    {
      rating: 5,
      text:
        'My Java programming course was extremely difficult. Every coding lab and project was completed perfectly and on time.',
      name: 'Priya S.',
      course: 'Computer Science',
      avatar: 'PS'
    },
    {
      rating: 5,
      text:
        'The communication was excellent and deadlines were always met early. Highly recommend for busy students.',
      name: 'David M.',
      course: 'Business Administration',
      avatar: 'DM'
    }
  ];

  /* =========================================================
     FAQ
  ========================================================= */

  faqs = [
    {
      question: 'How does your online class help service work?',
      answer:
        'You submit your class details and our expert manages the coursework including quizzes, assignments, discussions and exams.'
    },
    {
      question: 'Are my details secure?',
      answer:
        'Yes. All information is encrypted and handled confidentially by our admin and assigned expert only.'
    },
    {
      question: 'How fast can I get started?',
      answer:
        'Most students receive a pricing plan and expert assignment within a few hours.'
    },
    {
      question: 'Do you guarantee deadlines?',
      answer:
        'Yes. We guarantee on-time delivery for all assignments, quizzes and projects.'
    },
    {
      question: 'Which subjects do you support?',
      answer:
        'We support Business, Computer Science, Nursing, Statistics, Law, Psychology, Finance and many more.'
    }
  ];

  /* =========================================================
     TRUST BADGES
  ========================================================= */

  trustBadges = [
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Protected checkout and encrypted transactions.'
    },
    {
      icon: '🛡️',
      title: 'Private & Confidential',
      description: 'Your information remains fully protected.'
    },
    {
      icon: '⚡',
      title: 'Fast Response',
      description: 'Experts available 24/7 for urgent classes.'
    },
    {
      icon: '✅',
      title: 'Verified Experts',
      description: 'Experienced professionals in every subject.'
    }
  ];

  /* =========================================================
     TIMERS
  ========================================================= */

  private testimonialTimer: any;
  private scrollHandler: any;

  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    public cs: CountryService
  ) {

    this.queryForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      subject: [
        '',
        [
          Validators.required
        ]
      ],

      message: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(2000)
        ]
      ]
    });

    this.contactForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ]
    });

    this.textMeForm = this.fb.group({
      agree: [true]
    });
  }

  /* =========================================================
     INIT
  ========================================================= */

  ngOnInit(): void {

    this.loadSiteConfig();

    this.startTestimonialRotation();

    this.scrollHandler = () => {
      this.navScrolled.set(window.scrollY > 30);
    };

    window.addEventListener(
      'scroll',
      this.scrollHandler,
      { passive: true }
    );
  }

  ngOnDestroy(): void {

    if (this.testimonialTimer) {
      clearInterval(this.testimonialTimer);
    }

    if (this.scrollHandler) {
      window.removeEventListener(
        'scroll',
        this.scrollHandler
      );
    }
  }

  /* =========================================================
     CONFIG
  ========================================================= */

  loadSiteConfig(): void {

    this.api.getPublicConfig().subscribe({
      next: (config: any) => {
        this.siteConfig.set(config);
      },
      error: () => {}
    });
  }

  /* =========================================================
     TESTIMONIALS
  ========================================================= */

  startTestimonialRotation(): void {

    this.testimonialTimer = setInterval(() => {

      const next =
        (this.currentTestimonial() + 1) %
        this.testimonials.length;

      this.currentTestimonial.set(next);

    }, 5000);
  }

  setTestimonial(index: number): void {
    this.currentTestimonial.set(index);
  }

  /* =========================================================
     FAQ
  ========================================================= */

  toggleFaq(index: number): void {

    if (this.activeFaq() === index) {
      this.activeFaq.set(null);
      return;
    }

    this.activeFaq.set(index);
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  scrollTo(id: string): void {

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    this.mobileMenuOpen.set(false);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /* =========================================================
     FORM SUBMISSION
  ========================================================= */

  submitQuery(): void {

    this.queryForm.markAllAsTouched();

    if (this.queryForm.invalid) {
      return;
    }

    this.querySubmitting.set(true);
    this.queryError.set('');

    const payload = {
      ...this.queryForm.value,
      phone: this.queryPhone.full
    };

    this.api.submitQuery(payload).subscribe({

      next: (response: any) => {

        this.querySuccess.set(
          response?.message ||
          'Your request has been submitted successfully.'
        );

        this.queryForm.reset();

        this.querySubmitting.set(false);
      },

      error: (error: any) => {

        this.queryError.set(
          error?.error?.message ||
          'Submission failed. Please try again.'
        );

        this.querySubmitting.set(false);
      }
    });
  }

  submitContact(): void {

    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      return;
    }

    this.contactSubmitting.set(true);
    this.contactError.set('');

    const payload = {
      ...this.contactForm.value,
      phone: this.contactPhone.full
    };

    this.api.submitContact(payload).subscribe({

      next: (response: any) => {

        this.contactSuccess.set(
          response?.message ||
          'Message received successfully.'
        );

        this.contactForm.reset();

        this.contactSubmitting.set(false);
      },

      error: (error: any) => {

        this.contactError.set(
          error?.error?.message ||
          'Failed to send message.'
        );

        this.contactSubmitting.set(false);
      }
    });
  }

  submitTextMe(): void {

    if (
      !this.textMePhone.full ||
      !this.textMePhone.valid
    ) {

      this.textMeError.set(
        'Please enter a valid phone number.'
      );

      return;
    }

    this.textMeSubmitting.set(true);
    this.textMeError.set('');

    this.api.submitTextMe(
      this.textMePhone.full,
      ''
    ).subscribe({

      next: () => {

        this.textMeSuccess.set(
          'Our team will contact you shortly.'
        );

        this.textMeSubmitting.set(false);
      },

      error: (error: any) => {

        this.textMeError.set(
          error?.error?.message ||
          'Request failed.'
        );

        this.textMeSubmitting.set(false);
      }
    });
  }
}
