import { SeoService } from '../../core/services/seo.service';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../core/services/country.service';
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

  testimonials = signal<any[]>([]);
  testiIndex   = signal(0);
  testiLeaving = signal(false);
  private testiTimer: any;
  private stepTimer:  any;
  private scrollFn:   any;

  stats = [
    { value: '5,000+', label: 'Students Helped',  icon: '🎓' },
    { value: '99.1%',  label: 'Success Rate',      icon: '✅' },
    { value: '150+',   label: 'Expert Tutors',     icon: '✍️' },
    { value: '4.9/5',  label: 'Student Rating',    icon: '⭐' },
  ];

  successHighlights = [
    { pct: '99.1%', label: 'Success Rate',         sub: 'B or better in 5,000+ classes over 3 years',          color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
    { pct: '4.9/5', label: 'Student Rating',        sub: 'Rated by verified students across all subjects',       color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    { pct: '98%',   label: 'On-Time Delivery',      sub: 'Work delivered before every deadline, every class',    color: '#1e40af', bg: '#eff6ff', border: '#dbeafe' },
    { pct: '24hrs', label: 'Quote Response',         sub: 'Custom plan sent within 24 hours of submission',      color: '#7c3aed', bg: '#f5f3ff', border: '#e9d5ff' },
  ];

  services = [
    { icon: '📚', title: 'Full Online Class',        tag: 'Most Popular', color: '#1e40af', desc: 'Complete class management — quizzes, discussions, projects and exams from start to final grade.' },
    { icon: '📝', title: 'Essays & Research Papers', tag: 'High Demand',  color: '#0d9488', desc: 'APA, MLA, Chicago — research papers, essays and reports written to your exact rubric.' },
    { icon: '💻', title: 'Programming & CS',         tag: 'Tech',         color: '#7c3aed', desc: 'Python, Java, JavaScript, SQL — all coding labs, projects and assignments completed and tested.' },
    { icon: '📊', title: 'Statistics & Data',        tag: 'STEM',         color: '#0891b2', desc: 'SPSS, R, Excel — from raw data to professional interpretation with full methodology.' },
    { icon: '🏦', title: 'Business & MBA',           tag: 'Executive',    color: '#b45309', desc: 'Case studies, business plans, strategy reports and financial modeling by MBA specialists.' },
    { icon: '⚖️', title: 'Law & Social Sciences',   tag: 'Specialized',  color: '#be185d', desc: 'Legal briefs, psychology, sociology and criminology coursework — citation-perfect.' },
  ];

  lmsList = [
    { name: 'Canvas',      icon: '🎨', desc: 'Full navigation, quizzes, discussions' },
    { name: 'Blackboard',  icon: '📋', desc: 'Assignments, tests, grade tracking' },
    { name: 'Moodle',      icon: '🔧', desc: 'Course modules, forums, activities' },
    { name: 'D2L Brightspace', icon: '💡', desc: 'Quizzes, dropbox, discussions' },
    { name: 'Coursera',    icon: '🌐', desc: 'Video courses, peer assessments' },
    { name: 'edX',         icon: '🎓', desc: 'University-grade online courses' },
    { name: 'McGraw-Hill', icon: '📖', desc: 'Connect, SmartBook assignments' },
    { name: 'Pearson',     icon: '🔬', desc: 'MyLab, Mastering platforms' },
  ];

  howSteps = [
    { num: '01', icon: '📋', title: 'Submit Class Details',   desc: 'Share your course, institution, portal URL, and class dates. Free — zero commitment.', badge: '3 minutes', color: '#1e40af' },
    { num: '02', icon: '💰', title: 'Receive Custom Plan',    desc: 'Admin reviews your workload and sends a personalized payment plan for your approval.', badge: '24 hours',  color: '#0d9488' },
    { num: '03', icon: '✍️', title: 'Expert Takes Over',     desc: 'Your verified expert logs into your portal and handles all tasks throughout the class.', badge: 'Instantly', color: '#7c3aed' },
    { num: '04', icon: '📦', title: 'Download Your Work',    desc: 'Work is reviewed, packaged, and available in your secure dashboard before every deadline.', badge: 'On time',  color: '#b45309' },
  ];

  subjectAreas = [
    { name: 'Nursing & Healthcare',  icon: '🏥', count: '320+ classes' },
    { name: 'Computer Science',      icon: '💻', count: '410+ classes' },
    { name: 'Business & MBA',        icon: '📈', count: '280+ classes' },
    { name: 'Mathematics',           icon: '🔢', count: '190+ classes' },
    { name: 'Psychology',            icon: '🧠', count: '150+ classes' },
    { name: 'Engineering',           icon: '⚙️', count: '220+ classes' },
    { name: 'Law & Criminal Justice',icon: '⚖️', count: '130+ classes' },
    { name: 'English & Literature',  icon: '📖', count: '160+ classes' },
    { name: 'Biology & Chemistry',   icon: '🔬', count: '175+ classes' },
    { name: 'Data Science & AI',     icon: '🤖', count: '240+ classes' },
    { name: 'Finance & Accounting',  icon: '💳', count: '195+ classes' },
    { name: 'History & Philosophy',  icon: '🏛️', count: '110+ classes' },
  ];

  whyItems = [
    { icon: '🔒', title: '100% Confidential',       desc: 'Your identity and credentials are encrypted. Writers never know who you are.' },
    { icon: '✅', title: 'Verified Expert Writers',  desc: 'Every tutor passes a subject-matter test and background check before handling any class.' },
    { icon: '💳', title: 'Pay-As-You-Go Plans',      desc: 'Never pay everything upfront. Installment plans released as work is delivered.' },
    { icon: '🔄', title: 'Unlimited Revisions',      desc: 'Not satisfied? Unlimited revisions within 7 days. We keep working until you approve.' },
    { icon: '🌍', title: '40+ Countries Supported',  desc: 'Canvas, Blackboard, Moodle, D2L, Coursera, edX and all major LMS platforms.' },
    { icon: '📞', title: '24/7 Live Support',         desc: 'Real humans answer every message. WhatsApp response under 5 minutes.' },
  ];
  pricingTiers = [
    { label: 'Standard Courses',  range: '$42 – $85 / week',  color: '#1e40af', desc: 'Covers the majority of undergraduate and graduate courses. Full class management from day one to final grade.' },
    { label: 'Advanced Courses',  range: '$90 – $150 / week', color: '#0d9488', desc: 'Specialized subjects such as Advanced Statistics, Supply Chain, US Tax Law, or Engineering require deeper expertise.' },
    { label: 'Budget Subjects',   range: '$42 – $65 / week',  color: '#b45309', desc: 'Math, Physics, Chemistry (non-lab) and Biology courses are often priced lower and billed by the week.' },
  ];

  universities = [
    { name: 'University of Phoenix' }, { name: 'University of Florida' }, { name: 'UMass Online' },
    { name: 'DeVry University' },       { name: 'Ashford University' },    { name: 'McGraw-Hill Connect' },
    { name: 'Concordia University' },   { name: 'Kaplan University' },     { name: 'American Intercontinental' },
    { name: 'Bethel University' },      { name: 'South University' },      { name: 'Strayer University' },
  ];

  subjectCategories = [
    { icon: '📐', title: 'Mathematics', desc: 'From calculus to quantitative analysis — CPM, Pearson MyMathLab, McGraw-Hill Connect and university portal math courses handled by verified math specialists.' },
    { icon: '⚗️', title: 'Chemistry Classes', desc: 'General chemistry, organic chemistry, biochemistry — whether it is Aleks, OpenStax or any top university platform, our chemistry experts deliver top grades.' },
    { icon: '⚙️', title: 'Physics Classes', desc: 'Mechanics, electromagnetism, thermodynamics and more. We handle midterm tests, physics assignments and full online physics courses from US and UK universities.' },
    { icon: '🏥', title: 'Nursing Courses', desc: 'One of the most in-demand subjects we cover. Discussion posts, care plan papers, ATI quizzes, NCLEX prep, and weekly nursing course tasks — all managed for you.' },
    { icon: '📊', title: 'Business & Management', desc: 'MBA programmes, HRM, finance, strategy, marketing, law and accounting. University of Phoenix, Devry, Capella, Ashford and similar management degrees covered end-to-end.' },
    { icon: '💻', title: 'Computer Science', desc: 'Python, Java, JavaScript, SQL, data structures, algorithms, machine learning projects — all programming labs and CS assignments completed and tested before submission.' },
  ];


  faqs = [
    { q: 'Is it safe to pay someone to do my online class?',
      a: 'Yes. EduAssist uses 256-bit SSL encryption to protect all your data. Your portal credentials are only accessible to your assigned expert and our admin team. We never share your identity with writers, and all credentials are deleted after class completion. Thousands of students from the USA, UK, Canada and Australia trust us every semester.' },
    { q: 'How much does it cost to hire someone to take my online class?',
      a: 'Pricing starts from $42/week for standard coursework. The exact cost depends on subject complexity, number of credit hours, class duration, and workload intensity. Submit your class details and we\'ll send a transparent, itemized installment plan within 24 hours — zero obligation to proceed.' },
    { q: 'Can you do my online class for me on Canvas, Blackboard or Moodle?',
      a: 'Yes — we work with all major LMS platforms including Canvas, Blackboard, Moodle, D2L Brightspace, Coursera, edX, McGraw-Hill Connect, and Pearson MyLab. Our experts navigate any institutional portal and handle all coursework from day one.' },
    { q: 'What subjects can EduAssist handle for my online class?',
      a: 'We cover 50+ subjects including Nursing, Computer Science, Business & MBA, Mathematics, Statistics, Psychology, Law, Engineering, Data Science, Finance, English, Biology, Chemistry, History, and more. Each class is matched to a verified specialist in that exact field.' },
    { q: 'When will an expert be assigned to my class?',
      a: 'Once you approve the payment plan and confirm your first installment, your expert is assigned immediately — typically within a few hours. They log into your portal the same day and begin working on any pending assignments.' },
    { q: 'What if I am not happy with the delivered work?',
      a: 'We offer unlimited revisions within 7 days of each delivery. Our admin quality team reviews all work before it reaches you. If we fall short of the agreed grade standard, we keep working at no additional cost.' },
    { q: 'Do you guarantee grades?',
      a: 'We target A and B grades on all coursework. Our verified experts have a 99.1% success rate across 5,000+ completed classes. While no service can guarantee institutional grades with certainty, we revise any work that does not meet the agreed standard.' },
    { q: 'How do I pay? Is it safe?',
      a: 'All payments are processed securely through Stripe — the same payment system used by Amazon and Google. We never store your card details. You only pay after approving each installment plan, and each installment releases only after the corresponding work is delivered and admin-reviewed.' },
    { q: 'What if my class uses plagiarism detection like Turnitin?',
      a: 'All work is written from scratch by your subject expert — never copied or AI-generated without proper direction. We use the same plagiarism detection tools your institution uses to verify originality before delivery. Every submission is unique to your class and requirements.' },
    { q: 'Can I communicate with my assigned expert?',
      a: 'Yes. Through your student dashboard you can message your expert at any time. Our admin team monitors all communications to ensure quality, professionalism, and that your instructions are followed precisely.' },
  ];

  subjects = [
    'Pay To Take My Online Class', 'Do My Online Class For Me', 'Online Class Help', 'Take My Online Class',
    'Mathematics', 'Statistics', 'Python', 'Java', 'JavaScript', 'SQL', 'Data Science',
    'Machine Learning', 'Business Administration', 'MBA', 'Finance', 'Accounting', 'Marketing',
    'Biology', 'Chemistry', 'Nursing', 'Psychology', 'Sociology', 'History', 'Law', 'Economics',
  ];

  constructor(private seo: SeoService, 
    private fb:     FormBuilder,
    private api:    ApiService,
    private router: Router,
    public  cs:     CountryService,
    private http:   HttpClient
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
    this.textMeForm = this.fb.group({ agree: [true] });
  }

  ngOnInit() {
    this.seo.set({
      title: 'Pay Someone To Do My Online Class | EduPilotHelp — From $42/Week',
      description: 'Pay someone to do your online class starting from $42/week. Verified experts handle Canvas, Blackboard, Moodle — quizzes, assignments, exams & discussion posts. 99.1% success rate. 5,000+ classes completed. Free quote in 24 hours.',
      keywords: 'pay someone to do my online class, online class help, take my online class, pay someone to take my online class',
      canonical: '/'
    });
    this.setTestimonials();
    this.startTestiTimer();
    this.loadFeedbackFromApi();
    this.stepTimer = setInterval(() => this.activeStep.set((this.activeStep() + 1) % 4), 2800);
    this.scrollFn  = () => this.navScrolled.set(window.scrollY > 40);
    window.addEventListener('scroll', this.scrollFn, { passive: true });
  }

  ngOnDestroy() {
    this.stopTestiTimer();
    if (this.stepTimer) clearInterval(this.stepTimer);
    if (this.scrollFn)  window.removeEventListener('scroll', this.scrollFn);
  }

  setTestimonials() {
    this.testimonials.set([
      { rating: 5, text: 'I was working full-time and taking two online courses. EduAssist handled both — got A grades in both. The expert was always ahead of deadlines and the admin team was incredibly responsive throughout.', studentName: 'Marcus Thompson', course: 'MBA — Operations Management', location: 'Texas, USA', avatar: 'MT' },
      { rating: 5, text: 'My Java programming class was completely overwhelming. The expert completed every lab, passed all autograder tests and left comments in the code so I could follow along. Genuinely incredible service.', studentName: 'Sarah Mitchell', course: 'Computer Science — Java Programming', location: 'California, USA', avatar: 'SM', alt: true },
      { rating: 5, text: 'As an international student juggling work and family, I needed help with my nursing coursework. EduAssist handled every discussion post and written paper. Delivered before every single deadline.', studentName: 'Jessica Williams', course: 'Nursing — Healthcare Management', location: 'Florida, USA', avatar: 'JW' },
      { rating: 5, text: 'The pay-as-you-go installment plan made it genuinely affordable. I only paid after each week was delivered and reviewed. Completely transparent process from start to finish — highly recommended.', studentName: 'James Richardson', course: 'Business Law — Contract Law', location: 'New York, USA', avatar: 'JR', alt: true },
      { rating: 5, text: 'I was skeptical at first but the process was completely transparent from day one. Got my custom plan the next morning and my expert started same day. Every assignment delivered with days to spare.', studentName: 'Emily Watson', course: 'Statistics — Applied Regression', location: 'Ohio, USA', avatar: 'EW' },
      { rating: 5, text: 'Used EduAssist for a full 16-week MBA course. Weekly case studies, two major research papers, a group project and the final exam — everything came back A-grade. Worth every single cent.', studentName: 'Daniel Morrison', course: 'MBA — Strategic Management', location: 'Georgia, USA', avatar: 'DM', alt: true },
    ]);
  }

  private loadFeedbackFromApi() {
    this.http.get<any[]>(`${environment.apiUrl}/public/feedback`).subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          this.testimonials.set(items.map(f => ({
            rating: f.rating,
            text: f.feedbackText,
            studentName: f.studentName,
            course: f.course,
            location: f.location || '',
            avatar: f.avatar || (f.studentName?.slice(0, 2).toUpperCase()),
            alt: false
          })));
        }
      },
      error: () => {} // keep static fallback
    });
  }

  testiGroups(): any[][] {
    const all = this.testimonials();
    const groups: any[][] = [];
    for (let i = 0; i < all.length; i += 3) groups.push(all.slice(i, i + 3));
    return groups;
  }
  nextTesti() {
    const t = this.testiGroups().length;
    if (t <= 1) return;
    this.testiLeaving.set(true);
    setTimeout(() => { this.testiIndex.set((this.testiIndex() + 1) % t); this.testiLeaving.set(false); }, 380);
  }
  prevTesti() {
    const t = this.testiGroups().length;
    if (t <= 1) return;
    this.testiLeaving.set(true);
    setTimeout(() => { this.testiIndex.set((this.testiIndex() - 1 + t) % t); this.testiLeaving.set(false); }, 380);
  }
  goToTesti(i: number) {
    if (i === this.testiIndex()) return;
    this.testiLeaving.set(true);
    setTimeout(() => { this.testiIndex.set(i); this.testiLeaving.set(false); }, 380);
  }
  startTestiTimer() { this.testiTimer = setInterval(() => this.nextTesti(), 6000); }
  stopTestiTimer()  { if (this.testiTimer) clearInterval(this.testiTimer); }

  submitQuery() {
    this.queryForm.markAllAsTouched();
    if (this.queryForm.invalid) return;
    this.querySubmitting.set(true); this.queryError.set('');
    this.api.submitQuery({ ...this.queryForm.value, phone: this.queryPhone.full }).subscribe({
      next: (res: any) => { this.querySuccess.set(res.message || 'Request received! Check email for credentials.'); this.queryForm.reset(); this.querySubmitting.set(false); },
      error: (err: any) => { this.queryError.set(err.error?.message || 'Submission failed. Please try again.'); this.querySubmitting.set(false); }
    });
  }

  submitContact() {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) return;
    this.contactSubmitting.set(true);
    this.api.submitContact({ ...this.contactForm.value, phone: this.contactPhone.full }).subscribe({
      next: (res: any) => { this.contactSuccess.set(res.message || 'Message received!'); this.contactForm.reset(); this.contactSubmitting.set(false); },
      error: (err: any) => { this.contactError.set(err.error?.message || 'Failed. Please email us directly.'); this.contactSubmitting.set(false); }
    });
  }

  submitTextMe() {
    if (!this.textMePhone.full || !this.textMePhone.valid) { this.textMeError.set('Please enter a valid number.'); return; }
    this.textMeSubmitting.set(true); this.textMeError.set('');
    this.api.submitTextMe(this.textMePhone.full, '').subscribe({
      next: () => { this.textMeSuccess.set('Our team will WhatsApp you within 5 minutes!'); this.textMeSubmitting.set(false); },
      error: (err: any) => { this.textMeError.set(err.error?.message || 'Failed. Please try again.'); this.textMeSubmitting.set(false); }
    });
  }

  scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); this.mobileMenuOpen.set(false); }
  goToLogin()           { this.router.navigate(['/login']); }
  goToRegister()        { this.router.navigate(['/register']); }
  toggleFaq(i: number)  { this.activeFaq.set(this.activeFaq() === i ? -1 : i); }
}
