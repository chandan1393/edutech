import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="bd-page">
  <div class="bd-loading" *ngIf="loading()"><div class="spinner"></div></div>

  <ng-container *ngIf="!loading() && post()">
    <div class="bd-hero">
      <div class="wrap-mid">
        <a routerLink="/blog" class="back-link">← Back to Blog</a>
        <div class="bd-cat">{{ post().category || 'Online Class Help' }}</div>
        <h1>{{ post().title }}</h1>
        <div class="bd-meta">
          <span>✍️ {{ post().author || 'EduAssist Team' }}</span>
          <span>⏱ {{ post().readTimeMinutes || 5 }} min read</span>
          <span>📅 {{ formatDate(post().createdAt) }}</span>
        </div>
      </div>
    </div>
    <div class="bd-body">
      <div class="wrap-mid">
        <div class="bd-content" [innerHTML]="post().content"></div>
        <div class="bd-cta">
          <h3>Need Help With Your Online Class?</h3>
          <p>Our verified experts handle everything from quizzes to exams. Get a free custom quote in 24 hours.</p>
          <a routerLink="/" class="cta-btn">Get a Free Quote</a>
        </div>
      </div>
    </div>
  </ng-container>

  <div class="not-found" *ngIf="!loading() && !post()">
    <h2>Article not found</h2>
    <a routerLink="/blog">Back to Blog</a>
  </div>
</div>
  `,
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  post    = signal<any>(null);
  loading = signal(true);

  private staticPosts: Record<string, any> = {
    'pay-someone-take-online-class-safe': {
      title: 'Pay Someone To Take My Online Class: Is It Safe And Worth It?',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 7,
      createdAt: '2024-10-15T00:00:00',
      content: this.buildContent([
        ['h2', 'What Does Paying Someone To Take My Online Class Mean?'],
        ['p', 'When students search for someone to take their online class, they are looking for a qualified academic expert who can log into their LMS and handle all coursework including quizzes, assignments, discussion posts, exams, and overall grade management.'],
        ['h2', 'Is It Safe?'],
        ['p', 'Safety depends entirely on the provider. EduAssist uses 256-bit SSL encryption. Your credentials are only accessible to your assigned expert and the admin quality team. We never share your identity with writers and delete all credentials after class completion.'],
        ['h2', 'How Much Does It Cost?'],
        ['p', 'Pricing starts from $42 per week for standard coursework. Always look for transparent pricing and installment plans. Never pay everything upfront before seeing any work delivered.'],
        ['h2', 'What To Look For'],
        ['ul', ['Verified subject-matter experts with proven credentials', 'Pay-as-you-go installment plans', 'Admin quality review before deliveries', '256-bit SSL encryption and confidentiality guarantees', 'Unlimited revisions policy', '24/7 customer support with fast response times']],
        ['h2', 'Conclusion'],
        ['p', 'Paying someone to take your online class is a practical solution for students managing work, family, and academic commitments simultaneously. The key is choosing a verified, secure, and transparent service that prioritizes your results and privacy.'],
      ])
    },
    'how-to-do-well-in-online-classes': {
      title: 'How To Do Well In Online Classes: 10 Proven Strategies',
      category: 'Study Tips', author: 'EduAssist Team', readTimeMinutes: 8,
      createdAt: '2024-10-10T00:00:00',
      content: this.buildContent([
        ['h2', 'Why Online Classes Are Challenging'],
        ['p', 'Online classes require significantly more self-discipline than traditional in-person courses. Without the structure of scheduled classroom attendance, many students struggle with time management, motivation, and staying on top of multiple assignments simultaneously.'],
        ['h2', '1. Create a Dedicated Study Schedule'],
        ['p', 'Treat your online class like a physical class. Block out specific hours each week dedicated exclusively to coursework. Consistency is the single most powerful predictor of success in online education.'],
        ['h2', '2. Engage Actively in Discussion Forums'],
        ['p', 'Participation in discussion boards is often graded. Log in at least three times per week to post original responses and reply meaningfully to at least two classmates. Quality responses always earn more points than brief acknowledgments.'],
        ['h2', '3. Read Every Syllabus Carefully'],
        ['p', 'The syllabus contains your roadmap for the entire semester. Note every deadline, grading weight, and professor expectation before the first week ends. Missing a major assignment because you did not read the syllabus is one of the most avoidable academic mistakes.'],
        ['h2', '4. Use the LMS Dashboard Every Day'],
        ['p', 'Log into Canvas, Blackboard, or whatever LMS your institution uses every single day. Professors post announcements, grade updates, and new assignments that are easy to miss if you check infrequently.'],
        ['h2', '5. Reach Out For Help Early'],
        ['p', 'If you fall behind or find coursework overwhelming, act immediately. Whether that means emailing your professor, visiting a tutoring center, or exploring professional academic support services, waiting until the last week never ends well.'],
      ])
    },
    'can-you-pay-someone-do-your-online-class': {
      title: 'Can You Pay Someone To Do Your Online Class? Everything You Need To Know',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 6,
      createdAt: '2024-10-05T00:00:00',
      content: this.buildContent([
        ['h2', 'The Short Answer'],
        ['p', 'Yes. Thousands of students across the USA, UK, Canada and Australia hire qualified academic experts to handle their online classes every semester. The practice is far more widespread than most people realize, particularly among working adults, parents, and students juggling multiple courses simultaneously.'],
        ['h2', 'How The Process Works'],
        ['p', 'You submit your class details including institution name, portal URL, class dates, and subject area. The service assigns a verified expert in your field who logs into your LMS and handles all coursework according to your requirements. Work is reviewed by an admin quality team before each deliverable is packaged for you.'],
        ['h2', 'How Much Does It Cost?'],
        ['p', 'Pricing typically ranges from $42 to $120 or more per week depending on subject complexity, credit hours, and workload intensity. Reputable services offer installment plans so you only pay as work is completed and approved, never everything upfront.'],
        ['h2', 'Is It Worth It?'],
        ['p', 'For students balancing full-time work, caregiving responsibilities, or multiple challenging courses simultaneously, the return on investment is often significant. Maintaining a strong GPA while managing real-world commitments has measurable career impact that far exceeds the cost of professional support.'],
      ])
    },
    'best-online-class-help-services-usa-2024': {
      title: 'Best Online Class Help Services in USA 2024: A Complete Guide',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 6,
      createdAt: '2024-09-28T00:00:00',
      content: this.buildContent([
        ['h2', 'What To Look For In An Online Class Help Service'],
        ['p', 'With hundreds of services claiming to offer online class assistance, knowing what separates legitimate providers from low-quality ones is essential. The five factors that matter most are: expert verification, payment structure, communication quality, confidentiality practices, and revision policies.'],
        ['h2', 'Top Criteria We Evaluated'],
        ['ul', ['Expert verification process', 'Payment security via Stripe or equivalent', 'Installment plan availability', 'Admin quality review before delivery', 'SSL encryption and data deletion policies', 'Response time and support channel availability']],
        ['h2', 'EduAssist'],
        ['p', 'EduAssist stands out for its verified experts, transparent installment pricing starting from $42 per week, admin quality review on every deliverable, and 256-bit SSL encryption. Students receive login credentials immediately after submitting their class details.'],
        ['h2', 'What Red Flags To Avoid'],
        ['p', 'Avoid any service that demands full payment upfront, offers suspiciously low prices, has no verifiable reviews, or asks you to pay via cryptocurrency exclusively. Legitimate services always offer Stripe-secured installment plans with grade guarantees.'],
      ])
    },
    'top-lms-platforms-online-classes': {
      title: 'Top LMS Platforms For Online Classes: Canvas vs Blackboard vs Moodle',
      category: 'Subject Guides', author: 'EduAssist Team', readTimeMinutes: 5,
      createdAt: '2024-09-20T00:00:00',
      content: this.buildContent([
        ['h2', 'What Is An LMS?'],
        ['p', 'A Learning Management System (LMS) is the platform your institution uses to host online courses. Understanding your LMS is the first step to succeeding in any online class.'],
        ['h2', 'Canvas'],
        ['p', 'Canvas is widely used by US universities and known for its clean interface. It features modules, quizzes with auto-grading, discussion boards, SpeedGrader, and integrated video tools. Most professors post all assignments inside Modules.'],
        ['h2', 'Blackboard Learn'],
        ['p', 'Blackboard is one of the oldest LMS platforms and is common in large public universities. All coursework, grade tracking, and communication tools are accessible from the main menu.'],
        ['h2', 'Moodle'],
        ['p', 'Moodle is open-source and highly customizable. Many community colleges and international institutions use it. Assignments, quizzes, forums, and resources are organized by week or topic blocks.'],
        ['h2', 'D2L Brightspace'],
        ['p', 'D2L Brightspace is gaining popularity for its adaptive learning features. The layout is intuitive and the mobile app is excellent for checking grades and announcements on the go.'],
        ['h2', 'Which LMS Do EduAssist Experts Support?'],
        ['p', 'EduAssist experts are trained on all major LMS platforms including Canvas, Blackboard, Moodle, D2L Brightspace, Coursera, edX, McGraw-Hill Connect, and Pearson MyLab. Whatever platform your institution uses, we navigate it flawlessly.'],
      ])
    },
    'how-to-choose-reliable-online-class-help': {
      title: 'How To Choose A Reliable Online Class Help Service in 2024',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 5,
      createdAt: '2024-09-15T00:00:00',
      content: this.buildContent([
        ['h2', 'Why Choosing The Right Service Matters'],
        ['p', 'Not all online class help services are created equal. Some use unverified freelancers, others demand full upfront payment, and a small number are outright scams. Knowing the right questions to ask before you commit can save you significant money and academic stress.'],
        ['h2', '5 Questions To Ask Any Online Class Help Service'],
        ['ul', ['How do you verify the qualifications of your expert tutors?', 'Do you offer pay-as-you-go installment plans?', 'What encryption do you use to protect my portal credentials?', 'Is there an admin quality review before I receive deliverables?', 'What is your revision and grade guarantee policy?']],
        ['h2', 'Payment Structure Is The Most Important Signal'],
        ['p', 'The payment structure reveals everything about a service. Any legitimate service will offer installment plans tied to deliverables. If a service asks for full payment upfront with no ability to review work before the next payment, walk away immediately.'],
        ['h2', 'Check For Real Reviews'],
        ['p', 'Look for verified reviews on independent platforms, not just testimonials on the company website. Pay attention to specifics: subject areas, turnaround times, grade outcomes, and support responsiveness. Generic five-star reviews with no details are a red flag.'],
      ])
    }
  };

  private buildContent(blocks: [string, string | string[]][]): string {
    return blocks.map(([tag, val]) => {
      if (tag === 'ul' && Array.isArray(val)) {
        const items = (val as string[]).map(i => `<li>${i}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<${tag}>${val}</${tag}>`;
    }).join('');
  }

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';

    // Show static fallback immediately
    if (this.staticPosts[slug]) {
      this.post.set({ ...this.staticPosts[slug], slug });
      this.loading.set(false);
    }

    // Try API for fresh content
    if (slug) {
      this.http.get<any>(`${environment.apiUrl}/public/blogs/${slug}`).subscribe({
        next: (p) => { this.post.set(p); this.loading.set(false); },
        error: () => { this.loading.set(false); }
      });
    } else {
      this.loading.set(false);
    }
  }

  formatDate(d: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
